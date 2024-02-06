import { StyleSheet, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { makeStyles, useTheme } from '@rneui/themed'
import BaseInput from '../../../../components/atoms/Input/BaseInput/BaseInput';
import Rounded from '../../../../components/atoms/Buttons/Rounded/Rounded';
import { useAddPaymentMethodMutation } from '../../../../store/slices/billingSlice';
import { useAppDispatch, useAppSelector } from '../../../../store/store';
import { fetchUserData } from '../../../../store/slices/userSlice';
import { isNaN } from 'lodash';
import useToast from '../../../../hooks/useToast';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { PaymentDetailsScreenParamList } from '../../../../types';
import { DropdownData } from '../../../../components/organisms/select-dropdown/types';
import SelectDropdown from '../../../../components/organisms/select-dropdown';
import { useMaskedInputProps } from 'react-native-mask-input'
import { selectCurrentFlow, setFlow } from '../../../../store/slices/flowstack';
import * as Linking from 'expo-linking';

const PHONE_NUMBER = [
    '0',
    '7',
    /\d/,
    /\d/,
    '-',
    /\d/,
    /\d/,
    /\d/,
    '-',
    /\d/,
    /\d/,
    /\d/,
];
  

interface IProps {

}

type Props = IProps & NativeStackScreenProps<PaymentDetailsScreenParamList, "MobileMoneyDetailsScreen">;

const useStyles = makeStyles((theme, props: Props)=>({
    container: {
        flex: 1,
        backgroundColor: theme.colors.white,
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: 20,
        paddingTop: 10
    },
    inputContainerStyle: {
        marginTop: 30,
        width: "100%",
    },
    bottomContainer: {
        width: "90%",
        height: "20%",
        alignItems: "center",
        justifyContent: "center",
    },
    dropdown: {
      width: "100%",
      borderColor: theme.colors.primary,
      marginBottom: 20
    },
    serachBox: {
      borderColor: theme.colors.primary
    },
    selectContainer: {
      marginBottom: 20,
      width: "100%"
    },
}))

const MobileMoneyDetails = (props: Props) => {
    const toast = useToast()
    const styles = useStyles(props)
    const [addPaymentMethod, {isLoading, isError}] = useAddPaymentMethodMutation()
    const dispatch = useAppDispatch()
    const [mpesa_number, set_mpesa_number] = useState<string|undefined>()
    const { theme } = useTheme()
    const [selected, setSelected] = useState<DropdownData<string, string>>({
        key: "M-Pesa",
        value: "MPESA"
    })
    const current_flow = useAppSelector(selectCurrentFlow)

    const maskedInputProps = useMaskedInputProps({
        value: mpesa_number,
        onChangeText: (v)=>set_mpesa_number(v?.replaceAll("-", "")),
        mask: PHONE_NUMBER,
        placeholderFillCharacter: ' ',
    })
    
    
    const handleAddPaymentMethod = async () =>{
        const number = parseInt(mpesa_number?.replace("+", "") ??"")


        if(isNaN(number)) return toast({
            message: "Invalid phone number",
            type: "primary"
        }) 
        await addPaymentMethod({
            phone_number: number,
            type: selected.value
        }).then(()=>{
            dispatch(fetchUserData(null))
            if(current_flow === 'add_payment_method') {
                dispatch(setFlow(null))
                Linking.openURL(Linking.createURL("/map"))
                return
            }
            props.navigation.goBack()
        }).catch(()=>{
            toast({
                message: "Please try again",
                type: "error"
            })
        })
    }
    

  return (
    <View style={styles.container} >
        <View style={{width: "100%"}} >
            <SelectDropdown
            data={[
                {
                    key: "M-Pesa",
                    value: "MPESA"
                },
                {
                    key: "MTN Mobile Money",
                    value: "MTN"
                }
            ]}
            selected={selected}
            setSelected={setSelected}
            placeholder={"Select a Mobile Money Provider"}
            searchOptions={{ cursorColor: theme.colors.primary }}
            searchBoxStyles={styles.serachBox}
            dropdownStyles={styles.dropdown}
            />
            <View style={styles.inputContainerStyle} >
                <BaseInput 
                    {...maskedInputProps}
                    label="Phone Number"
                    placeholder='07XX-XXX-XXX'
                    keyboardType="numbers-and-punctuation"
                />
            </View>
        </View>
        <View style={styles.bottomContainer} >
            <Rounded
                loading={isLoading}
                onPress={handleAddPaymentMethod}
            >
                Done
            </Rounded>
        </View>
    </View>
  )
}

export default MobileMoneyDetails

const styles = StyleSheet.create({})