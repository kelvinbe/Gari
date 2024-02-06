import { StyleSheet, Text, View } from 'react-native'
import React, { useReducer, useEffect, useState } from 'react'
import { makeStyles } from '@rneui/themed';
import BaseInput from '../../../components/atoms/Input/BaseInput/BaseInput';
import Rounded from '../../../components/atoms/Buttons/Rounded/Rounded';
import { Icon } from '@rneui/base';
import { auth } from '../../../firebase/firebaseApp';
import { createSlice } from '@reduxjs/toolkit';
import useUserAuth from '../../../hooks/useUserAuth';
import PasswordCreator from '../../../components/organisms/input/PasswordCreator.tsx/PasswordCreator';
import Loading from '../../../components/molecules/Feedback/Loading/Loading';
import { isEmpty } from 'lodash';
import useToast from '../../../hooks/useToast';
import { _set_new_password, _toggle_current_password, _set_current_password, selectCurrentPassword, selectCurrentPasswordIsVisible, selectNewPassword } from '../../../store/slices/settingsSlice';
import { useSelector, useDispatch } from 'react-redux';

interface  IProps  {}

type Props = IProps;

const useStyles = makeStyles((theme, props: Props)=>({
    container: {
        width: "100%",
        height: "100%",
        backgroundColor: theme.colors.white,
        alignItems: "center",
        justifyContent: "space-between",
    },
    topSectionContainer: {
        width: "90%",
        paddingTop: 50
    },
    bottomSectionContainer: {
        width: "90%",
        height: "20%",
        alignItems: "center",
        justifyContent: "center",
    },
    providersSection: {
        width: "100%",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center"
    },
    infoText: {
        fontSize: 18,
        fontWeight: "400",
        fontFamily: "Lato_400Regular",
        textAlign: "center",
        marginBottom: 50,
        width: "80%"
    },
    generalText: {
        fontSize: 20,
        fontWeight: "400",
        fontFamily: "Lato_400Regular",
        color: theme.colors.primary,
        textAlign: "center"
    }
}))



const ProfileSettingsScreen = (props: Props) => {
    const styles = useStyles(props)
    const [isPasswordValid, setIsPasswordValid] = useState(false)
    const currentPasswordIsVisible = useSelector(selectCurrentPasswordIsVisible)
    const currentPassword = useSelector(selectCurrentPassword)
    const newPassword = useSelector(selectNewPassword)
    const dispatch = useDispatch()


    const toast = useToast()
    const { userAuthProviders, loadingPasswordUpdate, passwordUpdateError, updateUserPassword, hasPasswordChanged } = useUserAuth()




    const toggleCurrentPasswordVisibility = () => {
        dispatch(_toggle_current_password())
    }
    const setCurrentPassword = (text: string) => {
        dispatch(_set_current_password(text))
    }

    const setNewPassword = (text: string) => {
        dispatch(_set_new_password(text))
    }

    useEffect(()=>{
        if(!isEmpty(passwordUpdateError)){
            toast({
                message: passwordUpdateError,
                type: "error",
                duration: 4000,
                title: "Password Reset"
            })
        }
    }, [passwordUpdateError])

    const confirmChange = () =>{
        updateUserPassword(newPassword, currentPassword)
    }

  return (
    loadingPasswordUpdate ? ( 
    <Loading/>
    ) : hasPasswordChanged ? ( 
    <View style={[styles.container, {alignItems: "center", justifyContent: "center"}]}  > 
        <Text style={styles.generalText} >
            Password Changed
        </Text> 
    </View>
    ) : (
    <View style={styles.container} >
        <View style={styles.topSectionContainer} >
            {
                userAuthProviders?.includes("password") ? (
                    <BaseInput secureTextEntry={!currentPasswordIsVisible} onChangeText={setCurrentPassword} label="Current Password" containerStyle={{
                        marginBottom: 50
                    }} placeholder="Current Password" rightIcon={
                        <Icon onPress={toggleCurrentPasswordVisibility} name={currentPasswordIsVisible ? "eye" : "eye-slash"}  type="font-awesome" />
                    } />
                ) : (
                    <View style={styles.providersSection} >
                        <Text style={styles.infoText} > You haven't yet set a password, create one. </Text>
                    </View>
                )
            }
            <PasswordCreator
                onConfirmPassword={setNewPassword}
                isPasswordValid={setIsPasswordValid}
            />
        </View>
        <View 
            style={styles.bottomSectionContainer}
        >
            <Rounded disabled={!isPasswordValid || (userAuthProviders?.includes("password") ? !(currentPassword?.length  >= 8) : false)} onPress={confirmChange} >
                {
                    userAuthProviders?.includes("password") ? "Update Password" : "Create Password"
                }
            </Rounded>
        </View>
    </View>)
  )
}

export default ProfileSettingsScreen

const styles = StyleSheet.create({})