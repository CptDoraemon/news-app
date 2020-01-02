import React, {useEffect} from 'react';
import './App.css';
import {connect, Provider} from 'react-redux';
import configureStore from "./redux/configureStore";
import {InitState} from "./redux/reducers";
import {categories, Categories, fetchArticles} from "./redux/actions";
import {Box, CssBaseline} from "@material-ui/core";
import Header from "./components/header/header";


const store = configureStore();

const HeaderContainer = connect()(Header);

function InnerApp(props: any) {
    useEffect(() => {
        props.dispatch(fetchArticles(Categories.HEADLINE))
    }, []);
    return (
        <Box width={'100vw'} minHeight={'100vh'} maxWidth={'100%'}>
            <HeaderContainer headers={categories}/>
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
