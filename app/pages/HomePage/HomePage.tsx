import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import qs from 'qs';

import { getResourceCount } from 'utils/DataService';
import { Footer } from 'components/ui';
import { Partners } from './components/Partners/Partners';
import { SearchBar } from './components/SearchBar/SearchBar';
import { HomePageSection } from './components/Section/Section';
import ResourceList from './components/ResourceList/ResourceList';

const covidResources = [
  { name: 'Food', icon: 'food', categorySlug: 'food-resources' },
  { name: 'Shelters', icon: 'bed', categorySlug: 'shelter-resources' },
  { name: 'Showers, Hygiene and other Services', icon: 'shower', categorySlug: 'hygiene-resources' },
  { name: 'Health and COVID-19', icon: 'hospital', categorySlug: 'medical-services-resources' },
  { name: 'Financial Assistance', icon: 'wallet', categorySlug: 'financial-resources' },
  { name: 'Jobs', icon: 'employment', categorySlug: 'job-assistance-resources' },
  { name: 'Rental Assistance and Eviction Prevention', icon: 'housing-1', categorySlug: 'rental-assistance-resources' },
  { name: 'Resources for Domestic Violence Survivors', icon: 'warning', categorySlug: 'domestic-violence-resources' },
  { name: 'LGBTQ+ Resources', icon: 'community', categorySlug: 'lgbtq-resources' },
  { name: 'Internet', icon: 'wifi', categorySlug: 'internet-access-resources' },
  // Todo: Use long term housing icon when it is available. Change category slug when LTH
  // when b/e work is completed
  { name: 'Long-term Housing', icon: 'bed', categorySlug: 'longterm-housing-resources' },
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
  const [resourceCount, setResourceCount] = useState<number | undefined>();
  const [searchValue, setSearchValue] = useState('');
  const history = useHistory();

  const submitSearch = () => {
    if (searchValue) {
      const query = qs.stringify({ query: searchValue });
      history.push(`/search?${query}`);
    }
  };

  useEffect(() => {
    getResourceCount().then((count: number) => setResourceCount(count));
  }, []);

  return (
    <div className="find-page">
      <HomePageSection
        title="Find essential services in San Francisco"
      >
        <ResourceList resources={covidResources} />
      </HomePageSection>
      <HomePageSection
        title="Get step-by-step help"
        description="Get guided help with many of the most common issues people are facing in San Francisco."
      >
        <ResourceList resources={generalResources} />
      </HomePageSection>
      <HomePageSection
        title="Browse Directory"
        description="Search the directory for a specific social service provider or browse by category."
      >
        <SearchBar
          placeholder={`Search ${resourceCount || ''} resources in San Francisco`}
          onSubmit={submitSearch}
          onChange={(newSearchValue: string) => setSearchValue(newSearchValue)}
          value={searchValue}
        />
      </HomePageSection>
      <Partners />
      <Footer />
    </div>
  );
};
