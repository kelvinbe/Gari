import { createSlice } from "@reduxjs/toolkit";

interface IProps {
  email: string;
  name: string;
  pictureUrl:string;
  edited: boolean;
}

const initialState: IProps = {
  email: '',
  name: '',
  pictureUrl:'',
  edited: false,
};
const editProfileSlice = createSlice({
  name: 'edit',
  initialState,
  reducers: {
    _setEmail: (state, action) => {
      state.email = action.payload.email;
      state.edited = action.payload.email !== action.payload.prev
    },
    _setName: (state, action) => {
      state.name = action.payload.name;
      state.edited = action.payload.name !== action.payload.prev
    },
    _setPictureUrl: (state, action) => {
      state.pictureUrl = action.payload.pictureUrl;
      state.edited = action.payload.pictureUrl !== action.payload.prev
    },
  },
});
export const { _setEmail, _setName, _setPictureUrl } = editProfileSlice.actions;

export const editReducer = editProfileSlice.reducer;