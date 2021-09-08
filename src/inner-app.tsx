import React from "react";
import {Box, makeStyles} from "@material-ui/core";
import Attribution from "./components/attribution";
import CopyLinkSnackBarContainer from "./containers/copy-link-snackbar-container";
import Analytics from "./components/analytics/analytics";
import Topic from "./components/topic/topic";
import {
  BrowserRouter as Router,
  Switch,
  Route
} from "react-router-dom";
import Header from "./components/header/header";
import ArticlesContainer from "./components/articles/articles-container";
import Search from "./components/search/search";
import routers from "./routers";
import ArticleByIdContainer from "./components/article-by-id/article-by-id-container";

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100vw',
    maxWidth: '100%',
    // overflowX: 'hidden',
    // paddingBottom: '10px',
    // overflowX is causing y-axis scroll problem, pb do the hack,
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'flex-start'
  },
  header: {
    width: '100%',
    flex: '0 0 auto'
  },
  mainArea: {
    width: '100%',
    flex: '1 1 auto'
  },
  attribution: {
    width: '100%',
    flex: '0 0 auto'
  }
}));

interface InnerAppProps {
}

function InnerApp(props: InnerAppProps) {
  const classes = useStyles();

  return (
    <Router basename={'/news-app'}>
      <Box className={classes.root} style={{minHeight: `${window.innerHeight}px`}}>
        <div className={classes.header}>
          <Header/>
        </div>
        <div className={classes.mainArea}>
          <Switch>
            <Route path={routers.root.path} exact render={() => <ArticlesContainer/>}/>
            <Route path={routers.search.path} exact render={() => <Search/>}/>
            <Route path={routers.topic.path} exact component={Topic}/>
            <Route path={routers.analytics.path} exact component={Analytics}/>
            <Route path={routers.article.path} exact component={ArticleByIdContainer}/>
          </Switch>
        </div>
        <div className={classes.attribution}>
          <Attribution/>
        </div>
        <CopyLinkSnackBarContainer/>
      </Box>
    </Router>
  )
}

export default InnerApp;
