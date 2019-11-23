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

  handleMovement = (action) => {
    // console.log('[handleMovement] called, checking if is to animate')
    if (action.indexOfTileToMoveTo !== null && action.inAction) {
      console.log('animating')
      const tileToElement = document.getElementById(action.indexOfTileToMoveTo)
      const tileFromElement = document.getElementById(this.state.turn.creatureTileIndex)
      const spriteToMoveElement = tileFromElement.firstChild
      const distanceX = tileToElement.getBoundingClientRect().left - tileFromElement.getBoundingClientRect().left
      const distanceY = tileToElement.getBoundingClientRect().top - tileFromElement.getBoundingClientRect().top
      // console.log('distance', distanceX, distanceY)
      const keyFrames = [
        { left: '0', top: '0' },
        { left: distanceX + 'px', top: distanceY + 'px' }
      ]
      // const time = Math.sqrt(distanceX ** 2 + distanceY ** 2) * 3
      // const animation = spriteToMoveElement.animate(keyFrames, action.time)
      spriteToMoveElement.animate(keyFrames, action.time)

      // animation.onfinish = () => {
      //   // this.socket.emit('finished-moving')
      //   console.log('replacing element')
      // }
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
                  className={classes.hexagon}
                  onClick={() => this.handleTileClicked(hex, hexIndex)}
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
