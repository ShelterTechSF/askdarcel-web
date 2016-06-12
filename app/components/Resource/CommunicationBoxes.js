import React from 'react';
import classNames from 'classnames';
let MdPublic = require('react-icons/lib/md/public');
let MdLocalPhone = require('react-icons/lib/md/local-phone');

class CommunicationBoxes extends React.Component {
    constructor() {
        super();
        this.isPhone = false;
    }
    render() {
        let iconStyle = classNames({
            communicationicon: true,
            active: this.isPhone
        });

        let textStyle = classNames({
            communicationtext: true,
            active: this.isPhone
        });

        return (
            <div className="communicationcontainer">
                <div>
                    <div className="center">
                        <MdPublic className={iconStyle}/>
                        <p className={textStyle}>Website</p>
                    </div>
                </div>
                <div>
                    <div className="center">
                        <MdLocalPhone className={iconStyle}/>
                        <p className={textStyle}>Phone</p>
                    </div>
                </div>
            </div>
        );
    }
}

export default CommunicationBoxes;