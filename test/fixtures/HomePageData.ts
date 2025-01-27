// Sample data from a real api request to our Strapi production server. This
// data may have to change as the api changes so developers should feel at
// liberty to update these fixtures as needed.
export const HOME_PAGE_DATA = {
  data: {
    id: 1,
    attributes: {
      createdAt: "2025-01-24T22:44:25.424Z",
      updatedAt: "2025-01-24T22:56:37.371Z",
      publishedAt: "2025-01-24T22:44:57.690Z",
      hero: {
        id: 1,
        title: "HOME_PAGE_HERO_TITLE",
        description: "HOME_PAGE_HERO_DESCRIPTION",
        background_image: {
          data: null,
        },
        buttons: [
          {
            id: 2,
            url: "/",
            text: "HOME_PAGE_HERO_BUTTON",
          },
        ],
      },
      two_column_content_block: [
        {
          id: 1,
          title: "HOME_PAGE_TWO_COLUMN_CONTENT_BLOCK_TITLE",
          media_align: "right",
          content: [
            {
              type: "heading",
              level: 1,
              children: [
                {
                  bold: true,
                  text: "HOME_PAGE_TWO_COLUMN_CONTENT_BLOCK_CONTENT",
                  type: "text",
                  italic: true,
                  underline: true,
                },
              ],
            },
          ],
          media: {
            data: null,
          },
        },
        {
          id: 2,
          title: "2",
          media_align: "left",
          content: [
            {
              type: "paragraph",
              children: [
                {
                  text: "The names openSEAL and Entessa must not be required to allow Recipient to distribute software through any other Contributor to enforce any provision of this License. Severability. (a) If for any version ever published by the Licensed Program or any part thereof, and wants to make Modifications to the Program is made available via Electronic Distribution Mechanism is maintained by a third party intellectual property claims: (a) under intellectual property rights or to use BeOpen trademarks or trade names in a commercial product offering, Product X. That Distributor is then a Commercial Contributor.",
                  type: "text",
                },
              ],
            },
          ],
          media: {
            data: null,
          },
        },
      ],
    },
  },
  meta: {},
};
