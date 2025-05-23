import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { 
  LoginRequest, 
  LoginResponse, 
  RegisterRequest,
  AddMiniatureRequest,
  CreateBattleRequest,
  Miniature,
  Battle,
  User,
  ApiResponse
} from '../types';
import type { RootState } from './index';

const baseUrl = __DEV__ ? 'http://localhost:3000/api' : 'https://api.dndminiaturearena.com';

export const api = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl,
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as RootState).user.token;
      if (token) {
        headers.set('authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ['Miniature', 'Battle', 'User', 'Collection'],
  endpoints: (builder) => ({
    // Authentication endpoints
    login: builder.mutation<LoginResponse, LoginRequest>({
      query: (credentials) => ({
        url: '/auth/login',
        method: 'POST',
        body: credentials,
      }),
      invalidatesTags: ['User'],
    }),
    register: builder.mutation<ApiResponse<User>, RegisterRequest>({
      query: (userData) => ({
        url: '/auth/register',
        method: 'POST',
        body: userData,
      }),
    }),
    
    // Miniature endpoints
    getMiniatures: builder.query<ApiResponse<Miniature[]>, { 
      search?: string; 
      filter?: string; 
      page?: number; 
      limit?: number; 
    }>({
      query: ({ search, filter, page = 1, limit = 20 } = {}) => ({
        url: '/miniatures',
        params: { search, filter, page, limit },
      }),
      providesTags: ['Miniature'],
    }),
    getMiniatureById: builder.query<ApiResponse<Miniature>, string>({
      query: (id) => `/miniatures/${id}`,
      providesTags: (result, error, id) => [{ type: 'Miniature', id }],
    }),
    addMiniatureToCollection: builder.mutation<ApiResponse<Miniature>, AddMiniatureRequest>({
      query: (miniatureData) => ({
        url: '/collection/add',
        method: 'POST',
        body: miniatureData,
      }),
      invalidatesTags: ['Collection'],
    }),
    
    // Collection endpoints
    getUserCollection: builder.query<ApiResponse<Miniature[]>, string>({
      query: (userId) => `/collection/${userId}`,
      providesTags: ['Collection'],
    }),
    
    // Battle endpoints
    createBattle: builder.mutation<ApiResponse<Battle>, CreateBattleRequest>({
      query: (battleData) => ({
        url: '/battles/create',
        method: 'POST',
        body: battleData,
      }),
      invalidatesTags: ['Battle'],
    }),
    getBattleHistory: builder.query<ApiResponse<Battle[]>, string>({
      query: (userId) => `/battles/history/${userId}`,
      providesTags: ['Battle'],
    }),
  }),
});

export const {
  useLoginMutation,
  useRegisterMutation,
  useGetMiniaturesQuery,
  useGetMiniatureByIdQuery,
  useAddMiniatureToCollectionMutation,
  useGetUserCollectionQuery,
  useCreateBattleMutation,
  useGetBattleHistoryQuery,
} = api; 