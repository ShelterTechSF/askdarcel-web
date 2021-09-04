export class OrganizationPageTestHelpers {
  ORG_TITLE = '[data-cy="org-page-title"]'
  ORG_SERVICES_SECTION = '[data-cy="org-services-section"]'
  ORG_SERVICES_LIST = '[data-cy="service-list"]'
  ORG_SERVICES_LIST_ITEM = '[data-cy="service-list-item"]'

  url = (orgId: number) => `/organizations/${orgId}`
}
