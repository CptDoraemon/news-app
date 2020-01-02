import React, {useEffect, useState} from "react";
import './header.css'
import {Categories, fetchArticles, setCategoryIfNeeded} from "../../redux/actions";
import {
    AppBar,
    Box,
    Container,
    Grid,
    makeStyles,
    Tab,
    Tabs,
    Theme,
    Toolbar,
    Typography,
    withWidth
} from "@material-ui/core";
import {DispatchProp} from "react-redux";


const useStyles = makeStyles((theme: Theme) => ({
    tab: {
        flexShrink: 0,
        flexGrow: 1
    },
    toolbar: {
        textTransform: 'uppercase'
    }
}));

interface HeaderProps {
    headers: Array<keyof typeof Categories>,
    dispatcher: any
}

function Header(props: HeaderProps) {
    const classes = useStyles();
    const [category, setCategory] = useState(0);
    const clickHandler = (i: number) => {
        if (i === category) return;
        setCategory(i);
        props.dispatcher(fetchArticles((props.headers[i])));
    };

    return (
        <AppBar position="static" color="default">
            <Toolbar>
                <Container>
                    <Typography variant="h5" align={"center"} className={classes.toolbar}>News Canada</Typography>
                </Container>
            </Toolbar>
            <Tabs
                value={category}
                indicatorColor="primary"
                textColor="primary"
                variant="scrollable"
                scrollButtons="auto"
            >
                {
                    props.headers.map((_, i) => <Tab label={_} key={i} className={classes.tab} onClick={() => clickHandler(i)}/>)
                }
            </Tabs>
        </AppBar>
    )
}

export default Header;