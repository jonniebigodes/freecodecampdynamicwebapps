const StockAppReducer= (state = {
    result: {},
    lastValues: []
}, action) => {
    switch (action.type) {
        case "LOAD_STOCK_OK":
            state = {
                ...state,
                //result: state.result + action.payload,
                lastValues: [...state.lastValues, action.payload]
            };
            break;
        case "SET_NAME_STOCK":
            state = {
                ...state,
                result: state.result - action.payload,
                lastValues: [...state.lastValues, action.payload]
            };
            break;
        case "SET_INITIAL_DATE":
            state={
                ...state,
                
            };
            break;
        case "SET_END_DATE":
            state={
                ...state,

            }

    }
    return state;
};





export default StockAppReducer;