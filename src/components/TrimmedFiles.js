import React, {Component} from 'react'
import {mediaTools} from '../shared/tools';
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
        }, 3000 );
        this.setState({ival});
    };

    selectFile = (file) => {
        console.log(":: Select file: ",file);
        let source = `/dl/backup/tmp/trimmed/${file}`
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

        let trimmer_data = trimmed.map((data, i) => {
            //let time = moment.unix(id.substr(1)).format("HH:mm:ss") || "";
            let progress = data.match(/in_progress/);
            let active = this.state.name === data ? 'active' : 'monitor_tr';
            return (
                <Table.Row key={i} className={active} disabled={progress}
                           onClick={() => this.selectFile(data)}>
                    <Table.Cell>{progress ? l : v}</Table.Cell>
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
                                <Table.HeaderCell width={2}>Progress</Table.HeaderCell>
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