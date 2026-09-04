// Configuración global para la aplicación


export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://192.168.56.30:80/api';


export const REQUEST_TIMEOUT = 15000; 


export const MAX_UPLOAD_SIZE = 5 * 1024 * 1024; 


export const DEFAULT_PROFILE_IMAGE = '/user-default.svg';
