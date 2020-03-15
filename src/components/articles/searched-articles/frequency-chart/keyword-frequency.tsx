import React, {useEffect, useRef} from "react";
import {makeStyles} from "@material-ui/core";
import { useTheme } from '@material-ui/core/styles';
import FrequencyChartD3 from "./frequency-chart-d3";

const id = 'keyword-frequency-chart';

const useStyles = makeStyles(theme => ({
    root: {
        width: '100%'
    }
}));

interface KeywordFrequencyProps {
    bin: any[],
    frequency: number[],
}

const KeywordFrequency: React.FC<KeywordFrequencyProps> = ({bin, frequency}) => {
    const wrapperRef = useRef<HTMLDivElement>(null);
    const classes = useStyles();
    const theme = useTheme();

    useEffect(() => {
        if (!wrapperRef.current) return;

        const chart = new FrequencyChartD3(theme, bin.map(obj => obj.ms), frequency.slice(), wrapperRef.current.getBoundingClientRect().width, id);
        chart.main();
    }, [wrapperRef, bin, frequency]);


    return (
        <div ref={wrapperRef} className={classes.root} id={id}>

        </div>
    )
};

export default KeywordFrequency