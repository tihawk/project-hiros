import React from 'react'
import { withTranslation } from 'react-i18next'
import classes from './Battlefield.module.css'

const CombatFooter = ({ t, message }) => {
  const translatedMessage = t(`CombatFooter.${message || 'Empty'}`)
  return (
    <div className={classes.combFooter}>
      <span>{translatedMessage}</span>
    </div>
  )
}

export default withTranslation()(CombatFooter)
