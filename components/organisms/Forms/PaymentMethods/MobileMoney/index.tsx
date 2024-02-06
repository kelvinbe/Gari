import { StyleSheet, Text, View } from 'react-native'
import React, { useState } from 'react'
import useToast from '../../../../../hooks/useToast'
import { makeStyles } from '@rneui/themed'
import BaseInput from '../../../../atoms/Input/BaseInput/BaseInput'
import Rounded from '../../../../atoms/Buttons/Rounded/Rounded'
import { useAddPaymentMethodMutation } from '../../../../../store/slices/billingSlice'
import { useAppDispatch } from '../../../../../store/store'
import { useTheme } from '@rneui/themed'
import { fetchUserData } from '../../../../../store/slices/userSlice'
import SelectDropdown from '../../../select-dropdown'
import { DropdownData } from '../../../select-dropdown/types'
import { useMaskedInputProps } from 'react-native-mask-input'

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


const useStyles = makeStyles((theme, props) => ({
    container: {
        flex: 1,
        backgroundColor: theme.colors.white,
        alignItems: "center",
        justifyContent: "space-between",
        paddingTop: 10,
        width: "100%"
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

interface details {
    phone_number: number,
    type: string
}

interface IProps {
    onDone?: (data: details | null, error?: string ) => void 
}

const MobileMoneyForm = (props: IProps) => {
    const { onDone } = props
    const toast = useToast()
    const styles = useStyles(props)
    const [addPaymentMethod, { isLoading, isError }] = useAddPaymentMethodMutation()
    const dispatch = useAppDispatch()
    const [mpesa_number, set_mpesa_number] = useState<string | undefined>()
    const { theme } = useTheme()
    const [selected, setSelected] = useState<DropdownData<string, string>>({
        key: "M-Pesa",
        value: "MPESA"
    })

    const maskedInputProps = useMaskedInputProps({
        value: mpesa_number,
        onChangeText: (v)=>set_mpesa_number(v?.replaceAll("-", "")),
        mask: PHONE_NUMBER,
        placeholderFillCharacter: ' ',
    })

    const handleAddPaymentMethod = async () => {
        const number = parseInt(mpesa_number?.replace("+", "") ?? "")
        if (isNaN(number)) return toast({
            message: "Invalid phone number",
            type: "primary"
        })
        await addPaymentMethod({
            phone_number: number,
            type: selected.value
        }).then(() => {
            onDone?.({
                phone_number: number,
                type: selected.value
            })
            dispatch(fetchUserData(null))
        }).catch(() => {
            onDone?.(null, "An error occured")
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

export default MobileMoneyForm