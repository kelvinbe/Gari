import { ActivityIndicator, StyleSheet, Text, View } from 'react-native'
import React, { useEffect } from 'react'
import { makeStyles, useTheme } from '@rneui/themed'
import { NativeStackScreenProps } from '@react-navigation/native-stack'
import { IReservation, UpcomingParamList } from '../../../types'
import { useAppDispatch, useAppSelector } from '../../../store/store'
import { modifyCurrentReservation, selectModifyReservationFeedback } from '../../../store/slices/bookingSlice'
import AsyncStorage from '@react-native-async-storage/async-storage'
import useBookingActions from '../../../hooks/useBookingActions'
import * as Linking from 'expo-linking'
import { isEmpty, isNull, uniqBy } from 'lodash'

type Props = NativeStackScreenProps<UpcomingParamList, "LoadingScreen"> 

const useStyles = makeStyles((theme, props) => {
    return {
        container: {
            flex: 1,
            backgroundColor: "white",
            alignItems: "center",
            justifyContent: "center"
        },
        text: {
            color: theme.colors.iconPrimary,
            fontSize: 16,
        },
        loadingContainer: {
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
        }
    }
})

const LoadingReservation = (props: Props) => {
 const styles = useStyles()   
 const { theme } = useTheme()
 const dispatch = useAppDispatch()
 const { bookingDetails } = useBookingActions()


 useEffect(()=>{
    const id = props.route.params?.reservation_id 
    if(id){
        // update the reservation status 
        dispatch(modifyCurrentReservation({
            status: "ACTIVE" // activate the reservation
        })).unwrap().then(async ()=>{
            const current_active_reservations_string = await AsyncStorage.getItem("activated_reservation_details") 
            let current_active_reservations: Array<Partial<IReservation>> = (!isEmpty(current_active_reservations_string) && !isNull(current_active_reservations_string)) ? JSON.parse(current_active_reservations_string) : []
            // add the current reservation to the list of activated reservations

            current_active_reservations?.push({
                id: id,
                vehicle_id: bookingDetails?.vehicle?.id || ""
            })

            current_active_reservations = uniqBy(current_active_reservations, ({vehicle_id})=> vehicle_id)

            await AsyncStorage.setItem("activated_reservation_details", JSON.stringify(current_active_reservations))
            // navigate to the upcoming screen
            props.navigation.navigate("ReservationDetails", {
                id: id,
                current: true,
            })
            // navigate to the manage reservation screen
            
        }).catch((e)=>{
            props.navigation.navigate("ErrorScreen", {
                reservation_id: id,
            })
        })
        // navigate back to the upcoming screen, shich will now only show info relevant to the current reservation 
    }else{
        // go back to the upcoming screen
        props.navigation.navigate("UpcomingReservationsHome")
    }
 }, [])

 return (
    <View style={styles.container} >
        <View style={styles.loadingContainer} >
            <Text style={styles.text}>Loading Reservation...</Text>
            <ActivityIndicator size={"large"} color={theme.colors.primary} />
        </View>
    </View>
  )
}

export default LoadingReservation
