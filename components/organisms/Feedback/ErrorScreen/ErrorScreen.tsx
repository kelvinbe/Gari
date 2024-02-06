import { makeStyles } from '@rneui/themed';
import React from 'react';
import { View } from 'react-native';
import { Text } from '@rneui/base';
import Logo from '../../../atoms/Brand/Logo';

interface IProps {
  errorTitle?: string;
  errorDescription?: string;
  errorSolution?: string;
}

const useStyles = makeStyles((theme, props: IProps) => ({
  container: {
    width: '100%',
    height: '100%',
    backgroundColor: theme.colors.white,
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingTop: 30,
  },
  contentContainer: {
    width: '90%',
    minHeight: '20%',
  },

  headerTitle: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 5,
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '700',
    flexWrap: 'wrap',
    paddingVertical: 5,
  },
}));

function ErrorScreen(props: IProps) {
  const styles = useStyles(props);

  return (
    <View style={styles.container}>
      <View style={{ marginBottom: 50 }}>
        <Logo />
      </View>

      <View style={{ width: '80%' }}>
        <Text style={styles.headerTitle}>
          {props.errorTitle
            ? `An error occurred when ${props.errorTitle}`
            : 'An error has occurred'}
        </Text>
      </View>
      <View style={styles.contentContainer}>
        {props.errorDescription && <Text style={styles.headerTitle}>Error description:</Text>}
        <Text style={{ textAlign: 'center' }}>
          {props.errorDescription ? props.errorDescription : 'Please try the process again later'}
        </Text>
      </View>
      {props.errorSolution && (
        <View style={styles.contentContainer}>
          <Text style={styles.headerTitle}>Solution:</Text>
          <Text style={{ textAlign: 'center' }}>{props.errorSolution}</Text>
        </View>
      )}
    </View>
  );
}

export default ErrorScreen;
