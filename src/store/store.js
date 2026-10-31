import { configureStore, createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { isEmptyGoods } from '../utils/isEmptyGoods';
import { fetchGoods } from '../api/api';

const KEY = '00000000-0000-0000-0000-000000000001';

export const FetchStatus = {
  Idle: 'idle',
  Loading: 'loading',
  Success: 'success',
  Error: 'error',
}

export const searchGoods = createAsyncThunk(
  'goods/search',
  async (goodsID, { rejectWithValue, signal }) => {
    try {
      const data = await fetchGoods({ key: KEY, number: goodsID }, signal);
      if (data.error) return rejectWithValue({ status: 200, message: data.error });
      return data.goods;
    } catch (error) {
      if (error.name === 'AbortError') throw error;
      return rejectWithValue({
        status: error.status ?? 0,
        message: error.data?.error || error.message || 'Ошибка запроса',
      });
    }
  }
);

export const searchAnalogues = createAsyncThunk(
  'goods/searchAnalogues',
  async ({ goodsID, brand }, { rejectWithValue, getState, signal }) => {
    try {
      const data = await fetchGoods({ key: KEY, number: goodsID, brand, analogues: 'on', info: 'on' }, signal);
      if (data.error) return rejectWithValue({ status: 200, message: data.error });
      const first = getState().goods.goods.find(g => g.brand === brand);
      if (!data.goods.length) return [first];
      const analogues = data.goods[0].analogues || [];
      return [first, ...analogues];
    } catch (error) {
      if (error.name === 'AbortError') throw error;
      return rejectWithValue({
        status: error.status ?? 0,
        message: error.data?.error || error.message || 'Ошибка запроса',
      });
    }
  }
);

const goodsSlice = createSlice({
  name: 'goods',
  initialState: {
    goodsID: '',
    status: FetchStatus.Idle,
    error: null,
    errorStatus: null,
    goods: [],
    notFound: false,
    selectedBrand: null,
    analoguesStatus: FetchStatus.Idle,
    analoguesError: null,
    analoguesErrorStatus: null,
    analogues: [],
  },
  reducers: {
    setGoodsID(state, action) {
      state.goodsID = action.payload;
    },
    selectBrand(state, action) {
      state.selectedBrand = action.payload;
      state.analogues = [];
      state.analoguesStatus = FetchStatus.Idle;
      state.analoguesError = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(searchGoods.pending, (state) => {
        state.status = FetchStatus.Loading;
        state.error = null;
        state.goods = [];
        state.notFound = false;
        state.selectedBrand = null;
        state.analogues = [];
        state.analoguesStatus = FetchStatus.Idle;
        state.analoguesError = null;
        state.analoguesErrorStatus = null;
      })
      .addCase(searchGoods.fulfilled, (state, action) => {
        state.status = FetchStatus.Success;
        const goods = action.payload || [];
        if (goods.length === 1 && isEmptyGoods(goods[0])) {
          state.notFound = true;
          state.goods = [];
        } else {
          state.goods = goods;
        }
      })
      .addCase(searchGoods.rejected, (state, action) => {
        if (action.meta.aborted) return;
        state.status = FetchStatus.Error;
        state.error = action.payload?.message || action.error.message || 'Ошибка запроса';
        state.errorStatus = action.payload?.status ?? null;
      })
      .addCase(searchAnalogues.pending, (state) => {
        state.analoguesStatus = FetchStatus.Loading;
        state.analoguesError = null;
        state.analoguesErrorStatus = null;
      })
      .addCase(searchAnalogues.fulfilled, (state, action) => {
        state.analoguesStatus = FetchStatus.Success;
        state.analogues = action.payload || [];
      })
      .addCase(searchAnalogues.rejected, (state, action) => {
        if (action.meta.aborted) return;
        state.analoguesStatus = FetchStatus.Error;
        state.analoguesError = action.payload?.message || action.error.message || 'Ошибка запроса';
        state.analoguesErrorStatus = action.payload?.status ?? null;
      });
  },
});

export const { setGoodsID, selectBrand } = goodsSlice.actions;

export const store = configureStore({
  reducer: { goods: goodsSlice.reducer },
});

let currentGoodsPromise = null;
let currentAnaloguesPromise = null;

export const requestSearchGoods = (goodsID) => (dispatch) => {
  currentGoodsPromise?.abort();
  currentAnaloguesPromise?.abort();
  currentGoodsPromise = dispatch(searchGoods(goodsID));
};

export const requestSearchAnalogues = (params) => (dispatch) => {
  currentAnaloguesPromise?.abort();
  currentAnaloguesPromise = dispatch(searchAnalogues(params));
};