import React, {Component} from 'react'
import { Menu, Segment, Dropdown, Button } from 'semantic-ui-react'
import {getData,mediaTools} from "../shared/tools";

class CoderFiles extends Component {

    state = {
        files: [],
        file_set: [],
        preset: null,
        settings: {},
        data: {},
    };

    componentDidMount() {
        getData(`settings`, (settings) => {
            console.log(":: Got settings: ",settings);
            this.setState({settings});
        });
    };

    getFiles = () => {
        let req = {"id":"coder", "req":"files"};
        mediaTools(`files`, req,  (data) => {
            let files = data.jsonst.files;
            console.log(":: Got files: ",files);
            this.setState({files});
        });
    };

    selectFile = (file_set) => {
        let {data} = this.state;
        data.file_set = file_set;
        console.log(":: Select file_set: ",file_set);
        this.setState({file_set,data});
    };

    startCoder = () => {
        let {data} = this.state;
        let req = {"id":"coder", "req":"start",data};
        mediaTools(`coder`, req,  (data) => {
            console.log(":: Coder Stated :: ",data);
            this.setState({preset: null, file_set: []})
        });
    };

    selectPreset = (preset) => {
        let {settings,data} = this.state;
        data.preset = settings[preset];
        this.setState({preset,data});
    };

    render() {
        const {file_set,files,preset,settings} = this.state;

        const files_list = files.map((id, i) => {
                return ({key: i, text: id, value: id})
            });

        let presets = Object.keys(settings || []).map((itemid, i) => {
            return (
                <Dropdown.Item key={i} onClick={() => this.selectPreset(itemid)}>{itemid}</Dropdown.Item>
            )
        });

        return (
            <Segment textAlign='center' className="ingest_segment" color='red' raised>
                <Menu secondary>
                    <Menu.Item>
                        <Dropdown multiple selection
                                  className="multi_select"
                                  placeholder="Select Files:"
                                  options={files_list}
                                  onClick={this.getFiles}
                                  value={file_set}
                                  onChange={(e, {value}) => this.selectFile(value)} >
                        </Dropdown>
                    </Menu.Item>
                    <Menu.Item position='right'>
                        <Dropdown button text={preset || "Select Preset:"}>
                            <Dropdown.Menu>
                                {presets}
                            </Dropdown.Menu>
                        </Dropdown>
                    </Menu.Item>
                    <Menu.Item>
                        <Button primary disabled={file_set.length === 0 || !preset} onClick={this.startCoder}>Start</Button>
                    </Menu.Item>
                </Menu>
            </Segment>
        );
    }
}

export default CoderFiles;