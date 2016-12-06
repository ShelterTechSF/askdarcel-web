import React from 'react';
import { Link } from 'react-router';
import { browserHistory } from 'react-router'
import { images } from '../../assets';
import Loader from '../Loader';

import EditSections from './EditSections';

class Edit extends React.Component {
    constructor() {
        super();
        this.state = {
            // resource: void 0,``
            // newResource: void 0
        }

        this.updateResourceField = this.updateResourceField.bind(this);
    }

    componentDidMount() {
        let { query } = this.props.location;
	    let resourceID = query.resourceid;
	    let url = '/api/resources/' + resourceID;
	    fetch(url).then(r => r.json())
	    .then(data => {
	      	this.setState({resource: data.resource});
	    });
    }

    updateResourceField(field) {

    }

    render() {
        return (
            !this.state.resource ? <Loader /> :
            <div className="edit-page">
                <header className="edit-header">
                    <a className="back-btn"></a>
                    <h1 className="edit-title">Organisation Name</h1>
                    <a className="edit-submit-btn">Save</a>
                </header>
                <ul className="edit-sections">
                    <EditSections resource={this.state.resource}/>
                </ul>
            </div>
        )
    }
}

export default Edit;
