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
      const { framesPerStep } = this.props
      const states = Object.keys(this.props.data.frames).length

      if (this.tick === framesPerStep) {
        this.tick = 0
        this.setState({ state: (state + 1) % states })
      }
      this.tick += 1

      this.frame = requestAnimationFrame(this.animate)
    }

    render () {
      const { state } = this.state
      const tile = {
        width: this.props.data.frames[state].frame.w,
        height: this.props.data.frames[state].frame.h,
        left: this.props.data.frames[state].frame.x,
        top: this.props.data.frames[state].frame.y
      }
      const { src } = this.props
      const { scale } = this.props.data.meta

      return <Tile
        src={src}
        tile={tile}
        scale={scale}
      />
    }
}

export default Sprite
