import React from "react";

interface SearchedArticlesProps {
    keyword: string
}

const SearchedArticles: React.FC<SearchedArticlesProps> = ({keyword}) => {
    return (
        <div>
            { keyword }
        </div>
    )
};

export default SearchedArticles