import React, {useCallback} from "react";
import {makeStyles} from "@material-ui/core";
import AnalyticsSection from "./analytics-section";
import {useMount} from "react-use";
import WordCloudD3, {WordCloudData} from "../../d3-charts/word-cloud-d3";

const useStyles = makeStyles((theme) => ({
  container: {
    width: '100%',
    height: '100%'
  }
}));

interface WordCloudProps {
  data: WordCloudData,
}

const WordCloud = ({data}: WordCloudProps) => {
  const classes = useStyles();
  const id = 'analytics-word-cloud';

  const initChart = useCallback(() => {
    const wordCloud = new WordCloudD3(
      data,
      id,
    );
    wordCloud.main();
  }, [data]);

  return (
    <AnalyticsSection
      title={'Word it out'}
      content={`The power of words.`}
      cbOnChartElReady={initChart}
    >
      <div id={id} className={classes.container}> </div>
    </AnalyticsSection>
  )
};

export default WordCloud
