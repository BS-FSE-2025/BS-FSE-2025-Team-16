import Navbar from "../landing page/src/Components/navbar/navbar";
import { useEffect, useState } from "react";
import LoginPopup from "../LoginPopup";
import "./Supplier_list.css";
import APIService from "../APIService";

function SuppliersPage() {
    // const [show, setShow] = useState(false);
    const [selectedSupplier, setSelectedSupplier] = useState(null);
    const [suppliers, setSuppliers] = useState([]);
    const [editForm, setEditForm] = useState({ name: "", info: "" });
    const [isEditMode, setIsEditMode] = useState(false);
    const [user, setUser] = useState(JSON.parse(localStorage.getItem('loggedInUser')));
    useEffect(() => {
        const savedUser = JSON.parse(localStorage.getItem("loggedInUser"));
            if (!savedUser) {
                window.location.href = '/';
                return;
            }
        APIService.user().then(data => {
            console.log(data.data);
            setSuppliers((data.data).filter((user) => user.Type === 3));
        });
    }, []);

    const [show,setshow]=useState(false)
    const hundleOpenLoginPopup =()=>{
      
      setshow(!show)
    }

    const handleSupplierClick = (supplier) => {
        setSelectedSupplier(supplier);
        setEditForm({ 
            id: supplier.Id, 
            name: supplier.name, 
            info: supplier.info 
        });
    };

    const handleBackClick = () => {
        setSelectedSupplier(null);
        setIsEditMode(false);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setEditForm({ ...editForm, [name]: value });
    };

    const handleFormSubmit = (e) => {
        e.preventDefault();
        console.log(editForm.id)
        //Update supplier information in the database
        APIService.updateSupplier({
            id: editForm.id, // הוסף את ה-ID
            name: editForm.name,
            info: editForm.info
        }).then(() => {
            // Update the local state with the new supplier information
            setSuppliers(suppliers.map(supplier => 
                supplier.id === selectedSupplier.id ? { ...supplier, ...editForm } : supplier
            ));
            setSelectedSupplier(null);
            setIsEditMode(false);
        }).catch((error) => {
            console.error("Error updating supplier:", error);
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
            {selectedSupplier ? (
                isEditMode ? (
                    <div className="supplier-info">
                        <h2>Edit Supplier Info</h2>
                        <form onSubmit={handleFormSubmit}>
                            <label>
                                Name:
                            </label>
                                <input
                                    type="text"
                                    name="name"
                                    value={selectedSupplier.Name}
                                    onChange={handleInputChange}
                                />
                            
                            <label>
                                Info:
                            </label>
                                <textarea
                                    name="info"
                                    value={selectedSupplier.info}
                                    onChange={handleInputChange}
                                />
                            
                            <button type="submit">Save</button>
                            <button type="button" onClick={handleBackClick}>Back</button>
                        </form>
                    </div>
                ) : (
                    <div className="supplier-info">
                        <h2>{selectedSupplier.Name}</h2>
                        <p>{selectedSupplier.info}</p>
                        {user.Id === selectedSupplier.Id && (
                        <button onClick={handleEditClick}>Edit</button>
                        )}
                        
                        <button onClick={handleBackClick}>Back</button>
                    </div>
                )
            ) : (
                <ul className="supplier-list">
                    {suppliers.map(supplier => (
                        <li key={supplier.Id} onClick={() =>{console.log(supplier.Id);
                         handleSupplierClick(supplier)}}>
                            <h3>{supplier.Name}</h3>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}

export default SuppliersPage;