import React from 'react'
import { IToast } from '../types'
import { useDispatch } from 'react-redux'
import { addMessage } from '../store/slices/notificationsSlice'

const useToast = () => {
    const dispatch = useDispatch()
    const toast = (toast: IToast) => {
        dispatch(addMessage(
            toast
        ))
    }
  return toast
}

export default useToast
