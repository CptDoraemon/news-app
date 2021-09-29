import React, {useRef} from "react";
import {makeStyles} from "@material-ui/core";
import {useTheme} from '@material-ui/core/styles';
import FrequencyChartD3 from "../../d3-charts/frequency-chart-d3";
import {useMount} from "react-use";

const id = 'keyword-frequency-chart';

const useStyles = makeStyles(theme => ({
  root: {
    width: '100%'
  }
}));

interface KeywordFrequencyProps {
  bin: number[], // epoch ms time
  frequency: number[],
  setDate: (date: number) => void,
}

const KeywordFrequency: React.FC<KeywordFrequencyProps> = ({bin, frequency, setDate}) => {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const classes = useStyles();
  const theme = useTheme();

  useMount(() => {
    if (!wrapperRef.current) return;

    const chart = new FrequencyChartD3(
      theme,
      bin,
      frequency,
      wrapperRef.current.getBoundingClientRect().width,
      id
    );
    chart.main();
    chart.bindSetDate(setDate);
  })

  return (
    <div ref={wrapperRef} className={classes.root} id={id} />
  )
};

export default KeywordFrequency
