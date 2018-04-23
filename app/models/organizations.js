import ds from 'utils/DataService';

const ORGANIZATION_LOAD = 'ORGANIZATION_LOAD';
const ORGANIZATION_LOAD_SUCCESS = 'ORGANIZATION_LOAD_SUCCESS';
const ORGANIZATION_LOAD_FAIL = 'ORGANIZATION_LOAD_FAIL';
const ORGANIZATION_SUBMIT_CHANGE = 'ORGANIZATION_VERIFY';
const ORGANIZATION_SUBMIT_CHANGE_SUCCESS = 'ORGANIZATION_VERIFY_SUCCESS';
const ORGANIZATION_SUBMIT_CHANGE_FAIL = 'ORGANIZATION_VERIFY_FAIL';

const initialState = {
  organizationList: [],
  activeOrganization: null,
};

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case ORGANIZATION_LOAD_SUCCESS: return { ...state, activeOrganization: action.organization };
    default: return state;
  }
}

// Get an organization by ID
export function fetchOrganization(id) {
  return async (dispatch) => {
    try {
      dispatch({ type: ORGANIZATION_LOAD });
      const { resource: organization } = await ds.get(`/api/resources/${id}`);
      console.log(organization);
      dispatch({ type: ORGANIZATION_LOAD_SUCCESS, organization });
    } catch (err) {
      dispatch({ type: ORGANIZATION_LOAD_FAIL, err });
    }
  };
}

export function createOrganizationChangeRequest(id, change_request) {
  return async (dispatch) => {
    console.log('verifying');
    try {
      dispatch({ type: ORGANIZATION_SUBMIT_CHANGE });
      const cr = await ds.post(`/api/resources/${id}/change_requests`, { change_request });
      console.log(cr);
      dispatch({ type: ORGANIZATION_SUBMIT_CHANGE_SUCCESS });
    } catch (err) {
      dispatch({ type: ORGANIZATION_SUBMIT_CHANGE_FAIL });
    }
  };
}
