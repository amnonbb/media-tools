import React, {Component} from 'react'
import { Menu, Segment, Dropdown, Button, Modal, Select } from 'semantic-ui-react'
import {mediaTools, MTSRV_BACKEND} from "../shared/tools";
import TrimmerModal from "./TrimmerModal";

class DemuxBackupFiles extends Component {

    state = {
        file: "",
        preset: null,
        settings: {},
        files: [],
        src: "ShiurBoker",
        year: new Date().getFullYear(),
        month: new Date().toLocaleDateString('sv').split('-')[1],
    };

    componentDidMount() {
    };

    getFiles = () => {
        const {src, year, month} = this.state;
        let file_path = `__BACKUP/${year}-${month}/${src}`
        let req = {"id":"backup", "req":"files", file_path};
        mediaTools(`files`, req,  (data) => {
            let files = data.jsonst.files;
            this.setState({files});
        });
    };

    selectFile = (file) => {
        console.log(":: Select file: ",file);
        const {src, year, month} = this.state;
        let file_path = `__BACKUP/${year}-${month}/${src}/${file}`
        let source = MTSRV_BACKEND + `/mnt/backup/${file_path}`
        let trim_meta = {file_name: file, inpoints: [], outpoints: [], convert: false, file_path, backup: true};
        this.setState({file, source, trim_meta});
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

    sendToTrim = () => {
        this.setState({open: true});
    };

    onClose = () => {
        this.setState({open: false, disabled: true, file_data: ""});
    };

    render() {
        const {file, files, year, month} = this.state;

        let files_list = files.map((data, i) => {
            return ({ key: i, text: data, value: data })
        });

        const src_options = [
            { key: 1, text: 'ShiurBoker', value: 'ShiurBoker' },
            { key: 2, text: 'Special', value: 'Special' },
            { key: 3, text: 'Rawmaterial', value: 'Rawmaterial' },
        ];

        const year_options = [0,1,2,3,4].map(i => {
            const y = new Date().getFullYear() - i;
            return ({key: i, text: y, value: y})
        });

        console.log(year_options)

        const month_options = [
            { key: 1, text: '01', value: '01' },
            { key: 2, text: '02', value: '02' },
            { key: 3, text: '03', value: '03' },
            { key: 4, text: '04', value: '04' },
            { key: 5, text: '05', value: '05' },
            { key: 6, text: '06', value: '06' },
            { key: 7, text: '07', value: '07' },
            { key: 8, text: '08', value: '08' },
            { key: 9, text: '09', value: '09' },
            { key: 10, text: '10', value: '10' },
            { key: 11, text: '11', value: '11' },
            { key: 12, text: '12', value: '12' },
        ];


        return (
            <Segment textAlign='center' className="ingest_segment" color='red' raised>
                <Menu secondary>
                    <Menu.Item>
                        <Dropdown
                            compact
                            className="trim_src_dropdown"
                            selection
                            options={src_options}
                            defaultValue="ShiurBoker"
                            onChange={(e, {value}) => this.setSrc(value)}
                        >
                        </Dropdown>
                    </Menu.Item>
                    <Menu.Item>
                        <Select
                                compact options={year_options}
                                value={year}
                                onChange={(e, {value}) => this.setYear(value)}
                        />
                        <Select
                                compact options={month_options}
                                value={month}
                                onChange={(e, {value}) => this.setMonth(value)}
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
                        <Button primary disabled={!file} onClick={this.sendToTrim}>Open</Button>
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

export default DemuxBackupFiles;
