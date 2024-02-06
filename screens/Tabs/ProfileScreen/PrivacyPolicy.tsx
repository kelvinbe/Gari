import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { makeStyles } from '@rneui/themed'
import { Image } from '@rneui/base'
import { ScrollView } from 'react-native-gesture-handler'


const useStyles = makeStyles((theme, props)=>{
    return {
        container: {
            flex: 1,
            backgroundColor: theme.colors.white,
            alignItems: 'center',
            justifyContent: "space-between"
        },
        topSection: {
            width: "100%",
            alignItems: "center",
            justifyContent: "flex-start"
        },
        topContainer: {
            width: "100%",
            alignItems: "center",
            justifyContent: "center",
            marginVertical: 30
        },
        titleText: {
            color: theme.colors.title,
            fontSize: 24,
            fontWeight: "700", 
            fontFamily: "Lato_700Bold",
        },
        subtitleText: {
            color: theme.colors.black,
            fontSize: 16,
            fontWeight: "400",
            fontFamily: "Lato_400Regular",
        },
        normaltext: {
            color: theme.colors.black,
            fontSize: 14,
            fontWeight: "400",
            fontFamily: "Lato_400Regular",
        },
        centerContainer: {
            width: "100%",
            alignItems: "center",
            paddingHorizontal: 20,
            height: "60%"
        },
        bottomContainer: {
            width: "100%",
            alignItems: "center",
            justifyContent: "center",
        },
        policyContainer: {
            alignItems: "center",
            justifyContent: "flex-start",
            flexDirection: "row", 
            width: "100%",
            marginVertical: 10
        },
        policyNumber: {
            alignItems: "center",
            justifyContent: "center",
            width: 50,
        },
        policyText: {
            justifyContent: "center",
            width: "85%",
        },
        policiesContainer: {
            flex: 1
        }
    }
})

// Static data to keep screen from crushing since data won't be coming from api

const privacyPolicyData = [
    {
      number: 1,
      title: "Divvly Privacy Policy",
      description: "This privacy policy explains how we collect, use, and protect your personal information when you interact with our services. We are committed to maintaining the privacy and confidentiality of the information you provide to us.",
      last_updated: "May 1, 2023",
      sub_title: "Introduction"
    },
    {
      number: 2,
      title: "Information We Collect",
      description: "We collect various types of information to provide and improve our services. This may include personal information such as your name, email address, contact details, and demographic information. We may also collect information about your interactions with our website or application.",
      last_updated: "May 1, 2023",
      sub_title: ""
    },
    {
      number: 3,
      title: "How We Use Your Information",
      description: "We use the information we collect for purposes such as providing our services, personalizing your experience, improving our offerings, and communicating with you. We may also use your information for research and analysis to enhance our products and services.",
      last_updated: "May 1, 2023",
      sub_title: ""
    },
    {
      number: 4,
      title: "Information Sharing and Disclosure",
      description: "We may share your personal information with trusted third parties who assist us in delivering our services. These parties are obligated to keep your information confidential and are prohibited from using your personal data for any other purpose. We may also disclose your information in response to legal requests or when required by law.",
      last_updated: "May 1, 2023",
      sub_title: ""
    },
    {
      number: 5,
      title: "Data Security",
      description: "We take appropriate measures to protect the security of your personal information. We implement industry-standard security practices to prevent unauthorized access, use, or disclosure of your data. However, no method of transmission over the internet or electronic storage is completely secure, and we cannot guarantee absolute security.",
      last_updated: "May 1, 2023",
      sub_title: ""
    },
    {
      number: 6,
      title: "Your Rights and Choices",
      description: "You have the right to access, update, and delete your personal information. You may also have the right to restrict or object to certain processing activities. We provide mechanisms to exercise these rights and choices, and you can contact us for assistance.",
      last_updated: "May 1, 2023",
      sub_title: ""
    },
    {
      number: 7,
      title: "Children's Privacy",
      description: "Our services are not intended for individuals under the age of 13. We do not knowingly collect personal information from children without appropriate parental or guardian consent. If you believe that we have unintentionally collected information from a child, please contact us immediately.",
      last_updated: "May 1, 2023",
      sub_title: ""
    },
    {
      number: 8,
      title: "Changes to this Privacy Policy",
      description: "We may update this privacy policy periodically to reflect changes in our practices or legal requirements. We will notify you of any material updates by posting a prominent notice on our website or by other means. We encourage you to review this policy regularly for the latest information on our privacy practices.",
      last_updated: "May 1, 2023",
      sub_title: ""
    }
  ];

const PrivacyPolicy = () => {
  const styles = useStyles()


return (
    <View style={styles.container} >
        <View style={styles.topSection} >
            <View style={styles.topContainer} >
                <Image 
                    source={require('../../../assets/images/logo.png')}
                    style={{
                        height: 50,
                        width: 50,
                    }}
                    resizeMode="contain"
                />
                <View style={{
                    width: "100%",
                    alignItems: "center",
                    justifyContent: "center"
                }} >
                    <Text style={[styles.titleText, {marginVertical: 10}]} >{privacyPolicyData[0]['title']}</Text>
                    <Text style={styles.subtitleText} >Last Updated: {privacyPolicyData[0]['last_updated']}</Text>
                    <Text style={[styles.normaltext, {
                        textAlign: "center",
                        marginTop: 10,
                        paddingHorizontal: 20
                    }]} >
                        {privacyPolicyData[0]['sub_title']} 
                    </Text>
                </View>
            </View>
            <View style={styles.centerContainer}>
                <ScrollView style={styles.policiesContainer} >
                    {privacyPolicyData.map((policy:{number:number, title:string, description:string}) => (
                        <View style={styles.policyContainer} key={policy.number}>
                            <View style={styles.policyNumber} >
                                <Text style={styles.titleText} >
                                    {policy.number}
                                </Text>
                            </View>    
                            <View style={styles.policyText} >
                                <Text style={styles.subtitleText} >
                                    {policy.title}
                                </Text>
                                <Text style={[styles.normaltext]} >
                                    {policy.description}
                                </Text>
                            </View>
                        </View>
                    ))}
                </ScrollView>
            </View>
        </View>
        <View style={styles.bottomContainer} >
        </View>
    </View>
)
}

export default PrivacyPolicy

const styles = StyleSheet.create({})