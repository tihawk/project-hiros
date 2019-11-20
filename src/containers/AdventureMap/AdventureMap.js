import React, { Component } from 'react'
import { withTranslation } from 'react-i18next'
import Battlefield from '../Battlefield/Battlefield'
import './AdventureMap.module.css'

class AdventureMap extends Component {
  render () {
    return (
      <div>
        <Battlefield />
      </div>
    )
  }
}

export default withTranslation()(AdventureMap)
