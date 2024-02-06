import {  Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { makeStyles, ThemeConsumer} from '@rneui/themed'
import { NativeStackScreenProps } from '@react-navigation/native-stack'
import { ProfileScreenParamList, UserOnboardingParamList } from '../../../types'
import ImageUploader from '../../../components/atoms/ImageUploader'
import useOnBoarding from '../../../hooks/useOnBoarding'
import { FontAwesome } from '@expo/vector-icons'
import Rounded from '../../../components/atoms/Buttons/Rounded/Rounded'
import { isEmpty } from 'lodash'
import StepIndicator from 'react-native-step-indicator'
import useUserAuth from '../../../hooks/useUserAuth'
import useEditDriversLicense from '../../../hooks/useEditDriversLicense'


interface Props {

}

type IProps = Props & NativeStackScreenProps<ProfileScreenParamList, "DriverLicenseScreen">


const useStyles = makeStyles((theme, props: IProps) => {
  return {
    container: {
      flex: 1,
      backgroundColor: "white",
      justifyContent: "space-between",
      paddingHorizontal: 20,
      paddingTop: 40
    },
    topContainer: {
      width: "100%",
      alignItems: "center",
      justifyContent: "flex-start",
    },
    bottomContainer: {
      width: "100%",
      alignItems: "center",
      justifyContent: "space-between",
    },
    stepsSection: {
      width: "100%",
      alignItems: "center",
      justifyContent: "flex-start",
    },
    steps: {
      width: "100%",
      alignItems: "flex-start",
      justifyContent: "flex-start",
    },
    description: {
      alignItems: "flex-start",
      justifyContent: "flex-start",
      height: "100%",
      width: "100%",
    },
    descriptionText: {
      fontSize: 18,
      fontWeight: "400",
      fontFamily: "Lato_400Regular",
      letterSpacing: 0.1,
      color: theme.colors.title
    },
    stepIndicatorContainer: {
      height: 250,
      marginBottom: 20
    },
    stepLabel: {
      fontSize: 18,
      fontWeight: "400",
      fontFamily: "Lato_400Regular",
      letterSpacing: 0.1,
      color: theme.colors.title
    },
    stepLabelText: {
      fontSize: 18,
      fontWeight: "400",
      fontFamily: "Lato_400Regular",
      letterSpacing: 0.1,
    },
    stepLabelContainer: {
      alignItems: "flex-start",
      justifyContent: "flex-start",

    }
  }
})

const DriversLicense = (props: IProps) => {

  const { userProfile  } = useUserAuth()
  const { setLicence, driversLicense, setCompleted } = useOnBoarding()


  const styles = useStyles()
  const [currentStep, setCurrentStep] = useState<number>(0)
  const [init_image, setInitImage] = useState<string>("")

  const { updateDriverCredentials, loading, error } = useEditDriversLicense()
  const handleSave = () => {
    setCompleted({
      drivers_license: true
    })
      props.navigation.navigate("ProfileScreenHome")
  }

  useEffect(() => {
    if (currentStep === 0) {
      setInitImage(userProfile?.DriverCredentials?.drivers_licence_front ?? "")
    } else if (currentStep === 1) {
      setInitImage(userProfile?.DriverCredentials?.drivers_licence_back ?? "") 
    }
  }, [currentStep])


  return (
    <ThemeConsumer>
      {({ theme }) => (
        <View style={styles.container} >


          <View style={styles.topContainer} >
            <ImageUploader
              getImage={(image) => {
                setLicence(image, currentStep === 0 ? "front" : "back")
                if (currentStep === 0) {
                  setCurrentStep(1)
                }
              }}
              customIcon={
                <FontAwesome
                  name="drivers-license-o"
                  size={100}
                />
              }
              title={
                currentStep === 0 ? "Upload Front" : "Upload Back"
              }
              image={init_image}
            />
          </View>
          <View style={styles.bottomContainer} >
            <View style={styles.stepsSection} >
              <View style={styles.stepIndicatorContainer} >
                <StepIndicator
                  direction='vertical'
                  currentPosition={currentStep}
                  labels={[
                    "Front",
                    "Back"
                  ]}
                  onPress={setCurrentStep}


                  renderLabel={({ currentPosition, label, }) => {
                    return (
                      <View
                        style={styles.stepLabelContainer}
                      >
                        <Text style={styles.stepLabel} >
                          {label}
                        </Text>
                        <Text style={styles.stepLabelText} >
                          {
                            currentPosition === 0 ? "Take a picture of the front of your drivers license" : "Take a picture of the back of your drivers license"
                          }
                        </Text>
                      </View>

                    )
                  }}
                  stepCount={2}
                />
              </View>
            </View>
            <Rounded
              onPress={handleSave}
              loading={loading}
            >
              Done
            </Rounded>
          </View>


        </View>
      )}
    </ThemeConsumer>

  )
}

export default DriversLicense
