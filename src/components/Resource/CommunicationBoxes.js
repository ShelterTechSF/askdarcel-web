import React from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import classNames from 'classnames/bind';
import styles from './Resource.scss';
let MdPublic = require('react-icons/lib/md/public');
let MdLocalPhone = require('react-icons/lib/md/local-phone');

let cx = classNames.bind(styles);

class CommunicationBoxes extends React.Component {
    constructor() {
        super();
        this.isPhone = false;
    }
    render() {
        let iconStyle = cx({
            communicationicon: true,
            active: this.isPhone
        });

        let textStyle = cx({
            communicationtext: true,
            active: this.isPhone
        });

        let websiteContainer = cx({
            communicationcontainer: true,
            borderleft: true
        });

        let phoneContainer = cx({
            communicationcontainer: true,
            borderright: true
        });

        return (
            <div>
                <div className={websiteContainer}>
                    <MdPublic className={iconStyle}/>
                    <p className={textStyle}>Website</p>
                </div>
                <div className={phoneContainer}>
                    <MdLocalPhone className={iconStyle}/>
                    <p className={textStyle}>Phone</p>
                </div>
            </div>
        );
    }
}

export default withStyles(CommunicationBoxes, styles);