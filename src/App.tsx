import React, {useEffect} from 'react';
import './App.css';
import {connect, Provider} from 'react-redux';
import configureStore from "./redux/configureStore";
import {InitState} from "./redux/reducers";
import {categories, Categories, fetchArticles} from "./redux/actions";
import {Box, CssBaseline} from "@material-ui/core";
import Header from "./components/header/header";
import Articles from "./components/articles/articles";
import Attribution from "./components/attribution";


const store = configureStore();

interface InnerAppProps extends InitState{
    dispatch: any,
}

function InnerApp(props: any) {
    useEffect(() => {
        props.dispatch(fetchArticles(Categories.HEADLINE))
    }, []);
    return (
        <Box width={'100vw'} minHeight={'100vh'} maxWidth={'100%'}>
            <Header headers={categories} dispatcher={props.dispatch}/>
            <Articles articles={props.articles}/>
            <Attribution />
        </Box>
    )
}
function mapStateToProps(state: InitState) {
    return state
}
const InnerAppContainer = connect(mapStateToProps)(InnerApp);

function App() {
    return (
        <Provider store={store}>
            <CssBaseline />
            <InnerAppContainer />
        </Provider>
    )
}



export default App;
