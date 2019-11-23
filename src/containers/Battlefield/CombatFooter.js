import React from 'react'
import { withTranslation } from 'react-i18next'
import classes from './Battlefield.module.css'

const CombatFooter = ({ t, message }) => {
  return (
    <div className={classes.combFooter}>
      <span>{t('CombatFooter.' + message ? message : 'Emtpy')}</span>
    </div>
  )
}

export default withTranslation()(CombatFooter)
