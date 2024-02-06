import { Image, Text } from '@rneui/base';
import { makeStyles } from '@rneui/themed'
import React from 'react'
import { TouchableOpacity, View } from "react-native"
import { ICardPaymentMethod, IPaymentMethod } from '../../../types';

interface IProps {
    onCardPress?: (id?: string) => void;
}

export type CardProps = IProps & IPaymentMethod<ICardPaymentMethod> ;

const useStyles = makeStyles((theme, props: CardProps)=> {
    return ({
        container: {

        },
        creditCardContainer: {
            backgroundColor: theme.colors.background3,
            paddingVertical: 18,
            paddingHorizontal: 20,
            borderRadius: 15,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            elevation: 2,
            width: "100%"
        },
        creditCardName: {
            color: theme.colors.black,
            fontSize: 17,
            fontWeight: "700", 
 fontFamily: "Lato_700Bold",
        },
        rightSection: {
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
        },
        creditCardIcon: {
            width: 32,
            height: 24,
            marginRight: 10
        },
        textStyle: {
            fontSize: 13,
            color: theme.colors.black,
            fontWeight: "700", 
 fontFamily: "Lato_700Bold",

        }
    })
})

function CreditCard(props: CardProps) {
    const { nameOnCard, brand, last4 }  = props.details 
    const styles = useStyles(props)

    const onPress = () =>{
        props.onCardPress && props.onCardPress()
    }

  return (
    <TouchableOpacity onPress={onPress} style={styles.creditCardContainer} >
        <Text style={styles.creditCardName} >
            { nameOnCard }
        </Text>
        <View style={styles.rightSection} >
            {/* 
                @todo: add card type icons
            */}
            <Image
                source={require("../../../assets/images/visa.png")}
                style={styles.creditCardIcon}
            />
            <Text style={styles.textStyle} >
                ****{last4}
            </Text>
        </View>
    </TouchableOpacity>
  )
}

export default CreditCard