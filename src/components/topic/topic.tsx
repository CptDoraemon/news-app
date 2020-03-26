import React, {useEffect, useRef, useState} from "react";
import makeStyles from "@material-ui/core/styles/makeStyles";
import TopicCovid19Map from "./topic-covid19-map";
import Link from '@material-ui/core/Link';
import Typography from '@material-ui/core/Typography';
import {Box} from "@material-ui/core";

const useStyles = makeStyles(theme => ({
    root: {
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'flex-start',
        padding: theme.spacing(2, 0, 10, 0),
        [theme.breakpoints.down('sm')]: {
            padding: theme.spacing(2, 0, 20, 0)
        }

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
    heading: {
        fontFamily: 'Open Sans,sans-serif',
        fontSize: '1.25rem',
        textTransform: 'capitalize',
        color: theme.palette.primary.main,
        margin: theme.spacing(0,0,2,0)
    }
}));

interface TopicProps {

}

const Topic: React.FC<TopicProps> = () => {
    const classes = useStyles();


    return (
        <div className={classes.root}>
            <div className={classes.widthWrapper}>
                <h1 className={classes.heading}>The spread of COVID-19</h1>
            </div>
            <TopicCovid19Map/>
            <div className={classes.widthWrapper}>
                <Box mx={5}>
                    <p>
                        <span>Data retrieved from </span>
                        <span>
                            <Link href='https://graphics.reuters.com/CHINA-HEALTH-MAP/0100B59S39E/index.html' target='_blank' rel="noopener noreferrer" style={{color: '#f35c19'}}>
                                Reuters.com
                            </Link>
                        </span>
                        <span>, not updated in realtime.</span>
                    </p>
                </Box>
            </div>
        </div>
    )
};

export default Topic