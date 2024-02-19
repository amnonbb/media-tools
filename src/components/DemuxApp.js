import React, {Component, Fragment} from 'react'
import { Tab } from 'semantic-ui-react'
import DemuxUpload from "./DemuxUpload";
import DemuxBackupFiles from "./DemuxBackupFiles";
import DemuxedFiles from "./DemuxedFiles";
import DemuxUploadedFiles from "./DemuxUploadedFiles";

class DemuxApp extends Component {

    state = {
        ival: null,
    };

    render() {

        const panes = [
            { menuItem: 'Backup', render: () => <Tab.Pane><DemuxBackupFiles /></Tab.Pane> },
            { menuItem: 'Upload', render: () => <Tab.Pane><DemuxUpload dest="demux" /><DemuxUploadedFiles /></Tab.Pane> },
        ]

        return (
            <Fragment>
                <Tab panes={panes} />
                <DemuxedFiles />
            </Fragment>
        );
    }
}

export default DemuxApp;
