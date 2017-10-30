
class ChallengeApi{
    static setStorageData(token,value){
        console.log('====================================');
        console.log(`data to storage token:${token}\ndata:${JSON.stringify(value,null,2)}`);
        console.log('====================================');
        localStorage.setItem(token,JSON.stringify(value));
    }
    static getStorageData(value){
        return localStorage.getItem(value);
        /* let resultAuthData= localStorage.getItem("bookapp_storage");
        console.log('====================================');
        console.log(`data from storage:${JSON.stringify(resultAuthData,null,2)}`);
        console.log('====================================');
        return resultAuthData; */
    }
    static clearStorage(){
        localStorage.clear();
    }
}
export default ChallengeApi;