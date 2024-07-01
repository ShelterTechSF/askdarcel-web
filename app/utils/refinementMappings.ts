// On search results page, not category listings page

export const eligibilitiesMapping = {
  Disability: [
    "All Disabilities",
    "Developmental Disability",
    "Physical Disability",
    "Learning Disability",
    "Intellectual Disability",
    "Visual Impairment",
    "Limited Mobility",
    "Deaf or Hard of Hearing",
  ],
  Families: ["Families", "Families with Babies"],
  Homeless: ["Homeless"],
  Immigrants: ["Immigrants", "Undocumented"],
  "LGBTQ+": ["LGBTQ+", "LGBTQ", "Transgender and Gender Non-Conforming"], // Todo: "LGBTQ" can be removed from array once LGBTQ eligibility has been switched to LGBTQ+ in DB across all environments
  "Mental Health/Substance Use": ["Mental Illness", "Substance Dependency"],
  "Re-Entry": ["Re-Entry", "In Jail"],
  "Seniors (55+ years old)": ["Seniors (55+ years old)"],
  "Transition Aged Youth": ["Transition Aged Youth", "Teens (13-19 years old)"],
  "Trauma Survivors": [
    "Trauma Survivors",
    "Abuse or Neglect Survivors",
    "Domestic Violence Survivors",
    "PTSD",
  ],
  Veterans: ["Veterans"],
};

// Hardcoded catgories in search page sidebar (Can add multiple categories as array)
/* i.e. "Arts, Culture & Identity": [
  "Arts and Creative Expression",
  "Culinary Arts",
  "Culture & Identity",
  "Dance",
  "Digital Media Production",
  "Disability Support",
  "Justice Involvement",
  "LGBTQ+ Support",
  "Summer Programs"
]
*/
export const categoriesMapping = {
  "Basic Needs & Shelter": ["Basic Needs & Shelter"],
  Employment: ["Employment"],
  "Eviction Prevention": ["Eviction Prevention"],
  "Health & Medical": ["Health & Medical"],
  Housing: ["Housing"],
  Legal: ["Legal"],
};
