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
    if (this.props.messages !== prevProps.messages) this.setState({ messages: this.props.messages })
  }

  scrollToBottom = () => {
    // this.messagesEnd.scrollTop({ behavior: 'smooth' })
    this.messagesEnd.parentNode.scrollTop = this.messagesEnd.offsetTop
  }

  render () {
    const { notAllowedToAct, phase } = this.props
    return (
      <div className={classes.dashboard}>
        <button
          className={classes.dashboardButton}
          onClick={this.props.settings}
          title="Click to open battlefield settings"
        >
          <div className={classes.settingsButton}></div>
        </button>
        <button
          className={classes.dashboardButton}
          onClick={this.props.playerDisconnect}
          title="Surrender"
        >
          <div className={classes.surrenderButton}></div>
        </button>
        <button
          className={classes.dashboardButton}
          disabled
        >
          <div className={classes.retreatButton}></div>
        </button>
        <button
          className={classes.dashboardButton}
          disabled
        >
          <div className={classes.autoCombatButton}></div>
        </button>
        <div className={classes.redPanel}>
          <div className={classes.log}>
            {this.state.messages.map((message, index) => {
              return <div key={index}>{message}</div>
            })}
            <div style={{ float: 'left', clear: 'both' }}
              ref={(el) => { this.messagesEnd = el }}></div>
          </div>
        </div>
        <button
          className={classes.dashboardButton}
          title="Cast Spell (disabled)"
          onClick={() => this.setState({ messages: this.state.messages.concat('random message') })}
        >
          <div className={classes.spellsButton}></div>
        </button>
        <button
          className={classes.dashboardButton}
          title="Wait"
          disabled={notAllowedToAct || phase === 'wait'}
          onClick={this.props.onWait}
        >
          <div className={classes.waitButton}></div>
        </button>
        <button
          className={classes.dashboardButton}
          title="Defend"
          disabled={notAllowedToAct}
          onClick={this.props.onDefend}
        >
          <div className={classes.defendButton}></div>
        </button>
      </div>
    )
  }
}

export default withTranslation()(CombatDashboard)
