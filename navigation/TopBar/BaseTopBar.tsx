import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { makeStyles, ThemeConsumer } from '@rneui/themed'
import { NativeStackHeaderProps } from '@react-navigation/native-stack'
import { StatusBar } from 'expo-status-bar';
import { Button } from '@rneui/base';
import HomeIcon from "../../assets/icons/home.svg";
import { BottomTabHeaderProps } from '@react-navigation/bottom-tabs';
import ChevronLeft from "../../assets/icons/chevron-left.svg";
import { useSelector } from 'react-redux';
import { selectNavState } from '../../store/slices/navigationSlice';

interface IProps {
    title?: string;
    chevronLeft?: boolean;
    home?: boolean;
    onBackPress?: () => void;
    onHomePress?: () => void;
}

type Props = IProps & (BottomTabHeaderProps | NativeStackHeaderProps);

const useStyles = makeStyles((theme, props: Props)=>{
    return {
        container: {
            width: "100%",
            height: 36,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            backgroundColor: theme.colors.white,
            paddingHorizontal: 10
        },
        iconButtonStyle: {
            borderRadius: 4,
            borderColor: theme.colors.grey0?.trim()
        },
        iconButtonContainerStyle: {
            borderRadius: 4,
        },
        titleStyle: {
            fontSize: 16,
            fontWeight: "700", 
 fontFamily: "Lato_700Bold",
            textAlign: "center",
            color: theme.colors.black,
            width: (props.home && props.chevronLeft) ? "80%" : "90%"
        }
    }
})

const BaseTopBar = (props: Props) => {
    const styles = useStyles(props)
    const [currentScreen, previousScreen] = useSelector(selectNavState)

    const goBack = () => {
        if(props.onBackPress){
            props.onBackPress();
        }else{
            props.navigation.goBack();
        }
    }
    const toHome = () => {
        if(props.onHomePress){
            props.onHomePress();
        }else{
            props.navigation.navigate("SearchScreenHome");
        }
    }
  return (
    <ThemeConsumer>
        {({theme})=>(
            <View style={styles.container} >
            {
                props.chevronLeft && <Button onPress={goBack} style={styles.iconButtonContainerStyle} containerStyle={styles.iconButtonContainerStyle} type="outline" buttonStyle={styles.iconButtonStyle} >
                    <ChevronLeft height={12} width={12}  stroke={theme.colors.black} />
                </Button>
            }
            <Text style={styles.titleStyle} >
                { props?.title }
            </Text>
            {(props.home !== false)&& <Button onPress={toHome} style={styles.iconButtonContainerStyle} containerStyle={styles.iconButtonContainerStyle} type="outline" buttonStyle={styles.iconButtonStyle} >
                <HomeIcon height={12} width={12}   stroke={theme.colors.black} fill={theme.colors.black}  />
            </Button>}
        </View>
        )}
    </ThemeConsumer>
  )
}

export default BaseTopBar