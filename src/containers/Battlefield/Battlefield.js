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
    board: [{ x: 0, y: 0 }],
    // turn.creatureTileIndex: null,
    indexOfTileToMoveTo: null,
    isCreatureSelected: false,
    inAction: false,
    loading: true
  }

  componentDidMount () {
    const { endpoint } = this.state
    this.socket = socketIOClient(endpoint)
    this.socket.emit('new-battle')
    this.socket.on('state', data => {
      this.setState({
        board: data.board,
        // turn.creatureTileIndex: data.turn.creatureTileIndex,
        isCreatureSelected: data.isCreatureSelected,
        indexOfTileToMoveTo: data.indexOfTileToMoveTo,
        turn: data.turn,
        loading: data.loading,
        inAction: data.inAction
      })
    })
  }

  componentDidUpdate (prevProps, prevState) {
    if (prevState.inAction !== this.state.inAction) {
      this.setState({ isToAnimate: true })
      this.handleMovement()
    }
  }

  shouldComponentUpdate (nextProps, nextState) {
    if (nextState.board === this.state.board) {
      return false
    }
    return true
  }

  componentWillUnmount () {
    this.socket.emit('disconnect')
  }

    handleTileClicked = (tile, tileIndex) => {
      this.socket.emit('click', tileIndex)
      this.setState({ isToAnimate: true })
    }

    handleMovement = () => {
      // console.log('[handleMovement] called, checking if is to animate')
      if (this.state.isToAnimate && this.state.indexOfTileToMoveTo !== null && this.state.inAction) {
        console.log('animating')
        this.setState({ isToAnimate: false })
        const tileToElement = document.getElementById(this.state.indexOfTileToMoveTo)
        const tileFromElement = document.getElementById(this.state.turn.creatureTileIndex)
        const spriteToMoveElement = tileFromElement.firstChild
        const distanceX = tileToElement.getBoundingClientRect().left - tileFromElement.getBoundingClientRect().left
        const distanceY = tileToElement.getBoundingClientRect().top - tileFromElement.getBoundingClientRect().top
        // console.log('distance', distanceX, distanceY)
        const keyFrames = [
          { left: '0', top: '0' },
          { left: distanceX + 'px', top: distanceY + 'px' }
        ]
        const animation = spriteToMoveElement.animate(keyFrames, Math.sqrt(distanceX ** 2 + distanceY ** 2) * 3)

        animation.onfinish = () => {
          console.log('replacing element')
          // this.setState({ isToAnimate: false })
          this.socket.emit('finished-moving')
        }
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
            { this.state.loading ? null : board.map((hex, hexIndex) => {
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
