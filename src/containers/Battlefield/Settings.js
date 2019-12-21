import React, { Component } from 'react'
import { withTranslation } from 'react-i18next'
import Modal from '../../components/Modal'
// import i18n from '../../utility/i18next/i18next'
import i18n from 'i18next'

class Settings extends Component {
  constructor (props) {
    super(props)
    this.state = {
      lng: i18n.language
    }
  }

  componentDidMount () {
    console.log(this.props)
  }

  changeLanguage = e => {
    e.preventDefault()
    this.setState({ lng: e.target.value })
    i18n.changeLanguage(e.target.value)
  }

  render () {
    const { show, onClose } = this.props
    const { lng } = this.state
    return (
      <Modal
        show={show}
        onClose={onClose}
        cancelable >
        <select
          value={lng}
          onChange={this.changeLanguage}
        >
          <option
            value="bg">Български</option>
          <option
            value="en">English</option>
          <option
            value="de">Deutsch</option>
        </select>
      </Modal>
    )
  }
}

export default withTranslation()(Settings)
