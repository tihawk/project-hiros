import React, { Component } from 'react'
import socket from '../../utility/socket'
import { connect } from 'react-redux'
import { withTranslation } from 'react-i18next'
import update from 'immutability-helper'
import classes from './Battlefield.module.css'
import InfoPanel from './InfoPanel'
import CombatFooter from './CombatFooter'
import CombatDashboard from './CombatDashboard'
import SpriteController from '../Sprite/SpriteController'
import { whichCornerOfHex } from '../../utility/utility'
import { getNeighbourIndex, isValidToAttack, getShootOrAttack } from './utility'
import '../../App.css'
import CreatureInfo from './CreatureInfo'
import cursors from './cursors'
import Modal from '../../components/Modal'
import Settings from './Settings'

class Battlefield extends Component {
  state = {
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
    showModal: false,
    showSettings: false
  }

  constructor () {
    super()
    this.onFinish = this.onFinish.bind(this)
  }

  componentDidMount () {
    if (!this.props.battleName) return this.props.history.replace('/')
    socket.on('state', data => {
      this.setState({ ...data })
      const newMessage = 'Round ' + this.state.turn.roundNum + ', Turn ' + this.state.turn.turnNum
      this.setState({
        combatDashboardMessages: this.state.combatDashboardMessages.concat(newMessage)
      })
    })
    socket.on('actions', actionChain => {
      if (actionChain.length > 0) {
        this.setState({ inAction: true })
        this.handleActions(actionChain)
      }
    })
    window.addEventListener('beforeunload', e => {
      e.preventDefault()
      this.playerDisconnect()
    })

    socket.emit('completed-actions', this.props.battleName)
  }

  playerReady = () => {
    console.log('clicked player ready')
    const { battleName } = this.props
    if (battleName) {
      socket.emit('join-battle', { battleName }, ack => {
        console.log(ack)
      })
    } else {
      return this.props.history.replace('/')
    }
  }

  openSettings = () => {
    this.setState({ showSettings: true })
  }

  closeSettings = e => {
    e.preventDefault()
    this.setState({ showSettings: false })
  }

  openModal = () => {
    this.setState({ showModal: true })
  }

  confirmModal = e => {
    e.preventDefault()
    this.setState({ showModal: false })
    this.isUnmounting = true
    return this.props.history.replace('/')
  }

  playerDisconnect = () => {
    const { battleName } = this.props
    console.log('clicked player disconnect')
    socket.emit('player-disconnect', battleName, ack => {
      console.log(ack)
      this.openModal()
    })
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
    const { battleName } = this.props
    console.log(this.props.player, this.state.turn.player, battleName)
    if (this.state.turn.player === this.props.player) {
      const corner = whichCornerOfHex(e)
      socket.emit('click', { tileIndex, corner, battle: battleName })
    }
  }

  handleTileHover = (e, hexIndex, { hasCreature, creature, x, y }) => {
    const { style } = e.target

    if (this.state.turn.player === this.props.player) {
      const { range } = this.state.turn.creature
      const { attackType, movementType } = this.state.board[this.state.turn.creature.tileIndex].creature
      const inRange = range.includes(hexIndex)
      const corner = whichCornerOfHex(e)
      const indexOfNeighbour = getNeighbourIndex(this.state.board, hexIndex, corner)
      const neighbourInRange = range.includes(indexOfNeighbour)

      if (hasCreature) {
        if (attackType === 'ranged') {
          const shootOrAttack = getShootOrAttack(creature, this.state.turn, this.state.board[this.state.turn.creature.tileIndex], { x, y })
          if (String(shootOrAttack).startsWith('shoot')) {
            style.cursor = cursors[shootOrAttack]
            this.setState({ combatFooterMessage: 'Shoot ' + creature.name })
          } else if (shootOrAttack === 'attack') {
            const corner = whichCornerOfHex(e)
            style.cursor = cursors[corner + 'attack']
            this.setState({ combatFooterMessage: 'Attack ' + creature.name })
          } else {
            style.cursor = cursors.notAllowed
            this.setState({ combatFooterMessage: '' })
          }
        } else {
          if (isValidToAttack(
            creature, this.state.turn, neighbourInRange, this.state.board[indexOfNeighbour], indexOfNeighbour
          )) {
            const corner = whichCornerOfHex(e)
            style.cursor = cursors[corner + 'attack']
            this.setState({ combatFooterMessage: 'Attack ' + creature.name })
          } else {
            style.cursor = cursors.notAllowed
            this.setState({ combatFooterMessage: '' })
          }
        }
      } else if (inRange) {
        style.cursor = cursors[movementType]
        this.setState({ combatFooterMessage: 'Move ' + this.state.board[this.state.turn.creature.tileIndex].creature.name + ' here' })
      } else {
        style.cursor = cursors.notAllowed
        this.setState({ combatFooterMessage: '' })
      }
    } else {
      style.cursor = cursors.notAllowed
      this.setState({ combatFooterMessage: '' })
    }
  }

  async handleWalking (actions) {
    console.log(actions)
    const resetCreature = (action) => {
      console.log('[handleWalking.onfinish] reached destination, resetting creature')
      const indexOfTileFrom = this.state.turn.creature.tileIndex
      const { indexOfTileToMoveTo } = action
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
    }

    console.log('[handleWalking]')
    const indexOfTileFrom = this.state.turn.creature.tileIndex
    const { type, orientation } = actions[0]

    let board = this.state.board
    board = update(board, { [indexOfTileFrom]: { creature: { action: { $set: type } } } })
    board = update(board, { [indexOfTileFrom]: { creature: { orientation: { $set: orientation } } } })
    this.setState({ board })

    const tileFromElement = document.getElementById(indexOfTileFrom)
    const spriteToMoveElement = tileFromElement.lastChild
    const keyFrames = [{ left: '0', top: '0' }]
    for (const action of actions) {
      const { indexOfTileToMoveTo } = action
      const tileToElement = document.getElementById(indexOfTileToMoveTo)
      const distanceX = tileToElement.getBoundingClientRect().left - tileFromElement.getBoundingClientRect().left
      const distanceY = tileToElement.getBoundingClientRect().top - tileFromElement.getBoundingClientRect().top

      keyFrames.push({ left: distanceX + 'px', top: distanceY + 'px' })
    }
    const totalTime = actions.reduce((totalTime, currEl) => {
      return totalTime + currEl.time
    }, 0)
    const animation = spriteToMoveElement.animate(keyFrames, totalTime)

    const animationPromise = new Promise((resolve, reject) => {
      animation.onfinish = (finished) => {
        resetCreature(actions[actions.length - 1])
        resolve(finished)
      }
      animation.oncancel = (cancelled) => {
        resetCreature(actions[actions.length - 1])
        reject(cancelled)
      }
    })
    await animationPromise
  }

  onFinish () {
    console.log('[onFinish(callback)] forcing update')
    this.forceUpdate()
  }

  async handleGenericAction (action) {
    const resetCreature = () => {
      console.log('[handleGenericAction.resetCreature] trying to reset creature')
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
            console.log('[handleGenericAction.timeOut] attemtping to reset creature')
            board = this.state.board
            try {
              resetCreature()
              resolve()
            } catch (e) {
              this.setState({ inAction: false })
              console.log('[handleGenericAction.timeOut]', e)
              socket.emit('completed-actions', this.props.battleName)
            }
          }
        }, action.time)

        this.onFinish = () => {
          finishedOnTime = true
          console.log('[handleGenericAction.onFinish] attemtping to reset creature')
          board = this.state.board
          try {
            resetCreature()
            resolve()
          } catch (e) {
            this.setState({ inAction: false })
            console.log('[handleGenericAction.onFinish]', e)
            socket.emit('completed-actions', this.props.battleName)
          }
        }
      } catch (e) {
        this.setState({ inAction: false })
        console.log('[handleGenericAction.onFinish]', e)
        socket.emit('completed-actions', this.props.battleName)
      }
    })
    await animationPromise
  }

  handleActions (actionChain) {
    const dealWithActions = async () => {
      const walkingActions = actionChain.filter(el => el.type === 'walk')
      if (walkingActions.length > 0) {
        await this.handleWalking(walkingActions)
      }
      const nonWalkingActions = actionChain.filter(el => el.type !== 'walk')
      for (const action of nonWalkingActions) {
        await this.handleGenericAction(action)
      }
    }

    dealWithActions().then(() => {
      console.log('[dealWithActions] successfully finished action sequence')
      this.setState({ inAction: false })
      socket.emit('completed-actions', this.props.battleName)
    })
  }

  handleWait = e => {
    e.preventDefault()
    console.log('[handleWait]')
    const { battleName } = this.props
    console.log(this.props.player, this.state.turn.player, battleName)
    socket.emit('wait', battleName)
  }

  handleDefend = e => {
    e.preventDefault()
    console.log('[handleDefend]')
    const { battleName } = this.props
    console.log(this.props.player, this.state.turn.player, battleName)
    socket.emit('defend', battleName)
  }

  checkTypeOfTile = (hexIndex) => {
    if (parseInt(this.state.turn.creature.tileIndex) === hexIndex) {
      return classes.active
    } else if (this.state.turn.creature.range.includes(hexIndex)) {
      return classes.inRange
    }
  }

  componentWillUnmount () {
    socket.off('actions')
    socket.off('state')
  }

  render () {
    // const { t } = this.props
    const { board, creatureHoveredOver, showModal, showSettings } = this.state

    const fieldClasses = [classes.field, this.state.inAction === true ? classes.inAction : null].join(' ')
    return (
      <>
        {showModal && <Modal show={showModal} onClose={this.confirmModal} >
          <span>You've surrendered</span>
        </Modal>}
        {showSettings && <Settings show={showSettings} onClose={this.closeSettings} />}
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
              settings={this.openSettings}
              playerDisconnect={this.playerDisconnect}
              messages={this.state.combatDashboardMessages}
              notAllowedToAct={!(this.state.turn.player === this.props.player)}
              phase={this.state.phase}
              onWait={this.handleWait}
              onDefend={this.handleDefend}
            />
            <CombatFooter message={this.state.combatFooterMessage} />
          </div>
        </div>
      </>
    )
  }
}

const mapStateToProps = state => {
  return {
    player: state.player.player,
    battleName: state.battle.battleAddress
  }
}

export default connect(mapStateToProps)(withTranslation()(Battlefield))
