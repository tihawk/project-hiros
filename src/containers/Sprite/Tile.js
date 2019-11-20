import React from 'react'
import styled from 'styled-components'

const Container = styled.div`
  overflow: hidden;
  width: ${({ width }) => width}px;
  width: ${({ height }) => height}px;
  transform: scale(${({ scale }) => `${scale}, ${scale}`}) translate(-50%, -50%);
  transform-origin: top center;
`
const Image = styled.img`
  transform: translate(-${({ left }) => left}px, 0);
`

const Tile = ({ src, tile, state, scale }) => {
  const left = tile.width * state
  return (
    <Container
      width={tile.width}
      height={tile.height}
      scale={scale}
    >
      <Image src={src} left={left}/>
    </Container>
  )
}

export default Tile
