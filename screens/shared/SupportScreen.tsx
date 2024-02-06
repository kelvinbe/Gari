import { ScrollView, StyleSheet, Text, View } from 'react-native';
import React, { useState } from 'react';
import { makeStyles, useTheme } from '@rneui/themed';
import { Image } from '@rneui/base';
import Support from '../../assets/icons/feather/help-circle.svg';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import ActionButton from '../../components/atoms/Buttons/ActionButton/ActionButton';


type Props = NativeStackScreenProps<any, any>;

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
    },
    bottomContainer: {
      width: '100%',
      alignItems: 'center',
      justifyContent: 'center',
    },
    scrollView: {
      width: '100%',
      height: '80%',
    },
    actionButton: {
      marginBottom: 10,
    },
  };
});

  // Static data to keep screen from crushing since data won't be coming from api
  const faqs = [
    {
      question_id: 1,
      question: 'How do I create an account?',
      answer: `To create an account, click on the 'Sign Up' button located on the top right corner of our website. Fill in the required information, including your name, email address, and password. Once you submit the form, you will receive a confirmation email to verify your account. Follow the instructions in the email to complete the registration process.`,
    },
    {
      question_id: 2,
      question: 'What payment methods do you accept?',
      answer: `We accept various payment methods, including credit cards (Visa, Mastercard, American Express), Mpesa. During the checkout process, you can choose the payment option that suits you best. If you have any specific payment-related questions or concerns, please reach out to our support team for assistance.`,
    },
    {
      question_id: 3,
      question: 'How can I track my order?',
      answer: `Once your order has been shipped, you will receive a confirmation email containing a tracking number and instructions on how to track your package. Simply click on the provided tracking link or visit our website and enter your tracking number in the designated tracking section. This will allow you to monitor the status and location of your shipment in real-time.`,
    },
    {
      question_id: 4,
      question: 'What is your refund policy?',
      answer: `We have a 30-day refund policy. If you are not satisfied with your purchase, please contact our support team within 30 days of receiving your order. We will guide you through the refund process and provide you with the necessary instructions. Please note that certain conditions may apply, and refunds are subject to our refund policy terms and conditions.`,
    },
    {
      question_id: 5,
      question: 'How can I contact your customer support?',
      answer: `You can reach our customer support team through various channels. You can send an email to support@ourcompany.com or call our support hotline at [+123456789]. Our dedicated team is available 24/7 and will be happy to assist you with any inquiries or concerns you may have.`,
    },
  ];


const SupportScreen = (props: Props) => {
  const styles = useStyles();
  const { theme } = useTheme();
  const [toggleAnswer, setToggleAnswer] = useState<boolean>(false);


  return (
    <View style={styles.container}>
      <View style={styles.topSection}>
        <View style={styles.topContainer}>
          <Image
            source={require('../../assets/images/logo.png')}
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
            <Text style={[styles.titleText, { marginVertical: 10 }]}>{faqs[0]['question']}</Text>
            <Text style={styles.subtitleText}>Need Help?</Text>
            <Text
              style={[
                styles.normaltext,
                {
                  textAlign: 'center',
                  marginTop: 10,
                  paddingHorizontal: 20,
                },
              ]}>
              We are here to help you. Please contact us if you have any questions or concerns.
            </Text>
          </View>
        </View>
        <View style={styles.centerContainer}>
          <ScrollView style={styles.scrollView}>
            {faqs.map((question: { question_id: number; question: string; answer: string }) => (
              <ActionButton
                key={question.question_id}
                data={faqs}
                id={question.question_id}
                title={question.question}
                image={<Support stroke={theme.colors.primary} width={20} height={20} />}
                customStyle={styles.actionButton}
                onPress={() => setToggleAnswer(!toggleAnswer)}
              />
            ))}
          </ScrollView>
        </View>
      </View>
      <View style={styles.bottomContainer}></View>
    </View>
  );
};

export default SupportScreen;

const styles = StyleSheet.create({});
