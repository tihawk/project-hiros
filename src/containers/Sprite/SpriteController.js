import React from 'react'
import Sprite from './Sprite'

import swordsmanIdleData from '../../public/assets/sprites/swordsman-idle.json'
import swordsmanIdleImage from '../../public/assets/sprites/swordsman-idle.png'
import swordsmanWalkData from '../../public/assets/sprites/swordsman-walk.json'
import swordsmanWalkImage from '../../public/assets/sprites/swordsman-walk.png'
import swordsmanAttackWEData from '../../public/assets/sprites/swordsman-attack-w-e.json'
import swordsmanAttackWEImage from '../../public/assets/sprites/swordsman-attack-w-e.png'

const SpriteController = ({ creature, action, orientation }) => {
  const creatures = {
    Swordsman: {
      idle: {
        data: swordsmanIdleData,
        image: swordsmanIdleImage
      },
      walk: {
        data: swordsmanWalkData,
        image: swordsmanWalkImage
      },
      'attack-w-e': {
        data: swordsmanAttackWEData,
        image: swordsmanAttackWEImage
      }
    }
  }
  const { data, image } = creatures[creature][action]

  return (
    <Sprite
      src={image}
      framesPerStep={Math.floor(Object.keys(data.frames).length / 2)}
      data={data}
      orientation={orientation}
      action={action}
    />
  )
}

export default SpriteController
