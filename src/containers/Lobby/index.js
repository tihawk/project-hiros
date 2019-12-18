import React, { Component } from 'react'
import socketIOClient from 'socket.io-client'
import { withTranslation } from 'react-i18next'
import classes from './Lobby.module.css'

class Lobby extends Component {
  state = {
    endpoint: 'http://localhost:5000',
    battles: {},
    nickname: String(Math.random())
  }

  componentDidMount () {
    const { endpoint } = this.state
    this.socket = socketIOClient(endpoint, {
      transportOptions: {
        polling: {
          extraHeaders: {
            'x-clientid': this.state.nickname
          }
        }
      }
    })
    this.socket.on('battles-list', data => {
      this.setState({ ...data })
    })
    // window.addEventListener('beforeunload', e => {
    //   e.preventDefault()
    //   this.playerDisconnect()
    // })
  }

  handleJoinBattle = (battleName, e) => {
    e.preventDefault()
    console.log(battleName)
    this.socket.emit('join-battle', { battleName })
    this.props.history.push('/battle')
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
    if (battles.game1) console.log(battles.game1.players)
    return (
      <div className={classes.battlesLobby} >
        <div className={classes.redPanel} >
          <div className={classes.menuSubtile} >
            <button>
            Create new game
            </button>
          </div>
        </div>
        {Object.keys(battles).map((battle, index) => {
          return (
            <div className={classes.redPanel} >
              <div className={classes.menuSubtile} key={index} >
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

export default withTranslation()(Lobby)
