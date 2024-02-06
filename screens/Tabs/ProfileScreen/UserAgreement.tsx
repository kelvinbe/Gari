import { StyleSheet, Text, View } from 'react-native';
import React, { useEffect } from 'react';
import { makeStyles } from '@rneui/themed';
import { Image } from '@rneui/base';
import { ScrollView } from 'react-native-gesture-handler';
import useFetchDivvlyInfo from '../../../hooks/useFetchDivvlyInfo';
import { FETCH_USER_AGREEMENT_ENDPOINT } from '../../../hooks/constants';

const useStyles = makeStyles((theme, props) => {
  return {
    container: {
      flex: 1,
      backgroundColor: theme.colors.white,
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    topSection: {
      width: '100%',
      alignItems: 'center',
      justifyContent: 'flex-start',
    },
    topContainer: {
      width: '100%',
      alignItems: 'center',
      justifyContent: 'center',
      marginVertical: 30,
    },
    titleText: {
      color: theme.colors.title,
      fontSize: 24,
      fontWeight: '700',
      fontFamily: 'Lato_700Bold',
    },
    subtitleText: {
      color: theme.colors.black,
      fontSize: 16,
      fontWeight: '400',
      fontFamily: 'Lato_400Regular',
    },
    normaltext: {
      color: theme.colors.black,
      fontSize: 14,
      fontWeight: '400',
      fontFamily: 'Lato_400Regular',
    },
    centerContainer: {
      width: '100%',
      alignItems: 'center',
      paddingHorizontal: 20,
      height: '60%',
    },
    bottomContainer: {
      width: '100%',
      alignItems: 'center',
      justifyContent: 'center',
    },
    policyContainer: {
      alignItems: 'center',
      justifyContent: 'flex-start',
      flexDirection: 'row',
      width: '100%',
      marginVertical: 10,
    },
    policyNumber: {
      alignItems: 'center',
      justifyContent: 'center',
      width: 50,
    },
    policyText: {
      justifyContent: 'center',
      width: '85%',
    },
    policiesContainer: {
      flex: 1,
    },
  };
});

const UserAgreement = () => {
  const styles = useStyles();
  const { data, fetchDivvlyInfo } = useFetchDivvlyInfo(FETCH_USER_AGREEMENT_ENDPOINT);

  useEffect(() => {
    fetchDivvlyInfo();
  }, []);
  return (
    <View style={styles.container}>
      <View style={styles.topSection}>
        <View style={styles.topContainer}>
          <Image
            source={require('../../../assets/images/logo.png')}
            style={{
              height: 50,
              width: 50,
            }}
            resizeMode="contain"
          />
          <View
            style={{
              width: '100%',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <Text style={[styles.titleText, { marginVertical: 10 }]}>User Agreement</Text>
            <Text style={styles.subtitleText}>Last Updated 30th may 2023</Text>
            <Text
              style={[
                styles.normaltext,
                {
                  textAlign: 'center',
                  marginTop: 10,
                  paddingHorizontal: 20,
                },
              ]}>
              Read Through
            </Text>
          </View>
        </View>
        <View style={styles.centerContainer}>
          <ScrollView style={styles.policiesContainer}>
            <Text style={[styles.normaltext, {}]}>
              This User Agreement ("Agreement") governs your use of the services and products
              provided by our company ("we," "us," or "our"). By accessing or using our services,
              you agree to be bound by the terms and conditions outlined in this Agreement. Please
              read this Agreement carefully before proceeding. 
              Acceptance of Terms 1.1. By accessing
              or using our services, you acknowledge that you have read, understood, and agree to be
              bound by this Agreement. 
              1.2. If you do not agree to any provisions of this Agreement,
              you must discontinue the use of our services immediately. User Obligations 2.1. You
              must be of legal age to use our services or have the consent of a parent or legal
              guardian. 
              2.2. You agree to provide accurate, complete, and up-to-date information
              during the registration process and while using our services. 
              2.3. You are responsible
              for maintaining the confidentiality of your account credentials and agree to notify us
              immediately of any unauthorized use of your account. 
              2.4. You agree not to engage in
              any activity that may disrupt or interfere with the proper functioning of our
              services. Intellectual Property 
              3.1. Our services and all associated content,
              including but not limited to software, text, graphics, logos, and images, are
              protected by intellectual property rights. 
              3.2. You may not modify, reproduce, distribute, or create derivative works of any part of our services or content without
              our prior written consent. 
              Privacy 4.1. Our Privacy Policy governs the collection,
              use, and disclosure of personal information provided by you during the use of our
              services. 
              4.2. By using our services, you consent to the collection, use, and
              disclosure of your personal information as outlined in our Privacy Policy. Termination
              5.1. We reserve the right to suspend or terminate your access to our services, in
              whole or in part, at any time and for any reason, without prior notice. 5.2. Upon
              termination, any rights and licenses granted to you under this Agreement will
              immediately cease, and you must cease all use of our services. Limitation of Liability
              6.1.
              If you have any questions or concerns
              regarding this Agreement, please contact us at [contact email].
            </Text>
          </ScrollView>
        </View>
      </View>
      <View style={styles.bottomContainer}></View>
    </View>
  );
};

export default UserAgreement;

const styles = StyleSheet.create({});
