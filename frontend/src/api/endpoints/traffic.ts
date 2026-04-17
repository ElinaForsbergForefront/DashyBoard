import { api } from '../apiSlice';
import type { StationDto, TimetableEntryDto } from '../types/traffic';

const trafficApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getStopsByName: builder.query<StationDto[], string>({
      query: (name) => `/traffic/stops/name/${encodeURIComponent(name)}`,  //encodeURIComponent hanterar mellanslag och specialtecken i namnet
      providesTags: (_result, _error, name) => [{ type: 'Traffic', id: `STOPS_${name}` }],
    }),

    getDepartures: builder.query<TimetableEntryDto[], string>({
      query: (siteId) => `/traffic/departures/${siteId}`,
      providesTags: (_result, _error, siteId) => [{ type: 'Traffic', id: `DEP_${siteId}` }],
    }),

    getDeparturesAtTime: builder.query<TimetableEntryDto[], { siteId: string; dateTime: string }>({
      query: ({ siteId, dateTime }) => `/traffic/departures/${siteId}/${dateTime}`,
      providesTags: (_result, _error, { siteId, dateTime }) => [{ type: 'Traffic', id: `DEP_${siteId}_${dateTime}` }],
    }),

    getArrivals: builder.query<TimetableEntryDto[], string>({
      query: (siteId) => `/traffic/arrivals/${siteId}`,
      providesTags: (_result, _error, siteId) => [{ type: 'Traffic', id: `ARR_${siteId}` }],
    }),

    getArrivalsAtTime: builder.query<TimetableEntryDto[], { siteId: string; dateTime: string }>({
      query: ({ siteId, dateTime }) => `/traffic/arrivals/${siteId}/${dateTime}`,
      providesTags: (_result, _error, { siteId, dateTime }) => [{ type: 'Traffic', id: `ARR_${siteId}_${dateTime}` }],
    }),
  }),
});

export const { useGetStopsByNameQuery, useGetDeparturesQuery, useGetDeparturesAtTimeQuery, useGetArrivalsQuery, useGetArrivalsAtTimeQuery} = trafficApi;

