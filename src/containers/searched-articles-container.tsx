import {connect} from "react-redux";
import SearchedArticles from "../components/articles/searched-articles/searched-articles";
import {State} from "../redux/state";

function mapStateToProps(state: State) {
    return {
        keyword: state.searchKeyword
    }
}

const SearchedArticlesContainer = connect(
    mapStateToProps,
)(SearchedArticles);

export default SearchedArticlesContainer;