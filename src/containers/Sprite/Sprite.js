import React, { Component } from 'react'
import Tile from './Tile'

class Sprite extends Component {
    state = {
      state: 0
    }

    tick = 0
    frame = 0

    componentDidMount () {
      this.animate()
    }

    componentWillUnmount () {
      cancelAnimationFrame(this.frame)
    }

    animate = () => {
      const { state } = this.state
      const { framesPerStep, states } = this.props

      if (this.tick === framesPerStep) {
        this.tick = 0
        this.setState({ state: (state + 1) % states })
      }
      this.tick += 1

      this.frame = requestAnimationFrame(this.animate)
    }

    render () {
      const { src, tile, scale } = this.props
      const { state } = this.state

      return <Tile
        src={src}
        tile={tile}
        scale={scale}
        state={state}
      />
    }
}

export default Sprite
