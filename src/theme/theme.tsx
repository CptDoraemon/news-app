import {createTheme, responsiveFontSizes} from "@material-ui/core/styles";
import {Theme} from "@material-ui/core";
import {inter, mierB} from "./fonts";

const baseFontFamily = [
  '-apple-system',
  'BlinkMacSystemFont',
  '"Segoe UI"',
  'Roboto',
  '"Helvetica Neue"',
  'Arial',
  'sans-serif',
  '"Apple Color Emoji"',
  '"Segoe UI Emoji"',
  '"Segoe UI Symbol"',
];

const titleTypography = {
  fontFamily: ['"MierB"', ...baseFontFamily].join(','),
  fontWeight: 700
}

let theme = createTheme({
  palette: {
    primary: {
      main: '#333333',
      contrastText: '#fff',
    },
    secondary: {
      main: '#1EB980',
      contrastText: '#fff',
    },
  },
  typography: {
    fontFamily: ['"Inter"', ...baseFontFamily].join(','),
    h1: titleTypography,
    h2: titleTypography,
    h3: titleTypography,
    h4: titleTypography,
    h5: titleTypography,
    h6: titleTypography,
    button: {
      fontFamily: ['"MierB"', ...baseFontFamily].join(','),
      fontWeight: 500
    }
  },
  overrides: {
    MuiCssBaseline: {
      '@global': {
        // @ts-ignore
        '@font-face': [...inter, ...mierB],
      },
    },
  },
});
theme = responsiveFontSizes(theme);

export const MOBILE = (theme: Theme) => theme.breakpoints.down('sm');

export default theme;
