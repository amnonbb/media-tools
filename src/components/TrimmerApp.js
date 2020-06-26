import React, {Component, Fragment} from 'react'
import MediaUpload from "./MediaUpload";
import TrimmerFiles from "./TrimmerFiles";
import BackupFiles from "./BackupFiles";
import TrimmedFiles from "./TrimmedFiles";

class TrimmerApp extends Component {

    state = {
        ival: null,
    };

    render() {

        return (
            <Fragment>
                {/*<MediaUpload dest="trimmer" />*/}
                {/*<TrimmerFiles />*/}
                <BackupFiles />
                <TrimmedFiles />
            </Fragment>
        );
    }
}

export default TrimmerApp;