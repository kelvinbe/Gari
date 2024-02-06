import { Text } from 'react-native'
import React from 'react'
import { makeStyles, useTheme } from '@rneui/themed'

interface Props {
    children?: string  | React.ReactNode,
    color?: string
}

const useStyles = makeStyles((theme, props: Props)=> {
    return ({
        textStyle: {
            fontSize: 10,
            fontWeight: "500", 
            fontFamily: "Lato_400Regular"
        }
})
})

const TabBarTitle = (props: Props) => {
    const styles = useStyles(props)
    const { theme } = useTheme()
  return (
    <Text style={[styles.textStyle, {
        color: props.color ? props.color : theme.colors.grey0
    }]} >
        {props.children}
    </Text>
  )
}

export default TabBarTitle
