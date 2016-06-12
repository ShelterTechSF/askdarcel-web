import React from 'react';
import classNames from 'classnames';

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
                    <div className="innercontainer">
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
            <div className="infocontainer">
                <div className="innercontainer">
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
        let serviceInfoContainerStyles = classNames({
            hidden: this.state.infoHidden
        });

        return (
            <div className="servicecontainer">
                <span className="service_title" onClick={this.toggleVisible.bind(this)}>{this.props.service.name}</span>
                <div className={serviceInfoContainerStyles}>
                    <p>{this.props.service.long_description}</p>
                    <div className="serviceinfo_section">
                        <div className="service_table">
                            <ServiceEligibility subject='Eligibility' result={this.props.service.eligibility}/>
                            <ServiceEligibility subject='Required Documents' result={this.props.service.required_documents}/>
                            <ServiceEligibility subject='Fee' result={this.props.service.fee}/>
                        </div>
                    </div>
                    <div className="serviceinfo_section">
                        <div className="bordercontainer greenbg"><p className="resource_editslabel">Application Process:</p></div>
                        <div className="bordercontainer"><p className="resource_editslabel">{this.props.service.application_process}</p></div>
                    </div>
                    <Notes notes={this.props.service.notes}/>
                </div>
            </div>
        );
    }
}

class ServiceEligibility extends React.Component {
    render() {
        return (
            <div className="service_row">
                <div className="service_cell subjectcell"><p>{this.props.subject+':'}</p></div>
                <div className="service_cell"><p>{this.props.result}</p></div>
            </div>
        );
    }
}

class Notes extends React.Component {
    render() {
        let notes = this.props.notes.map(note => {
            return <Note note={note} />
        });

        return (
            <div className="serviceinfo_section">
                <div className="bordercontainer graybg"><p className="resource_editslabel">Notes:</p></div>
                <div className="service_table">
                    {notes}
                </div>
            </div>
        );
    }
}

class Note extends React.Component {
    render() {
        return (
            <div className="service_row">
                <div className="service_cell subjectcell"><p>{formatDate(this.props.note.updated_at)}</p></div>
                <div className="service_cell subjectcell"><p>Employee</p></div>
                <div className="service_cell"><p>{this.props.note.note}</p></div>
            </div>
        );
    }
}

function formatDate(dateString) {
    let date = new Date(dateString);
    return (date.getMonth() + 1) + '/' + (date.getDate()) + '/' + date.getFullYear();
}

export default Services;