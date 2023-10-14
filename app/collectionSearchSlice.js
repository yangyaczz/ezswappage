import { createSlice } from '@reduxjs/toolkit';

export const collectionSearchSlice = createSlice({
    name: 'collectionSearchStatus',
    initialState: {
        value: false,
    },
    reducers: {
        increment: (state) => {
            state.value = true;
        },
        decrement: (state) => {
            state.value = false;
        }
    },
});

// 为每个 case reducer 函数生成 Action creators
export const { increment, decrement, incrementByAmount } = collectionSearchSlice.actions;

export default collectionSearchSlice.reducer;
