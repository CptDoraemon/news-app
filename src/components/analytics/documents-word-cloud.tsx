import React, {useCallback, useEffect, useRef, useState} from "react";
import makeStyles from "@material-ui/core/styles/makeStyles";
import Title from "./utilitis/title";
import Content from "./utilitis/content";
import WordCloudD3, {WordCloudData} from "../../d3-charts/word-cloud-d3";

const useStyles = makeStyles(theme => ({}));

interface WordCloudProps {
  isLoaded: Boolean,
  data: WordCloudData,
  width?: number
}

const WordCloud: React.FC<WordCloudProps> = ({isLoaded, data, width}) => {
  const ref = useRef<HTMLDivElement>(null);
  const [wordCloud, setWordCloud] = useState<null | WordCloudD3>(null);

  const initChart = useCallback(() => {
    const wordCloud = new WordCloudD3(
      data,
      'analytics-documents-word-cloud',
    );
    wordCloud.main();
  }, [data])

  return (
    <>
      <Title value={'Word it out'}/>
      <Content value={`The power of words.`}/>
      <div id='analytics-documents-word-cloud' ref={ref}/>
    </>
  )
};

export default WordCloud
