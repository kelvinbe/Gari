import { StyleSheet, Text, View } from 'react-native'
import React, {useRef} from 'react'
import BottomSheet from "@gorhom/bottom-sheet"
import { makeStyles, ThemeConsumer } from '@rneui/themed'
import Rounded from '../../../atoms/Buttons/Rounded/Rounded'
import RoundedOutline from '../../../atoms/Buttons/Rounded/RoundedOutline'
import useToast from '../../../../hooks/useToast';
import { useAppDispatch, useAppSelector } from '../../../../store/store'
import { modifyCurrentReservation, selectModifyReservationFeedback } from '../../../../store/slices/bookingSlice'
import useBookingActions from '../../../../hooks/useBookingActions'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { IReservation } from '../../../../types'

interface IProps {
    closeBottomSheet?: () => void;
}

type Props = IProps

const useStyles = makeStyles((theme, props: Props)=> {
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
            alignItems: "center"
        },
        contentTitleStyle: {
            fontWeight: "700", 
 fontFamily: "Lato_700Bold",
            fontSize: 20,
            marginBottom: 20
        },
        descriptionContainer: {
            width: "100%",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: 20
        },
        textStyle: {
            fontSize: 20,
            fontWeight: "400", fontFamily: "Lato_400Regular",
            color: theme.colors.black
        },
        bottomButtonsContainer: {
            width: "100%",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-around"
        }
    }
})

const CancelBookingBottomSheet = (props: Props) => {
    const toast = useToast();
    const { bookingDetails: { status, vehicle } } = useBookingActions()
    const bottomSheetRef = useRef<BottomSheet>(null)
    const snapPoints = ["30%"]
    const styles = useStyles(props)

    const dispatch = useAppDispatch()

    const close = () =>{
        bottomSheetRef.current?.close()
        props.closeBottomSheet && props.closeBottomSheet()
    }

    const feedback = useAppSelector(selectModifyReservationFeedback)

    const handleCancel =  () =>{
        dispatch(modifyCurrentReservation({
            status: status === "UPCOMING" ? "CANCELLED" : "COMPLETE"
        })).then(async ()=>{
            toast({
                message: status === "UPCOMING" ? "Booking cancelled" : "Booking completed",
                type: "success"
            })
            const currently_being_tracked_string = await AsyncStorage.getItem("activated_reservation_details")
            const parsed = JSON.parse(currently_being_tracked_string ?? "{}") 
            const filtered = parsed.filter((item: Partial<IReservation>)=> item?.vehicle_id !== vehicle?.id)
            await AsyncStorage.setItem("activated_reservation_details", JSON.stringify(filtered))
            close()
        }).catch((e)=>{
            toast({
                message: "Something went wrong",
                type: "error"
            })
            close()
        })
    }

    const handleClose = () =>{
        close()
    }

  return (
    <ThemeConsumer>
        {({theme})=>(
            <BottomSheet
                ref={bottomSheetRef}
                snapPoints={snapPoints}
                index={0}
                containerStyle={styles.backdropContainer}
                backgroundStyle={styles.backgroundStyle}
                enablePanDownToClose 
                onClose={props.closeBottomSheet}
            >
                <View style={styles.contentContainer} >
                    <Text style={styles.contentTitleStyle} >
                        Are you sure?
                    </Text>
                    <View style={styles.descriptionContainer} >
                            <Text style={styles.textStyle} >
                                {
                                    status === "UPCOMING" ? "You are about to cancel your booking" : "You are about to complete your booking"
                                }
                            </Text>
                    </View>
                    <View style={styles.bottomButtonsContainer} >
                        <RoundedOutline loading={feedback.loading} onPress={handleCancel} width="45%" >
                            {
                                status === "UPCOMING" ? "Cancel" : "Complete"
                            }
                        </RoundedOutline>
                        <Rounded onPress={handleClose} width="45%" >
                            {
                                status === "UPCOMING" ? "Keep" : "Back"
                            }
                        </Rounded>
                    </View>
                </View>
            </BottomSheet>
        )}
    </ThemeConsumer>
    
  )
}

export default CancelBookingBottomSheet
