import React, {Component, Fragment} from 'react'
import MediaUpload from "./MediaUpload";

class CoderApp extends Component {

    state = {
        ival: null,
    };

    render() {

        return (
            <Fragment>
                <MediaUpload />
            </Fragment>
        );
    }
}

export default CoderApp;