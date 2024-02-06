import { Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { NativeStackScreenProps } from '@react-navigation/native-stack'
import { UpcomingParamList } from '../../../types'
import { makeStyles } from '@rneui/themed'

type Props = NativeStackScreenProps<UpcomingParamList, "ErrorScreen">

const useStyles = makeStyles((theme, props)=>{
    return { 
        container: {
            flex: 1,
            backgroundColor: "white",
            alignItems: "center",
            justifyContent: "center",
        },
        text: {
            color: theme.colors.primary,
            fontSize: 16,
            fontWeight: "600",
        }
    }
})

const ErrorScreen = (props: Props) => {

    const styles = useStyles()

    const onPress = () => {
        props.navigation.navigate("UpcomingReservationsHome")
    }


  return (
    <View style={styles.container} >
        <Text style={styles.text} >
            Unable to update your reservation. Please try again later.
        </Text>
        <TouchableOpacity onPress={onPress} >
            <Text style={styles.text} >
                Try again
            </Text>
        </TouchableOpacity>
    </View>
  )
}

export default ErrorScreen
