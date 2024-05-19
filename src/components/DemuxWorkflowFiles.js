import React, {Component} from 'react'
import { Menu, Segment, Dropdown, Button, Modal, Select } from 'semantic-ui-react'
import DatePicker from 'react-datepicker';
import {mediaTools, MTSRV_BACKEND} from "../shared/tools";
import TrimmerModal from "./TrimmerModal";

class DemuxWorkflowFiles extends Component {

    state = {
        file: "",
        preset: null,
        settings: {},
        files: [],
        src: "ShiurBoker",
        date: new Date().toLocaleDateString('sv'),
        startDate: new Date(),
    };

    componentDidMount() {
    };

    getFiles = () => {
        const {date} = this.state;
        let file_path = `trimmed/${date}`
        let req = {"id":"workflow", "req":"files", file_path};
        mediaTools(`files`, req,  (data) => {
            let files = data.jsonst.files.filter(r => r.match(/o.mp4/)) || [];
            this.setState({files});
        });
    };

    selectFile = (file) => {
        console.log(":: Select file: ",file);
        const {date} = this.state;
        let file_path = `trimmed/${date}/${file}`
        let source = MTSRV_BACKEND + `/mnt/workflow/${file_path}`
        let trim_meta = {file_name: file, inpoints: [], outpoints: [], convert: false, file_path, workflow: true};
        this.setState({file, source, trim_meta, file_path});
    };

    changeDate = (data) => {
        let date = data.toLocaleDateString('sv');
        this.setState({startDate: data, date: date, disabled: true});
    };

    setSrc = (src) => {
        this.setState({src, disabled: true, file_data: ""});
    };

    setYear = (year) => {
        this.setState({year});
    };

    setMonth = (month) => {
        this.setState({month});
    }

    sendToDemux = () => {
        const {file_path} = this.state;
        let req = {"id":"demux", "req":"start", file_path};
        mediaTools(`files`, req,  (data) => {
            // let files = data.jsonst.files;
            // this.setState({files});
            console.log(data)
        });
        //this.setState({open: true});
    };

    onClose = () => {
        this.setState({open: false, disabled: true, file_data: ""});
    };

    render() {
        const {file, files} = this.state;

        let files_list = files.map((data, i) => {
            return ({ key: i, text: data, value: data })
        });


        return (
            <Segment textAlign='center' className="ingest_segment" color='red' raised>
                <Menu secondary>
                    <Menu.Item>
                        <DatePicker
                            className="datepickercs"
                            dateFormat="yyyy-MM-dd"
                            maxDate={new Date()}
                            minDate={new Date(Date.now() - 40 * 24 * 60 * 60 * 1000)}
                            selected={this.state.startDate}
                            onChange={this.changeDate}
                        />
                    </Menu.Item>
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
                        <Button primary disabled={!file} onClick={this.sendToDemux}>Start</Button>
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

export default DemuxWorkflowFiles;
