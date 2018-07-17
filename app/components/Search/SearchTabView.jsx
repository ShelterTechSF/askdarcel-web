import React, { Component } from 'react';
import ReactMarkdown from 'react-markdown';
import SearchTabHelper from './SearchTabHelper';
import TableOfOpeningTimes from '../listing/TableOfOpeningTimes';
import { timeToString } from '../../utils/index';

class SearchTabView extends React.Component {
    constructor(props) {
      super(props);
      this.state = { active: this.props.applicationProcess ? 'How to Apply' : 'Description' };
      this.getSchedule = this.getSchedule.bind(this);
    }
    
  getSchedule(scheduleInfo) {
    if (!scheduleInfo) {
        return 'No hours listed';
    } else { 
        return (<table className="compact">
        <tbody>
          { scheduleInfo.map(sched => (
            <tr key={sched.day}>
              <th>{ sched.day }</th>
              <td>{ timeToString(sched.opens_at) }-{ timeToString(sched.closes_at) }</td>
            </tr>
          )) }
        </tbody>
      </table>)}
  }

  getTabList() {
    const { applicationProcess, description, schedule } = this.props;
    const tabs = [];
    if (applicationProcess) { tabs.push({ title: 'How to Apply', content: <p>{applicationProcess}</p> }); }
    tabs.push({ title: 'Description', content: <ReactMarkdown source={description} /> });
    tabs.push({ title: 'Hours', content: this.getSchedule(schedule) });
    return tabs;
  }
    
  render() {
    const tabs = this.getTabList();
    const activeTab = tabs.find(tab => tab.title === this.state.active);

    return (
      <div className="service-entry-additional-info">
        <div className="service-entry-tabs">
          <SearchTabHelper
            active={this.state.active}
            onChange={active => this.setState({ active })}
          >
            { tabs.map(tab => <div key={tab.title}>{ tab.title }</div>) }
          </SearchTabHelper>
        </div>
        <div className="service-entry-body">
          { activeTab.content }
        </div>
      </div>
    );
  }
}

export default SearchTabView;
