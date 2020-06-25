import React, {Component, Fragment} from 'react'
import MediaUpload from "./MediaUpload";
import TrimmerFiles from "./TrimmerFiles";
import BackupFiles from "./BackupFiles";

class TrimmerApp extends Component {

    state = {
        ival: null,
    };

    render() {

        return (
            <Fragment>
                <MediaUpload dest="trimmer" />
                <TrimmerFiles />
                <BackupFiles />
            </Fragment>
        );
    }
}

export default TrimmerApp;