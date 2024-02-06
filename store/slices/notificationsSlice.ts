import { IToast } from './../../types';
import { createSlice } from '@reduxjs/toolkit';

interface IState {
    messages: IToast[],
    expoToken:string,
    allowNotifications:boolean,
    notification:object
}

const initialState: IState = {
    messages: [],
    expoToken:'',
    allowNotifications:false,
    notification:{},
}

const notificationSlice = createSlice({
    name: "notifications",
    initialState,
    reducers: {
        saveExpoToken: (state, action) => {
            state.expoToken = action.payload
        },
        setAddNotification:(state,action) => {
            state.notification = action.payload
        },
        addMessage: (state, action) => {
            state.messages.push({...action.payload, id: Date.now()});
        },
        removeMessage: (state, action) => {
            state.messages = state.messages.filter(message => message.id !== action.payload);
        },
        clearMessages: (state) => {
            state.messages = [];
        },
        setAllowNotifications: (state) => {
            state.allowNotifications = !state.allowNotifications
        }   
    }
})

//actions
export const { addMessage, removeMessage, clearMessages, saveExpoToken, setAllowNotifications, setAddNotification  } = notificationSlice.actions;

//reducer
export default notificationSlice.reducer;

//selectors
export const selectMessages = (state: any) => state.notifications.messages;

export const selectCurrentMessage = (state: any) => state.notifications.messages[0];

export const selectExpoToken = (state:any) => state.notifications.expoToken;

export const selectAllowNotifications = (state:any) => state.notifications.allowNotifications;

export const selectNotification = (state:any) => state.notifications.notification;