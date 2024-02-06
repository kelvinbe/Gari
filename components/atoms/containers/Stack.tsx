import { makeStyles } from '@rneui/themed'
import { StyleProp, StyleSheet, Text, View, ViewStyle } from 'react-native'

interface IProps {
    styles?: StyleProp<ViewStyle>
    align?: "center" | "flex-start" | "flex-end",
    justify?: "center" | "flex-start" | "flex-end",
    children?: React.ReactNode
}

type Props = IProps

const useStyles = makeStyles((theme, props: Props)=> {
    return {
        container: {
            alignItems: props.align ?? "center",
            justifyContent: props.justify ?? "flex-start",
            width: "100%"
        }
    }
})

const Stack = (props: Props) => {
    const styles = useStyles(props)
  return (
    <View style={[styles.container, props.styles]} >
        {
            props.children
        }
    </View>
  )
}

export default Stack

const styles = StyleSheet.create({})