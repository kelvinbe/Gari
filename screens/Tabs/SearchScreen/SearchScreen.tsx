import React from 'react';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { SearchScreenParamList } from '../../../types';
import { makeStyles, Text, ThemeConsumer } from '@rneui/themed';
import { View } from 'react-native';
import { Icon, Image } from '@rneui/base';
import InputWithButton from '../../../components/atoms/Input/WithButton/WithButton';
import RoundedOutline from '../../../components/atoms/Buttons/Rounded/RoundedOutline';
import useToast from '../../../hooks/useToast';
import { isEmpty } from 'lodash';
import { useAppDispatch, useAppSelector } from '../../../store/store';
import { setHostCode } from '../../../store/slices/bookingSlice';
import { selectCoords } from '../../../store/slices/searchSlice';
import { location_search } from '../../../utils/utils';
import { closeAuthorizationBottomSheet, closeBottomSheet, closeChooseTime, closePaymentBottomSheet } from '../../../store/slices/mapBottomSheet';
import BannerImage from './BannerImage';


const useStyles = makeStyles((theme, props) => ({
  container: {
    backgroundColor: theme.colors.white,
    alignItems: 'center',
    justifyContent: 'flex-start',
    padding: 0,
    flex: 1
  },
  bottomContentContainerStyle: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingHorizontal: 20,
    height: '100%',
  },
  hostDetailsContainer: {
    width: '100%',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
  },
  helperTextContainer: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'flex-start',
    marginTop: 5,
    flexDirection: 'row',
  },
  helperText: {
    color: theme.colors.grey3,
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '400',
    fontFamily: 'Lato_400Regular',
  },
  helperTextIcon: {
    color: theme.colors.grey3,
    fontSize: 12,
    marginRight: 5,
  },
  orText: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 16,
    fontWeight: '500',
    fontFamily: 'Lato_400Regular',
    color: theme.colors.primary,
    marginVertical: 20,
    textAlign: 'center',
  },
  screenContainerStyles: {
    width: '100%',
    height: '100%',
  },
}));

const SearchScreenHome = (
  props: NativeStackScreenProps<SearchScreenParamList, 'SearchScreenHome'>
) => {
  const styles = useStyles();
  const dispatch = useAppDispatch()
  const toast = useToast();
  const { loading } = useAppSelector(selectCoords)

  
  const hostCodeSearch = async (value: any) => {
    dispatch(closeAuthorizationBottomSheet())
    dispatch(closePaymentBottomSheet())
    dispatch(closeBottomSheet())
    dispatch(closeChooseTime())
    if (isEmpty(value)) return toast({
      message: 'Please enter a host code',
      type: "primary",
      duration: 3000,
    })
    
    await location_search()
    dispatch(setHostCode(value))
    props.navigation.navigate('MapScreen', {
      searchType: 'host',
      hostCode: value,
    });
  };

  const search_locally = async () => {
    dispatch(closeAuthorizationBottomSheet())
    dispatch(closePaymentBottomSheet())
    dispatch(setHostCode(null))
    dispatch(closeChooseTime())
    dispatch(closeBottomSheet())
    try {
      await location_search()
      props.navigation.push('MapScreen', {
        searchType: 'local',
      });
    } catch (e) {
      console.log("An error occured::", e)
      toast({
        message: "Something went wrong, please try again later.",
        type: "primary",
        duration: 3000,
      })
    }
  };

  return (
    <ThemeConsumer>
      {({ theme }) => (
          <View style={styles.container}>
            <BannerImage/>
            <View style={styles.bottomContentContainerStyle}>
              <View style={styles.hostDetailsContainer}>
                <InputWithButton
                  onPress={hostCodeSearch}
                  placeholder="e.g 124589"
                  label="Enter Host Code"
                />
                <View style={styles.helperTextContainer}>
                  <Icon
                    style={styles.helperTextIcon}
                    name="info"
                    type="feather"
                    size={16}
                    color={theme.colors.primary}
                  />
                  <Text style={styles.helperText}>Provided by your Airbnb host</Text>
                </View>
              </View>
              <Text style={styles.orText}>Or</Text>
              <RoundedOutline loading={loading} fullWidth onPress={search_locally}>
                Search Locally
              </RoundedOutline>
            </View>
          </View>
      )}
    </ThemeConsumer>
  );
};

export default SearchScreenHome;
