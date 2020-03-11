import {connect} from "react-redux";
import HeaderSearch from "../components/header/header-search";
import {Dispatch} from "redux";
import {goToSearchPanel} from "../redux/actions/category";
import {setSearchKeyword} from "../redux/actions/search-keyword";

function mapDispatchToProps(dispatch: Dispatch) {
    return {
        search: (keyword: string) => {
            dispatch(setSearchKeyword(keyword));
            dispatch(goToSearchPanel())
        }
    }
}

const HeaderSearchContainer = connect(
    null,
    mapDispatchToProps
)(HeaderSearch);

export default HeaderSearchContainer;