import React, {useRef} from "react";
import CountUp from 'react-countup';
import makeStyles from "@material-ui/core/styles/makeStyles";
import {Typography} from "@material-ui/core";
import Box from "@material-ui/core/Box";
import useLazyLoad from "../../../tools/use-lazy-load";


const useStyles = makeStyles(theme => ({

}));

interface RollingNumberSection {
    text: string,
    number: number
}

const NumberSection: React.FC<RollingNumberSection> = ({text, number}) => {
    const classes = useStyles();
    const containerRef = useRef<HTMLDivElement>(null);
    const isVisible = useLazyLoad(containerRef);

    return (
            <>
                <Typography variant={'body2'} component={'h2'} ref={containerRef}>
                    <Box>{ text }</Box>
                </Typography>
                <Typography variant={'h2'} component={'p'}>
                    {
                        isVisible ?
                            <CountUp end={number} start={Math.floor(number * 0.85)} duration={5} delay={0}/> :
                            <CountUp end={number} start={number} duration={0}/>
                    }
                </Typography>
            </>
    )
};

export default NumberSection