import Document, { Head, Main, NextScript } from 'next/document'
import { extractCritical } from 'emotion-server'
import { injectGlobal } from 'emotion'

import theme from '../lib/theme'

injectGlobal`
  html, body {
    font-family: 'Montserrat',
      -apple-system,
      BlinkMacSystemFont,
      "Segoe UI",
      "Roboto",
      "Roboto Light",
      "Oxygen",
      "Ubuntu",
      "Cantarell",
      "Fira Sans",
      "Droid Sans",
      "Helvetica Neue",
      sans-serif,
      "Apple Color Emoji",
      "Segoe UI Emoji",
      "Segoe UI Symbol";
    color: ${theme.colors.gray[8]};
    width: 100%;
    height: 100%;
    padding: 0;
    margin: 0;
    overflow: hidden;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }
  
  body > div:first-of-type, 
  #app, 
  #__next, 
  #__next > div {
    display: flex;
    flex: 1;
    height: 100%;
  }
  
  * {
    box-sizing: border-box;
  }
  
  button {
    text-decoration: none;
    text-align: center;
    cursor: pointer;
    user-select: none;
    border: none;
    background: none;
    font-size: ${theme.fontSizes[1]};
    margin: 0;
    padding: 0;
    
    &:hover,
    &:active {
      outline: none;
    }
  }
  
  a {
    color: ${theme.colors.grape[5]};
    text-decoration: none;
    cursor: pointer;
    &:hover {
      color: ${theme.colors.grape[8]};
    }
  }
`

export default class MyDocument extends Document {
  static getInitialProps ({ renderPage }) {
    const page = renderPage()
    const styles = extractCritical(page.html)
    return { ...page, ...styles }
  }

  constructor (props) {
    super(props)
    const { __NEXT_DATA__, ids } = props
    if (ids) {
      __NEXT_DATA__.ids = this.props.ids
    }
  }

  render () {
    return (
      <html>
        <Head>
          <title>Beats with emotion</title>
          <meta name='viewport' content='width=device-width, initial-scale=1' />
          <style dangerouslySetInnerHTML={{ __html: this.props.css }} />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </html>
    )
  }
}
