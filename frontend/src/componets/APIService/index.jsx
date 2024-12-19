import axios from "axios";


//const API_URL = "http://172.20.10.2:5000/" 
//const API_URL = "http://localhost:5000/" 
//const API_URL = "http://10.100.102.17:5000/"
// "http://172.19.42.37:5000/"
// "http://172.19.34.128:5000"
const API_URL = "http://127.0.0.1:5000/"
class ApiServices
{
    


    // newComment(newComment){
    //      //console.log(1)

    //      return axios.post(API_URL+'newComment',  newComment,{'Access-Control-Allow-Origin': '*'});
    // }
    user(){
        return axios.get(API_URL+'users', {'Access-Control-Allow-Origin': '*'})
    }
    usersType(){
        return axios.get(API_URL+'usersType', {'Access-Control-Allow-Origin': '*'})
    }
    createUser(newUser){
        // console.log(1)
         return axios.post(API_URL+'newUser', newUser,  {'Access-Control-Allow-Origin': '*'});
     }
     updateSupplier(id, data) {
        return axios.put(API_URL + `suppliers/${id}`, data, { 'Access-Control-Allow-Origin': '*' });
    }
  
}

export default new ApiServices()