import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { addSlashAfter2Digits, addSpacingAfterEveryFourDigits, removeSpaces  } from "../../utils/utils";

interface Card{
    cvv:string,
    cardNum:string,
    name:string,
    exp:string,
    isCardNumberValid:boolean,
    isExpDateValid:boolean,
    isCvvValid:boolean,
    card: [],
    attemptsToSubmit:number,
    paymentCardAdded: boolean
}

export const initialState: Card = {
    cvv:'',
    cardNum:'',
    name:'',
    exp:'',
    isCardNumberValid:false,
    isExpDateValid: false,
    isCvvValid:false,
    card:[],
    attemptsToSubmit:0,
    paymentCardAdded: false
}

const ccNumberRegex = new RegExp("^[0-9]{16}$")
const expDateRegex = new RegExp("^[0-9]{4}$")
const cvvRegex = new RegExp("^[0-9]{3}$")

const addCardSlice = createSlice({
    name:'addCardSlice',
    initialState:initialState,
    reducers:{
        setCardName:(state, action) => {
            state.name = action.payload
        },
        setCardNum:(state, action) => {
            state.cardNum =  addSpacingAfterEveryFourDigits(action.payload.payload),
            state.isCardNumberValid = ccNumberRegex.test(action.payload.payload)
        },
        setCardCvv:(state, action) => {
            state.cvv = action.payload.payload,
            state.isCvvValid = cvvRegex.test(action.payload.payload)
        },
        setCardExp:(state, action) => {
            state.exp = action?.payload?.payload?.length > 2 ? addSlashAfter2Digits(action.payload.payload) : action.payload.payload,
            state.isExpDateValid = expDateRegex.test(action.payload.payload)   
        },
        setCard: (state, action) => {
            state.card = action.payload.card
            state.attemptsToSubmit = state.attemptsToSubmit + 1
        },
        setpaymentCardAdded: (state) => {
            state.paymentCardAdded = true
            
        }
    }
})

export default addCardSlice.reducer;

export const {setCardName, setCardNum, setCardCvv, setCardExp, setCard, setpaymentCardAdded} = addCardSlice.actions

export const selectCardName = (state: any) => state.addCard.name;
export const selectIsCardNumValid = (state: any) => state.addCard.isCardNumberValid;
export const selectCardNum = (state: any) => state.addCard.cardNum;
export const selectCardCvv = (state: any) => state.addCard.cvv;
export const selectIsCvvValid = (state: any) => state.addCard.isCvvValid;
export const selectCardExp = (state: any) => state.addCard.exp;
export const selectIsExpDateValid = (state: any) => state.addCard.isExpDateValid;
export const selectAttemptsToSubmit = (state: any) => state.addCard.attemptsToSubmit;
export const selectPaymentCardAdded = (state: any) => state.addCard.paymentCardAdded