import React, {useCallback, useMemo, useState} from "react";
import {makeStyles} from "@material-ui/core";
import WordCloudD3 from "../../../d3-charts/word-cloud-d3";
import FullscreenSection from "../layouts/fullscreen-section";
import SectionWithChart from "../layouts/section-with-chart";
import YearStepper from "./year-stepper";
import {AnalyticsData} from "../hooks/use-get-analytics";
import useCallbackOnValueChange from "../../../tools/use-callback-on-value-change";
import useIsVisible from "../../../tools/use-is-visible";

const useStyles = makeStyles((theme) => ({
  container: {
    width: '100%',
    height: '100%'
  }
}));

interface WordCloudProps {
  data: AnalyticsData['wordCloud'],
}

const WordCloud = ({data}: WordCloudProps) => {
  const classes = useStyles();
  const id = 'analytics-word-cloud';
  const [selectedYear, setSelectedYear] = useState(data.length - 1);
  const {
    isVisible,
    isVisibleElRef
  } = useIsVisible<HTMLDivElement>(false);

  const steps = useMemo(() => {
    return data.map(obj => obj.year)
  }, [data]);

  const initChart = useCallback(() => {
    const wordCloud = new WordCloudD3(
      data.filter(obj => obj.year === data[selectedYear].year)[0].data,
      id,
    );
    wordCloud.main();
  }, [data, selectedYear]);

  useCallbackOnValueChange(selectedYear, initChart);

  const onStepChange = useCallback((index: number) => {
    setSelectedYear(index)
  }, [])

  return (
    <FullscreenSection ref={isVisibleElRef}>
      <SectionWithChart
        title={'Word it out'}
        content={`The power of words.`}
        cbOnChartElReady={initChart}
        belowTitle={
          <YearStepper steps={steps} activeStep={selectedYear} onStepChange={onStepChange}/>
        }
        isVisible={isVisible}
      >
        <div id={id} className={classes.container} key={selectedYear}> </div>
      </SectionWithChart>
    </FullscreenSection>
  )
};

export default WordCloud
