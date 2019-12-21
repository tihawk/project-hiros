import React, { Component } from 'react'

import classes from './Modal.module.css'
import Backdrop from './Backdrop'

class Modal extends Component {
  shouldComponentUpdate (nextProps, nextState) {
    return nextProps.show !== this.props.show || nextProps.children !== this.props.children
  }

  componentWillUpdate () {
    console.log('[Modal] WillUpdate')
  }

  render () {
    const { cancelable, show, onClose, onCancel } = this.props
    return (
      <>
        {cancelable ? <Backdrop show={this.props.show} clicked={onCancel || onClose} /> : null }
        <div
          className={classes.Modal}
          style={{
            transform: show ? 'translateY(0)' : 'translateY(-100vh)',
            opacity: show ? '1' : '0'
          }}>
          <div className={classes.outerContainer}>
            <div className={classes.innerContainer}>
              {this.props.children}
              <button type="button" onClick={onClose}>OK</button>
            </div>
          </div>
        </div>
      </>
    )
  }
}

export default Modal
