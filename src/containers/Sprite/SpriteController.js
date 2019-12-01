import React from 'react'
import Sprite from './Sprite'
import * as sprites from './SpritesIndex'

const SpriteController = ({ creature, action, orientation }) => {
  const { data, image, framesPerStep, shouldAnimate, loop } = sprites.creatures[creature][action]

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
