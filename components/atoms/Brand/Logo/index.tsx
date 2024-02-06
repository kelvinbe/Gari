import { View, Text } from 'react-native'
import React from 'react'
import { Image, makeStyles } from '@rneui/themed'

interface IProps {
    width?: number, 
    height?: number
}

type Props = IProps

const useStyles = makeStyles((theme, props: Props)=>{
    return {
        container: {
            width: "100%",
            alignItems: "center",
            justifyContent: "center"
        }
    }
})

const Logo = (props: Props) => {
    const styles = useStyles(props)
    const { height, width} = props 
  return (
    <View
        style={styles.container}
    >
        <Image
            source={require("../../../../assets/images/logo.png")}
            style={{
                width:  height ?? 100,
                height: width ?? 100,
            }}
            resizeMode="contain"
        />
    </View>
  )
}

export default Logo