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
  ApiResponse,
  Quest // Import the Quest type
} from '../types';
import type { RootState } from './index';

const baseUrl = __DEV__ ? 'http://localhost:3001/api' : 'https://api.dndminiaturearena.com';

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
  tagTypes: ['Miniature', 'Battle', 'User', 'Collection', 'Quest'], // Add 'Quest'
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

    // Quest endpoints
    getQuests: builder.query<ApiResponse<Quest[]>, void>({
      query: () => '/quests', // Or '/realms/quests'
      providesTags: (result) =>
        result && result.data
          ? [
              ...result.data.map(({ id }) => ({ type: 'Quest' as const, id })),
              { type: 'Quest', id: 'LIST' },
            ]
          : [{ type: 'Quest', id: 'LIST' }],
    }),

    // User profile endpoint
    getUserProfile: builder.query<ApiResponse<{
      user: User;
      preferences: any;
      battleRecord: any;
      achievements: any[];
      collectionStats: any;
      completedQuests: any[];
      userMiniatures: any[];
    }>, string>({
      query: (userId) => `/users/${userId}/profile`,
      providesTags: (result, error, userId) => [
        { type: 'User', id: userId },
        { type: 'Collection', id: userId },
        { type: 'Quest', id: 'LIST' }
      ],
    }),

    // Update user preferences
    updateUserPreferences: builder.mutation<ApiResponse<any>, { userId: string; preferences: any }>({
      query: ({ userId, preferences }) => ({
        url: `/users/${userId}/preferences`,
        method: 'PUT',
        body: preferences,
      }),
      invalidatesTags: (result, error, { userId }) => [{ type: 'User', id: userId }],
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
  useGetQuestsQuery, // Export the new hook
  useGetUserProfileQuery, // Export the new hook
  useUpdateUserPreferencesMutation, // Export the new hook
} = api; 