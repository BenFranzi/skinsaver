import { AsyncStorage } from 'react-native';
import createDataContext from '../helpers/createDataContext';
import { navigate } from '../helpers/navigationRef';
import api from '../helpers/api';
import * as SecureStore from 'expo-secure-store';

const AuthActions = {
    LOGIN: 'LOGIN',
    ADD_ERROR: 'ADD_ERROR',
    CLEAR_ERROR: 'CLEAR_ERROR',
    LOGOUT: 'LOGOUT'
};

const authReducer = (state, action) => {
    switch (action.type) {
        case AuthActions.ADD_ERROR:
            return { ...state, errorMessage: action.payload };
        case AuthActions.LOGIN:
            return { errorMessage: '', token: action.payload };
        case AuthActions.CLEAR_ERROR:
            return { ...state, errorMessage: '' };
        case AuthActions.LOGOUT:
            return { token: null, errorMessage: '' };
        default:
            return state;
    }
};

const tryResumeSession = dispatch => async () => {

    try {
        const response = await api.post('/auth/extend');
        // const token = await SecureStore.getItemAsync('token'); //TODO: implement refresh token
        if (!!response.data.token) {
            await SecureStore.setItemAsync('token', response.data.token);
            dispatch({ type: AuthActions.LOGIN, payload: response.data.token });
            navigate('CaseFlow');
        } else {
            navigate('AuthFlow');
        }
    }
    catch (e) {
        navigate('AuthFlow');
    }
};

const clearErrorMessage = dispatch => () => {
    dispatch({ type: AuthActions.CLEAR_ERROR });
};

const register = dispatch => async ({ email, password }) => {
    try {
        const response = await api.put('/auth/register', { email, password });
        await SecureStore.setItemAsync('token', response.data.token);
        dispatch({ type: AuthActions.LOGIN, payload: response.data.token });
        navigate('CaseFlow');
    } catch (err) {
        dispatch({
            type: AuthActions.ADD_ERROR,
            payload: 'Something went wrong with register'
        });
    }
};

const login = dispatch => async ({ email, password }) => {
    try {
        const response = await api.post('/auth/login', { email, password });
        await SecureStore.setItemAsync('token', response.data.token);
        dispatch({ type: AuthActions.LOGIN, payload: response.data.token });
        navigate('CaseFlow');
    } catch (err) {
        dispatch({
            type: AuthActions.ADD_ERROR,
            payload: `Something went wrong with login ${err.message}`
        });
    }
};

const logout = dispatch => async () => {
    await SecureStore.deleteItemAsync('token');
    dispatch({ type: AuthActions.LOGOUT });
    navigate('AuthFlow');
};

// TODO: FORGOT PASSWORD

export const { Provider, Context } = createDataContext(
    authReducer,
    { login, logout, register, clearErrorMessage, tryResumeSession },
    { token: null, errorMessage: '' }
);
