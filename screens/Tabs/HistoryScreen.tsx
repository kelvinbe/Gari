import { StyleSheet, Text, View, FlatList } from 'react-native'
import React, { useEffect, useState } from 'react'
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs'
import { BottomTabParamList } from '../../types'
import { makeStyles, ThemeConsumer } from '@rneui/themed'
import HistoryCard from '../../components/molecules/HistoryCard/HistoryCard'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useGetHistoryQuery } from '../../store/slices/historySlice'
import Loading from '../../components/molecules/Feedback/Loading/Loading'
import Error from '../../components/molecules/Feedback/Error/Error'
import { useAppDispatch } from '../../store/store'
import { loadBookingDetailsFromReservation } from '../../store/slices/bookingSlice'
import useBookingActions from '../../hooks/useBookingActions'
import useToast from '../../hooks/useToast'
import { selectCurrentScreen } from '../../store/slices/navigationSlice'
import { useSelector } from 'react-redux'


type Props = BottomTabScreenProps<BottomTabParamList, "History">

const useStyles = makeStyles((theme, props: Props)=>({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.white,

  },
  flatListContainer: {
    width: "100%",
    paddingHorizontal: 20,
    paddingTop: 20
  }
}))

const HistoryScreen = ( props: Props) => {
  const reduxDispatch = useAppDispatch()
  const { data, isError, isLoading, refetch } = useGetHistoryQuery(null)
  const toast = useToast()
  const currentScreen = useSelector(selectCurrentScreen)

  /**
   * @name onDetailsPress
   * @description This function is used to fetch the booking details from the reservation id, once the details are fetched, the booking details screen is opened
   * @param reservationId 
   */
  const onDetailsPress = (reservationId?: string) =>{
      reservationId && reduxDispatch(loadBookingDetailsFromReservation(reservationId)).then(()=>{
        props.navigation.navigate("BookingDetails")
      }).catch((e)=>{
        toast({
          message: "Error loading booking details",
          type: "error"
        })
      })
  }
  
  useEffect(() => {
    refetch()
  }, [currentScreen])


  const styles = useStyles(props)
  return (
    <ThemeConsumer>
      {({theme})=>(
        (isLoading )? ( <Loading/> ) : (isError ) ? ( <Error/> ) : (
          <View style={styles.container} >
            {data?.length === 0 && <Text style={{textAlign:'center', color:theme.colors.primary}}>No history reservations</Text>}
            <FlatList
              style={styles.flatListContainer}
              data={data ? data : []}
              renderItem={({item})=>(
                <HistoryCard {...item} onDetailsPress={onDetailsPress} customStyle={{
                  marginBottom: 20,
                }} />
              )}
              keyExtractor={(item, index)=>index.toString()}
            />
          </View>
        )
      )}
    </ThemeConsumer>
  )
}

export default HistoryScreen
