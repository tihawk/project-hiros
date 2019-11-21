import React, { Component } from 'react'
import { populateGrid } from '../../utility/utility'
import { withTranslation } from 'react-i18next'
import classes from './Battlefield.module.css'
import CombatFooter from './CombatFooter'
import CombatDashboard from './CombatDashboard'
import SpriteController from '../Sprite/SpriteController'

class Battlefield extends Component {
    state = {
      // board: [...range(0, 10).map(colEl => range(0, 14))]
      board: populateGrid(),
      indexOfSelectedTileWithCreature: null,
      isCreatureSelected: false,
      creature: {
        type: 'swordsman',
        action: 'idle'
      },
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

        const tileMovedFrom = this.state.board.slice(this.state.indexOfSelectedTileWithCreature)
        tileMovedFrom[0].creature.action = 'walk'
        const boardCopy = this.state.board.slice(0, this.state.indexOfSelectedTileWithCreature).concat(tileMovedFrom)
        this.setState({ board: boardCopy })

        const tileToElement = document.getElementById(indexOfTileToMoveTo)
        const tileFromElement = document.getElementById(this.state.indexOfSelectedTileWithCreature)
        const spriteToMoveElement = tileFromElement.firstChild
        const distanceX = tileToElement.getBoundingClientRect().left - tileFromElement.getBoundingClientRect().left
        const distanceY = tileToElement.getBoundingClientRect().top - tileFromElement.getBoundingClientRect().top

        const keyFrames = [
          { left: '0', top: '0' },
          { left: distanceX + 'px', top: distanceY + 'px' }
        ]
        const animation = spriteToMoveElement.animate(keyFrames, Math.sqrt(distanceX ** 2 + distanceY ** 2) * 3)

        animation.onfinish = () => {
          console.log('replacing element')
          const tileMovedTo = this.state.board.slice(indexOfTileToMoveTo)
          let boardCopy = this.state.board.slice(0, indexOfTileToMoveTo).concat(tileMovedTo)
          const tileMovedFrom = this.state.board.slice(this.state.indexOfSelectedTileWithCreature)
          tileMovedTo[0].hasCreature = true
          tileMovedTo[0].creature = { ...tileMovedFrom[0].creature, action: 'idle' }
          tileMovedFrom[0].hasCreature = false
          delete tileMovedFrom[0].creature
          boardCopy = this.state.board.slice(0, this.state.indexOfSelectedTileWithCreature).concat(tileMovedFrom)
          // this.setState({ creatureState: { ...this.state.creatureState, data: swordsmanIdleData, image: swordsmanIdleImage } })
          this.setState({
            board: boardCopy,
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
