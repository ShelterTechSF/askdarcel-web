import React from "react";
import { Route, Routes } from "react-router-dom";
import { HomePage } from "pages/HomePage";
import { ContentPage } from "pages/ContentPage";
import { FaqPage } from "pages/FaqPage/FaqPage";
import { OrganizationDetailPage } from "pages/OrganizationDetailPage";
import { ServiceDetailPage } from "pages/ServiceDetailPage/ServiceDetailPage";
import { BrowseResultsPage } from "pages/BrowseResultsPage/BrowseResultsPage";
import { PageHeader } from "components/ui/Navigation/PageHeader";
import { BackButton } from "components/ui/BackButton";
import { SearchHeaderSection } from "components/SearchAndBrowse/Header/SearchHeaderSection";
import { SearchResultsPage } from "pages/SearchResultsPage/SearchResultsPage";
import { PageNotFoundPage } from "pages/PageNotFoundPage/PageNotFoundPage";
import { EventDetailPage } from "pages/EventDetailPage/EventDetailPage";

export const Router = () => {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/about" element={<ContentPage pageName="About" />} />
      <Route path="/faqs" element={<FaqPage />} />
      {/* NB: /organizations/new must be listed before /organizations/:id or else the /new
                step will be interpreted as an ID and will thus break the OrganizationEditPage */}
      <Route
        path="/organizations/:organizationListingId"
        element={
          <>
            <PageHeader>
              <BackButton defaultReturnTo="/search">Back</BackButton>
            </PageHeader>
            <OrganizationDetailPage />
          </>
        }
      />

      <Route
        path="/privacy-policy"
        element={<ContentPage pageName="Privacy Policy" />}
      />
      <Route
        path="/accessibility-statement"
        element={<ContentPage pageName="Accessibility Statement" />}
      />
      <Route
        path="/search"
        element={
          <>
            <PageHeader variant="secondary">
              <SearchHeaderSection descriptionText="Sign up for programs and access resources." />
            </PageHeader>
            <SearchResultsPage />
          </>
        }
      />
      <Route
        path="/services/:serviceListingId"
        element={
          <>
            <PageHeader>
              <BackButton defaultReturnTo="/search">
                Back to Services
              </BackButton>
            </PageHeader>
            <ServiceDetailPage />
          </>
        }
      />
      <Route
        path="/events/:eventListingId"
        element={
          <>
            <PageHeader>
              <BackButton defaultReturnTo="/">Back to Home Page</BackButton>
            </PageHeader>
            <EventDetailPage />
          </>
        }
      />
      <Route
        path="/terms-of-service"
        element={<ContentPage pageName="Terms of Service" />}
      />
      <Route path="/:categorySlug/results" element={<BrowseResultsPage />} />
      <Route path="*" element={<PageNotFoundPage />} />
    </Routes>
  );
};
