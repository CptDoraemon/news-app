import React, {useRef} from "react";
import {AppBar, Grid, Tab, Tabs, Theme, Toolbar, Typography,} from "@material-ui/core";
import { fade, makeStyles } from '@material-ui/core/styles';
import {Categories, Category, setCategoryIfNeeded} from "../../redux/actions/category";
import {useDispatch} from "react-redux";
import StickyComponent from "../utility-components/sticky-component";
import IconButton from '@material-ui/core/IconButton';
import AssessmentIcon from '@material-ui/icons/Assessment';
import HeaderSearchContainer from "../../containers/header-search-container";


const useStyles = makeStyles((theme: Theme) => ({
    tab: {
        flexShrink: 0,
        flexGrow: 1,
        color: theme.palette.primary.contrastText
    },
    heading: {
        textTransform: 'uppercase',
        height: '100%',
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center'
    },
    appBarNoBoxShadow: {
        boxShadow: 'none'
    },
    appBarBottomBoxShadow: {
        boxShadow: '0px 4px 4px -1px rgba(0,0,0,0.2), 0px 5px 5px 0px rgba(0,0,0,0.14), 0px 10px 10px 0px rgba(0,0,0,0.12)'
    },
    trendIcon: {
        color: '#FFF'
    }
}));

interface HeaderProps {
    headers: Categories
    category: Category
}

function Header(props: HeaderProps) {
    const classes = useStyles();
    const dispatcher = useDispatch();
    const appBarRef = useRef(document.createElement('div'));

    const clickHandler = (category: Category) => {
        dispatcher(setCategoryIfNeeded(category));
    };


    return (
        <>
        <AppBar color="primary" position={'static'} ref={appBarRef} className={classes.appBarNoBoxShadow}>
            <Toolbar>
                <Grid container>
                    <Grid item xs={1} md={3}>

                    </Grid>
                    <Grid item xs={7} md={6}>
                        <Typography align={"center"} className={classes.heading} variant={"h1"} component={'h1'}>
                            News Canada
                        </Typography>
                    </Grid>
                    <Grid item xs={4} md={3}>
                        <Grid container alignItems={'center'} justify={"flex-end"}>
                            <Grid item>
                                <HeaderSearchContainer/>
                            </Grid>
                            <Grid item>
                                <IconButton aria-label="news trend" color={"inherit"}>
                                    <AssessmentIcon/>
                                </IconButton>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
            </Toolbar>
        </AppBar>
        <StickyComponent
            fixedStartHeight={appBarRef !== null ? appBarRef.current.offsetTop + appBarRef.current.offsetHeight : 50}
            zIndex={1100}>
            <AppBar color="primary" position={'static'} className={classes.appBarBottomBoxShadow}>
                <Tabs
                    value={props.headers.indexOf(props.category) === -1 ? false : props.headers.indexOf(props.category)}
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