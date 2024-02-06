import { Linking, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { makeStyles, useTheme } from '@rneui/themed'
import { Image } from '@rneui/base'
import ActionButton from '../../../components/atoms/Buttons/ActionButton/ActionButton'
import PrivacyPolicy from "../../../assets/icons/feather/shield.svg"
import UserAgreement from "../../../assets/icons/feather/info.svg"
import Support from "../../../assets/icons/feather/help-circle.svg"
import { NativeStackScreenProps } from '@react-navigation/native-stack'
import { ProfileScreenParamList } from '../../../types'

type Props = NativeStackScreenProps<ProfileScreenParamList, "AboutScreen">

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
            paddingHorizontal: 20
        },
        bottomContainer: {
            width: "100%",
            alignItems: "center",
            justifyContent: "center",
        },
        
    }
})

const AboutScreen = (props: Props) => {
    const styles = useStyles()
    const { theme } = useTheme()

    const goToPrivacyPolicy = () => {
        props.navigation.navigate("PrivacyPolicy")
    }

    const goToUserAgreement = () => {
        props.navigation.navigate("UserAgreement")
    }   

    const goToSupport = () => {
        props.navigation.navigate("SupportScreen", {
            context: "about"
        })
    }

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
                    <Text style={[styles.titleText, {marginVertical: 10}]} >divvly</Text>
                    <Text style={styles.subtitleText} >Current Version: 1.0.0</Text>
                    <Text style={[styles.normaltext, {
                        textAlign: "center",
                        marginTop: 10,
                        paddingHorizontal: 20
                    }]} >
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras pharetra posuere dapibus. 
                    </Text>
                </View>
            </View>
            <View style={styles.centerContainer} >
                <ActionButton
                    title='Privacy Policy'
                    image={<PrivacyPolicy stroke={theme.colors.primary} width={20} height={20}   />}
                    onPress={goToPrivacyPolicy} //TODO Create Privacy Policy Screen(Add Static data  to screen)
                />
                <ActionButton
                    title='User Agreement'
                    image={<UserAgreement stroke={theme.colors.primary} width={20} height={20}   />}
                    customStyle={{
                        marginVertical: 20
                    }}
                    onPress={goToUserAgreement}
                />
                <ActionButton
                    title='Support'
                    image={<Support stroke={theme.colors.primary} width={20} height={20}   />}
                    onPress={goToSupport}
                />
            </View>
        </View>
        <View style={styles.bottomContainer} >
            <Text style={styles.normaltext} >
                © 2022 divvly
            </Text>
        </View>
    </View>
  )
}

export default AboutScreen

const styles = StyleSheet.create({})