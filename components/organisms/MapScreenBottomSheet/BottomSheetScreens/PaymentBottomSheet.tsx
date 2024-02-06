import { StyleSheet, Text, View } from 'react-native';
import React, { useEffect, useRef, useState } from 'react';
import BottomSheet from '@gorhom/bottom-sheet';
import { makeStyles, ThemeConsumer } from '@rneui/themed';
import { FlatList } from 'react-native-gesture-handler';
import useBookingActions from '../../../../hooks/useBookingActions';
import useToast from '../../../../hooks/useToast';
import { useAppDispatch, useAppSelector } from '../../../../store/store';
import { selectUserProfile } from '../../../../store/slices/userSlice';
import PaymentMethod from '../../../atoms/PaymentMethod';
import Divider from '../../../atoms/Divider/Divider';
import { isEmpty } from 'lodash'
import AccordionButton from '../../../atoms/Buttons/AccordionButton/AccordionButton';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import * as Linking from 'expo-linking'
import { flow_names, setFlow } from '../../../../store/slices/flowstack';
import { IPaymentType } from '../../../../types';

interface IProps {
  closeBottomSheet?: () => void;
  hasSelected?: Boolean;
}

type Props = IProps;

const useStyles = makeStyles((theme, props: Props) => {
  return {
    container: {},
    backdropContainer: {
      backgroundColor: 'rgba(0, 0, 0, 0.3)',
    },
    backgroundStyle: {
      width: '100%',
      height: '100%',
      backgroundColor: theme.colors.white,
    },
    contentContainer: {
      width: '100%',
      height: '100%',
      padding: 20,
    },
    contentTitleStyle: {
      width: '100%',
      fontWeight: '700',
      fontFamily: 'Lato_700Bold',
      fontSize: 20,
      marginBottom: 20,
    },
    cardsContainer: {
      width: '100%',
      flex: 1,
    },
    emptyContainer: {
      width: '100%'
    },
    infoText: {
      fontSize: 16
    },
    bottomSection: {
      width: '100%',
      alignItems: 'center'
    }
  };
});

const PaymentBottomSheet = (props: Props) => {
  const bottomSheetRef = useRef<BottomSheet>(null);
  const snapPoints = ['50%'];
  const styles = useStyles(props);
  const { setPaymentType } = useBookingActions();
  const user = useAppSelector(selectUserProfile)
  const toast = useToast()
  const [activePaymentMethod, setActivePaymentMethod] = useState<string>()
  const dispatch = useAppDispatch()

  const close = () => {
    bottomSheetRef.current?.close();
    props.closeBottomSheet && props.closeBottomSheet();
  };

  const handleGetStarted = () => {
    dispatch(setFlow('add_payment_method'))
  }

  const handlePaymentSelect = (pt_id: any) => {
    const paymentType = user?.payment_types?.find(({id})=>pt_id === id)
    if (paymentType) {
      setPaymentType(paymentType)
      close()
    }else{
      toast({
        message: "Payment type not found",
        type: "error"
      })
    }
  };

  const addPaymentMethod = () => {
    dispatch(setFlow('add_payment_method'))
    Linking.openURL(Linking.createURL('/payment-details'))
  }

  const payWithCash = () => {
    setPaymentType({
      type: "CASH",
    } as Partial<IPaymentType>)
    close()
  }

  useEffect(()=>{
    if(!isEmpty(activePaymentMethod)){
      handlePaymentSelect(activePaymentMethod)
    }
  }, [activePaymentMethod])

  /**
   * Need more clarification on switching payment methods
   */

  return (
    <ThemeConsumer>
      {({ theme }) => (
        <BottomSheet
          ref={bottomSheetRef}
          snapPoints={snapPoints}
          index={0}
          containerStyle={styles.backdropContainer}
          backgroundStyle={styles.backgroundStyle}
          onClose={props.closeBottomSheet}
          enablePanDownToClose>
          <View style={styles.contentContainer}>
            <Text style={styles.contentTitleStyle}>Select payment method</Text>
            {
              isEmpty(user?.payment_types) ? 
                <View style={styles.emptyContainer} > 
                  <Text style={styles.infoText}>You haven't added a payment method yet!</Text>
                  <AccordionButton
                    title="Get started"
                    onPress={addPaymentMethod}
                    icon={<Feather name="credit-card" size={24} color={theme.colors.grey1} />}
                    customStyles={{
                      paddingHorizontal: 0,
                      paddingVertical: 0,
                      borderWidth: 1,
                      borderColor: theme.colors.iconPrimary,
                      borderRadius: 10,
                      marginTop: 20,
                    }}
                    
                  />
                </View>
                :
                <FlatList
                  showsVerticalScrollIndicator={false}
                  data={user?.payment_types}
                  keyExtractor={(item) => item.id}
                  renderItem={({item: pm, index})=>(
                    <PaymentMethod isActive={pm.id === activePaymentMethod} onPress={setActivePaymentMethod} key={index} {...pm} />
                  )}
                  ItemSeparatorComponent={()=> <Divider/>}
                />

            }
            <View style={styles.bottomSection} >
              <Text>
                Or
              </Text>
              <AccordionButton
                    title="Pay with cash"
                    onPress={payWithCash}
                    icon={<MaterialCommunityIcons name="cash" size={24} color="black" />}
                    customStyles={{
                      paddingHorizontal: 0,
                      paddingVertical: 0,
                      borderWidth: 1,
                      borderColor: theme.colors.iconPrimary,
                      borderRadius: 10,
                      marginTop: 20,
                    }}
                    
                  />
            </View>
          </View>
        </BottomSheet>
      )}
    </ThemeConsumer>
  );
};

export default PaymentBottomSheet;

const styles = StyleSheet.create({});
