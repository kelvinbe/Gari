import { StyleSheet, Text, View, KeyboardAvoidingView, Platform, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import { makeStyles, ThemeConsumer } from '@rneui/themed'
import { NativeStackScreenProps } from '@react-navigation/native-stack'
import { ProfileScreenParamList } from '../../../types'
import BaseInput from '../../../components/atoms/Input/BaseInput/BaseInput'
import Rounded from '../../../components/atoms/Buttons/Rounded/Rounded'
import { Image } from '@rneui/base'
import CameraIcon from "../../../assets/icons/camera.svg"
import Loading from '../../../components/molecules/Feedback/Loading/Loading'
import { Profile } from '../../../hooks/useEditProfile';
import { _setEmail, _setName, _setPictureUrl } from '../../../store/slices/editProfileSlice'
import * as ImagePicker from 'expo-image-picker';
import { useAppDispatch, useAppSelector } from '../../../store/store'
import { selectUpdateProfile, selectUserProfile, updateUserData } from '../../../store/slices/userSlice'
import { isEmpty, isEqual, last } from 'lodash'
import Error from '../../../components/molecules/Feedback/Error/Error'
import useToast from '../../../hooks/useToast'
import { uploadToFirebase } from '../../../utils/utils'


type Props = NativeStackScreenProps<ProfileScreenParamList, "ProfileScreenEdit">

const useStyles = makeStyles((theme, props: Props)=>({
    container: {
        width: "100%",
        height: "100%",
        backgroundColor: theme.colors.white,
        alignItems: "center",
    },
    contentContainer: {
        width: "90%",
        height: "80%",
        alignItems: "center",
        justifyContent: "flex-start"
    },
    topImageContainer: {
        width: "100%",
        alignItems: "center",
        justifyContent: "center",
        marginBottom: 20
    },
    inputContainerStyle: {
        width: "100%",
    },
    baseInputStyle: {
        marginBottom: 45
    },
    bottomContainer: {
        width: "90%",
        height: "20%",
        alignItems: "center",
        justifyContent: "center",
    },
    avatarSection: {
        position: "relative",
        width: 76,
        height: 76,
        borderColor: theme.colors.background,
        alignItems: "center",
        justifyContent: "center",
        elevation: 4,
        borderRadius: 35,
        borderWidth: 3,
    },
    avatarContainer: {
        width: 70,
        height: 70,
        borderRadius: 35,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: theme.colors.background,
        overflow: "hidden"
    },
    changeImageContainer: {
        position: "absolute",
        top: 0,
        right: -15,
        width: 30,
        height: 30,
        borderRadius: 15,
        backgroundColor: theme.colors.white,
        borderColor: theme.colors.primary,
        alignItems: "center",
        justifyContent: "center",
        borderWidth: 2
    },
    handleText: {
        fontSize: 16,
        fontWeight: "bold",
        color: theme.colors.primary,
        marginVertical: 10,
        fontFamily: "Lato_700Bold"
    }
}))

const ProfileScreenEdit = (props: Props) => {
    const styles = useStyles(props)
    const userProfile = useAppSelector(selectUserProfile)
    const [fname, setFName] = useState(userProfile?.fname);
    const [lname, setLName] = useState(userProfile?.lname);
    const [email, setEmail] = useState(userProfile?.email);
    const [pictureUrl, setPictureUrl] = useState(userProfile?.profile_pic_url);
    const feedback = useAppSelector(selectUpdateProfile)
    const toast = useToast()

    const dispatch = useAppDispatch()

    
    const chooseProfilePic = async () => {
        ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
          }).then((result)=>{
            if(!result.canceled){
              if(result.canceled) return toast({
                message: "Image upload cancelled",
                type: "error"
            })
            if(!isEmpty(result?.assets)){
                Promise.all(result.assets.map((asset)=>{
                    return uploadToFirebase(asset.uri, asset.fileName ?? Date.now().toString(), "image/jpeg").then((url)=>url).catch((e)=>{
                        /**
                         * @todo logrocket for upload error
                         */
                        toast({
                            message: "Image upload failed",
                            type: "error"
                        })
                        return null
                    })
                })).then((urls)=>{
                    const filteredUrls = urls.filter((url)=>!isEmpty(url)) as string[]
                    setPictureUrl(last(filteredUrls))
                }).catch((e)=>{
                    // error toasts have already been displayed
                    // add logrocket implementation
                })
              } 
            }
          }).catch((e)=> {
            toast({
              type: "error",
              message: "Error choosing picture",
              title: "Error"
            })
          })
    };

    const update = () =>{
        dispatch(updateUserData({
            fname: !isEqual(fname, userProfile?.fname) ? fname : undefined,
            lname: !isEqual(lname, userProfile?.lname) ? lname : undefined,
            email: !isEqual(email, userProfile?.email) ? email : undefined,
            profile_pic_url: !isEqual(pictureUrl, userProfile?.profile_pic_url) ? pictureUrl : undefined
        }))
    }
  return (feedback?.loading ? <Loading /> : feedback?.error ? <Error/> :
    <ThemeConsumer>
        {({theme}) => (
            <KeyboardAvoidingView behavior={
                Platform.OS === "ios" ? "padding" : "height"
            } style={styles.container} >
                <View style={styles.contentContainer} >
                    <View style={styles.topImageContainer} >
                        <View style={styles.avatarSection} >
                            <View style={styles.avatarContainer} >
                                <Image source={{
                                    uri: pictureUrl ?? undefined
                                }} style={{width: 70, height: 70}} />
                            </View>
                            <TouchableOpacity style={styles.changeImageContainer} onPress={chooseProfilePic} >
                                <CameraIcon stroke={theme.colors.primary} width={16} height={12} />
                            </TouchableOpacity>
                        </View>
                        <Text style={styles.handleText} >
                            {
                                userProfile?.handle
                            }
                        </Text>
                    </View>
                    <View style={styles.inputContainerStyle} >
                        <BaseInput
                            value={fname ?? ""}
                            onChangeText={setFName}
                            label="First Name"
                            placeholder="John"
                            containerStyle={styles.baseInputStyle}
                        />
                        <BaseInput
                            value={lname ?? ""}
                            onChangeText={setLName}
                            label="Last Name"
                            placeholder="Doe"
                            containerStyle={styles.baseInputStyle}
                        />
                        <BaseInput  value={email} onChangeText={setEmail} label="Email" placeholder='email' containerStyle={styles.baseInputStyle}  />
                    </View>
                </View>
                <View style={styles.bottomContainer} >
                    <Rounded onPress={update}>
                        Save Changes
                    </Rounded>
                </View>
                
            </KeyboardAvoidingView>
        )}
    </ThemeConsumer>
    
  )
}

export default ProfileScreenEdit

const styles = StyleSheet.create({})