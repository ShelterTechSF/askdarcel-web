import React from 'react';
import { Redirect, useLocation } from 'react-router-dom';

export const RedirectToOrganizations = () => {
  const { search } = useLocation();
  const params = new URLSearchParams(search);
  return <Redirect to={`/organizations/${params.get('id')}`} />;
};

export const RedirectToOrganizationsEdit = () => {
  const { search } = useLocation();
  const params = new URLSearchParams(search);
  return <Redirect to={`/organizations/${params.get('resourceid')}/edit`} />;
};
