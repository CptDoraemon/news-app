import {connect} from "react-redux";
import {Dispatch} from "redux";
import {
    categories,
    Category,
    goToAnalyticsPanel,
    goToSearchPanel,
    setCategoryIfNeeded
} from "../redux/actions/category";
import {setSearchKeyword} from "../redux/actions/search-keyword";
import Header from "../components/header/header";
import {State} from "../redux/state";

function mapStateToProps(state: State) {
    return {
        headers: categories,
        category: state.category,
    }
}

function mapDispatchToProps(dispatch: Dispatch) {
    return {
        goToSearch: (keyword: string) => {
            dispatch(setSearchKeyword(keyword));
            dispatch(goToSearchPanel())
        },
        goToAnalytics: () => {
            dispatch(goToAnalyticsPanel())
        },
        setCategory: (category: Category) => {
            // @ts-ignore
            dispatch(setCategoryIfNeeded(category));
        }
    }
}

const HeaderContainer = connect(
    mapStateToProps,
    mapDispatchToProps
)(Header);

export default HeaderContainer;