import {createMuiTheme, responsiveFontSizes} from "@material-ui/core/styles";

let theme = createMuiTheme({
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
});
theme = responsiveFontSizes(theme);
theme.typography.h1 = {
    fontFamily: [
        'Anton',
        'sans-serif',
    ].join(','),
    fontWeight: 400,
    fontSize: '2rem',
    [theme.breakpoints.up('md')]: {
        fontSize: '2.5rem',
    },
    fontStyle: "normal",
    color: "inherit"
};

export default theme;