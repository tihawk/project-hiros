import React, { Component } from 'react'
import socketIOClient from 'socket.io-client'
import { withTranslation } from 'react-i18next'
import update from 'immutability-helper'
import classes from './Battlefield.module.css'
import InfoPanel from './InfoPanel'
import CombatFooter from './CombatFooter'
import CombatDashboard from './CombatDashboard'
import SpriteController from '../Sprite/SpriteController'
import { whichCornerOfHex } from '../../utility/utility'
import * as helper from './utility'
import '../../App.css'
import CreatureInfo from './CreatureInfo'

class Battlefield extends Component {
  state = {
    endpoint: 'http://localhost:5000',
    turn: {
      player: null
    },
    loading: {
      isLoading: true,
      message: 'ClickReady'
    },
    inAction: false,
    creatureHoveredOver: {},
    combatDashboardMessages: [],
    combatFooterMessage: '',
    nickname: String(Math.random())
  }

  constructor () {
    super()
    this.onFinish = this.onFinish.bind(this)
  }

  componentDidMount () {
    const { endpoint } = this.state
    this.socket = socketIOClient(endpoint, {
      transportOptions: {
        polling: {
          extraHeaders: {
            'x-clientid': this.state.nickname
          }
        }
      }
    })
    this.socket.on('state', data => {
      this.setState({ ...data })
      const newMessage = 'Round ' + this.state.turn.roundNum + ', Turn ' + this.state.turn.turnNum
      this.setState({
        combatDashboardMessages: this.state.combatDashboardMessages.concat(newMessage)
      })
    })
    this.socket.on('actions', actionChain => {
      if (actionChain.length > 0) {
        this.setState({ inAction: true })
        this.handleActions(actionChain)
      }
    })
    window.addEventListener('beforeunload', e => {
      e.preventDefault()
      this.playerDisconnect()
    })
  }

  playerReady = () => {
    console.log('clicked player ready')
    this.socket.emit('player-ready')
  }

  playerDisconnect = () => {
    console.log('clicked player disconnect')
    this.socket.emit('player-disconnect')
  }

  showCreatureInfo = (creature) => {
    if (creature) {
      let infoPanel
      if (creature.player === this.state.players[0]) {
        infoPanel = document.getElementById(this.state.players[0])
      } else {
        infoPanel = document.getElementById(this.state.players[1])
      }
      this.setState({ creatureHoveredOver: { ...creature } })
      infoPanel.style.visibility = 'visible'
    }
  }

  hideCreatureInfo = () => {
    let infoPanel = document.getElementById(this.state.players[0])
    infoPanel.style.visibility = 'hidden'
    infoPanel = document.getElementById(this.state.players[1])
    infoPanel.style.visibility = 'hidden'
  }

  handleTileClicked = (e, tileIndex) => {
    if (this.state.turn.player === this.state.nickname) {
      const corner = whichCornerOfHex(e)
      this.socket.emit('click', { tileIndex, corner })
    }
  }

  handleTileHover = (e, hexIndex, { hasCreature, creature, x, y }) => {
    const { style } = e.target

    if (this.state.turn.player === this.state.nickname) {
      const { range } = this.state.turn.creature
      const inRange = range.includes(hexIndex)
      const corner = whichCornerOfHex(e)
      const indexOfNeighbour = helper.getNeighbourIndex(this.state.board, hexIndex, corner)
      const neighbourInRange = range.includes(indexOfNeighbour)

      if (hasCreature) {
        if (helper.isTileWithEnemyAndNeighbourInRangeAndNeighbourEmptyOrOfActiveCreature(
          creature, this.state.turn, neighbourInRange, this.state.board[indexOfNeighbour], indexOfNeighbour
        )) {
          const corner = whichCornerOfHex(e)
          style.cursor = `${corner}-resize`
          this.setState({ combatFooterMessage: 'Attack ' + creature.name })
        } else {
          style.cursor = 'not-allowed'
          this.setState({ combatFooterMessage: '' })
        }
      } else if (inRange) {
        style.cursor = 'pointer'
        this.setState({ combatFooterMessage: 'Move ' + this.state.board[this.state.turn.creature.tileIndex].creature.name + ' here' })
      } else {
        style.cursor = 'not-allowed'
        this.setState({ combatFooterMessage: '' })
      }
    } else {
      style.cursor = 'not-allowed'
      this.setState({ combatFooterMessage: '' })
    }
  }

  async handleWalking (action) {
    console.log('animating')
    const { time, type, orientation, indexOfTileToMoveTo } = action
    const indexOfTileFrom = this.state.turn.creature.tileIndex

    let board = this.state.board
    board = update(board, { [indexOfTileFrom]: { creature: { action: { $set: type } } } })
    board = update(board, { [indexOfTileFrom]: { creature: { orientation: { $set: orientation } } } })
    this.setState({ board })

    const tileToElement = document.getElementById(indexOfTileToMoveTo)
    const tileFromElement = document.getElementById(indexOfTileFrom)
    const spriteToMoveElement = tileFromElement.lastChild
    const distanceX = tileToElement.getBoundingClientRect().left - tileFromElement.getBoundingClientRect().left
    const distanceY = tileToElement.getBoundingClientRect().top - tileFromElement.getBoundingClientRect().top

    const keyFrames = [
      { left: '0', top: '0' },
      { left: distanceX + 'px', top: distanceY + 'px' }
    ]

    const animation = spriteToMoveElement.animate(keyFrames, time)

    const animationPromise = new Promise((resolve, reject) => {
      animation.onfinish = (finished) => {
        let board = this.state.board
        const creature = board[indexOfTileFrom].creature || board[indexOfTileToMoveTo].creature
        creature.action = 'idle'
        creature.orientation = creature.originalOrientation
        board = update(board, { [indexOfTileToMoveTo]: { hasCreature: { $set: true } } })
        board = update(board, { [indexOfTileToMoveTo]: { creature: { $set: creature } } })
        board = update(board, { [indexOfTileFrom]: { hasCreature: { $set: false } } })
        this.setState({ board })
        this.setState({
          turn: {
            ...this.state.turn,
            creature: {
              ...this.state.turn.creature,
              tileIndex: indexOfTileToMoveTo
            }
          }
        })

        // this.state.turn.creature.tileIndex = indexOfTileToMoveTo
        resolve(finished)
      }
      animation.oncancel = (cancelled) => {
        let board = this.state.board
        const creature = board[indexOfTileFrom].creature
        creature.action = 'idle'
        creature.orientation = creature.originalOrientation
        board = update(board, { [indexOfTileToMoveTo]: { hasCreature: { $set: true } } })
        board = update(board, { [indexOfTileToMoveTo]: { creature: { $set: creature } } })
        board = update(board, { [indexOfTileFrom]: { hasCreature: { $set: false } } })
        this.setState({ board })
        this.setState({
          turn: {
            ...this.state.turn,
            creature: {
              ...this.state.turn.creature,
              tileIndex: indexOfTileToMoveTo
            }
          }
        })

        // this.state.turn.creature.tileIndex = indexOfTileToMoveTo
        reject(cancelled)
      }
    })

    await animationPromise
  }

  onFinish () {
    this.forceUpdate()
  }

  async handleGenericAction (action) {
    const resetCreature = () => {
      console.log('trying to reset creature')
      if (action.type === 'dying') {
        let board = this.state.board
        const creatureOrCorpse = this.state.board[action.indexOfTileToMoveTo].hasCorpse ? 'corpse' : 'creature'
        board = update(board, { [action.indexOfTileToMoveTo]: { [creatureOrCorpse]: { action: { $set: 'dead' } } } })
        this.setState({ board })
        return
      }
      let board = this.state.board
      board = update(board, { [action.indexOfTileToMoveTo]: { creature: { action: { $set: 'idle' } } } })
      board = update(board, { [action.indexOfTileToMoveTo]: { creature: { orientation: { $set: board[action.indexOfTileToMoveTo].creature.originalOrientation } } } })
      this.setState({ board })
    }

    let board = this.state.board
    board = update(board, { [action.indexOfTileToMoveTo]: { creature: { action: { $set: action.type } } } })
    board = update(board, { [action.indexOfTileToMoveTo]: { creature: { orientation: { $set: action.orientation } } } })
    this.setState({ board })
    const animationPromise = new Promise((resolve, reject) => {
      let finishedOnTime = false
      try {
        setTimeout(() => {
          if (!finishedOnTime) {
            console.log('timeouting')
            board = this.state.board
            try {
              resetCreature()
              resolve()
            } catch {
              console.log('failed at resetting')
              this.socket.emit('completed-actions')
            }
          }
        }, action.time)

        this.onFinish = () => {
          finishedOnTime = true
          console.log('resolving')
          board = this.state.board
          try {
            resetCreature()
            resolve()
          } catch {
            console.log('trying to reset creature')
            this.socket.emit('completed-actions')
          }
        }
      } catch {
        console.log('failed onFinish')
        this.socket.emit('completed-actions')
      }
    })
    await animationPromise
  }

  handleActions (actionChain) {
    const dealWithActions = async () => {
      for (const action of actionChain) {
        console.log(action)
        if (action.type === 'walk') {
          await this.handleWalking(action)
        } else {
          console.log('attacking')
          await this.handleGenericAction(action)
        }
      }
    }

    dealWithActions().then(() => {
      this.setState({ inAction: false })
      this.socket.emit('completed-actions')
    })
  }

  handleWait = e => {
    e.preventDefault()
    console.log('[handleWait]')
    this.socket.emit('wait')
  }

  handleDefend = e => {
    e.preventDefault()
    console.log('[handleDefend]')
    this.socket.emit('defend')
  }

  checkTypeOfTile = (hexIndex) => {
    if (parseInt(this.state.turn.creature.tileIndex) === hexIndex) {
      return classes.active
    // } else if (this.state.board[hexIndex].hasCreature && this.state.board[hexIndex].creature.player === this.state.turn.player) {
    //   return classes.unsteppable
    } else if (this.state.turn.creature.range.includes(hexIndex)) {
      return classes.inRange
    }
  }

  render () {
    // const { t } = this.props
    const { board, creatureHoveredOver } = this.state

    const fieldClasses = [classes.field, this.state.inAction === true ? classes.inAction : null].join(' ')
    return (
      <div className={fieldClasses}>
        { this.state.loading.isLoading === true ? <InfoPanel message={this.state.loading.message} />
          : <div className="d-flex flex-row justify-content-between align-items-end">
            <CreatureInfo id={this.state.players[0]} creatureData={creatureHoveredOver} />
            <ul className={[classes.grid, classes.clear].join(' ')}>
              {board.map((hex, hexIndex) => {
                return (
                  <li key={hexIndex}>
                    <div
                      className={[
                        classes.hexagon,
                        this.checkTypeOfTile(hexIndex)
                      ].join(' ')}
                      onClick={(e) => this.handleTileClicked(e, hexIndex)}
                      onMouseMove={(e) => this.handleTileHover(e, hexIndex, hex)}
                      onMouseEnter={() => this.showCreatureInfo(hex.creature || null)}
                      onMouseLeave={this.hideCreatureInfo}
                      id={hexIndex}
                    >
                      {hex.hasCorpse
                        ? <SpriteController
                          creature={hex.corpse.name}
                          action={hex.corpse.action}
                          orientation={hex.corpse.orientation}
                          onFinish={this.onFinish}
                        />
                        : null}
                      {hex.hasCreature
                        ? <SpriteController
                          creature={hex.creature.name}
                          action={hex.creature.action}
                          orientation={hex.creature.orientation}
                          player={this.state.players.indexOf(hex.creature.player)}
                          stackSize={hex.creature.stackMultiplier}
                          onFinish={this.onFinish}
                        /> : null}
                    </div>
                  </li>
                )
              })}
            </ul>
            <CreatureInfo id={this.state.players[1]} creatureData={creatureHoveredOver} />
          </div>}
        <div>
          <CombatDashboard
            playerReady={this.playerReady}
            playerDisconnect={this.playerDisconnect}
            messages={this.state.combatDashboardMessages}
            notAllowedToAct={!(this.state.turn.player === this.state.nickname)}
            phase={this.state.phase}
            onWait={this.handleWait}
            onDefend={this.handleDefend}
          />
          <CombatFooter message={this.state.combatFooterMessage} />
        </div>
      </div>
    )
  }
}

export default withTranslation()(Battlefield)
