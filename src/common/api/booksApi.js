class BookApi{
    /**
     * get all the books
     * 
     */
    static getAll(){
        return new Promise((resolve,reject)=>{
            fetch('https://freecodecampdynprojects.herokuapp.com/api/data/getbooks')
            //fetch(`http://localhost:5000/api/data/getbooks`)
            .then(response=>{
                return response.json();
            })
            .then(result=>{
                resolve(result.bookData);
            })
            .catch(error=>{
                console.log('====================================');
                console.log('There has been a problem with getAll fetch operation: ' + error.message);
                console.log('====================================');
                reject(error.message);
            })
        });
    }
    static addBook(value){
        return new Promise((resolve,reject)=>{
            fetch('https://freecodecampdynprojects.herokuapp.com/api/data/bookadd',{
            //fetch(`http://localhost:5000/api/data/bookadd`,{
                method:'post',
                headers:{
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                    },
                    body:JSON.stringify(value)
                }
            )
            .then(response=>{
                return response.json();
            })
            .then(result=>{
                if (result.code==='fccda001'){
                    reject(`error adding book:${result.reason}`);
                }
                else{
                    resolve(true);
                }
            })
            .catch(error=>{
                console.log('====================================');
                console.log('There has been a problem with add book fetch operation: ' + error.message);
                console.log('====================================');
                reject(error.message);
            })
        });
    }
    static tradeBook(value){
        console.log('====================================');
        console.log(`api books data trade:${JSON.stringify(value,null,2)}`);
        console.log('====================================');
        
        return new Promise((resolve,reject)=>{
            fetch('https://freecodecampdynprojects.herokuapp.com/api/data/tradebook',{
            //fetch(`http://localhost:5000/api/data/tradebook`,{
                method:'post',
                headers:{
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                    },
                    body:JSON.stringify(
                        {
                           
                            bookid:value.tokenBook,
                            bookowner:value.bookowner,
                            tradeuser:value.tradeuser
                        }
                    )
            })
            .then(response=>{
                return response.json();
            })
            .then(result=>{
                if (result.code==='fccda001'){
                    reject(`There was an error trading the book:${result.reason}`);
                }
                else{
                    resolve(true);
                }
            })
            .catch(error=>{
                reject(error.message);
            })
        });
    }
}
export default BookApi;