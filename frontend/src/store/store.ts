import {configureStore} from "@reduxjs/toolkit";
import userSlice from "../api/auth";
import resultsSlice from "../api/util"

export default configureStore({
    reducer: {
        user: userSlice,
        results: resultsSlice
    }
});