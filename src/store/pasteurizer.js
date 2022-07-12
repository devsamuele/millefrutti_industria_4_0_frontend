import { createSlice } from '@reduxjs/toolkit'

export const workSlice = createSlice({
    name: 'pasteurizer',
    initialState: {
        list: [],
    },
    reducers: {
        set: (state, action) => {
            state.list = [...action.payload]
        },
        add: (state, action) => {
            state.list = [action.payload, ...state.list]
        },
        update: (state, action) => {
            const updatedList = state.list.map((work) => {
                if (action.payload.id !== work.id) {
                    return work
                } else {
                    return action.payload
                }
            })
            state.list = [...updatedList]
        },
        updateMany: (state, action) => {
            let updatedMap = {}
            state.list.forEach((oldWork) => {
                console.log(oldWork.id)
                updatedMap[oldWork.id] = oldWork
                action.payload.forEach((work) => {
                    if (oldWork.id === work.id) {
                        updatedMap[oldWork.id] = work
                    }
                })
            })
            const updatedList = Object.values(updatedMap)
            state.list = [...updatedList]
        },
        remove: (state, action) => {
            const updatedList = state.list.filter((work) => {
                return work.id !== action.payload
            })
            state.list = [...updatedList]
        },
    }
})

export const { set, add, remove, update, updateMany } = workSlice.actions
export default workSlice.reducer