import React from 'react'
import './App.css'
import RouterWrapper from './containers/Router'

function App () {
  return (
    // <AdventureMap />
    <>
      <div style={{
        position: 'fixed',
        zIndex: 100,
        top: 0,
        height: '2px',
        width: '100vw',
        backgroundColor: 'gold'
      }}/>
      <RouterWrapper />
      <div style={{
        position: 'fixed',
        zIndex: 100,
        bottom: 0,
        height: '2px',
        width: '100vw',
        backgroundColor: 'gold'
      }}/>
    </>
  )
}

export default App
