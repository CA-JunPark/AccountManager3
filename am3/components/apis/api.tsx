import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import { Alert } from 'react-native';

const baseURL = "https:/am3api.duckdns.org"
const refreshTokenUrl = "https://am3api.duckdns.org/token/refresh/";

const api = axios.create({
  baseURL: baseURL, 
  timeout: 5000,
});

/**
 * Utility functions to store/get/remove tokens in SecureStore
 */
const setToken = async (key: string, value: string) => {
  try {
    await SecureStore.setItemAsync(key, value);
  } catch (error: any) {
    Alert.alert(
      "Could not Store Token", 
      error, 
      [
        {text: "OK"},
      ]
    );
  }
};

const getToken = async (key: string) => {
  try {
    return await SecureStore.getItemAsync(key);
  } catch (error: any) {
    Alert.alert(
      "JWT Token Error", 
      error, 
      [
        {text: "OK"},
      ]
    );
    return null;
  }
};

const removeToken = async (key: string) => {
  try {
    await SecureStore.deleteItemAsync(key);
  } catch (error) {
    console.error('Error deleting token from SecureStore:', error);
  }
};

/**
 * Request interceptor: attach access token to headers if available
 */
api.interceptors.request.use(
  async (config) => {
    const accessToken = await getToken('accessToken');
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

/**
 * Response interceptor: 
 * - if we get a 401, attempt token refresh (one-time retry)
 */
api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // If we receive a 401 (Unauthorized) and haven't retried yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const refreshToken = await getToken('refreshToken');
        if (refreshToken) {
          // Attempt to get a new access token
          const response = await axios.post(
            refreshTokenUrl,
            { refresh: refreshToken }
          );
          const { access } = response.data;

          // Store the new access token
          await setToken('accessToken', access);

          // Update request header and retry request
          originalRequest.headers.Authorization = `Bearer ${access}`;
          return api(originalRequest);
        }
      } catch (refreshError:any) {
        Alert.alert(
          "Refresh Token Error", 
          refreshError, 
          [
            {text: "OK"},
          ]
        );
      }
    }

    return Promise.reject(error);
  }
);

export default api;
