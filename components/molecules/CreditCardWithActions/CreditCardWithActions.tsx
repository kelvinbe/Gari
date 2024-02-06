import { ActivityIndicator, StyleProp, Text, View, ViewStyle } from 'react-native'
import React, { useEffect, useState } from 'react'
import { makeStyles, useTheme } from '@rneui/themed'
import CreditCard, { CardProps } from '../CreditCard/CreditCard'
import { TouchableOpacity } from 'react-native-gesture-handler';
import { useDeletePaymentMethodMutation } from '../../../store/slices/billingSlice';
import useToast from '../../../hooks/useToast';
import useDeleteCard from '../../../hooks/useDeleteCard';
import { IRawCard } from '../../../types';
interface IProps {
    onActionPress?: () => void,
    actionTitle?: string,
    customStyle?: StyleProp<ViewStyle>
}

type Props = IProps & CardProps & IRawCard;
const useStyles = makeStyles((theme, props)=>({
    container: {
        alignItems: "flex-end",
        justifyContent: "flex-start",
        width: "100%"
    },
    cardContainer: {
        width: "100%",
        marginbottom: 10
    },
    buttonStyle: {
        borderRadius: 25,
        paddingVertical: 6,
        paddinHorizontal: 20,
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        borderColor: theme.colors.primary,
        borderWidth: 1,
        // width: "60%",
        marginTop: 10,

    },
    titleStyle: {
        color: theme.colors.primary,
        fontSize: 14,
        fontWeight: '700',
        fontFamily: "Lato_700Bold",
        lineHeight: 28,
        textAlign: "center",
        width: '100%',
    }
}))

const CreditCardWithActions = (props: Props) => {
    const styles = useStyles()
    const { theme } = useTheme()
    const {data, error, loading, deleteCard} = useDeleteCard()
    const toast = useToast()
    const [deleteOption, setDeleteOption] = useState<boolean>(false)

    const {cardNumber} = props

    const removePaymentMethod = () => {
        deleteCard(cardNumber)
        if(data){
            toast({
                type: "success",
                message: "Payment method deleted.",
                title: "Success",
                duration: 3000,
            })
        }
        if(error){
            toast({
                type: "error",
                message: error,
                title: "Error",
                duration: 3000,
            })
        }
    }

  return (
    <View style={[styles.container, props?.customStyle]} >
        <View style={styles.cardContainer} >
            <CreditCard
                details={props.details}
                onCardPress={() => setDeleteOption(!deleteOption)}
                paymentType={props.paymentType}
                entityId={props.entityId}
            />
        </View>
        { deleteOption && <View style={{width: "50%"}} >
            <TouchableOpacity  style={styles.buttonStyle}  onPress={removePaymentMethod} >
                {loading ? <ActivityIndicator color={theme.colors.primary} size="large" /> :<Text style={styles.titleStyle} >
                    {
                        props.actionTitle
                    }
                </Text>}
                
            </TouchableOpacity>
        </View>}
        
    </View>
  )
}

export default CreditCardWithActions
