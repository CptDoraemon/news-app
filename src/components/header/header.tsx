import React, {useRef} from "react";
import {AppBar, Grid, Tab, Tabs, Theme, Toolbar, Tooltip, Typography,} from "@material-ui/core";
import { makeStyles } from '@material-ui/core/styles';
import {Categories, Category} from "../../redux/actions/category";
import StickyComponent from "../utility-components/sticky-component";
import IconButton from '@material-ui/core/IconButton';
import AssessmentIcon from '@material-ui/icons/Assessment';
import CollectionsBookmarkIcon from '@material-ui/icons/CollectionsBookmark';
import Zoom from "@material-ui/core/Zoom";
import HeaderSearch from "./header-search";
import useTheme from "@material-ui/core/styles/useTheme";


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
        justifyContent: 'center',
        whiteSpace: 'nowrap'
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
    headers: Categories,
    category: Category,
    goToSearch: (keyword: string) => void,
    goToAnalytics: () => void,
    goToTopic: () => void,
    setCategory: (category: Category) => void
}

const Header: React.FC<HeaderProps> = ({headers, category, goToSearch, goToAnalytics, setCategory, goToTopic}) => {
    const classes = useStyles();
    const appBarRef = useRef<HTMLDivElement>(null);
    const theme = useTheme();

    return (
        <>
        <AppBar color="primary" position={'static'} ref={appBarRef} className={classes.appBarNoBoxShadow}>
            <Toolbar>
                <Grid container>
                    <Grid item xs={1} md={3}>

                    </Grid>
                    <Grid item xs={5} md={6}>
                        <Typography align={"center"} className={classes.heading} variant={"h1"} component={'h1'}>
                            News Canada
                        </Typography>
                    </Grid>
                    <Grid item xs={6} md={3}>
                        <Grid container alignItems={'center'} justify={"flex-end"}>
                            <Grid item>
                                <HeaderSearch goToSearch={goToSearch}/>
                            </Grid>
                            <Grid item>
                                <Tooltip title="Topic: COVID-19" TransitionComponent={Zoom}>
                                    <IconButton aria-label="Topic: COVID-19" color={"inherit"} onClick={goToTopic}>
                                        <CollectionsBookmarkIcon/>
                                    </IconButton>
                                </Tooltip>
                            </Grid>
                            <Grid item>
                                <Tooltip title="Analytics" TransitionComponent={Zoom}>
                                    <IconButton aria-label="news trend" color={"inherit"} onClick={goToAnalytics}>
                                        <AssessmentIcon/>
                                    </IconButton>
                                </Tooltip>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
            </Toolbar>
        </AppBar>
        <StickyComponent
            anchorRef={appBarRef}
            zIndex={theme.zIndex.appBar}>
            <AppBar color="primary" position={'static'} className={classes.appBarBottomBoxShadow}>
                <Tabs
                    value={headers.indexOf(category) === -1 ? false : headers.indexOf(category)}
                    indicatorColor="secondary"
                    textColor="secondary"
                    variant="scrollable"
                    scrollButtons="auto"
                >
                    {
                        headers.map((_, i) => <Tab label={_} key={i} className={classes.tab} onClick={() => setCategory(Category[_])}/>)
                    }
                </Tabs>
            </AppBar>
        </StickyComponent>
        </>
    )
}

export default Header;