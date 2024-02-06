import { Text, View, KeyboardAvoidingView } from 'react-native'
import React, { useReducer, useEffect} from 'react'
import { makeStyles, useTheme } from '@rneui/themed'
import { Icon } from '@rneui/base'
import useToast from '../../../../hooks/useToast'
import WithHelperText from '../../../atoms/Input/WithHelperText/WithHelperText'
import { hasLowercase, hasNumber, hasSpecialCharacter, hasUppercase, passwordRegex } from '../../../../utils/utils'
import { isEmpty } from 'lodash'


interface IProps {
    onConfirmPassword: (password: string) => void,
    isPasswordValid: (isValid: boolean) => void
}

type Props = IProps

interface IReducerState {
    password: string,
    confirmPassword: string,
    viewPassword: boolean,
    viewConfirmPassword: boolean,
    passwordsMatch: boolean,
    passwordValid: boolean,
}

const initialState: IReducerState = {
    password: '',
    confirmPassword: '',
    viewPassword: false,
    viewConfirmPassword: false,
    passwordsMatch: false,
    passwordValid: false,
}




const useStyles = makeStyles((theme)=>{
    return ({
        container: {
            backgroundColor: theme.colors.white,
            alignItems: 'center',
            width: '100%',
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



const reducer = (state: IReducerState, action: any) => {
    switch (action.type) {
        case 'SET_PASSWORD':
            return {
                ...state,
                password: action.payload,
                passwordValid: action.payload.length > 0 ? passwordRegex.test(action.payload) : false
            }
        case 'SET_CONFIRM_PASSWORD':
            return {
                ...state,
                confirmPassword: action.payload,
                passwordsMatch: state.password.length > 0 ?  action.payload === state.password : false
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
        case 'SET_PASSWORD_VALID':
            return {
                ...state,
                passwordValid: action.payload
            }
        default:
            return state
    }
}


const PasswordCreator = (props: Props) => {
    const [{
        password,
        confirmPassword,
        viewPassword,
        viewConfirmPassword,
        passwordsMatch,
        passwordValid
    }, dispatchAction] = useReducer(reducer, initialState)

    const styles = useStyles(props)
    const { theme } = useTheme()

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

    useEffect(()=>{
        if(passwordValid && !isEmpty(password) && !isEmpty(confirmPassword)){
            if(password === confirmPassword){
                props.onConfirmPassword && props.onConfirmPassword(password)
                props.isPasswordValid && props.isPasswordValid(true)
            }else{
                props.isPasswordValid && props.isPasswordValid(false)
            }
        }else{
            props.isPasswordValid && props.isPasswordValid(false)
        }
    }, [password, confirmPassword, passwordValid])


  return (
    <View style={styles.container} >
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
        <WithHelperText value={confirmPassword} onChangeText={setConfirmPassword} label="Confirm Password" secureTextEntry={!viewConfirmPassword} container={{marginBottom: 20}} 
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
    </View>
  )
}

export default PasswordCreator
