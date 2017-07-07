export function StocksHasErrors(value){
    return {
        type:'STOCKS_NOK',
        hasError:value
    };
}
export function StocksLoading(value){
    return {
        type:'LOADING_STOCKS',
        stockloading:value
    };
}
export function StocksOK(item){
    return {
        type:'STOCKS_OK',
        item
    };
}
export function fetchStock(item){
    return (dispatch)=>{
        dispatch(StocksLoading(true));
        fetch()
            .then((response)=>{
                if(!response.ok){   
                    throw Error(response.statusText);
                }
                dispatch(StocksLoading(false));
                return response;

            })
            .then((response)=>response.json())
            .then((resultado)=>dispatch(StocksOK(resultado)))
            .catch(()=>dispatch(StocksHasErrors(true)))
    };
}