import React, {useEffect, useState} from "react";

export enum AnalyticsPageStatus {
    loading='loading',
    loaded='loaded',
    error='error'
}

interface summaryStatisticsData {
    totalDocuments: number,
    earliestDocumentDate: number,
    latestDocumentDate: number,
    documentsCountByDay: any,
    documentsCountByCategory: Array<{
        count: number,
        category: string
    }>
}

const useGetAnalytics = () => {
    const [status, setStatus] = useState(AnalyticsPageStatus.loading);
    const [summaryStatisticsData, setSummaryStatisticsData] = useState<summaryStatisticsData | null>(null);

    useEffect(() => {
        fetch('https://www.xiaoxihome.com/api/news-analytics')
            .then(res => res.json())
            .then(json => {
                if (json.status !== 'ok') {
                    console.log(json);
                    setStatus(AnalyticsPageStatus.error)
                } else {
                    setSummaryStatisticsData(json.summaryStatistics as summaryStatisticsData);
                    setStatus(AnalyticsPageStatus.loaded)
                }
            })
            .catch(e => {
                console.log(e);
                setStatus(AnalyticsPageStatus.error)
            })
    }, []);

    return {status, summaryStatisticsData}
};

export default useGetAnalytics