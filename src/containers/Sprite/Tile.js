import React from 'react'
import styled from 'styled-components'

const Container = styled.div`
  overflow: hidden;
  pointer-events: none;
  width: ${({ width }) => width}px;
  height: ${({ height }) => height}px;
  transform-origin: top left;
  transform: scale(${({ scale }) => `${scale.x}, ${scale.y}`}) translate(${({ scale }) => scale.x > 0 ? -38 : -50}%, -55%);

  
  -webkit-touch-callout: none; /* iOS Safari */
    -webkit-user-select: none; /* Safari */
     -khtml-user-select: none; /* Konqueror HTML */
       -moz-user-select: none; /* Old versions of Firefox */
        -ms-user-select: none; /* Internet Explorer/Edge */
            user-select: none; /* Non-prefixed version, currently
                                supported by Chrome, Opera and Firefox */
  
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
