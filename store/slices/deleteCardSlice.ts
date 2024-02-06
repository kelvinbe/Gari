import { createSlice} from "@reduxjs/toolkit";

const initialState:{
    isDeleted:boolean,
}={
    isDeleted:false
}

const deleteCardSlice = createSlice({
    name:'deleteCardSlice',
    initialState:initialState,
    reducers:{
        setDeleteCard: (state) => {
            state.isDeleted = true
        }
    }
})

export default deleteCardSlice.reducer;

export const {setDeleteCard} = deleteCardSlice.actions

export const selectIsDeleted = (state: any) => state.deleteCard.isDeleted;