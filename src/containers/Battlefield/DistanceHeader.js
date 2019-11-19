import React from 'react'
import { withTranslation } from 'react-i18next'
import classes from './Battlefield.module.css'

const CombatFooter = ({ t }) => {
  return (
    <div className={classes.distance}>
    </div>
  )
}

export default withTranslation()(CombatFooter)
