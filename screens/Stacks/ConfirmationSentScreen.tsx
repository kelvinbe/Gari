import { Text, View } from 'react-native'
import React from 'react'
import { makeStyles } from '@rneui/themed'
import { Image } from '@rneui/base'
import { TouchableOpacity } from 'react-native-gesture-handler'
import { NativeStackScreenProps } from '@react-navigation/native-stack'
import { RootStackParamList } from '../../types'


interface IProps {

}

type Props = NativeStackScreenProps<RootStackParamList, "ConfirmationSent">

const useStyles = makeStyles((theme, props: Props)=>{
    return ({
        container: {
            flex: 1,
            backgroundColor: theme.colors.white,
            alignItems: 'center',
            justifyContent: 'space-between',
            width: "100%"
        },
        logoContainer: {
            width: '100%',
            marginVertical: 20,
            alignItems: 'center',
            justifyContent: 'center',
        },
        contentContainer: {
            alignItems: "center",
            width: "90%",
            height: "60%"
        },
        title: {    
            fontSize: 20,
            fontWeight: "700", 
 fontFamily: "Lato_700Bold",
            color: theme.colors.black,
            marginBottom: 10,
            textAlign: "center"
        },
        info: {
            fontSize: 16,
            fontWeight: "500", fontFamily: "Lato_400Regular",
            color: theme.colors.black,
            textAlign: "center",
            marginBottom: 50
        },
        infoActionContainer: {
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",

        },
        infoText: {
            fontSize: 16,
            fontWeight: "500", fontFamily: "Lato_400Regular",
            color: theme.colors.grey0
        },
        action: {
            fontSize: 16,
            fontWeight: "500", fontFamily: "Lato_400Regular",
            color: theme.colors.link,
            marginLeft: 5
        }
    })
})

const ConfirmationSentScreen = (props: Props) => {
    const styles = useStyles(props)

    const backToLogin = () => {
        props.navigation.navigate("Login")
    }

    const navigateToSupport = () => {
        props.navigation.navigate("SupportScreen", {
            context: "confirmationSent"
        })
    }
  return (
    <View style={styles.container} >
         <View style={styles.logoContainer}>
                <Image 
                    source={require('../../assets/images/logo.png')}
                    style={{
                        height: 100,
                        width: 100,
                    }}
                    resizeMode="contain"
                />
        </View>
        <View style={styles.contentContainer} >
            <Text style={styles.title} >Check Your Email</Text>
            <Text style={styles.info} >An email with instruction to Reset your password has been sent to som****@**mail.com</Text>

            <View style={styles.infoActionContainer} >
                <Text style={styles.infoText} >Didn't receive any email?</Text>
                <TouchableOpacity onPress={navigateToSupport} >
                    <Text style={styles.action} >Support</Text>
                </TouchableOpacity>
            </View>
        </View>
        
        <View style={[styles.infoActionContainer, {marginVertical: 20}]} >
                <Text style={styles.infoText} >Not You?</Text>
                <TouchableOpacity onPress={backToLogin} >
                    <Text style={styles.action} >Back to login</Text>
                </TouchableOpacity>
            </View>

    </View>
  )
}

export default ConfirmationSentScreen
