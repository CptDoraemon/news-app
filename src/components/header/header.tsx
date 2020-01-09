import React, {useRef} from "react";
import {AppBar, Container, makeStyles, Tab, Tabs, Theme, Toolbar, Typography,} from "@material-ui/core";
import {Categories, Category, setCategoryIfNeeded} from "../../redux/actions/category";
import {useDispatch} from "react-redux";
import StickyComponent from "../utility-components/sticky-component";


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
    headers: Categories
    category: Category
}

function Header(props: HeaderProps) {
    const classes = useStyles();
    const dispatcher = useDispatch();
    const firstAppBarRef = useRef(document.createElement('div'));

    const clickHandler = (category: Category) => {
        dispatcher(setCategoryIfNeeded(category));
    };


    return (
        <>
        <AppBar color="primary" position={'static'} ref={firstAppBarRef}>
            <Toolbar>
                <Container>
                    <Typography align={"center"} className={classes.toolbar} variant={"h1"} component={'h1'}>
                        News Canada
                    </Typography>
                </Container>
            </Toolbar>
        </AppBar>
            <StickyComponent
                fixedStartHeight={firstAppBarRef !== null ? firstAppBarRef.current.getBoundingClientRect().height : 50}
                zIndex={1100}>
                <AppBar color="primary" position={'static'}>
                    <Tabs
                        value={props.headers.indexOf(props.category)}
                        indicatorColor="secondary"
                        textColor="secondary"
                        variant="scrollable"
                        scrollButtons="auto"
                    >
                        {
                            props.headers.map((_, i) => <Tab label={_} key={i} className={classes.tab} onClick={() => clickHandler(Category[_])}/>)
                        }
                    </Tabs>
                </AppBar>
            </StickyComponent>
        </>
    )
}

export default Header;