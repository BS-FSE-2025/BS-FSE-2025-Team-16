

import Navbar from "../landing page/src/Components/navbar/navbar";
import { useEffect, useState } from "react";
import LoginPopup from "../LoginPopup";
import "./Supplier_list.css";
import APIService from "../APIService";

function SuppliersPage() {
    const [selectedSupplier, setSelectedSupplier] = useState(null);
    const [suppliers, setSuppliers] = useState([]);
    const [editForm, setEditForm] = useState({ id: null, name: "", info: "" });
    const [isEditMode, setIsEditMode] = useState(false);
    const [user, setUser] = useState(JSON.parse(localStorage.getItem('loggedInUser')));
    
    useEffect(() => {
        const savedUser = JSON.parse(localStorage.getItem("loggedInUser"));
        if (!savedUser) {
            window.location.href = '/';
            return;
        }
        APIService.user().then(data => {
            setSuppliers((data.data).filter((user) => user.Type === 3));
        });
    }, []);

    const [show, setshow] = useState(false);

    const hundleOpenLoginPopup = () => {
        setshow(!show);
    };

    const handleSupplierClick = (supplier) => {
        setSelectedSupplier(supplier);
        setEditForm({ id: supplier.Id, name: supplier.Name, info: supplier.info });
    };

    const handleBackClick = () => {
        setSelectedSupplier(null);
        setIsEditMode(false);
        setEditForm({ id: null, name: "", info: "" }); // איפוס הטופס
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setEditForm({ ...editForm, [name]: value });
    };

    const handleFormSubmit = (e) => {
        e.preventDefault();
        APIService.updateSupplier({
            id: editForm.id,
            name: editForm.name,
            info: editForm.info
        }).then(() => {
            setSuppliers(suppliers.map(supplier => 
                supplier.Id === editForm.id ? { ...supplier, Name: editForm.name, info: editForm.info } : supplier
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
            {show ? 
                <LoginPopup isOpen={show} setIsOpen={setshow} /> 
                : <></>
            }

            {/* Title */}
            <h1>Suppliers That Work with Us</h1> 

            {selectedSupplier ? (
                isEditMode ? (
                    <div className="supplier-info">
                        <h2>Edit Supplier Info</h2>
                        <form onSubmit={handleFormSubmit}>
                            <p>Name: {editForm.name}</p>
                            <p>Info:</p>
                            <textarea
                                name="info"
                                value={editForm.info}
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
                        {(user.Id === selectedSupplier.Id || user.Type === 1) && (
                            <button onClick={handleEditClick}>Edit</button>
                        )}
                        
                        <button onClick={handleBackClick}>Back</button>
                    </div>
                )
            ) : (
                <ul className="supplier-list">
                    {suppliers.map(supplier => (
                        <li key={supplier.Id} onClick={() => handleSupplierClick(supplier)}>
                            <h3>{supplier.Name}</h3>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}

export default SuppliersPage;
