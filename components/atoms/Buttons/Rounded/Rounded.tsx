import { StyleSheet, ViewStyle, StyleProp} from 'react-native'
import React from 'react'
import { makeStyles } from '@rneui/themed'
import { Button, ButtonProps } from '@rneui/base';


interface Props {
    children?: string
    fullWidth?: boolean;
    disabled?: boolean;
    loading?: boolean;
    width?: number | string;
    customStyle?: StyleProp<ViewStyle>
}

const useStyles = makeStyles((theme, props: Props)=>{
    return ({
        buttonStyle: {
            backgroundColor: (props.disabled || props?.loading) ? theme.colors.disabled : theme.colors.primary,
            borderRadius: 25,
            paddingTop: 13,
            paddingHorizontal:  20,
            alignItems: 'center',
            justifyContent: 'center',
            overflow: 'hidden',
            elevation: 0,
        },
        titleStyle: {
            color: theme.colors.white,
            fontSize: 20,
            fontWeight: '700',
            fontFamily: "Lato_700Bold",
            lineHeight: 24,
            textAlign: "center",
            width: '100%',
        },
        containerStyle: {
            width: props?.fullWidth ? '100%' : props?.width ? props?.width  : 'auto',
            elevation: 0,
        }
    })
})

const Rounded = (props: Props & ButtonProps) => {
  const styles = useStyles(props)
  return (
    <Button containerStyle={[styles.containerStyle, props.customStyle]} 
    disabled={props.disabled} 
    loading={props?.loading} 
    onPress={props.onPress} 
    buttonStyle={styles.buttonStyle} 
    titleStyle={styles.titleStyle} 
    disabledTitleStyle={styles.titleStyle}  
    title={props.children} />
  )
}

export default Rounded

const styles = StyleSheet.create({})