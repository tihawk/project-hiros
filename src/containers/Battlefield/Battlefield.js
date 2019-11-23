import React, { Component } from 'react'
import socketIOClient from 'socket.io-client'
import { withTranslation } from 'react-i18next'
import classes from './Battlefield.module.css'
import CombatFooter from './CombatFooter'
import CombatDashboard from './CombatDashboard'
import SpriteController from '../Sprite/SpriteController'

class Battlefield extends Component {
  state = {
    endpoint: 'http://localhost:5000',
    loading: true,
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
        this.handleMovement(action)
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

  handleTileClicked = (tile, tileIndex) => {
    this.socket.emit('click', tileIndex)
  }

  handleTileHover = (e, hexIndex, { hasCreature, creature, x, y }) => {
    const { offsetWidth, offsetHeight, style } = e.target
    const { range } = this.state.turn.creature
    const inRange = range.includes(hexIndex)

    if (inRange === true) {
      if (hasCreature) {
        if (creature.player !== this.state.turn.player) {
          const { x, y } = e.target.getBoundingClientRect()

          const dx = x - e.clientX + offsetWidth / 2
          const dy = y - e.clientY + offsetHeight / 2

          const leftRight = 3.5
          const up = 14
          const down = 0

          if (dx > leftRight) {
            if (dy <= up && dy >= down) {
              style.cursor = 'w-resize'
            } else if (dy > up) {
              style.cursor = 'nw-resize'
            } else if (dy < down) {
              style.cursor = 'sw-resize'
            }
          } else if (dx < leftRight) {
            if (dy <= up && dy >= down) {
              style.cursor = 'e-resize'
            } else if (dy > up) {
              style.cursor = 'ne-resize'
            } else if (dy < down) {
              style.cursor = 'se-resize'
            }
          }
        } else {
          style.cursor = 'not-allowed'
        }
      } else if (!hasCreature) {
        style.cursor = 'pointer'
      }
    } else if (inRange === false) {
      // console.log('[handleTileHover] sometimes it goes to inRange===false even though it\'s', inRange)
      style.cursor = 'not-allowed'
    }
  }

  handleMovement = (action) => {
    // console.log('[handleMovement] called, checking if is to animate')
    if (action.indexOfTileToMoveTo !== null && action.inAction) {
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

  render () {
    // const { t } = this.props
    const { board } = this.state
    const fieldClasses = [classes.field, this.state.action.inAction ? classes.inAction : null].join(' ')
    return (
      <div className={fieldClasses}>
        <ul className={[classes.grid, classes.clear].join(' ')}>
          { this.state.loading ? <CombatFooter message={'Waiting for players...'} /> : board.map((hex, hexIndex) => {
            return (
              <li key={hexIndex}>
                <div
                  className={[classes.hexagon, this.state.turn.creature.range.includes(hexIndex) ? classes.inRange : 'hi'].join(' ')}
                  onClick={() => this.handleTileClicked(hex, hexIndex)}
                  onMouseMove={(e) => this.handleTileHover(e, hexIndex, hex)}
                  id={hexIndex}
                >
                  {hex.hasCreature
                    ? <SpriteController
                      creature={hex.creature.type}
                      action={hex.creature.action}
                      oriented={hex.creature.oriented}
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
