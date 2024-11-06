import { createSlice } from "@reduxjs/toolkit";
const rtnSlice=createSlice({
    name:'realTimeNotification',
    initialState:{
        likeNotification:[],
        messageNotification:[],
    },
    reducers:{
        setLikeNotification:(state,action)=>{
            if((action.payload.type)=== 'like'){
                state.likeNotification.push(action.payload);
            }
            else if(action.payload.type==='dislike'){
                state.likeNotification=state.likeNotification.filter((item)=>item.userId!==action.payload.userId)
            }
        },
        resetNotifications: (state) => {
            state.likeNotification = []; // Clear all notifications
        },
        
    }
})

export const {setLikeNotification,resetNotifications}=rtnSlice.actions;
export default rtnSlice.reducer;