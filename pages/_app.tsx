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
Object.assign(theme, {
    primary30: '#9DC2FF',
    primary60: '#2979FF',
    primary70: '#2264D1',

    borderRadius: '4px',
});
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
