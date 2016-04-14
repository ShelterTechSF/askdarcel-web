import React from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import classNames from 'classnames/bind';
import styles from './Resource.scss';

let cx = classNames.bind(styles);

class Services extends React.Component {
    constructor() {
        super();
        this.state = {services: [{}]};
    }

    loadServicesFromServer() {
        //let url = 'http://localhost:3000/resources/' + this.props.resource_id;
        //fetch(url).then(r => r.json())
        //    .then(data => {
        //        this.setState({resource: data});
        //    })
        //    .catch(e => console.log("Error retrieving resource"));
        this.setState({services: [
            {
                title: '150 Bed Shelter',
                description: 'Service description goes here'
            },
            {
                title: 'Case Management',
                description: 'Service description goes here'
            }
        ]})
    }

    componentDidMount() {
        this.loadServicesFromServer();
    }

    renderServices() {
        return this.state.services.map(service => {
            console.log(service);
            return (
                <Service service={service} />
            );
        });
    }

    render() {

        return (
            <div className={styles.infocontainer}>
                <h4>Description</h4>
                <p>{this.props.description}</p>
                <hr />
                <h4>Services</h4>
                {this.renderServices()}
            </div>
        );
    }
}

class Service extends React.Component {
    constructor() {
        super();
        this.state = {infoHidden: true};
    }

    toggleVisible() {
        this.setState({infoHidden: !this.state.infoHidden});
    }

    render() {
        let serviceInfoContainerStyles = cx({
            servicecontainer: true,
            hidden: this.state.infoHidden
        });

        let applicationProcessStyles = cx({
            bordercontainer: true,
            green: true
        });

        return (
            <div>
                <span className={styles.title} onClick={this.toggleVisible.bind(this)}>{this.props.service.title}</span>
                <div className={serviceInfoContainerStyles}>
                    <p>{this.props.service.description}</p>
                    <div className={styles.section}>
                        <div className={styles.table}>
                            <ServiceEligibility subject='Eligibility' result='Families'/>
                            <ServiceEligibility subject='Required Documents' result='None'/>
                            <ServiceEligibility subject='Fee' result='Free'/>
                        </div>
                    </div>
                    <div className={styles.section}>
                        <div className={applicationProcessStyles}><p>Application Process:</p></div>
                        <div className={styles.bordercontainer}><p>Application description goes here</p></div>
                    </div>
                    <Notes />
                </div>
            </div>
        );
    }
}

class ServiceEligibility extends React.Component {
    render() {
        let subjectCell = cx({
            cell: true,
            subjectcell: true
        });

        return (
            <div className={styles.row}>
                <div className={subjectCell}><p>{this.props.subject+':'}</p></div>
                <div className={styles.cell}><p>{this.props.result}</p></div>
            </div>
        );
    }
}

class Notes extends React.Component {
    render() {
        let notesStyles = cx({
            bordercontainer: true,
            label: true
        });

        let notesDate = cx({
            cell: true,
            subjectcell: true
        });

        return (
            <div className={styles.section}>
                <div className={notesStyles}><p>Notes:</p></div>
                <div className={styles.table}>
                    <div className={styles.row}>
                        <div className={notesDate}><p>3/24/16</p></div>
                        <div className={styles.cell}><p>HoT Employee</p></div>
                        <div className={styles.cell}><p>Shelter is full</p></div>
                    </div>
                </div>
            </div>
        );
    }
}

export default withStyles(Services, styles);