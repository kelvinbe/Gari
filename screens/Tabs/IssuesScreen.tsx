import { StyleSheet, Text, View } from 'react-native'
import React,{useState} from 'react'
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs'
import { BottomTabParamList } from '../../types'
import { makeStyles } from '@rneui/themed'
import BaseInput from '../../components/atoms/Input/BaseInput/BaseInput'
import BaseTextInput from '../../components/atoms/Input/BaseTextInput/BaseTextInput'
import Rounded from '../../components/atoms/Buttons/Rounded/Rounded'
import useToast from '../../hooks/useToast'
import { useAppSelector } from '../../store/store'
import { selectUserProfile } from '../../store/slices/userSlice'
import apiClient from '../../utils/apiClient'
import { ISSUES_ENDPOINT } from '../../hooks/constants'

type Props = BottomTabScreenProps<BottomTabParamList, "Issues">

const useStyles = makeStyles((theme, props: Props)=>({
  container: {
    width: "100%",
    height: "100%",
    backgroundColor: theme.colors.white,
    alignItems: "center",
    justifyContent: "flex-start",
  },
  inputContainer: {
    width: "90%",
    height: "80%",
    paddingTop: 30
  },
  bottomContainer: {
    width: "90%",
    height: "20%",
    alignItems: "center",
    justifyContent: "center",

  }
}))

/**
 * @name saveIssue
 * @description this functionality is local to this screen alone, no need for a dedicated hook
 */

const saveIssue = (complaint: string) => {
  return apiClient.post(ISSUES_ENDPOINT, {
    complaint
  })
}

const IssuesScreen = (props: Props) => {
  const toast = useToast()
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('');

  const reportIssue = () => {
    setLoading(true)
    saveIssue(message).then(()=>{
      toast({
        message: "Issue reported successfully",
        type: "success"
      })
    }).catch((e)=>{
      toast({
        message: "Please try again",
        type: "error"
      })
    }).finally(()=>{
      setLoading(false)
    })
  }
  const styles = useStyles(props)
  return (
    <View style={styles.container} >
      <View style={styles.inputContainer} >
          <BaseTextInput label="Message" placeholder="Write..." value={message} onChangeText={setMessage}/>
      </View>
      <View style={styles.bottomContainer}>
        <Rounded loading={loading} onPress={() => reportIssue()} >
          Submit
        </Rounded>
      </View>
    </View>
  )
}

export default IssuesScreen

const styles = StyleSheet.create({})