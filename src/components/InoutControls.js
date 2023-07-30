import React, { Component, Fragment } from 'react';
import {Button, Label, Message, Input, Segment} from 'semantic-ui-react'
import {toHms, totalSeconds} from '../shared/tools';

export default class InoutControls extends Component {


    state = {
        inpoints: [],
        outpoints: [],
    };

    componentDidMount() {
        this.props.onRef(this);
    };

    componentWillUnmount() {
        this.props.onRef(undefined);
    };

    restoreIop(iop) {
        console.log(":: Restore IOP: ",iop);
        const {inpoints, outpoints} = iop;
        this.setState({inpoints, outpoints});
        this.props.onSetPoints(inpoints, outpoints);
    };

    setIn = (i, input) => {
        const {inpoints,outpoints} = this.state;
        let currentTime = Number(this.props.player.getCurrentTime().toFixed(2));
        if(i === null) {
            input ? inpoints[outpoints.length] = totalSeconds(input) : inpoints[outpoints.length] = currentTime;
        } else {
            input ? inpoints[i] = totalSeconds(input) : inpoints[i] = currentTime;
            this.props.onSetPoints(inpoints, outpoints);
        }
        console.log(":: Set IN: ",currentTime);
        this.setState({inpoints});
    };

    setOut = (i, input) => {
        const {inpoints,outpoints} = this.state;
        let currentTime = Number(this.props.player.getCurrentTime().toFixed(2));
        if(i === null) {
            input ? outpoints[inpoints.length - 1] = totalSeconds(input) : outpoints[inpoints.length - 1] = currentTime;
        } else {
            input ? outpoints[i] = totalSeconds(input) : outpoints[i] = currentTime;
        }
        console.log(":: Set OUT: ",currentTime);
        this.setState({outpoints}, () => {
            if(i === null) {
                this.scrollToBottom();
            }
        });
        this.props.onSetPoints(inpoints, outpoints);
    };

    removeInout = (i) => {
        const {inpoints,outpoints} = this.state;
        inpoints.splice(i,1);
        outpoints.splice(i,1);
        this.setState({inpoints, outpoints});
    }

    jumpPoint = (point) => {
        point ? this.props.player.setCurrentTime(point) :
            this.props.player.setCurrentTime(this.state.inpoints[this.state.inpoints.length - 1]);
    };

    scrollToBottom = () => {
        this.refs.end.scrollIntoView({ behavior: 'smooth' })
    };

    render() {
        const {inpoints,outpoints} = this.state;
        let inout = outpoints.map((outp, i) => {
            let inp = inpoints[i];
            return (
                <Message key={i} className='' vertical onDismiss={this.removeInout}>
                    <Input className="inout_left" error={inp > outp ? 'red' : ''}
                           action={{ icon: 'chevron left' , onClick: () => this.setIn(i, null)}}
                           actionPosition='left' value={inp !== null ? toHms(inp) : "<- Set in"}
                           onDoubleClick={() => this.jumpPoint(inp)}
                           onChange={(e) => this.setIn(i, e.target.value)}/>
                    <Input className="inout_right" error={inp > outp ? 'red' : ''}
                           action={{ icon: 'chevron right' , onClick: () => this.setOut(i, null)}}
                           actionPosition='right' value={outp !== null ? toHms(outp) : "<- Set in"}
                           onDoubleClick={() => this.jumpPoint(outp)}
                           onChange={(e) => this.setOut(i, e.target.value)}/>
                    <Message compact className='inout_sum' >{toHms(outp - inp)}</Message>
                </Message>
            );
        });

        return (
            <Fragment >
                {inout}
                <Button as='div' labelPosition='right' className="inout_btn">
                    <Button icon color='grey' className="inout_btn" onClick={() => this.setIn(null)} />
                    <Label as='a' basic pointing='left' onDoubleClick={() => this.jumpPoint(null)}>
                        {inpoints[outpoints.length] !== undefined ? toHms(inpoints[outpoints.length]) : "<- Set in" }
                    </Label>
                </Button>
                <Button as='div' labelPosition='left' className="inout_btn">
                    <Label as='a' basic pointing='right'>
                        {"Set out ->"}
                    </Label>
                    <Button icon color='grey' className="inout_btn" onClick={() => this.setOut(null)} />
                </Button>
                <div ref='end' />
            </Fragment>
        );
    }
}
