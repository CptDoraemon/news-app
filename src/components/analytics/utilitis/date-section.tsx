import React, {useRef} from "react";
import { useCountUp } from 'react-countup';
import makeStyles from "@material-ui/core/styles/makeStyles";
import {Typography} from "@material-ui/core";
import Box from "@material-ui/core/Box";
import useLazyLoad from "../../../tools/use-lazy-load";

const useStyles = makeStyles(theme => ({

}));

interface RollingNumberSection {
    text: string,
    number: number,
}

const DateSection: React.FC<RollingNumberSection> = ({text, number}) => {
    const classes = useStyles();
    const containerRef = useRef<HTMLDivElement>(null);
    const isVisible = useLazyLoad(containerRef);
    const { countUp } = useCountUp({start: 0, end: number, duration: 5});

    const date = new Date(+countUp);

    return (
            <>
                <Typography variant={'body2'} component={'h2'}>
                    <Box>{ text }</Box>
                </Typography>
                <Typography variant={'h2'} component={'p'}>
                    <span>{date.getUTCFullYear()}</span>
                    -
                    <span>{formatDate(date.getUTCMonth() + 1)}</span>
                    -
                    <span>{formatDate(date.getUTCDate())}</span>
                </Typography>
            </>
    )
};

function formatDate(number: number) {
    return number < 10 ? `0${number}` : `${number}`
}

export default DateSection