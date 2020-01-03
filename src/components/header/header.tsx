import React, {useState} from "react";
import './header.css'
import {Categories, fetchArticles} from "../../redux/actions";
import {
    AppBar,
    Box,
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
        <AppBar color="default" position={'static'}>
            <Toolbar>
                <Container>
                    <Typography align={"center"} className={classes.toolbar} color={'primary'}>
                        <Box fontWeight={700} fontSize={'h4.fontSize'}>
                            News Canada
                        </Box>
                    </Typography>
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