import React, { Component } from 'react';
import { Segment, Table, Button, Message, Input, Label, Icon } from 'semantic-ui-react'
import MediaPlayer from "../components/Media/MediaPlayer";
import TrimmerControls from "./TrimmerControls";
import InoutControls from "./InoutControls";
import {mediaTools, toHms} from "../shared/tools";

export default class TrimmerModal extends Component {

    state = {
        convert: false,
        player: null,
        trim_meta: {...this.props.trim_meta},
        ioValid: false,
        loading: false,
        sum_time: "00:00:00.00",
        ctime: "",
        rtime: "",
        fname: this.props.trim_meta.file_name,
    };

    getPlayer = (player) => {
        console.log(":: Trimmer - got player: ", player);
        this.setState({player: player});
        player.media.addEventListener("timeupdate", () => {
            const {trim_meta} = this.state;
            //let rt = player.duration - player.currentTime;
            let rt = player.currentTime - trim_meta.inpoints[trim_meta.inpoints.length-1];
            this.setState({
                ctime: toHms(player.currentTime),
                rtime: rt ? toHms(rt) : "00:00:00.00"
            });
        });
    };

    getInouts = (inpoints, outpoints) => {
        let st = 0
        this.setState({ioValid: true});
        for(let i=0; i<inpoints.length; i++) {
            if(inpoints[i] > outpoints[i]) {
                this.setState({ioValid: false});
            } else {
                st = st + outpoints[i] - inpoints[i];
            }
        }
        this.setState({trim_meta: {...this.state.trim_meta, inpoints, outpoints}, sum_time: toHms(st)});
    };

    postTrimMeta = () => {
        this.setIopState();
        let {trim_meta, fname} = this.state;
        trim_meta.source_trimmer = this.props.source_trimmer;
        trim_meta.fname = fname;
        this.setState({ioValid: false, loading: true});
        setTimeout(() => { this.props.closeModal() }, 2000);
        mediaTools(`oren_trimmer`, trim_meta,  (data) => {
            console.log(":: Trimmer Stated :: ",data);
            if(data.status !== "ok") {
                alert("Trimmer: Something goes wrong!");
            }
        });
    };

    getIopState = () => {
        let iop = JSON.parse(localStorage.getItem("iop"))
        if(iop && iop.inpoints.length > 0)
            this.InoutControls.restoreIop(iop)
    };

    setIopState = () => {
        const {inpoints, outpoints} = this.state.trim_meta;
        let iop = {inpoints, outpoints};
        console.log(":: setIopState", iop);
        localStorage.setItem("iop", JSON.stringify(iop))
    };

    toggleConvert = () => {
        let {trim_meta} = this.state;
        trim_meta.convert = !this.state.convert;
        this.setState({ convert: !this.state.convert, trim_meta });
    };

    setName = (value) => {
        this.setState({fname: value})
    };

    render() {
        const {source} = this.props;
        const {player,trim_meta,sum_time,ioValid,loading,ctime,rtime,fname} = this.state;

        return (
            <Table className='table_main'>
                <Table.Body>
                    <Table.Row>
                        <Table.Cell width={5}>
                            <MediaPlayer
                                player={this.getPlayer}
                                source={source} type='video/mp4' /><br />
                            <Label size='big' ><Icon name='play' />Current time: - {ctime}</Label><br /><br />
                            <Label size='big' ><Icon name='hourglass end' />Last in time: - {rtime}</Label>
                        </Table.Cell>
                        <Table.Cell width={2} className='table_ctls'>
                            <TrimmerControls
                                player={player} />
                        </Table.Cell>
                        <Table.Cell width={4} className='table_inouts'>
                            <Button.Group attached='top' size='mini'>
                                <Button onClick={this.setIopState}>Save</Button>
                                <Button onClick={this.getIopState}>Restore</Button>
                            </Button.Group>
                            <Segment attached raised textAlign='center' className='inout_content'>
                                <InoutControls onRef={ref => (this.InoutControls = ref)}
                                    onSetPoints={this.getInouts}
                                    player={player}
                                    inpoints={trim_meta.inpoints}
                                    outpoints={trim_meta.outpoints} />
                            </Segment>
                        </Table.Cell>
                    </Table.Row>
                    <Table.Row>
                        <Table.Cell>
                            {/*<Segment color='blue' textAlign='center' raised >*/}
                            {/*    <b>{trim_meta.file_name}</b>*/}
                            {/*</Segment>*/}
                            <Input fluid size='small' placeholder='File Name...' value={fname} onChange={(e) => this.setName(e.target.value)}/>
                        </Table.Cell>
                        <Table.Cell textAlign='center'>
                            <Button size='big' color='red'
                                    disabled={!ioValid}
                                    loading={loading}
                                    onClick={this.postTrimMeta}>Trim
                            </Button>
                        </Table.Cell>
                        <Table.Cell textAlign='center'>
                            <Message compact className='overall_sum' >{sum_time}</Message>
                        </Table.Cell>
                    </Table.Row>
                </Table.Body>
            </Table>
        );
    }
}
