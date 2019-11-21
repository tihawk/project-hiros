import React, { Component } from 'react'
import { populateGrid } from '../../utility/utility'
import { withTranslation } from 'react-i18next'
import classes from './Battlefield.module.css'
import CombatFooter from './CombatFooter'
import CombatDashboard from './CombatDashboard'
import Sprite from '../Sprite/Sprite'

import spriteData from '../../public/assets/sprites/swordsman-idle.json'
import image from '../../public/assets/sprites/swordsman-idle.png'

class Battlefield extends Component {
    state = {
      // board: [...range(0, 10).map(colEl => range(0, 14))]
      board: populateGrid(),
      indexOfSelectedTileWithCreature: null,
      isCreatureSelected: false
    }

    handleTileClicked = (tile, tileIndex) => {
      if (!tile.hasCreature) {
        if (this.state.isCreatureSelected) {
          console.log('calling moving')
          this.handleCreatureMoved(tile, tileIndex)
        }
      } else if (tile.hasCreature) {
        console.log('calling selecting')
        this.handleCreatureSelect(tileIndex)
      }
    }

    handleCreatureSelect = (tileIndex) => {
      if (tileIndex === this.state.indexOfSelectedTileWithCreature) {
        // deselect
        console.log('deselect')
        this.setState({
          indexOfSelectedTileWithCreature: null,
          isCreatureSelected: false
        })
      } else {
        // select
        console.log('select')
        this.setState({
          indexOfSelectedTileWithCreature: tileIndex,
          isCreatureSelected: true
        })
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

        const keyFrames = [
          { left: '0', top: '0' },
          { left: distanceX + 'px', top: distanceY + 'px' }
        ]
        const animation = spriteToMoveElement.animate(keyFrames, Math.sqrt(distanceX ** 2 + distanceY ** 2) * 3)

        animation.onfinish = () => {
          console.log('replacing element')
          const tileMovedTo = this.state.board.slice(indexOfTileToMoveTo)
          tileMovedTo[0].hasCreature = true
          let boardCopy = this.state.board.slice(0, indexOfTileToMoveTo).concat(tileMovedTo)
          const tileMovedFrom = this.state.board.slice(this.state.indexOfSelectedTileWithCreature)
          tileMovedFrom[0].hasCreature = false
          boardCopy = this.state.board.slice(0, this.state.indexOfSelectedTileWithCreature).concat(tileMovedFrom)
          this.setState({
            board: boardCopy,
            isCreatureSelected: false,
            indexOfSelectedTileWithCreature: null
          })
        }
      }
    }

    render () {
      const character = (
        <Sprite
          src={image}
          framesPerStep={9}
          data={spriteData}
        />
      )

      // const { t } = this.props
      return (
        <div className={classes.field}>
          <ul className={[classes.grid, classes.clear].join(' ')}>
            {this.state.board.map((hex, hexIndex) => {
              return (
                <li key={hexIndex}>
                  <div
                    className={classes.hexagon}
                    onClick={() => this.handleTileClicked(hex, hexIndex)}
                    id={hexIndex}
                  >
                    {hex.hasCreature ? character : null}
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
