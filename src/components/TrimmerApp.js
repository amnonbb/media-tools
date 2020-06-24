import React, {Component, Fragment} from 'react'
import MediaUpload from "./MediaUpload";

class TrimmerApp extends Component {

    state = {
        ival: null,
    };

    render() {

        return (
            <Fragment>
                <MediaUpload dest="trimmer" />
            </Fragment>
        );
    }
}

export default TrimmerApp;