import React, { useEffect, useState } from "react";
import APIService from "../APIService";
import LoginPopup from "../LoginPopup";
import Navbar from "../landing page/src/Components/navbar/navbar";

import "./index.css"
const ProductList = () => {

    // נתונים לדוגמה
    const [showModal, setShowModal] = useState(false); // שליטה על החלונית
    // const [show, setShow] = useState(false);
    const [Products, setProducts] =useState([]);
    const [searchTerm, setSearchTerm] = useState(""); // טקסט לחיפוש
    const [filterType, setFilterType] = useState("All"); // סינון לפי סוג
    const [selectedProduct, setSelectedProduct] = useState(null); // מוצר לעריכה
    // סינון רשימה לפי שם וסוג
    const filteredProducts = Products.filter((product) => {
        const matchesSearch = product.plant_name.toLowerCase().includes(searchTerm.toLowerCase());
        //const matchesType = filterType === "All" || product.type === filterType;
        return matchesSearch;
    });
    const [show,setshow]=useState(false)
    const hundleOpenLoginPopup =()=>{
      
      setshow(!show)
    }
    const handleUpdateProduct = (updatedProduct) => {
        setProducts((prev) =>
            prev.map((product) =>
                product.plant_id === updatedProduct.plant_id ? updatedProduct : product
            )
        );
        setShowModal(false); // סגירת החלונית
    };
    useEffect(()=>{
        APIService.plants().then(res=>{
            setProducts(res.data)
        })
    },[])
    return (
         <div>
             <Navbar hundleOpenLoginPopup={hundleOpenLoginPopup} />
             {
                show ?
                <LoginPopup isOpen={show} setIsOpen={setshow} />
                :<></>
              }

        <div className="container">
                   <h1>Plants List</h1>
            <div className="filter-container">
                <input
                    type="text"
                    placeholder="Search by name"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                {/* <select value={filterType} onChange={(e) => setFilterType(e.target.value)}>
                    <option value="All">All</option>
                    <option value="Plant">Plants</option>
                    <option value="Product">Products</option>
                </select> */}
            </div>
            <ul>
                {filteredProducts.map((product) => (
                    <li key={product.plant_id} onClick={() => {
                        setSelectedProduct(product);
                        setShowModal(true);
                    }}>
                        <strong>{product.plant_name}</strong> ({product.climate_name}) - ${product.plant_price}
                    </li>
                ))}
            </ul>
      
        </div>
        <div>
            {showModal && (
                <Modal
                    product={selectedProduct}
                    onClose={() => setShowModal(false)}
                    onSave={handleUpdateProduct}
                />
            )}
        </div>
    </div>
    );
};

// const Modal = ({ product, onClose, onSave }) => {
//     const [updatedProduct, setUpdatedProduct] = useState({ ...product });

//     const handleChange = (e) => {
//         const { name, value } = e.target;
//         setUpdatedProduct((prev) => ({ ...prev, [name]: value }));
//     };

//     return (
//         <div className="modal-backdrop">
//              <div className="modal">
//                 <h2>Edit Product</h2>
//                 <label>
//                     Name:
//                     <input
//                         type="text"
//                         name="plant_name"
//                         value={updatedProduct.plant_name}
//                         onChange={handleChange}
//                     />
//                 </label>
//                 <label>
//                     Type:
//                     <input
//                         type="text"
//                         name="plant_type"
//                         value={updatedProduct.plant_type}
//                         onChange={handleChange}
//                     />
//                 </label>
//                 <label>
//                     Price:
//                     <input
//                         type="number"
//                         name="plant_price"
//                         value={updatedProduct.plant_price}
//                         onChange={handleChange}
//                     />
//                 </label>
//                 <div className="modal-actions">
//                     <button onClick={onClose}>Cancel</button>
//                     <button onClick={() => onSave(updatedProduct)}>Save</button>
//                 </div>
//             </div>
//         </div>
    
//     );
// };
const Modal = ({ product, onClose, onSave }) => {

    const [updatedProduct, setUpdatedProduct] = useState({ ...product });
    const hundlesubmit =()=>{
        onSave(updatedProduct)
        console.log(updatedProduct)
        APIService.updateplants(updatedProduct).then((res)=>{
            console.log(res.data)
        })
    }
    const handleChange = (e) => {
        const { name, value } = e.target;
        setUpdatedProduct((prev) => ({ ...prev, [name]: value }));
    };

    return (
        <div className="modal-backdrop">
            {/* <div className="modal">
                <h2>Edit Product</h2>
           
            </div> */}
            {/* <h2>Edit Product</h2> */}
            <div className="box">
                <h2>Edit Product</h2>
                <label>
                    Name:
                    <input
                        type="text"
                        name="plant_name"
                        value={updatedProduct.plant_name || ""}
                        onChange={handleChange}
                    />
                </label>
                {/* <label>
                    Type:
                    <input
                        type="text"
                        name="plant_type"
                        value={updatedProduct.plant_type || ""}
                        onChange={handleChange}
                    />
                </label> */}
                <label>
                    Price:
                    <input
                        type="number"
                        name="plant_price"
                        value={updatedProduct.plant_price || ""}
                        onChange={handleChange}
                    />
                </label>
                <div className="modal-actions">
                    <button onClick={onClose}>Cancel</button>
                    <button onClick={hundlesubmit}>Save</button>
                </div>
            </div>
        </div>
    );
};


export default ProductList;
