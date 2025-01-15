import axios from "axios";


//const API_URL = "http://172.20.10.2:5000/" 
//const API_URL = "http://localhost:5000/" 
//const API_URL = "http://10.100.102.17:5000/"
// "http://172.19.42.37:5000/"
// "http://172.19.34.128:5000"
const API_URL = "http://127.0.0.1:5001/"
class ApiServices
{
    


    // newComment(newComment){
    //      //console.log(1)

    //      return axios.post(API_URL+'newComment',  newComment,{'Access-Control-Allow-Origin': '*'});
    // }
    user(){
        return axios.get(API_URL+'users', {'Access-Control-Allow-Origin': '*'})
    }
    projects(){
        return axios.get(API_URL+'projects', {'Access-Control-Allow-Origin': '*'})
    }
    usersType(){
        return axios.get(API_URL+'usersType', {'Access-Control-Allow-Origin': '*'})
    }
    climateType(){
        return axios.get(API_URL+'climateType', {'Access-Control-Allow-Origin': '*'})
    }
    plantsType(){
        return axios.get(API_URL+'plantsType', {'Access-Control-Allow-Origin': '*'})
    }
    createUser(newUser){
        // console.log(1)
         return axios.post(API_URL+'newUser', newUser,  {'Access-Control-Allow-Origin': '*'});
     }
     updateSupplier(data) {
        return axios.post(API_URL + `suppliers`, data, { 'Access-Control-Allow-Origin': '*' });
    }
    updateDesigner(data) {
        return axios.post(API_URL + `designers`, data, { 'Access-Control-Allow-Origin': '*' });
    }
    updateUser(data) {
        return axios.post(API_URL + `updateUserStatus`, data, { 'Access-Control-Allow-Origin': '*' });
    }
    plants(){
        return axios.get(API_URL+'plants', {'Access-Control-Allow-Origin': '*'})
    }
    updateplants(UpdatePlants){
        console.log(UpdatePlants.id)
         return axios.post(API_URL+'UpdatePlants', {
            plants: {
                info: UpdatePlants.info,
                price: UpdatePlants.price,
                id: UpdatePlants.id
                
            }
        },  {'Access-Control-Allow-Origin': '*'});
        


        
     }
     updateGardenItem(UpdateGardenElement){
        // console.log(1)
         return axios.post(API_URL+'UpdateGardenElement', {
            garden: {
                info: UpdateGardenElement.info,
                price: UpdateGardenElement.price,
                id: UpdateGardenElement.id
                
            }
        },  {'Access-Control-Allow-Origin': '*'});
        


        
     }

     NewPlants(newPlants){
        console.log(newPlants)
         return axios.post(API_URL+'newPlants', newPlants,  {'Access-Control-Allow-Origin': '*'});
    }
    NewELement(newELement){
        console.log(newELement)
         return axios.post(API_URL+'newElement', newELement,  {'Access-Control-Allow-Origin': '*'});
    }

     NewProject(newProject){
        console.log(newProject)
         return axios.post(API_URL+'newProject', newProject,  {'Access-Control-Allow-Origin': '*'});
    }
    NewReview(newReview){
        console.log(newReview)
         return axios.post(API_URL+'newReview', newReview,  {'Access-Control-Allow-Origin': '*'});
    }
    GardenElement(){
        return axios.get(API_URL+'gardenElement', {'Access-Control-Allow-Origin': '*'})
    }
    insertItemProject(categorizedItems){
        return axios.post(API_URL+'insertItemProject',categorizedItems, {'Access-Control-Allow-Origin': '*'})
    }
    ProjectDetails(project){
        console.log({"project":project})
        return axios.post(API_URL+'project_details',{"project":project}, {'Access-Control-Allow-Origin': '*'})
    }
    deleteProject(projectid){
        return axios.post(API_URL+'deleteProject',{"id":projectid}, {'Access-Control-Allow-Origin': '*'})
    }
    updateDesigner(data) {
        return axios.post(API_URL + `designers`, data, { 'Access-Control-Allow-Origin': '*' });
    }
    updateUser(data) {
        return axios.post(API_URL + `updateUserStatus`, data, { 'Access-Control-Allow-Origin': '*' });
    }
    InsertImgToProject(data) {
        return axios.post(API_URL + `InsertImgToProject`, data, { 'Access-Control-Allow-Origin': '*' });
    }
    rating(){

        return axios.get(API_URL+'review', {'Access-Control-Allow-Origin': '*'})
     }
     copyProject(data) {
        return axios.post(API_URL + `copyProject`, data, { 'Access-Control-Allow-Origin': '*' });
    }
}

export default new ApiServices()