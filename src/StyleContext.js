import { createContext } from "react"

export const ThemeContext = createContext({
  theme: {
    dark: "dark",
    light: "light"
  }
})

