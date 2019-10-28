import {StyleSheet, View} from 'react-native';
import React from 'react';

export default () => {
    return (
        <View style={styles.line}/>
    )
}

const styles = StyleSheet.create({
    line: {
        backgroundColor: '#E5E5EA',
        height: 1,
    }
});