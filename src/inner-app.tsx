import {State} from "./redux/state";
import React from "react";
import {Box, makeStyles} from "@material-ui/core";
import {Category} from "./redux/actions/category";
import Attribution from "./components/attribution";
import CopyLinkSnackBarContainer from "./containers/copy-link-snackbar-container";
import {fetchArticles} from "./redux/actions/articles";
import {connect} from "react-redux";
import Analytics from "./components/analytics/analytics";
import Topic from "./components/topic/topic";
import SearchedArticles from "./components/articles/searched-articles/searched-articles";
import {
    BrowserRouter as Router,
    Switch,
    Route
} from "react-router-dom";
import Header from "./components/header/header";
import Articles from "./components/articles/articles";

const useStyles = makeStyles((theme) => ({
    root: {
        width: '100vw',
        maxWidth: '100%',
        // minHeight: '100vh',
        // overflowX: 'hidden',
        // paddingBottom: '10px',
        // overflowX is causing y-axis scroll problem, pb do the hack,
        position: 'relative'
    },
    attribution: {
        position: 'absolute',
        zIndex: theme.zIndex.appBar,
        left: 10,
        bottom: 10
    }
}));

interface InnerAppProps {}

function InnerApp(props: InnerAppProps) {
    const classes = useStyles();

    return (
        <Router>
            <Box className={classes.root} style={{minHeight: `${window.innerHeight}px`}}>
                <Header/>
                    <Switch>
                        <Route path={'/'} exact render={() => <Articles />} />
                        <Route path={'/search'} exact render={() => <SearchedArticles />} />
                        <Route path={'/topic'} exact component={Topic} />
                        <Route path={'/analytics'} exact component={Analytics} />
                    </Switch>
                <div className={classes.attribution}>
                    <Attribution />
                </div>
                <CopyLinkSnackBarContainer />
            </Box>
        </Router>
    )
}

export default InnerApp;
