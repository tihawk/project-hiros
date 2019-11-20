import React, { Component } from 'react'
import { populateGrid } from '../../utility/utility'
import { withTranslation } from 'react-i18next'
import classes from './Battlefield.module.css'
import CombatFooter from './CombatFooter'
import CombatDashboard from './CombatDashboard'
import DistanceHeader from './DistanceHeader'
import Sprite from '../Sprite/Sprite'

import image from '../../public/assets/sprites/sorcerer1.png'

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

    render () {
      const character = (
        <Sprite
          src={image}
          states={10}
          tile={{ width: 200, height: 200 }}
          scale={0.7}
          framesPerStep={10}
          className={classes.clear}
        />
      )

      // const { t } = this.props
      return (
        <div className={classes.field}>
          <DistanceHeader />
          <ul className={[classes.grid, classes.clear].join(' ')}>
            {this.state.board.map((hex, hexIndex) => {
              return (
                <li key={hexIndex}>
                  <div
                    className={classes.hexagon}
                    onClick={() => this.handleTileClicked(hex, hexIndex)}
                  >
                    {hex.hasCreature ? character : null}
                  </div>
                </li>
              )
            })}
          </ul>
          {/* {character} */}
          <div>
            <CombatDashboard />
            <CombatFooter />
          </div>
        </div>
      )
    }
}

export default withTranslation()(Battlefield)
