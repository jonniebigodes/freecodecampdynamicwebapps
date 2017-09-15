import * as types from '../constants/Actiontypes';
import BookApi from '../api/booksApi';
import authApi from '../api/authApi';


export const requestBooksData=value=>({
    type:types.REQUEST_BOOKS,
    value
});

export const recieveBooksData=value=>({
    type:types.RECIEVE_BOOKS,
    value
});
export const recieveBooksDataNOK=value=>({
    type:types.RECIEVE_BOOKS_NOK,
    value
});
export const setBookAppError=value=>({
    type:types.APP_ERROR,
    value
});
export const resetBookAppError=value=>({
    type:types.APP_ERROR_RESET,
    value
});
export const BookExit=value=>({
    type:types.SET_BOOK_EXIT,
    value
});
export const AddBook=value=>({
    type:types.ADD_BOOK,
    value
})
export const DeleteBook=value=>({
    type:types.DEL_BOOK,
    value
});
export const EditBook=value=>({
    type:types.EDIT_BOOK,
    value
});
export const BookAppUserLogout=value=>({
    type:types.USER_LOGOUT,
    value
});

export const setBookAppAuthServerData=value=>({
    type:types.LOGIN_REQUEST,
    value
});
export const BookAppAuthSucess=value=>({
    type:types.LOGIN_OK,
    value
});
export const BookAppAuthFailure=value=>({
    type:types.LOGIN_NOK,
    value
});
export const BookAppSetRegisterData=value=>({
    type:types.REGISTER_REQUEST,
    value
});
export const BookAppRegisterUserOK=value=>({
    type:types.REGISTER_OK,
    value
});
export const BookAppRegisterUserNOK=value=>({
    type:types.REGISTER_NOK,
    value
});
export const BookAppDisconnectUser=authInformation=>dispatch=>{
    authApi.userLogout(authInformation.id)
    .then(result=>{
        dispatch(BookAppUserLogout(authInformation.id));
    }).catch(err=>{
        dispatch(setBookAppError(err));
    })
};
export const BookAppRegisterServer=authData=>dispatch=>{
    dispatch(BookAppSetRegisterData(authData));
    authApi.registerUser(authData.email,authData.password)
            .then(result=>{
                dispatch(BookAppRegisterUserOK(result));
            })
            .catch(err=>{
                dispatch(BookAppRegisterUserNOK(err));
                dispatch(setBookAppError(err));
            })
};
export const BookAppaAuthenticateServer=authData=>dispatch=>{
    dispatch(setBookAppAuthServerData(authData));
    authApi.authUserLocal(authData.email,authData.password)
    .then(result=>{
        dispatch(BookAppAuthSucess(result));
        console.log('====================================');
        console.log(`auth success action result:${result}`);
        console.log('====================================');
    })
    .catch(err=>{
        dispatch(BookAppAuthFailure(err));
        dispatch(setBookAppError(err));
    })
};

