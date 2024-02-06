import { StyleSheet, Text, View } from 'react-native'
import React, { useState } from 'react'
import { makeStyles, useTheme } from '@rneui/themed'
import { NativeStackScreenProps } from '@react-navigation/native-stack'
import { PaymentDetailsScreenParamList } from '../../../../types'
import BaseInput from '../../../../components/atoms/Input/BaseInput/BaseInput'
import WithHelperText from '../../../../components/atoms/Input/WithHelperText/WithHelperText'
import { Icon } from '@rneui/base'
import Rounded from '../../../../components/atoms/Buttons/Rounded/Rounded'
import useToast from '../../../../hooks/useToast'
import { useAddPaymentMethodMutation } from '../../../../store/slices/billingSlice'
import Error from '../../../../components/molecules/Feedback/Error/Error'
import { fetchUserData, selectUserProfile } from '../../../../store/slices/userSlice'
import { useAppDispatch, useAppSelector } from '../../../../store/store'
import { isEmpty } from 'lodash'
import { z } from 'zod'
import { Masks, useMaskedInputProps } from 'react-native-mask-input'
import { selectCurrentFlow, setFlow } from '../../../../store/slices/flowstack'
import * as Linking from 'expo-linking'


// custom masks 
const CREDIT_CARD_EXP_DATE = [/[0-1]/, /\d/, '/', /\d/, /\d/];


type Props = NativeStackScreenProps<PaymentDetailsScreenParamList, "AddCardScreen">

const useStyles = makeStyles((theme, props: Props)=>{
    return {
        container: {
            flex: 1,
            alignItems: "center",
            justifyContent: "space-between",
            backgroundColor: theme.colors.white,
            paddingVertical: 50,
            paddingHorizontal: 10
        },
        inputContainer: {
            width: "100%",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: 20

        },

        bottomInputSection: {
            width: "100%",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between"
        },
        errorText: {
            color: theme.colors.error,
            fontSize: 12,
            fontWeight: "400",
            textAlign: "center",
            fontFamily: "Lato_400Regular"
        },
        helperTextLeft: {
            width: "100%",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "flex-start",
            paddingHorizontal: 20
        },
        helperTextRight: {
            width: "100%",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "flex-end",
            paddingHorizontal: 20
        },
        bottomSection: {
            width: "100%",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",

        }
    }
})

const card_details_schema = z.object({
    card_number: z.string().min(16).max(16),
    cvc: z.string().min(3).max(3),
    exp_month: z.number().min(1).max(12),
    exp_year: z.number().min(2021),
})


function AddCard(props: Props){
    const user = useAppSelector(selectUserProfile)
    const toast = useToast()
    const dispatch = useAppDispatch()
    const { theme } = useTheme()
    const [{ name, cardNumber, cvv, expDate, errors }, setInputState] = useState<Partial<{
        cardNumber: string | undefined,
        cvv: string | undefined,
        expDate: string | undefined,
        name: string | undefined, 
        errors: Partial<{
            cardNumber: boolean,
            cvv: boolean,
            expDate: boolean,
            name: boolean
        }>
    }>>({})

    const current_flow = useAppSelector(selectCurrentFlow)

    
    const [addPaymentMethod, { isLoading, isError }] = useAddPaymentMethodMutation()
    
    
    const handleNameChange = (text: string) => {
        setInputState((prev)=>{
            return {
                ...prev,
                name: text,
                errors: {
                    ...prev.errors,
                    name: !z.string().min(1).optional().safeParse(text)?.success
                }
            }
        })
    }
    
    const handleCardNumberChange = (text:string) => {
        setInputState((prev)=>{
            return {
                ...prev,
                cardNumber: text,
                errors: {
                    ...prev.errors,
                    cardNumber: !z.string().min(16).max(16).optional().safeParse(text?.replaceAll(" ", ""))?.success
                }
            }
        })
        
    }
    const card_number_mask_input_props = useMaskedInputProps({
        mask: Masks.CREDIT_CARD,
        onChangeText:  handleCardNumberChange,
        value: cardNumber,
    })

    const handleExpDateChange = (text: string) => {
        setInputState((prev)=>{
            return {
                ...prev,
                expDate: text,
                errors: {
                    ...prev.errors,
                    expDate: !z.string().min(5).max(5).optional().safeParse(text)?.success
                }
            }
        })
    }

    const exp_date_mask_input_props = useMaskedInputProps({
        mask: CREDIT_CARD_EXP_DATE,
        onChangeText:  handleExpDateChange,
        value: expDate,
    })

    const handleCvvChange = (text: string) => {
        setInputState((prev)=>{
            return {
                ...prev,
                cvv: text,
                errors: {
                    ...prev.errors,
                    cvv: !z.string().min(3).max(3).optional().safeParse(text)?.success
                }
            }
        })
    }


    const handleAddCard = async () => {

        const parsed = card_details_schema.safeParse({
            card_number: cardNumber?.replaceAll(" ", ''),
            cvc:cvv,
            name,
            exp_month: Number(expDate?.slice(0,2)),
            exp_year: Number(expDate?.slice(2,5)?.replace("/", ''))+2000,
        })

        if(!parsed.success){
            console.log(parsed.error)
            return toast({
                type: "error",
                message: "Please fill in all the fields correctly"
            })
        }

        const data = parsed.data 

        try {
            await addPaymentMethod({
                card_number: data.card_number?.replaceAll(" ", '')??undefined,
                customer_id: user?.customer_id??undefined,
                cvc: data.cvc,
                exp_month: data.exp_month,
                exp_year: data.exp_year,
                type: "card"
            }).unwrap()
            dispatch(fetchUserData(null))

            if (current_flow === "add_payment_method") {
                dispatch(setFlow(null))
                Linking.openURL(Linking.createURL("/map"))
                return
            }
            props.navigation.goBack()
        } catch (error) {
            toast({
                title: 'Error',
                message: 'Something went wrong',
                type: 'error'
            })
        }
    }

    const styles = useStyles(props)   

    return ( isError ? <Error/> :
        <View style={styles.container} >
            <View style={styles.inputContainer} >
                <WithHelperText 
                    label="Name" 
                    value={name}
                    onChangeText={handleNameChange} 
                    placeholder="Card holder`s name" 
                    fullWidth 
                    container={{
                        marginBottom: 45
                    }} 
                    helperText={
                        errors?.name ? <View style={styles.helperTextLeft} >
                            <Text style={styles.errorText} >Name is required</Text>
                        </View> : ""
                    }
                    />
                <WithHelperText 
                    label="Card Number"
                    keyboardType="numbers-and-punctuation"
                    rightIcon={
                        errors?.cardNumber ? 
                        (isEmpty(cardNumber) ? undefined : <Icon name="exclamation-circle" size={16} type="font-awesome" color={theme.colors.success} />) : 
                        ( isEmpty(cardNumber) ? undefined : <Icon name="check-circle" size={16} type="font-awesome" color={theme.colors.success} />) 
                    }
                    fullWidth 
                    container={{
                        marginBottom: 45
                    }} 
                    {
                        ...card_number_mask_input_props
                    }
                    placeholder="xxxx xxxx xxxx xxxx" 
                    helperText={
                        errors?.cardNumber ? <View style={styles.helperTextLeft} >
                            <Text style={styles.errorText} >{
                                isEmpty(cardNumber) ? "" : "Card number is invalid"
                            }</Text>
                        </View> : ""
                    }
                    />
                <View style={styles.bottomInputSection} >
                    <BaseInput
                        {
                            ...exp_date_mask_input_props
                        }
                        placeholder="MM/YY"
                        width={"45%"}
                        label="Exp. Date"
                        keyboardType='numbers-and-punctuation'
                        rightIcon={
                            errors?.expDate ? 
                            ( isEmpty(expDate) ? undefined :<Icon name="exclamation-circle" size={16} type="font-awesome" color={theme.colors.error} />) : 
                            ( isEmpty(expDate) ? undefined : <Icon size={16} name="check-circle" type="font-awesome" color={theme.colors.success} />) 
                        }
                    />
                    <BaseInput
                        width={"45%"}
                        placeholder="CVV"
                        label="CVV"
                        keyboardType='numbers-and-punctuation'
                        maxLength={3}
                        value={cvv}
                        onChangeText={handleCvvChange}
                        secureTextEntry
                        rightIcon={
                            errors?.cvv ? 
                            (isEmpty(cvv) ? undefined : <Icon size={16} name="exclamation-circle" type="font-awesome" color={theme.colors.error} />) : 
                            (isEmpty(cvv) ? undefined : <Icon size={16} name="check-circle" type="font-awesome" color={theme.colors.success} />)
                        }
                    />
                </View>
            </View>
            <View style={styles.bottomSection} >
                <Rounded 
                    disabled={
                        !card_details_schema.safeParse({
                            name, 
                            cvc: cvv,
                            card_number: cardNumber?.replaceAll(" ", ''),
                            exp_month: Number(expDate?.slice(0,2)),
                            exp_year: Number(expDate?.slice(2,5)?.replace("/", ''))+2000,
                        }).success
                    }
                    loading={isLoading} 
                    fullWidth onPress = {handleAddCard} >
                    Add Card
                </Rounded>
            </View>
        </View>
    )
}

export default AddCard

const styles = StyleSheet.create({})