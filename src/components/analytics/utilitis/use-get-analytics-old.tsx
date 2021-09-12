import React, {useEffect, useState} from "react";

export enum AnalyticsPageStatus {
  loading = 'loading',
  loaded = 'loaded',
  error = 'error'
}

export interface SummaryStatisticsData {
  totalDocuments: number,
  earliestDocumentDate: string,
  latestDocumentDate: string,
  documentsCountByCategory: Array<{
    count: number,
    category: string
  }>,
  documentsCountByDay: {
    count: number[],
    time: number[]
  },
  wordCloud: Array<{
    count: number,
    word: string
  }>,
  docsCountByDay: Array<{
    count: number,
    date: number
  }>,
  documentsCountByDayAndCategory: {
    documentCount: number[][],
    series: string[],
    category: string[]
  }
}

const useGetAnalytics = () => {
  const [status, setStatus] = useState(AnalyticsPageStatus.loading);
  const [summaryStatisticsData, setSummaryStatisticsData] = useState<SummaryStatisticsData | null>(null);

  useEffect(() => {
    // fetch('https://www.xiaoxihome.com/api/news-analytics')
    fetch('http://localhost:5000/api/news-analytics')
      .then(res => res.json())
      .then(json => {
        if (json.status !== 'ok') {
          console.log(json);
          setStatus(AnalyticsPageStatus.error)
        } else {
          setSummaryStatisticsData({
            totalDocuments: json.summaryStatistics.totalDocuments,
            earliestDocumentDate: json.summaryStatistics.earliestDocumentDate,
            latestDocumentDate: json.summaryStatistics.latestDocumentDate,
            documentsCountByCategory: json.summaryStatistics.documentsCountByCategory,
            documentsCountByDay: {
              time: json.summaryStatistics.series.map((_: string) => (new Date(_).getTime())),
              count: json.summaryStatistics.documentsCountByDay
            },
            wordCloud: json.summaryStatistics.wordCloud,
            documentsCountByDayAndCategory: {
              documentCount: json.summaryStatistics.documentsCountByDayAndCategory.documentCount,
              series: json.summaryStatistics.series,
              category: json.summaryStatistics.documentsCountByDayAndCategory.category
            }
          } as SummaryStatisticsData);
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
