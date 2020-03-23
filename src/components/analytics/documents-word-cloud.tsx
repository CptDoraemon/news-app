import React, {useEffect, useRef, useState} from "react";
import useLazyLoad from "../../tools/use-lazy-load";
import makeStyles from "@material-ui/core/styles/makeStyles";
import HeatMapD3, {HeatMapData} from "../../d3-charts/heat-map-d3";
import Title from "./utilitis/title";
import Content from "./utilitis/content";
import WordCloudD3, {WordCloudData} from "../../d3-charts/word-cloud-d3";

const useStyles = makeStyles(theme => ({

}));

interface WordCloudProps {
    isLoaded: Boolean,
    data: WordCloudData,
    width?: number
}

const WordCloud: React.FC<WordCloudProps> = ({isLoaded, data, width}) => {
    const ref = useRef<HTMLDivElement>(null);
    const isVisible = useLazyLoad(ref, 0.5);
    const [wordCloud, setWordCloud] = useState<null | WordCloudD3>(null);

    useEffect(() => {
        if (isLoaded && data && width && wordCloud === null) {
            const wordCloud = new WordCloudD3(
                data,
                width,
                'analytics-documents-word-cloud',
            );
            wordCloud.main();
            setWordCloud(wordCloud);
        }
    }, [isLoaded, data, width]);

    // useEffect(() => {
    //     if (heatMap && isVisible) {
    //         heatMap.animate();
    //     }
    // }, [heatMap, isVisible]);

    return (
        <>
            <Title value={'Word cloud'} />
            <Content value={`Word cloud description.`}/>
            <div id='analytics-documents-word-cloud' ref={ref}/>
        </>
    )
};

export default WordCloud