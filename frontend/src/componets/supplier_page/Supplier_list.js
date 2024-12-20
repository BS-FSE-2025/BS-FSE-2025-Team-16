import Navbar from "../landing page/src/Components/navbar/navbar";
import { useEffect, useState } from "react";
import LoginPopup from "../LoginPopup";
import "./Supplier_list.css";
import APIService from "../APIService";

function SuppliersPage() {
    const [show, setShow] = useState(false);
    const [selectedSupplier, setSelectedSupplier] = useState(null);
    const [suppliers, setSuppliers] = useState([]);
    const [editForm, setEditForm] = useState({ name: "", info: "" });
    const [isEditMode, setIsEditMode] = useState(false);

    useEffect(() => {
        APIService.user().then(data => {
            console.log(data.data);
            setSuppliers((data.data).filter((user) => user.Type === 3));
        });
    }, []);

    const handleOpenLoginPopup = () => {
        setShow(!show);
    };

    const handleSupplierClick = (supplier) => {
        setSelectedSupplier(supplier);
        setEditForm({ name: supplier.name, info: supplier.info });
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
        // Update supplier information in the database
        APIService.updateSupplier(selectedSupplier.id, editForm).then(() => {
            // Update the local state with the new supplier information
            setSuppliers(suppliers.map(supplier => 
                supplier.id === selectedSupplier.id ? { ...supplier, ...editForm } : supplier
            ));
            setSelectedSupplier(null);
            setIsEditMode(false);
        });
    };

    const handleEditClick = () => {
        setIsEditMode(true);
    };

    return (
        <div>
            <Navbar handleOpenLoginPopup={handleOpenLoginPopup} />
            {show && <LoginPopup isOpen={show} setIsOpen={setShow} />}
            {selectedSupplier ? (
                isEditMode ? (
                    <div className="supplier-info">
                        <h2>Edit Supplier Info</h2>
                        <form onSubmit={handleFormSubmit}>
                            <label>
                                Name:
                                <input
                                    type="text"
                                    name="name"
                                    value={editForm.name}
                                    onChange={handleInputChange}
                                />
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
                    <div className="supplier-info">
                        <h2>{selectedSupplier.Name}</h2>
                        <p>{selectedSupplier.info}</p>
                        <button onClick={handleEditClick}>Edit</button>
                        <button onClick={handleBackClick}>Back</button>
                    </div>
                )
            ) : (
                <ul className="supplier-list">
                    {suppliers.map(supplier => (
                        <li key={supplier.id} onClick={() => handleSupplierClick(supplier)}>
                            <h3>{supplier.Name}</h3>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}

export default SuppliersPage;