import Navbar from "../landing page/src/Components/navbar/navbar";
import { useEffect, useState } from "react";
import LoginPopup from "../LoginPopup";
import "./designer_list.css";
import APIService from "../APIService";

function DesignersPage() {
    // const [show, setShow] = useState(false);
    const [selectedDesigner, setSelectedDesigner] = useState(null);
    const [designers, setDesigners] = useState([]);
    const [editForm, setEditForm] = useState({ name: "", info: "" });
    const [isEditMode, setIsEditMode] = useState(false);
    const [user, setUser] = useState(JSON.parse(localStorage.getItem('loggedInUser')));
    const [desingerProjects, setDesignersProjects] = useState([]);
    const [myProjects,setMyprojects]=useState([])
    useEffect(() => {
        const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));
        if (!loggedInUser) {
            window.location.href = '/';
        } else {
        APIService.user().then(data => {
            console.log(data.data);
            setDesigners((data.data).filter((user) => user.Type === 4));
        });
        APIService.projects().then(data => {
            console.log(data.data);
            setMyprojects(data.data.filter((project) => project.client_id === loggedInUser.Id));
        })
    }
    }, []);

    const [show,setshow]=useState(false)
    const hundleOpenLoginPopup =()=>{
      
      setshow(!show)
    }

    const handleDesignerClick = (designer) => {
        setSelectedDesigner(designer);
        setEditForm({ 
            id: designer.Id, 
            name: designer.Name, 
            info: designer.info
        });
        APIService.projects().then(data => {
            console.log(data.data);
            setDesignersProjects(data.data.filter((project) => project.client_id === designer.Id));
        })
    };

    const handleBackClick = () => {
        setSelectedDesigner(null);
        setIsEditMode(false);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setEditForm({ ...editForm, [name]: value });
    };

    const handleFormSubmit = (e) => {
        e.preventDefault();
        console.log(editForm.id)
        //Update designer information in the database
        APIService.updateDesigner({
            id: editForm.id, // הוסף את ה-ID
            name: editForm.Name,
            info: editForm.info
        }).then(() => {
            // Update the local state with the new designer information
            setDesigners(designers.map(designer => 
                designer.id === selectedDesigner.id ? { ...designer, ...editForm } : designer
            ));
            APIService.user().then(data => {
                console.log(data.data);
                setDesigners((data.data).filter((user) => user.Type === 4));
            });
            setSelectedDesigner(null);
            setIsEditMode(false);
        }).catch((error) => {
            console.error("Error updating designer:", error);
        });
    };

    const handleEditClick = () => {
        setIsEditMode(true);
    };
    const hundleCopy =(project)=>{
        console.log(project)
        if(user.Type==2 && myProjects.length>0){
            window.alert("you cant copy the project becuse you have one and customer can work just on one project")
        }
        else{
            APIService.copyProject({"project":project,"user":user})
        }
        
    }

    return (
        <div>
               <Navbar hundleOpenLoginPopup={hundleOpenLoginPopup} />
             {
                show ?
                <LoginPopup isOpen={show} setIsOpen={setshow} />
                :<></>
              }
            <h1>Designer Page</h1>
            {selectedDesigner ? (
                isEditMode ? (
                    <div className="designer-info">
                        <h2>Edit Designer Info</h2>
                        <form onSubmit={handleFormSubmit}>
                            <label>
                                Name: {editForm.name}
                                {/* <input
                                    type="text"
                                    name="name"
                                    value={editForm.name}
                                    onChange={handleInputChange}
                                /> */}
                            </label>
                            <label>
                                Info:
                                <textarea
                                    name="info"
                                    value={editForm.info}
                                    onChange={handleInputChange}
                                />
                            </label>
                            <button type="submit">Save</button>
                            <button type="button" onClick={handleBackClick}>Back</button>
                        </form>
                    </div>
                ) : (
                    <div className="designer-info">
                        <h2>{selectedDesigner.Name}</h2>
                        <p>{selectedDesigner.info}</p>
                        {
                            desingerProjects.length > 0 && (
                                <div>
                                    <h3>Projects</h3>
                                    <ul>
                                        {desingerProjects.map(project => (
                                            <li key={project.id}>
                                                <h4>{project.name}</h4>
                                                <img key={project.id} src={`data:image/jpeg;base64,${project.img}`} alt={project.name} />
                                                <button onClick={()=>hundleCopy(project)}>copy</button>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )
                        }
                        {user.Id === selectedDesigner.Id && (
                        <button onClick={handleEditClick}>Edit</button>
                        )}
                        <button onClick={handleBackClick}>Back</button>
                    </div>
                )
            ) : (
                <ul className="designer-list">
                    {designers.map(designer => (
                        <li key={designer.Id} onClick={() =>{console.log(designer.Id);
                         handleDesignerClick(designer)}}>
                            <h3>{designer.Name}</h3>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}

export default DesignersPage;