// Sample data from a real api request to our Strapi production server. This
// data may have to change as the api changes so developers should feel at
// liberty to update these fixtures as needed.

import { RootNode } from "@strapi/blocks-react-renderer/dist/BlocksRenderer";
import { formatHomePageEventsData, useEventData } from "hooks/StrapiAPI";

export const EVENTS_DATA = [
  {
    data: {
      id: 67,
      attributes: {
        title: "Back to School Conference",
        createdAt: "2024-07-22T23:54:56.662Z",
        updatedAt: "2024-12-24T01:55:07.875Z",
        publishedAt: "2024-07-22T23:54:57.828Z",
        location_name: "Somewhere in San Francisco",
        age_group: "Families with children below 18 years old",
        Language: "english, español, 中国人",
        featured: true,
        description: [
          {
            type: "paragraph",
            children: [
              {
                text: "<h1>Qua igitur re ab deo vincitur, si aeternitate non vincitur?</h1>",
                type: "text",
              },
            ],
          },
          { type: "paragraph", children: [{ text: "", type: "text" }] },
          {
            type: "paragraph",
            children: [
              {
                text: '<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. <a href="http://loripsum.net/" target="_blank">Nam quid possumus facere melius?</a> Bork Tum ille timide vel potius verecunde: Facio, inquit. Quae duo sunt, unum facit. </p>',
                type: "text",
              },
            ],
          },
          { type: "paragraph", children: [{ text: "", type: "text" }] },
          {
            type: "paragraph",
            children: [
              {
                text: "<h2>Duo Reges: constructio interrete.</h2>",
                type: "text",
              },
            ],
          },
          { type: "paragraph", children: [{ text: "", type: "text" }] },
          {
            type: "paragraph",
            children: [
              {
                text: "<p>Illum mallem levares, quo optimum atque humanissimum virum, Cn. <b>Quid enim?</b> Quo tandem modo? Bonum incolumis acies: misera caecitas. </p>",
                type: "text",
              },
            ],
          },
          { type: "paragraph", children: [{ text: "", type: "text" }] },
          {
            type: "paragraph",
            children: [
              { text: '<blockquote cite="http://loripsum.net">', type: "text" },
            ],
          },
          {
            type: "paragraph",
            children: [
              {
                text: "\tCur deinde Metrodori liberos commendas?",
                type: "text",
              },
            ],
          },
          {
            type: "paragraph",
            children: [{ text: "</blockquote>", type: "text" }],
          },
          { type: "paragraph", children: [{ text: "", type: "text" }] },
          { type: "paragraph", children: [{ text: "", type: "text" }] },
          { type: "paragraph", children: [{ text: "<ul>", type: "text" }] },
          {
            type: "paragraph",
            children: [
              {
                text: "\t<li>Ratio enim nostra consentit, pugnat oratio.</li>",
                type: "text",
              },
            ],
          },
          {
            type: "paragraph",
            children: [
              {
                text: "\t<li>Qualis ista philosophia est, quae non interitum afferat pravitatis, sed sit contenta mediocritate vitiorum?</li>",
                type: "text",
              },
            ],
          },
          {
            type: "paragraph",
            children: [
              {
                text: "\t<li>Huius ego nunc auctoritatem sequens idem faciam.</li>",
                type: "text",
              },
            ],
          },
          {
            type: "paragraph",
            children: [
              {
                text: "\t<li>Te autem hortamur omnes, currentem quidem, ut spero, ut eos, quos novisse vis, imitari etiam velis.</li>",
                type: "text",
              },
            ],
          },
          { type: "paragraph", children: [{ text: "</ul>", type: "text" }] },
          { type: "paragraph", children: [{ text: "", type: "text" }] },
          { type: "paragraph", children: [{ text: "", type: "text" }] },
          { type: "paragraph", children: [{ text: "<dl>", type: "text" }] },
          {
            type: "paragraph",
            children: [
              { text: "\t<dt><dfn>Optime, inquam.</dfn></dt>", type: "text" },
            ],
          },
          {
            type: "paragraph",
            children: [
              {
                text: "\t<dd>Quod si ita se habeat, non possit beatam praestare vitam sapientia.</dd>",
                type: "text",
              },
            ],
          },
          {
            type: "paragraph",
            children: [{ text: "\t<dt><dfn>Bork</dfn></dt>", type: "text" }],
          },
          {
            type: "paragraph",
            children: [
              {
                text: "\t<dd>Nam si quae sunt aliae, falsum est omnis animi voluptates esse e corporis societate.</dd>",
                type: "text",
              },
            ],
          },
          { type: "paragraph", children: [{ text: "</dl>", type: "text" }] },
          { type: "paragraph", children: [{ text: "", type: "text" }] },
          { type: "paragraph", children: [{ text: "", type: "text" }] },
          { type: "paragraph", children: [{ text: "<ol>", type: "text" }] },
          {
            type: "paragraph",
            children: [
              {
                text: "\t<li>Hanc in motu voluptatem -sic enim has suaves et quasi dulces voluptates appellat-interdum ita extenuat, ut M.</li>",
                type: "text",
              },
            ],
          },
          {
            type: "paragraph",
            children: [
              {
                text: "\t<li>Quae in controversiam veniunt, de iis, si placet, disseramus.</li>",
                type: "text",
              },
            ],
          },
          {
            type: "paragraph",
            children: [
              {
                text: "\t<li>Omnes enim iucundum motum, quo sensus hilaretur.</li>",
                type: "text",
              },
            ],
          },
          {
            type: "paragraph",
            children: [
              {
                text: "\t<li>Quae in controversiam veniunt, de iis, si placet, disseramus.</li>",
                type: "text",
              },
            ],
          },
          {
            type: "paragraph",
            children: [
              { text: "\t<li>Cur id non ita fit?</li>", type: "text" },
            ],
          },
          { type: "paragraph", children: [{ text: "</ol>", type: "text" }] },
          { type: "paragraph", children: [{ text: "", type: "text" }] },
          { type: "paragraph", children: [{ text: "", type: "text" }] },
          {
            type: "paragraph",
            children: [
              {
                text: "<pre>Cuius oratio attende, quaeso, Brute, satisne videatur",
                type: "text",
              },
            ],
          },
          {
            type: "paragraph",
            children: [
              {
                text: "Antiochi complexa esse sententiam, quam tibi, qui fratrem",
                type: "text",
              },
            ],
          },
          {
            type: "paragraph",
            children: [
              {
                text: "eius Aristum frequenter audieris, maxime probatam existimo.",
                type: "text",
              },
            ],
          },
          { type: "paragraph", children: [{ text: "", type: "text" }] },
          {
            type: "paragraph",
            children: [
              {
                text: "Cur igitur easdem res, inquam, Peripateticis dicentibus",
                type: "text",
              },
            ],
          },
          {
            type: "paragraph",
            children: [
              {
                text: "verbum nullum est, quod non intellegatur?",
                type: "text",
              },
            ],
          },
          { type: "paragraph", children: [{ text: "</pre>", type: "text" }] },
          { type: "paragraph", children: [{ text: "", type: "text" }] },
          { type: "paragraph", children: [{ text: "", type: "text" }] },
          {
            type: "paragraph",
            children: [
              {
                text: "<h3>Certe nihil nisi quod possit ipsum propter se iure laudari.</h3>",
                type: "text",
              },
            ],
          },
          { type: "paragraph", children: [{ text: "", type: "text" }] },
          {
            type: "paragraph",
            children: [
              {
                text: "<p>Hoc est non dividere, sed frangere. Quorum sine causa fieri nihil putandum est. Cur haec eadem Democritus? </p>",
                type: "text",
              },
            ],
          },
          { type: "paragraph", children: [{ text: "", type: "text" }] },
          { type: "paragraph", children: [{ text: "", type: "text" }] },
        ] as RootNode[],
        address: { data: null },
        calendar_event: {
          id: 1,
          startdate: "2024-12-19",
          enddate: "2024-12-19",
          starttime: "01:00:00",
          endtime: "05:30:00",
        },
        link: { id: 298, url: "http://example.com", text: "Example.com" },
        image: {
          data: {
            id: 199,
            attributes: {
              name: "Image (10).png",
              alternativeText: null,
              caption: null,
              width: 720,
              height: 739,
              formats: {
                small: {
                  ext: ".png",
                  url: "https://our415cms.s3.us-west-1.amazonaws.com/small_Image_10_83ca28c8d2.png",
                  hash: "small_Image_10_83ca28c8d2",
                  mime: "image/png",
                  name: "small_Image (10).png",
                  path: null,
                  size: 447.56,
                  width: 487,
                  height: 500,
                  sizeInBytes: 447563,
                },
                thumbnail: {
                  ext: ".png",
                  url: "https://our415cms.s3.us-west-1.amazonaws.com/thumbnail_Image_10_83ca28c8d2.png",
                  hash: "thumbnail_Image_10_83ca28c8d2",
                  mime: "image/png",
                  name: "thumbnail_Image (10).png",
                  path: null,
                  size: 51.32,
                  width: 152,
                  height: 156,
                  sizeInBytes: 51322,
                },
              },
              hash: "Image_10_83ca28c8d2",
              ext: ".png",
              mime: "image/png",
              size: 228.3,
              url: "https://our415cms.s3.us-west-1.amazonaws.com/Image_10_83ca28c8d2.png",
              previewUrl: null,
              provider: "aws-s3",
              provider_metadata: null,
              createdAt: "2024-07-24T20:22:24.252Z",
              updatedAt: "2024-07-24T20:22:24.252Z",
              related: [
                { __type: "content.image", id: 166 },
                {
                  __type: "api::event.event",
                  id: 67,
                  title: "Back to School Conference",
                  createdAt: "2024-07-22T23:54:56.662Z",
                  updatedAt: "2024-12-24T01:55:07.875Z",
                  publishedAt: "2024-07-22T23:54:57.828Z",
                  location_name: "Somewhere in San Francisco",
                  age_group: "Families with children below 18 years old",
                  Language: "english, español, 中国人",
                  featured: true,
                  description: [
                    {
                      type: "paragraph",
                      children: [
                        {
                          text: "<h1>Qua igitur re ab deo vincitur, si aeternitate non vincitur?</h1>",
                          type: "text",
                        },
                      ],
                    },
                    {
                      type: "paragraph",
                      children: [{ text: "", type: "text" }],
                    },
                    {
                      type: "paragraph",
                      children: [
                        {
                          text: '<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. <a href="http://loripsum.net/" target="_blank">Nam quid possumus facere melius?</a> Bork Tum ille timide vel potius verecunde: Facio, inquit. Quae duo sunt, unum facit. </p>',
                          type: "text",
                        },
                      ],
                    },
                    {
                      type: "paragraph",
                      children: [{ text: "", type: "text" }],
                    },
                    {
                      type: "paragraph",
                      children: [
                        {
                          text: "<h2>Duo Reges: constructio interrete.</h2>",
                          type: "text",
                        },
                      ],
                    },
                    {
                      type: "paragraph",
                      children: [{ text: "", type: "text" }],
                    },
                    {
                      type: "paragraph",
                      children: [
                        {
                          text: "<p>Illum mallem levares, quo optimum atque humanissimum virum, Cn. <b>Quid enim?</b> Quo tandem modo? Bonum incolumis acies: misera caecitas. </p>",
                          type: "text",
                        },
                      ],
                    },
                    {
                      type: "paragraph",
                      children: [{ text: "", type: "text" }],
                    },
                    {
                      type: "paragraph",
                      children: [
                        {
                          text: '<blockquote cite="http://loripsum.net">',
                          type: "text",
                        },
                      ],
                    },
                    {
                      type: "paragraph",
                      children: [
                        {
                          text: "\tCur deinde Metrodori liberos commendas?",
                          type: "text",
                        },
                      ],
                    },
                    {
                      type: "paragraph",
                      children: [{ text: "</blockquote>", type: "text" }],
                    },
                    {
                      type: "paragraph",
                      children: [{ text: "", type: "text" }],
                    },
                    {
                      type: "paragraph",
                      children: [{ text: "", type: "text" }],
                    },
                    {
                      type: "paragraph",
                      children: [{ text: "<ul>", type: "text" }],
                    },
                    {
                      type: "paragraph",
                      children: [
                        {
                          text: "\t<li>Ratio enim nostra consentit, pugnat oratio.</li>",
                          type: "text",
                        },
                      ],
                    },
                    {
                      type: "paragraph",
                      children: [
                        {
                          text: "\t<li>Qualis ista philosophia est, quae non interitum afferat pravitatis, sed sit contenta mediocritate vitiorum?</li>",
                          type: "text",
                        },
                      ],
                    },
                    {
                      type: "paragraph",
                      children: [
                        {
                          text: "\t<li>Huius ego nunc auctoritatem sequens idem faciam.</li>",
                          type: "text",
                        },
                      ],
                    },
                    {
                      type: "paragraph",
                      children: [
                        {
                          text: "\t<li>Te autem hortamur omnes, currentem quidem, ut spero, ut eos, quos novisse vis, imitari etiam velis.</li>",
                          type: "text",
                        },
                      ],
                    },
                    {
                      type: "paragraph",
                      children: [{ text: "</ul>", type: "text" }],
                    },
                    {
                      type: "paragraph",
                      children: [{ text: "", type: "text" }],
                    },
                    {
                      type: "paragraph",
                      children: [{ text: "", type: "text" }],
                    },
                    {
                      type: "paragraph",
                      children: [{ text: "<dl>", type: "text" }],
                    },
                    {
                      type: "paragraph",
                      children: [
                        {
                          text: "\t<dt><dfn>Optime, inquam.</dfn></dt>",
                          type: "text",
                        },
                      ],
                    },
                    {
                      type: "paragraph",
                      children: [
                        {
                          text: "\t<dd>Quod si ita se habeat, non possit beatam praestare vitam sapientia.</dd>",
                          type: "text",
                        },
                      ],
                    },
                    {
                      type: "paragraph",
                      children: [
                        { text: "\t<dt><dfn>Bork</dfn></dt>", type: "text" },
                      ],
                    },
                    {
                      type: "paragraph",
                      children: [
                        {
                          text: "\t<dd>Nam si quae sunt aliae, falsum est omnis animi voluptates esse e corporis societate.</dd>",
                          type: "text",
                        },
                      ],
                    },
                    {
                      type: "paragraph",
                      children: [{ text: "</dl>", type: "text" }],
                    },
                    {
                      type: "paragraph",
                      children: [{ text: "", type: "text" }],
                    },
                    {
                      type: "paragraph",
                      children: [{ text: "", type: "text" }],
                    },
                    {
                      type: "paragraph",
                      children: [{ text: "<ol>", type: "text" }],
                    },
                    {
                      type: "paragraph",
                      children: [
                        {
                          text: "\t<li>Hanc in motu voluptatem -sic enim has suaves et quasi dulces voluptates appellat-interdum ita extenuat, ut M.</li>",
                          type: "text",
                        },
                      ],
                    },
                    {
                      type: "paragraph",
                      children: [
                        {
                          text: "\t<li>Quae in controversiam veniunt, de iis, si placet, disseramus.</li>",
                          type: "text",
                        },
                      ],
                    },
                    {
                      type: "paragraph",
                      children: [
                        {
                          text: "\t<li>Omnes enim iucundum motum, quo sensus hilaretur.</li>",
                          type: "text",
                        },
                      ],
                    },
                    {
                      type: "paragraph",
                      children: [
                        {
                          text: "\t<li>Quae in controversiam veniunt, de iis, si placet, disseramus.</li>",
                          type: "text",
                        },
                      ],
                    },
                    {
                      type: "paragraph",
                      children: [
                        {
                          text: "\t<li>Cur id non ita fit?</li>",
                          type: "text",
                        },
                      ],
                    },
                    {
                      type: "paragraph",
                      children: [{ text: "</ol>", type: "text" }],
                    },
                    {
                      type: "paragraph",
                      children: [{ text: "", type: "text" }],
                    },
                    {
                      type: "paragraph",
                      children: [{ text: "", type: "text" }],
                    },
                    {
                      type: "paragraph",
                      children: [
                        {
                          text: "<pre>Cuius oratio attende, quaeso, Brute, satisne videatur",
                          type: "text",
                        },
                      ],
                    },
                    {
                      type: "paragraph",
                      children: [
                        {
                          text: "Antiochi complexa esse sententiam, quam tibi, qui fratrem",
                          type: "text",
                        },
                      ],
                    },
                    {
                      type: "paragraph",
                      children: [
                        {
                          text: "eius Aristum frequenter audieris, maxime probatam existimo.",
                          type: "text",
                        },
                      ],
                    },
                    {
                      type: "paragraph",
                      children: [{ text: "", type: "text" }],
                    },
                    {
                      type: "paragraph",
                      children: [
                        {
                          text: "Cur igitur easdem res, inquam, Peripateticis dicentibus",
                          type: "text",
                        },
                      ],
                    },
                    {
                      type: "paragraph",
                      children: [
                        {
                          text: "verbum nullum est, quod non intellegatur?",
                          type: "text",
                        },
                      ],
                    },
                    {
                      type: "paragraph",
                      children: [{ text: "</pre>", type: "text" }],
                    },
                    {
                      type: "paragraph",
                      children: [{ text: "", type: "text" }],
                    },
                    {
                      type: "paragraph",
                      children: [{ text: "", type: "text" }],
                    },
                    {
                      type: "paragraph",
                      children: [
                        {
                          text: "<h3>Certe nihil nisi quod possit ipsum propter se iure laudari.</h3>",
                          type: "text",
                        },
                      ],
                    },
                    {
                      type: "paragraph",
                      children: [{ text: "", type: "text" }],
                    },
                    {
                      type: "paragraph",
                      children: [
                        {
                          text: "<p>Hoc est non dividere, sed frangere. Quorum sine causa fieri nihil putandum est. Cur haec eadem Democritus? </p>",
                          type: "text",
                        },
                      ],
                    },
                    {
                      type: "paragraph",
                      children: [{ text: "", type: "text" }],
                    },
                    {
                      type: "paragraph",
                      children: [{ text: "", type: "text" }],
                    },
                  ] as RootNode[],
                },
              ],
            },
          },
        },
        event_categories: {
          data: [{ id: 1, attributes: { label: "event category" } }],
        },
        event_eligibilities: {
          data: [{ id: 34, attributes: { label: "another eligibility" } }],
        },
      },
    },
    meta: {},
  },
  {
    data: {
      id: 69,
      attributes: {
        title: "In-Person Youth Crew Q&A Session",
        createdAt: "2024-07-23T00:07:09.242Z",
        updatedAt: "2024-12-20T00:32:45.181Z",
        publishedAt: "2024-07-23T00:07:40.042Z",
        location_name: "Somewhere in San Francisco",
        age_group: "Adult, Family",
        Language: "english, espańol, 中国人",
        featured: true,
        description: [
          {
            type: "paragraph",
            children: [
              {
                text: "<h1>Qua igitur re ab deo vincitur, si aeternitate non vincitur?</h1>",
                type: "text",
              },
            ],
          },
          { type: "paragraph", children: [{ text: "", type: "text" }] },
          {
            type: "paragraph",
            children: [
              {
                text: '<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. <a href="http://loripsum.net/" target="_blank">Nam quid possumus facere melius?</a> Bork Tum ille timide vel potius verecunde: Facio, inquit. Quae duo sunt, unum facit. </p>',
                type: "text",
              },
            ],
          },
          { type: "paragraph", children: [{ text: "", type: "text" }] },
          {
            type: "paragraph",
            children: [
              {
                text: "<h2>Duo Reges: constructio interrete.</h2>",
                type: "text",
              },
            ],
          },
          { type: "paragraph", children: [{ text: "", type: "text" }] },
          {
            type: "paragraph",
            children: [
              {
                text: "<p>Illum mallem levares, quo optimum atque humanissimum virum, Cn. <b>Quid enim?</b> Quo tandem modo? Bonum incolumis acies: misera caecitas. </p>",
                type: "text",
              },
            ],
          },
          { type: "paragraph", children: [{ text: "", type: "text" }] },
          {
            type: "paragraph",
            children: [
              { text: '<blockquote cite="http://loripsum.net">', type: "text" },
            ],
          },
          {
            type: "paragraph",
            children: [
              {
                text: "\tCur deinde Metrodori liberos commendas?",
                type: "text",
              },
            ],
          },
          {
            type: "paragraph",
            children: [{ text: "</blockquote>", type: "text" }],
          },
          { type: "paragraph", children: [{ text: "", type: "text" }] },
          { type: "paragraph", children: [{ text: "", type: "text" }] },
          { type: "paragraph", children: [{ text: "<ul>", type: "text" }] },
          {
            type: "paragraph",
            children: [
              {
                text: "\t<li>Ratio enim nostra consentit, pugnat oratio.</li>",
                type: "text",
              },
            ],
          },
          {
            type: "paragraph",
            children: [
              {
                text: "\t<li>Qualis ista philosophia est, quae non interitum afferat pravitatis, sed sit contenta mediocritate vitiorum?</li>",
                type: "text",
              },
            ],
          },
          {
            type: "paragraph",
            children: [
              {
                text: "\t<li>Huius ego nunc auctoritatem sequens idem faciam.</li>",
                type: "text",
              },
            ],
          },
          {
            type: "paragraph",
            children: [
              {
                text: "\t<li>Te autem hortamur omnes, currentem quidem, ut spero, ut eos, quos novisse vis, imitari etiam velis.</li>",
                type: "text",
              },
            ],
          },
          { type: "paragraph", children: [{ text: "</ul>", type: "text" }] },
          { type: "paragraph", children: [{ text: "", type: "text" }] },
          { type: "paragraph", children: [{ text: "", type: "text" }] },
          { type: "paragraph", children: [{ text: "<dl>", type: "text" }] },
          {
            type: "paragraph",
            children: [
              { text: "\t<dt><dfn>Optime, inquam.</dfn></dt>", type: "text" },
            ],
          },
          {
            type: "paragraph",
            children: [
              {
                text: "\t<dd>Quod si ita se habeat, non possit beatam praestare vitam sapientia.</dd>",
                type: "text",
              },
            ],
          },
          {
            type: "paragraph",
            children: [{ text: "\t<dt><dfn>Bork</dfn></dt>", type: "text" }],
          },
          {
            type: "paragraph",
            children: [
              {
                text: "\t<dd>Nam si quae sunt aliae, falsum est omnis animi voluptates esse e corporis societate.</dd>",
                type: "text",
              },
            ],
          },
          { type: "paragraph", children: [{ text: "</dl>", type: "text" }] },
          { type: "paragraph", children: [{ text: "", type: "text" }] },
          { type: "paragraph", children: [{ text: "", type: "text" }] },
          { type: "paragraph", children: [{ text: "<ol>", type: "text" }] },
          {
            type: "paragraph",
            children: [
              {
                text: "\t<li>Hanc in motu voluptatem -sic enim has suaves et quasi dulces voluptates appellat-interdum ita extenuat, ut M.</li>",
                type: "text",
              },
            ],
          },
          {
            type: "paragraph",
            children: [
              {
                text: "\t<li>Quae in controversiam veniunt, de iis, si placet, disseramus.</li>",
                type: "text",
              },
            ],
          },
          {
            type: "paragraph",
            children: [
              {
                text: "\t<li>Omnes enim iucundum motum, quo sensus hilaretur.</li>",
                type: "text",
              },
            ],
          },
          {
            type: "paragraph",
            children: [
              {
                text: "\t<li>Quae in controversiam veniunt, de iis, si placet, disseramus.</li>",
                type: "text",
              },
            ],
          },
          {
            type: "paragraph",
            children: [
              { text: "\t<li>Cur id non ita fit?</li>", type: "text" },
            ],
          },
          { type: "paragraph", children: [{ text: "</ol>", type: "text" }] },
          { type: "paragraph", children: [{ text: "", type: "text" }] },
          { type: "paragraph", children: [{ text: "", type: "text" }] },
          {
            type: "paragraph",
            children: [
              {
                text: "<pre>Cuius oratio attende, quaeso, Brute, satisne videatur",
                type: "text",
              },
            ],
          },
          {
            type: "paragraph",
            children: [
              {
                text: "Antiochi complexa esse sententiam, quam tibi, qui fratrem",
                type: "text",
              },
            ],
          },
          {
            type: "paragraph",
            children: [
              {
                text: "eius Aristum frequenter audieris, maxime probatam existimo.",
                type: "text",
              },
            ],
          },
          { type: "paragraph", children: [{ text: "", type: "text" }] },
          {
            type: "paragraph",
            children: [
              {
                text: "Cur igitur easdem res, inquam, Peripateticis dicentibus",
                type: "text",
              },
            ],
          },
          {
            type: "paragraph",
            children: [
              {
                text: "verbum nullum est, quod non intellegatur?",
                type: "text",
              },
            ],
          },
          { type: "paragraph", children: [{ text: "</pre>", type: "text" }] },
          { type: "paragraph", children: [{ text: "", type: "text" }] },
          { type: "paragraph", children: [{ text: "", type: "text" }] },
          {
            type: "paragraph",
            children: [
              {
                text: "<h3>Certe nihil nisi quod possit ipsum propter se iure laudari.</h3>",
                type: "text",
              },
            ],
          },
          { type: "paragraph", children: [{ text: "", type: "text" }] },
          {
            type: "paragraph",
            children: [
              {
                text: "<p>Hoc est non dividere, sed frangere. Quorum sine causa fieri nihil putandum est. Cur haec eadem Democritus? </p>",
                type: "text",
              },
            ],
          },
          { type: "paragraph", children: [{ text: "", type: "text" }] },
          { type: "paragraph", children: [{ text: "", type: "text" }] },
        ] as RootNode[],
        address: { data: null },
        calendar_event: {
          id: 100,
          startdate: "2024-12-20",
          enddate: "2024-12-20",
          starttime: "15:30:00",
          endtime: "16:30:00",
        },
        link: {
          id: 299,
          url: "http://example.com",
          text: "Link destination fake",
        },
        image: {
          data: {
            id: 172,
            attributes: {
              name: "https___cdn.evbuc.com_images_795433379_1307632155513_1_original.jpeg",
              alternativeText: null,
              caption: null,
              width: 940,
              height: 470,
              formats: {
                small: {
                  ext: ".jpeg",
                  url: "https://our415cms.s3.us-west-1.amazonaws.com/small_https_cdn_evbuc_com_images_795433379_1307632155513_1_original_5da7689316.jpeg",
                  hash: "small_https_cdn_evbuc_com_images_795433379_1307632155513_1_original_5da7689316",
                  mime: "image/jpeg",
                  name: "small_https___cdn.evbuc.com_images_795433379_1307632155513_1_original.jpeg",
                  path: null,
                  size: 40.56,
                  width: 500,
                  height: 250,
                  sizeInBytes: 40557,
                },
                medium: {
                  ext: ".jpeg",
                  url: "https://our415cms.s3.us-west-1.amazonaws.com/medium_https_cdn_evbuc_com_images_795433379_1307632155513_1_original_5da7689316.jpeg",
                  hash: "medium_https_cdn_evbuc_com_images_795433379_1307632155513_1_original_5da7689316",
                  mime: "image/jpeg",
                  name: "medium_https___cdn.evbuc.com_images_795433379_1307632155513_1_original.jpeg",
                  path: null,
                  size: 83.98,
                  width: 750,
                  height: 375,
                  sizeInBytes: 83978,
                },
                thumbnail: {
                  ext: ".jpeg",
                  url: "https://our415cms.s3.us-west-1.amazonaws.com/thumbnail_https_cdn_evbuc_com_images_795433379_1307632155513_1_original_5da7689316.jpeg",
                  hash: "thumbnail_https_cdn_evbuc_com_images_795433379_1307632155513_1_original_5da7689316",
                  mime: "image/jpeg",
                  name: "thumbnail_https___cdn.evbuc.com_images_795433379_1307632155513_1_original.jpeg",
                  path: null,
                  size: 11.56,
                  width: 245,
                  height: 123,
                  sizeInBytes: 11555,
                },
              },
              hash: "https_cdn_evbuc_com_images_795433379_1307632155513_1_original_5da7689316",
              ext: ".jpeg",
              mime: "image/jpeg",
              size: 130.55,
              url: "https://our415cms.s3.us-west-1.amazonaws.com/https_cdn_evbuc_com_images_795433379_1307632155513_1_original_5da7689316.jpeg",
              previewUrl: null,
              provider: "aws-s3",
              provider_metadata: null,
              createdAt: "2024-07-23T00:06:38.550Z",
              updatedAt: "2024-07-23T00:06:38.550Z",
              related: [
                {
                  __type: "api::event.event",
                  id: 69,
                  title: "In-Person Youth Crew Q&A Session",
                  createdAt: "2024-07-23T00:07:09.242Z",
                  updatedAt: "2024-12-20T00:32:45.181Z",
                  publishedAt: "2024-07-23T00:07:40.042Z",
                  location_name: "Somewhere in San Francisco",
                  age_group: "Adult, Family",
                  Language: "english, espańol, 中国人",
                  featured: true,
                  description: [
                    {
                      type: "paragraph",
                      children: [
                        {
                          text: "<h1>Qua igitur re ab deo vincitur, si aeternitate non vincitur?</h1>",
                          type: "text",
                        },
                      ],
                    },
                    {
                      type: "paragraph",
                      children: [{ text: "", type: "text" }],
                    },
                    {
                      type: "paragraph",
                      children: [
                        {
                          text: '<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. <a href="http://loripsum.net/" target="_blank">Nam quid possumus facere melius?</a> Bork Tum ille timide vel potius verecunde: Facio, inquit. Quae duo sunt, unum facit. </p>',
                          type: "text",
                        },
                      ],
                    },
                    {
                      type: "paragraph",
                      children: [{ text: "", type: "text" }],
                    },
                    {
                      type: "paragraph",
                      children: [
                        {
                          text: "<h2>Duo Reges: constructio interrete.</h2>",
                          type: "text",
                        },
                      ],
                    },
                    {
                      type: "paragraph",
                      children: [{ text: "", type: "text" }],
                    },
                    {
                      type: "paragraph",
                      children: [
                        {
                          text: "<p>Illum mallem levares, quo optimum atque humanissimum virum, Cn. <b>Quid enim?</b> Quo tandem modo? Bonum incolumis acies: misera caecitas. </p>",
                          type: "text",
                        },
                      ],
                    },
                    {
                      type: "paragraph",
                      children: [{ text: "", type: "text" }],
                    },
                    {
                      type: "paragraph",
                      children: [
                        {
                          text: '<blockquote cite="http://loripsum.net">',
                          type: "text",
                        },
                      ],
                    },
                    {
                      type: "paragraph",
                      children: [
                        {
                          text: "\tCur deinde Metrodori liberos commendas?",
                          type: "text",
                        },
                      ],
                    },
                    {
                      type: "paragraph",
                      children: [{ text: "</blockquote>", type: "text" }],
                    },
                    {
                      type: "paragraph",
                      children: [{ text: "", type: "text" }],
                    },
                    {
                      type: "paragraph",
                      children: [{ text: "", type: "text" }],
                    },
                    {
                      type: "paragraph",
                      children: [{ text: "<ul>", type: "text" }],
                    },
                    {
                      type: "paragraph",
                      children: [
                        {
                          text: "\t<li>Ratio enim nostra consentit, pugnat oratio.</li>",
                          type: "text",
                        },
                      ],
                    },
                    {
                      type: "paragraph",
                      children: [
                        {
                          text: "\t<li>Qualis ista philosophia est, quae non interitum afferat pravitatis, sed sit contenta mediocritate vitiorum?</li>",
                          type: "text",
                        },
                      ],
                    },
                    {
                      type: "paragraph",
                      children: [
                        {
                          text: "\t<li>Huius ego nunc auctoritatem sequens idem faciam.</li>",
                          type: "text",
                        },
                      ],
                    },
                    {
                      type: "paragraph",
                      children: [
                        {
                          text: "\t<li>Te autem hortamur omnes, currentem quidem, ut spero, ut eos, quos novisse vis, imitari etiam velis.</li>",
                          type: "text",
                        },
                      ],
                    },
                    {
                      type: "paragraph",
                      children: [{ text: "</ul>", type: "text" }],
                    },
                    {
                      type: "paragraph",
                      children: [{ text: "", type: "text" }],
                    },
                    {
                      type: "paragraph",
                      children: [{ text: "", type: "text" }],
                    },
                    {
                      type: "paragraph",
                      children: [{ text: "<dl>", type: "text" }],
                    },
                    {
                      type: "paragraph",
                      children: [
                        {
                          text: "\t<dt><dfn>Optime, inquam.</dfn></dt>",
                          type: "text",
                        },
                      ],
                    },
                    {
                      type: "paragraph",
                      children: [
                        {
                          text: "\t<dd>Quod si ita se habeat, non possit beatam praestare vitam sapientia.</dd>",
                          type: "text",
                        },
                      ],
                    },
                    {
                      type: "paragraph",
                      children: [
                        { text: "\t<dt><dfn>Bork</dfn></dt>", type: "text" },
                      ],
                    },
                    {
                      type: "paragraph",
                      children: [
                        {
                          text: "\t<dd>Nam si quae sunt aliae, falsum est omnis animi voluptates esse e corporis societate.</dd>",
                          type: "text",
                        },
                      ],
                    },
                    {
                      type: "paragraph",
                      children: [{ text: "</dl>", type: "text" }],
                    },
                    {
                      type: "paragraph",
                      children: [{ text: "", type: "text" }],
                    },
                    {
                      type: "paragraph",
                      children: [{ text: "", type: "text" }],
                    },
                    {
                      type: "paragraph",
                      children: [{ text: "<ol>", type: "text" }],
                    },
                    {
                      type: "paragraph",
                      children: [
                        {
                          text: "\t<li>Hanc in motu voluptatem -sic enim has suaves et quasi dulces voluptates appellat-interdum ita extenuat, ut M.</li>",
                          type: "text",
                        },
                      ],
                    },
                    {
                      type: "paragraph",
                      children: [
                        {
                          text: "\t<li>Quae in controversiam veniunt, de iis, si placet, disseramus.</li>",
                          type: "text",
                        },
                      ],
                    },
                    {
                      type: "paragraph",
                      children: [
                        {
                          text: "\t<li>Omnes enim iucundum motum, quo sensus hilaretur.</li>",
                          type: "text",
                        },
                      ],
                    },
                    {
                      type: "paragraph",
                      children: [
                        {
                          text: "\t<li>Quae in controversiam veniunt, de iis, si placet, disseramus.</li>",
                          type: "text",
                        },
                      ],
                    },
                    {
                      type: "paragraph",
                      children: [
                        {
                          text: "\t<li>Cur id non ita fit?</li>",
                          type: "text",
                        },
                      ],
                    },
                    {
                      type: "paragraph",
                      children: [{ text: "</ol>", type: "text" }],
                    },
                    {
                      type: "paragraph",
                      children: [{ text: "", type: "text" }],
                    },
                    {
                      type: "paragraph",
                      children: [{ text: "", type: "text" }],
                    },
                    {
                      type: "paragraph",
                      children: [
                        {
                          text: "<pre>Cuius oratio attende, quaeso, Brute, satisne videatur",
                          type: "text",
                        },
                      ],
                    },
                    {
                      type: "paragraph",
                      children: [
                        {
                          text: "Antiochi complexa esse sententiam, quam tibi, qui fratrem",
                          type: "text",
                        },
                      ],
                    },
                    {
                      type: "paragraph",
                      children: [
                        {
                          text: "eius Aristum frequenter audieris, maxime probatam existimo.",
                          type: "text",
                        },
                      ],
                    },
                    {
                      type: "paragraph",
                      children: [{ text: "", type: "text" }],
                    },
                    {
                      type: "paragraph",
                      children: [
                        {
                          text: "Cur igitur easdem res, inquam, Peripateticis dicentibus",
                          type: "text",
                        },
                      ],
                    },
                    {
                      type: "paragraph",
                      children: [
                        {
                          text: "verbum nullum est, quod non intellegatur?",
                          type: "text",
                        },
                      ],
                    },
                    {
                      type: "paragraph",
                      children: [{ text: "</pre>", type: "text" }],
                    },
                    {
                      type: "paragraph",
                      children: [{ text: "", type: "text" }],
                    },
                    {
                      type: "paragraph",
                      children: [{ text: "", type: "text" }],
                    },
                    {
                      type: "paragraph",
                      children: [
                        {
                          text: "<h3>Certe nihil nisi quod possit ipsum propter se iure laudari.</h3>",
                          type: "text",
                        },
                      ],
                    },
                    {
                      type: "paragraph",
                      children: [{ text: "", type: "text" }],
                    },
                    {
                      type: "paragraph",
                      children: [
                        {
                          text: "<p>Hoc est non dividere, sed frangere. Quorum sine causa fieri nihil putandum est. Cur haec eadem Democritus? </p>",
                          type: "text",
                        },
                      ],
                    },
                    {
                      type: "paragraph",
                      children: [{ text: "", type: "text" }],
                    },
                    {
                      type: "paragraph",
                      children: [{ text: "", type: "text" }],
                    },
                  ] as RootNode[],
                },
                { __type: "content.image", id: 139 },
              ],
            },
          },
        },
        event_categories: { data: [] },
        event_eligibilities: {
          data: [{ id: 1, attributes: { label: "event eligibility test" } }],
        },
      },
    },
    meta: {},
  },
];

export const createFormattedHomePageEventsData = () =>
  formatHomePageEventsData({
    data: [
      {
        id: EVENTS_DATA[0].data.id,
        attributes: EVENTS_DATA[0].data.attributes,
      },
      {
        id: EVENTS_DATA[1].data.id,
        attributes: EVENTS_DATA[1].data.attributes,
      },
    ],
  });

export const createFormattedEventData = (): ReturnType<
  typeof useEventData
>["data"] => ({
  ...EVENTS_DATA[0].data.attributes,
  id: 10,
  categories: [{ id: 11111, label: "Fake Label" }],
  eligibilities: [{ id: 11111, label: "Fake Label" }],
});
