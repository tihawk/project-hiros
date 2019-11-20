import React from 'react'
import styled from 'styled-components'

const Container = styled.div`
  overflow: hidden;
  width: ${({ width }) => width}px;
  height: ${({ height }) => height}px;
  transform-origin: bottom left;
  transform: scale(${({ scale }) => `${scale}, ${scale}`}) translate(50%, -50%);
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
