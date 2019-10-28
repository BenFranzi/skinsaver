import createDataContext from '../helpers/createDataContext';
import api from '../helpers/api';
import useCamera from '../hooks/useCamera';
import {navigate} from '../helpers/navigationRef';

const CasesActions = {
    GET_CAPTURE: 'GET_CAPTURE',
    CLEAR_CAPTURE: 'CLEAR_CAPTURE',
    ADD_ERROR: 'ADD_ERROR',
    CLEAR_ERROR: 'CLEAR_ERROR',
    FINISHED_LOADING: 'FINISHED_LOADING',
    IS_LOADING: 'IS_LOADING',
};

const captureReducer = (state, action) => {
    switch (action.type) {
        case CasesActions.GET_CAPTURE:
            return {...state, capture: action.payload};
        case CasesActions.CLEAR_CAPTURE:
            return {...state, capture: null};
        case CasesActions.IS_LOADING:
            return {...state, loading: true};
        case CasesActions.FINISHED_LOADING:
            return {...state, loading: false};
        case CasesActions.ADD_ERROR:
            return {...state, errorMessage: action.payload};
        case CasesActions.CLEAR_ERROR:
            return {...state, errorMessage: null};
        default:
            return state;
    }
};

const clearErrorMessage = dispatch => () => {
    dispatch({type: CasesActions.CLEAR_ERROR })
};

const getCapture = dispatch => async ({id}) => {
    dispatch({type: CasesActions.CLEAR_ERROR });
    dispatch({ type: CasesActions.IS_LOADING });
    try {
        const response = await api.get(`/captures/${id}`);
        dispatch({ type: CasesActions.GET_CAPTURE, payload: response.data.capture });
        console.log(response.data.capture);
    } catch (e) {
        console.debug(e);
        dispatch({ type: CasesActions.ADD_ERROR, payload: `failed to get case ${id}: ${e.message}`});
    }
    dispatch({ type: CasesActions.FINISHED_LOADING });
};

const clearCapture = dispatch => async () => {
    dispatch({type: CasesActions.CLEAR_CAPTURE});
};

export const { Provider, Context } = createDataContext(
    captureReducer,
    { getCapture, clearCapture, clearErrorMessage },
    {capture: null, loading: true, errorMessage: null}
);
