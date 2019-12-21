import React from 'react'
import {
  HashRouter as Router,
  // BrowserRouter as Router,
  Switch,
  Route
} from 'react-router-dom'
import Battlefield from '../Battlefield/Battlefield'
import Lobby from '../Lobby'

function RouterWrapper () {
  return (
    <Router>
      <Switch>
        <Route exact path='/' render={(props) => <Lobby {...props} />}/>
        <Route exact path='/battle' render={(props) => <Battlefield {...props} />}/>
      </Switch>
    </Router>
  )
}

export default RouterWrapper
