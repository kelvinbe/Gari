import { StyleSheet, Text, View, FlatList } from 'react-native'
import React, { useEffect, useState } from 'react'
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs'
import { BottomTabParamList, ManageResParamList } from '../../../types'
import { ThemeConsumer, makeStyles } from '@rneui/themed'
import HistoryCard from '../../../components/molecules/HistoryCard/HistoryCard'
import { SafeAreaView } from 'react-native-safe-area-context'
import { NativeStackScreenProps } from '@react-navigation/native-stack'
import { useDispatch, useSelector } from 'react-redux'
import { setChosenReservation, useGetReservationsQuery } from '../../../store/slices/reservationSlice'
import Loading from '../../../components/molecules/Feedback/Loading/Loading'
import Error from '../../../components/molecules/Feedback/Error/Error'
import Empty from '../../../components/molecules/Feedback/Empty/Empty'
import { useAppDispatch } from '../../../store/store'
import { loadBookingDetailsFromReservation, setHostCode } from '../../../store/slices/bookingSlice'
import { selectCurrentScreen } from '../../../store/slices/navigationSlice'

type Props = NativeStackScreenProps<ManageResParamList, "ManageResHome">

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

const ManageResHomeScreen = (props: Props) => {
  const { data, isLoading, isError, refetch } = useGetReservationsQuery({
    status: "ACTIVE"
  })
  const [loading, setLoading] = useState<boolean>(false)
  const [fetchError, setFetchError] = useState<boolean>(false)
  const currentScreen = useSelector(selectCurrentScreen)

  const styles = useStyles(props)
  const reduxDispatch = useAppDispatch()

  /**
   * @name onCardDetailsPress
   * @description This function is called when the user presses the details button on a reservation card, it loads the booking details from the reservation id into the redux store
   * @param reservationId 
   */
  const onCardDetailsPress = (reservationId: string) => {
    setLoading(true)
    setFetchError(false)
    reduxDispatch(setHostCode(null))
    reduxDispatch(loadBookingDetailsFromReservation(reservationId)).unwrap().then((result)=>{
      setLoading(false)
      props.navigation.navigate("BookingDetails")
    }).catch((e)=>{
      setLoading(false)
      setFetchError(true)
    })
  }

  useEffect(() => {
    refetch()

  }, [currentScreen])

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
              <HistoryCard {...item} onDetailsPress={onCardDetailsPress} customStyle={{
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

export default ManageResHomeScreen
