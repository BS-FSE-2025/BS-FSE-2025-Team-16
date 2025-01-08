import Navbar from "../landing page/src/Components/navbar/navbar";
import { useEffect, useState } from "react";
import LoginPopup from "../LoginPopup";
import "./admin_page.css";
import APIService from "../APIService";

function AdminsPage() {
    // const [show, setShow] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [users, setUsers] = useState([]);
    const [editForm, setEditForm] = useState({ name: "", info: "" });
    const [isEditMode, setIsEditMode] = useState(false);
    const [user, setUser] = useState({});

    useEffect(() => {
        APIService.user().then(data => {
            console.log(data.data);
            setUsers((data.data).filter((user) => user.Type !== 1));
        });
        setUser(JSON.parse(localStorage.getItem('loggedInUser')) || {});
    }, []);

    const [show,setshow]=useState(false)
    const hundleOpenLoginPopup =()=>{
      
      setshow(!show)
    }

    const handleUserClick = (user) => {
        setSelectedUser(user);
        setEditForm({ 
            id: user.Id, 
            name: user.Name, 
            info: user.info,
            isActive: user.isActive
        });
    };

    const handleBackClick = () => {
        setSelectedUser(null);
        setIsEditMode(false);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setEditForm({ ...editForm, [name]: value });
    };
    const handleStatusToggle = () => {
        setEditForm({ ...editForm, isActive: !editForm.isActive });
    };

    const handleFormSubmit = (e) => {
        e.preventDefault();
        console.log(editForm.id)
        //Update user information in the database
        APIService.updateUser({
            id: editForm.id, // הוסף את ה-ID
            name: editForm.Name,
            info: editForm.info,
            isActive: editForm.isActive
        }).then(() => {
            // Update the local state with the new designer information
            setUsers(users.map(user => 
                user.id === selectedUser.id ? { ...user, ...editForm } : user
            ));
            APIService.user().then(data => {
                console.log(data.data);
                setUser((data.data).filter((user) => user.Type !== 1));
            });
            setSelectedUser(null);
            setIsEditMode(false);
            window.location.reload();
        }).catch((error) => {
            console.error("Error updating user:", error);
        });
    };

    const handleEditClick = () => {
        setIsEditMode(true);
    };

    return (
        <div>
               <Navbar hundleOpenLoginPopup={hundleOpenLoginPopup} />
             {
                show ?
                <LoginPopup isOpen={show} setIsOpen={setshow} />
                :<></>
              }
            {selectedUser ? (
                isEditMode ? (
                    <div className="user-info">
                        <h2>Edit User Status</h2>
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
                                Info: {editForm.info}
                                {/* <textarea
                                    name="info"
                                    value={editForm.info}
                                    onChange={handleInputChange}
                                /> */}
                            </label>
                            <label>
                                Status:
                                <button type="button" onClick={handleStatusToggle}>
                                    {editForm.isActive ? "Disable" : "Enable"}
                                </button>
                            </label>
                            <button type="submit">Save</button>
                            <button type="button" onClick={handleBackClick}>Back</button>
                        </form>
                    </div>
                ) : (
                    <div className="user-info">
                        <h2>{selectedUser.Name}</h2>
                        <p>{selectedUser.info}</p>
                        {user.Type === 1 &&  (
                        <button onClick={handleEditClick}>Edit</button>
                        )}
                        <button onClick={handleBackClick}>Back</button>
                    </div>
                )
            ) : (
                <ul className="user-list">
                    {users.map(user => (
                        <li key={user.Id} onClick={() =>{console.log(user.Id);
                         handleUserClick(user)}}>
                            <h3>{user.Name}</h3>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}

export default AdminsPage;