import React from 'react';
import {Button, TouchableOpacity, View} from 'react-native';
import { createAppContainer, createSwitchNavigator } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import {Ionicons} from '@expo/vector-icons';
import { ActionSheetProvider } from '@expo/react-native-action-sheet'
import {navigate, setNavigator} from './src/helpers/navigationRef';
import LoginScreen from './src/screens/LoginScreen';
import CasesScreen from './src/screens/CasesScreen';
import CaseScreen from './src/screens/CaseScreen';
import CaptureScreen from './src/screens/CaptureScreen';
import RegisterScreen from './src/screens/RegisterScreen';
import { Provider as AuthProvider } from './src/context/AuthContext';
import { Provider as CasesProvider } from './src/context/CasesContext';
import { Provider as CaptureProvider } from './src/context/CaptureContext';
import SettingsScreen from './src/screens/SettingsScreen';
import AuthResolver from './src/helpers/AuthResolver';


const baseNavigationOptions = {
    title: 'SkinSaver',
    headerStyle: {
        backgroundColor: '#f4511e',
    },
    headerBackTitle: ' ',
    headerTintColor: '#fff',
};

const navigationOptions = ({navigation}) => {
    return {
        ...baseNavigationOptions,
        headerRight: (
            <TouchableOpacity onPress={() => navigation.navigate('SettingsFlow')}>
                <Ionicons style={{paddingRight: 8}} name='ios-settings' size={32} color='white'/>
            </TouchableOpacity>
        )
    };
};

const settingsOptions = ({navigation}) => {
    return {
        ...baseNavigationOptions,
        headerLeft: (
            <TouchableOpacity onPress={() => navigation.navigate('CaseFlow')}>
                <Ionicons name='ios-settings' size={32} color='white' style={{margin: 8}}/>
            </TouchableOpacity>
        )
    };
};

const SettingsFlow = createStackNavigator({
    SettingsScreen: SettingsScreen,
}, {
    defaultNavigationOptions: settingsOptions,
});

const AuthFlow = createStackNavigator({
    LoginScreen: LoginScreen,
    RegisterScreen: RegisterScreen,
}, {
    defaultNavigationOptions: baseNavigationOptions,
});

const CaseFlow = createStackNavigator({
    CasesScreen: CasesScreen,
    CaseScreen: CaseScreen,
    CaptureScreen: CaptureScreen,
},{
    defaultNavigationOptions: navigationOptions,
});

const App = createAppContainer(
    createSwitchNavigator({
    AuthResolver: AuthResolver,
    AuthFlow: AuthFlow,
    CaseFlow: CaseFlow,
    SettingsFlow: SettingsFlow,
}));

const AppWrapper = ({children}) => {
    return (
        <AuthProvider>
            <CasesProvider>
                <CaptureProvider>
                    <ActionSheetProvider>
                        {children}
                    </ActionSheetProvider>
                </CaptureProvider>
            </CasesProvider>
        </AuthProvider>
    );
}

export default () => {
    return (
        <AppWrapper>
            <App ref={(navigator) => {
                setNavigator(navigator);
            }}/>
        </AppWrapper>
    );
};