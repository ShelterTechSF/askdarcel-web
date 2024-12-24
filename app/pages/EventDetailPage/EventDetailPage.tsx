import React, { ReactNode, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import { useParams } from "react-router-dom";
import { BlocksRenderer } from "@strapi/blocks-react-renderer";
import { ActionBarMobile } from "components/DetailPage";
import { InfoTable } from "components/DetailPage/InfoTable";
import { Loader } from "components/ui/Loader";
import { DetailInfoSection } from "components/ui/Cards/DetailInfoSection";
import ListingPageHeader from "components/DetailPage/PageHeader";
import DetailPageWrapper from "components/DetailPage/DetailPageWrapper";
import { DetailAction } from "../../models";
import PageNotFound from "components/ui/PageNotFound";
import { useEventData } from "hooks/StrapiAPI";
import { formatCalendarEventDisplay } from "components/ui/Cards/FormattedDate";
import { CalendarEvent } from "models/Strapi";
import { LabelTag } from "components/ui/LabelTag";

type TagRow = { title: string; value: ReactNode[] };

export const EventDetailPage = () => {
  const { eventListingId } = useParams();
  const { data, error, isLoading } = useEventData(eventListingId as string);

  useEffect(() => window.scrollTo(0, 0), []);

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
      value: formatCalendarEventDisplay(data.calendar_event as CalendarEvent),
    },
  ];
  const registrationRows = [
    {
      title: "Event Link",
      value: data.link?.url || "",
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
        <InfoTable<{ title: string; value: string }>
          rowRenderer={(detail) => (
            <tr key={detail.title}>
              <th>{detail.title}</th>
              <td>
                <ReactMarkdown className="rendered-markdown">
                  {detail.value}
                </ReactMarkdown>
              </td>
            </tr>
          )}
          rows={detailsRows}
        />
      </DetailInfoSection>

      <DetailInfoSection
        title="Registration"
        data-testid="eventdetailpage-detailinfosection"
      >
        <InfoTable<{ title: string; value: string }>
          rowRenderer={(detail) => (
            <tr key={detail.title}>
              <th>{detail.title}</th>
              <td>
                <ReactMarkdown className="rendered-markdown">
                  {detail.value}
                </ReactMarkdown>
              </td>
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
