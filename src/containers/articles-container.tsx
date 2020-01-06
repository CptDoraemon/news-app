import {openCopyLinkSnackBar} from "../redux/actions/copy-link-snackbar";
import {connect} from "react-redux";
import Articles from "../components/articles/articles";

function mapDispatchToProps(dispatch: any) {
    return {
        openCopyLinkSnackBar: () => dispatch(openCopyLinkSnackBar())
    }
}

const ArticlesContainer = connect(
    null,
    mapDispatchToProps
)(Articles);

export default ArticlesContainer;
