import React, { Component } from 'react';
import SearchTabHelper from './SearchTabHelper';
import TableOfOpeningTimes from '../listing/TableOfOpeningTimes';
import { timeToString } from '../../utils/index';

class SearchTabView extends React.Component {
    constructor(props) {
        super(props);
        this.state = {active: 'hta'};
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
    
    render(){
        
        const content = {
            hta: 'If you need emergency shelter, call the support line at (415)255-0165 for referrals, shelter intake, or counseling.',
            desc: this.props.description,
            hours: this.getSchedule(this.props.schedule),
        };
        return (
            <div className="service-entry-additional-info">
              <div className="service-entry-tabs">
                <SearchTabHelper
                  active={this.state.active}
                  onChange={active => this.setState({active})}>
                  <div key="hta">how to apply</div>
                  <div key="desc">description</div>
                  <div key="hours">hours</div>
                </SearchTabHelper>
              </div>
              <div className="service-entry-body">
                <p>{content[this.state.active]}</p>
              </div>
            </div> 
        )
    }
}
export default SearchTabView;