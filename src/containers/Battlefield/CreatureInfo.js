import React from 'react'
import { withTranslation } from 'react-i18next'
import classes from './Battlefield.module.css'

const InfoPanel = ({ t, creatureData, id }) => {
//   const translatedMessage = t(`LoadingMessages.${null}`)
  return (
    <div className={classes.creatureInfo} id={id}>
      <div className={classes.redPanel}>
        <div className={classes.infoSubtile}>
          <div>{creatureData.name} x{creatureData.stackMultiplier}</div>
        </div>
      </div>
      <div className={classes.redPanel}>
        <div className={classes.infoSubtile}>
          <div>Attack: {creatureData.att}</div>
          <div>Defence: {creatureData.def}({Math.round(creatureData.currentDef)})</div>
          <div>Damage: {creatureData.dMin}-{creatureData.dMax}</div>
          <div>Health: {creatureData.hp}</div>
        </div>
      </div>
      <div className={classes.redPanel}>
        <div className={classes.infoSubtile}>
          <div>Speed: {Math.round(creatureData.spd)}</div>
          <div>Health Left: {Math.round(creatureData.currentHP)}</div>
        </div>
      </div>
    </div>
  )
}

export default withTranslation()(InfoPanel)
