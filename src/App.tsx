import React from 'react';
import { Provider } from 'react-redux';
import configureStore from "./redux/configureStore";
import { CssBaseline } from "@material-ui/core";
import { ThemeProvider } from '@material-ui/core/styles';
import theme from './theme';
import InnerAppContainer from "./inner-app";

const store = configureStore();

function App() {
    return (
        <Provider store={store}>
            <ThemeProvider theme={theme}>
                <CssBaseline />
                <InnerAppContainer />
            </ThemeProvider>
        </Provider>
    )
}

export default App;
