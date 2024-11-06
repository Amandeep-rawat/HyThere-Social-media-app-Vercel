import { configureStore } from "@reduxjs/toolkit";
import authSlice from "./authSlice.js"
import { combineReducers } from "@reduxjs/toolkit";
import {
    persistReducer,
    FLUSH,
    REHYDRATE,
    PAUSE,
    PERSIST,
    PURGE,
    REGISTER,
} from 'redux-persist'
import storage from 'redux-persist/lib/storage'


// new
import postSlice from "./postSlice.js"
import socketSlice from "./socketSlice.js"
import chatSlice from "./chatSlice.js"
import rtnSlice from "./RTnotification.js"

const persistConfig = {
    key: 'root',
    version: 1,
    storage,
}

// create this by yoruself;
const rootReducer = combineReducers(
    { auth: authSlice,post:postSlice, socketIo:socketSlice,chat:chatSlice,realTimeNotification:rtnSlice}
    
)

const persistedReducer = persistReducer(persistConfig, rootReducer)

const store = configureStore({
    // reducer:{
    //     // slice
    //     auth:authSlice

    // }


    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
            },
        }),

});
export default store;