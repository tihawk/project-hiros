import React from 'react'
import styled from 'styled-components'

const Container = styled.div`
  overflow: hidden;
  width: ${({ width }) => width}px;
  height: ${({ height }) => height}px;
  transform-origin: top left;
  transform: scale(${({ scale }) => `${scale.x}, ${scale.y}`}) translate(${({ scale }) => scale.x > 0 ? -38 : -50}%, -55%);
`
const Image = styled.img`
  transform: translate(-${({ left }) => left}px, -${({ top }) => top}px);
`

const Tile = ({ src, tile, scale }) => {
  return (
    <Container
      width={tile.width}
      height={tile.height}
      scale={scale}
    >
      <Image src={src} left={tile.left} top={tile.top}/>
    </Container>
  )
}

export default Tile
