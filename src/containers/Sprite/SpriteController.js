import React from 'react'
import Sprite from './Sprite'
import * as sprites from './SpritesIndex'

const SpriteController = ({ creature, action, orientation, player, stackSize }) => {
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
      player={player}
      stackSize={stackSize}
    />
  )
}

export default SpriteController
