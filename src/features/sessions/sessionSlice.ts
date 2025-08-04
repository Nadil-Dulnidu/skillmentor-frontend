import { RootState } from "@/app/store";
import { apiSlice } from "../api/apiSlice";
import {
  createSelector,
  createEntityAdapter,
  type EntityState
} from "@reduxjs/toolkit";
import { FullSession } from "@/lib/types";

const sessionsAdapter = createEntityAdapter<FullSession, number>({
  selectId: (session) => session.session_id
});

const initialState = sessionsAdapter.getInitialState();

export const sessionApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getSessions: builder.query<EntityState<FullSession, number>, string | null>({
      query: (token) => ({
        url: "/session",
        headers: {
          Authorization: `Bearer ${token}`
        }
      }),
      transformResponse: (responseData: FullSession[]): EntityState<FullSession, number> => {
        return sessionsAdapter.setAll(initialState, responseData);
      },
      providesTags: (result) => [
        { type: "Session", id: "LIST" },
        ...(result?.ids?.map((id: number) => ({ type: "Session" as const, id })) || [])
      ],
    }),
    getSessionById: builder.query<FullSession, { sessionId: number; token: string | null }>({
      query: ({ sessionId, token }) => ({
        url: `/session/${sessionId}`,
        headers: {
          Authorization: `Bearer ${token}`
        }
      }),
      transformResponse: (responseData: FullSession): FullSession => {
        return responseData;
      },
      providesTags: (result) => [
        { type: "Session", id: result?.session_id },
      ]
    }),
    addSession: builder.mutation<FullSession, { newSession: Partial<FullSession>; token: string | null }>({
      query: ({ newSession, token }) => ({
        url: "/session",
        method: "POST",
        body: newSession,
        headers: {
          Authorization: `Bearer ${token}`
        }
      }),
      invalidatesTags: [{ type: "Session", id: "LIST" }]
    }),
    updateSession: builder.mutation<FullSession, { updatedSession: Partial<FullSession>; sessionStatus: string; token: string | null }>({
      query: ({ updatedSession, sessionStatus, token }) => ({
        url: `/session/${updatedSession.session_id}?sessionStatus=${sessionStatus}`,
        method: "PUT",
        body: updatedSession,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        }
      }),
      invalidatesTags: (_result, _error, arg) => [
        { type: "Session", id: arg.updatedSession.session_id },
        { type: "Session", id: "LIST" }
      ]
    }),
    deleteSession: builder.mutation<void, { sessionId: number; token: string | null }>({
      query: ({ sessionId, token }) => ({
        url: `/session/${sessionId}`,
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`
        }
      }),
      invalidatesTags: (_result, _error, arg) => [
        { type: "Session", id: arg.sessionId },
        { type: "Session", id: "LIST" }
      ]
    })
  })
})

export const {
  useGetSessionsQuery,
  useGetSessionByIdQuery,
  useAddSessionMutation,
  useUpdateSessionMutation,
  useDeleteSessionMutation
} = sessionApiSlice;

export const selectSessionsResult = sessionApiSlice.endpoints.getSessions.select;

const sessionSelectors = sessionsAdapter.getSelectors();

const selectSessionsData = (token: string | null) =>
  createSelector(
    (state: RootState) => selectSessionsResult(token)(state),
    (sessionsResult) => sessionsResult?.data ?? initialState
  );

export const selectAllSessions = (token: string | null) =>
  (state: RootState) => sessionSelectors.selectAll(selectSessionsData(token)(state));

export const selectSessionById = (token: string | null, id: number) =>
  (state: RootState) => sessionSelectors.selectById(selectSessionsData(token)(state), id);

export const selectSessionIds = (token: string | null) =>
  (state: RootState) => sessionSelectors.selectIds(selectSessionsData(token)(state));