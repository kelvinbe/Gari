import { StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { makeStyles, ThemeConsumer } from '@rneui/themed'
import Rounded from '../../../components/atoms/Buttons/Rounded/Rounded'
import TickMarkIcon from "../../../assets/icons/tick-mark.svg"
import ZigzagView from 'react-native-zigzag-view'
import HistoryCard from '../../../components/molecules/HistoryCard/HistoryCard'
import CreditCardWithAmount from '../../../components/molecules/CreditCardWithAmount/CreditCardWithAmount'
import { NativeStackScreenProps } from '@react-navigation/native-stack'
import { SearchScreenParamList } from '../../../types'
import { useGetReservationQuery } from '../../../store/slices/reservationSlice'
import Loading from '../../../components/molecules/Feedback/Loading/Loading'
import Error from '../../../components/molecules/Feedback/Error/Error'
import useBookingActions from '../../../hooks/useBookingActions'

interface IProps {

}

type Props = NativeStackScreenProps<SearchScreenParamList, "BookingConfirmationScreen">

const useStyles = makeStyles((theme, props)=>({
    container: {
        width: "100%",
        height: "100%",
        backgroundColor: theme.colors.white,
        padding:20
    },
    confirmationContainer: {
        width: "100%",
        height: "90%",
        alignItems: "center",
        justifyContent: "center",
    },
    bottomContainer: {
        width: "100%",
        height: "10%",
        alignItems: "center",
        justifyContent: "center",
    },
    iconContainerStyle: {
        alignItems: "center",
        justifyContent: "center",
    },
    iconStyle: {
        backgroundColor: theme.colors.fadedPrimary,
        padding: 30,
        borderRadius: 100,
        alignItems: "center",
        justifyContent: "center",
        marginBottom: 20
    },
    textStyle: {
        color: theme.colors.title,
        fontSize: 14,
        fontWeight: "700", 
 fontFamily: "Lato_700Bold",
        marginBottom: 20
    },
    receipt: {
        width: "100%",
        backgroundColor: theme.colors.background3,
        
    },
    receiptContent: {
        width: "100%",
        backgroundColor: theme.colors.white,
        alignItems: "center",
        justifyContent: "flex-start",
        padding: 10,
        paddingBottom: 20,
        borderWidth: 1,
        borderColor: theme.colors.stroke,
        borderTopLeftRadius: 15,
        borderTopRightRadius: 15,
        borderBottomWidth: 0
    }
}))

const BookingConfirmationScreen = (props: Props) => {
    const { clearBookingState } = useBookingActions()
    const { data, isLoading, error } = useGetReservationQuery(props.route.params.reservationId)
    const [changeOk, setChangeOk] = useState<boolean>(false)
    const styles = useStyles()
     useEffect(()=>props.navigation.addListener("beforeRemove", (e)=>{
            // if(!changeOk){
            //     e.preventDefault()
            // }
            // if(changeOk){
            //     props.navigation.navigate("SearchScreenHome")
            // }
        }), [props.navigation, changeOk])
    

    const toSearchScreen = () =>{
        setChangeOk(true)
        props.navigation.navigate("SearchScreenHome")
    }

  return (
    isLoading ? (
        <Loading/>
    ) : error ? (
        <Error/>
    ) :
    (
    <ThemeConsumer>
        {(({theme})=>(
            <View  style={styles.container} >
                <View style={styles.confirmationContainer} >
                    { data && <ZigzagView
                        top={false}
                        bottom
                        style={styles.receipt}
                        surfaceColor={theme.colors.white}
        
                    >
                        <View style={styles.receiptContent} >
                            <View style={styles.iconStyle} >
                                <TickMarkIcon stroke={theme.colors.primary} height={30} width={30} />
                            </View>
                            <Text style={styles.textStyle} >
                                {
                                    data?.status === "UPCOMING" ? "Booking Confirmed" : data?.status === "PENDING_CONFIRMATION" ? "Awaiting confirmation from host" : ""
                                }
                            </Text>
                            <HistoryCard {...data} customStyle={{marginBottom: 20}} />
                        </View>
                        
                    </ZigzagView>}
                </View>
                <View style={styles.bottomContainer} >
                    <Rounded onPress={toSearchScreen} >
                        OK
                    </Rounded>
                </View>
            </View>
        ))}
    </ThemeConsumer>
    )
    
  )
}

export default BookingConfirmationScreen
