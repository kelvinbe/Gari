import * as Location from 'expo-location';
import * as TaskManager from 'expo-task-manager';
import * as BackgroundFetch from 'expo-background-fetch';
import { Platform } from 'react-native';
import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { IReservation } from '../types';
import useToast from './useToast';
import { TRACKING_SERVICE_HOST } from './constants';
import { isArray, isEmpty, isNull, merge } from 'lodash';

const VEHICLE_TRACKING_TASK = 'vehicle-tracking-task';


// class to handle sending location to server
class StreamLocationToServer {
    number_of_timer_ws_retries = 0
    is_ws_initialized = false
    hold_because_of_error = false
    is_server_reachable = false
    ws: WebSocket | null = null // the websocket connection
    
    constructor(){
        this.server_status_checker()    
        this.ws = new WebSocket(`wss://${TRACKING_SERVICE_HOST}/userlocation`)
        
        this.ws.onopen = (e) => {
            this.is_ws_initialized = true
            this.number_of_timer_ws_retries = 0
        }
        
        this.ws.onmessage = (e) => {
            const status = e.data
            if(status === "PUBLISHED"){
                this.hold_because_of_error = false
            }
            if(status === "ERROR"){
                this.hold_because_of_error = true
                setTimeout(()=>{
                    this.hold_because_of_error = false
                }, 5000) // retry after 5 seconds
            }
        }
        
        this.ws.onerror = (e) => {
            this.hold_because_of_error = true
            setTimeout(()=>{
                this.hold_because_of_error = false
            }, 10000) // retry after 10 seconds
        }
        
        this.ws.onclose = (e) => {
            this.is_ws_initialized = false
        }
        
    }


    server_status_checker(){
        setInterval(async ()=>{
            const can_reach_server = await this.can_reach_server()
            this.is_server_reachable = can_reach_server
        }, 10000) // check every 10 seconds
    }


    async can_reach_server(){
        try {
            const response = await fetch(`https://${TRACKING_SERVICE_HOST}/api/ping`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json"

                }
            }).then((res)=>res.status)

            return response === 200
        } catch(e) {
            return false
        }
    }

    async get_reservation_details():Promise<Array<IReservation>|null>{
        const reservation_details = await AsyncStorage.getItem("activated_reservation_details").catch((e)=>{
            console.log("Error getting reservation details", e) // TODO: logging service
        })
        if(reservation_details){
            return JSON.parse(reservation_details)
        }
        return null
    }

    async send_location_to_server(location: Location.LocationObject){
        if(!this.is_server_reachable) return
        if(this.hold_because_of_error) return
        if(!this.is_ws_initialized) return
        const reservation_details = await this.get_reservation_details()
        if(isEmpty(reservation_details) || !isArray(reservation_details)){
            return
        }

        for (const reservation of reservation_details){

            if(isEmpty(reservation) || isNull(reservation)) {
                continue
            }

            const location_data = {
                reservation_id: reservation.id,
                vehicle_id: reservation.vehicle_id,
                latitude: location.coords.latitude.toString(),
                longitude: location.coords.longitude.toString(),
            }
            try {
                this.ws?.send(JSON.stringify(location_data))
            } catch(e) {
                this.hold_because_of_error = true
                setTimeout(()=>{
                    this.hold_because_of_error = false
                }, 5000)
            }
        }
    }
    
  
}


const streamer = new StreamLocationToServer()
  
  
  
TaskManager.defineTask(VEHICLE_TRACKING_TASK, async ({ data, error }) => {
    if (error) {
        console.log(error) // TODO: logging service
        return
    }
    if (data) {
        const { locations } = data as {
            locations: Location.LocationObject[]
        }
        for (const location of locations) {
            streamer.send_location_to_server(location) // Since we have deffered updates, we can send the location every 1 minute, this will be a batch of all the locations from that time
        }
    }
    return BackgroundFetch.BackgroundFetchResult.NewData
})

const registerBackgroundFetchAsync = async () => { 
    return BackgroundFetch.registerTaskAsync(VEHICLE_TRACKING_TASK, merge({
        minimumInterval: 60000 * 5, // 5 minutes
    }, Platform.OS === "android" ? {
        startOnBoot: true,
        stopOnTerminate: false,
    }: null))
}

const unRegisterBackgroundFetchFunction = async () => {
    return BackgroundFetch.unregisterTaskAsync(VEHICLE_TRACKING_TASK)
}

const getStatus = async () => {
    return await BackgroundFetch.getStatusAsync()
}

const isVehicleTrackingTaskRegistered = async () => {
    return await TaskManager.isTaskRegisteredAsync(VEHICLE_TRACKING_TASK)
}


// location permissiona
const requestLocationPermissions = async () => {
 try {
    // foreground permission
    const { status: foreGround } = await Location.requestForegroundPermissionsAsync()
    if (foreGround !== 'granted') {
        return false
    }

    // background permission
    const { status: background } = await Location.requestBackgroundPermissionsAsync()
    if (background !== 'granted') {
        return false
    }
    // register background fetch
    await registerBackgroundFetchAsync()
    // start location updates
    await Location.startLocationUpdatesAsync(VEHICLE_TRACKING_TASK, {
        accuracy: Location.Accuracy.BestForNavigation, 
        showsBackgroundLocationIndicator: true,
        timeInterval: 60000, // 1 minute   
        deferredUpdatesInterval: 60000, // 1 minute
    })
    return true
 } catch (e) {
    console.log("ERROR REQUESTING PERMISSIONS::", e) // TODO: logging service
    return false
 }
  
}

// stop location updates
const stopLocationUpdates = async () => {
    await Location.stopLocationUpdatesAsync(VEHICLE_TRACKING_TASK)
}


  

const useBackgroundLocationTask = () => {
    const toast = useToast()
    const [trackingState, setTrackingState] = useState<{
        isRegistered: boolean,
        status: BackgroundFetch.BackgroundFetchStatus | null,
        loading: boolean,
        backgroundLocationStatus: string | null
    }>({
        isRegistered: false,
        status: null,
        loading: false,
        backgroundLocationStatus: null
    })

    const updateTrackingState = async () => {
        const status = await getStatus()
        const isRegistered = await isVehicleTrackingTaskRegistered()

        setTrackingState((prev)=>({
            ...prev,
            isRegistered,
            status,
        }))
    }

    const requestBackgroundPermission = async() => {
        setTrackingState((prev)=>({
            ...prev,
            loading: true
        }))
        const done = await requestLocationPermissions()
        setTrackingState((prev)=>({
            ...prev,
            loading: true,
            backgroundLocationStatus: 'granted'
        }))
        if(done){
            updateTrackingState()
        }else{
            toast({
                message: "Your location info is required to track your vehicle",
                type: "error"
            })
            setTrackingState((prev)=>({
                ...prev,
                isRegistered: false,
                status: null
            }))
        }
        setTrackingState((prev)=>({
            ...prev,
            loading: false
        }))
        return done
    }

    const stopUpdates = async () => {
        try {
            await AsyncStorage.removeItem("activated_reservation_details")
            await stopLocationUpdates()
            await unRegisterBackgroundFetchFunction()
        } catch (e) {
            /**
             * This error isn't useful to the user, and needs to be handled by a separate logger
             */
            console.log("Error stopping location updates", e)
        }
        
        updateTrackingState()
    }

    useEffect(()=>{
        updateTrackingState()
    }, [])

    return {
        trackingState,
        requestLocationPermissions: requestBackgroundPermission,
        stopUpdates
    }
}

export default useBackgroundLocationTask


