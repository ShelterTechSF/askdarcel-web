export interface StrapiResponse<T> {
  data: {
    id: number;
    attributes: T;
    meta: {
      [key: string]: string;
    };
  } | null;
}

export interface Link {
  id: number;
  url: string;
  text: string;
}

export interface DynamicLink {
  id: number;
  // __component is a key used by Strapi
  // that may not have practical purposes for the frontend
  __component: string;
  title: string;
  link: Link[];
}

export interface Footer {
  address: string;
  email_address: string;
  phone_number: string;
  links: DynamicLink[];
}
