import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { NativeStackScreenProps } from '@react-navigation/native-stack'
import { ManageResParamList } from '../../types'
import { makeStyles } from '@rneui/themed'
import MapScreen from '../Tabs/SearchScreen/MapScreen'

type Props = NativeStackScreenProps<ManageResParamList, "BookingDetails">

const useStyles = makeStyles((theme, props)=>{
    return {
        container: {
            width: "100%",
            height: "100%",
            backgroundColor: theme.colors.white
        }
    }
})

const BookingDetailsScreen = (props: Props) => {
    const styles = useStyles(props)
  return (
    <View style={styles.container} >
        <MapScreen
            navigation={props.navigation as any}
            route={{} as any}
            inReservation
        />
    </View>
  )
}

export default BookingDetailsScreen

const styles = StyleSheet.create({})