import { StyleSheet, View, StyleProp, ViewStyle, Text } from 'react-native';
import React, { useState, useEffect } from 'react';
import { makeStyles } from '@rneui/themed';
import Dropdown from '../Dropdown/Dropdown';
import dayjs from 'dayjs';
import { first, isArray, uniq, uniqBy } from 'lodash';
import {
  daysOfTheWeekFromToday,
  isAm,
  timeTilEndOfDay,
  timeTilEndOfNewDay,
} from '../../../utils/utils';

import { selectStartDateTime, selectEndDateTime} from '../../../store/slices/bookingSlice';
import { useSelector } from 'react-redux';


type Props = {
  customStyles?: StyleProp<ViewStyle>;
  setStartDateTime?: (date: string) => void
  setEndDateTime?: (date: string) => void
  displayDay: boolean;
  displayPickup: boolean;
  displayExtendText: boolean;
  defaultStartDateTime?: {label: string, value: string};
  defaultEndDateTime?:  {label: string, value: string};
};

const useStyles = makeStyles(theme => ({
  container: {
    width: '100%',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: 'transparent',
    position: 'absolute',
    top: 0,
    left: 0,
  },
  bottomDropdowns: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginTop: 10,
    elevation: 5,
  },
  dropdown: {
    width: '48%',
  },
}));

const TimeFilter = (props: Props) => {
  const styles = useStyles(props);
  const [viewDayDropdown, setViewDayDropdown] = useState<boolean>(false);
  const [chosenDay, setChosenDay] = useState(0);
  const [ times, setTimes] = useState<{ label: string; value: string }[]>([]);
  const {setStartDateTime, setEndDateTime, defaultStartDateTime, defaultEndDateTime} = props
  const [defaultTime, setDefaultTimes] = useState<{label: string, value: string}>()
  


  const handlePickupTime = (v: any) => {
    props.setStartDateTime && props.setStartDateTime(dayjs(first(v)).format());
  };

  const handleDropOffTime = (v: any) => {
    props.setEndDateTime && props.setEndDateTime(dayjs(first(v)).format());
  };


  useEffect(() => {
    if (chosenDay === 0) {
      setTimes(() => timeTilEndOfDay() as any)
    } else {
      setTimes(() => timeTilEndOfNewDay(chosenDay) as any)
    }
  }, [chosenDay]);



  return (
    <View style={[styles.container, props.customStyles]}>
      {props.displayDay && (
        <Dropdown
          key={times?.length}
          dropdownOpen={setViewDayDropdown}
          defaultValue={defaultStartDateTime ? dayjs(defaultStartDateTime?.value)?.format("dddd") :first(daysOfTheWeekFromToday())?.label}
          items={uniqBy([{
            label: dayjs(defaultStartDateTime?.value)?.format("dddd"),
            value: daysOfTheWeekFromToday().length
            },...daysOfTheWeekFromToday(), ], ({label})=>label)
          }
          onChange={v => {
            setChosenDay(v as any);
          }}
        />
      )}
      <View style={[styles.bottomDropdowns, { display: !viewDayDropdown ? 'flex' : 'none' }]}>
        {props.displayPickup && (
          <View style={[styles.dropdown]}>
            <Dropdown
              key={times?.length}
              items={times}
              onChange={handlePickupTime}
              defaultValue={defaultStartDateTime ? defaultStartDateTime.label : first(times)?.label}
              defaultAdditionalFilter={isAm(defaultStartDateTime ? defaultStartDateTime.value : first(times)?.value) ? 'AM' : 'PM'}
              additionalFilter={['AM', 'PM']}
              filter={(chosenFilter, item)=>{
                if (chosenFilter === 'AM') {
                  return isAm(item?.value);
                } else if (chosenFilter === 'PM') {
                  return !isAm(item?.value);
                }
                return true;
              }}
            />
          </View>
        )}
        {props.displayExtendText && <Text>Change dropoff time to:</Text>}
        <View style={[styles.dropdown]}>
          <Dropdown
            key={times?.length}
            items={times}
            onChange={handleDropOffTime}
            defaultValue={defaultEndDateTime ? defaultEndDateTime.label : first(times)?.label}
            defaultAdditionalFilter={isAm(defaultEndDateTime ? defaultEndDateTime.value : first(times)?.value) ? 'AM' : 'PM'}
            additionalFilter={['AM', 'PM']}
          />
        </View>
      </View>
    </View>
  );
};

export default TimeFilter;

const styles = StyleSheet.create({});
