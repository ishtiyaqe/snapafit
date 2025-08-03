import { configureStore, createSlice } from '@reduxjs/toolkit';

const authSlice = createSlice({
    name: 'auth',
    initialState: { user: null },
    reducers: {
        loginSuccess: (state, action) => {
            state.user = action.payload;
        },
        logoutSuccess: state => {
            state.user = null;
        },
    },
});

export const { loginSuccess, logoutSuccess } = authSlice.actions;

export const store = configureStore({
    reducer: {
        auth: authSlice.reducer,
    },
});
