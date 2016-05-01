import React from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import classNames from 'classnames/bind';
import styles from './Resource.scss';

let cx = classNames.bind(styles);

class Services extends React.Component {
    constructor() {
        super();
        this.renderServices.bind(this);
        this.renderServicesSection.bind(this);
    }

    renderServicesSection() {
        if(this.props.services && this.props.services.length > 0) {
            return (
                <div>
                    <hr />
                    <div className={styles.innercontainer}>
                        <h4>Services</h4>
                        {this.renderServices(this.props.services)}
                    </div>
                </div>
            );
        }
    }

    renderServices(services) {
        return services.map(service => {
            return <Service service={service} />
        });
    }

    render() {
        return (
            <div className={styles.infocontainer}>
                <div className={styles.innercontainer}>
                    <h4>Description</h4>
                    <p>{this.props.description}</p>
                </div>
                {this.renderServicesSection()}
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
            hidden: this.state.infoHidden
        });

        let applicationProcessStyles = cx({
            bordercontainer: true,
            greenbg: true
        });

        return (
            <div className={styles.servicecontainer}>
                <span className={styles.title} onClick={this.toggleVisible.bind(this)}>{this.props.service.name}</span>
                <div className={serviceInfoContainerStyles}>
                    <p>{this.props.service.long_description}</p>
                    <div className={styles.section}>
                        <div className={styles.table}>
                            <ServiceEligibility subject='Eligibility' result={this.props.service.eligibility}/>
                            <ServiceEligibility subject='Required Documents' result={this.props.service.required_documents}/>
                            <ServiceEligibility subject='Fee' result={this.props.service.fee}/>
                        </div>
                    </div>
                    <div className={styles.section}>
                        <div className={applicationProcessStyles}><p className={styles.label}>Application Process:</p></div>
                        <div className={styles.bordercontainer}><p className={styles.label}>{this.props.service.application_process}</p></div>
                    </div>
                    <Notes notes={this.props.service.notes}/>
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
            graybg: true
        });

        let notes = this.props.notes.map(note => {
            return <Note note={note} />
        });

        return (
            <div className={styles.section}>
                <div className={notesStyles}><p className={styles.label}>Notes:</p></div>
                <div className={styles.table}>
                    {notes}
                </div>
            </div>
        );
    }
}

class Note extends React.Component {
    render() {
        let notesDate = cx({
            cell: true,
            subjectcell: true
        });

        return (
            <div className={styles.row}>
                <div className={notesDate}><p>{formatDate(this.props.note.updated_at)}</p></div>
                <div className={notesDate}><p>Employee</p></div>
                <div className={styles.cell}><p>{this.props.note.note}</p></div>
            </div>
        );
    }
}

function formatDate(dateString) {
    let date = new Date(dateString);
    return (date.getMonth() + 1) + '/' + (date.getDate()) + '/' + date.getFullYear();
}

export default withStyles(Services, styles);