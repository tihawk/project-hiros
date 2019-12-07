import React, { Component } from 'react'
import styled from 'styled-components'
import Tile from './Tile'

class Sprite extends Component {
    state = {
      state: 0
    }

    tick = 0
    frame = 0
    action = 'idle'
    shouldAnimate = false

    stackNum = styled.div`
      position: absolute;
      z-index: 3;
      pointer-events: none;
      top: 35px;
      left: ${({ orientation }) => orientation > 0 ? 70 : -40}px;
      width: 35px;
      background-color: rgba(${({ player }) => player * 255}, 0, 255, 0.6);
      border: 1px solid gold;
      font-size: 0.7em;
      text-align: center;
      color: gold;
    `

    componentDidUpdate (prevProps) {
      const { shouldAnimate, framesPerStep, loop, onFinish } = this.props

      if (shouldAnimate && prevProps.shouldAnimate) {
        const states = Object.keys(this.props.data.frames).length
        const { state } = this.state

        let nextState = (state + 1) % states
        if (!shouldAnimate) {
          return
        }
        if (nextState === 0 && !loop) {
          onFinish()
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
      const frameData = this.props.data.frames[state] || null
      if (frameData) {
        tile = {
          width: frameData.frame.w,
          height: frameData.frame.h,
          left: frameData.frame.x,
          top: frameData.frame.y
        }
      }
      const { src, orientation, player, stackSize } = this.props
      const scale = {
        x: this.props.data.meta.scale * orientation,
        y: this.props.data.meta.scale
      }

      return (
        <div>
          <Tile
            src={src}
            tile={tile}
            scale={scale}
          />
          {player !== undefined
            ? <this.stackNum
              player={player}
              orientation={orientation}
            >
              {stackSize}
            </this.stackNum>
            : null}
        </div>
      )
    }
}

export default Sprite
