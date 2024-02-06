import { Text, View } from 'react-native'
import React, { useReducer, useEffect} from 'react'
import { makeStyles, useTheme } from '@rneui/themed'
import WithHelperText from '../../components/atoms/Input/WithHelperText/WithHelperText'
import Rounded from '../../components/atoms/Buttons/Rounded/Rounded'
import Divider from '../../components/atoms/Divider/Divider'
import IconButton from '../../components/atoms/Buttons/Icon/IconButton'
import { Icon, Image, } from '@rneui/base'
import { RootStackParamList } from '../../types'
import { NativeStackScreenProps } from '@react-navigation/native-stack'
import useUserAuth from '../../hooks/useUserAuth'
import useToast from '../../hooks/useToast'
import FacebookIcon from "../../assets/icons/facebook.svg"
import AppleIcon from "../../assets/icons/apple.svg"
import GoogleIcon from "../../assets/icons/google.svg"
import useSocialAuth from '../../hooks/useSocialAuth'
import { isEmpty } from 'lodash'
import { isValidEmail, isValidPassword } from '../../utils/utils'
import { Platform } from 'react-native'


const hasLowercase = (str: string) => /[a-z]/.test(str);
const hasUppercase = (str: string) => /[A-Z]/.test(str);
const hasNumber = (str: string) => /\d/.test(str);
const hasSpecialCharacter = (str: string) => /[@$!%*?&]/.test(str);

type Props = NativeStackScreenProps<RootStackParamList, 'Register'> ;

const useStyles = makeStyles((theme)=>{
    return ({
        container: {
            backgroundColor: theme.colors.white,
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingHorizontal: 20,
            flex: 1
        },
        contentContainer: {
            flex: 1,
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
        },
        bottomHelperTextContainer: {
            width: "100%",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "flex-end",
            paddingHorizontal: 20
        },
        bottomHelperTextContainerA: {
            width: "100%",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "flex-start",
            paddingHorizontal: 20
        },
        bottomHelperText: {
            fontSize: 12,
            fontWeight: "400", 
            fontFamily: "Lato_400Regular",
            fontStyle: 'italic',
            marginRight: 5,
            marginLeft: 5
        },
        passwordHelperText: {
            width: "100%",
            alignItems: "flex-start",
            justifyContent: "flex-start",

        },
        passwordHelperTextContainer: {
            width: "100%",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "flex-start",
        },

    })
})

interface IReducerState {
    email: string,
    password: string,
    confirmPassword: string,
    loading: boolean,
    error: string,
    viewPassword: boolean,
    viewConfirmPassword: boolean,
    passwordsMatch: boolean,
    emailValid: boolean,
    passwordValid: boolean,
}

const initialState: IReducerState = {
    email: '',
    password: '',
    confirmPassword: '',
    loading: false,
    error: '',
    viewPassword: false,
    viewConfirmPassword: false,
    passwordsMatch: false,
    emailValid: false,
    passwordValid: false,
}

const reducer = (state: IReducerState, action: any) => {
    switch (action.type) {
        case 'SET_EMAIL':
            return {
                ...state,
                email: action.payload,
                emailValid: isValidEmail(action.payload)
            }
        case 'SET_PASSWORD':
            return {
                ...state,
                password: action.payload,
                passwordValid: isValidPassword(action.payload)
            }
        case 'SET_CONFIRM_PASSWORD':
            return {
                ...state,
                confirmPassword: action.payload,
                passwordsMatch: state.password.length > 0 ?  action.payload === state.password : false
            }
        case 'SET_LOADING':
            return {
                ...state,
                loading: action.payload
            }
        case 'SET_ERROR':
            return {
                ...state,
                error: action.payload
            }

        case 'SET_VIEW_PASSWORD':
            return {
                ...state,
                viewPassword: action.payload
            }
        case 'SET_VIEW_CONFIRM_PASSWORD':
            return {
                ...state,
                viewConfirmPassword: action.payload 
            }
        case 'SET_PASSWORDS_MATCH':
            return {
                ...state,
                passwordsMatch: action.payload
            }
        case 'SET_EMAIL_VALID':
            return {
                ...state,
                emailValid: action.payload
            }
        case 'SET_PASSWORD_VALID':
            return {
                ...state,
                passwordValid: action.payload
            }
        default:
            return state
    }
}


const RegisterScreen = (props: Props) => {
    const { googleLogin, facebookLogin, socialAuthError } = useSocialAuth()

    const [{
        email,
        password,
        confirmPassword,
        viewPassword,
        viewConfirmPassword,
        passwordsMatch,
        emailValid,
        passwordValid
    }, dispatchAction] = useReducer(reducer, initialState)


    const styles = useStyles(props)
    const { theme } = useTheme()
    const toast = useToast()

    const {signUp, signUpLoading, signUpError} = useUserAuth()

    useEffect(()=>{
        if(!isEmpty(socialAuthError)){
            toast({
                title: "Error",
                type: "error",
                duration: 3000,
                message: "Something went wrong"
            })
        }
    }, [socialAuthError])
    

    const handleRegister = () => {
        if(!emailValid || !passwordValid ){
            toast({
                title: "Error",
                type: "error",
                duration: 3000,
                message: "Invalid email or password"
            })
        }else{
            signUp(email, password).then(() => {
                props.navigation.navigate('Login')
            })
        }
    }

    const toggleViewPassword = () => {
        dispatchAction({type: 'SET_VIEW_PASSWORD', payload: !viewPassword})
    }

    const toggleViewConfirmPassword = () => {
        dispatchAction({type: 'SET_VIEW_CONFIRM_PASSWORD', payload: !viewConfirmPassword})
    }

    const setPassword = (value: string) => {
        dispatchAction({type: 'SET_PASSWORD', payload: value})
    }

    const setConfirmPassword = (value: string) => {
        dispatchAction({type: 'SET_CONFIRM_PASSWORD', payload: value})
    }

    const setEmail = (value: string) => {
        dispatchAction({type: 'SET_EMAIL', payload: value})
    }

    const navigateToLogin = () => {
        setTimeout(()=>{
            props.navigation.navigate("Login")
        }, 2000) 
    }

  return (
        <View 
            style={styles.container} >
                <View style={styles.logoContainer}>
                    <Image 
                        source={require('../../assets/images/logo.png')}
                        style={{
                            height: 100,
                            width: 100,
                        }}
                    />
                </View>
                <Text style={styles.title} >
                    Register
                </Text>
                <View 
                    style={styles.topContent}
                >
                        <WithHelperText inputStyle={{paddingVertical: 10}} value={email} onChangeText={setEmail} label="Email" container={{marginBottom: 45}}
                            fullWidth
                            placeholder="email"
                            helperText={
                                <View style={[styles.bottomHelperText, {width: "100%", alignItems: "center", flexDirection: "row"}]} >
                                    <Text style={[styles.bottomHelperText, {
                                        color: email?.length > 0 ? emailValid ? theme.colors.error : theme.colors.success : theme.colors.grey1
                                    }]} >
                                        {
                                            email.length > 0 ? !emailValid ? "Email not properly formatted" : "" : ""
                                        }
                                    </Text>
                                    {( email?.length > 0 && !emailValid) && <Icon
                                        name={ !emailValid ? "exclamation-circle" :  "check-circle"}
                                        type="font-awesome"
                                        size={12}
                                        color={ !emailValid ? theme.colors.error : theme.colors.success}
                                    />}
                                </View>
                            }
                        />
                        <WithHelperText value={password} onChangeText={setPassword} label="Password" secureTextEntry={!viewPassword} container={{marginBottom: 45}} 
                            fullWidth 
                            placeholder="password" 
                            rightIcon={<Icon onPress={toggleViewPassword} name={ viewPassword  ? "eye" :"eye-slash"} type="font-awesome" />} 
                            helperText={
                            (password?.length > 0 && !passwordValid) ? <View style={styles.bottomHelperText}>
                                    <View style={styles.bottomHelperTextContainerA} >
                                        <Icon
                                            name={ !(password.length >= 8) ? "exclamation-circle" :  "check-circle"}
                                            type="font-awesome"
                                            size={12}
                                            color={ !(password.length >= 8) ? theme.colors.error : theme.colors.success}
                                        />
                                        <Text style={[styles.bottomHelperText,{
                                            color: !(password.length >= 8) ? theme.colors.error : theme.colors.success
                                        }]} >
                                            at least 8 characters long
                                        </Text>
                                    </View>
                                    <View style={styles.bottomHelperTextContainerA} >
                                        <Icon
                                            name={ !hasNumber(password) ? "exclamation-circle" :  "check-circle"}
                                            type="font-awesome"
                                            size={12}
                                            color={ !hasNumber(password) ? theme.colors.error : theme.colors.success}
                                        />
                                        <Text style={[styles.bottomHelperText,{
                                            color: !hasNumber(password) ? theme.colors.error : theme.colors.success
                                        }]} >
                                            at least one number
                                        </Text>
                                    </View>
                                    <View style={styles.bottomHelperTextContainerA} >
                                        <Icon
                                            name={ !hasLowercase(password) ? "exclamation-circle" :  "check-circle"}
                                            type="font-awesome"
                                            size={12}
                                            color={ !hasLowercase(password) ? theme.colors.error : theme.colors.success}
                                        />
                                        <Text style={[styles.bottomHelperText,{
                                            color: !hasLowercase(password) ? theme.colors.error : theme.colors.success
                                        }]} >
                                            at least one lowercase letter
                                        </Text>
                                    </View>
                                    <View style={styles.bottomHelperTextContainerA} >
                                        <Icon
                                            name={ !hasUppercase(password) ? "exclamation-circle" :  "check-circle"}
                                            type="font-awesome"
                                            size={12}
                                            color={ !hasUppercase(password) ? theme.colors.error : theme.colors.success}
                                        />
                                        <Text style={[styles.bottomHelperText,{
                                            color: !hasUppercase(password) ? theme.colors.error : theme.colors.success
                                        }]} >
                                            at least one uppercase letter
                                        </Text>
                                    </View>
                                    <View style={styles.bottomHelperTextContainerA} >
                                        <Icon
                                            name={ !hasSpecialCharacter(password) ? "exclamation-circle" :  "check-circle"}
                                            type="font-awesome"
                                            size={12}
                                            color={ !hasSpecialCharacter(password) ? theme.colors.error : theme.colors.success}
                                        />
                                        <Text style={[styles.bottomHelperText,{
                                            color: !hasSpecialCharacter(password) ? theme.colors.error : theme.colors.success
                                        }]} >
                                            at least one special character
                                        </Text>
                                    </View>
                            </View> : ""
                            }
                        />
                        <WithHelperText  value={confirmPassword} onChangeText={setConfirmPassword} label="Confirm Password" secureTextEntry={!viewConfirmPassword} container={{marginBottom: 20}} 
                            fullWidth 
                            placeholder="Confirm Password" 
                            helperText={
                                <View style={styles.bottomHelperTextContainer} >
                                    <Text style={[styles.bottomHelperText, {
                                        color: password?.length > 0 ? passwordsMatch ? theme.colors.error : theme.colors.success : theme.colors.grey1
                                    }]} >
                                        {
                                            passwordValid ? !passwordsMatch ? "Passwords do not match" : "Passwords Match" : ""
                                        }
                                    </Text>
                                    { (password?.length && passwordValid ) > 0 && <Icon
                                        name={ !passwordsMatch ? "exclamation-circle" :  "check-circle"}
                                        type="font-awesome"
                                        size={12}
                                        color={ !passwordsMatch ? theme.colors.error : theme.colors.success}
                                    />}
                                </View>
                            }
                            rightIcon={<Icon onPress={toggleViewConfirmPassword} name={ viewConfirmPassword  ? "eye" :"eye-slash"} type="font-awesome" />} 
                        />
                    <Rounded 
                        loading={signUpLoading}
                        onPress={handleRegister}
                        fullWidth>
                        Continue
                    </Rounded>
                    <Divider style={{marginTop: 20, marginBottom: 20}} >
                        Or
                    </Divider>
                    <View style={styles.iconButtonsContainer} >
                        <IconButton name="google" containerStyle={{
                            marginRight: Platform.OS === 'ios' ? 0 : 20
                        }} onPress={()=>{googleLogin(navigateToLogin)}} iconType='font-awesome' >
                            <GoogleIcon width={24} height={24} />
                        </IconButton>
                        {/* {Platform.OS === 'ios' ? <IconButton shadow containerStyle={{
                            marginHorizontal: 10
                        }} name="apple" iconType='font-awesome' >
                            <AppleIcon fill="black" width={24} height={24} />
                        </IconButton> : undefined}
                        <IconButton name="facebook" onPress={()=>{facebookLogin(navigateToLogin)}} iconType='font-awesome' >
                            <FacebookIcon width={24} height={24} />
                        </IconButton> */}
                    </View>
                </View>
                <View style={styles.bottomTextContainer} >
                    <Text style={styles.leftText} >
                        Have an account?
                    </Text>
                    <Text onPress={navigateToLogin} style={styles.rightText} >
                        Login
                    </Text>
                </View>
        </View>
  )
}

export default RegisterScreen
