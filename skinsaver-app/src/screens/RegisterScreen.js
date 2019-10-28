import React, {useContext} from 'react';
import { NavigationEvents } from 'react-navigation';
import AuthForm from '../components/AuthForm';
import {Context as AuthContext} from '../context/AuthContext';
import NavLink from '../components/NavLink';

const RegisterScreen = () => {
    const { state, register, clearErrorMessage } = useContext(AuthContext);

    return (
        <>
            <NavigationEvents onWillBlur={clearErrorMessage} />
            <AuthForm
                title='Register a New Account'
                errorMessage={state.errorMessage}
                onSubmit={register}
                submitButtonText='Register'
            />
            <NavLink
                text='Already have an account? Login instead'
                routeName='LoginScreen'
            />
        </>
    );
};



export default RegisterScreen;

