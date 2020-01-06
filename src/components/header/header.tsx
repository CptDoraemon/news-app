import React from "react";
import {Categories, fetchArticles, setCategoryIfNeeded} from "../../redux/actions";
import {AppBar, Container, makeStyles, Tab, Tabs, Theme, Toolbar, Typography,} from "@material-ui/core";


const useStyles = makeStyles((theme: Theme) => ({
    tab: {
        flexShrink: 0,
        flexGrow: 1,
        color: theme.palette.primary.contrastText
    },
    toolbar: {
        textTransform: 'uppercase'
    }
}));

interface HeaderProps {
    headers: Array<keyof typeof Categories>,
    dispatcher: any,
    category: Categories
}

function Header(props: HeaderProps) {
    const classes = useStyles();
    const clickHandler = (category: Categories) => {
        props.dispatcher(setCategoryIfNeeded(category));
    };

    return (
        <AppBar color="primary" position={'static'}>
            <Toolbar>
                <Container>
                    <Typography align={"center"} className={classes.toolbar} variant={"h1"} component={'h1'}>
                        News Canada
                    </Typography>
                </Container>
            </Toolbar>
                <Tabs
                    value={props.headers.indexOf(props.category)}
                    indicatorColor="secondary"
                    textColor="secondary"
                    variant="scrollable"
                    scrollButtons="auto"
                >
                    {
                        props.headers.map((_, i) => <Tab label={_} key={i} className={classes.tab} onClick={() => clickHandler(Categories[_])}/>)
                    }
                </Tabs>
        </AppBar>
    )
}

export default Header;