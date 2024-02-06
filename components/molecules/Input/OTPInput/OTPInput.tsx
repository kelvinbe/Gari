import { StyleSheet, Text, View, KeyboardAvoidingView } from 'react-native'
import React, { useReducer, useEffect } from 'react'
import { makeStyles } from '@rneui/themed'
import { Input } from '@rneui/base'

interface IProps {
    otpLength: number,
    onChange?: (otp: string) => void,
}

type Props = IProps;


const useStyles = makeStyles((theme, props)=>{
    return ({
        container: {
            width: "100%",
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: "row",
        },
        inputContainerStyle: {
            width: 45,
            height: 45,
            borderRadius: 5,
            borderWidth: 1,
            borderColor: theme.colors.primary,
            alignItems: 'center',
            justifyContent: 'center',
            marginRight: 5,
            padding: 0,
            margin: 0,
            marginTop: 20
        },
        inputStyle: {
            fontSize: 24,
            fontWeight: "400", 
            fontFamily: "Lato_400Regular",
            color: theme.colors.black,
            width: 40,
            height: 40,
            padding: 0,
            margin: 0,
            borderWidth: 0,
            marginTop: 15
        },
        errorStyle: {
            margin: 0,
            padding: 0,
            backgroundColor: "red"
        }
    })
})

interface IReducerState {
    value: string[],
    refs: any[]
}

const initialState: IReducerState = {
    value: [],
    refs: []
}

const reducer = (state: IReducerState, action: any) => {
    switch (action.type) {
        case 'ADD':
            return {
                ...state,
                value: [...state.value, action.payload]
            }
        case 'REMOVE':
            return {
                ...state,
                value: state.value.slice(0, state.value.length - 1)
            }
        case 'ADD_REF':
            console.log("payload", action.payload)
            return {
                ...state,
                refs: [...state.refs, action.payload]
            }
        case 'REMOVE_REF':
            return {
                ...state,
                refs: state.refs.slice(0, state.refs.length - 1)
            }
        default:
            return state
    }
}


const OTPInput = (props: Props) => {

const styles = useStyles()
    const [{value, refs}, dispatchAction] = useReducer(reducer, initialState)

    const handleEntry = (index: number, value: string) => {
        if(value.length > 0 ){
            dispatchAction({type: 'ADD', payload: value})
            if(index < (props.otpLength || 6) - 1){
                refs?.[index]?.blur()
                refs?.[index + 1]?.focus()
            }
        }
        if(value.length === 0){
            dispatchAction({type: 'REMOVE'})
            if(index > 0){
                refs?.[index]?.blur()
                refs?.[index - 1]?.focus()
            }
        }
    }

    useEffect(()=>{ 
        if(value?.length === (props.otpLength || 6)){
           props.onChange && props.onChange(value.join(""))
        }
    }, [value?.length])

  return (
    <KeyboardAvoidingView style={styles.container} >
        {
            [...Array(props.otpLength || 6)].map((_, index) => (
                <Input
                    key={index}
                    ref={(input: any)=>{
                        if(refs?.length < 6){
                            dispatchAction({type: 'ADD_REF', payload: input})
                        }
                        // dispatchAction({type: 'ADD_REF', payload: input})
                    }}
                    onChangeText={(value)=>{
                        handleEntry(index, value)
                    }}

                    onKeyPress={(e)=>{
                        if(e.nativeEvent.key === "Backspace"){
                            handleEntry(index, "")
                        }
                    }}

                    containerStyle={styles.inputContainerStyle}
                    inputStyle={styles.inputStyle}
                    errorStyle={styles.errorStyle}
                    style={{
                        padding: 0,
                        margin: 0,
                        textAlign: "center",
                        borderWidth: 0
                    }}
                    inputContainerStyle={{
                        padding: 0,
                        margin: 0,
                        borderWidth: 0
                    }}
                    maxLength={1}
                    keyboardType="numbers-and-punctuation"
                />)
            )
        }
      
    </KeyboardAvoidingView>
  )
}

export default OTPInput

const styles = StyleSheet.create({})