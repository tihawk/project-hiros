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
import swordsmanDefendData from '../../public/assets/sprites/swordsman-defend.json'
import swordsmanDefendImage from '../../public/assets/sprites/swordsman-defend.png'
import swordsmanDyingData from '../../public/assets/sprites/swordsman-dying.json'
import swordsmanDyingImage from '../../public/assets/sprites/swordsman-dying.png'

import nagaIdleData from '../../public/assets/sprites/naga-idle.json'
import nagaIdleImage from '../../public/assets/sprites/naga-idle.png'
import nagaActiveData from '../../public/assets/sprites/naga-active.json'
import nagaActiveImage from '../../public/assets/sprites/naga-active.png'
import nagaWalkData from '../../public/assets/sprites/naga-walk.json'
import nagaWalkImage from '../../public/assets/sprites/naga-walk.png'
import nagaAttackWEData from '../../public/assets/sprites/naga-attack-w-e.json'
import nagaAttackWEImage from '../../public/assets/sprites/naga-attack-w-e.png'
import nagaAttackNWNEData from '../../public/assets/sprites/naga-attack-nw-ne.json'
import nagaAttackNWNEImage from '../../public/assets/sprites/naga-attack-nw-ne.png'
import nagaAttackSWSEData from '../../public/assets/sprites/naga-attack-sw-se.json'
import nagaAttackSWSEImage from '../../public/assets/sprites/naga-attack-sw-se.png'
import nagaAttackedData from '../../public/assets/sprites/naga-attacked.json'
import nagaAttackedImage from '../../public/assets/sprites/naga-attacked.png'
import nagaDefendData from '../../public/assets/sprites/naga-defend.json'
import nagaDefendImage from '../../public/assets/sprites/naga-defend.png'
import nagaDyingData from '../../public/assets/sprites/naga-dying.json'
import nagaDyingImage from '../../public/assets/sprites/naga-dying.png'

export const creatures = {
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
    defend: {
      data: swordsmanDefendData,
      image: swordsmanDefendImage,
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
  },
  Naga: {
    idle: {
      data: nagaIdleData,
      image: nagaIdleImage,
      shouldAnimate: false,
      loop: false
    },
    active: {
      data: nagaActiveData,
      image: nagaActiveImage,
      framesPerStep: Math.floor(Object.keys(swordsmanWalkData.frames).length) / 2,
      shouldAnimate: true,
      loop: false
    },
    walk: {
      data: nagaWalkData,
      image: nagaWalkImage,
      framesPerStep: Math.floor(Object.keys(swordsmanWalkData.frames).length) / 2,
      shouldAnimate: true,
      loop: true
    },
    'attack-w-e': {
      data: nagaAttackWEData,
      image: nagaAttackWEImage,
      framesPerStep: Object.keys(swordsmanAttackWEData.frames).length,
      shouldAnimate: true,
      loop: false
    },
    'attack-nw-ne': {
      data: nagaAttackNWNEData,
      image: nagaAttackNWNEImage,
      framesPerStep: Object.keys(swordsmanAttackNWNEData.frames).length,
      shouldAnimate: true,
      loop: false
    },
    'attack-sw-se': {
      data: nagaAttackSWSEData,
      image: nagaAttackSWSEImage,
      framesPerStep: Object.keys(swordsmanAttackSWSEData.frames).length,
      shouldAnimate: true,
      loop: false
    },
    attacked: {
      data: nagaAttackedData,
      image: nagaAttackedImage,
      framesPerStep: Object.keys(swordsmanAttackedData.frames).length,
      shouldAnimate: true,
      loop: false
    },
    defend: {
      data: nagaDefendData,
      image: nagaDefendImage,
      framesPerStep: Object.keys(swordsmanAttackedData.frames).length,
      shouldAnimate: true,
      loop: false
    },
    dying: {
      data: nagaDyingData,
      image: nagaDyingImage,
      framesPerStep: Object.keys(swordsmanDyingData.frames).length,
      shouldAnimate: true,
      loop: false
    }
  }
}
