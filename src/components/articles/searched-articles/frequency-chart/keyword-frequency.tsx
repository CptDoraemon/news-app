import React, {Dispatch, SetStateAction, useEffect, useMemo, useRef} from "react";
import {makeStyles} from "@material-ui/core";
import { useTheme } from '@material-ui/core/styles';
import FrequencyChartD3 from "../../../../d3-charts/frequency-chart-d3";
import {IResponse} from "../requests/response-types";

const id = 'keyword-frequency-chart';

const useStyles = makeStyles(theme => ({
    root: {
        width: '100%'
    }
}));

interface KeywordFrequencyProps {
    bin: IResponse['series'],
    frequency: IResponse['frequency'],
    setDate: (date: number) => void,
}

const KeywordFrequency: React.FC<KeywordFrequencyProps> = ({bin, frequency, setDate}) => {
    const wrapperRef = useRef<HTMLDivElement>(null);
    const classes = useStyles();
    const theme = useTheme();

    useEffect(() => {

        if (!wrapperRef.current) return;

        const chart = new FrequencyChartD3(
            theme,
            bin.map(ISOString => (new Date(ISOString)).getTime()),
            frequency.slice(),
            wrapperRef.current.getBoundingClientRect().width,
            id
        );
        chart.main();
        chart.bindSetDate(setDate);

    }, [wrapperRef, bin, frequency]);

    return (
        <div ref={wrapperRef} className={classes.root} id={id}>

        </div>
    )
};

export default KeywordFrequency