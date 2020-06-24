import React, {Component, Fragment} from 'react'
import MediaUpload from "./MediaUpload";
import TrimmerFiles from "./TrimmerFiles";

class TrimmerApp extends Component {

    state = {
        ival: null,
    };

    render() {

        return (
            <Fragment>
                <MediaUpload dest="trimmer" />
                <TrimmerFiles />
            </Fragment>
        );
    }
}

export default TrimmerApp;