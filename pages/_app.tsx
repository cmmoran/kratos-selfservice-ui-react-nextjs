import "../styles/globals.css"
import { theme, globalStyles, ThemeProps } from "@ory/themes"
import type { AppProps } from "next/app"
import { ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import { ThemeProvider } from "styled-components"
import { createGlobalStyle } from "styled-components"

const GlobalStyle = createGlobalStyle((props: ThemeProps) =>
  globalStyles(props),
)
if (process.env.THEME !== undefined) {
  Object.assign(theme, {
    primary30: (theme as any)[`${process.env.THEME}30`],
    primary60: (theme as any)[`${process.env.THEME}60`],
    primary70: (theme as any)[`${process.env.THEME}70`],
  })
}
function MyApp({ Component, pageProps }: AppProps) {
  return (
    <div data-testid="app-react">
      <ThemeProvider theme={theme}>
        <GlobalStyle />
        <Component {...pageProps} />
        <ToastContainer />
      </ThemeProvider>
    </div>
  )
}

export default MyApp
