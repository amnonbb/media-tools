import React, { Component } from 'react';
import { Progress,Message,Segment } from 'semantic-ui-react';
import Upload from 'rc-upload';
import {MTSRV_BACKEND} from "../shared/tools";

class MediaUpload extends Component {

    state = { percent: 0 };

    progress = (step, file) => {
        let count = Math.round(step.percent);
        //console.log('onProgress', step, file.name);
        this.setState({percent: count});
    };

    uploadDone = (file) => {
        console.log("Upload done", file);
        this.setState({percent: 0})
    };

    render() {

        const props = {
            action: `${MTSRV_BACKEND}/coder/upload`,
            type: 'drag',
            accept: '.mp4, .mpg, .mov, .avi, .wav, .mp3, .mp4a',
            beforeUpload(file) {
                console.log('beforeUpload', file.name);
            },
            onStart(file) {
                console.log('onStart', file.name);
            },
            onError(err) {
                console.log('onError', err);
            },

        };

        return (
            <Segment textAlign='center' basic>
                <Message>
                    <Upload
                        {...this.props}
                        {...props}
                        className="upload-block"
                        onSuccess={this.uploadDone}
                        onProgress={this.progress} >
                        Drop file here or click me
                        <Progress label='' percent={this.state.percent} indicating progress='percent' />
                    </Upload>
                </Message>
            </Segment>
        );
    }
}

export default MediaUpload;