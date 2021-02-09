const fake_data = {
  get: () => data,
  post: (category) => `post category ${category}`,
  update: (id, category) => `update category with id ${id} data is ${category}`,
  del: (id) => `delete category with id ${id}`,
};

export default fake_data;

let data = [
  {
    id: 0,
    name: 'Covid',
    top_level: true,
    featured: false,
    subCategories: [
      { name: 'Covid-food', id: 1000001, top_level: false, featured: false },
      { name: 'Covid-health', id: 1000005, top_level: false, featured: false },
      { name: 'Covid-housing', id: 1000004, top_level: false, featured: false },
      { name: 'Covid-hygiene', id: 1000002, top_level: false, featured: false },
      {
        name: 'Covid-internet',
        id: 1000007,
        top_level: false,
        featured: false,
      },
      { name: 'Covid-lgbtqa', id: 1000008, top_level: false, featured: false },
      { name: 'Covid-shelter', id: 1000010, top_level: false, featured: false },
      { name: 'Covid Shelter', id: 197, top_level: true, featured: false },
    ],
  },

  {
    id: 1,
    name: 'Food',
    top_level: true,
    featured: false,
    subCategories: [
      { name: 'Food Benefits', id: 9, top_level: false, featured: false },
      { name: 'Food Delivery', id: 6, top_level: false, featured: false },
      { name: 'Food Pantry', id: 7, top_level: false, featured: false },
      { name: 'Free Meals', id: 8, top_level: false, featured: false },
    ],
  },

  {
    id: 2,
    name: 'Pay',
    top_level: true,
    featured: false,
    subCategories: [
      {
        name: 'Help Pay for Childcare',
        id: 101,
        top_level: false,
        featured: false,
      },
      { name: 'Help Pay for Food', id: 10, top_level: false, featured: false },
      {
        name: 'Help Pay for Healthcare',
        id: 49,
        top_level: false,
        featured: false,
      },
      {
        name: 'Help Pay for Housing',
        id: 14,
        top_level: false,
        featured: false,
      },
      {
        name: 'Help Pay For Housing',
        id: 13,
        top_level: false,
        featured: false,
      },
      {
        name: 'Help Pay for Internet or Phone',
        id: 16,
        top_level: false,
        featured: false,
      },
      {
        name: 'Help Pay for School',
        id: 124,
        top_level: false,
        featured: false,
      },
      {
        name: 'Help Pay for Transit',
        id: 36,
        top_level: false,
        featured: false,
      },
      {
        name: 'Help Pay for Utilities',
        id: 15,
        top_level: false,
        featured: false,
      },
      {
        name: 'Help Pay for Work Expenses',
        id: 148,
        top_level: false,
        featured: false,
      },
    ],
  },
  {
    id: 3,
    name: 'Empty',
    top_level: true,
    featured: false,
  },
];
