import React, { Component } from 'react';
import { Progress,Message,Segment } from 'semantic-ui-react';
import Upload from 'rc-upload';
import {mediaTools, MTSRV_BACKEND} from "../shared/tools";

class MediaUpload extends Component {

    state = {
        progress: {},
    };

    progress = (step, file) => {
        let {progress} = this.state;
        let count = Math.round(step.percent);
        progress[file.name] = count;
        this.setState({progress});
    };

    uploadDone = (file) => {
        let {progress} = this.state;
        console.log("Upload done", file);
        if(this.props.dest === "trimmer" && file.type !== "video/mp4") {
            console.log("Convert is needed");
            mediaTools(`convert`, file,  (data) => {
                console.log(":: Convert Stated :: ",data);
                if(data.status !== "ok") {
                    alert("Trimmer: Something goes wrong!");
                }
            });
        }
        delete progress[file.file_name];
        this.setState({progress})
    };

    render() {

        const {progress} = this.state;
        const {dest} = this.props;

        let files_progress = Object.keys(progress).map((id) => {
            let count = progress[id];
            return (<Progress key={id} label={id} percent={count} indicating progress='percent' />)
        });

        const props = {
            action: `${MTSRV_BACKEND}/${dest}/upload`,
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
                        Drop files here or click me
                    </Upload>
                </Message>
                {files_progress}
            </Segment>
        );
    }
}

export default MediaUpload;