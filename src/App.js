import React, {Component} from 'react';
import { Segment, Tab } from 'semantic-ui-react'
import 'semantic-ui-css/semantic.min.css';
import 'react-datepicker/dist/react-datepicker.css';
import './App.css';
import Settings from "./components/Settings";
import CoderApp from "./components/CoderApp";
import TrimmerApp from "./components/TrimmerApp";
import DemuxApp from "./components/DemuxApp";

class App extends Component {

  state = {
    settings:{},
    settings_id: null,
  };

  render() {

    const {settings} = this.state;

    const panes = [
      { menuItem: { key: 'coder', icon: 'cog', content: 'Coder' },
        render: () => <Tab.Pane attached={false} >
          <CoderApp getState={this.getState}
                    settings={settings}/>
        </Tab.Pane> },
      { menuItem: { key: 'trim', icon: 'cut', content: 'Trimmer' },
        render: () => <Tab.Pane attached={false} >
          <TrimmerApp />
        </Tab.Pane> },
      { menuItem: { key: 'demux', icon: 'random', content: 'Demux' },
        render: () => <Tab.Pane attached={false} >
          <DemuxApp />
        </Tab.Pane> },
      { menuItem: { key: 'settings', icon: 'options', content: 'Options' },
        render: () => <Tab.Pane attached={false} >
          <Settings getState={this.getState}
                    settings={settings}/>
        </Tab.Pane> },
    ];

    return (
        <Segment basic padded>
          <Tab menu={{ secondary: true, pointing: true, color: "blue"}} panes={panes} />
        </Segment>
    );
  }
}

export default App;
