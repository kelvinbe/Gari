import { StyleSheet, Text, View, TouchableOpacity, StyleProp, ViewStyle, Animated } from 'react-native'
import React, { useEffect, useState } from 'react'
import { makeStyles, ThemeConsumer, Image } from '@rneui/themed'
import LocationDirection from "../../../assets/icons/direction.svg"
import { IVehicle, SearchScreenParamList } from '../../../types'
import { NavigationProp, useNavigation } from '@react-navigation/native'
import { first } from 'lodash'
import { constructVehicleName, trimVehicleName } from '../../../utils/utils'
interface IProps {
    customContainerStyle?: StyleProp<ViewStyle>;
    onPress?: () => void;
    opacity?: Animated.AnimatedInterpolation<string | number>;
    scale?: Animated.AnimatedInterpolation<string | number>;
    translateY?: Animated.AnimatedInterpolation<string | number>;
    index?: number;
}

type Props = IProps & IVehicle

const useStyles = makeStyles((theme, props: Props)=>{
    return {
        container: {
            padding: 10,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            backgroundColor: theme.colors.white,
            borderRadius: 15,
            // elevation: 4,
            width: "100%"
        },
        carImageContainer: {
            width: 80,
            height: 80,
            borderRadius: 40,
            marginRight: 10,
        },
        carImage: {
            width: 80,
            height: 80,
            resizeMode: 'cover',
            borderRadius: 40,
        },
        leftContainer:{ 
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "flex-start",
        },
        driveInfoContainer: {
            alignItems: "flex-start",
            justifyContent: "flex-start"
        },
        driveInfoText: {
            fontWeight: "700", 
            fontFamily: "Lato_700Bold",
            fontSize: 16,
            marginBottom: 5
        },
        driverInfoContainer: {
            flexDirection: "row",
            alignItems: "flex-end",
            justifyContent: "flex-start",
            marginBottom: 5
        },
        driverAvatarStyle: {
            width: 30,
            height: 30,
            resizeMode: "cover",
            borderRadius: 15,

        },
        driverNameText: {
            fontWeight: "700", 
            fontFamily: "Lato_700Bold",
            fontSize: 14,
            textAlign: "left",
            marginLeft: 5
        },
        locationContainer: {
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "flex-start",
        },
        locationIconStyle: {
            marginRight: 5
        },
        locationText: {
            fontWeight: "600", 
            fontFamily: "Lato_400Regular",
            fontSize: 12,
            textAlign: "left",
        },
        amountStyle: {
            fontWeight: "700", 
            fontFamily: "Lato_700Bold",
            fontSize: 16,
        }
    }
})

const DriveCardButton = (props: Props) => {
    const [is05, set_is05] = useState(false)
    const navigation = useNavigation<NavigationProp<SearchScreenParamList, "MapScreen">>()
    
    props?.opacity?.addListener(({value})=>{
        if(value?.toString()?.includes(".")){
            set_is05(true)
        }else{
            set_is05(false)
        }
    })


  const styles = useStyles()

  return (
    <ThemeConsumer>
        {({theme})=>(
            <Animated.View style={[styles.container, props.customContainerStyle, {
                zIndex: is05 ? 1 : 5,
                elevation: is05 ? 5 : 1,
                transform: [
                    {
                        scale: props.scale || 1,
                    },
                    {
                        translateY: props.translateY || 0
                    }
                ],
                opacity: props.opacity || 1
            } ]} >
                <TouchableOpacity onPress={props.onPress} style={styles.leftContainer} >
                    <View style={styles.carImageContainer} >
                        <Image style={styles.carImage} source={{uri: first(props?.pictures) ?? ""}}/>
                    </View>
                    <View style={styles.driveInfoContainer} >
                        <View style={styles.driverInfoContainer} >
                            <View style={styles.driverAvatarStyle} >
                                <Image style={styles.driverAvatarStyle} source={{
                                    uri: props?.host?.profile_pic_url ?? undefined
                                }} />
                            </View>
                            <Text style={styles.driverNameText} >
                                {
                                    `${props?.host?.handle}`
                                }
                            </Text>
                        </View>
                        <Text style={styles.driveInfoText} >
                            {
                                trimVehicleName(
                                    constructVehicleName(
                                        props?.make,
                                        props?.model,
                                        props?.year
                                    )
                                )
                            }
                        </Text>
                        <Text style={styles.amountStyle} >
                            {props?.hourly_rate} {props?.host?.market?.currency} /hr
                        </Text>
                    </View>
                </TouchableOpacity>
                <TouchableOpacity onPress={props.onPress} >
                        <View style={styles.locationContainer} >
                            <LocationDirection 
                                height={12}
                                width={12}
                                style={styles.locationIconStyle}
                            />
                            {/* <Text style={styles.locationText} >
                                2km
                            * @todo: In addition to returning the cehicle data, add the calculated distance from customer
                            </Text> */}
                        </View>
                </TouchableOpacity>
            </Animated.View>
        )}
    </ThemeConsumer>
    
  )
}

export default DriveCardButton
