import React from 'react'
import { withTranslation } from 'react-i18next'
import classes from './Battlefield.module.css'

const InfoPanel = ({ t, message }) => {
  const translatedMessage = t(`LoadingMessages.${message}`)
  return (
    <div className={classes.infoPanel}>
      <span>{translatedMessage}</span>
    </div>
  )
}

export default withTranslation()(InfoPanel)
