import { createApiClient } from './apiClient';

export const getAllUsernames = async (token: string): Promise<string[]> => {
  const api = createApiClient(token);
  const response = await api.get<string[]>('/api/User/allUsernames');
  return response.data;
};

export interface UpdateUserPayload {
  username: string;
  displayName: string;
  country: string;
  city: string;
}

export interface CurrentUserProfile {
  username: string | null;
  displayName: string | null;
  country: string | null;
  city: string | null;
}

export const getCurrentUser = async (token: string): Promise<CurrentUserProfile> => {
  const api = createApiClient(token);
  const response = await api.get<CurrentUserProfile>('/api/User/me');
  return response.data;
};

export const updateUserMe = async (token: string, payload: UpdateUserPayload): Promise<void> => {
  const api = createApiClient(token);
  await api.put('/api/User/me', payload);
};
