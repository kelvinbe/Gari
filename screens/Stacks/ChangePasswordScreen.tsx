import { Text, View } from 'react-native'
import React from 'react'
import { makeStyles, useTheme } from '@rneui/themed'
import { Icon, Image } from '@rneui/base'
import { TouchableOpacity } from 'react-native-gesture-handler'
import { NativeStackScreenProps } from '@react-navigation/native-stack'
import { RootStackParamList } from '../../types'
import WithHelperText from '../../components/atoms/Input/WithHelperText/WithHelperText'
import Rounded from '../../components/atoms/Buttons/Rounded/Rounded'


interface IProps {

}

type Props = NativeStackScreenProps<RootStackParamList, "ChangePassword">

const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

const hasLowercase = (str: string) => /[a-z]/.test(str);
const hasUppercase = (str: string) => /[A-Z]/.test(str);
const hasNumber = (str: string) => /\d/.test(str);
const hasSpecialCharacter = (str: string) => /[@$!%*?&]/.test(str);

const useStyles = makeStyles((theme, props: Props)=>{
    return ({
        container: {
            backgroundColor: theme.colors.white,
            alignItems: 'center',
            justifyContent: 'space-between',
            width: "100%",
            height: "100%"
        },
        logoContainer: {
            width: '100%',
            marginVertical: 20,
            alignItems: 'center',
            justifyContent: 'center',
        },
        contentContainer: {
            alignItems: "center",
            width: "100%",
            paddingHorizontal: 20,
            justifyContent: "flex-start"
        },
        title: {    
            fontSize: 20,
            fontWeight: "700", 
 fontFamily: "Lato_700Bold",
            color: theme.colors.black,
            marginBottom: 40,
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
        },
        helperContentLeft: {
            width: "100%",
            alignItems: "flex-start",
            justifyContent: "flex-start",
        },
        helperContentRight: {
            width: "100%",
            alignItems: "flex-end",
            justifyContent: "flex-end",
        },
        helperText: {
            fontSize: 12,
            fontWeight: "400", fontFamily: "Lato_400Regular",
            marginTop: 5
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
    })
})

interface IReducerState {
    password: string,
    confirmPassword: string,
    isPasswordValid: boolean,
    isConfirmPasswordValid: boolean,
    isPasswordMatch: boolean,
    isPasswordVisible: boolean,
    isConfirmPasswordVisible: boolean,
}

const initialState: IReducerState = {
    password: "",
    confirmPassword: "",
    isPasswordValid: false,
    isConfirmPasswordValid: false,
    isPasswordMatch: false,
    isPasswordVisible: false,
    isConfirmPasswordVisible: false,
}

const reducer = (state: IReducerState, action: any) => {
    switch (action.type) {
        case "SET_PASSWORD":
            return {
                ...state,
                password: action.payload,
                isPasswordValid: passwordRegex.test(action.payload),
            }
        case "SET_CONFIRM_PASSWORD":
            return {
                ...state,
                confirmPassword: action.payload,
                isConfirmPasswordValid: passwordRegex.test(action.payload) && hasLowercase(action.payload) && hasUppercase(action.payload) && hasNumber(action.payload) && hasSpecialCharacter(action.payload),
                isPasswordMatch: action.payload === state.password
            }
        case "TOGGLE_PASSWORD_VISIBILITY":
            return {
                ...state,
                isPasswordVisible: !state.isPasswordVisible
            }
        case "TOGGLE_CONFIRM_PASSWORD_VISIBILITY":
            return {
                ...state,
                isConfirmPasswordVisible: !state.isConfirmPasswordVisible
            }
        default:
            return state
    }
}

const ChangePasswordScreen = (props: Props) => {
    const [{
        password,
        confirmPassword,
        isPasswordValid,
        isConfirmPasswordValid,
        isPasswordMatch,
        isPasswordVisible,
        isConfirmPasswordVisible
    }, dispatch] = React.useReducer(reducer, initialState)

    const { theme } = useTheme()

    const setPassword = (value: string) => {
        dispatch({
            type: "SET_PASSWORD",
            payload: value
        })
    }

    const setConfirmPassword = (value: string) => {
        dispatch({
            type: "SET_CONFIRM_PASSWORD",
            payload: value
        })
    }

    const toggleViewPassword = () => {
        dispatch({
            type: "TOGGLE_PASSWORD_VISIBILITY"
        })
    }

    const toggleViewConfirmPassword = () => {
        dispatch({
            type: "TOGGLE_CONFIRM_PASSWORD_VISIBILITY"
        })
    }




    const styles = useStyles(props)

    const backToLogin = () => {
        props.navigation.navigate("Login")
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
            <Text style={styles.title} >Create Password</Text>

            <WithHelperText
                label="Password"
                placeholder="Enter your password"
                secureTextEntry={!isPasswordVisible}
                fullWidth
                value={password}
                onChangeText={setPassword}
                rightIcon={
                    <Icon onPress={toggleViewPassword} name={ isPasswordVisible  ? "eye" :"eye-slash"} type="font-awesome" />
                }
                container={{
                    marginBottom: 40
                }}
                helperText={
                    (password?.length > 0 && !isPasswordValid) ? 
                    <View style={styles.bottomHelperText}>
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

            <WithHelperText
                label="Confirm Password"
                placeholder="Enter your password"
                fullWidth
                container={{
                    marginBottom: 40
                }}
                onChangeText={setConfirmPassword}
                value={confirmPassword}
                disabled={!isPasswordValid}
                secureTextEntry={!isConfirmPasswordVisible}
                rightIcon={
                    <Icon onPress={toggleViewConfirmPassword} name={ isConfirmPasswordVisible  ? "eye" :"eye-slash"} type="font-awesome" />
                }
                helperText={
                    <View style={styles.bottomHelperTextContainer} >
                        <Text style={[styles.bottomHelperText, {
                            color: password?.length > 0 ? !isPasswordMatch ? theme.colors.error : theme.colors.success : theme.colors.grey1
                        }]} >
                            {
                                isPasswordValid ? !isPasswordMatch? "Passwords do not match" : "Passwords Match" : ""
                            }
                        </Text>
                        { ((password?.length) > 0 && isPasswordValid) && <Icon
                            name={ !isPasswordMatch ? "exclamation-circle" :  "check-circle"}
                            type="font-awesome"
                            size={12}
                            color={ !isPasswordMatch ? theme.colors.error : theme.colors.success}
                        />}
                    </View>
                }
            />

            <Rounded>
                Continue
            </Rounded>
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

export default ChangePasswordScreen
