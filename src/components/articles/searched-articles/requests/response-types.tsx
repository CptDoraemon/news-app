export interface IFrequencyData {
    bin: string[],
    frequency: number[]
}

export interface IResponse {
    status: string,
    totalCount: number,
    data: ISearchedArticle[],
    frequency: IFrequencyData
}

export interface ISearchedArticle{
    _id: string,
    source: {
        id: string,
        name: string
    },
    author: string,
    title: string,
    description: string,
    url: string,
    urlToImage: string,
    publishedAt: string,
    content: string,
    requestAt: string,
    category: string,
    score: number
}