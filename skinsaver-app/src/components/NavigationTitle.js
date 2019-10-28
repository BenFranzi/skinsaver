import React from 'react';
import {Text} from 'react-native-elements';
import * as PropTypes from 'prop-types';
import {StyleSheet, View} from 'react-native';

// TODO: REMOVE -- ABANDONED
const NavigationTitle = ({title = 'SkinSaver', subtitle}) => {
    return (
        <View style={styles.view}>
            <Text style={styles.title}>{title}</Text>
            {subtitle}
        </View>
    );
};

NavigationTitle.propTypes = {
    title: PropTypes.string,
    subtitle: PropTypes.any.isRequired,
};

const styles = StyleSheet.create({
    view: {
        paddingBottom: 8
    },
    title: {
        flex: 1,
        flexDirection: 'row',
        flexWrap: 'wrap'
    }
});


export default NavigationTitle;