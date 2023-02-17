import React, { Component } from 'react'
import {getStatus, IVAL, mediaTools, getPercent, MTSRV_BACKEND} from '../shared/tools';
import { Table, Segment, Loader } from 'semantic-ui-react'

class CoderMonitor extends Component {

    state = {
        convert: [],
        progress: "",
        ival: null,
    };

    componentDidMount() {
        let {progress} = this.state;
        let ival = setInterval(() =>
            getStatus("mtools", (data) => {
                let convert = JSON.parse(data.stdout);
                convert.splice(0,1);
                if (JSON.stringify(this.state.convert) !== JSON.stringify(data)) {
                    let req = {"id":"coder", "req":"captime"};
                    mediaTools(`files`, req,  (data) => {
                        progress = data.stdout.split('.')[0];
                    });
                    let wfts = [];
                    convert.forEach(function (item) {
                        let itemts = item.split(/\s+/);
                        if (itemts[1] !== undefined && itemts[1].match(/^(running|queued)$/)) {
                            let jsonts = {"State": itemts[1], "Script": itemts[3],};
                            wfts.push(jsonts);
                        }
                        if (itemts[1] !== undefined && itemts[1].match(/^(finished)$/)) {
                            let jsonts = {"State": itemts[1], "Script": itemts[5]};
                            wfts.push(jsonts);
                        }
                    });
                    this.setState({convert: wfts,progress})
                }
            }), IVAL
        );
        this.setState({ival});
    };

    componentWillUnmount() {
        clearInterval(this.state.ival);
    };

    render() {
        let l = (<Loader size='mini' active inline />);

        let convert_data = this.state.convert.map((data, i) => {
            let state = data.State;
            if(data.Script) {
                let task = data.Script.split('[')[1].split(']')[0];
                let label = JSON.parse(task);
                let proc = state === "running" ? getPercent(label.duration.split('.')[0], this.state.progress) : label.duration;
                let ncolor = state === "running";
                let fcolor = state === "finished";
                let ext = label.preset_name.split("_")[0];
                let file = label.file_name.split(".")[0];
                let href = `${MTSRV_BACKEND}/get/${file}.${ext}`;
                //let name = <div>{state === "running" ? l : ""}&nbsp;&nbsp;&nbsp;{label.file_name}</div>;
                let link = state === "finished" ? (<a href={href}>{label.file_name}</a>) : (<b>{label.file_name}</b>);
                let progress = state === "running" ? (<b>{l}&nbsp;&nbsp;&nbsp;{proc}&nbsp;%</b>) : state;
                return (
                    <Table.Row key={i} warning={ncolor} positive={fcolor} className="monitor_tr">
                        <Table.Cell>{label.source}</Table.Cell>
                        <Table.Cell>{label.preset_name}</Table.Cell>
                        <Table.Cell>{link}</Table.Cell>
                        <Table.Cell>{label.duration.split('.')[0]}</Table.Cell>
                        <Table.Cell>{progress}</Table.Cell>
                    </Table.Row>
                )
            } else {
                return false;
            }

        });

        return (

            <Segment textAlign='center'>
                <u>Coder Monitor</u>
                <Table compact='very' basic>
                    <Table.Header>
                        <Table.Row className='table_header'>
                            <Table.HeaderCell width={2}>Source</Table.HeaderCell>
                            <Table.HeaderCell width={2}>Preset</Table.HeaderCell>
                            <Table.HeaderCell>File Name</Table.HeaderCell>
                            <Table.HeaderCell width={2}>Duration</Table.HeaderCell>
                            <Table.HeaderCell width={1}>Progress</Table.HeaderCell>
                        </Table.Row>
                    </Table.Header>

                    <Table.Body>
                        {convert_data}
                    </Table.Body>
                </Table>
            </Segment>
        );
    }
}

export default CoderMonitor;
