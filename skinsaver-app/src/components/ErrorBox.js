import {Text} from 'react-native-elements';
import React from 'react';
import {StyleSheet} from 'react-native';
import * as PropTypes from 'prop-types';

const ErrorBox = ({msg = null}) => {
  return (<>
    {msg ? (
        <Text style={styles.errorMessage}>{msg}</Text>
    ) : null}
  </>)
};

ErrorBox.propTypes = {
  msg: PropTypes.string,
};

const styles = StyleSheet.create({
  errorMessage: {
    borderColor: 'red',
    borderWidth: 1,
    borderRadius: 8,
    padding: 8,
    overflow: 'hidden',
    margin: 8,
    backgroundColor: '#ffcccb',
    fontSize: 16,
    color: 'red',
  }
});

export default ErrorBox;
