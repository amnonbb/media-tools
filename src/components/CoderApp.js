import React, {Component, Fragment} from 'react'
import MediaUpload from "./MediaUpload";
import CoderFiles from "./CoderFiles";
import CoderMonitor from "./CoderMonitor";

class CoderApp extends Component {

    state = {
        ival: null,
    };

    render() {

        return (
            <Fragment>
                <MediaUpload />
                <CoderFiles />
                <div className='monitor'>
                    <CoderMonitor />
                </div>
            </Fragment>
        );
    }
}

export default CoderApp;