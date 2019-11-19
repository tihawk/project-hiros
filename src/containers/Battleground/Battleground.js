import React, { Component } from 'react'
import i18n from 'i18next'
import { range } from '../../utility/utility'
import { withTranslation } from 'react-i18next'
import classes from './Battleground.module.css'

class Battleground extends Component {
    state = {
      board: [...range(0, 10).map(colEl => range(0, 14))]
    }

    changeLanguage = (lng) => {
      i18n.changeLanguage(lng)
    }

    render () {
      console.table(this.state.board)
      const { t } = this.props
      return (
        <>
          <button onClick={() => this.changeLanguage('bg')}>bg</button>
          <button onClick={() => this.changeLanguage('en')}>en</button>
          <button onClick={() => this.changeLanguage('de')}>de</button>
          <h1>{t('Battlefield.Battlefield')}</h1>
          <ul className={[classes.grid, classes.clear] + 'd-flex flex-wrap align-items-center'}>
            {this.state.board.map(rowEl => {
              return rowEl.map(colEl => {
                return (
                  <li
                    key={colEl}
                    // style={{ backgroundColor: 'red', width: String(1 / rowEl.length * 100) + '%', borderStyle: 'solid', borderWidth: '1px' }}
                  >
                    <div
                      className={classes.hexagon}
                    >
                    </div>
                  </li>
                )
              })
            })}
          </ul>
        </>
      )
    }
}

export default withTranslation()(Battleground)
