import React, { Component } from 'react';
import { timeToTimeInputValue, stringToTime, daysOfTheWeek } from '../../utils/index';

class EditSchedule extends Component {
    constructor(props) {
        super(props);

        let scheduleMap = {};
        props.schedule && props.schedule.schedule_days.forEach(function(day) {
            scheduleMap[day.day] = day;
        });

        this.state = {
            scheduleMap: scheduleMap,
            inheritSchedule: props.inheritSchedule,
            schedule_days: {},
            uuid: -1
        };

        this.getDayHours = this.getDayHours.bind(this);
        this.handleScheduleChange = this.handleScheduleChange.bind(this);
        this.handleCheckboxChange = this.handleCheckboxChange.bind(this);
    }

    handleCheckboxChange(e) {
        let inheritSchedule = this.state.inheritSchedule;
        inheritSchedule = e.target.checked;
        this.setState({inheritSchedule: inheritSchedule}, () => {
            this.props.handleScheduleChange(null, inheritSchedule);
        });
    }

    handleScheduleChange(e) {
        let currScheduleMap = this.state.scheduleMap;
        let field = e.target.dataset.field;
        let day = e.target.dataset.key;
        let value = e.target.value;
        let serverDay = currScheduleMap[day];
        let formattedTime = stringToTime(value);
        let newUUID = this.state.uuid-1;

        if(formattedTime !== serverDay[field]) {
            let schedule_days = this.state.schedule_days;
            let newDay = schedule_days[serverDay.id] ? schedule_days[serverDay.id] : {};
            newDay[field] = formattedTime;
            newDay.day = day;
            let key = serverDay.id ? serverDay.id : newUUID;
            schedule_days[key] = newDay;
            this.setState({schedule_days: schedule_days, uuid: newUUID}, function() {
                this.props.handleScheduleChange(schedule_days);
            });
        }
    }

    formatTime(time) {
        //FIXME: Use full times once db holds such values.
        return time.substring(0, 2);
    }

    getDayHours(day, field) {
        let dayRecord = this.state.scheduleMap[day];
        if(!dayRecord) {
            return null;
        }

        let time = dayRecord[field];
        return timeToTimeInputValue(time, true);
    }

    render() {
        return (
            <li key="hours" className="edit--section--list--item hours">
                <label>Hours</label>
                <div className={"checkbox-label" + (this.props.inheritable ? "" : " hidden")}>
                    <input 
                        className="checkbox"
                        type="checkbox"
                        checked={this.state.inheritSchedule}
                        onChange={this.handleCheckboxChange}
                    />
                    <label>Use Resource Schedule</label>
                </div>
                <ul className={"edit-hours-list" + (this.state.inheritSchedule ? " hidden" : "")}>
                    <li>
                        <p>M</p>
                        <input type="time" defaultValue={this.getDayHours("Monday", "opens_at")} data-key="Monday" data-field="opens_at" onChange={this.handleScheduleChange}/>
                        <input type="time" defaultValue={this.getDayHours("Monday", "closes_at")} data-key="Monday" data-field="closes_at" onChange={this.handleScheduleChange}/>
                    </li>
                    <li>
                        <p>T</p>
                        <input type="time" defaultValue={this.getDayHours("Tuesday", "opens_at")} data-key="Tuesday" data-field="opens_at" onChange={this.handleScheduleChange}/>
                        <input type="time" defaultValue={this.getDayHours("Tuesday", "closes_at")} data-key="Tuesday" data-field="closes_at" onChange={this.handleScheduleChange}/>
                    </li>
                    <li>
                        <p>W</p>
                        <input type="time" defaultValue={this.getDayHours("Wednesday", "opens_at")} data-key="Wednesday" data-field="opens_at" onChange={this.handleScheduleChange}/>
                        <input type="time" defaultValue={this.getDayHours("Wednesday", "closes_at")} data-key="Wednesday" data-field="closes_at" onChange={this.handleScheduleChange}/>
                    </li>
                    <li>
                        <p>Th</p>
                        <input type="time" defaultValue={this.getDayHours("Thursday", "opens_at")} data-key="Thursday" data-field="opens_at" onChange={this.handleScheduleChange}/>
                        <input type="time" defaultValue={this.getDayHours("Thursday", "closes_at")} data-key="Thursday" data-field="closes_at" onChange={this.handleScheduleChange}/>
                    </li>
                    <li>
                        <p>F</p>
                        <input type="time" defaultValue={this.getDayHours("Friday", "opens_at")} data-key="Friday" data-field="opens_at" onChange={this.handleScheduleChange}/>
                        <input type="time" defaultValue={this.getDayHours("Friday", "closes_at")} data-key="Friday" data-field="closes_at" onChange={this.handleScheduleChange}/>
                    </li>
                    <li>
                        <p>S</p>
                        <input type="time" defaultValue={this.getDayHours("Saturday", "opens_at")} data-key="Saturday" data-field="opens_at" onChange={this.handleScheduleChange}/>
                        <input type="time" defaultValue={this.getDayHours("Saturday", "closes_at")} data-key="Saturday" data-field="closes_at" onChange={this.handleScheduleChange}/>
                    </li>
                    <li>
                        <p>Su</p>
                        <input type="time" defaultValue={this.getDayHours("Sunday", "opens_at")} data-key="Sunday" data-field="opens_at" onChange={this.handleScheduleChange}/>
                        <input type="time" defaultValue={this.getDayHours("Sunday", "closes_at")} data-key="Sunday" data-field="closes_at" onChange={this.handleScheduleChange}/>
                    </li>
                </ul>
            </li>
        );
    }
}

export default EditSchedule;
