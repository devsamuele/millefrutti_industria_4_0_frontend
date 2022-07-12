import { configureStore } from '@reduxjs/toolkit'
import spindryerReducer from "./spindryer"
import pasteurizerReducer from "./pasteurizer"

export default configureStore({
    reducer: {
        spindryer: spindryerReducer,
        pasteurizer: pasteurizerReducer
    },
})