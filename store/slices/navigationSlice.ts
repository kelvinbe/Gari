import { createSlice } from "@reduxjs/toolkit";
import { RootState } from ".";


const initialState: {
    displayBottomNav: boolean,
        screens: {
            current?:string,
            previous?: string,
            history?: string[]
        }
} = {
    displayBottomNav: true,
    screens: {
        current: "",
        previous: "",
        history: []
    }
}

const navigationSlice = createSlice({
    name: "navigationSlice",
    initialState: initialState,
    reducers: {
        hideBottomNav: state => {
            state.displayBottomNav = false;
        },
        showBottomNav: state => {
            state.displayBottomNav = true;
        },
        setNavScreens: (state, action) => {
            state.screens = {
                current: action.payload.current,
                previous: action.payload.previous,
                history: [
                    ...(state.screens.history || []),
                    action.payload.current
                ] 
            }
        },
    }
})

export default navigationSlice.reducer;

// actions
export const {hideBottomNav, showBottomNav, setNavScreens} = navigationSlice.actions;

// selectors
export const selectDisplayBottomNav = (state: any) => state.navigation.displayBottomNav;

export const selectPreviousScreen = (state: any) => state.navigation.screens.previous;

export const selectCurrentScreen = (state: any) => state.navigation.screens.current;

export const selectScreenHistory = (state: any) => state.navigation.screens.history;

export const selectNavState = (state: RootState) => [
    state.navigation.screens.current,
    state.navigation.screens.previous,
    state.navigation.screens.history
]