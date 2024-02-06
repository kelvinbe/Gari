import { Text, View } from 'react-native'
import React, {useState} from 'react'
import { makeStyles } from '@rneui/themed'
import BaseInput from '../../components/atoms/Input/BaseInput/BaseInput'
import Rounded from '../../components/atoms/Buttons/Rounded/Rounded'
import { Image } from '@rneui/base'
import { RootStackParamList } from '../../types'
import { NativeStackScreenProps } from '@react-navigation/native-stack'
import { useSendPasswordResetEmail } from 'react-firebase-hooks/auth'
import { auth } from '../../firebase/firebaseApp'
import useToast from '../../hooks/useToast'


type Props = NativeStackScreenProps<RootStackParamList, 'ForgotPassword'> ;

const useStyles = makeStyles((theme)=>{
    return ({
        container: {
            backgroundColor: theme.colors.white,
            alignItems: 'center',
            justifyContent: 'space-between',
            width: '100%',
            height: '100%',
            paddingHorizontal: 20,
        },
        contentContainer: {
            width: '100%',
            height: '80%',
            justifyContent: "space-between",
            alignItems: "center",
        },
        topContent: {
            width: '100%',
            justifyContent: "flex-start",
            alignItems: "center",
        }, 
        iconButtonsContainer: {
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            width: "100%"
        },
        bottomTextContainer: {
            width: "100%",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 16,
            fontWeight: "500", fontFamily: "Lato_400Regular",
            marginVertical: 20
        },
        leftText: {
            
            color: theme.colors.primary,
            marginRight: 5
        },
        rightText: {
            color: theme.colors.grey1,
        },
        title: {
            color: theme.colors.title,
            fontSize: 24,
            fontWeight: "700", 
 fontFamily: "Lato_700Bold",
            marginBottom: 42
        },
        logoContainer: {
            width: "100%",
            alignItems: "center",
            justifyContent: "center",
            marginVertical: 20
        },
        verifyButtonStyles : {
            borderRadius: 15,
            borderWidth: 1,
            borderColor: theme.colors.stroke,
            alignItems: "center",
            justifyContent: "center",
            paddingHorizontal: 10,
            paddingVertical: 3,
            width: 100,
            backgroundColor: theme.colors.white
        },
        verifyButtonContainerStyle: {
          width: "100%",
          alignItems: "flex-end",
          marginTop: 10
        },
        verifyButtonTextStyles: {
          color: theme.colors.stroke,
          fontSize: 12,
          lineHeight: 18,
          textAlign: "center"
        }
    })
})

const ForgotPasswordScreen = (props: Props) => {
    const toast = useToast()
    const styles = useStyles(props)
    const [email, setEmail] = useState("")
    const [sendPasswordResetEmail, sending] = useSendPasswordResetEmail(
        auth
      );

    const navigateToLogin = () => {
        props.navigation.navigate("Login")
    }

    const handleSendResetLink = () =>{
        sendPasswordResetEmail(email).then(()=>{
            toast({
                message: "Reset link sent successfully",
                type: "success"
            })
        }).catch(()=>{
            toast({
                message: "An error occured. Please try again later",
                type: "error"
            })
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
                <View style={styles.topContent} >
                    <Text style={styles.title} >
                        Forgot Password
                    </Text>
                    <BaseInput value={email} onChangeText={setEmail} containerStyle={{marginBottom: 20}} fullWidth placeholder='email@email.com' label="Email"  />
                    <Rounded 
                        onPress={handleSendResetLink}  
                        fullWidth
                        loading={sending}
                    >
                        Send Reset Link
                    </Rounded>
                </View>
                <View style={styles.bottomTextContainer} >
                    <Text style={styles.leftText} >
                        Not You?
                    </Text>
                    <Text onPress={navigateToLogin}  style={styles.rightText} >
                        Back to login
                    </Text>
                </View>
                
                
            </View>
        </View>
  )
}

export default ForgotPasswordScreen
