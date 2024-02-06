import { View } from 'react-native'
import React, { ReactNode } from 'react'
import { makeStyles, ThemeConsumer } from '@rneui/themed'
import { Input, InputProps, Text } from '@rneui/base'

interface IProps {
    fullWidth?: boolean;
    width?: number;
    helperText?: string | ReactNode; 
    helperOnPress?: () => void;
    container?: any
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
            fontWeight: "400", 
            fontFamily: "Lato_400Regular",
            color: theme.colors.grey3,
            width: props?.fullWidth ? "100%" : props?.width ? props.width : "auto",
            justifyContent: "center",
            
        },
        helperTextStyle: {
            fontSize: 14,
            lineHeight: 16,
            color: theme.colors.grey3,
            marginTop: 5,
            width: "100%",
            textAlign: "right",
            fontStyle: "italic",
            fontWeight: "500", fontFamily: "Lato_400Regular",

        },
        inputStyle: {
            borderWidth: 0,
            paddingVertical: 10,
            paddingHorizontal: 20,
            paddingLeft: 10,
            margin: 0,
            marginTop: 10,
            paddingTop: 5
        },
        inputContainerStyle: {
            borderBottomWidth: 0,
            margin: 0,
            marginTop: -2
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
            fontWeight: "700", fontFamily: "Lato_700Bold",
            fontSize: 16,
        }
    })
})

const WithHelperText = (props: Props) => {
    const styles = useStyles(props)
    const { fullWidth, width, helperText, helperOnPress, container, ref, ...rest } = props
  return (
    <ThemeConsumer>
        {({theme})=>(
            <View style={[styles.container, props.container]} >
                <Input
                secureTextEntry={props.secureTextEntry}
                inputContainerStyle={styles.inputContainerStyle}
                style={styles.style}
                errorStyle={styles.errorStyle}
                containerStyle={[styles.containerStyle, props.containerStyle]}
                placeholder={props.placeholder} 
                value={props.value} 
                defaultValue={props.defaultValue} 
                inputStyle={[styles.inputStyle, props.inputStyle]} 
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
                maxLength={props.maxLength}
                disabled={props?.disabled}
                {...rest}
                />
                { typeof props?.helperText !== "string" ? props?.helperText : <Text onPress={helperOnPress} style={{
                    ...styles.helperTextStyle,
                }} >{helperText}</Text>}
            </View>
        )}
    </ThemeConsumer>
  )
}

export default WithHelperText
