import React, {useRef} from "react";
import {AppBar, Grid, Tab, Tabs, Theme, Toolbar, Tooltip, Typography, Link as MuiLink} from "@material-ui/core";
import { makeStyles } from '@material-ui/core/styles';
import {Categories, Category} from "../../redux/actions/category";
import StickyComponent from "../utility-components/sticky-component";
import IconButton from '@material-ui/core/IconButton';
import AssessmentIcon from '@material-ui/icons/Assessment';
import CollectionsBookmarkIcon from '@material-ui/icons/CollectionsBookmark';
import Zoom from "@material-ui/core/Zoom";
import HeaderSearch from "./header-search";
import useTheme from "@material-ui/core/styles/useTheme";
import {Link} from 'react-router-dom';
import HeaderTabs from "./header-tabs";

const useStyles = makeStyles((theme: Theme) => ({
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
    trendIcon: {
        color: '#FFF'
    }
}));

interface HeaderProps {
}

const Header: React.FC<HeaderProps> = () => {
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
                                <HeaderSearch/>
                            </Grid>
                            <Grid item>
                                <Tooltip title="Topic: COVID-19" TransitionComponent={Zoom}>
                                    <IconButton aria-label="Topic: COVID-19" color={"inherit"} component={Link} to={'/topic'}>
                                        <CollectionsBookmarkIcon/>
                                    </IconButton>
                                </Tooltip>
                            </Grid>
                            <Grid item>
                                <Tooltip title="Analytics" TransitionComponent={Zoom}>
                                    <IconButton aria-label="news trend" color={"inherit"} component={Link} to={'/analytics'}>
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
            <HeaderTabs />
        </StickyComponent>
        </>
    )
}

export default Header;
