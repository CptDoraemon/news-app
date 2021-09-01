import React from "react";
import {Box, makeStyles} from "@material-ui/core";
import Attribution from "./components/attribution";
import CopyLinkSnackBarContainer from "./containers/copy-link-snackbar-container";
import Analytics from "./components/analytics/analytics";
import Topic from "./components/topic/topic";
import SearchedArticles from "./components/articles/searched-articles/searched-articles";
import {
    BrowserRouter as Router,
    Switch,
    Route
} from "react-router-dom";
import Header from "./components/header/header";
import ArticlesContainer from "./components/articles/articles-container";

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
        margin: theme.spacing(10, 0, 2, 0)
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
                        <Route path={'/'} exact render={() => <ArticlesContainer/>} />
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
