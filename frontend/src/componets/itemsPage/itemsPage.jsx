import React, { useEffect, useState } from "react";
import APIService from "../APIService";
import LoginPopup from "../LoginPopup";
import Navbar from "../landing page/src/Components/navbar/navbar";
import { useNavigate } from 'react-router-dom';
import "./index.css"
const ProductList = () => {
    
    // נתונים לדוגמה
    const [TypeItem,setTypeItem] =useState(0)
    const [showModal, setShowModal] = useState(false); // שליטה על החלונית
    // const [show, setShow] = useState(false);
    const [Products, setProducts] =useState([]);
    const [searchTerm, setSearchTerm] = useState(""); // טקסט לחיפוש
    const [filterType, setFilterType] = useState("All"); // סינון לפי סוג
    const [selectedProduct, setSelectedProduct] = useState(null); // מוצר לעריכה
    const [user, setUser] = useState({});
    const [gardenElement, setGardenElement] =useState([]);
    const [selectedImage, setSelectedImage] = useState(null);
    // סינון רשימה לפי שם וסוג
    const filteredProducts = Products.filter((product) => {
        const matchesSearch = product.plant_name.toLowerCase().includes(searchTerm.toLowerCase());

        return matchesSearch;
    });
    const navigate = useNavigate();
    const filteredGardenItem = gardenElement.filter((product) => {
        const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());

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
            console.log(res.data)
            setProducts(res.data)
        })
        APIService.GardenElement().then(res=>{
            console.log(res.data)
            setGardenElement(res.data)
        })
        setUser(JSON.parse(localStorage.getItem('loggedInUser')) || {});
        console.log(user.Type)
       
    },[])
    const handleShowImage = (product) => {
        setSelectedImage(`data:image/jpeg;base64,${product.img}`); // הגדרת התמונה שנבחרה
      };
    return (
         <div>

             <Navbar hundleOpenLoginPopup={hundleOpenLoginPopup} />
             {
                show ?
                <LoginPopup isOpen={show} setIsOpen={setshow} />
                :<></>
              }
        {/* {
            user.Type==1 || user.Type==3 ? */}
            <div>
               
                <div className="container">
                    <div
                        style={{
                        width: "300px",
                        height: "400px",
                        border: "1px solid #ccc",
                        borderRadius: "8px",
                        marginRight: "20px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        backgroundColor: "#f9f9f9",
                        }}
                    >
                        {selectedImage ? (
                        <img
                            src={selectedImage}
                            alt="Selected Product"
                            style={{ maxWidth: "100%", maxHeight: "100%", borderRadius: "8px" }}
                        />
                        ) : (
                        <p style={{ textAlign: "center" }}>No image selected</p>
                        )}
                    </div>
                    <div className="header">
                        <h1>Products List</h1>
                        <button
                            className="btn btn-primary add-button"
                            onClick={() => {
                                console.log("Add button clicked");
                                navigate('/CreateProduct')
                                // הוסף כאן פעולה כמו פתיחת חלונית להוספת מוצר חדש
                            }}
                        >
                            <i className="bi bi-plus"></i> 
                        </button>
                    </div>
                        <div className="filter-container">
                            <input
                                type="text"
                                placeholder="Search by name"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
        
                        </div>
                        <ul>
                            <div>
                            {filteredProducts.map((product) => (
                                <li>
                                    <div  key={product.plant_id} onClick={() => {
                                    setSelectedProduct(product);
                                   console.log(product.plant_id)
                                    if( user.Type==1 || user.Type==3){
                                        setShowModal(true);
                                        setTypeItem(1)
                                    }
                                    
                                }}>
                                    <strong>{product.plant_name}</strong> ({product.climate_name}) - ${product.price}<br></br> 
                                    {product.info}
                                    </div>
                                    <button onClick={() => handleShowImage(product)}>Show Image</button>
                                   
                                
                                </li>
                                
                            ))}
                            </div>
                      
                            {filteredGardenItem.map((product) => (
                              <li>
                                <div  key={product.id} onClick={() => {
                                        console.log(product.id)
                                        setSelectedProduct(product);
                                        if( user.Type==1 || user.Type==3){
                                            setShowModal(true);
                                            setTypeItem(1)
                                        }
                                        
                                    }}>
                                    <strong>{product.name}</strong>  - ${product.price}<br></br> 
                                    {product.info}
                                    </div>
                                    <button onClick={() => handleShowImage(product)}>Show Image</button>
                                </li>
                            ))}
                        </ul>
                
                        <ul>
                            
                        </ul>
                
                    </div>
                    <div>
                    {
                        user.Type==1 || user.Type==3 ?
                        <div>
                        {showModal &&  (
                            <Modal
                                product={selectedProduct}
                                setProdouct={TypeItem === 1 ? setProducts : setGardenElement}
                                onClose={() => setShowModal(false)}
                                onSave={handleUpdateProduct}
                                TypeItem={TypeItem}
                            />
                        )}
                        </div>
                        
                        :null}
                        
                    </div>
            </div>
            {/* :<></> */}
        {/* } */}
        
    </div>
    );
};


const Modal = ({ product,setProdouct, onClose, onSave,TypeItem }) => {
    useEffect(()=>{
        // console.log(1+"e ",TypeItem)
    },[])
    const [updatedProduct, setUpdatedProduct] = useState({ ...product });
    const hundlesubmit = () => {
        onSave(updatedProduct);
        console.log(updatedProduct);
    
        if (TypeItem === 1) {
            APIService.updateplants(updatedProduct)
                .then((res) => {
                    console.log("Plant updated:", res.data);

                })
                .catch((err) => {
                    console.error("Error updating plant:", err);
                });
        } else if (TypeItem === 2) {
            APIService.updateGardenItem(updatedProduct)
                .then((res) => {
                    console.log("Garden item updated:", res.data.new_elements);
                    setProdouct(res.data.new_elements)
                })
                .catch((err) => {
                    console.error("Error updating garden item:", err);
                });
        }
    };
    
    const handleChange = (e) => {
        const { name, value } = e.target;
    
        setUpdatedProduct((prev) => {
            // עדכון השדה המתאים לפי TypeItem
            // if (TypeItem === 1 && (name === "plant_name" || name === "plant_price")) {
            //     return { ...prev, [name]: value };
            // } else if (TypeItem === 2 && (name === "name" || name === "price")) {
            //     return { ...prev, [name]: value };
            // }
            return { ...prev, [name]: value };
            
        });
    };
    

    return (
        <div className="modal-backdrop">
            {/* <div className="modal">
                <h2>Edit Product</h2>
           
            </div> */}
            {/* <h2>Edit Product</h2> */}
            <div className="box">
                <h2>Edit Product</h2>
                {/* <label>
                    Name:
                   
                    <input
                        type="text"
                        name={TypeItem === 1 ? "plant_name" : "name"}
                        value={TypeItem === 1 ? updatedProduct.plant_name : product.name}
                        onChange={handleChange}
                    />
                </label> */}
                <label>
                    Price:
                    <input
                        type="number"
                        name={"price"}
                        value={updatedProduct.price}
                        onChange={handleChange}
                    />
                </label>
                <label>
                    info:
                   
                    <textarea
                        name="info"
                        value={updatedProduct.info}
                        onChange={handleChange}
                        style={{ width: "100%", height: "100px", resize: "vertical" }} // הגדלת התיבה
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
