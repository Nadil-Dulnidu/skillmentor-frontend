import { ClassRoom, MentorClass } from "@/lib/types";
import { RootState } from "@/app/store";
import { apiSlice } from "../api/apiSlice";
import {
  createSelector,
  createEntityAdapter,
  type EntityState
} from "@reduxjs/toolkit";

const classroomsAdapter = createEntityAdapter<MentorClass, number>({
  selectId: (classroom: MentorClass) => classroom.class_room_id
});
const initialState = classroomsAdapter.getInitialState();

export const classroomApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getClassrooms: builder.query<EntityState<MentorClass, number>, void>({
      query: () => "/classroom",
      transformResponse: (responseData: MentorClass[]): EntityState<MentorClass, number> => {
        return classroomsAdapter.setAll(initialState, responseData);
      },
      providesTags: (result) => [
        { type: "Classroom", id: "LIST" },
        ...(result?.ids?.map((id: number) => ({ type: "Classroom" as const, id })) || [])
      ]
    }),
    getClassroomById: builder.query<MentorClass, number>({
      query: (classroomId) => `/classrooms/${classroomId}`,
      transformResponse: (responseData: MentorClass): MentorClass => {
        return responseData;
      },
      providesTags: (result) => [
        { type: "Classroom", id: result?.class_room_id },
      ]
    }),
    addClassroom: builder.mutation<ClassRoom, { newClassroom: Partial<ClassRoom>; token: string | null }>({
      query: ({ newClassroom, token }) => ({
        url: "/classroom",
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: newClassroom
      }),
      invalidatesTags: [{ type: "Classroom", id: "LIST" }]
    }),
    updateClassroom: builder.mutation<MentorClass, {updatedClassroom: Partial<MentorClass>; token: string | null }>({
      query: ({updatedClassroom, token}) => ({
        url: `/classroom`,
        method: "PUT",
         headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: updatedClassroom
      }),
      invalidatesTags: (_result, _error, arg) => [
        { type: "Classroom", id: arg.updatedClassroom.class_room_id },
        { type: "Classroom", id: "LIST" },
        { type: "Session", id: "LIST" }
      ]
    }),
    deleteClassroom: builder.mutation<{ id: number }, { classroomId: number; token: string | null }>({
      query: ({ classroomId, token }) => ({
        url: `/classroom/${classroomId}`,
         headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        method: "DELETE"
      }),
      invalidatesTags: (_result, _error, arg) => [
        { type: "Classroom", id: arg.classroomId },
        { type: "Classroom", id: "LIST" }
      ]
    })
  })
});

export const {
  useGetClassroomsQuery,
  useGetClassroomByIdQuery,
  useAddClassroomMutation,
  useUpdateClassroomMutation,
  useDeleteClassroomMutation
} = classroomApiSlice;

const selectClassroomsResult = classroomApiSlice.endpoints.getClassrooms.select();
const selectClassroomsData = createSelector(
  selectClassroomsResult,
  (classroomsResult) => classroomsResult.data
);

export const {
  selectAll: selectAllClassrooms,
  selectById: selectClassroomById,
  selectIds: selectClassroomIds,
} = classroomsAdapter.getSelectors<RootState>((state) => selectClassroomsData(state) ?? initialState);
