class BookApi{
    static getAll(){
        return new Promise((resolve,reject)=>{
            fetch()
            .then(response=>{
                return response.json();
            })
            .then(result=>{

            })
            .catch(error=>{
                console.log('====================================');
                console.log('There has been a problem with getAll fetch operation: ' + error.message);
                console.log('====================================');
                reject(error.message);
            })
        });
    }
    static addBook(){
        return new Promise((resolve,reject)=>{
            fetch()
            .then(response=>{
                return response.json();
            })
            .then(result=>{

            })
            .catch(error=>{
                console.log('====================================');
                console.log('There has been a problem with getAll fetch operation: ' + error.message);
                console.log('====================================');
                reject(error.message);
            })
        });
    }
}