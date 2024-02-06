import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { Icon, makeStyles, ThemeConsumer, withTheme } from '@rneui/themed'
import { Button, ButtonProps, RneFunctionComponent, Theme } from '@rneui/base'
import { LoadIcon } from '../../../../utils/loadIcons';


interface IIconProps {
    name: string;
    size?: number;
    color?: string;
    iconType?: string;
    onClick?: () => void
}

interface IProps {
    children?: React.ReactElement | React.ReactElement[];
    shadow?: boolean;

}

type Props = IProps & ButtonProps & IIconProps & { theme?: Theme };
const useStyles = makeStyles((theme, props: Props)=>{

    return ({
        buttonStyle: {
            backgroundColor: "#ffffff",
            borderRadius: 12,
            borderWidth: props?.shadow ? 0 : 1,
            borderColor: "#e5e5e5",
            alignItems: 'center',
            justifyContent: 'center',
            overflow: 'hidden',
            padding: 10,
            width: 50,
            height: 50
        },
    })
})

const IconButton = (props: Props) => {
    const styles = useStyles(props)
  return (
    <Button raised={props.shadow} onPress={props.onPress}  containerStyle={[props.containerStyle, {
            backgroundColor: "#ffffff",
            borderRadius: 12,
    }]} style={props.style} buttonStyle={styles.buttonStyle}  >
        {props?.children ?  props?.children : <Icon name={props.name} type={props.iconType}  color={props?.theme?.colors.stroke}  />}
    </Button>
  )
}

export default withTheme(IconButton)

const styles = StyleSheet.create({})