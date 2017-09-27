import { css, fontFace } from 'emotion'
import colors from 'open-color'
import { constants } from 'styled-system'

const { breakpoints, space, fontSizes } = constants

fontFace`
  font-family: 'Montserrat';
  font-style: normal;
  font-weight: 400;
  src: local('Montserrat Regular'), local('Montserrat-Regular'), url(https://fonts.gstatic.com/s/montserrat/v10/zhcz-_WihjSQC0oHJ9TCYAzyDMXhdD8sAj6OAJTFsBI.woff2) format('woff2');
  unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2212, U+2215;
`
fontFace`
  font-family: 'Montserrat';
  font-style: normal;
  font-weight: 300;
  src: local('Montserrat Light'), local('Montserrat-Light'), url(https://fonts.gstatic.com/s/montserrat/v10/IVeH6A3MiFyaSEiudUMXEweOulFbQKHxPa89BaxZzA0.woff2) format('woff2');
  unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2212, U+2215;
`

const utils = {
  aspectRatio: (width, height) => css`
    position: relative;
    &:before {
      display: block;
      content: "";
      width: 100%;
      padding-top: ${height / width * 100}%;
    }
    & > .aspect-ratio-content {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
    }
  `,
  hoverStyles: css`
    cursor: pointer;
    &:hover {
      color: ${colors.green[5]};
    }
  `
}

export default {
  bp: breakpoints,
  colors,
  fontSizes,
  space,
  utils
}
