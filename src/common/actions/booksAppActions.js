import {
    BOOK_APP_ERROR,
    RESET_BOOK_APP_ERROR,
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
import { normalize } from 'normalizr';
import {BooksSchema} from '../constants/booksSchema';
export const requestBooksData=()=>({
    type:REQUEST_BOOKS,
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
    type:BOOK_APP_ERROR,
    value
});
export const resetBookAppError=()=>({
    type:RESET_BOOK_APP_ERROR,
});
export const BookExit=()=>({
    type:SET_BOOK_EXIT,
    
});
export const AddBook=value=>({
    type:ADD_BOOK,
    value
});

export const BookAppUserLogout=()=>({
    type:BOOK_USER_LOGOUT,
    
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
export const BookAppDisconnectUser=()=>dispatch=>{
    authApi.userLogout()
    .then(()=>{
        ChallengesApi.clearStorage();
        dispatch(BookAppUserLogout());
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
    if(!authData){
        
        dispatch(setBookAppError('Try changing something first before trying to submit the data'));
        return;
    }
    const savedUserData= JSON.parse(ChallengesApi.getStorageData("bookapp_userinfo"));
    
    authApi.changeUserInformation(authData)
    .then(()=>{
       
       ChallengesApi.setStorageData("bookapp_userinfo",
       {
           authToken:authData.userToken,
           full_name:authData.fullusername!=savedUserData.full_name?authData.fullusername:savedUserData.full_name,
           city:authData.city!=savedUserData?authData.city:savedUserData.city,
           countrystate:authData.countrystate!=savedUserData.countrystate?authData.countrystate:savedUserData.countrystate,
           country:authData.country!=savedUserData.country?authData.country:savedUserData.country,
           email:authData.email,password:authData.password
        });
        // set data here also
        dispatch(BookUserInformationChange(authData));
    })
    .catch(err=>{
        dispatch(setBookAppError(err));
    });
};
const shouldAddBook=(state,value)=>{
    const stateData=state.books;
    const bookdatainformation=stateData.booksData;
    if (!stateData.results.length){
        return true;
    }
    for (const item in bookdatainformation){
        if(bookdatainformation[item].bookname.toLowerCase()==value.bookName.toLowerCase()){
            return false;
        }
    }
    return true;
};
export const addbookCollection=bookInfo=>(dispatch,getState)=>{

    if (shouldAddBook(getState(),bookInfo)){
        BookApi.addBook(bookInfo).then(()=>{
            dispatch(AddBook(
                {
                    token:bookInfo.bookId,
                    data:{
                        bookauthor:bookInfo.authorName,
                        bookbeingtradedto:"",
                        //bookcover:bookInfo.imgCoverLocation===undefined?'':bookInfo.imgCoverLocation,
                        bookcover:bookInfo.imgCoverLocation,
                        bookisbeingtraded:false,
                        bookname:bookInfo.bookName,
                        bookowner:bookInfo.usertoken,
                        bookownercontact:bookInfo.userContact,
                        //bookreview:bookInfo.bookReview===undefined?'':bookInfo.bookReview,
                        bookreview:bookInfo.bookreview,
                        booktoken:bookInfo.bookId
                    }
                }));
        })
        .catch(err=>{
            dispatch(setBookAppError(err));
        });
    }
    else{
        dispatch(setBookAppError(`The book ${bookInfo.bookName} by ${bookInfo.authorName} is already added to the book collection`));
    }
    
};
const shouldTradeBook=(value)=>{
    
    if (value.ownercontact.toLowerCase()===value.tradercontact.toLowerCase()){
        return false;
    }
    return true;
};
export const tradeBook=tradeInfo=>dispatch=>{
   
    if (shouldTradeBook(tradeInfo)){
      
        dispatch(BookTradeRequest(tradeInfo));
        BookApi.tradeBook({tokenBook:tradeInfo.tokenBook,tradeuser:tradeInfo.traderToken,bookowner:tradeInfo.ownerToken})
        .then(()=>{
            dispatch(BookTradeOK(tradeInfo));
        })
        .catch(err=>{
            dispatch(BookTradeNOK(err));
        });
    }
    else{
        dispatch(setBookAppError(`Cannot trade books with yourself`));
    }
   
};

export const fetchDataBooks=()=>dispatch=>{
    dispatch(requestBooksData());
    let dataUserStorage=JSON.parse(ChallengesApi.getStorageData("bookapp_userinfo"));
    if (dataUserStorage){
       /*  console.log('====================================');
        console.log(`1 data with value of :${dataUserStorage.email}`);
        console.log('===================================='); */
        
        dispatch(setBookAppAuthServerData({email:dataUserStorage.email,password:dataUserStorage.password}));
        dispatch(BookAppAuthSucess({authToken:dataUserStorage.authToken,full_name:dataUserStorage.full_name,city:dataUserStorage.city,country:dataUserStorage.country,countrystate:dataUserStorage.countrystate}));
    }
    BookApi.getAll().then(result=>{
        const normalizedData=normalize(result,BooksSchema.dataBooks);
        setTimeout(() => {
            dispatch(recieveBooksData(normalizedData));
        }, 2000);
        

    }).catch(err=>{
        dispatch(recieveBooksDataNOK(err));
    });
};
/* export const fetchBooks=()=>(dispatch,getState)=>{
    return dispatch(fetchDataBooks(true));
}; */
