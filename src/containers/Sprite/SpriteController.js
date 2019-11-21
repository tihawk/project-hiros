import React from 'react'
import Sprite from './Sprite'

import swordsmanIdleData from '../../public/assets/sprites/swordsman-idle.json'
import swordsmanIdleImage from '../../public/assets/sprites/swordsman-idle.png'
import swordsmanWalkData from '../../public/assets/sprites/swordsman-walk.json'
import swordsmanWalkImage from '../../public/assets/sprites/swordsman-walk.png'

const SpriteController = ({ creature, action, oriented }) => {
  const creatures = {
    swordsman: {
      idle: {
        data: swordsmanIdleData,
        image: swordsmanIdleImage
      },
      walk: {
        data: swordsmanWalkData,
        image: swordsmanWalkImage
      }
    }
  }
  const { data, image } = creatures[creature][action]

  return (
    <Sprite
      src={image}
      framesPerStep={Math.floor(Object.keys(data.frames).length / 1.5)}
      data={data}
      oriented={oriented}
    />
  )
}

export default SpriteController
