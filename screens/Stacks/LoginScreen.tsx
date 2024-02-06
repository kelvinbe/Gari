import { Platform, Text, View } from 'react-native'
import React, { useState, useEffect } from 'react'
import { makeStyles } from '@rneui/themed'
import { auth } from '../../firebase/firebaseApp'
import { useAuthState } from 'react-firebase-hooks/auth';
import BaseInput from '../../components/atoms/Input/BaseInput/BaseInput'
import WithHelperText from '../../components/atoms/Input/WithHelperText/WithHelperText'
import Rounded from '../../components/atoms/Buttons/Rounded/Rounded'
import Divider from '../../components/atoms/Divider/Divider'
import IconButton from '../../components/atoms/Buttons/Icon/IconButton'
import { Icon } from '@rneui/base'
import { RootStackParamList } from '../../types'
import { NativeStackScreenProps } from '@react-navigation/native-stack'
import useToast from '../../hooks/useToast'
import GoogleIcon from "../../assets/icons/google.svg"
import FacebookIcon from "../../assets/icons/facebook.svg"
import AppleIcon from "../../assets/icons/apple.svg"
import Loading from '../../components/molecules/Feedback/Loading/Loading';
import useSocialAuth from '../../hooks/useSocialAuth';
import useUserAuth from '../../hooks/useUserAuth';
import { useAppDispatch } from '../../store/store';
import Logo from '../../components/atoms/Brand/Logo';
import useOnBoarding from '../../hooks/useOnBoarding';
import { fetchOnboarding } from '../../store/slices/onBoardingSlice';

type Props = NativeStackScreenProps<RootStackParamList, 'Login'> ;

const useStyles = makeStyles((theme)=>{
    return ({
        container: {
            backgroundColor: theme.colors.white ,
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
        helperTextStyle: {
            fontSize: 14,
            lineHeight: 16,
            color: theme.colors.grey3,
            marginTop: 5,
            width: "100%",
            textAlign: "right",
            fontStyle: "italic",
            fontWeight: "500", fontFamily: "Lato_400Regular",

        },
    })
})

const LoginScreen = (props: Props) => {
    
    const [user, loading, signInError] = useAuthState(auth);
    const styles = useStyles(props)
    const [viewPassword, setViewPassword] = useState(false)
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const {  googleLogin, socialAuthLoading, socialAuthError, facebookLogin } = useSocialAuth()
    const { signIn: _signIn, signInLoading } = useUserAuth()
    const { completed, loading: onBoardingLoading } = useOnBoarding()
    const dispatch = useAppDispatch()

    const toast = useToast()

    const signIn = () => {
        _signIn(email, password, false)
    };

    const toggleViewPassword = () => {
        setViewPassword(!viewPassword)
    }

    const navigateToRegister = () => {
        props.navigation.navigate("Register")
    }

    const navigateToForgotPassword = () => {
        props.navigation.navigate("ForgotPassword")
    }
    
    const navigateToHome = () => {
        props.navigation.navigate("Root")
    }

    const navigateToOnBoarding = () => {
        props.navigation.navigate("Onboarding")
    }

    useEffect(()=>{
        if ( loading ) return () => {};
        
        if (user){
            (async ()=>{
                dispatch(fetchOnboarding()).unwrap().then((completed)=>{
                    if (completed?.location && completed?.profile) {
                        navigateToHome()
                    } else {
                        navigateToOnBoarding()
                    }
                    
                })
            })()
        }else if (signInError) {
            toast({
                message: "An error occured while signing you in",
                type: "error",
                title: "Error",
                duration: 5000
            })
        }
    }, [,user])

    

    return ( 
        <View style={styles.container} >
            <View style={styles.logoContainer}>
            <Logo />
            </View>
            <View style={styles.contentContainer} >
                <View style={styles.topContent} >
                    <Text style={styles.title} >
                        Login
                    </Text>
                    <BaseInput value={email} onChangeText={setEmail} containerStyle={{marginBottom: 40}} fullWidth placeholder='e.g email@email.com' label="Email" keyboardType='email-address' />
                    <WithHelperText value={password} onChangeText={setPassword} label="Password" secureTextEntry={!viewPassword} container={{marginBottom: 20}} 
                        fullWidth 
                        placeholder="password" 
                        helperText={
                            <Text onPress={navigateToForgotPassword} style={styles.helperTextStyle} >
                                Forgot Password?
                            </Text>
                        }
                        rightIcon={<Icon onPress={toggleViewPassword} name={ viewPassword  ? "eye" :"eye-slash"} type="font-awesome" />} 
                        />
                    <Rounded 
                    // disabled={isEmpty(password) || isEmpty(email)} 
                    loading={loading} onPress={signIn} fullWidth>
                        Login
                    </Rounded>
                </View>
                <View style={styles.bottomTextContainer} >
                    <Text style={styles.leftText} >
                        Don't have an account?
                    </Text>
                    <Text onPress={navigateToRegister} style={styles.rightText} >
                        Register
                    </Text>
                </View>
                
            </View>
        </View>
  )
}

export default LoginScreen
