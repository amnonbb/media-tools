import React, {Component} from 'react'
import { Menu, Segment, Dropdown, Button, Label } from 'semantic-ui-react'
import {getData} from "../shared/tools";

class CoderFiles extends Component {

    state = {
        files: [],
        file: "",
        preset: null,
        settings: {}
    };

    componentDidMount() {
        getData(`settings`, (settings) => {
            console.log(":: Got settings: ",settings);
            this.setState({settings});
        });
    };

    selectPreset = (preset) => {
        this.setState({preset});
    };

    selectFile = (file) => {
        console.log(":: Select file: ",file);
        this.setState({file});
    };

    startCoder = () => {
        console.log(":: START :: ");
    };

    render() {
        const {file,files,preset,settings} = this.state;

        let files_list = files.map((id, i) => {
            return (<Dropdown.Item key={i} onClick={() => this.selectFile(id)}>{id}</Dropdown.Item>)
        });

        let presets = Object.keys(settings || []).map((itemid, i) => {
            return (
                <Dropdown.Item key={i} onClick={() => this.selectPreset(itemid)}>{itemid}</Dropdown.Item>
            )
        });

        return (
            <Segment textAlign='center' className="ingest_segment" color='blue' basic>
                <Label>{file || ""}</Label>
                <Menu secondary>
                    <Menu.Item>
                        <Dropdown item text='Select File:'>
                            <Dropdown.Menu>
                                {files_list}
                            </Dropdown.Menu>
                        </Dropdown>
                    </Menu.Item>
                    <Menu.Item position='right'>
                        <Dropdown item text={preset || "Select Preset:"}>
                            <Dropdown.Menu>
                                {presets}
                            </Dropdown.Menu>
                        </Dropdown>
                    </Menu.Item>
                    <Menu.Item>
                        <Button primary disabled={file === "" || !preset} onClick={this.startCoder}>Start</Button>
                    </Menu.Item>
                </Menu>
            </Segment>
        );
    }
}

export default CoderFiles;