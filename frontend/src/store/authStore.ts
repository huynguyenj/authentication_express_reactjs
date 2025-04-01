import {create} from 'zustand'
import axios, { AxiosError } from 'axios'
import { ApiResponse } from '../model/ApiRes'
import { SignupInfo, User } from '../model/auth'
axios.defaults.withCredentials = true;
const API_BASE_URL = import.meta.env.MODE === "development" ? "http://localhost:8000/api/auth" : "/api/auth";
type StoreInfo = {
      user:User | null,
      isAuthenticated: boolean,
      error: string | null,
      isLoading: boolean,
      isCheckingAuth: boolean,
      message: string,
      signup: (signupInfo:SignupInfo) => void,
      verifyEmail:(code:string) => Promise<ApiResponse<User>>,
      checkAuth: () => void,
      login:(email:string,password:string) => void,
      logout: () => void,
      forgotPass: (email:string) => void,
      resetPassword: (token:string, password:string) =>void

}

const handleAxiosError = (error: unknown, message?: string) => {
  const axiosError = error as AxiosError<{ message: string }>;
  return axiosError.response?.data?.message || message;
};

export const useAuthStore = create<StoreInfo>((set) => ({
      user:null,
      isAuthenticated:false,
      error:null,
      isLoading: false,
      isCheckingAuth:true,
      message:"",
      signup: async (signupInfo: SignupInfo) => {
            set({ isLoading: true, error:null });
            try {
              const response = await axios.post<ApiResponse<User>>(API_BASE_URL+"/signup", signupInfo);
              set({ user:response.data.user, isAuthenticated:true, isLoading:false,error:null });
              return response.data;
            } catch (error) {
              set({ error: handleAxiosError(error) , isLoading: false });
              throw error;
            }
          },
        verifyEmail: async (code:string):Promise<ApiResponse<User>> => {
          set({isLoading:true,error:null});
          try {
            const response = await axios.post<ApiResponse<User>>(API_BASE_URL+'/verify-email', {code});
            set({user:response.data.user, isAuthenticated:true, isLoading:false,error:null})
            return response.data;
          } catch (error) {
            set({ error: handleAxiosError(error) , isLoading: false });
              throw error;
          }
        },
        checkAuth: async () => {
          set({isAuthenticated:true, error:null});
          try {
            const response = await axios.get<ApiResponse<User>>(API_BASE_URL+'/check-auth');
            set({user:response.data.user, isAuthenticated:true, isCheckingAuth:false})
          } catch (error) {
            set({ error: null , isAuthenticated:false, isCheckingAuth:false });
            throw error;
          }
        },
        login: async (email:string,password:string) => {
          set({ isLoading: true, error:null });
          try {
            const response = await axios.post<ApiResponse<User>>(API_BASE_URL+"/login", {email,password});
            set({ user:response.data.user, isAuthenticated:true, isLoading:false, error:null});
            console.log(response.data.user)
            return response.data;
          } catch (error) {
            set({ error: handleAxiosError(error) , isLoading: false });
            throw error;
          }
        },
        logout: async () => {
          set({ isLoading: true, error: null });
          try {
            await axios.post(API_BASE_URL+"/logout");
            set({ user: null, isAuthenticated: false, error: null, isLoading: false });
          } catch (error) {
            set({ error: "Error logging out", isLoading: false });
            throw error;
          }
        },
        forgotPass: async (email:string) => {
          set({ isLoading: true, error: null });
            try {
              const response = await axios.post(API_BASE_URL+'/forgot-password', { email });
              set({ message: response.data.message, isLoading: false });
            } catch (error:unknown) {
              set({ isLoading: false,	error: handleAxiosError(error,"InvalidError sending reset password email")});
              throw error;
                }
        },
        resetPassword: async (token:string,password:string) => {
          set({ isLoading: true, error: null });
          try {
            const response = await axios.post(API_BASE_URL+`/reset-password/${token}`,{password});
            set({ message: response.data.message, isLoading: false });
          } catch (error:unknown) {
            set({
              isLoading: false,
              error:  handleAxiosError(error,"Error resetting password"),
            });
            throw error;
          }
            }
}))