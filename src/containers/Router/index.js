import React from 'react'
import {
  BrowserRouter as Router,
  Switch,
  Route
} from 'react-router-dom'
import Battlefield from '../Battlefield/Battlefield'
import Lobby from '../Lobby'

function RouterWrapper () {
  return (
    <Router>
      <Switch>
        <Route exact path='/' component={Lobby}/>
        <Route exact path='/battle' component={Battlefield}/>
      </Switch>
    </Router>
  )
}

export default RouterWrapper
