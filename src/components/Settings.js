import React, {Component} from 'react'
import { Divider, Table, Segment, Label, Dropdown, Input, Button } from 'semantic-ui-react'
import {getData, putData} from "../shared/tools";


class Settings extends Component {

    state = {
        name: "",
        audio_filter: "",
        video_filter: "",
        audio_codec: "",
        video_codec: "",
        settings: {}
    };

    componentDidMount() {
        getData(`settings`, (settings) => {
            console.log(":: Got settings: ",settings);
            this.setState({settings});
        });
    };

    selectPreset = (preset) => {
        console.log(" :: Set preset", preset);
        let {settings} = this.state;
        let name = settings[preset] || "New Preset";
        if(name === "New Preset") {
            this.setState({name,audio_filter: "",video_filter: "",audio_codec: "",video_codec: ""});
        } else {
            let {name,audio_filter,video_filter,audio_codec,video_codec} = settings[preset];
            this.setState({name,audio_filter,video_filter,audio_codec,video_codec});
        }
    };

    savePreset = (del) => {
        let {settings,name,audio_filter,video_filter,audio_codec,video_codec} = this.state;
        del ? delete settings[name] : settings[name] = {name,audio_filter,video_filter,audio_codec,video_codec};
        putData(`settings`, settings, (data) => {
            console.log(" :: Save presets callback: ", data);
            this.setState({settings});
        });
    };

    render() {

        const {name,settings,audio_filter,video_filter,audio_codec,video_codec} = this.state;

        let preset_options = (
            <Table basic='very' compact='very' >
                <Table.Body>
                    <Table.Row>
                        <Table.Cell>
                            <Input fluid label='Preset Name' size='mini' placeholder='...' value={name}
                                   onChange={(e) => this.setState({name: e.target.value})}/>
                        </Table.Cell>
                    </Table.Row>
                    <Table.Row>
                        <Table.Cell>
                            <Input fluid label='Video Filter' size='mini' placeholder='...' value={video_filter}
                                   onChange={(e) => this.setState({video_filter: e.target.value})}/>
                        </Table.Cell>
                    </Table.Row>
                    <Table.Row>
                        <Table.Cell>
                            <Input fluid label='Audio Filter' size='mini' placeholder='...' value={audio_filter}
                                   onChange={(e) => this.setState({audio_filter: e.target.value})}/>
                        </Table.Cell>
                    </Table.Row>
                    <Table.Row>
                        <Table.Cell>
                            <Input fluid label='Audio Codec' size='mini' placeholder='...' value={audio_codec}
                                   onChange={(e) => this.setState({audio_codec: e.target.value})}/>
                        </Table.Cell>
                    </Table.Row>
                    <Table.Row>
                        <Table.Cell>
                            <Input fluid label='Video Codec' size='mini' placeholder='...' value={video_codec}
                                   onChange={(e) => this.setState({video_codec: e.target.value})}/>
                        </Table.Cell>
                    </Table.Row>
                </Table.Body>
                <Table.Footer fullWidth>
                    <Table.Row>
                        <Table.HeaderCell>
                            <Button size='small' positive onClick={() => this.savePreset(false)}>Save</Button>
                            <Button size='small' negative onClick={() => this.savePreset(true)}>Delete</Button>
                        </Table.HeaderCell>
                    </Table.Row>
                </Table.Footer>
            </Table>
        );

        let presets = Object.keys(settings || []).map((itemid, i) => {
            return (
                <Dropdown.Item key={i} onClick={() => this.selectPreset(itemid)}>{itemid}</Dropdown.Item>
            )
        });

        return(
            <Segment textAlign='center' color='brown'>
                <Label attached='top' size='big' >
                    <Dropdown item text={name || "Select Preset:"}>
                        <Dropdown.Menu>
                            <Dropdown.Item onClick={() => this.selectPreset("New Preset")}>New Preset</Dropdown.Item>
                            <Dropdown.Divider />
                            {presets}
                        </Dropdown.Menu>
                    </Dropdown>
                </Label>
                <Divider />

                {name !== "" ? preset_options : ""}

            </Segment>
        );
    }
}

export default Settings;