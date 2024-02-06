import { StyleSheet, Text, View } from 'react-native'
import React, { useEffect } from 'react'
import { makeStyles, useTheme } from '@rneui/themed'
import { StatusBar } from 'expo-status-bar'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useSelector } from 'react-redux'
import { selectNavState } from '../../../store/slices/navigationSlice'
import { isUndefined } from 'lodash'

const screens = {
    hiddenStatusBar: [ "SearchScreenHome"],
    coloredStatusBar: {
        "ProfileScreenHome": "primary"
    }
}

interface IProps {
    statusBarBackgroundColor?: string
    statusBarStyle?: 'light' | 'dark'
    backgroundColor?: string
    children?: React.ReactNode
    insetTop?: boolean
}

type Props = IProps

const useStyles = makeStyles((theme, props: Props)=>{
    return {
        safeAreaContainer: {
            backgroundColor: props.backgroundColor || theme.colors.white,
            flex: 1
        },
        backgroundContainer: {
            // backgroundColor: props.statusBarBackgroundColor || theme.colors.white,
            flex: 1,
        },
    }
})

const CustomSafeAreaView = (props: Props) => {
    const styles = useStyles(props)
    const insets = useSafeAreaInsets()
    const [currentScreen, previousScreen] = useSelector(selectNavState)
    const { theme } = useTheme()

    const hasStatusBar = () =>{
        if(screens.hiddenStatusBar.includes(currentScreen)){
            return false
        }
        return true
    }

    const isColoredStatusBar = () =>{
        if(!isUndefined((screens.coloredStatusBar as any)?.[currentScreen])){
            return true
        }
        return false
    }

    const getStatusBarColor = () =>{
        if(isColoredStatusBar()){
            return (theme?.colors as any)?.[(screens.coloredStatusBar as any)[currentScreen]]
        }
        return props.statusBarBackgroundColor || theme.colors.white
    }

  return (
    <View style={[styles.backgroundContainer,{
        backgroundColor: getStatusBarColor(),
        paddingTop: hasStatusBar() ? insets.top : 0,
        paddingBottom: currentScreen === 'ProfileScreenHome' ? 0 : insets.bottom,
        paddingLeft: insets.left,
        paddingRight: insets.right,
    }]} >
        <StatusBar style={props.statusBarStyle || "dark"} />
        <View style={styles.safeAreaContainer} >
            {props.children}
        </View>
        {
            currentScreen === 'ProfileScreenHome' && <View style={{height: insets.bottom, backgroundColor: theme.colors.white}} />
        }
    </View>
  )
}

export default CustomSafeAreaView

const styles = StyleSheet.create({})