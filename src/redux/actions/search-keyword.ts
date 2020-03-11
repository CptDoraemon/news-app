export enum SearchKeywordTypes {
    SET_KEYWORD = 'SET_KEYWORD'
}

export interface SearchKeywordActions {
    type: SearchKeywordTypes,
    keyword: string
}

export function setSearchKeyword(keyword: string) {
    return {
        type: SearchKeywordTypes.SET_KEYWORD,
        keyword
    }
}