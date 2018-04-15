import React from 'react';
import { InstantSearch, Configure } from 'react-instantsearch/dom';
import AutoComplete from './AutoComplete';


const SearchBox = () => (
  <InstantSearch
    appId="J8TVT53HPZ"
    apiKey="fdf77b152ff7ce0ea4e4221ff3d17d85"
    indexName="development_service_Resource"
  >
    <AutoComplete />
    <Configure hitsPerPage={20} />
  </InstantSearch>

);

export default SearchBox;
