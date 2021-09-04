import {createTheme, responsiveFontSizes} from "@material-ui/core/styles";
import {Theme} from "@material-ui/core";

const mierB = {
    fontFamily: '"MierB"',
    fontDisplay: 'swap',
    src: `
    url('${process.env.PUBLIC_URL}/assets/fonts/MierB-Bold.woff2') format('woff2')
  `,
};

const inter = {
    fontFamily: '"Inter"',
    fontDisplay: 'swap',
    src: `
    url('${process.env.PUBLIC_URL}/assets/fonts/Inter-Regular.woff2') format('woff2')
  `
};

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
        h6: titleTypography
    },
    overrides: {
        MuiCssBaseline: {
            '@global': {
                // @ts-ignore
                '@font-face': [inter, mierB],
            },
        },
    },
});
theme = responsiveFontSizes(theme);

export const MOBILE = (theme: Theme) => theme.breakpoints.down('sm');

export default theme;
