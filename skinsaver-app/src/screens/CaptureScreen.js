import React, {useContext} from 'react'
import {Image, Text} from 'react-native-elements';
import {ActivityIndicator, FlatList, StyleSheet, View} from 'react-native';
import ErrorBox from '../components/ErrorBox';
import {NavigationEvents} from "react-navigation";
import {Context as CaptureContext} from '../context/CaptureContext';
import FullScreenSpinner from '../components/FullScreenSpinner';
import {LocalTime} from '../helpers/utils';
import Spacer from '../components/Spacer';
import Line from '../components/Line';


const CaptureScreen = ({navigation}) => {
    const id = navigation.getParam('id');
    const { state, getCapture } = useContext(CaptureContext);

    return (
        <>
            <NavigationEvents onWillFocus={() => getCapture({id})} />

            {!state.capture ? (<FullScreenSpinner/>) :
            (
            <>
                <Image
                    style={styles.image}
                    source={{ uri: state.capture.url }}
                    PlaceholderContent={<ActivityIndicator />}
                />
                {/*<Text h3>{state.capture.prediction}</Text>*/}
                {/*<Text h5>{state.capture.certainty}</Text>*/}
                {/*<Text h5>{LocalTime(state.capture.createdDate)}</Text>*/}
                <Text style={styles.main}>{state.capture.prediction.split(',')[0]}</Text>
                <Text style={styles.other}>{Math.floor(state.capture.certainty * 10000)/ 100}%</Text>
                <Text style={styles.header}>{LocalTime(state.capture.createdDate)}</Text>
                <Spacer/>
                <Line/>
                <Text style={styles.other}>All possibilities</Text>
                <FlatList
                    data={state.capture.results}
                    renderItem={({item}) => <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', flex: 1, padding: 8}}>
                        <Text h5>{item.className}</Text>
                        <Text h5>{Math.floor(item.probability * 10000)/ 100}%</Text>
                    </View>}
                    keyExtractor={item => item.className + item.probability}
                />
            </>
            )}
            {state.errorMessage && <ErrorBox msg={state.errorMessage}/>}
        </>
    );
};

const styles = StyleSheet.create({
    image: {
        height: 256,
        marginBottom: 5
    },
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
    other: {
        paddingLeft: 8,
        paddingRight: 8,
        textAlign: 'center',
        fontSize: 24
    },
});

export default CaptureScreen;