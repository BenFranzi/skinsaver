import React, { useEffect, useContext } from 'react';
import { Context as AuthContext } from '../context/AuthContext';

const AuthResolver = () => {
    const { tryResumeSession } = useContext(AuthContext);

    useEffect(() => {
        tryResumeSession();
    }, []);

    return null;
};

export default AuthResolver;
