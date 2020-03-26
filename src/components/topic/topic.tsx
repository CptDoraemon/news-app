import React, {useEffect, useRef, useState} from "react";
import makeStyles from "@material-ui/core/styles/makeStyles";
import TopicCovid19Map from "./topic-covid19-map";
import {Typography} from "@material-ui/core";
import Box from "@material-ui/core/Box";

const useStyles = makeStyles(theme => ({
    root: {
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'flex-start',
        margin: theme.spacing(5, 0)
    },
    widthWrapper: {
        width: '1000px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'flex-start',
        [theme.breakpoints.down('sm')]: {
            width: '100%'
        }
    },
}));

interface TopicProps {

}

const Topic: React.FC<TopicProps> = () => {
    const classes = useStyles();


    return (
        <div className={classes.root}>
            <div className={classes.widthWrapper}>
                <Typography variant={'h5'} component={'h1'}>
                    <Box fontWeight={700} pb={2}>The spread of COVID-19</Box>
                </Typography>
            </div>
            <TopicCovid19Map/>
            <div className={classes.widthWrapper}>
            </div>
        </div>
    )
};

export default Topic