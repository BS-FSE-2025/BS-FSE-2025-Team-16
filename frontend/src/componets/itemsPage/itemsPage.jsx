
import React, { useEffect, useState } from "react";
import APIService from "../APIService";
import LoginPopup from "../LoginPopup";
import Navbar from "../landing page/src/Components/navbar/navbar";
import { useNavigate } from 'react-router-dom';
import "./index.css";

const ProductList = () => {
    const [TypeItem, setTypeItem] = useState(0);
    const [showModal, setShowModal] = useState(false);
    const [Products, setProducts] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [filterType, setFilterType] = useState("All");
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [user, setUser] = useState(JSON.parse(localStorage.getItem('loggedInUser')));
    const [gardenElement, setGardenElement] = useState([]);
    const [selectedImage, setSelectedImage] = useState(null);
    const navigate = useNavigate();
    const [showImagePopup, setShowImagePopup] = useState(false);

    const hundleOpenLoginPopup = () => {
        setShowImagePopup(!showImagePopup);
    };

    const reloadProducts = () => {
        APIService.plants().then((res) => setProducts(res.data));
        APIService.GardenElement().then((res) => setGardenElement(res.data));
    };

    const handleUpdateProduct = (updatedProduct) => {
        if (TypeItem === 1) {
            setProducts((prev) =>
                prev.map((product) =>
                    product.id === updatedProduct.id ? updatedProduct : product
                )
            );
        } else if (TypeItem === 2) {
            setGardenElement((prev) =>
                prev.map((product) =>
                    product.id === updatedProduct.id ? updatedProduct : product
                )
            );
        }
        reloadProducts();
        setShowModal(false);
    };

    const handleShowImage = (product) => {
        setSelectedImage(`data:image/jpeg;base64,${product.img}`);
        setShowImagePopup(true);
    };

    const filteredProducts = Products.filter((product) => {
        const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesSearch;
    });

    const filteredGardenItem = gardenElement.filter((product) => {
        const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesSearch;
    });

    useEffect(() => {
        reloadProducts();
        setUser(JSON.parse(localStorage.getItem('loggedInUser')) || {});
        const savedUser = JSON.parse(localStorage.getItem("loggedInUser"));
        if (!savedUser) {
            window.location.href = '/';
            return;
        }
    }, []);

    return (
        <div>
            <Navbar hundleOpenLoginPopup={hundleOpenLoginPopup} />
            <div>
                <div className="container">
                    <div className="header">
                        <h1>Products List</h1>
                        {
                            user.Type!==2 && user.Type!==4 &&                         
                        <button
                            className="btn btn-primary add-button"
                            onClick={() => navigate('/CreateProduct')}
                        >
                            <i className="bi bi-plus"></i>
                        </button>
                        }

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
                                <li key={product.id}>
                                    <div>
                                        <strong>{product.name}</strong> ({product.climate_name}) - ${product.price}<br />
                                        {product.info}
                                    </div>
                                    <button onClick={() => handleShowImage(product)}>Show Image</button>
                                    {(user.Type === 1 || user.Type === 3) && (
                                    <button
                                        onClick={() => {
                                            setSelectedProduct(product);
                                            setShowModal(true);
                                            setTypeItem(1);
                                        }}
                                    >
                                        Edit
                                    </button>
                                )}
                                </li>
                            ))}
                        </div>
                        {filteredGardenItem.map((product) => (
                            <li key={product.id}>
                                <div>
                                    <strong>{product.name}</strong> - ${product.price}<br />
                                    {product.info}
                                </div>
                                <button onClick={() => handleShowImage(product)}>Show Image</button>
                                {(user.Type === 1 || user.Type === 3) && (
                                    <button
                                        onClick={() => {
                                            setSelectedProduct(product);
                                            setShowModal(true);
                                            setTypeItem(2);
                                        }}
                                    >
                                        Edit
                                    </button>
                                )}
                                
                            </li>
                        ))}
                    </ul>
                </div>
                {user.Type === 1 || user.Type === 3 ? (
                    showModal && (
                        <Modal
                            product={selectedProduct}
                            setProdouct={TypeItem === 1 ? setProducts : setGardenElement}
                            onClose={() => setShowModal(false)}
                            onSave={handleUpdateProduct}
                            TypeItem={TypeItem}
                        />
                    )
                ) : null}
            </div>
            {showImagePopup && (
                <div className="modal-backdrop">
                    <div className="box">
                        <img
                            src={selectedImage}
                            alt="Selected Product"
                            style={{ maxWidth: "100%", maxHeight: "100%" }}
                        />
                        <button onClick={() => setShowImagePopup(false)}>Close</button>
                    </div>
                </div>
            )}
        </div>
    );
};

const Modal = ({ product, setProdouct, onClose, onSave, TypeItem }) => {
    const [updatedProduct, setUpdatedProduct] = useState({ ...product });

    const hundlesubmit = () => {
        onSave(updatedProduct);
        if (TypeItem === 1) {
            APIService.updateplants(updatedProduct)
                .then((res) => {
                    setProdouct((prev) => 
                        prev.map((item) => item.id === updatedProduct.id ? { ...item, ...updatedProduct } : item)
                    );
                })
                .catch((err) => {
                    console.error("Error updating plant:", err);
                });
        } else if (TypeItem === 2) {
            APIService.updateGardenItem(updatedProduct)
                .then((res) => {
                    setProdouct((prev) => 
                        prev.map((item) => item.id === updatedProduct.id ? { ...item, ...updatedProduct } : item)
                    );
                })
                .catch((err) => {
                    console.error("Error updating garden item:", err);
                });
        }
        onClose();
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setUpdatedProduct((prev) => {
            return { ...prev, [name]: value };
        });
    };

    return (
        <div className="modal-backdrop">
            <div className="box">
                <h2>Edit Product</h2>
                <label>
                    Price:
                    <input
                        type="number"
                        name="price"
                        value={updatedProduct.price}
                        onChange={handleChange}
                    />
                </label>
                <label>
                    Info:
                    <textarea
                        name="info"
                        value={updatedProduct.info}
                        onChange={handleChange}
                        style={{ width: "100%", height: "100px", resize: "vertical" }}
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
