import { StyleSheet, Text, View, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import { makeStyles, useTheme } from '@rneui/themed'
import { NativeStackScreenProps } from '@react-navigation/native-stack'
import { RootStackParamList } from '../../types'
import OTPInput from '../../components/molecules/Input/OTPInput/OTPInput'
import Loading from '../../components/molecules/Feedback/Loading/Loading'
import { StatusBar } from 'expo-status-bar'

type Props = NativeStackScreenProps<RootStackParamList, "Verification">

const useStyles = makeStyles((theme, props: Props)=>{
    return ({
        container: {
            width: "100%",
            height: "100%",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "space-between",
            backgroundColor: theme.colors.white
        },
        contentContainer: {
            width: "100%",
            height: "50%",
            justifyContent: "flex-end",
            alignItems: "center"
        },
        titleStyle: {
            fontSize: 24,
            fontWeight: "700", 
 fontFamily: "Lato_700Bold",
            color: theme.colors.title,
            marginBottom: 5
        },
        subtitleStyle: {
            fontSize: 16,
            fontWeight: "500", fontFamily: "Lato_400Regular",
            color: theme.colors.grey1,
            textAlign: "center"
        },
        bottomContainer: {
            width: "100%",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            marginVertical: 20
        },
        leftText: {
            color: theme.colors.grey1,
            marginRight: 5
        },
        rightText: {
            color: theme.colors.primary,
        },
        backLink: {
            color: theme.colors.primary,
            fontSize: 16,
            fontWeight: "500", fontFamily: "Lato_400Regular",
            marginBottom: 20

        }

    })
})

const VerificationScreen = (props: Props) => {
    const styles = useStyles(props)
    const { theme } = useTheme()
    const [loading, setLoading] = useState(false)
    const onOTPChange = (otp: string) => {
        setLoading(true)
        console.log(otp)
        /**
         * @todo add logic to verify OTP
         */
        props.navigation.navigate("Login")

    }
    const toRegister = () =>{
        props.navigation.navigate("Register")
    }

    if(loading) return <Loading/>

  return (
    <View style={styles.container} >
        <View style={styles.contentContainer} >
            <Text style={styles.titleStyle}>Verification</Text>
            <Text style={styles.subtitleStyle}>Check your email for the verification code.</Text>
            <OTPInput
                otpLength={6}
                onChange={onOTPChange}
            />
            <View style={styles.bottomContainer} >
                <Text style={styles.leftText}>Didn't receive the code?</Text>
                <TouchableOpacity  >
                    <Text style={styles.rightText}>Resend</Text>
                </TouchableOpacity>
            </View>
        </View>
        
        <TouchableOpacity  onPress={toRegister} >
            <Text style={styles.backLink}>Back</Text>
        </TouchableOpacity>
        
    </View>
  )
}

export default VerificationScreen

const styles = StyleSheet.create({})