import React from 'react'
import { withTranslation } from 'react-i18next'
import classes from './Battlefield.module.css'

const CombatFooter = ({ t }) => {
  return (
    <div className={classes.combFooter}>
      <span>Meta information goes here</span>
    </div>
  )
}

export default withTranslation()(CombatFooter)
