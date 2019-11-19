import React, { Component } from 'react'
import i18n from 'i18next'
import { range } from '../../utility/utility'
import { withTranslation } from 'react-i18next'
import classes from './Battlefield.module.css'
import CombatFooter from './CombatFooter'
import CombatDashboard from './CombatDashboard'
import DistanceHeader from './DistanceHeader'

class Battleground extends Component {
    state = {
      board: [...range(0, 10).map(colEl => range(0, 14))]
    }

    changeLanguage = (lng) => {
      i18n.changeLanguage(lng)
    }

    render () {
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
                      <strong className={classes.onHexagon}>{rowIndex}x{colEl}</strong>
                    </div>
                  </li>
                )
              })
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

export default withTranslation()(Battleground)
