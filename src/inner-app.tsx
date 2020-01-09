import {State} from "./redux/state";
import React, {useEffect} from "react";
import {Box, makeStyles} from "@material-ui/core";
import Header from "./components/header/header";
import {categories, Category} from "./redux/actions/category";
import ArticlesContainer from "./containers/articles-container";
import Attribution from "./components/attribution";
import CopyLinkSnackBarContainer from "./containers/copy-link-snackbar-container";
import {fetchArticles} from "./redux/actions/articles";
import {connect} from "react-redux";

const useStyles = makeStyles(() => ({
    root: {
        width: '100vw',
        maxWidth: '100%',
        minHeight: '100vh',
        overflowX: 'hidden',
        paddingBottom: '10px',
        // overflowX is causing y-axis scroll problem, pb do the hack
    }
}));

interface InnerAppProps extends Pick<State, 'category' | 'articles'> {
    fetchArticlesAfterMount: () => void
}

function InnerApp(props: InnerAppProps) {
    const classes = useStyles();
    useEffect(() => {
        props.fetchArticlesAfterMount()
    }, []);

    return (
        <Box className={classes.root}>
            <Header headers={categories} category={props.category} />
            <ArticlesContainer articles={props.articles} />
            <Attribution />
            <CopyLinkSnackBarContainer />
        </Box>
    )
}
function mapStateToProps(state: State) {
    return {
        category: state.category,
        articles: state.articles
    }
}
function mapDispatchToProps(dispatch: any) {
    return {
        fetchArticlesAfterMount: () => dispatch(fetchArticles(Category.HEADLINE))
    }
}
const InnerAppContainer = connect(
    mapStateToProps,
    mapDispatchToProps
)(InnerApp);

export default InnerAppContainer;