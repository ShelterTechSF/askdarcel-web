import { RefinementListItem } from "instantsearch.js/es/connectors/refinement-list/connectRefinementList";

// On search results page, not category listings page

// Hardcoded categories in search page sidebar (Can add multiple categories as array)
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

/* SUBCATEGORIES */

// From DCYF spreadsheet (contains duplicates):
const OUR415_SUBCATS_WITH_DUPLICATES = [
  "Arts & Creative Expression",
  "Culinary Arts",
  "Culture & Identity",
  "Dance",
  "Digital Media Production",
  "Disability Support",
  "Justice Involvement",
  "LGBTQ+ Support",
  "Summer Programs",
  "After & Before School",
  "Childcare",
  "Playgroups",
  "Summer Programs",
  "Academic Support",
  "Alternative Education & GED",
  "College Prep",
  "Computer Class",
  "Disability Support",
  "Financial Education",
  "Foreign Languages",
  "Free City College",
  "Justice Involvement",
  "Learning English",
  "LGBTQ+ Support",
  "Public Schools",
  "Reading & Literacy",
  "SEL (Social Emotional Learning)",
  "Special Education",
  "STEM",
  "Summer Programs",
  "Child Welfare Services",
  "Computer or Internet Access",
  "Disability Support",
  "Legal Services",
  "Family Resource Centers",
  "Family Shelters",
  "Financial Assistance",
  "Food",
  "Adoption & Foster Care",
  "Housing & Rental Assistance",
  "Immigration Assistance",
  "Justice Involvement",
  "LGBTQ+ Support",
  "Parent Education",
  "Support Groups",
  "Teen Parents",
  "Addiction & Recovery",
  "Crisis Intervention",
  "Dental Care",
  "Disability Support",
  "Health Education",
  "Justice Involvement",
  "LGBTQ+ Support",
  "Medical Care",
  "Mental Health",
  "Vision Care",
  "Disability Support",
  "Gardening",
  "Justice Involvement",
  "LGBTQ+ Support",
  "Outdoors",
  "Summer Programs",
  "Physical Fitness",
  "Team Sports",
  "Apprenticeship",
  "Career Exploration",
  "Disability Support",
  "Job Assistance",
  "Justice Involvement",
  "LGBTQ+ Support",
  "Mentorship",
  "Skills & Training",
  "Summer Programs",
  "Vocational Training",
  "Youth Jobs & Internships",
  "Youth Leadership",
];

export const our415SubcategoryNames = new Set(OUR415_SUBCATS_WITH_DUPLICATES);

/* ELIGIBILITIES */

export const our415EligibilitiesMapping = {
  "African American": ["African American"],
  Asian: ["Asian"],
  Latinx: ["Hispanic/Latinx", "Latinx"],
  "Pacific Islander": ["API (Asian/Pacific Islander)", "Pacific Islander"],
  "Middle Eastern and North African": ["Middle Eastern and North African"],
  "Native American": ["Native American"],
  "Filipino/a": ["Filipino", "Filipino/a"],
  Preschool: ["Preschool Student", "Preschool"],
  "Elementary School": ["Elementary School Student", "Elementary School"],
  "Middle School Students": ["Middle School", "Middle School Students"],
  "High School Students": ["High School", "High School Students"],
  "College Students": ["College", "College Students"],
  "City College of SF": ["City College of SF"],
  "Low-Income": ["Low-Income"],
  Underinsured: ["Underinsured"],
  Uninsured: ["Uninsured"],
  "Benefit Recipients": ["Benefit Recipients"],
  "Foster Youth": ["Foster Youth"],
  "I am Experiencing Homelessness": [
    "Experiencing Homelessness",
    "I am Experiencing Homelessness",
  ],
  Undocumented: ["Undocumented"],
  "CIP (Children of Incarcerated Parents)": [
    "CIP (Children of Incarcerated Parents)",
  ],
  "Trauma Survivors": ["Trauma Survivors"],
  "Teen Parents": ["Teen Parent", "Teen Parents"],
  "Non-Binary": ["Non-Binary"],
  "Transgender and Gender Non-Conforming": [
    "Transgender and Gender Non-Conforming",
  ],
  Boys: ["Boys"],
  Men: ["Men"],
  Girls: ["Girls"],
  Women: ["Women"],
  "LGBTQ+": ["LGBTQ+"],
  Youth: ["Youth (below 21 years old)", "Youth"],
  Teens: ["Teens (13-18 years old)", "Teens"],
  Toddler: ["Toddler Age", "Toddler"],
  "Families with children below 18 years old": [
    "Families with children below 18 years old",
  ],
  "Pre-Teen": ["Preteen", "Pre-Teen"],
  Infants: ["Infants (0-2 years old)", "Infants"],
  "All Ages": ["All Ages"],
  TAY: ["Transitional Aged Youth (TAY)", "TAY"],
  Children: ["Children (0-13 years old)", "Children"],
  "Special Needs/Disabilities": ["Special Needs/Disabilities"],
  "Mental and Behavioral Health Challenges": [
    "Mental and Behavioral Health Challenges",
  ],
  "Deaf or Hard of Hearing": ["Deaf or Hard of Hearing"],
  "Visual Impairment": ["Visual Impairment"],
  "Limited Mobility": ["Limited Mobility"],
  Spanish: ["Spanish"],
  Chinese: ["Chinese"],
  "ESL/ELL (English Language Learner)": ["ESL/ELL (English Language Learner)"],
};

export const mapSFSGApiEligibilitiesToOur415ByConfig = (
  SFSGApiEligibilities: RefinementListItem[],
  our415mapping: Record<string, string[]>
): RefinementListItem[] => {
  const seen = new Set();
  return SFSGApiEligibilities.filter(
    // only return eligibilities that exist in mapping
    (item) =>
      Object.values(our415mapping).some((apiEligibilities) =>
        apiEligibilities.includes(item.label)
      )
  )
    .map(
      // item label becomes mapping key's name
      (item) => ({
        ...item,
        label:
          Object.entries(our415mapping).find(([, values]) =>
            values.includes(item.label)
          )?.[0] ?? item.label,
      })
    )
    .filter(
      // remove duplicates by item label
      (item) => {
        if (seen.has(item.label)) {
          return false;
        } else {
          seen.add(item.label);
          return true;
        }
      }
    );
};
