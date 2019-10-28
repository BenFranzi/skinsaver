import React from 'react';
import {StyleSheet, ActivityIndicator, Text, View} from 'react-native';

const FullScreenSpinner = ({msg}) => {
    return (
        <View  style={styles.spinner}>
            <ActivityIndicator color={'black'} size={'large'}/>
            {!!msg && <Text>{msg}</Text>}
        </View>
    );
};

const styles = StyleSheet.create({
    spinner: {
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'grey',
        opacity: .5
    }
});

export default FullScreenSpinner;
