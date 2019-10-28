import React from 'react';
import {Image, Text} from 'react-native-elements';
import * as PropTypes from 'prop-types';
import {ActivityIndicator, StyleSheet, TouchableOpacity, View} from 'react-native';
import {LocalTime} from '../helpers/utils';

const CaptureCell = ({prediction, uri, certainty, createdDate, onPress}) => {
    return (
        <>
            <TouchableOpacity onPress={onPress}>
                <View style={styles.bar}/>
                <View style={styles.view}>
                    <Image
                        style={styles.image}
                        source={{ uri: uri }}
                        PlaceholderContent={<ActivityIndicator />}
                    />
                    <Text style={styles.prediction}>{prediction}</Text>
                    <Text>
                        {Math.floor(certainty * 10000)/ 100}%
                    </Text>
                    <Text>
                        {createdDate}
                    </Text>
                </View>
            </TouchableOpacity>
        </>
    );
};

CaptureCell.propTypes = {
    prediction: PropTypes.string.isRequired,
    uri: PropTypes.string.isRequired, // TODO: is valid url?
    certainty: PropTypes.string.isRequired, // TODO: is float?
    createdDate: PropTypes.string.isRequired, // TODO: is date?
    onPress: PropTypes.any.isRequired, // TODO: is date?
};

const styles = StyleSheet.create({
    view: {
        margin: 8
    },
    image: {
        height: 192,
        marginBottom: 5
    },
    prediction: {
        fontWeight: 'bold'
    },
    bar: {
        backgroundColor: '#E5E5EA',
        height: 1
    }
});

export default CaptureCell;