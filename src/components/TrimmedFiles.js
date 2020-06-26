import React, {Component} from 'react'
import {mediaTools, MTSRV_BACKEND} from '../shared/tools';
import {Menu, Segment, Label, Icon, Table, Loader, Button, Modal, Message} from 'semantic-ui-react'
import MediaPlayer from "../components/Media/MediaPlayer";

class TrimmedFiles extends Component {

    state = {
        active: null,
        activeIndex: 0,
        closed: false,
        disabled: true,
        trimmed: [],
        file_data: null,
        ival: null,
        name: "",
        source: "",
    };

    componentDidMount() {
        this.runPolling();
    };

    componentWillUnmount() {
        clearInterval(this.state.ival);
    };

    runPolling = () => {
        let ival = setInterval(() => {
            let req = {"id":"trimmed", "req":"files"};
            mediaTools(`files`, req,  (data) => {
                let trimmed = data.jsonst.files;
                this.setState({trimmed});
            });
        }, 10000 );
        this.setState({ival});
    };

    selectFile = (file) => {
        console.log(":: Select file: ",file);
        let file_path = `/backup/tmp/trimmed/${file}`
        let source = MTSRV_BACKEND + file_path
        this.setState({name: file, source});
    };

    getPlayer = (player) => {
        console.log(":: Censor - got player: ", player);
        //this.setState({player: player});
    };

    handleClick = (e, titleProps) => {
        const { index } = titleProps;
        const { activeIndex } = this.state;
        const newIndex = activeIndex === index ? -1 : index;

        this.setState({ activeIndex: newIndex });
    };

    render() {

        const { trimmed,source,name } = this.state;

        let l = (<Loader size='mini' active inline />);
        let v = (<Icon name='checkmark'/>);
        let d = (<Icon color='blue' name='lock'/>);

        let trimmer_data = trimmed.map((data, i) => {
            //let time = moment.unix(id.substr(1)).format("HH:mm:ss") || "";
            let time = ""
            // let mhref = `${MTSRV_BACKEND}/content_units/${data.line.unit_id}`;
            // let mdb_link = wfsend ? (<a target="_blank" rel="noopener noreferrer" href={mhref}>{data.line.uid}</a>) : "";
            // let ctype = data.line.collection_type === "DAILY_LESSON" ? "lessons" : "programs";
            // let khref = `${MTSRV_BACKEND}/${ctype}/cu/${data.line.uid}`;
            // let km_link = kmedia ? (<a target="_blank" rel="noopener noreferrer" href={khref}>KM {a}</a>) : x;
            // let rowcolor = censored && !checked;
            let active = this.state.name === data ? 'active' : 'monitor_tr';
            return (
                <Table.Row key={i} className={active}
                           onClick={() => this.selectFile(data)}>
                    <Table.Cell>{time}</Table.Cell>
                    <Table.Cell>{data}</Table.Cell>
                </Table.Row>
            )
        });

        return (
            <Segment textAlign='center' className="wfdb_app" color='blue' raised>
                <Label attached='top' className="filesapp_label"></Label>
                <Message size='large'>
                    <Menu size='large' secondary >
                        <Menu.Item>
                            <Modal trigger={<Button color='brown' icon='play' disabled={!source} />}
                                   size='tiny'>
                                <MediaPlayer player={this.getPlayer} source={source} type='video/mp4' />
                            </Modal>
                        </Menu.Item>
                        <Menu.Item position='right'>
                            <Button color='teal' disabled={!source} >
                                <Icon name='download'/>
                                <a href={source} download={name}>{name}</a>
                            </Button>
                        </Menu.Item>
                    </Menu>
                </Message>
                <Segment attached raised textAlign='center'>
                    <Label attached='top' className="files_label">Trimmed</Label>
                    <Table selectable compact='very' basic size='small' structured>
                        <Table.Header>
                            <Table.Row className='table_header'>
                                <Table.HeaderCell width={2}>Time</Table.HeaderCell>
                                <Table.HeaderCell width={12}>File Name</Table.HeaderCell>
                            </Table.Row>
                        </Table.Header>

                        <Table.Body>
                            {trimmer_data}
                        </Table.Body>
                    </Table>
                </Segment>
            </Segment>
        );
    }
}

export default TrimmedFiles;