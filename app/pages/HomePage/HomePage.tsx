import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import * as Sentry from '@sentry/browser';
import ax from 'axios';
import qs from 'qs';

import Footer from 'components/ui/Footer/Footer';
import Partners from 'components/ui/Partners/Partners';
import SearchBar from './components/SearchBar';
import Section from './components/Section';
import ResourceList from './components/ResourceList/ResourceList';

const covidResources = [
  { name: 'Food', icon: 'food', categorySlug: 'food-resources' },
  { name: 'Shelter', icon: 'bed', categorySlug: 'shelter-resources' },
  { name: 'Showers and Restrooms', icon: 'shower', categorySlug: 'hygiene-resources' },
  { name: 'Health and COVID-19', icon: 'hospital', categorySlug: 'medical-services-resources' },
  { name: 'Financial Assistance', icon: 'wallet', categorySlug: 'financial-resources' },
  { name: 'Jobs', icon: 'employment', categorySlug: 'job-assistance-resources' },
  { name: 'Rental Assistance and Eviction Prevention', icon: 'housing-1', categorySlug: 'rental-assistance-resources' },
  { name: 'Domestic Violence', icon: 'warning', categorySlug: 'domestic-violence-resources' },
  { name: 'LGBTQ+', icon: 'community', categorySlug: 'lgbtq-resources' },
  { name: 'Internet', icon: 'wifi', categorySlug: 'internet-access-resources' },
];

const generalResources = [{
  name: 'Family Homelessness',
  icon: 'family',
  link: 'https://sheltertech.typeform.com/to/GFEzl2',
  isTypeform: true,
}, {
  name: 'Youth Homelessness',
  icon: 'care',
  link: 'https://sheltertech.typeform.com/to/mXv584',
  isTypeform: true,
}, {
  name: 'Adult Homelessness',
  icon: 'shelter',
  link: 'https://sheltertech.typeform.com/to/KXi3Pp',
  isTypeform: true,
},
{
  name: 'Eviction Prevention',
  icon: 'eviction-prevention',
  link: 'https://sheltertech.typeform.com/to/UpboWbGi',
  isTypeform: true,
},
{
  name: 'Affordable Housing',
  icon: 'housing',
  link: 'https://sheltertech.typeform.com/to/X16WX6wE',
  isTypeform: true,
}];

export const HomePage = () => {
  const [resourceCount, setResourceCount] = useState<number|undefined>()
  const [searchValue, setSearchValue] = useState('')
  const history = useHistory()

  const submitSearch = () => {
    if (searchValue) {
      const query = qs.stringify({ query: searchValue });
      history.push(`/search?${query}`);
    }
  }

  useEffect(() => {
    Sentry.captureException('Cheesy Eggs')
    ax.get('/api/resources/count').then(resp => {
      setResourceCount(resp.data)
    });
  }, [])

  return (
    <div className="find-page">
      <Section
        title="Find essential services in San Francisco"
      >
        <ResourceList resources={covidResources} />
      </Section>
      <Section
        title="Get step-by-step help"
        description="Get guided help with many of the most common issues people are facing in San Francisco."
      >
        <ResourceList resources={generalResources} />
      </Section>
      <Section
        title="Browse Directory"
        description="Search the directory for a specific social service provider or browse by category."
      >
        <SearchBar
          placeholder={`Search ${resourceCount || ''} resources in San Francisco`}
          onSubmit={submitSearch}
          onChange={newSearchValue => setSearchValue(newSearchValue)}
          value={searchValue}
        />
      </Section>
      <Partners />
      <Footer />
    </div>
  );
}
