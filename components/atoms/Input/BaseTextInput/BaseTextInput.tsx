import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { makeStyles, ThemeConsumer } from '@rneui/themed'
import { Input, InputProps } from '@rneui/base'

interface IProps {
    fullWidth?: boolean;
    width?: number;
}

type Props = IProps & InputProps;

const useStyles = makeStyles((theme, props: Props)=> {
    return ({
        containerStyle: {
            borderWidth: 1,
            borderColor: theme.colors.stroke,
            borderRadius: 32,
            padding: 0,
            margin: 0,
            fontSize: 16,
            lineHeight: 24,
            fontWeight: "400", fontFamily: "Lato_400Regular",
            color: theme.colors.grey3,
            width: props?.fullWidth ? "100%" : props?.width ? props.width : "auto",
            alignItems: "center",
            justifyContent: "center",
        },
        inputStyle: {
            borderWidth: 0,
            paddingVertical: 15,
            paddingHorizontal: 20,
            margin: 0
        },
        inputContainerStyle: {
            borderBottomWidth: 0,
            margin: 0,
            padding: 0,
            alignItems: "center",
            justifyContent: "center",
        },
        style: {
            borderWidth: 0,
            margin: 0,
            padding: 0,
        },
        errorStyle: {
            height: 0,
            margin: 0
        },
        container: {
            width: props?.fullWidth ? "100%" : props?.width ? props.width : "auto",
        },
        labelStyle: {
            marginTop: -26,
            color: theme.colors.black,
            width: "100%",
            fontWeight: "600", fontFamily: "Lato_400Regular",
            fontSize: 16,
        }
    })
})

const BaseTextInput = (props: Props) => {
    const styles = useStyles(props)
  return (
    <ThemeConsumer>
        {({theme})=>(
            <Input
            multiline
            numberOfLines={4}
            secureTextEntry={props.secureTextEntry}
            inputContainerStyle={styles.inputContainerStyle}
            style={styles.style}
            errorStyle={styles.errorStyle}
            containerStyle={[props.containerStyle,styles.containerStyle]}
            placeholder={props.placeholder} 
            value={props.value} 
            defaultValue={props.defaultValue} 
            inputStyle={styles.inputStyle} 
            placeholderTextColor={theme.colors.grey3}  
            onChangeText={props.onChangeText} 
            onBlur={props.onBlur} 
            onFocus={props.onFocus} 
            clearTextOnFocus={props.clearTextOnFocus} 
            underlineColorAndroid="transparent"
            rightIcon={props.rightIcon}
            leftIcon={props.leftIcon}
            rightIconContainerStyle = {props.rightIconContainerStyle }
            leftIconContainerStyle = {props.leftIconContainerStyle}
            label={props.label}
            labelStyle={[props.labelStyle, styles.labelStyle]}
            keyboardType={props.keyboardType}
            />
        )}
    </ThemeConsumer>
    
  )
}

export default BaseTextInput

const styles = StyleSheet.create({})