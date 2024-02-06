import { Dimensions, StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { NativeStackScreenProps } from '@react-navigation/native-stack'
import { UserOnboardingParamList } from '../../../types'
import { makeStyles } from '@rneui/themed'
import Logo from '../../../components/atoms/Brand/Logo'
import Stack from '../../../components/atoms/containers/Stack'
import { CheckBox } from '@rneui/base'
import Rounded from '../../../components/atoms/Buttons/Rounded/Rounded'
import useOnBoarding from '../../../hooks/useOnBoarding'

interface IProps {

}

type Props  =  IProps & NativeStackScreenProps<UserOnboardingParamList, "SelectPaymentMethod">


const useStyles = makeStyles((theme, props: Props)=>{
    return {
        container: {
            flex: 1,
            backgroundColor: "white",
            paddingHorizontal: 20,
            width: "100%",
            height: Dimensions.get("screen").height,
            alignItems: "center",
            justifyContent: "space-between",
            paddingTop: 40
        },
        topContainer: {
            width: "100%",
        },
        topText: {
            width: '100%',
            fontSize: 20,
            fontWeight: '700',
            fontFamily: 'Lato_700Bold',
            textAlign: 'center',
            letterSpacing: 0.1,
            marginBottom: 20,
            marginTop: 20
        },
        stack: {
            width: "100%",
        },
        checkboxText: {
            color: theme.colors.title,
            fontSize: 16,
            fontWeight: '400',
            fontFamily: 'Lato_400Regular',
            textAlign: 'left',
            letterSpacing: 0.1,

        },
        bottom: {
            width: "100%",
            alignItems: "center",
            justifyContent: "center",
        }
    }
})

const SelectPaymentMethod = (props: Props) => {

    const styles = useStyles(props)
    const [paymentMethodType, setPaymentMethodType] = useState<"mobile_money"| "cash" | "card">("card")
    const { payment_method_added } = props.route.params
    const { setPaymentMethod, paymentMethod, setCompleted } = useOnBoarding()
    

    useEffect(()=>{
        switch (paymentMethodType){
            case "cash":
                setPaymentMethod({
                    type: "cash",
                    details: null
                })
            case "mobile_money":
                setPaymentMethod({
                    type: "mobile_money",
                    details: null
                })
            case "card":
                setPaymentMethod({
                    type: "card",
                    details: null
                })
        }
    }, [paymentMethodType])
   

    const handlePress = () => {
        switch (paymentMethodType){
            case "card":{
                !payment_method_added && props.navigation.navigate("SelectedPaymentMethod", {
                    payment_method: "card"
                })
                payment_method_added && setCompleted({
                    payment_method: true
                })
                payment_method_added && props.navigation.navigate("OnboardingHome")
                break;
            }
            case "cash":{
                setCompleted({
                    payment_method: true
                })
                props.navigation.navigate("OnboardingHome")
                break;
            }
            case "mobile_money":{
                !payment_method_added && props.navigation.navigate("SelectedPaymentMethod", {
                    payment_method: "mobile_money"
                })
                payment_method_added && setCompleted({
                    payment_method: true
                })
                payment_method_added && props.navigation.navigate("OnboardingHome")
                break;
            }
        }
    }

  return (
    <View
        style={styles.container}
    >
        <View
            style={styles.topContainer}
        >
            <View
                style={styles.stack}
            >
                <CheckBox
                    checked={paymentMethodType === "card"}
                    checkedIcon="dot-circle-o"
                    uncheckedIcon="circle-o"
                    title={<Text
                        style={styles.checkboxText}
                    >
                        Credit/Debit Card
                    </Text>}
                    onPress={()=> setPaymentMethodType("card")}
                />
                <CheckBox
                    checked={paymentMethodType === "mobile_money"}
                    checkedIcon="dot-circle-o"
                    uncheckedIcon="circle-o"
                    title={
                        <Text
                            style={styles.checkboxText}
                        >
                            Mobile Money
                        </Text>
                    }
                    onPress={()=> setPaymentMethodType("mobile_money")}
                />
                <CheckBox
                    checked={paymentMethodType === "cash"}
                    checkedIcon="dot-circle-o"
                    uncheckedIcon="circle-o"
                    title={
                        <Text
                            style={styles.checkboxText}
                        >
                            Cash
                        </Text>
                    }
                    onPress={()=> setPaymentMethodType("cash")}
                />
            </View>
        </View> 
        <View style={styles.bottom} >
            <Rounded
                onPress={handlePress}
            >
                {
                    paymentMethodType === "card" ? payment_method_added ? "Continue" : 
                    "Add Card" : paymentMethodType === 'mobile_money' ? payment_method_added ? "Continue" :
                    "Add Mobile Money" : "Continue"
                }
            </Rounded>
        </View>
            
        
        
    </View>
  )
}

export default SelectPaymentMethod
