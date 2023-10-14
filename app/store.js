import { configureStore } from '@reduxjs/toolkit';
import collectionSearchReducer, {collectionSearchSlice} from './collectionSearchSlice';

export default configureStore({
    reducer: {
        collectionSearchStatus: collectionSearchReducer,
    },
});
