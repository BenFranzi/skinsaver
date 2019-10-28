import React, {useContext, useState} from 'react';
import { NavigationEvents } from 'react-navigation';
import AuthForm from '../components/AuthForm';
import {Context as AuthContext} from '../context/AuthContext';
import NavLink from '../components/NavLink';

const LoginScreen = () => {
    const { state, login, clearErrorMessage } = useContext(AuthContext);

    const x = (e, p) => {
        console.log('L', e, p)
        login(e, p)
    }

    return (
        <>
            <NavigationEvents onWillBlur={clearErrorMessage} />
            <AuthForm
                title='Sign In to Your Account'
                errorMessage={state.errorMessage}
                onSubmit={login}
                submitButtonText='Login'
            />
            <NavLink
                text='Dont have an account? Register instead'
                routeName='RegisterScreen'
            />
        </>
    );
};



export default LoginScreen;

