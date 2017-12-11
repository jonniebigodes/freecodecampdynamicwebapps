import {
    APP_ERROR,
    APP_ERROR_RESET,
    BOOK_LOGIN_REQUEST,
    BOOK_LOGIN_OK,
    BOOK_LOGIN_NOK,
    BOOK_REGISTER_REQUEST,
    BOOK_REGISTER_NOK,
    BOOK_REGISTER_OK,
    BOOK_USER_LOGOUT,
    BOOK_SET_USER_INFORMATION,
    REQUEST_BOOKS,
    RECIEVE_BOOKS,
    RECIEVE_BOOKS_NOK,
    SET_BOOK_EXIT,
    ADD_BOOK,
    BOOK_TRADE,
    BOOK_TRADE_NOK,
    BOOK_TRADE_OK
    }  from '../constants/Actiontypes';
import BookApi from '../api/booksApi';
import authApi from '../api/authApi';
import ChallengesApi from '../api/challengesApi';
export const requestBooksData=value=>({
    type:REQUEST_BOOKS,
    value
});

export const recieveBooksData=value=>({
    type:RECIEVE_BOOKS,
    value
});
export const recieveBooksDataNOK=value=>({
    type:RECIEVE_BOOKS_NOK,
    value
});
export const setBookAppError=value=>({
    type:APP_ERROR,
    value
});
export const resetBookAppError=value=>({
    type:APP_ERROR_RESET,
    value
});
export const BookExit=value=>({
    type:SET_BOOK_EXIT,
    value
});
export const AddBook=value=>({
    type:ADD_BOOK,
    value
});

export const BookAppUserLogout=value=>({
    type:BOOK_USER_LOGOUT,
    value
});

export const setBookAppAuthServerData=value=>({
    type:BOOK_LOGIN_REQUEST,
    value
});
export const BookAppAuthSucess=value=>({
    type:BOOK_LOGIN_OK,
    value
});
export const BookUserInformationChange=value=>({
    type:BOOK_SET_USER_INFORMATION,
    value
});
export const BookAppAuthFailure=value=>({
    type: BOOK_LOGIN_NOK,
    value
});
export const BookAppSetRegisterData=value=>({
    type:BOOK_REGISTER_REQUEST,
    value
});
export const BookAppRegisterUserOK=value=>({
    type:BOOK_REGISTER_OK,
    value
});
export const BookAppRegisterUserNOK=value=>({
    type:BOOK_REGISTER_NOK,
    value
});
export const BookTradeRequest=value=>({
    type:BOOK_TRADE,
    value
});
export const BookTradeOK=value=>({
    type:BOOK_TRADE_OK,
    value
});
export const BookTradeNOK=value=>({
    type:BOOK_TRADE_NOK,
    value
});
export const BookAppDisconnectUser=authInformation=>dispatch=>{
    authApi.userLogout(authInformation.id)
    .then(()=>{
        ChallengesApi.clearStorage();
        dispatch(BookAppUserLogout(authInformation.id));
    }).catch(err=>{
        dispatch(setBookAppError(err));
    });
};
export const BookAppRegisterServer=authData=>dispatch=>{
    dispatch(BookAppSetRegisterData(authData));
    authApi.registerUser(authData.email,authData.password)
            .then(result=>{
                // set here
                ChallengesApi.setStorageData("bookapp_userinfo",{authToken:result.authToken,full_name:result.full_name,city:result.city,countrystate:result.countrystate,country:result.country,email:authData.email,password:authData.password});
                //
                dispatch(BookAppRegisterUserOK(result));
               
            })
            .catch(err=>{
                dispatch(BookAppRegisterUserNOK(err));
                dispatch(setBookAppError(err));
            });
};
export const BookAppaAuthenticateServer=authData=>dispatch=>{
    dispatch(setBookAppAuthServerData(authData));
    authApi.authUserLocal(authData.email,authData.password)
    .then(result=>{
        ChallengesApi.setStorageData("bookapp_userinfo",{authToken:result.authToken,full_name:result.full_name,city:result.city,countrystate:result.countrystate,country:result.country,email:authData.email,password:authData.password});
        dispatch(BookAppAuthSucess(result));
        //uthApi.setStorageData()
        /* console.log('====================================');
        console.log(`auth success action result:${JSON.stringify(result,null,2)}`);
        console.log('===================================='); */
    })
    .catch(err=>{
        dispatch(BookAppAuthFailure(err));
        dispatch(setBookAppError(err));
        
    });
};
export const changeUserInformation=authData=>dispatch=>{
    /* console.log('====================================');
    console.log(`informationchanged:${JSON.stringify(authData,null,2)}`);
    console.log('====================================');
    return; */
    if(!authData){
        dispatch(setBookAppError('Try changing something first before trying to submit the data'));
        return;
    }
    authApi.changeUserInformation(authData)
    .then(()=>{
        // set data here also
        dispatch(BookUserInformationChange(authData));
    })
    .catch(err=>{
        dispatch(setBookAppError(err));
    });
};
export const addbookCollection=bookInfo=>dispatch=>{
    BookApi.addBook(bookInfo).then(()=>{
        dispatch(AddBook({
            bookauthor:bookInfo.authorName,
            bookbeingtradedto:"",
            bookcover:bookInfo.imgCoverLocation===undefined?'':bookInfo.imgCoverLocation,
            bookisbeingtraded:false,
            bookname:bookInfo.bookName,
            bookowner:bookInfo.usertoken,
            bookownercontact:bookInfo.userContact,
            bookreview:bookInfo.bookReview===undefined?'':bookInfo.bookReview,
            booktoken:bookInfo.bookId
        }));
    })
    .catch(err=>{
        dispatch(setBookAppError(err));
    });
};
export const tradeBook=tradeInfo=>dispatch=>{
    dispatch(BookTradeRequest(tradeInfo));
    BookApi.tradeBook({tokenBook:tradeInfo.tokenBook,tradeuser:tradeInfo.traderToken,bookowner:tradeInfo.ownerToken})
            .then(()=>{
                dispatch(BookTradeOK(tradeInfo));
            })
            .catch(err=>{
                dispatch(BookTradeNOK(err));
    });
};

export const fetchDataBooks=()=>dispatch=>{
    dispatch(requestBooksData(true));
    let dataUserStorage=JSON.parse(ChallengesApi.getStorageData("bookapp_userinfo"));
    if (dataUserStorage){
       /*  console.log('====================================');
        console.log(`1 data with value of :${dataUserStorage.email}`);
        console.log('===================================='); */
        
        dispatch(setBookAppAuthServerData({email:dataUserStorage.email,password:dataUserStorage.password}));
        dispatch(BookAppAuthSucess({authToken:dataUserStorage.authToken,full_name:dataUserStorage.full_name,city:dataUserStorage.city,country:dataUserStorage.country,countrystate:dataUserStorage.countrystate}));
    }
    BookApi.getAll().then(result=>{
        dispatch(recieveBooksData(result));
    }).catch(err=>{
        dispatch(recieveBooksDataNOK(err));
    });
};
/* export const fetchBooks=()=>(dispatch,getState)=>{
    return dispatch(fetchDataBooks(true));
}; */
