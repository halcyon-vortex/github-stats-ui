import React, { Component } from 'react';
import { Router, Route, Link } from 'react-router';
import {AppBar, IconButton, FlatButton, RaisedButton, Paper, Card, List} from 'material-ui';
require('./main.scss');
import ThemeManager from 'material-ui/lib/styles/theme-manager';
import MyRawTheme from './css/materialThemeCustomizations';
import axios from 'axios';
import _ from 'lodash';
import TopChartList from './components/top-chart-list';
import Select from 'react-select';

import LEADERBOARD from './fixtures/top_list';
let paperStyles = {
  margin: 10,
  marginBottom: 0, // as already margin top on plots below
  padding: 5,
  fontSize: 22,
  textAlign: 'center',
  display: 'inline-block'
};

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
     leaderboard:  [
     ],
      languages: [
        {value: "All", label: "All Languages"}
      ],
      freshness: [
        {value: "med", label: "Balanced"},
        {value: "low", label: "More Established"},
        {value: "high", label: "Newer"}
      ],
      selectedLanguage: "",
      selectedFreshness: "med"
    }
  }

// want to add colors to context to make available to other components
  static childContextTypes = {
    //just declares we will stick on child context, not actually setting it
    muiTheme: React.PropTypes.object
  };

  getChildContext() {
    return {
      muiTheme: ThemeManager.getMuiTheme(MyRawTheme)
    };
  }

  filterLanguage(selectedLanguage) {
    console.log("selected language");
    console.log(selectedLanguage);
   this.setState({
     selectedLanguage
   })
  }

  handleSelectFreshness(selectedFreshness) {
    console.log("selected freshness");
    console.log(selectedFreshness);
    let leaderboard = LEADERBOARD["week_" + selectedFreshness];
    this.setState({
      selectedFreshness,
      leaderboard
    })
  }
  //fetching data after mounting as necessary for ssr
  componentDidMount() {
    let leaderboard = LEADERBOARD["week_" + this.state.selectedFreshness];
    this.setState({
      leaderboard
    })

  }

  render() {
    let {leaderboard, selectedLanguage} = this.state;
    console.log('selected language value:')
    console.log(typeof selectedLanguage);
    console.log(JSON.stringify(selectedLanguage));
    leaderboard = (selectedLanguage !== "All" && selectedLanguage !== "") ? _.filter(leaderboard, (l) => l.lang === selectedLanguage ) : leaderboard;
    return (
      <div>
        <div
        style={{
          margin: 5
        }}>
          <Select
            value="All"
            options={this.state.languages}
            onChange={this.filterLanguage.bind(this)}
          />
          <Select
            value="med"
            options={this.state.freshness}
            onChange={this.handleSelectFreshness.bind(this)}
          />
        </div>
        <div className="flex-container">
          <TopChartList timeframe="Weekly" data={leaderboard} />
        </div>


      </div>
    );
  }
}
