import { Text } from '@rneui/base'
import { makeStyles } from '@rneui/themed'
import React from 'react'
import { View, StyleProp } from "react-native"

interface IProps {
    children?: string,
    style?: StyleProp<any>
}
type Props = IProps
const useStyles = makeStyles((theme, props: Props)=>{
    return ({
        container: {
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
        },
        divider: {
            height: 1,
            backgroundColor: theme.colors.primary,
            width: props.children ? "40%" : "100%",
        },
        text: {
            color: theme.colors.primary,
            fontSize: 12,
            fontWeight: '700',
            fontFamily: "Lato_700Bold",
            lineHeight: 14,
            textAlign: "center",
            paddingHorizontal: 10,
        }

    })
})

function Divider(props: Props) {
    const styles = useStyles(props)
  return (
    <View  style={[styles.container, props.style]} >
        <View style={styles.divider} ></View>
        {props.children && <Text style={styles.text}>{props.children}</Text>}
        {
            props.children && <View style={styles.divider}></View>
        }
    </View>
  )
}

export default Divider