import React, { ReactNode } from "react";
import { useParams } from "react-router-dom";
import { BlocksRenderer } from "@strapi/blocks-react-renderer";
import { CalendarEvent } from "models/Strapi";
import { DetailAction } from "../../models";
import { InfoTable } from "components/DetailPage/InfoTable";
import { DetailInfoSection } from "components/ui/Cards/DetailInfoSection";
import { formatCalendarEventDisplay } from "components/ui/Cards/FormattedDate";
import { Loader } from "components/ui/Loader";
import DetailPageWrapper from "components/DetailPage/DetailPageWrapper";
import ListingPageHeader from "components/DetailPage/PageHeader";
import { ActionBarMobile } from "components/DetailPage";
import PageNotFound from "components/ui/PageNotFound";
import { useEventData } from "hooks/StrapiAPI";
import { LabelTag } from "components/ui/LabelTag";

type TagRow = { title: string; value: ReactNode[] };

export const EventDetailPage = () => {
  const { eventListingId } = useParams();
  const { data, error, isLoading } = useEventData(eventListingId as string);

  if (error) {
    return (
      <DetailPageWrapper
        title="Our415 - Page Error"
        description=""
        sidebarActions={[]}
        onClickAction={() => "noop"}
      >
        <PageNotFound />
      </DetailPageWrapper>
    );
  }

  if (!data || isLoading) {
    return <Loader />;
  }

  const detailsRows = [
    {
      title: "Date & Time",
      value:
        data.calendar_event?.startdate &&
        formatCalendarEventDisplay(data.calendar_event as CalendarEvent),
    },
    {
      title: "Location",
      value: data.location_name,
    },
    {
      title: "Language",
      value: data.Language,
    },
  ].filter((row) => !!row.value);

  const registrationRows = [
    {
      title: "Event Link",
      value: data.registration_link?.url ? (
        <a
          href={data.registration_link.url}
          target="_blank"
          rel="noopener noreferrer"
        >
          {data.registration_link.url}
        </a>
      ) : (
        "No registration link available"
      ),
    },
  ];

  const tagRows = [
    {
      title: "Categories",
      value: data.categories?.map((category) => (
        <LabelTag key={category.id} label={category.label} />
      )),
    },
    {
      title: "Eligibilities",
      value: data.eligibilities?.map((eligibility) => (
        <LabelTag key={eligibility.id} label={eligibility.label} />
      )),
    },
    {
      title: "Age Group",
      value: data.age_group && <LabelTag label={data.age_group} />,
    },
  ].filter((row) => row.value !== undefined) as Array<TagRow>;

  const onClickAction = (action: DetailAction) => {
    switch (action.icon) {
      case "print":
        window.print();
        break;
      default:
        break;
    }
  };

  return (
    <DetailPageWrapper
      title={`Our415 - ${data.title}`}
      description={""}
      sidebarActions={[]}
      onClickAction={onClickAction}
    >
      <ListingPageHeader
        title={data.title as string}
        dataCy="event-page-title"
      />

      <span className="no-print">
        <ActionBarMobile actions={[]} onClickAction={onClickAction} />
      </span>

      <DetailInfoSection
        title="About"
        data-testid="eventdetailpage-detailinfosection"
      >
        <BlocksRenderer content={data.description || []} />
      </DetailInfoSection>

      <DetailInfoSection
        title="Details"
        data-testid="eventdetailpage-detailinfosection"
      >
        <InfoTable<{ title: string; value: ReactNode }>
          rowRenderer={(detail) => (
            <tr key={detail.title}>
              <th>{detail.title}</th>
              <td>{detail.value}</td>
            </tr>
          )}
          rows={detailsRows}
        />
      </DetailInfoSection>

      <DetailInfoSection
        title="Registration"
        data-testid="eventdetailpage-detailinfosection"
      >
        <InfoTable<{ title: string; value: ReactNode }>
          rowRenderer={(detail) => (
            <tr key={detail.title}>
              <th>{detail.title}</th>
              <td>{detail.value}</td>
            </tr>
          )}
          rows={registrationRows}
        />
      </DetailInfoSection>
      <DetailInfoSection
        title="Tags"
        borderBottom={false}
        data-testid="eventdetailpage-detailinfosection"
      >
        <InfoTable<TagRow>
          rowRenderer={(row) => (
            <tr key={row.title}>
              <th>{row.title}</th>
              <td>{row.value}</td>
            </tr>
          )}
          rows={tagRows}
        />
      </DetailInfoSection>
    </DetailPageWrapper>
  );
};
