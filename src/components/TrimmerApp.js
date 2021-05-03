import React, {Component, Fragment} from 'react'
import { Tab } from 'semantic-ui-react'
import MediaUpload from "./MediaUpload";
import TrimmerFiles from "./TrimmerFiles";
import BackupFiles from "./BackupFiles";
import TrimmedFiles from "./TrimmedFiles";
import WorkflowFiles from "./WorkflowFiles";

class TrimmerApp extends Component {

    state = {
        ival: null,
    };

    render() {

        const panes = [
            { menuItem: 'Backup', render: () => <Tab.Pane><BackupFiles /></Tab.Pane> },
            { menuItem: 'Workflow', render: () => <Tab.Pane><WorkflowFiles /></Tab.Pane> },
            { menuItem: 'Upload', render: () => <Tab.Pane><MediaUpload dest="trimmer" /><TrimmerFiles /></Tab.Pane> },
        ]

        return (
            <Fragment>
                <Tab panes={panes} />
                <TrimmedFiles />
            </Fragment>
        );
    }
}

export default TrimmerApp;
