import React, { Component } from 'react'
import { connect } from 'react-redux'
import * as actions from '../../store/actions'
import { withTranslation } from 'react-i18next'
import classes from './Lobby.module.css'
import socket from '../../socket'
import Modal from '../../components/Modal'

class Lobby extends Component {
  state = {
    battles: {},
    showModal: false,
    newGame: ''
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

  openModal = e => {
    e.preventDefault()
    this.setState({ showModal: true })
  }

  changeNewGameName = e => {
    console.log(e.target.value)
    this.setState({ newGame: e.target.value })
  }

  handleCreateGame = e => {
    e.preventDefault()
    socket.emit('create-battle', this.state.newGame)
    this.setState({ showModal: false })
  }

  render () {
    const { battles, showModal } = this.state
    return (
      <>
        <Modal show={showModal} onClose={this.handleCreateGame} >
          <input value={this.state.newGame} onChange={this.changeNewGameName} />
        </Modal>
        <div className={classes.battlesLobby} >
          <div className={classes.redPanel} >
            <div className={classes.menuSubtile} >
              <button
                onClick={this.handleRefresh}
              >
                Refresh
              </button>
            </div>
          </div>
          <div className={classes.redPanel} >
            <div className={classes.menuSubtile} >
              <button onClick={this.openModal}>
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
      </>
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
