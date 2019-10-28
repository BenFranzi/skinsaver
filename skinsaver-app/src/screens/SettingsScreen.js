import React, {useContext} from 'react'
import {Button, Image, Text} from 'react-native-elements';
import {ActivityIndicator, StyleSheet} from 'react-native';
import {Context as AuthContext} from '../context/AuthContext';


const SettingsScreen = ({navigation}) => {
    const { logout } = useContext(AuthContext);

    return (
        <>
            <Text>Settings Screen</Text>
            <Button onPress={logout} title={'Logout'}/>
        </>
    );
};

const styles = StyleSheet.create({

});

export default SettingsScreen;