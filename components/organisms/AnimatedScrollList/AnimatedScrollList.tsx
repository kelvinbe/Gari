import { StyleSheet, Animated, FlatList, View } from 'react-native'
import React, {useEffect, useRef, useState} from 'react'
import { makeStyles } from '@rneui/themed'
import DriveCardButton from '../../molecules/DriveCardButton/DriveCardButton'
import { useGetVehiclesQuery } from '../../../store/slices/vehiclesSlice';
import Empty from '../../molecules/Feedback/Empty/Empty';
import Loading from '../../molecules/Feedback/Loading/Loading';
import Error from '../../molecules/Feedback/Error/Error';
import { IVehicle } from '../../../types';
import useBookingActions from '../../../hooks/useBookingActions';
import useToast from '../../../hooks/useToast';
import { add_padding, calcDuration } from '../../../utils/utils';
import { useAppDispatch, useAppSelector } from '../../../store/store';
import { selectChosenHostCode, selectUsersLocation, setHostCode } from '../../../store/slices/bookingSlice';
import { isEmpty } from 'lodash';
import { selectCoords, setVehiclePositions } from '../../../store/slices/searchSlice';
import { LocationObjectCoords } from 'expo-location';
import dayjs from 'dayjs';


interface IProps {
    handleSelect?: (vehicle: IVehicle | null) => void,
    items?: any[],
}

type Props = IProps

const useStyles = makeStyles((theme, props)=>{
    return {
        container: {
            width: "100%",
        }
    }
})

const AnimatedScrollList = (props: Props) => {
    const dispatch = useAppDispatch()
    const {data: coords} = useAppSelector(selectCoords)
    const chosenHostCode = useAppSelector(selectChosenHostCode)
    const { bookingDetails: { start_date_time, end_date_time}, clearBookingState } = useBookingActions()
    const { data, isLoading, isError, refetch, isFetching } = useGetVehiclesQuery({
        ...(isEmpty(chosenHostCode) ? {
            longitude: coords?.longitude.toString() ?? undefined,
            latitude: coords?.latitude.toString() ?? undefined,
        } : {
            host_code: !isEmpty(chosenHostCode) ? chosenHostCode : undefined,
        }),
        start_date_time: !isEmpty(start_date_time) ? dayjs(start_date_time).format() : undefined,
        end_date_time: !isEmpty(end_date_time) ? dayjs(end_date_time).format() : undefined,
    })
    const toast = useToast()
    const styles = useStyles(props)
    const scrollY = useRef(new Animated.Value(0)).current 

    useEffect(()=>{
        if(!isEmpty(data)){
            const coords = data?.map((vehicle: Partial<IVehicle>)=>{
                return {
                    latitude: vehicle?.station?.latitude,
                    longitude: vehicle?.station?.longitude,
                } as LocationObjectCoords
            })

            dispatch(setVehiclePositions(coords))
        }
    }, [data])

    useEffect(()=>{
        return ()=>{
            scrollY.removeAllListeners()
        }
    },[])


    useEffect(()=>{
        refetch()
    }, [start_date_time, end_date_time])


    const handlePress = (chosen_id: string) =>{
        if(start_date_time && end_date_time){
            if(calcDuration(start_date_time, end_date_time) > 0){
                const fetched = data?.find(({id}) => id === chosen_id)
                clearBookingState()
                props.handleSelect && props.handleSelect(fetched ? fetched : null);
            }else {
                toast({
                    type: "primary",
                    message: "Please select a valid time range",
                    duration: 3000,
                    title: "Invalid time range"
                })
            }
        }else{
            toast({
                type: "primary",
                message: "Please select a valid time range",
                duration: 3000,
                title: "Invalid time range"
            })
        }
        
    }
    

return (
    <View 
    style={{
        width: "100%",
        height: 240
    }}
    >
    {
        (isLoading || isFetching) ? <Loading/> : isError ? <Error /> : isEmpty(data) ? <Empty
            emptyText={
                new Date(end_date_time).getTime() === new Date(start_date_time).getTime() ? 'Adjust your time range to see available vehicles' :
                'No vehicles available'
            }
        /> : (
            <Animated.FlatList
                ListEmptyComponent={<Empty emptyText="No vehicles " />}
                style={styles.container}
                removeClippedSubviews
                contentContainerStyle={{
                    marginTop: -40
                }}
                keyExtractor={(item, index)=>item.id}
                stickyHeaderHiddenOnScroll
                data={data ? add_padding(1, data) : []}
                showsVerticalScrollIndicator={false}
                renderItem={
                    ({item, index})=>{
                    
                        const itemSize = 120
                        // -2 -1 0 1
                        const inputRange = [
                            (index -2 ) * itemSize,
                            (index -1 ) * itemSize,
                            index * itemSize,
                            (index +1 ) * itemSize,

                        ]
                        const scale = scrollY.interpolate({
                            inputRange,
                            outputRange: [
                                0.8,
                                1,
                                0.8,
                                1
                            ]  
                        })

                        const translateY = scrollY.interpolate({
                            inputRange,
                            outputRange: [
                                -itemSize *0.7,
                                -itemSize * 0.3,
                                itemSize * 0.3,
                                itemSize * 0.3
                            ]
                        })

                        const opacity = scrollY.interpolate({
                            inputRange,
                            outputRange: [
                                0.8,
                                1,
                                0.8,
                                0
                            ]
                        })

                        return index == 0 ? <View style={{
                            height: itemSize,
                            backgroundColor: "transparent"
                        }} ></View> : index == (data?.length ?? 0) + 1 ? (
                            <View style={{
                                height: itemSize,
                                backgroundColor: "transparent"
                            }} ></View>
                        ) : (
                            isLoading ? <Loading /> :  <DriveCardButton key={index} {...item} onPress={()=>{
                                        handlePress(item.id)
                                    }} index={index} opacity={opacity} scale={scale} translateY={translateY} customContainerStyle={{
                                        marginBottom: 20
                                    }} />
                        )
                    }
                }
                onScroll={
                    Animated.event(
                        [
                            {
                                nativeEvent: {
                                    contentOffset: {
                                        y: scrollY
                                    }
                                }
                            }
                        ],
                        {
                            useNativeDriver: true
                        }
                    )
                }
            />
        )
    }
    
    </View>
)

}

export default AnimatedScrollList