import { StyleSheet, StyleProp, ViewStyle, TouchableOpacity, ActivityIndicator } from 'react-native'
import React from 'react'
import { ButtonProps, makeStyles } from '@rneui/themed'
import { Text } from '@rneui/base';
import { useTheme } from '@rneui/themed';

interface IProps {
    fullWidth?: boolean;
    width?: number | string;
    customStyle?: StyleProp<ViewStyle>
}

type Props = IProps & ButtonProps;

const useStyles = makeStyles((theme, props: Props)=> {
    return ({
        buttonStyle: {
            borderRadius: 25,
            paddingVertical: 13,
            paddingHorizontal:  20,
            alignItems: 'center',
            justifyContent: 'center',
            overflow: 'hidden',
            borderColor: theme.colors.primary,
            borderWidth: 1
        },
        titleStyle: {
            color: theme.colors.primary,
            fontSize: 20,
            fontWeight: '700',
            fontFamily: "Lato_700Bold",
            lineHeight: 24,
            textAlign: "center",
            width: '100%',
        },
        containerStyle: {
            width: props?.fullWidth ? '100%' : props?.width ? props?.width : 'auto',
        }
    })
})

const RoundedOutline = (props: Props) => {
    const styles = useStyles(props)
    const { theme } = useTheme()
  return (
    <TouchableOpacity
        style={[styles.buttonStyle, styles.containerStyle , props.customStyle]}
        onPress={props.onPress}
    >
        {
            props.loading ? <ActivityIndicator color={theme.colors.primary}  size="large" /> : <Text style={styles.titleStyle} >
                {props.children}
            </Text>
        }
        
    </TouchableOpacity>
  )
}

export default RoundedOutline

const styles = StyleSheet.create({})