import React, { Component } from 'react'
import Tile from './Tile'

class Sprite extends Component {
    state = {
      state: 0
    }

    tick = 0
    frame = 0
    step = 0
    action = 'idle'

    componentDidMount () {
      this.animate()
    }

    componentDidUpdate (prevProps) {
      if (prevProps.action === 'idle' && this.props.action !== 'idle') {
        this.animate()
      }
    }

    componentWillUnmount () {
      cancelAnimationFrame(this.frame)
    }

    animate = () => {
      if (this.action !== 'idle') {
        const { state } = this.state
        const { framesPerStep } = this.props
        const states = Object.keys(this.props.data.frames).length

        // if (this.step <= this.steps) {
        if (this.tick === framesPerStep) {
          this.step += 1
          this.tick = 0
          this.setState({ state: (state + 1) % states })
        }
        this.tick += 1

        this.frame = requestAnimationFrame(this.animate)
        // }
      }
    }

    render () {
      this.steps = this.props.steps
      this.action = this.props.action
      const { state } = this.state
      let tile = {
        width: 0,
        height: 0,
        left: 0,
        top: 0
      }
      if (this.props.data.frames[state]) {
        tile = {
          width: this.props.data.frames[state].frame.w,
          height: this.props.data.frames[state].frame.h,
          left: this.props.data.frames[state].frame.x,
          top: this.props.data.frames[state].frame.y
        }
      }
      const { src } = this.props
      const { orientation } = this.props
      const scale = {
        x: this.props.data.meta.scale * orientation,
        y: this.props.data.meta.scale
      }

      return <Tile
        src={src}
        tile={tile}
        scale={scale}
      />
    }
}

export default Sprite
