import React, {useContext, useState} from 'react';
import {
    Alert,
    FlatList,
    StyleSheet,
    TouchableOpacity,
    View,
    Clipboard,
    Linking,
    Text,
    ActivityIndicator, ScrollView
} from 'react-native';
import CaptureCell from '../components/CaptureCell';
import {Context as CasesContext} from '../context/CasesContext';
import {NavigationEvents} from 'react-navigation';
import ErrorBox from '../components/ErrorBox';
import FullScreenSpinner from '../components/FullScreenSpinner';
import {AntDesign} from '@expo/vector-icons';
import useCamera from '../hooks/useCamera';
import useTF from '../hooks/useTF';
import {LocalTime} from '../helpers/utils';
import Spacer from '../components/Spacer';
import {Button, Image} from 'react-native-elements';
import Line from '../components/Line';

const CaseScreen = ({navigation}) => {
    const id = navigation.getParam('id');
    const {state, getCase, addToCase, generateShareLink} = useContext(CasesContext);
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
                console.log(predictions);
                addToCase({caseId: id, image, predictions});
            }
        });
    };

    const linker = () => {
        generateShareLink({id}, (link) => {
            console.log('THIS', link);
            if (!state.errorMessage) {
                Alert.alert(
                    'Link Generated',
                    `${link}`,
                    [
                        {text: 'Open in browser', onPress: () => Linking.openURL(link)},
                        {text: 'Copy to clipboard', onPress: () => Clipboard.setString(link)}
                    ]
                )
            }
        });
    };

    return (
        <>
            <NavigationEvents onWillFocus={() => getCase({id})}/>

            {!state.case || predicting || state.loading ? (
                <FullScreenSpinner msg={predicting ? 'Classifying image, this may take some time.' : null}/>) : (<ScrollView>
                <View>
                    <Spacer/>
                    <Text style={styles.header}>Last identified</Text>
                    <Text style={styles.main}>{state.case.captures[0].prediction.split(',')[0]}</Text>
                    <Text style={styles.header}>{state.case.title}</Text>
                    <Spacer/>
                    <TouchableOpacity onPress={() => navigation.navigate('CaptureScreen', {id: state.case.captures[0].id})}>
                        <View style={styles.bar}/>
                        <View style={styles.view}>
                            <Image
                                style={styles.image}
                                source={{ uri: state.case.captures[0].url }}
                                PlaceholderContent={<ActivityIndicator />}
                            />
                            <Text style={{textAlign: 'center'}}>
                               {Math.floor(state.case.captures[0].certainty * 10000)/ 100}%
                            </Text>
                            <Text style={{textAlign: 'center'}}>
                                {LocalTime(state.case.captures[0].createdDate)}
                            </Text>
                            <Spacer/>
                        </View>
                    </TouchableOpacity>
                    <Line/>
                    <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', flex: 1, padding: 8}}>
                        <Button
                            style={{flex: 1}}
                            title={'Add new capture'}
                            onPress={capture}/>
                        <Button
                            style={{flex: 1}}
                            title={'Share case'}
                            onPress={linker}/>
                    </View>
                </View>
                <Line/>
                <Text style={styles.main}>Previous captures:</Text>
                <FlatList
                    data={state.case.captures}
                    keyExtractor={item => item.id}
                    renderItem={({item}) => {
                        if (item.id === state.case.captures[0].id) {
                            return null;
                        } else {
                            return (
                                <>
                                <CaptureCell
                                    prediction={item.prediction}
                                    certainty={item.certainty}
                                    createdDate={LocalTime(item.createdDate)}
                                    uri={item.url}
                                    onPress={() => navigation.navigate('CaptureScreen', {id: item.id})}
                                />
                                <Line/>
                                </>
                            );
                        }
                    }}
                />
            </ScrollView>)}
            {state.errorMessage && <ErrorBox msg={state.errorMessage}/>}
        </>
    );
};

const styles = StyleSheet.create({
    header: {
        paddingLeft: 8,
        textAlign: 'center',
        paddingRight: 8,
    },
    main: {
        paddingLeft: 8,
        paddingRight: 8,
        fontWeight: 'bold',
        textAlign: 'center',
        fontSize: 30
    },
    add: {
        padding: 8,
        borderWidth: 1,
        borderColor: 'green',
        borderRadius: 16,
        height: 34,
        width: 34,
    },
    image: {
        height: 256,
        marginBottom: 5
    },
});

export default CaseScreen;

