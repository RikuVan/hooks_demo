import React, { useState, useContext } from "react"
import { getImagesConcurrently, getBreeds } from "./api"
import { useApi } from "./useApi"
import { useObservable } from "./useObservable"
import { Nav, LButton, ArrowButtons, Arrow, Main, Pic, LoadingSpinner, Flex } from "./components.js"
import randomColor from "randomcolor"
import * as P from "polished"
import "./App.css"
import { zip, interval, empty } from "rxjs"
import { switchMap } from "rxjs/operators"

import { ThemeContext } from "./StyleContext"

function useToggle(initial) {
  const [isToggled, setToggled] = useState(initial)
  return [isToggled, () => setToggled(!isToggled)]
}

function App() {
  const api = useApi(getImagesConcurrently, getBreeds)
  const [autoTransition, pause] = useToggle(true)
  const [delay, setDelay] = useState(2000)
  const { theme } = useContext(ThemeContext)
  const superColor = randomColor({ luminosity: theme.light })

  useObservable(
    (delay$, shouldTransition$) =>
      zip(delay$, shouldTransition$).pipe(
        switchMap(([delay, shouldTransition]) => (shouldTransition ? interval(delay) : empty()))
      ),
    {
      next: api.incIndex
    },
    [delay, autoTransition]
  )

  return (
    <div style={{ backgroundColor: P.lighten(0.1, superColor), height: "180vh", padding: "10px" }}>
      <Nav>
        {api.letters.map((letter, i) => (
          <LButton
            key={i}
            data-images-index={i}
            color={superColor}
            onClick={() => api.setIndex(i)}
            active={i === api.imagesIndex}
          >
            {letter}
          </LButton>
        ))}
      </Nav>
      <ArrowButtons>
        <Arrow onClick={api.decIndex}>&#8592;</Arrow>
        <Arrow onClick={api.incIndex}>&#8594;</Arrow>
      </ArrowButtons>
      <Flex column>
        <LButton onClick={pause}>{autoTransition ? "Pause" : "Resume"}</LButton>
        <p>Delay ({delay / 1000} seconds)</p>
        <input
          type="range"
          min="0"
          max="5000"
          step="200"
          value={delay}
          onChange={e => setDelay(+e.target.value)}
          style={{ width: "200px" }}
        />
      </Flex>
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
