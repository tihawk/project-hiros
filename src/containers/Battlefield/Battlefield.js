import React, { Component } from 'react'
import { populateGrid } from '../../utility/utility'
import { withTranslation } from 'react-i18next'
import update from 'immutability-helper'
import classes from './Battlefield.module.css'
import CombatFooter from './CombatFooter'
import CombatDashboard from './CombatDashboard'
import SpriteController from '../Sprite/SpriteController'

class Battlefield extends Component {
    state = {
      board: populateGrid(),
      indexOfSelectedTileWithCreature: null,
      isCreatureSelected: false,
      inAction: false
    }

    handleTileClicked = (tile, tileIndex) => {
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
        this.handleCreatureSelect(tileIndex)
      } else {
        this.setState({ inAction: false })
      }
    }

    handleCreatureSelect = (tileIndex) => {
      if (tileIndex === this.state.indexOfSelectedTileWithCreature) {
        // deselect
        console.log('deselect')
        this.setState({
          indexOfSelectedTileWithCreature: null,
          isCreatureSelected: false,
          inAction: false
        })
      } else {
        // select
        console.log('select')
        this.setState({
          indexOfSelectedTileWithCreature: tileIndex,
          isCreatureSelected: true,
          inAction: false
        })
      }
    }

    handleCreatureMoved = (tileToMoveTo, indexOfTileToMoveTo) => {
      if (!tileToMoveTo.hasCreature) {
        console.log('moving...')
        // board = update(board, { [this.state.indexOfSelectedTileWithCreature]: { creature: { action: { $set: 'walk' } } } })
        // this.setState({ board })

        const tileToElement = document.getElementById(indexOfTileToMoveTo)
        const tileFromElement = document.getElementById(this.state.indexOfSelectedTileWithCreature)
        const spriteToMoveElement = tileFromElement.firstChild
        const distanceX = tileToElement.getBoundingClientRect().left - tileFromElement.getBoundingClientRect().left
        const distanceY = tileToElement.getBoundingClientRect().top - tileFromElement.getBoundingClientRect().top

        let board = this.state.board
        board = update(board, { [this.state.indexOfSelectedTileWithCreature]: { creature: { action: { $set: 'walk' } } } })
        board = update(board, { [this.state.indexOfSelectedTileWithCreature]: { creature: { oriented: { $set: distanceX / Math.abs(distanceX) } } } })

        this.setState({ board })

        const keyFrames = [
          { left: '0', top: '0' },
          { left: distanceX + 'px', top: distanceY + 'px' }
        ]
        const animation = spriteToMoveElement.animate(keyFrames, Math.sqrt(distanceX ** 2 + distanceY ** 2) * 3)

        animation.onfinish = () => {
          console.log('replacing element')
          let board = this.state.board
          board = update(board, { [indexOfTileToMoveTo]: { hasCreature: { $set: true } } })
          board = update(board, { [indexOfTileToMoveTo]: { creature: { $set: board[this.state.indexOfSelectedTileWithCreature].creature } } })
          board = update(board, { [indexOfTileToMoveTo]: { creature: { action: { $set: 'idle' } } } })
          board = update(board, { [this.state.indexOfSelectedTileWithCreature]: { hasCreature: { $set: false } } })
          board = update(board, { [this.state.indexOfSelectedTileWithCreature]: { creature: { $set: undefined } } })
          this.setState({
            board,
            isCreatureSelected: false,
            indexOfSelectedTileWithCreature: null,
            inAction: false
          })
        }
      } else {
        this.setState({ inAction: false })
      }
    }

    render () {
      // const { t } = this.props
      const fieldClasses = [classes.field, this.state.inAction ? classes.inAction : null].join(' ')
      return (
        <div className={fieldClasses}>
          <ul className={[classes.grid, classes.clear].join(' ')}>
            {this.state.board.map((hex, hexIndex) => {
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
