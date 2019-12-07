import React from 'react'
import Sprite from './Sprite'
import sprites from './SpritesIndex'

const SpriteController = ({ creature, action, orientation, player, stackSize, onFinish }) => {
  const { data, image, framesPerStep, shouldAnimate, loop } = sprites[creature][action]

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
      onFinish={onFinish}
    />
  )
}

export default SpriteController
