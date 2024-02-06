import { ActivityIndicator, Text, View } from 'react-native'
import React, { useEffect, useMemo, useState } from 'react'
import { NativeStackScreenProps } from '@react-navigation/native-stack'
import { ProfileScreenParamList } from '../../../types'
import { makeStyles, ThemeConsumer } from '@rneui/themed'
import useLocation from '../../../hooks/useLocation'
import { isEmpty, isNull } from 'lodash'
import { useAppDispatch, useAppSelector } from '../../../store/store'
import { selectUserProfile } from '../../../store/slices/userSlice'
import { updateUserData } from '../../../store/slices/userSlice'
import useToast from '../../../hooks/useToast'
import { DropdownData } from '../../../components/organisms/select-dropdown/types'
import SelectDropdown from '../../../components/organisms/select-dropdown'

type IProps = NativeStackScreenProps<ProfileScreenParamList, "UserLocation">


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

const UserLocation = (props: IProps) => {
  const toast = useToast()
  const user = useAppSelector(selectUserProfile)
  const dispatch = useAppDispatch()
  const styles = useStyles(props)
  const [loading, setLoading] = useState(false)

  // countries are used interchangeably with markets
  const [country, setCountry] = useState<DropdownData<string, string> | null>(user?.market ? {
    key: user?.market_id ?? "",
    value: user?.market?.name ?? ""
  } : null)

  // submarkets are used interchangeably with cities
  const [sub_market, set_sub_market] = useState<DropdownData<string, string> | null>(user?.sub_market ? {
    key: user?.sub_market_id ?? "",
    value: user?.sub_market?.name ?? ""
  }: null)

  // get markets and submarkets
  const { markets, subMarkets, fetchMarkets, fetchSubMarkets } = useLocation(country?.key)

  useEffect(() => {
    if (!isEmpty(country)) {
      fetchSubMarkets(country.key)
    }
  }, [country?.key])

  useEffect(() => {
    fetchMarkets()
  }, [])



  const countries = useMemo(() => {
    if (!isEmpty(markets.error) || markets.loading || isNull(markets.data)) return []
    return markets.data.map((market) => {
      return {
        key: market.id,
        value: market.name
      }
    })
  }, [markets.loading, markets.error])



  const cities = useMemo(() => {
    if (!isEmpty(subMarkets.error) || subMarkets.loading || isNull(subMarkets.data)) return []
 
    return subMarkets.data.map((subMarket) => {
      return {
        key: subMarket.id,
        value: subMarket.name
      }
    })
  }, [subMarkets.loading, subMarkets.error])

  useEffect(()=>{
    if (!isEmpty(country) && !isEmpty(sub_market)) {
        // if nothing chaes
        if(country?.key === user?.market_id && sub_market?.key === user?.sub_market_id) return ()=>{}

        // if the user changes the country and the city is the same
        if(country?.key !== user?.market_id && sub_market?.key === user?.sub_market_id) {
            set_sub_market(null)
            return ()=>{}
        }
        setLoading(true)
        dispatch(updateUserData({
            market_id: country?.key,
            sub_market_id: sub_market?.key
        })).unwrap().catch(()=>{
            toast({
                message: "Unable to update your location",
                type: "error"
            })
        }).finally(()=>{
            setLoading(false)
        })
    }
  }, [country, sub_market])



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
                Change your location
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
              {country ? <SelectDropdown
                data={cities}
                placeholder={"Select a city"}
                selected={sub_market}
                setSelected={set_sub_market}
                searchOptions={{ cursorColor: theme.colors.primary }}
                searchBoxStyles={styles.serachBox}
                dropdownStyles={styles.dropdown}
                />: <Text
                style={styles.infoText}
               >
                Select a country first
                </Text>}
            </View>
            </View>
            <View style={styles.bottomSection} >
                {loading && <ActivityIndicator
                    size="large"
                    color={theme.colors.primary}
                />}
            </View>
          </View>
        )
      }}
    </ThemeConsumer>

  )
}

export default UserLocation
