import { RootState } from "@/app/store";
import { apiSlice } from "../api/apiSlice";
import {
  createSelector,
  createEntityAdapter,
  type EntityState
} from "@reduxjs/toolkit";
import { Mentor } from "@/lib/types";

const mentorsAdapter = createEntityAdapter<Mentor, number>({
  selectId: (mentor: Mentor) => mentor.mentor_id
});
const initialState = mentorsAdapter.getInitialState();

export const mentorApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getMentors: builder.query<EntityState<Mentor, number>, string | null>({
      query: (token) => ({
        url: "/mentor",
        headers: {
          Authorization: `Bearer ${token}`
        }
      }),
      transformResponse: (responseData: Mentor[]): EntityState<Mentor, number> => {
        return mentorsAdapter.setAll(initialState, responseData);
      },
      providesTags: (result) => [
        { type: "Mentor", id: "LIST" },
        ...(result?.ids?.map((id: number) => ({ type: "Mentor" as const, id })) || [])
      ],
    }),
    getMentorById: builder.query<Mentor, { mentorId: number; token: string | null }>({
      query: ({ mentorId, token }) => ({
        url: `/mentors/${mentorId}`,
        headers: {
          Authorization: `Bearer ${token}`
        }
      }),
      transformResponse: (responseData: Mentor): Mentor => {
        return responseData;
      },
      providesTags: (result) => [
        { type: "Mentor", id: result?.mentor_id },
      ]
    }),
    addMentor: builder.mutation<Mentor, { newMentor: Partial<Mentor>; token: string | null }>({
      query: ({ newMentor, token }) => ({
        url: "/mentor",
        method: "POST",
        body: newMentor,
        headers: {
          Authorization: `Bearer ${token}`
        }
      }),
      invalidatesTags: [{ type: "Mentor", id: "LIST" }]
    }),
    updateMentor: builder.mutation<Mentor, { updatedMentor: Partial<Mentor>; token: string | null }>({
      query: ({ updatedMentor, token }) => ({
        url: `/mentor`,
        method: "PUT",
        body: updatedMentor,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        }
      }),
      invalidatesTags: (_result, _error, arg) => [
        { type: "Mentor", id: arg.updatedMentor.mentor_id },
        { type: "Mentor", id: "LIST" },
        { type: "Classroom", id: arg.updatedMentor.class_room_id }
      ]
    }),
    deleteMentor: builder.mutation<void, { mentorId: number; classroom_id: number; token: string | null }>({
      query: ({ mentorId, token }) => ({
        url: `/mentor/${mentorId}`,
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`
        }
      }),
      invalidatesTags: (_result, _error, arg) => [
        { type: "Mentor", id: arg.mentorId },
        { type: "Mentor", id: "LIST" },
        { type: "Classroom", id: arg.classroom_id }
      ]
    })
  })
});

export const {
  useGetMentorsQuery,
  useGetMentorByIdQuery,
  useAddMentorMutation,
  useUpdateMentorMutation,
  useDeleteMentorMutation,
} = mentorApiSlice;

export const selectMentorsResult = mentorApiSlice.endpoints.getMentors.select;

const mentorSelectors = mentorsAdapter.getSelectors();

const selectMentorsData = (token: string | null) =>
  createSelector(
    (state: RootState) => selectMentorsResult(token)(state),
    (mentorsResult) => mentorsResult?.data ?? initialState
  );

export const selectAllMentors = (token: string | null) =>
  (state: RootState) => mentorSelectors.selectAll(selectMentorsData(token)(state));

export const selectMentorById = (token: string | null, id: number) =>
  (state: RootState) => mentorSelectors.selectById(selectMentorsData(token)(state), id);

export const selectMentorIds = (token: string | null) =>
  (state: RootState) => mentorSelectors.selectIds(selectMentorsData(token)(state));

