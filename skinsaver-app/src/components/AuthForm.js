import React, {useState} from 'react';
import {Input, Text} from 'react-native-elements';
import Spacer from './Spacer';
import ErrorBox from './ErrorBox';
import * as PropTypes from 'prop-types';
import {Button, StyleSheet, TouchableOpacity} from 'react-native';

const AuthForm = ({title, errorMessage, onSubmit, submitButtonText}) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    return (
        <>
            <Spacer/>
            <Text h3 style={styles.header}>{title}</Text>
            <Spacer/>
            <Input
                style={styles.input}
                label='Email'
                value={email}
                onChangeText={setEmail}
                autoCapitalize='none'
                autoCorrect={false}
            />
            <Spacer/>
            <Input
                style={styles.input}
                secureTextEntry
                label='Password'
                value={password}
                onChangeText={setPassword}
                autoCapitalize='none'
                autoCorrect={false}

            />
            <ErrorBox msg={errorMessage}/>
            <Spacer/>
            <TouchableOpacity onPress={() => onSubmit({email, password})}>
                <Text style={styles.button}>
                    {submitButtonText}
                </Text>
            </TouchableOpacity>
        </>
    );
};

AuthForm.propTypes = {
    title: PropTypes.string.isRequired,
    errorMessage: PropTypes.string,
    onSubmit: PropTypes.func.isRequired,
    submitButtonText: PropTypes.string.isRequired
};

const styles = StyleSheet.create({
    header: {
        padding: 8,
    },
    button: {
        margin: 8,
        textAlign: 'center',
        padding: 8,
        color: 'white',
        fontWeight: 'bold',
        backgroundColor: '#5AC8FA',
        borderRadius: 8,
        overflow: 'hidden'
    }
});

export default AuthForm;