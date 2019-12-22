import React, { Component } from 'react'
import classes from './MainMenu.module.css'
import MainMenu from './MainMenu'
import Lobby from '../Lobby'

class MainWrapper extends Component {
  state = {
    currentMenu: null
  }

  componentDidUpdate (prevProps) {
    if (prevProps.history.location.pathname !== this.props.history.location.pathname) {
      console.log(this.props.history.location.pathname)
      this.setState({ currentMenu: this.props.history.location.pathname })
    }
  }

  render () {
    const currentMenu = this.props.history.location.pathname
    console.log(currentMenu)
    console.log(this.props.history.location.pathname)
    console.log(window.location)
    return (
      <div className={classes.mainMenu} >
        {currentMenu === '/' && <MainMenu history={this.props.history} />}
        {currentMenu === '/main/lobby' && <Lobby history={this.props.history} />}
      </div>
    )
  }
}

export default MainWrapper
