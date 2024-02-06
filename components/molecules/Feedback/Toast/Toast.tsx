import { TouchableOpacity, Text, View, Animated } from 'react-native'
import React, { useEffect, useRef } from 'react'
import { makeStyles, Colors, ThemeConsumer } from '@rneui/themed'
import { IToast } from '../../../../types'
import CheckCircle from "../../../../assets/icons/feather/check-circle.svg"
import XCircle from "../../../../assets/icons/feather/x-circle.svg"
import AlertCircle from "../../../../assets/icons/feather/alert-circle.svg"
import Info from "../../../../assets/icons/feather/info.svg"
import XIcon from "../../../../assets/icons/feather/x.svg"
import { useDispatch } from 'react-redux'
import { removeMessage } from '../../../../store/slices/notificationsSlice'

type Props = IToast 

const renderIcon = (type: string, colors?: Colors ) => {
    switch (type) {
        case "success":
            return <CheckCircle stroke={colors?.success} width={24} height={24} />
        case "error":
            return <XCircle stroke={colors?.error} width={24} height={24}  />
        case "warning":
            return <AlertCircle stroke={colors?.warning} width={24} height={24}  />
        case "primary":
            return <Info stroke={colors?.primary} width={24} height={24} />
        default:
            return <Info stroke={colors?.primary} width={24} height={24} />
    }
}

const useStyles = makeStyles((theme, props: Props)=>{
    return ({
        container: {
            backgroundColor: theme.colors.white,
            paddingHorizontal: 20,
            paddingVertical: 15,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            borderRadius: 14,
            width: "100%",
            elevation: 3,
        },
        leftContainer: {
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "flex-start",
        },
        messageContainer: {
            alignItems: "flex-start",
            justifyContent: "center",
            marginLeft: 10
        },
        titleStyle: {
            fontSize: 16,
            fontWeight: "500", fontFamily: "Lato_400Regular",
            color: theme.colors?.[props?.type || "primary"],
        },
        messageStyle: {
            fontSize: 16,
            fontWeight: "600", fontFamily: "Lato_400Regular",
            color: theme.colors?.[props?.type || "primary"]

        },
        iconButton: {
            width: 24,
            height: 24,
            alignItems: "center",
            justifyContent: "center",
        }
    })
})

const Toast = (props: Props) => {
    const styles = useStyles(props)
    const dispatch = useDispatch()

    const onClose = () =>{
        dispatch(removeMessage(props.id))
    }
    const opacity = useRef(new Animated.Value(0)).current


    useEffect(()=>{
    Animated.sequence([
        Animated.timing(opacity, {
            toValue: 1,
            duration: 500,
            useNativeDriver: true
        }),
        Animated.delay(props?.duration || 3000),
        Animated.timing(opacity, {
            toValue: 0,
            duration: 500,
            useNativeDriver: true
        })
    ]).start(()=>{
        onClose()
    })
    }, [])
  return (
    <ThemeConsumer>
        {({theme})=>(
            <Animated.View style={[styles.container, {
                opacity,
                transform: [
                    {
                        translateY: opacity.interpolate({
                            inputRange: [0, 1],
                            outputRange: [-100, 0]
                        })
                    }
                ]
            }]} >
                <View style={styles.leftContainer} >
                    {renderIcon(props.type, theme.colors)}
                    <View style={styles.messageContainer} >
                        {
                            props.title && <Text style={styles.titleStyle} >{props.title}</Text>
                        }
                        <Text style={styles.messageStyle} >{props.message}</Text>
                    </View>
                </View>
                <TouchableOpacity
                    style={styles.iconButton}
                    onPress={onClose}
                >
                    <XIcon 
                        stroke={theme.colors.greyOutline}
                        width={24}
                        height={24}
                    />
                </TouchableOpacity>
            </Animated.View>
        )}
    </ThemeConsumer>
    
  )
}

export default Toast
