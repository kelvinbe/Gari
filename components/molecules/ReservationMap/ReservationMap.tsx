import { Text, View } from 'react-native';
import React, { useEffect } from 'react';
import { makeStyles, ThemeConsumer } from '@rneui/themed';
import MapView, { Circle } from 'react-native-maps';
import Rounded from '../../../components/atoms/Buttons/Rounded/Rounded';
import LocationMarker from '../../../components/atoms/GeoMarkers/LocationMarker/LocationMarker';
import { PROVIDER_GOOGLE } from 'react-native-maps';
import useBookingActions from '../../../hooks/useBookingActions';
import { useAppSelector } from '../../../store/store';
import { selectCoords } from '../../../store/slices/searchSlice';
import { location_search } from '../../../utils/utils';
import { isEmpty } from 'lodash';

const useStyles = makeStyles(theme => ({
  map: {
    backgroundColor: theme.colors.white,
    width: '100%',
    height: '100%',
  },
  statusContainer: {
    width: '100%',
    height: '100%',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.white,
  },
  errorText: {
    color: theme.colors.error,
    fontSize: 16,
    lineHeight: 16,
    textAlign: 'center',
    fontWeight: '500',
    fontFamily: 'Lato_400Regular',
    width: '100%',
  },
  loadingText: {
    color: theme.colors.title,
    fontSize: 16,
    lineHeight: 16,
    textAlign: 'center',
    fontWeight: '500',
    fontFamily: 'Lato_400Regular',
  },
}));

const ReservationMap = () => {
  const styles = useStyles();
  const { clearBookingState } = useBookingActions();
  const data = useAppSelector(selectCoords)

  const getCoords = async () => {
    await location_search()
  };

  useEffect(() => {
    if(isEmpty(data?.data)){

      location_search()
    }
    return () => {
      clearBookingState();
    };
  }, []);

  return (
    <ThemeConsumer>
      {({ theme }) =>
        data.loading ? (
          <View style={[styles.statusContainer]}>
            <Text style={[styles.loadingText]}>Loading...</Text>
            <Rounded onPress={getCoords}>Refetch</Rounded>
          </View>
        ) : data.error ? (
          <View style={styles.statusContainer}>
            <Text style={styles.errorText}>Something went wrong</Text>
          </View>
        ) : (
          <View>
            <View>
                <MapView
                  provider={PROVIDER_GOOGLE}
                  style={styles.map}
                  initialRegion={{
                    latitude: data?.data?.latitude || 0,
                    longitude: data?.data?.longitude || 0,
                    latitudeDelta: 0.005,
                    longitudeDelta: 0.005,
                  }}>
                  <Circle
                    center={{
                      latitude: data?.data?.latitude || 0,
                      longitude: data?.data?.longitude || 0,
                    }}
                    radius={5000}
                    strokeColor={theme.colors.primary}
                    fillColor={theme.colors.fadedPrimary}
                  />
                  {data?.data && (
                    <LocationMarker
                      location={data?.data}
                      title="Current Location"
                      description="This is your current location"
                    />
                  )}
                </MapView>
            
            </View>
          </View>
        )
      }
    </ThemeConsumer>
  );
};

export default ReservationMap;
