import React, { Component } from 'react'
import { withTranslation } from 'react-i18next'
import classes from './Battlefield.module.css'

class CombatDashboard extends Component {
  state = { messages: ['this \n is \n a \n log', 'what the actual fuck', 'somebody died, i think'] }

  componentDidMount () {
    this.scrollToBottom()
  }

  componentDidUpdate (prevProps, prevState) {
    if (this.state.messages !== prevState.messages) this.scrollToBottom()
  }

  scrollToBottom = () => {
    this.messagesEnd.scrollIntoView({ behavior: 'smooth' })
  }

  render () {
    return (
      <div className={classes.dashboard}>
        <button onClick={this.props.playerReady}>plr rdy</button>
        <button onClick={this.props.playerDisconnect}>
          <img style={{ height: '75%' }} alt="smtin" src="https://previews.123rf.com/images/tmricons/tmricons1707/tmricons170700580/81207012-shuffle-sign-icon-random-button-.jpg" />
        </button>
        <button>btn</button>
        <button>btn</button>
        <div className={classes.log}>
          {this.state.messages.map((message, index) => {
            return <div key={index}>{message}</div>
          })}
          <div style={{ float: 'left', clear: 'both' }}
            ref={(el) => { this.messagesEnd = el }}></div>
        </div>
        <button onClick={() => this.setState({ messages: this.state.messages.concat('random message') })}>btn</button>
        <button>btn</button>
        <button>btn</button>
      </div>
    )
  }
}

export default withTranslation()(CombatDashboard)
