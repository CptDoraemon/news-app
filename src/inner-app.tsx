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
import SearchedArticlesContainer from "./containers/searched-articles-container";
import Analytics from "./components/analytics/analytics";
import HeaderContainer from "./containers/header-container";

const useStyles = makeStyles(() => ({
    root: {
        width: '100vw',
        maxWidth: '100%',
        minHeight: '100vh',
        overflowX: 'hidden',
        paddingBottom: '10px',
        // overflowX is causing y-axis scroll problem, pb do the hack,
        position: 'relative'
    },
    attribution: {
        position: 'absolute',
        left: 10,
        bottom: 10
    }
}));

interface InnerAppProps extends Pick<State, 'category' | 'articles'> {
    fetchArticlesAfterMount: () => void,
}

function InnerApp(props: InnerAppProps) {
    const classes = useStyles();
    useEffect(() => {
        props.fetchArticlesAfterMount()
    }, []);

    const main = () => {
        let component;
        switch (props.category) {
            case Category.ANALYTICS:
                component = <Analytics />;
                break;
            case Category.SEARCH:
                component = <SearchedArticlesContainer/>;
                break;
            default:
                component = <ArticlesContainer articles={props.articles} />;
        }

        return component
    };

    return (
        <Box className={classes.root}>
            <HeaderContainer/>
            {
                main()
            }
            <div className={classes.attribution}>
                <Attribution />
            </div>
            <CopyLinkSnackBarContainer />
        </Box>
    )
}
function mapStateToProps(state: State) {
    return {
        category: state.category,
        articles: state.articles,
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