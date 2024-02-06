import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { makeStyles, useTheme } from '@rneui/themed'
import React, { useCallback, useMemo, useRef, useState } from 'react'
import { IPayment, IPaymentType, PaymentDetailsScreenParamList } from '../../../../types';
import { ActivityIndicator, View } from "react-native"
import { Divider, Text } from '@rneui/base';
import { useAppDispatch, useAppSelector } from '../../../../store/store';
import { selectUpdatePaymentTypeFeedback, selectUserProfile, updatePaymentType } from '../../../../store/slices/userSlice';
import { FlatList } from 'react-native-gesture-handler';
import PaymentMethod from '../../../../components/atoms/PaymentMethod';
import { BottomSheetView, TouchableOpacity } from '@gorhom/bottom-sheet';
import CCardIcon from '../../../../assets/icons/hero/credit-card.svg'
import { Entypo, FontAwesome5 } from '@expo/vector-icons';
import BottomSheet from '@gorhom/bottom-sheet';
import { isEmpty } from 'lodash';
import Rounded from '../../../../components/atoms/Buttons/Rounded/Rounded';
import RoundedOutline from '../../../../components/atoms/Buttons/Rounded/RoundedOutline';
import useToast from '../../../../hooks/useToast';

interface IProps {

}

type Props = IProps & NativeStackScreenProps<PaymentDetailsScreenParamList, "PaymentDetailsScreenHome"> ;

const useStyles = makeStyles((theme, props: Props)=>({
    container: {
        width: "100%",
        height: "100%",
        backgroundColor: theme.colors.white,
        alignItems: "center",
        justifyContent: "flex-start",
        paddingTop: 30,
        paddingHorizontal: 20,
    },
    paymentMethodsContainer: {
        width: "100%",
    },
    addButtonsContainer: {
        width: "100%",
        marginTop:20
    },
    addButton: {
        width: "100%",
        alignItems: 'center',
        flexDirection: 'row',
        paddingVertical: 10
    },
    buttonText: {
        color: theme.colors.primary,
        fontSize: 16,
        fontWeight: '600',
    },
    addButtonIcon: {
        marginRight: 20
    },
    titleText: {
        fontSize: 20,
        fontWeight: '600',
        color: theme.colors.title,
    },
    updateContainer: {
        width: "100%",
        alignItems: 'center',
        justifyContent: "space-between",
        flexDirection: 'row',
        paddingVertical: 10
    },
    bottomSheetView: {
        flex: 1,
        alignItems: 'center',
        borderTopRightRadius: 20,
        borderTopLeftRadius: 20,
        borderTopWidth: 1,
        borderRightWidth: 1,
        borderLeftWidth: 1,
        borderTopColor: theme.colors.grey0,
        borderLeftColor: theme.colors.grey0,
        borderRightColor: theme.colors.grey0,
        paddingHorizontal: 20,
        paddingVertical: 20
    }
}))

function PaymentDetailsScreenHome(props: Props) {
    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<IPaymentType|null>(null)
    const bottomSheetRef = useRef<BottomSheet>(null)
    const snapPoints = useMemo(()=> ['25%'], [])
    const toast = useToast()
    const dispatch = useAppDispatch()

    const styles = useStyles(props)
    const user = useAppSelector(selectUserProfile)
    const [currentId, setCurrentId] = useState<string>()
    const updateFeedback = useAppSelector(selectUpdatePaymentTypeFeedback)

    const goToMobileMoney = ( ) => {
        props.navigation.push("MobileMoneyDetailsScreen")
    }

    const addCard = () => {
        props.navigation.push("AddCardScreen")
    }

    const { theme } = useTheme()

    const makePrimary = (id?: string) =>{
        setCurrentId(id)
    }

    const onSheetChange = useCallback((index: number)=>{

    },[])

    const choosePaymentMethod = (id?: string) => {
        const paymentMethod = user?.payment_types.find((item)=>item.id === id) ?? null
        setSelectedPaymentMethod(paymentMethod)
        bottomSheetRef.current?.expand()
    }

    const deletePaymentMethod = () => {
        if (selectedPaymentMethod) {
            dispatch(updatePaymentType({
                id: selectedPaymentMethod.id,
                status: "NONACTIVE"
            })).then(()=>{
                bottomSheetRef.current?.close()
                toast({
                    type: "success",
                    message: "Payment Method removed"
                })
            }).catch((e)=>{
                toast({
                    type: "error",
                    message: "Unable to remove Payment Method"
                })
            })
        }
    }

    const closeBottomSheet = () =>{
        bottomSheetRef.current?.close()
    }
    
    

  return (
    <View style={styles.container} >
        <View style={styles.paymentMethodsContainer} >
            <Text style={styles.titleText} >
                Payment Methods
            </Text>
            <FlatList
                data={user?.payment_types}
                keyExtractor={(item, index)=>index.toString()}
                renderItem={({item, index})=>{

                    if (currentId === item.id && updateFeedback.loading) return (
                        <View style={styles.updateContainer} >
                            <Text style={styles.buttonText} >
                                Updating...
                            </Text>
                            <ActivityIndicator color={theme.colors.primary} />
                        </View>
                    )
                    return (
                        <PaymentMethod onLongPress={choosePaymentMethod} onPress={makePrimary} {...item} />
                    )
                }}
                ItemSeparatorComponent={()=><Divider/>}
            />
            <View style={styles.addButtonsContainer} >
                <Text style={styles.titleText} >
                    Add
                </Text>
                <Divider/>
                <TouchableOpacity onPress={addCard} style={styles.addButton} >
                    <CCardIcon style={styles.addButtonIcon}  width={24} height={24} color={theme.colors.primary} />
                    <Text style={styles.buttonText} >
                        Add Credit / Debit Card
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={goToMobileMoney} style={styles.addButton} >
                    <FontAwesome5 style={styles.addButtonIcon} name="sim-card"  size={24} color={theme.colors.primary} />
                    <Text style={styles.buttonText} >
                        Add Mobile Money
                    </Text>
                </TouchableOpacity>
                {/* TODO: uncoment once implementation is in place <TouchableOpacity onPress={()=>{
                    console.log("Pending implementation")
                }} style={styles.addButton} >
                    <Entypo style={styles.addButtonIcon} name="paypal" size={24} color={theme.colors.primary} />
                    <Text style={styles.bottonText} >
                        Add Paypal Account
                    </Text>
                </TouchableOpacity> */}
            </View>
        </View>
        {!isEmpty(selectedPaymentMethod) && <BottomSheet
            ref={bottomSheetRef}
            snapPoints={snapPoints}
            onChange={onSheetChange}
            onClose={()=>{
                setSelectedPaymentMethod(null)
            }}
            enablePanDownToClose={true}
        >
            <BottomSheetView style={styles.bottomSheetView} >
                <Text style={[styles.titleText, {
                    marginBottom: 20,
                    width: "100%",
                }]} >
                    What would you like to do?
                </Text>
                <View style={{
                    width: "100%",
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    flexDirection: 'row'
                }} >
                    
                    <Rounded loading={updateFeedback?.loading} onPress={deletePaymentMethod} width={"40%"} >
                        Remove
                    </Rounded>
                    <RoundedOutline onPress={closeBottomSheet} width={"40%"} >
                        Cancel
                    </RoundedOutline>
                </View>
            </BottomSheetView>
        </BottomSheet>}
    </View>
  )
}

export default PaymentDetailsScreenHome