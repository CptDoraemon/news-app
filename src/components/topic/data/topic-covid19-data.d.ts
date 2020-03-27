export as namespace CovidCaseData;

export interface CovidCaseData {
    countries: {
        [key: string]: {
            cases: number[],
            deaths: number[],
            recovered: number[],
        }
    }
    series: string[],
    totals: {
        cases: number[],
        deaths: number[],
        recovered: number[],
    },
    lastUpdated: string
}

declare let covidCaseData: CovidCaseData;
export default covidCaseData