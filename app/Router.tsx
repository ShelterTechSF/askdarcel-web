import React from "react";
import { Route, Routes } from "react-router-dom";
import { HomePage } from "pages/HomePage";
import { AboutPage } from "pages/AboutPage";
import { FaqPage } from "pages/FaqPage/FaqPage";
import { ListingDebugPage } from "pages/debug/ListingDemoPage";
import { OrganizationListingPage } from "pages/OrganizationListingPage";
import { PrivacyPolicyPage } from "pages/legal/PrivacyPolicy";
import { ServiceListingPage } from "pages/ServiceListingPage/ServiceListingPage";
import { TermsOfServicePage } from "pages/legal/TermsOfService";
import { ServiceDiscoveryResults } from "pages/ServiceDiscoveryResults";
import { SecondaryNavigationWrapper } from "components/navigation/SecondaryNavigationWrapper";
import { BackButton } from "components/ui/BackButton";
import { SearchHeaderSection } from "components/search/Header/SearchHeaderSection";
import { SearchResultsPage } from "pages/SearchResultsPage/SearchResultsPage";

export const Router = () => {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/about" element={<AboutPage />} />
      <Route path="/faqs" element={<FaqPage />} />
      <Route path="/demo/listing" element={<ListingDebugPage />} />
      {/* NB: /organizations/new must be listed before /organizations/:id or else the /new
                step will be interpreted as an ID and will thus break the OrganizationEditPage */}
      <Route
        path="/organizations/:organizationListingId"
        element={
          <>
            <SecondaryNavigationWrapper>
              <BackButton defaultReturnTo="/search">Back</BackButton>
            </SecondaryNavigationWrapper>
            <OrganizationListingPage />
          </>
        }
      />

      <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
      <Route
        path="/search"
        element={
          <>
            <SecondaryNavigationWrapper>
              <SearchHeaderSection descriptionText="Sign up for programs and access resources." />
            </SecondaryNavigationWrapper>
            <SearchResultsPage />
          </>
        }
      />
      <Route
        path="/services/:serviceListingId"
        element={
          <>
            <SecondaryNavigationWrapper>
              <BackButton defaultReturnTo="/search">
                Back to Services
              </BackButton>
            </SecondaryNavigationWrapper>
            <ServiceListingPage />
          </>
        }
      />
      <Route path="/terms-of-service" element={<TermsOfServicePage />} />
      <Route
        path="/:categorySlug/results"
        element={<ServiceDiscoveryResults />}
      />
    </Routes>
  );
};
