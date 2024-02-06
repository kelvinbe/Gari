import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { makeStyles, ThemeConsumer } from '@rneui/themed'
import { NativeStackHeaderProps } from '@react-navigation/native-stack'
import { StatusBar } from 'expo-status-bar';
import { Button } from '@rneui/base';
import ChevronLeft from "../../../../assets/icons/chevron-left.svg";

interface IProps {
    title?: string;
}

type Props = IProps & NativeStackHeaderProps;

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
            width: "90%"
        }
    }
})

const TopBar = (props: Props) => {
    const styles = useStyles(props)

    const goBack = () => {
        props.navigation.navigate("ProfileScreenHome")
    }
  return (
    <ThemeConsumer>
        {({theme})=>(
            <View style={styles.container} >
            <Button onPress={goBack} style={styles.iconButtonContainerStyle} containerStyle={styles.iconButtonContainerStyle} type="outline" buttonStyle={styles.iconButtonStyle} >
                <ChevronLeft stroke={theme.colors.black} height={12} width={12}  />
            </Button>
            <Text style={styles.titleStyle} >
                { props?.title }
            </Text>
        </View>
        )}
    </ThemeConsumer>
  )
}

export default TopBar

const styles = StyleSheet.create({})