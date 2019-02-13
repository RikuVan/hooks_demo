import React from "react"
import { useApi, getImagesConcurrently, getBreeds } from "./api"
import { Nav, LetterButton, ArrowButtons, Arrow, Main, Pic, LoadingSpinner } from "./components.js"
import randomColor from "randomcolor"
import * as P from "polished"
import "./App.css"

function App() {
  const superColor = randomColor({ luminosity: "light" })
  const api = useApi(getImagesConcurrently, getBreeds)
  return (
    <div style={{ backgroundColor: P.lighten(0.1, superColor), height: "180vh", padding: "10px" }}>
      <Nav>
        {api.letters.map((letter, i) => (
          <LetterButton
            key={i}
            data-images-index={i}
            color={superColor}
            onClick={() => api.setIndex(i)}
            active={i === api.imagesIndex}
          >
            {letter}
          </LetterButton>
        ))}
      </Nav>
      <ArrowButtons>
        <Arrow onClick={api.decIndex}>&#8592;</Arrow>
        <Arrow onClick={api.incIndex}>&#8594;</Arrow>
      </ArrowButtons>
      <Main>
        {!api.loading ? (
          api.images.map((src, i) => (
            <Pic src={src} key={src} name={api.breeds[api.imagesIndex][i]} />
          ))
        ) : (
          <LoadingSpinner color={superColor} />
        )}
      </Main>{" "}
    </div>
  )
}

export default App
