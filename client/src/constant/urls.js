const API_SERVER = 'http://localhost:8070';
// const API_SERVER = 'http://www.flashhu.site:8070';

// user
export const API_USER_REGISTER = API_SERVER + '/user/register';
export const API_USER_LOGIN = API_SERVER + '/user/login';

//admin
export const API_DATA_ADMIN = API_SERVER + '/admin/data';
export const API_SEARCH_ADMIN = API_SERVER + '/admin/search';
export const API_UPDATE_ADMIN = API_SERVER + '/admin/update';
export const API_DELETE_ADMIN = API_SERVER + '/admin/delete';

//reader
export const API_DATA_READER = API_SERVER + '/reader/data';
export const API_SEARCH_READER = API_SERVER + '/reader/search';
export const API_UPDATE_READER = API_SERVER + '/reader/update';
export const API_DELETE_READER = API_SERVER + '/reader/delete';

//book
export const API_DATA_BOOK = API_SERVER + '/book/data';
export const API_SEARCH_BOOK = API_SERVER + '/book/search';
export const API_UPDATE_BOOK = API_SERVER + '/book/update';
export const API_DELETE_BOOK = API_SERVER + '/book/delete';
export const API_BORROW_BOOK = API_SERVER + '/book/borrow';
export const API_RETURN_BOOK = API_SERVER + '/book/return';