import React, { Component } from 'react'
import socketIOClient from 'socket.io-client'
import { withTranslation } from 'react-i18next'
import classes from './Battlefield.module.css'
import CombatFooter from './CombatFooter'
import CombatDashboard from './CombatDashboard'
import SpriteController from '../Sprite/SpriteController'

class Battlefield extends Component {
  state = {
    response: false,
    endpoint: 'http://localhost:5000',
    board: [{ x: 0, y: 0 }],
    indexOfSelectedTileWithCreature: null,
    isCreatureSelected: false,
    inAction: false
  }

  componentDidMount () {
    const { endpoint } = this.state
    this.socket = socketIOClient(endpoint)
    this.socket.emit('new-battle')
    this.socket.on('state', data => this.setState({
      board: data.board,
      indexOfSelectedTileWithCreature: data.indexOfSelectedTileWithCreature,
      isCreatureSelected: data.isCreatureSelected
    }))
  }

  shouldComponentUpdate (nextProps, nextState) {
    if (nextState.board === this.state.board) {
      return false
    }
    return true
  }

    handleTileClicked = (tile, tileIndex) => {
      this.socket.emit('click', tileIndex)
      this.setState({ inAction: true })
      if (!tile.hasCreature) {
        if (this.state.isCreatureSelected) {
          console.log('calling moving')
          this.handleCreatureMoved(tile, tileIndex)
        } else {
          // clicked on empty tile i guess
          this.setState({ inAction: false })
        }
      } else if (tile.hasCreature) {
        console.log('calling selecting')
        this.setState({ inAction: false })
        // this.handleCreatureSelect(tileIndex)
      } else {
        this.setState({ inAction: false })
      }
    }

    handleCreatureMoved = (tileToMoveTo, indexOfTileToMoveTo) => {
      if (!tileToMoveTo.hasCreature) {
        console.log('moving...')

        const tileToElement = document.getElementById(indexOfTileToMoveTo)
        const tileFromElement = document.getElementById(this.state.indexOfSelectedTileWithCreature)
        const spriteToMoveElement = tileFromElement.firstChild
        const distanceX = tileToElement.getBoundingClientRect().left - tileFromElement.getBoundingClientRect().left
        const distanceY = tileToElement.getBoundingClientRect().top - tileFromElement.getBoundingClientRect().top

        this.socket.emit('update-orientation', distanceX / Math.abs(distanceX))

        const keyFrames = [
          { left: '0', top: '0' },
          { left: distanceX + 'px', top: distanceY + 'px' }
        ]
        const animation = spriteToMoveElement.animate(keyFrames, Math.sqrt(distanceX ** 2 + distanceY ** 2) * 3)

        animation.onfinish = () => {
          console.log('replacing element')
          this.socket.emit('finished-moving')
          this.setState({ inAction: false })
        }
      } else {
        this.setState({ inAction: false })
      }
    }

    render () {
      // const { response } = this.state
      // console.log(response)
      // const { t } = this.props
      const { board } = this.state
      const fieldClasses = [classes.field, this.state.inAction ? classes.inAction : null].join(' ')
      return (
        <div className={fieldClasses}>
          <ul className={[classes.grid, classes.clear].join(' ')}>
            {board.map((hex, hexIndex) => {
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
            <CombatDashboard />
            <CombatFooter />
          </div>
        </div>
      )
    }
}

export default withTranslation()(Battlefield)
