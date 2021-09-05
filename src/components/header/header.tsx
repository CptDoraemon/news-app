import React, {useRef} from "react";
import {AppBar, Theme, Toolbar, Tooltip, Typography} from "@material-ui/core";
import { makeStyles } from '@material-ui/core/styles';
import StickyComponent from "../utility-components/sticky-component";
import IconButton from '@material-ui/core/IconButton';
import AssessmentIcon from '@material-ui/icons/Assessment';
import CollectionsBookmarkIcon from '@material-ui/icons/CollectionsBookmark';
import SearchIcon from "@material-ui/icons/Search";
import Zoom from "@material-ui/core/Zoom";
import useTheme from "@material-ui/core/styles/useTheme";
import {Link} from 'react-router-dom';
import HeaderTabs from "./header-tabs";
import routers from "../../routers";
import {MOBILE} from "../../theme";

const headerLinks = [
    {
        title: 'Search',
        link: routers.search.path,
        icon: <SearchIcon/>
    },
    {
        title: 'Topic: COVID-19',
        link: routers.topic.path,
        icon: <CollectionsBookmarkIcon/>
    },
    {
        title: 'Analytics',
        link: routers.analytics.path,
        icon: <AssessmentIcon/>
    },
]

const useStyles = makeStyles((theme: Theme) => ({
    appBarNoBoxShadow: {
        boxShadow: 'none'
    },
    trendIcon: {
        color: '#FFF'
    },
    toolbar: {
        width: '100%',
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',
    },
    toolbarTitle: {
        flex: '1 1 auto',
        textTransform: 'uppercase',
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        whiteSpace: 'nowrap',
        lineHeight: 1,
        fontWeight: 900,
        [MOBILE(theme)]: {
            fontSize: theme.typography.h6.fontSize
        }
    },
    toolbarButton: {
        flex: '0 0 auto'
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
            <Toolbar className={classes.toolbar}>
                <Typography align={"center"} className={classes.toolbarTitle} variant={"h4"} component={'h1'}>
                    News Canada
                </Typography>
                {
                    headerLinks.map(data => (
                      <div key={data.title} className={classes.toolbarButton}>
                          <Tooltip title={data.title} TransitionComponent={Zoom}>
                              <IconButton aria-label={data.title} color={"inherit"} component={Link} to={data.link}>
                                  {data.icon}
                              </IconButton>
                          </Tooltip>
                      </div>
                    ))
                }
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
