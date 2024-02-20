import React, {Component, Fragment} from 'react'
import { Tab } from 'semantic-ui-react'
import MuxUpload from "./MuxUpload";
import DemuxBackupFiles from "./DemuxBackupFiles";
import MuxedFiles from "./MuxedFiles";
import MuxUploadedFiles from "./MuxUploadedFiles";
import DemuxWorkflowFiles from "./DemuxWorkflowFiles";

class MuxApp extends Component {

    state = {
        ival: null,
    };

    render() {

        const panes = [
            // { menuItem: 'Backup', render: () => <Tab.Pane><DemuxBackupFiles /></Tab.Pane> },
            // { menuItem: 'Workflow', render: () => <Tab.Pane><DemuxWorkflowFiles /></Tab.Pane> },
            { menuItem: 'Upload', render: () => <Tab.Pane><MuxUpload dest="mux" /><MuxUploadedFiles /></Tab.Pane> },
        ]

        return (
            <Fragment>
                <Tab panes={panes} />
                <MuxedFiles />
            </Fragment>
        );
    }
}

export default MuxApp;
