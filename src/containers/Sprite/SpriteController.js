import React from 'react'
import Sprite from './Sprite'

import swordsmanIdleData from '../../public/assets/sprites/swordsman-idle.json'
import swordsmanIdleImage from '../../public/assets/sprites/swordsman-idle.png'
import swordsmanWalkData from '../../public/assets/sprites/swordsman-walk.json'
import swordsmanWalkImage from '../../public/assets/sprites/swordsman-walk.png'
import swordsmanAttackWEData from '../../public/assets/sprites/swordsman-attack-w-e.json'
import swordsmanAttackWEImage from '../../public/assets/sprites/swordsman-attack-w-e.png'
import swordsmanAttackNWNEData from '../../public/assets/sprites/swordsman-attack-nw-ne.json'
import swordsmanAttackNWNEImage from '../../public/assets/sprites/swordsman-attack-nw-ne.png'
import swordsmanAttackSWSEData from '../../public/assets/sprites/swordsman-attack-sw-se.json'
import swordsmanAttackSWSEImage from '../../public/assets/sprites/swordsman-attack-sw-se.png'
import swordsmanAttackedData from '../../public/assets/sprites/swordsman-attacked.json'
import swordsmanAttackedImage from '../../public/assets/sprites/swordsman-attacked.png'
import swordsmanDyingData from '../../public/assets/sprites/swordsman-dying.json'
import swordsmanDyingImage from '../../public/assets/sprites/swordsman-dying.png'

const SpriteController = ({ creature, action, orientation }) => {
  const creatures = {
    Swordsman: {
      idle: {
        data: swordsmanIdleData,
        image: swordsmanIdleImage,
        shouldAnimate: false,
        loop: false
      },
      walk: {
        data: swordsmanWalkData,
        image: swordsmanWalkImage,
        framesPerStep: Math.floor(Object.keys(swordsmanWalkData.frames).length) / 2,
        shouldAnimate: true,
        loop: true
      },
      'attack-w-e': {
        data: swordsmanAttackWEData,
        image: swordsmanAttackWEImage,
        framesPerStep: Object.keys(swordsmanAttackWEData.frames).length,
        shouldAnimate: true,
        loop: false
      },
      'attack-nw-ne': {
        data: swordsmanAttackNWNEData,
        image: swordsmanAttackNWNEImage,
        framesPerStep: Object.keys(swordsmanAttackNWNEData.frames).length,
        shouldAnimate: true,
        loop: false
      },
      'attack-sw-se': {
        data: swordsmanAttackSWSEData,
        image: swordsmanAttackSWSEImage,
        framesPerStep: Object.keys(swordsmanAttackSWSEData.frames).length,
        shouldAnimate: true,
        loop: false
      },
      attacked: {
        data: swordsmanAttackedData,
        image: swordsmanAttackedImage,
        framesPerStep: Object.keys(swordsmanAttackedData.frames).length,
        shouldAnimate: true,
        loop: false
      },
      dying: {
        data: swordsmanDyingData,
        image: swordsmanDyingImage,
        framesPerStep: Object.keys(swordsmanDyingData.frames).length,
        shouldAnimate: true,
        loop: false
      }
    }
  }
  const { data, image, framesPerStep, shouldAnimate, loop } = creatures[creature][action]

  return (
    <Sprite
      src={image}
      framesPerStep={framesPerStep}
      data={data}
      orientation={orientation}
      action={action}
      loop={loop}
      shouldAnimate={shouldAnimate}
    />
  )
}

export default SpriteController
