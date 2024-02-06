import { View } from 'react-native';
import React, { useState, useEffect } from 'react';
import { Slider, Text, makeStyles } from '@rneui/themed';
import { InspectionQuestion, UpcomingParamList } from '../../../types';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import VehicleInspectionQuery from '../../../components/organisms/input/VehicleInspectionQuery/VehicleInspectionQuery';
import { FlatList } from 'react-native-gesture-handler';
import Rounded from '../../../components/atoms/Buttons/Rounded/Rounded';
import RoundedOutline from '../../../components/atoms/Buttons/Rounded/RoundedOutline';
import useBookingActions from '../../../hooks/useBookingActions';
import { isEmpty } from 'lodash';
import { useAppDispatch, useAppSelector } from '../../../store/store';
import { selectVehicleInspection } from '../../../store/slices/vehicleInspectionSlice';
import { selectUpdateInspectionFeedback, updateInspection } from '../../../store/slices/bookingSlice';
import useToast from '../../../hooks/useToast';
import { ScrollView } from 'react-native';
import useDimensions from '../../../hooks/useDimensions';

type Props = NativeStackScreenProps<UpcomingParamList, 'VehicleInspection'> 

interface State {
  description: string | null,
  option: 'yes' | 'no' | null,
  images: string[] | null,
  takenPictureUploading: boolean
  chosenPictureUploading: boolean
}

const useStyles = makeStyles((theme) => {
  return {
    container: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'space-between',
      backgroundColor: theme.colors.white,
      paddingHorizontal: 20,
      paddingTop: 30
    },
    questionsContainer: {
      width: '100%',
      alignItems: 'center',
      justifyContent: 'flex-start',
    },
    formContainer: {
      width: '100%',
      alignItems: 'flex-start',
      justifyContent: 'flex-start'
    },
    sliderContainer: {
      width: '100%',
      alignItems: 'flex-start',
      margin: 0,
      padding: 0
    },
    sliderText: {
      fontSize: 16,
      fontWeight: "600",
    },
    actionsContainer: {
      width: '100%',
      paddingVertical: 20,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center'
    },
    thumbStyle: {
      width: 20,
      height: 20,
    }
  };
});

/**
 * -------------------- The questions
 */
const qn1 = 'Is available and present at location?'
const qn2 = 'Any vehicle damage?'
const qn3 = 'Any vehicle scratches?'

const VehicleInspection = (props: Props) => {
  const feedback = useAppSelector(selectUpdateInspectionFeedback)
  const { bookingDetails: { inspection, reservation_id} } = useBookingActions()
  const toast = useToast()
  const dispatch = useAppDispatch()
  const getOption = (question: string) => {
    return inspection?.questions?.find(({question: q})=>q === question)?.option ?? null
  }

  const getDescription = (question: string) => {
    return inspection?.questions?.find(({question: q})=>q === question)?.description ?? null
  }

  const getImages = (question: string) => {
    return inspection?.questions?.find(({question: q})=>q === question)?.images ?? null
  }

  const [inspectionDetails, setInspectionDetails] = useState<{
      question: string,
      state: State,
      index: number
    }[]>([// this is gonna  be a tuple since we know what questions are gonna be asked
    {
      question: qn1,
      state: {
        description: null,
        option: null,
        images: null,
        takenPictureUploading: false,
        chosenPictureUploading: false
      },
      index: 1
    },
    {
      question: qn2,
      state: {
        description: null,
        option: null,
        images: null,
        takenPictureUploading: false,
        chosenPictureUploading: false
      },
      index: 2
    },
    {
      question: qn3,
      state: {
        description: null,
        option: null,
        images: null,
        takenPictureUploading: false,
        chosenPictureUploading: false
      },
      index: 3 
    },
  ])
  const [fuel, setFuel] = useState(inspection?.fuel ?? 0)

  useEffect(()=>{
    if (isEmpty(inspection?.id)) return ()=>{}
    setInspectionDetails(prevState=>{
      const newState = prevState.map((item)=>{
        if(item.question === qn1){
          return {
            ...item,
            state: {
              ...item.state,
              option: getOption(qn1),
              description: getDescription(qn1),
              images: getImages(qn1)
            }
          }
        }
        if(item.question === qn2){
          return {
            ...item,
            state: {
              ...item.state,
              option: getOption(qn2),
              description: getDescription(qn2),
              images: getImages(qn2)
            }
          }
        }
        if(item.question === qn3){
          return {
            ...item,
            state: {
              ...item.state,
              option: getOption(qn3),
              description: getDescription(qn3),
              images: getImages(qn3)
            }
          }
        }
        return item
      })
      return newState
    })
  }, [,inspection?.id])

  const setFuelValue = (val: number) => {
    setFuel(parseFloat(val.toFixed(1)))
  }

  const onContinue = () =>{
    const questions = inspectionDetails.map(({question, state})=>({
      question,
      option: state.option,
      description: state.description,
      images: state.images
    })) as InspectionQuestion[]
    dispatch(updateInspection({
      questions,
      fuel
    })).then(()=>{
      props.navigation.navigate('ReservationDetails', reservation_id ? {
        id: reservation_id 
      }: undefined)
    }).catch((e)=>{
        toast({
          type: 'error',
          message: 'An error occured while updating inspection'
        })
    })
  } 

  const onBack = () =>{
    props.navigation.navigate('UpcomingReservationsHome')
  }

  const styles = useStyles(props);
  const { screenWidth } = useDimensions()
  return (
    <View style={styles.container} >
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.formContainer} >
        {
          inspectionDetails?.map((item, index)=>(
            <VehicleInspectionQuery
              key={index}
              question={item.question}
              initData={item.state}
              index={item.index}
              containerStyle={{
                marginBottom: 20
              }}
              onChanges={(state)=>{
                setInspectionDetails(prevState=>{
                  const newState = prevState.map((item)=>{
                    if(item.index === state.index){
                      return {
                        ...item,
                        state
                      }
                    }
                    return item
                  })
                  return newState
                })
              }}
            />
          ))
        }
        <View style={styles.sliderContainer} >
          <Text>
            How much fuel is left?
          </Text>
          <Slider
            style={{ width: screenWidth, height: 40 }}
            maximumValue={65}
            thumbTintColor="#E63B2E"
            minimumTrackTintColor="#E63B2E"
            onValueChange={setFuelValue}
            thumbStyle={styles.thumbStyle}
            value={fuel}
          />
          <Text>
            {fuel} liters
          </Text>
        </View>
      </ScrollView>
      <View style={styles.actionsContainer} >
        <Rounded
          width="40%"
          loading={feedback?.loading}
          onPress={onContinue}
          >
          Continue
        </Rounded>
        <RoundedOutline width="40%" onPress={onBack} >
          Back
        </RoundedOutline>
      </View>
    </View>
  );
};

export default VehicleInspection;
