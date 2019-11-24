import React, { Component } from 'react'
import socketIOClient from 'socket.io-client'
import { withTranslation } from 'react-i18next'
import classes from './Battlefield.module.css'
import InfoPanel from './InfoPanel'
import CombatFooter from './CombatFooter'
import CombatDashboard from './CombatDashboard'
import SpriteController from '../Sprite/SpriteController'
import { whichCornerOfHex } from '../../utility/utility'

class Battlefield extends Component {
  state = {
    endpoint: 'http://localhost:5000',
    loading: {
      isLoading: true,
      message: 'ClickReady'
    },
    action: {
      inAction: false,
      time: null,
      type: null
    }
  }

  componentDidMount () {
    const { endpoint } = this.state
    this.socket = socketIOClient(endpoint)
    this.socket.on('state', data => {
      this.setState({ ...data })
    })
    this.socket.on('action', action => {
      this.setState({ action })
      if (action.inAction === true) {
        this.handleActions(action)
      }
    })
    window.addEventListener('beforeunload', e => {
      e.preventDefault()
      this.playerDisconnect()
    })
  }

  componentDidUpdate () {

  }

  playerReady = () => {
    console.log('clicked player ready')
    this.socket.emit('player-ready')
  }

  playerDisconnect = () => {
    console.log('clicked player disconnect')
    this.socket.emit('player-disconnect')
  }

  handleTileClicked = (e, tileIndex) => {
    if (this.state.turn.player === this.socket.id) {
      const corner = whichCornerOfHex(e)
      this.socket.emit('click', { tileIndex, corner })
    }
  }

  handleTileHover = (e, hexIndex, { hasCreature, creature, x, y }) => {
    const { style } = e.target
    if (this.state.turn.player === this.socket.id) {
      const { range } = this.state.turn.creature
      const inRange = range.includes(hexIndex)

      if (inRange) {
        if (hasCreature) {
          if (creature.player !== this.state.turn.player) {
            const corner = whichCornerOfHex(e)
            style.cursor = `${corner}-resize`
          } else {
            style.cursor = 'not-allowed'
          }
        } else if (!hasCreature) {
          style.cursor = 'pointer'
        }
      } else if (!inRange) {
        style.cursor = 'not-allowed'
      }
    } else {
      style.cursor = 'not-allowed'
    }
  }

  handleActions = (action) => {
    // console.log('[handleMovement] called, checking if is to animate')
    if (action.inAction) {
      if (action.indexOfTileToMoveTo !== null && action.type === 'walk') {
        console.log('animating')
        const tileToElement = document.getElementById(action.indexOfTileToMoveTo)
        const tileFromElement = document.getElementById(this.state.turn.creature.tileIndex)
        const spriteToMoveElement = tileFromElement.firstChild
        const distanceX = tileToElement.getBoundingClientRect().left - tileFromElement.getBoundingClientRect().left
        const distanceY = tileToElement.getBoundingClientRect().top - tileFromElement.getBoundingClientRect().top

        const keyFrames = [
          { left: '0', top: '0' },
          { left: distanceX + 'px', top: distanceY + 'px' }
        ]
        spriteToMoveElement.animate(keyFrames, action.time)
      }
    }
  }

  render () {
    // const { t } = this.props
    const { board } = this.state

    const fieldClasses = [classes.field, this.state.action.inAction ? classes.inAction : null].join(' ')
    return (
      <div className={fieldClasses}>
        <ul className={[classes.grid, classes.clear].join(' ')}>
          { this.state.loading.isLoading === true ? <InfoPanel message={this.state.loading.message} /> : board.map((hex, hexIndex) => {
            return (
              <li key={hexIndex}>
                <div
                  className={[classes.hexagon, this.state.turn.creature.range.includes(hexIndex) ? classes.inRange : 'hi'].join(' ')}
                  onClick={(e) => this.handleTileClicked(e, hexIndex)}
                  onMouseMove={(e) => this.handleTileHover(e, hexIndex, hex)}
                  id={hexIndex}
                >
                  {hex.hasCreature
                    ? <SpriteController
                      creature={hex.creature.name}
                      action={hex.creature.action}
                      orientation={hex.creature.orientation}
                    />
                    : null}
                </div>
              </li>
            )
          })}
        </ul>
        <div>
          <CombatDashboard playerReady={this.playerReady} playerDisconnect={this.playerDisconnect} />
          <CombatFooter />
        </div>
      </div>
    )
  }
}

export default withTranslation()(Battlefield)
