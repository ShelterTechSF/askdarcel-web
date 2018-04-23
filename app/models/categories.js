import ds from 'utils/DataService';

export const CATEGORIES_LOAD = 'CATEGORIES_LOAD';
export const CATEGORIES_LOAD_SUCCESS = 'CATEGORIES_LOAD_SUCCESS';
export const CATEGORIES_LOAD_FAIL = 'CATEGORIES_LOAD_FAIL';

const initialState = {
  categoryList: null,
};

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case CATEGORIES_LOAD_SUCCESS: return { ...state, categoryList: action.categories };
    default: return state;
  }
}

// Get the list of categories, by default only top level
export function fetchCategories(top = true) {
  return async (dispatch) => {
    dispatch({ type: CATEGORIES_LOAD });
    try {
      const { categories } = await ds.get(`/api/categories${top ? '?top_level=true' : ''}`);
      dispatch({ type: CATEGORIES_LOAD_SUCCESS, categories });
    } catch (err) {
      dispatch({ type: CATEGORIES_LOAD_FAIL, err });
    }
  };
}
