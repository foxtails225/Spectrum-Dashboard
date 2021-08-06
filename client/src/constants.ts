export const SERVER_URL = 'http://52.254.23.171:7000/api';

export const LOCAL_URL = 'http://127.0.0.1:7000/api';

export const BASE_URL =
  process.env.NODE_ENV === 'production' ? SERVER_URL : LOCAL_URL;

export const SYSTEMS_FILE1 = 'static/excel/systems_dataset_v3.xlsx';

export const SYSTEMS_FILE2 = 'static/excel/lunar_systems_dataset_v4.xlsx';

export const USER_FILE = 'static/excel/users_dataset_v2.xlsx';

export const DATA_FILE = 'static/excel/dataset_v3.xlsx';
