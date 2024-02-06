import React from 'react'
import { makeStyles, ThemeConsumer } from '@rneui/themed'
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { PaymentDetailsScreenParamList } from '../../../../types';
import PaymentDetailsScreenHome from './PaymentDetailsScreenHome';
import MobileMoneyDetails from './MobileMoneyDetails';
import BaseTopBar from '../../../../navigation/TopBar/BaseTopBar';
import AddCard from './AddCard';
import { useAppSelector } from '../../../../store/store';
import { selectCurrentFlow } from '../../../../store/slices/flowstack';
import * as Linking from 'expo-linking'

const PaymentDetailsScreenStackNavigator = createNativeStackNavigator<PaymentDetailsScreenParamList>();

const useStyles = makeStyles((theme, props)=>({
    container: {
        width: "100%",
        height: "100%",
        backgroundColor: theme.colors.white
    }
}))

const PaymentDetailsScreen = () => {
    const styles = useStyles()
    const current_flow = useAppSelector(selectCurrentFlow)
  return (
    <ThemeConsumer>
        {({ theme }) => (
                <PaymentDetailsScreenStackNavigator.Navigator initialRouteName="PaymentDetailsScreenHome" >
                    <PaymentDetailsScreenStackNavigator.Screen options={{
                        headerShown: true,
                        header: (props) => <BaseTopBar {...props} title="Payment" home={false} chevronLeft onBackPress={()=>{
                            if(current_flow !== "add_payment_method") {
                                Linking.openURL(Linking.createURL("/profile"))
                            }
                        }} />,
                        animation: "slide_from_right"
                    }} name="PaymentDetailsScreenHome" component={PaymentDetailsScreenHome} />
                    <PaymentDetailsScreenStackNavigator.Screen options={{
                       headerShown: true,
                       header: (props) => <BaseTopBar {...props} title="Mobile Money" home={false} chevronLeft />,
                       animation: "slide_from_right"
                  }} name="MobileMoneyDetailsScreen"  component={MobileMoneyDetails} />
                    <PaymentDetailsScreenStackNavigator.Screen options={{
                       headerShown: true,
                       header: (props) => <BaseTopBar {...props} title="Add Card" home={false} chevronLeft />,
                       animation: "slide_from_right"
                    }} name="AddCardScreen" component={AddCard}  />
                </PaymentDetailsScreenStackNavigator.Navigator>
        )}
    </ThemeConsumer>
  )
}

export default PaymentDetailsScreen
