import React, {useEffect, useRef, useState} from "react";
import makeStyles from "@material-ui/core/styles/makeStyles";
import TopicCovid19Map from "./topic-covid19-map";

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
            <TopicCovid19Map/>

            <div className={classes.widthWrapper}>
            </div>
        </div>
    )
};

export default Topic