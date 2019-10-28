import createDataContext from '../helpers/createDataContext';
import api, {SPA_URL} from '../helpers/api';
import useCamera from '../hooks/useCamera';
import {navigate} from '../helpers/navigationRef';

const CasesActions = {
    GET_MY_CASES: 'GET_MY_CASES',
    GET_SINGLE_CASE: 'GET_SINGLE_CASE',
    CASE_LINK_SET: 'CASE_LINK_SET',
    CLEAR_CASE: 'CLEAR_CASE',
    ADD_ERROR: 'ADD_ERROR',
    CLEAR_ERROR: 'CLEAR_ERROR',
    FINISHED_LOADING: 'FINISHED_LOADING',
    IS_LOADING: 'IS_LOADING',
};

const casesReducer = (state, action) => {
    switch (action.type) {
        case CasesActions.GET_MY_CASES:
            return {...state, cases: action.payload};
        case CasesActions.GET_SINGLE_CASE:
            return {...state, case: action.payload};
        case CasesActions.CASE_LINK_SET:
            return {...state, link: action.payload};
        case CasesActions.CLEAR_CASE:
            return {...state, case: null};
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

const getMyCases = dispatch => async () => {
    dispatch({type: CasesActions.CLEAR_ERROR });
    dispatch({ type: CasesActions.IS_LOADING });
    try {
        const response = await api.get('/cases/me');
        dispatch({ type: CasesActions.GET_MY_CASES, payload: [...response.data.cases,  {id: 'footer', footer: true}] });
    } catch (e) {
        console.debug('failed to get cases.', e.message);
        dispatch({ type: CasesActions.ADD_ERROR, payload: `failed to get cases: ${e.message}`});

        console.debug('failed to get cases.', );
    }
    dispatch({ type: CasesActions.FINISHED_LOADING });
};

const createCase = dispatch => async ({image, predictions}) => {
    dispatch({type: CasesActions.CLEAR_ERROR });
    dispatch({ type: CasesActions.IS_LOADING });
    try {
        const photo = {
            uri: image.uri,
            type: 'image/png',
            name: 'capture.jpg',
        };
        let body = new FormData();
        body.append('file', photo);
        body.append('predictions', JSON.stringify(predictions));

        const response = await api.post('/cases/new', body);
        navigate('CaseScreen', { id: response.data.case.id });
    } catch (e) {
        console.debug(e);
        dispatch({ type: CasesActions.ADD_ERROR, payload: `failed to create case: ${e.message}`});
    }
    dispatch({ type: CasesActions.FINISHED_LOADING });
};


const addToCase = dispatch => async ({caseId, image, predictions}) => {
    dispatch({type: CasesActions.CLEAR_ERROR });
    dispatch({ type: CasesActions.IS_LOADING });
    try {
        const photo = {
            uri: image.uri,
            type: 'image/png',
            name: 'capture.jpg',
        };
        let body = new FormData();
        body.append('file', photo);
        body.append('predictions', JSON.stringify(predictions));

        const response = await api.post(`/cases/add/${caseId}`, body);
        navigate('CaptureScreen', { id: response.data.capture.id });
    } catch (e) {
        dispatch({ type: CasesActions.ADD_ERROR, payload: `failed to add to case: ${e.message}`});
    }
    dispatch({ type: CasesActions.FINISHED_LOADING });
};


const getCase = dispatch => async ({id}) => {
    dispatch({type: CasesActions.CLEAR_ERROR });
    dispatch({ type: CasesActions.IS_LOADING });
    try {
        const response = await api.get(`/cases/${id}`);
        dispatch({ type: CasesActions.GET_SINGLE_CASE, payload: response.data.case });
    } catch (e) {
        console.debug(e);
        dispatch({ type: CasesActions.ADD_ERROR, payload: `failed to get case ${id}: ${e.message}`});
    }
    dispatch({ type: CasesActions.FINISHED_LOADING });
};

const clearCase = dispatch => async () => {
  dispatch({type: CasesActions.CLEAR_CASE});
};

const generateShareLink = dispatch => async ({id}, cb) => {
    dispatch({type: CasesActions.CLEAR_ERROR });
    dispatch({ type: CasesActions.IS_LOADING });
    try {
        const response = await api.post(`/linker/generate/${id}`);
        console.log(JSON.stringify(response, null, 2));
        if (response.data) {
            const link = `${SPA_URL}/${response.data.linker.uri}`;
            dispatch({ type: CasesActions.CASE_LINK_SET, payload: link });
            cb(link);
        }
    } catch (e) {
        console.debug(JSON.stringify(e, null, 2));
        dispatch({ type: CasesActions.ADD_ERROR, payload: `failed to generate link ${id}: ${e.message}`});
    }
    dispatch({ type: CasesActions.FINISHED_LOADING });
};

export const { Provider, Context } = createDataContext(
    casesReducer,
    { getMyCases, getCase, clearCase, createCase, addToCase, clearErrorMessage, generateShareLink },
    {cases: [], case: null, loading: true, errorMessage: null, link: null}
);
