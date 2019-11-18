import React, { Component } from 'react'
import i18n from 'i18next'
import { withTranslation } from 'react-i18next'

class Battleground extends Component {
    changeLanguage = (lng) => {
      i18n.changeLanguage(lng)
    }

    render () {
      const { t } = this.props
      return (
        <>
          <button onClick={() => this.changeLanguage('bg')}>bg</button>
          <button onClick={() => this.changeLanguage('en')}>en</button>
          <h1>{t('Battlefield.Battlefield')}</h1>
        </>
      )
    }
}

export default withTranslation()(Battleground)
