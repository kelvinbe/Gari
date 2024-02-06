import { Text, View } from 'react-native'
import React, { useEffect, useMemo, useState} from 'react'
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { UserOnboardingParamList } from '../../../types';
import { Image, Input, makeStyles, ThemeConsumer } from '@rneui/themed';
import Rounded from '../../../components/atoms/Buttons/Rounded/Rounded';
import BaseInput from '../../../components/atoms/Input/BaseInput/BaseInput';
import useLocation from '../../../hooks/useLocation';
import SelectDropdown from '../../../components/organisms/select-dropdown';
import { DropdownData } from '../../../components/organisms/select-dropdown/types';
import { isEmpty } from 'lodash';
import { z } from 'zod';
import useToast from '../../../hooks/useToast';
import { useAppDispatch, useAppSelector } from '../../../store/store';
import { selectUpdateProfile, selectUserFeedback, selectUserProfile, updateUserData } from '../../../store/slices/userSlice';
import Loading from '../../../components/molecules/Feedback/Loading/Loading';


const useStyles = makeStyles((theme) => {
  return ({
    container: {
      flex: 1,
      backgroundColor: "white",
      alignItems: "center",
      justyifyContent: "space-between",
      padding: 20
    },
    namesContainer: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      width: "100%",
      paddingVertical: 20
    },
    nameInput: {
      width: "48%"
    },
    locationInfo: {
      width: "100%",
      alignItems: "flex-start",
      justifyContent: "flex-start",
      marginTop: 20
    },
    infoText: {
      fontSize: 16,
      fontWeight: "700",
    },
    dropdown: {
      width: "100%",
      borderColor: theme.colors.primary
    },
    serachBox: {
      borderColor: theme.colors.primary,
      marginTop: 20
    },
    bottomContainer: {
      flex: 1,
      height: "100%",
      width: "100%",
      alignItems: "center",
      justifyContent: "flex-end",
    }
  })
})

interface IProps {
  goToApp: () => void;
  goToLogin: () => void;
}


type Props = NativeStackScreenProps<UserOnboardingParamList, "OnboardingHome"> & IProps;

const dataSchema = z.object({
  fname: z.string().nonempty(),
  lname: z.string().nonempty(),
  market_id: z.string().uuid(),
  sub_market_id: z.string().uuid(),
  phone: z.string().optional()
})

const Onboarding = (props: Props) => {
  const dispatch = useAppDispatch()
  const toast = useToast()
  const styles = useStyles(props)
  const user = useAppSelector(selectUserProfile)
  const fetchFeedback = useAppSelector(selectUserFeedback)
  const updateFeedback = useAppSelector(selectUpdateProfile)
  const { navigation, route, goToApp } = props;
  const { markets, subMarkets, fetchMarkets, fetchSubMarkets } = useLocation()
  const [market, setMarket] = useState<DropdownData<string, string>|null>(user?.market_id ? {
    key: user?.market_id ?? "",
    value: user?.market?.name ?? ""
  } :null)
  const [subMarket, setSubMarket] = useState<DropdownData<string, string>|null>(user?.sub_market_id ? {
    key: user?.sub_market_id ?? "",
    value: user?.sub_market?.name ?? ""
  } :null)
  const [fname, setFname] = useState<string>(user?.fname ?? "")
  const [lname, setLname] = useState<string>(user?.lname ?? "")
  const [phone, setPhone] = useState<string>(user?.phone ?? "")

  const countries = useMemo(()=>markets?.data?.map((market)=>{
    return {
      key: market?.id,
      value: market?.name
    } as DropdownData<string,string>
  }), [markets?.loading])


  const sub_markets = useMemo(()=>subMarkets?.data?.map((subMarket)=>{
    return {
      key: subMarket?.id,
      value: subMarket?.name
    } as DropdownData<string,string>
  }), [subMarkets?.loading])

  useEffect(()=>{
      fetchMarkets()
  }, [,markets?.error])


  useEffect(()=>{
    if(!isEmpty(market?.key)) {
      fetchSubMarkets(market?.key)
    }
  }, [market?.key])

  const handleSubmit = () => {
    const parsed = dataSchema.safeParse({
      fname,
      lname,
      market_id: market?.key,
      sub_market_id: subMarket?.key
    })

    if(parsed.success) {

      const data = parsed.data

      const for_update = {
        fname: data.fname === user?.fname ? undefined : data.fname,
        lname: data.lname === user?.lname ? undefined : data.lname,
        market_id: data.market_id === user?.market_id ? undefined : data.market_id,
        sub_market_id: data.sub_market_id === user?.sub_market_id ? undefined : data.sub_market_id,
        phone: data.phone === user?.phone ? undefined : data.phone
      }

      const valid_changes  = Object.values(for_update).filter((value)=>value !== undefined)

      if(valid_changes.length === 0) {
        goToApp()
      }else{
        dispatch(updateUserData(for_update)).unwrap()
        .then(()=>{
          goToApp()
        })
        .catch((err)=>{
          toast({
            type: "error",
            message: "Something went wrong"
          })
        })
      }
      
    } else {
      toast({
        type: "error",
        message: "Please fill all fields"
      })
    }
  }

  return (
    <ThemeConsumer>
      {({ theme }) => (
        <View style={styles.container}>
          <View style={styles.namesContainer} >
            <BaseInput
              containerStyle={{
                width: "48%",
                borderRadius: 10
              }}
              placeholder='First Name'
              label="First Name"
              value={fname}
              onChangeText={setFname}
            />
            <BaseInput
              containerStyle={{
                width: "48%",
                borderRadius: 10,
                marginVertical: 10
              }}
              placeholder='Last Name'
              label="Last Name"
              value={lname}
              onChangeText={setLname}
            />
          </View>
          <BaseInput
              containerStyle={{
                width: "100%",
                borderRadius: 10
              }}
              placeholder='Phone Number(Optional)'
              label="Phone Number"
              value={phone}
              onChangeText={setPhone}
            />
          <View style={styles.locationInfo}>
            <Text style={styles.infoText} >
              Select your current location
            </Text>
            <SelectDropdown
                data={countries ?? []}
                placeholder={"Select a country"}
                selected={market}
                setSelected={setMarket}
                searchOptions={{ cursorColor: theme.colors.primary }}
                searchBoxStyles={styles.serachBox}
                dropdownStyles={styles.dropdown}
            />
            <SelectDropdown
              disabled={isEmpty(market)}
              data={sub_markets ?? []}
              placeholder={"Select a city"}
              selected={subMarket}
              setSelected={setSubMarket}
              searchOptions={{ cursorColor: theme.colors.primary }}
              searchBoxStyles={styles.serachBox}
              dropdownStyles={styles.dropdown}
            />
          </View>
          <View style={styles.bottomContainer} >
            <Rounded
              disabled={
                !dataSchema.required().safeParse({
                  fname,
                  lname,
                  market_id: market?.key,
                  sub_market_id: subMarket?.key,
                  phone: "__optional__"
                }).success
              }
              onPress={handleSubmit}
              loading={updateFeedback?.loading}
            >
              Continue
            </Rounded>
          </View>
        </View>
      )}
    </ThemeConsumer>

  )
}


const PreOnboarding = (props: Props) => {
  const feedback = useAppSelector(selectUserFeedback)
  const {markets, fetchMarkets} = useLocation()

  useEffect(()=>{
    fetchMarkets()
  }, [])

  if(feedback?.loading || markets?.loading) {
    return <Loading/>
  }

  return <Onboarding {...props}/>
}

/**
 * Memoize component to prevent unnecessary re-renders
 */
export default React.memo(PreOnboarding)
