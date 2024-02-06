import { View } from 'react-native';
import React, { useEffect, useState } from 'react';
import { makeStyles, ThemeConsumer } from '@rneui/themed';
import MapView, { Circle } from 'react-native-maps';
import LocationMarker from '../../../components/atoms/GeoMarkers/LocationMarker/LocationMarker';
import TimeFilter from '../../../components/molecules/TimeFilter/TimeFilter';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { SearchScreenParamList } from '../../../types';
import MapScreenBottomSheet from '../../../components/organisms/MapScreenBottomSheet/MapScreenBottomSheet';
import { PROVIDER_GOOGLE } from 'react-native-maps';
import useBookingActions from '../../../hooks/useBookingActions';
import { first, isEmpty, isUndefined } from 'lodash';
import { timeTilEndOfDay } from '../../../utils/utils';
import dayjs from 'dayjs';
import { useAppSelector } from '../../../store/store';
import { selectCoords, selectVehiclePositions } from '../../../store/slices/searchSlice';
import VehicleMarker from '../../../components/atoms/GeoMarkers/vehicle-marker';
import { selectBottomSheetState } from '../../../store/slices/mapBottomSheet';

interface IProps {
  inReservation?: boolean;
}

type Props = IProps & NativeStackScreenProps<SearchScreenParamList, 'MapScreen'>;

const useStyles = makeStyles((theme, props) => ({
  container: {
    flex: 1,
    position: 'relative',
    backgroundColor: theme.colors.white,
  },
  mapContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  map: {
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

const MapScreen = (props: Props) => {
  const state = useAppSelector(selectBottomSheetState)
  const styles = useStyles();
  const { setStartDateTime, setEndDateTime, clearBookingState} = useBookingActions();
  const [, setOpen] = useState(false);
  const { data: coords } = useAppSelector(selectCoords)
  const { bookingDetails: {start_date_time, end_date_time, code} } = useBookingActions()

  const vehicle_positions = useAppSelector(selectVehiclePositions)
  
  
 
  const onOpen = () => {
    setOpen(true);
  };

  const onClose = () => {
    setOpen(false);
  };

  useEffect(() => {
    if (isUndefined(props.inReservation) && (isEmpty(start_date_time) && isEmpty(end_date_time))) {
      const times = timeTilEndOfDay();
      try {
        setStartDateTime(dayjs(first(times)?.value).toISOString());
        setEndDateTime(dayjs(first(times)?.value).toISOString());

      } catch (e) {
        console.log("Here is the error::", e)
      }
    }
  }, [props.inReservation]);

  return (
    <ThemeConsumer>
      {({ theme }) =>
       (
          <View style={styles.container}>
            <View style={styles.mapContainer}>
             
                <MapView
                  key={vehicle_positions?.data?.length}
                  provider={PROVIDER_GOOGLE}
                  style={{
                    width: '100%',
                    height: '100%',
                  }}
                  // mapType="mutedStandard"
                  initialRegion={{
                    latitude: coords?.latitude || 0,
                    longitude: coords?.longitude || 0,
                    latitudeDelta: 0.005,
                    longitudeDelta: 0.005,
                  }}
                  showsBuildings
                  showsCompass={false}
                  >
                  <Circle
                    center={{
                      latitude: coords?.latitude || 0,
                      longitude: coords?.longitude || 0,
                    }}
                    radius={2500}
                    strokeColor={theme.colors.primary}
                    fillColor={theme.colors.fadedPrimary}
                  />
                  {coords && (
                    <LocationMarker
                      location={coords}
                      title="Current Location"
                      description="This is your current location"
                    />
                  )}

                  {
                    vehicle_positions?.data?.map((coord, i)=>{
                      return (
                        <VehicleMarker
                          key={i}
                          latitude={coord?.latitude ?? 0}
                          longitude={coord?.longitude ?? 0}
                        />
                      )
                    })
                  }
              </MapView>
              
            </View>
            {(props?.inReservation ? false : !state.open) && (
              <TimeFilter
                displayDay={true}
                displayExtendText={false}
                displayPickup={true}
                setStartDateTime={setStartDateTime}
                setEndDateTime={setEndDateTime}
              />
            )}
            <MapScreenBottomSheet
              onClose={onClose}
              onOpen={onOpen}
              inReservation={props.inReservation}
            />
          </View>
        )
      }
    </ThemeConsumer>
  );
};

export default MapScreen;
