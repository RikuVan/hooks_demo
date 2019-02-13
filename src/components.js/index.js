import styled, { keyframes, createGlobalStyle } from "styled-components"
import * as React from "react"
import * as P from "polished"

createGlobalStyle`
  * {
    font-family: BlinkMacSystemFont, "Segoe UI", Helvetica, sans-serif;
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }
`

export const LetterButton = styled.button`
  display: flex;
  min-width: 10px;
  border-radius: 3px;
  font-size: 1rem;
  text-transform: uppercase;
  padding: 5px;
  margin: 5px;
  border: 2px solid black;
  background: ${({ active, color }) => (active ? P.darken(0.2, color) : "white")};
`

export const Nav = styled.nav`
  display: flex;
  justify-content: center;
  align-items: space-around;
`

export const ArrowButtons = styled.div`
  display: flex;
  justify-content: center;
  align-items: space-around;
  button:last-of-type {
    margin-left: 3px;
  }
  padding-top: 10px;
`

export const Arrow = styled.button`
  padding: 5px 14px;
  font-size: 1.5rem;
  border: 2px solid black;
  border-radius: 3px;
  background: #fff;
`

export const Main = styled.main`
  display: grid;
  grid-gap: 10px;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  padding: 20px;
  min-height: 20vh;
`

const loading = keyframes`
	to { transform: rotate(360deg); }
}
`

const Spinner = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: ${({ color }) => P.lighten(0.1, color)};

  border-top: 4px solid #fff;
  border-right: 4px solid #fff;
  border-bottom: 4px solid ${({ color }) => P.darken(0.2, color)};
  border-left: 4px solid ${({ color }) => P.darken(0.2, color)};

  animation: ${loading} 1.2s infinite linear;
`

const SpinnerWrapper = styled.div`
  position: absolute;
  top: 25%;
  left: 50%;
  margin: -20px 0 0 -20px;
  background: ${({ color }) => P.lighten(0.1, color)};
`

export const LoadingSpinner = ({ color }) => (
  <SpinnerWrapper color={color}>
    <Spinner color={color} />
  </SpinnerWrapper>
)

const Img = styled.img`
  width: 300px;
  height: 300px;
  border: 3px solid black;
  border-radius: 3px;
`

const PicWrapper = styled.div`
  display: flex;
  flex-direction: column;
  flex-wrap: no-wrap;
  justify-content: center;
  align-content: flex-start;
  align-items: center;
  h3 {
    font-weight: 400;
    text-transform: uppercase;
  }
`

export const Pic = ({ name, src }) => (
  <PicWrapper>
    <h3>{name}</h3>
    <Img src={src} alt={name} />
  </PicWrapper>
)

const LinkWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`

const Link = styled.a`
  margin-top: 20px;
  padding: 1em 2.5em;
  border-radius: 3px;
  background-color: ${({ color }) => P.darken(0.4, color)};
  color: #fff;
  font-size: 1rem;
  text-decoration: none;
`

export const SourceLink = ({ color }) => (
  <LinkWrapper>
    <Link href="https://glitch.com/edit/#!/handsomely-twister" color={color}>
      SOURCE
    </Link>
  </LinkWrapper>
)
