import React, { Component } from 'react'

import classes from './Modal.module.css'
// import Backdrop from './Backdrop'

class Modal extends Component {
  shouldComponentUpdate (nextProps, nextState) {
    return nextProps.show !== this.props.show || nextProps.children !== this.props.children
  }

  //   componentWillUpdate () {
  //     console.log('[Modal] WillUpdate')
  //   }

  render () {
    return (
      <>
        {/* <Backdrop show={this.props.show} clicked={this.props.onClose} /> */}
        <div
          className={classes.Modal}
          style={{
            transform: this.props.show ? 'translateY(0)' : 'translateY(-100vh)',
            opacity: this.props.show ? '1' : '0'
          }}>
          <div className={classes.outerContainer}>
            <div className={classes.innerContainer}>
              {this.props.children}
              <button type="button" onClick={this.props.onClose}>OK</button>
            </div>
          </div>
        </div>
      </>
    )
  }
}

export default Modal
