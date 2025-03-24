import axios from 'axios';
import { store } from '../../Redux/Store';
import { refreshTokenAction, userLogoutAction } from '../../Redux/slices/UserSlice';



const baseUrl = axios.create({
  baseURL: 'https://dev.knestsensors.com:5000/api/',
  timeout: 60000,
  timeoutErrorMessage: 'Connection Timeout',

});

// const { dispatch } = store;

baseUrl.interceptors.request.use(
  config => {
    const token = store.getState().auth?.userdata?.token;
console.log("storetoken", token);

    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  error => {
    Promise.reject(error);
  },
);

let isRefreshing = false;
let failedRequestsQueue = [];


function processQueue(error, token = null) {
  failedRequestsQueue.forEach((prom) => {
    if (token) {
      prom.resolve(token);
    } else {
      prom.reject(error);
    }
  });

  failedRequestsQueue = [];
}


baseUrl.interceptors.response.use(
  (response) => response,
  async (error) => {

    const originalConfig = error.config;

    const {status} = error.response;


    if (status === 401 || status === 403) {
      if (!isRefreshing) {
        isRefreshing = true;
      try {
      

        const {payload} = await store.dispatch(refreshTokenAction());
      
        const access_token =payload?.token;

        baseUrl.defaults.headers.common['Authorization']=`Bearer ${access_token}`
        originalConfig.headers.Authorization = `Bearer ${access_token}`;
       
        processQueue(null, access_token);
        
        return  axios.request(originalConfig);
      } catch (refreshError) {
        processQueue(refreshError);
        store.dispatch(userLogoutAction());
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }else{
      return new Promise((resolve, reject) => {
        failedRequestsQueue.push({ resolve, reject });
      }).then((token) => {
        baseUrl.defaults.headers.common['Authorization']=`Bearer ${token}`
        originalConfig.headers.Authorization = `Bearer ${token}`;
        return axios.request(originalConfig);
      }).catch((err) => Promise.reject(err));
    }
  }
   return Promise.reject(error);
}

);

export default baseUrl;
