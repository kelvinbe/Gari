import { StyleSheet } from 'react-native'
import React from 'react'
import { makeStyles } from '@rneui/themed'
import { LocationObjectCoords } from 'expo-location'
import { Marker } from 'react-native-maps'
import { Image } from 'react-native'
import { IVehicle } from '../../../../types'

interface IProps extends Partial<LocationObjectCoords> {
    data?: Partial<IVehicle>
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

const VehicleMarker = (props: Props) => {
    const { latitude, longitude} = props
    const styles = useStyles(props)

  return (
    <Marker
        coordinate={{
            latitude: latitude || 0,
            longitude: longitude || 0,
        }}
        // tracksViewChanges={false}
        style={styles.marker}
        // title={data?.station?.name ?? "Vehicle"}
        // description={data?.station?.description ?? "Vehicle"}
        anchor={{x: 0.5, y: 0.5}}
    >
        <Image 
            style={{
                width: 90,
                height: 35,
                aspectRatio: 2,
            }}
            resizeMode="contain"
            source={require("../../../../assets/images/vehicle-marker.png")}
        />
    </Marker>
  )
}

export default VehicleMarker

const styles = StyleSheet.create({})