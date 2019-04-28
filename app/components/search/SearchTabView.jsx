import React, { Component } from 'react';
import ReactMarkdown from 'react-markdown';
import SearchTabHelper from './SearchTabHelper';
import TableOfOpeningTimes from '../listing/TableOfOpeningTimes';
import { timeToString } from '../../utils/index';

class SearchTabView extends React.Component {
  constructor(props) {
    super(props);
    this.state = { active: 'Description' };
    // this.getSchedule = this.getSchedule.bind(this);
  }

  // @Deprecated for now
  getSchedule(scheduleInfo) {
    if (!scheduleInfo) {
      return 'No hours listed';
    }
    return (
      <table className="compact">
        <tbody>
          { scheduleInfo.map(sched => (
            <tr key={sched.day}>
              <th>{ sched.day }</th>
              <td>
                { timeToString(sched.opens_at) }
-
                { timeToString(sched.closes_at) }
              </td>
            </tr>
          )) }
        </tbody>
      </table>
    );
  }

  getTabList() {
    const { applicationProcess, description } = this.props;

    const tabs = [[ 'Description', description ], [ 'How To Apply', applicationProcess ]];

    return tabs
      .filter(([title, content]) => content)
      .map(([title, content]) => ({
        title: title,
        content: <ReactMarkdown className="rendered-markdown" source={ content } />
      }));
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
