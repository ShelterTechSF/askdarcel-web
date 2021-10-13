export class OrganizationPageTestHelpers {
  ORG_TITLE = '[data-cy="org-page-title"]'
  ORG_ABOUT_SECTION = '[data-cy="org-about-section"]'
  ORG_INFO_SECTION = '[data-cy="org-info-section"]'
  ORG_SERVICES_SECTION = '[data-cy="org-services-section"]'
  ORG_SERVICES_LIST = '[data-cy="service-list"]'
  ORG_SERVICES_LIST_ITEM = '[data-cy="service-list-item"]'
  NOTES_SECTION = '[data-cy="notes-section"]'

  url = (orgId: number) => `/organizations/${orgId}`
}
