import React, { Component } from 'react';

const SearchTabView = ({description, application_info, schedule}) => (
    <div className="search-tab-view">
    <ul>
        <li>HOW TO APPLY</li>
        <li>DESCRIPTION</li>
        <li>HOURS</li>
    </ul>
    
    <div>If you need emergency shelter, call the support line at (415)255-0165 for referrals, shelter intake, or counseling.</div>
    </div>
);

export default SearchTabView;