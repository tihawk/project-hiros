import React from 'react'
import {
  HashRouter as Router,
  // BrowserRouter as Router,
  Switch,
  Route
} from 'react-router-dom'
import Battlefield from '../Battlefield/Battlefield'
import Lobby from '../Lobby'
import MainMenu from '../MainMenu'

function RouterWrapper () {
  return (
    <Router>
      <Switch>
        <Route exact path='/' component={MainMenu} />
        <Route exact path='/main/:id' component={MainMenu} />
        <Route exact path='/battle' component={Battlefield} />
      </Switch>
    </Router>
  )
}

export default RouterWrapper
