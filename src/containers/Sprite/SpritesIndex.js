import files from './SpriteFiles'

const creaturesList = [
  'Swordsman',
  'Angel',
  'Naga',
  'Marksman'
]
const filesList = [
  'Idle',
  'Active',
  'Walk',
  'AttackWE',
  'AttackNWNE',
  'AttackSWSE',
  'ShootWE',
  'ShootNWNE',
  'ShootSWSE',
  'Attacked',
  'Defend',
  'Dying',
  'Dead'
]

const actionsList = [
  'idle',
  'active',
  'walk',
  'attack-w-e',
  'attack-nw-ne',
  'attack-sw-se',
  'shoot-w-e',
  'shoot-nw-ne',
  'shoot-sw-se',
  'attacked',
  'defend',
  'dying',
  'dead'
]

const sprites = {}
creaturesList.forEach(creature => {
  sprites[creature] = {
    data: null,
    image: null,
    shouldAnimate: null,
    loop: null
  }
  console.log(sprites)
  actionsList.forEach((action, index) => {
    sprites[creature][action] = {}
    const data = files[String(creature).toLowerCase() + filesList[index] + 'Data'] || {}
    sprites[creature][action].data = data
    sprites[creature][action].image = files[String(creature).toLowerCase() + filesList[index] + 'Image'] || null
    sprites[creature][action].framesPerStep = data.frames ? Math.floor(Object.keys(data.frames).length) / (action === 'walk' ? 2 : 1) : null
    sprites[creature][action].shouldAnimate = !(action === 'idle' || action === 'dead')
    sprites[creature][action].loop = action === 'walk'
  })
})

export default sprites
