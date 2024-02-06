import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { BottomTabParamList, ManageResParamList } from '../../../types'
import { BottomTabBarProps, BottomTabScreenProps } from '@react-navigation/bottom-tabs'
import BaseTopBar from '../../../navigation/TopBar/BaseTopBar'
import { makeStyles } from '@rneui/themed'
import BookingDetailsScreen from '../../shared/BookingDetailsScreen'
import ManageResHomeScreen from './ManageResHomeScreen'

type Props = BottomTabScreenProps<BottomTabParamList, "ManageRes">

const ManageResStack = createNativeStackNavigator<ManageResParamList>()

const useStyles = makeStyles((theme, props)=>({
    container: {
        width: "100%",
        height: "100%",
    }
}))

const ManageResScreen = () => {
  return (
        <ManageResStack.Navigator initialRouteName='ManageResHome' >
            <ManageResStack.Screen 
                name="ManageResHome" 
                options={{
                    header: (props) => <BaseTopBar home {...props} title="Manage Reservations" />,
                }}
                component={ManageResHomeScreen} 
            />
            <ManageResStack.Screen 
                name="BookingDetails" 
                options={{
                    header: (props) => <BaseTopBar home={false} chevronLeft {...props} title="Booking Details" />,
                }}
                component={BookingDetailsScreen} 
            />
        </ManageResStack.Navigator>
    
  )
}

export default ManageResScreen

const styles = StyleSheet.create({})