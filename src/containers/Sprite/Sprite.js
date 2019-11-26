import React, { Component } from 'react'
import Tile from './Tile'

class Sprite extends Component {
    state = {
      state: 0
    }

    tick = 0
    frame = 0
    action = 'idle'
    shouldAnimate = false

    componentDidUpdate (prevProps) {
      const { shouldAnimate, framesPerStep, loop } = this.props

      if (shouldAnimate && prevProps.shouldAnimate) {
        const states = Object.keys(this.props.data.frames).length
        const { state } = this.state

        let nextState = (state + 1) % states
        if (!shouldAnimate) {
          return
        }
        if (nextState === 0 && !loop) {
          return
        }

        if (prevProps.action !== this.props.action) {
          nextState = 0
        }

        this.interval = 1000 / (framesPerStep * 2)

        this.animationId = requestAnimationFrame(time => this.animate(nextState, time))
      }
    }

    componentWillReceiveProps ({ action }) {
      if (action !== this.props.action) {
        this.setState({ state: 0 })
      }
    }

    componentWillUnmount () {
      this.isUnmounting = true
      this.animationId !== null && cancelAnimationFrame(this.animationId)
    }

    animate = (nextState, time) => {
      if (this.isUnmounting) {
        return
      }

      if (!this.prevTime) {
        this.prevTime = time
      }

      if (this.props.shouldAnimate) {
        const delta = time - this.prevTime
        if (delta < this.interval) {
          this.animationId = requestAnimationFrame(time => this.animate(nextState, time))
          return
        }

        this.prevTime = time - (delta % this.interval)
        this.setState({ state: nextState })
      } else {
        this.prevTime = 0
      }
    }

    render () {
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
