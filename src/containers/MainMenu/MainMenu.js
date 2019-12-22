import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import socket from '../../utility/socket'
import { connect } from 'react-redux'
import * as actions from '../../store/actions'
import { withTranslation } from 'react-i18next'
import classes from './MainMenu.module.css'
import Modal from '../../components/Modal'

class Lobby extends Component {
  state = {
    showModal: false
  }

  componentDidMount () {
  }

  openModal = e => {
    e.preventDefault()
    this.setState({ showModal: true })
  }

  render () {
    const { showModal } = this.state
    return (
      <>
        <Modal
          show={showModal}
          onClose={this.handleCreateGame}
          cancelable
          onCancel={this.handleCancelCreateGame}
        >
          <label>Enter new battle name</label>
          <input value={this.state.newGame} onChange={this.changeNewGameName} />
        </Modal>
        <div className={classes.menuTitle} >
          <div className={classes.menuSubtile} >
            <span>Main Menu</span>
          </div>
        </div>
        <div className={classes.menuPanel} >
          <div className={classes.redPanel} >
            <div className={classes.menuSubtile} >
              <Link to='/main/lobby' >
                Lobby
              </Link>
            </div>
          </div>
          {/* {Object.keys(battles).length > 0
            ? Object.keys(battles).map((battle, index) => {
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
            })
            : <div className={classes.redPanel} >
              <div className={classes.menuSubtile} >
                <span>No battles currently fought</span>
              </div>
            </div>
          } */}
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
