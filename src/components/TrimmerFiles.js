import React, {Component} from 'react'
import { Menu, Segment, Dropdown, Button, Modal } from 'semantic-ui-react'
import {getData, mediaTools, MTSRV_BACKEND} from "../shared/tools";
import TrimmerModal from "./TrimmerModal";

class TrimmerFiles extends Component {

    state = {
        file: "",
        preset: null,
        settings: {},
        files: [],
    };

    componentDidMount() {
        getData(`settings`, (settings) => {
            console.log(":: Got settings: ",settings);
            this.setState({settings});
        });
    };

    getFiles = () => {
        let req = {"id":"trimmer", "req":"files"};
        mediaTools(`files`, req,  (data) => {
            let files = data.jsonst.files;
            console.log(":: Got files: ",files);
            this.setState({files});
        });
    };

    selectFile = (file) => {
        console.log(":: Select file: ",file);
        let source = MTSRV_BACKEND + "/backup/tmp/trimmer/" + file
        let trim_meta = {file_name: file, inpoints: [], outpoints: [], convert: false};
        this.setState({file, source, trim_meta});
    };

    sendToTrim = () => {
        this.setState({open: true});
    };

    onClose = () => {
        this.setState({open: false, disabled: true, file_data: ""});
    };

    render() {
        const {file,files,preset} = this.state;

        const files_list = files.map((id, i) => {
                return ({key: i, text: id, value: id})
            });


        return (
            <Segment textAlign='center' className="ingest_segment" color='red' raised>
                <Menu secondary>
                    <Menu.Item>
                        <Dropdown selection
                                  className="multi_select"
                                  placeholder="Select Files:"
                                  options={files_list}
                                  onClick={this.getFiles}
                                  value={file}
                                  onChange={(e, {value}) => this.selectFile(value)} >
                        </Dropdown>
                    </Menu.Item>
                    <Menu.Item position='right'>
                        <Dropdown button text={preset || "Select Preset:"}>
                            <Dropdown.Menu>

                            </Dropdown.Menu>
                        </Dropdown>
                    </Menu.Item>
                    <Menu.Item>
                        <Button primary disabled={!file} onClick={this.sendToTrim}>Start</Button>
                    </Menu.Item>
                </Menu>
                <Modal
                    className="trimmer_modal"
                    closeOnDimmerClick={false}
                    closeIcon={true}
                    onClose={this.onClose}
                    open={this.state.open}
                    size="large"
                >
                    <TrimmerModal
                        source={this.state.source}
                        trim_meta={this.state.trim_meta}
                        source_meta={this.state.trim_src}
                        mode="ingest"
                        closeModal={this.onClose}
                    />
                </Modal>
            </Segment>
        );
    }
}

export default TrimmerFiles;