import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { makeStyles, useTheme } from '@rneui/themed'
import { Icon } from '@rneui/base'

interface IProps {
    emptyText?: string
}

type Props = IProps

const useStyles = makeStyles((theme, props: Props)=>{
    return {
        container: {
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: theme.colors.white,
            width: "100%"
        },
        emptyText: {
            fontSize: 20,
            color: theme.colors.grey3,
            fontWeight: "400",
            fontFamily: "Lato_400Regular",
            marginTop: 20
        }
    }
})

const Empty = (props: Props) => {
    const styles = useStyles(props)
    const { theme } = useTheme()
  return (
    <View style={styles.container} >
        <Icon
            type="feather"
            name="archive"
            size={50}
            color={theme.colors.grey3}
        />
        <Text style={styles.emptyText} >
            {
                props.emptyText ? props.emptyText : "Nothing yet!"
            }
        </Text>
    </View>
  )
}

export default Empty

const styles = StyleSheet.create({})