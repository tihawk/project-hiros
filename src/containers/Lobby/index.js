import React, { Component } from 'react'
import { connect } from 'react-redux'
import * as actions from '../../store/actions'
import { withTranslation } from 'react-i18next'
import classes from './Lobby.module.css'
import socket from '../../socket'

class Lobby extends Component {
  state = {
    battles: {}
  }

  componentDidMount () {
    socket.on('battles-list', data => {
      this.setState({ ...data })
    })
    socket.emit('get-battle-list')
    // window.addEventListener('beforeunload', e => {
    //   e.preventDefault()
    //   this.playerDisconnect()
    // })
  }

  handleRefresh = () => {
    socket.emit('get-battle-list')
  }

  handleJoinBattle = (battleName, e) => {
    e.preventDefault()
    console.log(battleName)
    socket.emit('join-battle', { battleName }, ack => {
      this.props.onSetBattleAddress(ack)
      this.props.history.push('/battle')
    })
  }

  //   playerReady = () => {
  //     console.log('clicked player ready')
  //     this.socket.emit('player-ready')
  //   }

  //   playerDisconnect = () => {
  //     console.log('clicked player disconnect')
  //     this.socket.emit('player-disconnect')
  //   }

  render () {
    const { battles } = this.state
    return (
      <div className={classes.battlesLobby} >
        <div className={classes.redPanel} >
          <div className={classes.menuSubtile} >
            <button
              onClick={this.handleRefresh}
            >
            refresh
            </button>
          </div>
        </div>
        <div className={classes.redPanel} >
          <div className={classes.menuSubtile} >
            <button>
            Create new game
            </button>
          </div>
        </div>
        {Object.keys(battles).map((battle, index) => {
          return (
            <div className={classes.redPanel} key={index} >
              <div className={classes.menuSubtile} >
                <div>{battle}</div>
                <div>Players joined: {battles[battle].players.length}</div>
                <button
                  onClick={ e => this.handleJoinBattle(battle, e)}
                >Join</button>
              </div>
            </div>
          )
        })}
      </div>
    )
  }
}

const mapDispatchToProps = dispatch => {
  return {
    onSetPlayer: (playerData) => dispatch(actions.setPlayerData(playerData)),
    onSetBattleAddress: battle => dispatch(actions.setBattleAddress(battle))
  }
}

export default connect(null, mapDispatchToProps)(withTranslation()(Lobby))
