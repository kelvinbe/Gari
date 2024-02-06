import React from 'react'
import { makeStyles, useTheme } from "@rneui/themed"
import { View } from 'react-native'
import { Text } from '@rneui/base'
import AlertCircle from "../../../../assets/icons/feather/alert-circle.svg"

const useStyles = makeStyles((theme, props)=>{
    return {
        container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: theme.colors.white,
        },
        errorText: {
            color: theme.colors.error,
            fontSize: 18,
            fontWeight: "700", 
            fontFamily: "Lato_700Bold",
        }
    }
})

function Error() {
    const styles = useStyles()
    const { theme } = useTheme()
  return (
    <View style={styles.container} >
        <AlertCircle width={50} height={50} stroke={theme.colors.error}  />
        <Text style={styles.errorText} >
           Oops! Something went wrong
        </Text>
    </View>
  )
}

export default Error