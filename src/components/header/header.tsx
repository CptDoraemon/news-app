import React, {useState} from "react";
import {Categories, fetchArticles} from "../../redux/actions";
import {
    AppBar,
    Container,

    makeStyles,
    Tab,
    Tabs,
    Theme,
    Toolbar,
    Typography,
} from "@material-ui/core";


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
        <AppBar color="primary" position={'static'}>
            <Toolbar>
                <Container>
                    <Typography align={"center"} className={classes.toolbar} variant={"h1"} component={'h1'}>
                        News Canada
                    </Typography>
                </Container>
            </Toolbar>
                <Tabs
                    value={category}
                    indicatorColor="secondary"
                    textColor="secondary"
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