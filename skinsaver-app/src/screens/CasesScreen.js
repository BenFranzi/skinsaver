import React, {useContext, useEffect, useState} from 'react';
import {Button, Dimensions, RefreshControl, View, Alert} from 'react-native';
import CaseCell, {getCaseCellWidth} from '../components/CaseCell';
import { NavigationEvents } from 'react-navigation';
import {FlatList, StyleSheet} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as Permissions from 'expo-permissions';
import {useActionSheet} from '@expo/react-native-action-sheet';
import ErrorBox from '../components/ErrorBox';
import {Context as CasesContext} from '../context/CasesContext';
import useCamera from '../hooks/useCamera';
import ActivityIndicator from 'react-native-web/dist/exports/ActivityIndicator';
import FullScreenSpinner from '../components/FullScreenSpinner';
import useTF from '../hooks/useTF';

const CasesScreen = ({navigation}) => {
    const {state, getMyCases, createCase } = useContext(CasesContext);
    const [picker, cameraError] = useCamera();
    const [classify] = useTF();
    const [predicting, setPredicting] = useState(false);

    const capture = async () => {
        await picker(async (image) => {
            setPredicting(true);
            if (!!image) {
                const predictions = await classify(image);
                // Alert.alert('Classify', JSON.stringify(predictions, null, 2));
                setPredicting(false);
                createCase({image, predictions});
            }
        });
    };

    return (
        <>
            <NavigationEvents onWillFocus={getMyCases} />


            {!state.cases || predicting ? (<FullScreenSpinner msg={predicting ? 'Classifying image, this may take some time.' : null}/>) : (
                <FlatList
                    style={styles.list}
                    data={state.cases}
                    numColumns={Math.floor(Dimensions.get('window').width / getCaseCellWidth)}
                    keyExtractor={item => item.id}
                    showsVerticalScrollIndicator={false}
                    refreshing={state.loading}
                    onRefresh={getMyCases}
                    renderItem={({item}) =>
                        <CaseCell
                            footer={item.footer}
                            title={item.title}
                            timestamp={item.createdDate}
                            uri={item.url}
                            onPress={() => (item.footer) ? capture() : navigation.navigate('CaseScreen', { id: item.id })}
                        />}
                />
            )}
            {state.errorMessage && <ErrorBox msg={state.errorMessage}/>}
        </>
    );
};

const styles = StyleSheet.create({
    list: {
        paddingTop: 4,
        flex: 1,
        alignSelf: 'center'
    }
});

export default CasesScreen;

