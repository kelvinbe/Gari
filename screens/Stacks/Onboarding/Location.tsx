import { Text, View, Image } from 'react-native'
import React, { useEffect, useMemo, useState } from 'react'
import { NativeStackScreenProps } from '@react-navigation/native-stack'
import { UserOnboardingParamList } from '../../../types'
import { makeStyles, ThemeConsumer } from '@rneui/themed'
import useLocation from '../../../hooks/useLocation'
import { isEmpty, isNull } from 'lodash'
import Rounded from '../../../components/atoms/Buttons/Rounded/Rounded'
import useOnBoarding from '../../../hooks/useOnBoarding'
import { DropdownData } from '../../../components/organisms/select-dropdown/types'
import SelectDropdown from '../../../components/organisms/select-dropdown'

type IProps = NativeStackScreenProps<UserOnboardingParamList, "Location">


const useStyles = makeStyles((theme) => {
  return ({
    container: {
      flex: 1,
      backgroundColor: "white",
      alignItems: "center",
      paddingHorizontal: 20,
      justifyContent: "space-between",
      paddingTop: 40
    },
    dropdown: {
      width: "100%",
      borderColor: theme.colors.primary
    },
    serachBox: {
      borderColor: theme.colors.primary
    },
    selectContainer: {
      marginBottom: 20,
      width: "100%"
    },
    infoText: {
      color: theme.colors.primary,
      fontSize: 16,
      textAlign: "left",
      fontWeight: "400",
      fontFamily: "Lato_400Regular"
    },
    topSection: {
      justifyContent: "center",
      alignItems: "center",
      width: "100%",
    },
    bottomSection: {
      justifyContent: "center",
      alignItems: "center"
    },
    logoContainer: {
      width: '100%',
      alignItems: 'center',
      justifyContent: 'center',
      marginTop: 20,
      marginBottom: 20,
    },
    bottomTextContainer: {
      width: '100%',
      fontSize: 16,
      fontWeight: '500',
      fontFamily: 'Lato_400Regular',
      textAlign: 'center',
      letterSpacing: 0.1,
      marginBottom: 20
    },
    title: {
      color: theme.colors.title,
      fontSize: 22,
      fontWeight: '700',
      fontFamily: 'Lato_700Bold',
      marginBottom: 10,
    }
  })
})

const Location = (props: IProps) => {
  const styles = useStyles(props)
  const { navigation } = props
  const [country, setCountry] = useState<DropdownData<string, string> | null>(null)
  const [city, setCity] = useState<DropdownData<string, string> | null>(null)
  const { markets, subMarkets,  fetchMarkets, fetchSubMarkets} = useLocation(country?.key)
  const { setLocation, setCompleted } = useOnBoarding()
  const countries = useMemo(() => {
    if (!isEmpty(markets.error) || markets.loading || isNull(markets.data)) return []
    return markets.data.map((market) => {
      return {
        key: market.id,
        value: market.name
      }
    })
  }, [,markets.loading, markets.error])

  useEffect(()=>{
    fetchMarkets()
  }, [])

  useEffect(()=>{
    if (!isEmpty(country)) {
      fetchSubMarkets(country.key)
    }
  }, [country?.key])



  const cities = useMemo(() => {
    if (!isEmpty(subMarkets.error) || subMarkets.loading || isNull(subMarkets.data)) return []
    return subMarkets.data.map((subMarket) => {
      return {
        key: subMarket.id,
        value: subMarket.name
      }
    })
  }, [,subMarkets.loading, subMarkets.error, country])

  useEffect(()=>{
    if (!isEmpty(country) && !isEmpty(city)) {
      setLocation({
        market_id: country.key,
        sub_market_id: city.key
      })
    }
  }, [country, city])


  /**
   * @name handleContinue
   * @description Handles the continue button press
   */
  const handleContinue = () => {
    setCompleted({
      location: true
    })
    navigation.push("OnboardingHome")
  }

  return (
    <ThemeConsumer>
      {({ theme }) => {
        return (
          <View
            style={styles.container}
          >
            <View 
              style={styles.topSection}
            >
              <Text style={styles.bottomTextContainer}>
                Select your country and city 
              </Text>
              <View
              style={styles.selectContainer}
            >
              <SelectDropdown
                data={countries}
                placeholder={"Select a country"}
                selected={country}
                setSelected={setCountry}
                searchOptions={{ cursorColor: theme.colors.primary }}
                searchBoxStyles={styles.serachBox}
                dropdownStyles={styles.dropdown}
              />
            </View>
            <View style={styles.selectContainer} >
              <SelectDropdown
                disabled={isEmpty(country)}
                data={cities}
                placeholder={"Select a city"}
                selected={city}
                setSelected={setCity}
                searchOptions={{ cursorColor: theme.colors.primary }}
                searchBoxStyles={styles.serachBox}
                dropdownStyles={styles.dropdown}
                />
            </View>
            </View>
                
            <View style={styles.bottomSection} >
                <Rounded
                   disabled={
                    isEmpty(country) || isEmpty(city)
                   }
                   onPress={handleContinue}
                >
                  Done
                </Rounded>
            </View>
          </View>
        )
      }}
    </ThemeConsumer>

  )
}

export default Location
