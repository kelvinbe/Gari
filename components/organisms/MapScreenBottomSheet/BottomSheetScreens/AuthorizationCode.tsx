import { StyleSheet, Text, View, KeyboardAvoidingView, Platform, ActivityIndicator } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet"
import { makeStyles, ThemeConsumer } from '@rneui/themed'
import Rounded from '../../../atoms/Buttons/Rounded/Rounded'
import useBookingActions from '../../../../hooks/useBookingActions'
import { useAuthCode } from '../../../../hooks'
import useToast from '../../../../hooks/useToast'
import { isEmpty } from 'lodash'
import WithHelperText from '../../../atoms/Input/WithHelperText/WithHelperText'

interface IProps {
    closeBottomSheet?: () => void
}

type Props = IProps

const useStyles = makeStyles((theme, props: Props) => {
    return {
        container: {

        },
        backdropContainer: {
            backgroundColor: "rgba(0, 0, 0, 0.3)",
        },
        backgroundStyle: {
            width: "100%",
            height: "100%",
            backgroundColor: theme.colors.white,
        },
        contentContainer: {
            width: "100%",
            height: "100%",
            padding: 20,
            textAlign: "center",
            justifyContent: 'space-between'
        },
        contentTitleStyle: {
            width: "100%",
            fontWeight: "700",
            fontFamily: "Lato_700Bold",
            fontSize: 20,
            marginBottom: 20,
            textAlign: "center",
        },
        cardsContainer: {
            width: "100%",
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
            color: theme.colors.link,
        },
        errorText: {
            color: theme.colors.error,
            fontSize: 14,
            fontWeight: "400",
            fontFamily: "Lato_400Regular",
        }
    }
})

const AuthorizationBottomSheet = (props: Props) => {
    const bottomSheetRef = useRef<BottomSheet>(null)
    const snapPoints = ["40%"]
    const styles = useStyles(props)
    const [verificationInput, setVerificationInput] = useState<string>("")

    const { bookingDetails: { vehicle, code }, setAuthCode } = useBookingActions()

    const { requestAuthCode, requestAuthCodeResponse, verifyAuthCode, verifyAuthCodeResponse } = useAuthCode()


    const toast = useToast()

    const close = () => {
        bottomSheetRef.current?.close()
        props.closeBottomSheet && props.closeBottomSheet()
    }

    const handleVerify = async () => {
        verifyAuthCode(verificationInput).then((code)=>{
            setAuthCode(code)
            close()
        }).catch(()=>{
            toast({
                type: "error",
                message: "Check the authcode provided and try again"
            })
        })
    }

    const handleRequestAuthCode = async () => {
        vehicle?.user_id && vehicle?.id && await requestAuthCode({
            host_id: vehicle?.host?.id,
            vehicle_id: vehicle.id
        })
    }

    useEffect(()=>{
        if(!isEmpty(requestAuthCodeResponse.error)) {
            toast({
                type: "error",
                message: "Unable to send auth code request, please try again later"
            })
        }
    }, [requestAuthCodeResponse.error])

    return (
        <ThemeConsumer>
            {({ theme }) => (
                <BottomSheet
                    ref={bottomSheetRef}
                    snapPoints={snapPoints}
                    index={0}
                    containerStyle={styles.backdropContainer}
                    backgroundStyle={styles.backgroundStyle}
                    enablePanDownToClose
                    onClose={props.closeBottomSheet}
                >
                    <BottomSheetView
                        style={{
                            flex: 1
                        }}
                    >
                        {
                            <KeyboardAvoidingView
                                behavior={
                                    Platform.OS === "ios" ? "padding" : "height"
                                }
                                style={styles.contentContainer} >
                                <Text style={styles.contentTitleStyle} >
                                    Authorization Code
                                </Text>
                                <View style={styles.cardsContainer} >
                                    <WithHelperText
                                        placeholder='Enter Authorization code'
                                        value={verificationInput}
                                        onChangeText={setVerificationInput}
                                        maxLength={6}
                                        helperText={
                                        verifyAuthCodeResponse.error &&
                                            <Text style={styles.errorText} >
                                                Code not valid
                                            </Text>
                                        }
                                    />
                                    <Rounded
                                        loading={verifyAuthCodeResponse.loading}
                                        onPress={handleVerify} >
                                        {(!isEmpty(verifyAuthCodeResponse.data) && verificationInput.length === 6) ? "Done" : "Verify"}
                                    </Rounded>
                                </View>
                                <View style={styles.bottomTextContainer} >
                                    {
                                        requestAuthCodeResponse.loading &&
                                        <ActivityIndicator
                                            size="small"
                                            color={theme.colors.primary}
                                        />
                                    }
                                    <Text style={styles.leftText} >
                                        Don't have a code?
                                    </Text>
                                    <Text style={styles.rightText} onPress={handleRequestAuthCode} >
                                        Ask for One
                                    </Text>
                                </View>
                            </KeyboardAvoidingView>
                        }
                    </BottomSheetView>
                </BottomSheet>
            )}
        </ThemeConsumer>

    )
}

export default AuthorizationBottomSheet

const styles = StyleSheet.create({})