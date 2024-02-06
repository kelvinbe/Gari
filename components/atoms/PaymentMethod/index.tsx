import { View, Text, TouchableOpacity } from 'react-native'
import React from 'react'
import { CheckBox, makeStyles, useTheme } from '@rneui/themed'
import { IPaymentType } from '../../../types'
import CcardIcon from '../../../assets/icons/hero/credit-card.svg'
import CashIcon from '../../../assets/icons/hero/cash.svg'
import { Entypo, FontAwesome5 } from '@expo/vector-icons'
import { isUndefined } from 'lodash'

type Props = Partial<IPaymentType> & {
    onLongPress?: (id?: string) => void,
    onPress?: (id?: string) => void,
    isActive?: boolean
}


const useStyles = makeStyles((theme, props)=>{
    return {
        container: {
            width: "100%",
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingVertical: 10,
        },
        leftContainer: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'flex-start'
        },
        icon: {
            marginRight: 20,
        },
        detail: {
            textAlign: 'left',
            fontSize: 16,
            color: theme.colors.title,
            fontWeight: '600'
        },
        checkboxContainer: {
            margin: 0,
            padding: 0,
            backgroundColor: 'transparent',
        }
    }
})


/**
 * @name PaymentType 
 * @explanation regarding the naming, PaymentMethod is synonymous with PaymentType in the divvly application
 */
const PaymentMethod = (props: Props) => {
    const { type, details, phone_number, id, onLongPress, onPress, is_primary, isActive } = props 
    const styles = useStyles(props)
    const { theme } = useTheme()
  return (
    <TouchableOpacity onLongPress={()=>{
        onLongPress?.(id)
    }} onPress={()=>{
        onPress?.(id)
    }} style={styles.container} >
        <View style={styles.leftContainer}>
            {
                type === "STRIPE" ? (
                    <CcardIcon style={styles.icon} width={24} height={24} color={theme.colors.iconPrimary} />
                ) : ["MPESA", "MTN"].includes(type ?? "") ? (
                    <FontAwesome5 style={[styles.icon, {marginRight: 25}]} name="sim-card"  size={24} color={theme.colors.iconPrimary} />
                ) : type === "PAYPAL" ? (
                    <Entypo style={styles.icon} name="paypal" size={24} color={theme.colors.iconPrimary} />
                ) : type === "CASH" ? (
                    <CashIcon style={styles.icon} width={24} height={24} color={theme.colors.iconPrimary} />
                ) : null
            }
            <Text style={styles.detail}  >
                {
                    type === "STRIPE" ? details?.last4 ? `....${details?.last4}` : "Unable to load number" : 
                    type === "MPESA" ? `${phone_number ?? "Unable to load number"} (M-Pesa)` :
                    type === "MTN" ? `${phone_number ?? "Unable to load number"} (MTN)` : 
                    type === "PAYPAL" ? "Paypal" : 
                    type === "CASH" ? "Pay with cash" : "Unknown"
                }
            </Text>
        </View>
        <View>
            <CheckBox containerStyle={styles.checkboxContainer} checked={ !isUndefined(isActive) ? isActive : is_primary ?? false} checkedIcon={'dot-circle-o'} uncheckedIcon={'circle-o'} />
        </View>
    </TouchableOpacity>
  )
}

export default PaymentMethod