import {openCopyLinkSnackBar} from "../redux/actions/copy-link-snackbar";
import {connect} from "react-redux";
import Articles from "../components/articles/articles";
import {Dispatch} from "redux";

function mapDispatchToProps(dispatch: Dispatch) {
    return {
        openCopyLinkSnackBar: () => dispatch(openCopyLinkSnackBar())
    }
}

const ArticlesContainer = connect(
    null,
    mapDispatchToProps
)(Articles);

export default ArticlesContainer;
