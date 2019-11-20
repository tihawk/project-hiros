import React, { Component } from 'react'
import i18n from 'i18next'
import { range } from '../../utility/utility'
import { withTranslation } from 'react-i18next'
import classes from './Battlefield.module.css'
import CombatFooter from './CombatFooter'
import CombatDashboard from './CombatDashboard'
import DistanceHeader from './DistanceHeader'
import Sprite from '../Sprite/Sprite'

import image from '../../public/assets/sprites/sorcerer.png'

class Battlefield extends Component {
    state = {
      board: [...range(0, 10).map(colEl => range(0, 14))]
    }

    // componentDidMount () {
    //   this.canvas = document.getElementById('canvas')
    //   this.canvas.width = 800
    //   this.canvas.height = 600
    //   this.context = this.canvas.getContext('2d')
    //   let x = 0
    //   for (const row of this.state.board) {
    //     for (const cell of row) {
    //       x += 10
    //       drawHexagon(this.context, 10, { x: x, y: 10 })
    //     }
    //   }
    // }

    changeLanguage = (lng) => {
      i18n.changeLanguage(lng)
    }

    render () {
      const character = <Sprite
        src={image}
        states={10}
        tile={{ width: 200, height: 200 }}
        scale={0.5}
        framesPerStep={10}
      />

      console.table(this.state.board)
      // const { t } = this.props
      return (
        <div className={classes.field}>
          {/* <button onClick={() => this.changeLanguage('bg')}>bg</button>
        <button onClick={() => this.changeLanguage('en')}>en</button>
        <button onClick={() => this.changeLanguage('de')}>de</button>
        <h1 style={{ color: 'white' }}>{t('Battlefield.Battlefield')}</h1> */}
          <DistanceHeader />
          <ul className={[classes.grid, classes.clear].join(' ')}>
            {this.state.board.map((rowEl, rowIndex) => {
              return rowEl.map(colEl => {
                return (
                  <li key={colEl}>
                    <div className={classes.hexagon}>
                      <div className={classes.onHexagon}>
                        {/* {character} */}
                      </div>
                    </div>
                  </li>
                )
              })
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