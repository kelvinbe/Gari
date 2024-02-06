import {  View, TouchableOpacity } from 'react-native'
import React from 'react'
import { makeStyles } from '@rneui/themed'
import { Image, Text } from '@rneui/base';
import { ICardPaymentMethod, IPaymentMethod } from '../../../types';

interface IProps {
    amount?: number | string;
}

type Props = IProps & IPaymentMethod<ICardPaymentMethod>;

const useStyles = makeStyles((theme, props: Props)=>({
    container: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: 20,
        paddingVertical: 18,
        backgroundColor: theme.colors.background3,
        borderRadius: 12,
        width: "100%"
    },
    leftSection: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "flex-start",
    },
    creditCardIcon: {
        width: 32,
        height: 24,
        marginRight: 10
    },
    textStyle: {
        fontSize: 13,
        color: theme.colors.black,
        fontWeight: "700", 
 fontFamily: "Lato_700Bold",
        marginLeft: 10
    }
}))

const CreditCardWithAmount = (props: Props) => {
    const styles = useStyles(props)
  return (
    <TouchableOpacity style={styles.container} >
        <View style={styles.leftSection} >
            <Image source={require("../../../assets/images/visa.png")} style={styles.creditCardIcon} />
            <Text style={styles.textStyle} >
                ****{props.details.last4}
            </Text>
        </View>
        <Text style={styles.textStyle} >
            ${props.amount}
        </Text>
    </TouchableOpacity>
  )
}

export default CreditCardWithAmount
