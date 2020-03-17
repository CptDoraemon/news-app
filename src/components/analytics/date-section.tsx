import React, {useRef} from "react";
import CountUp from 'react-countup';
import makeStyles from "@material-ui/core/styles/makeStyles";
import {Typography} from "@material-ui/core";
import Box from "@material-ui/core/Box";
import useLazyLoad from "../../tools/use-lazy-load";
import Fade from "@material-ui/core/Fade";

const useStyles = makeStyles(theme => ({
    root: {
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center'
    }
}));

interface RollingNumberSection {
    text: string,
    number: number
}

const DateSection: React.FC<RollingNumberSection> = ({text, number}) => {
    const classes = useStyles();
    const containerRef = useRef<HTMLDivElement>(null);
    const isVisible = useLazyLoad(containerRef);

    const date = new Date(number);

    return (
        <Fade in={isVisible} timeout={2000}>
            <div className={classes.root} ref={containerRef}>
                <Typography variant={'body2'} component={'h2'}>
                    <Box>{ text }</Box>
                </Typography>
                <Typography variant={'h2'} component={'p'}>
                    <DateComponent isVisible={isVisible} number={date.getUTCFullYear()} start={2000}/>
                    -
                    <DateComponent isVisible={isVisible} number={date.getUTCMonth() + 1}/>
                    -
                    <DateComponent isVisible={isVisible} number={date.getUTCDate()}/>
                </Typography>
            </div>
        </Fade>
    )
};

interface DateComponentProps {
    isVisible: boolean,
    number: number,
    start?: number
}

const DateComponent: React.FC<DateComponentProps> = ({isVisible, number, start}) => {
    return (
        <span>
            {
                isVisible ?
                    <CountUp end={number} start={start || 0} duration={5} delay={0}/> :
                    <CountUp end={number} start={number} duration={0}/>
            }
        </span>
    )
};

export default DateSection