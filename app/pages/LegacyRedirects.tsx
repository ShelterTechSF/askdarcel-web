import React from 'react';
import { Redirect, useLocation } from 'react-router-dom';

export function RedirectToOrganizations() {
  const { search } = useLocation();
  const params = new URLSearchParams(search);
  return <Redirect to={`/organizations/${params.get('id')}`} />;
}

export function RedirectToOrganizationsEdit() {
  const { search } = useLocation();
  const params = new URLSearchParams(search);
  return <Redirect to={`/organizations/${params.get('resourceid')}/edit`} />;
}
