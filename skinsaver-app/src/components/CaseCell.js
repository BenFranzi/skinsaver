import React from 'react';
import {StyleSheet, TouchableOpacity} from 'react-native';
import * as PropTypes from 'prop-types';
import { ActivityIndicator, View } from 'react-native';
import { Text } from 'react-native-elements';
import { Image } from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import {LocalTime} from '../helpers/utils';


// TODO: implement useCache and thumbnail generation in the backend

export const getCaseCellWidth = 160;

const CaseCell = ({title, timestamp, uri, footer, onPress}) => {
    return (
        <>
        {footer ?
            <View style={styles.footerCell}>
                <TouchableOpacity onPress={onPress}>
                    <AntDesign name="plus" size={64} color='white'/>
                </TouchableOpacity>
            </View> : <View style={styles.caseCell}>
                <TouchableOpacity onPress={onPress}>
                    <Image
                        source={{ uri: uri }}
                        style={styles.image}
                        PlaceholderContent={<ActivityIndicator />}
                    />
                    <View style={styles.content}>
                        <Text style={styles.text}>{title}</Text>
                        <Text style={styles.text}>{LocalTime(timestamp)}</Text>
                    </View>
                </TouchableOpacity>
            </View>}
        </>
    )
};

CaseCell.propTypes = {
    title: PropTypes.string,
    timestamp: PropTypes.string, // TODO: date?
    uri: PropTypes.string, // TODO: check image exists?
    onPress: PropTypes.func,
    footer: PropTypes.bool,
};

export default CaseCell;

const styles = StyleSheet.create({
    caseCell: {
        width: 160,
        margin: 8,
        backgroundColor: '#64D2FF',
        overflow: 'hidden',
        borderRadius: 4
    },
    footerCell: {
        width: 160,
        minHeight: 192,
        margin: 8,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#64D2FF',
        overflow: 'hidden',
        borderRadius: 4
    },
    content: {
        padding: 8,

    },
    text: {
        color: 'white'
    },
    image: {
        width: 160,
        height: 160
    }
});