import { createSlice } from "@reduxjs/toolkit"
import { Icon, makeStyles, Text, ThemeConsumer, useTheme } from "@rneui/themed"
import { isEmpty } from "lodash"
import React, { useEffect, useReducer } from "react"
import { StyleProp, View, ViewProps, ViewStyle} from "react-native"
import { addSlashAfter2Digits, addSpacingAfterEveryFourDigits, removeSpaces } from "../../../../../utils/utils"
import Rounded from "../../../../atoms/Buttons/Rounded/Rounded"
import BaseInput from "../../../../atoms/Input/BaseInput/BaseInput"
import WithHelperText from "../../../../atoms/Input/WithHelperText/WithHelperText"

interface IReducerState{
    cvv:string,
    card_number:string,
    name:string,
    exp:string,
    is_card_number_valid:boolean,
    is_exp_date_valid:boolean,
    is_cvv_valid:boolean,
    card: [],
    attempts_to_submit:number,
    payment_card_added: boolean
}

interface IProps {
    customStyles?: StyleProp<any>
    onCardAdded: (card: Partial<IReducerState> | null) => void
}

type Props = IProps

const ccNumberRegex = new RegExp("^[0-9]{16}$")
const expDateRegex = new RegExp("^[0-9]{4}$")
const cvvRegex = new RegExp("^[0-9]{3}$")



export const initialState: IReducerState = {
    cvv:'',
    card_number:'',
    name:'',
    exp:'',
    is_card_number_valid:false,
    is_exp_date_valid: false,
    is_cvv_valid:false,
    card:[],
    attempts_to_submit:0,
    payment_card_added: false
}

const useStyles = makeStyles((theme, props: Props)=>{
    return {
        container: {
            alignItems: "center",
            justifyContent: "space-between",
            backgroundColor: theme.colors.white,
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

const slice = createSlice({
    name: "card",
    initialState,
    reducers: {
        setName: (state, action) => {
            state.name = action.payload
        }, 
        setCardNumber: (state, action) => {
            state.card_number = addSpacingAfterEveryFourDigits(action.payload || "")
            state.is_card_number_valid = ccNumberRegex.test(action.payload)
        },
        setExpDate: (state, action) => {
            state.exp = action?.payload?.length > 2 ? addSlashAfter2Digits(action.payload ?? "") : action.payload
            state.is_exp_date_valid = expDateRegex.test(action.payload)
        },
        setCvv: (state, action) => {
            state.cvv = action.payload
            state.is_cvv_valid = cvvRegex.test(action.payload)
        },
        submit: (state, action) => {
            state.attempts_to_submit = state.attempts_to_submit + 1
        },
    }
})


const reducer = slice.reducer 

const { setCardNumber, setCvv, setExpDate, setName, submit } = slice.actions 

/**
 * @reason for name, is to avoid conflict with stripe's CardForm component
 */
function AppCardForm(props: Props){


    const { onCardAdded, customStyles } = props

    const [{
        attempts_to_submit: attemptsToSubmit,
        card,
        card_number: cardNum,
        cvv,
        exp,
        is_card_number_valid: isCardNumberValid,
        is_cvv_valid: isCvvValid,
        is_exp_date_valid: isExpDateValid,
        name,
        payment_card_added: paymentCardAdded
    }, dispatch ] = useReducer(reducer, initialState)

   


    const handleNameChange = (text: string) => {
        dispatch(setName(text))
    }

    const handleCardNumberChange = (text:string) => {
        dispatch(setCardNumber(removeSpaces(text)))
        
    }

    const handleExpDateChange = (text: string) => {
        dispatch(setExpDate(removeSpaces(text)?.replace("/", "")))
    }

    const handleCvvChange = (text: string) => {
        dispatch(setCvv(removeSpaces(text)))
    }
    const handleAddCard = () => {

    }

    const styles = useStyles(props)

    useEffect(()=>{
        if(!isEmpty(cardNum) && !isEmpty(exp) && !isEmpty(cvv) && !isEmpty(name)){
            if(isCardNumberValid && isCvvValid && isExpDateValid){
                onCardAdded({
                    card_number: cardNum,
                    cvv,
                    exp,
                    name,

                })
            }else{
                onCardAdded(null)
            }
        }
    }, [cardNum, cvv, exp, name])

    return (
        <ThemeConsumer>
            {({theme})=>(
                <View style={[styles.container, customStyles]} >
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
                            attemptsToSubmit > 0 && name.length === 0 ? <View style={styles.helperTextLeft} >
                                <Text style={styles.errorText} >Name is required</Text>
                            </View> : ""
                        }
                        />
                    <WithHelperText 
                        label="Card Number"
                        placeholder="xxxx xxxx xxxx xxxx" 
                        keyboardType="numbers-and-punctuation"
                        maxLength={19}
                        onChangeText={handleCardNumberChange}
                        value={cardNum}
                        rightIcon={
                            cardNum?.length > 0 ? !isCardNumberValid ? <Icon name="exclamation-circle" size={16} type="font-awesome" color={theme.colors.success} /> : <Icon name="check-circle" size={16} type="font-awesome" color={theme.colors.success} /> : undefined
                        }
                        fullWidth container={{
                            marginBottom: 45
                        }} 
                        helperText={
                            attemptsToSubmit > 0 && !isCardNumberValid ? <View style={styles.helperTextLeft} >
                                <Text style={styles.errorText} >Card number is invalid</Text>
                            </View> : ""
                        }
                        />
                    <View style={styles.bottomInputSection} >
                        <BaseInput
                            width={"45%"}
                            value={exp}
                            placeholder="MM/YY"
                            label="Exp. Date"
                            keyboardType='numbers-and-punctuation'
                            maxLength={5}
                            onChangeText={handleExpDateChange}
                            rightIcon={
                                exp?.length > 0 ? !isExpDateValid ? <Icon name="exclamation-circle" size={16} type="font-awesome" color={theme.colors.error} /> : <Icon size={16} name="check-circle" type="font-awesome" color={theme.colors.success} /> : undefined
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
                                cvv?.length > 0 ? !isCvvValid ? <Icon size={16} name="exclamation-circle" type="font-awesome" color={theme.colors.error} /> : <Icon size={16} name="check-circle" type="font-awesome" color={theme.colors.success} /> : undefined
                            }
                        />
                    </View>
                </View>
            </View>
            )}
        </ThemeConsumer>
        
    )
}

export default AppCardForm
