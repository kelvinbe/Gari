import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { makeStyles, ThemeConsumer } from '@rneui/themed'
import LocationMarkerIcon from '../../../../assets/icons/location-marker.svg'
import { LocationObjectCoords } from 'expo-location'
import { Marker } from 'react-native-maps'
import ChevronDown from "../../../../assets/icons/chevron-down.svg"
import { useAppSelector } from '../../../../store/store'
import { selectCoords } from '../../../../store/slices/searchSlice'
import { Image } from 'react-native'

interface IProps {
    location?: LocationObjectCoords,
    title?: string,
    description?: string,
}

type Props = IProps;

const useStyles = makeStyles((theme, props: Props)=>({
    container: {

    },
    marker: {
        position: "relative",
        width: 80,
        height: 100,
        alignItems: "center",
        justifyContent: "center"
    },
    currentLocation: {
        width: 8,
        height: 8,
        borderRadius: 4,
        borderWidth: 2,
        borderColor: theme.colors.white
    },
    pin: {
        position: "absolute",
        bottom: -12
    },
    tooltip: {
        backgroundColor: theme.colors.primary,
        paddingVertical: 5,
        paddingHorizontal: 10,
        borderRadius: 25,
        position: "relative",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        marginBottom: 10
    },
    tooltipText: {
        fontSize: 16,
        fontWeight: "700", 
 fontFamily: "Lato_700Bold",
        color: theme.colors.white,
        textAlign: "center"
    },
    tooltipPointer: {
        position: "absolute",
        bottom: 0,
        left: 20

    }
}))

const LocationMarker = (props: Props) => {
    const {data: coords} = useAppSelector(selectCoords)
    const styles = useStyles(props)

  return (
    <ThemeConsumer>
        {({theme})=>(
            <Marker
                coordinate={{
                    latitude: coords?.latitude || 0,
                    longitude: coords?.longitude || 0,
                }}
                style={styles.marker}
                title={props.title}
                description={props.description}
                anchor={{x: 0.5, y: 0.5}}
            >
                    <Image
                        source={require("../../../../assets/images/location-pin.png")}
                    />
            </Marker>
        )}
    </ThemeConsumer>
    
  )
}

export default LocationMarker

const styles = StyleSheet.create({})