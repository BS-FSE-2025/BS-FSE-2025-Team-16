import { useNavigate } from 'react-router-dom';
import React, { useEffect, useState } from "react";
import "./CombinedForm.css";
import OptionsList from "../option";
import APIService from "../APIService";
const CombinedForm = () => {
    const [formType, setFormType] = useState("plant");
    const [PlantsType,setPlantsType] = useState([{}])
    const [climateType,setclimateType] = useState([{}])
    // <OptionsList optionsList={PlantsType} InputValue={TypePlants} setInputValue={SetTypePlants} />
    const [typesclimate,SetTypesclimate] =useState([{"id":1,"name":"Admin"}])
    const [TypePlants,SetTypePlants] =useState([{"id":1,"name":"Admin"}])
    const [formData, setFormData] = useState({
        id: "",
        name: "",
        price: "",
        // climate: "",
        // type: "",
        img: null,
        description: "",
    });
    useEffect(()=>{
        APIService.climateType().then(res=>{
            setclimateType(res.data)
            console.log(res.data)
        })
        APIService.plantsType().then(res=>{
            setPlantsType(res.data)
        })
    },[])

    const handleTypeChange = (e) => {
        const selectedType = e.target.value;
        setFormType(selectedType);
        setFormData((prev) => ({
            ...prev,
            climate: selectedType === "plant" ? "" : undefined,
            type: selectedType === "plant" ? "" : undefined,
        }));
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFormData((prev) => ({
                ...prev,
                img: file, // שמירת הקובץ בפורמט File
            }));
        }
    };
    const navigate = useNavigate();
    const handleSubmit = (e) => {
        e.preventDefault();

        // הצגת הנתונים בקונסול
        // const handleSubmit = (e) => {
            e.preventDefault();
        
            const reader = new FileReader();
            
                reader.readAsDataURL(formData.img);
                reader.onload = () => {
                    const base64Img = reader.result;
        
                    // יצירת אובייקט JSON
                    const jsonData = {
                        ...formData,
                        img: base64Img, // הוספת התמונה כ-Base64
                    };
                    console.log(jsonData)
                    if(formType=="plant"){
                        APIService.NewPlants({"data":jsonData, "climate":typesclimate, "type_plant":TypePlants,"img":JSON.stringify(jsonData.img)})
                    }else{
                        APIService.NewELement({"data":jsonData,"img":JSON.stringify(jsonData.img)})
                    }
                    
                };
                navigate("/ProductList");
            
        // };
        






        // תצוגה מוקדמת של התמונה בקונסול (אם יש)
        // if (formData.img) {
        //     const reader = new FileReader();
        //     reader.onload = () => {
        //         console.log("Image Preview Data (Base64):", reader.result);
        //     };
        //     reader.readAsDataURL(formData.img);
        // }



        // if(selectedType=="plant"){
            APIService.NewPlants({"data":formData, "climate":typesclimate, "type_plant":TypePlants})
        //}
    };

    return (
        <div className="combined-form">
            <h2 className="form-title">{formType === "plant" ? "Edit Plant" : "Edit Garden Element"}</h2>
            <form onSubmit={handleSubmit} className="form-container">
                <div className="form-group">
                    <label>
                        Type:
                        <select value={formType} onChange={handleTypeChange} className="form-select">
                            <option value="plant">Plant</option>
                            <option value="product">Garden Element</option>
                        </select>
                    </label>
                </div>

                <div className="form-group">
                    <label>
                        Name:
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                            className="form-input"
                        />
                    </label>
                </div>

                <div className="form-group">
                    <label>
                        Price:
                        <input
                            type="number"
                            name="price"
                            value={formData.price}
                            onChange={handleChange}
                            required
                            className="form-input"
                        />
                    </label>
                </div>

                <div className="form-group">
                    <label>
                        Description:
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            rows="4"
                            className="form-textarea"
                        />
                    </label>
                </div>

                <div className="form-group">
                    <label>
                        Image:
                        <input type="file" accept="image/*" onChange={handleImageChange} className="form-file-input" />
                    </label>
                    {formData.img && (
                        <div className="image-preview">
                            <p>Selected Image:</p>
                            <img
                                src={URL.createObjectURL(formData.img)}
                                alt="Preview"
                                className="preview-image"
                            />
                        </div>
                    )}
                </div>

                {formType === "plant" && (
                    <div>
                        <label>
                            Climate
                            <OptionsList optionsList={climateType} InputValue={typesclimate} setInputValue={SetTypesclimate} />
                        </label>

                        <label>
                                Plants
                                <OptionsList optionsList={PlantsType} InputValue={TypePlants} setInputValue={SetTypePlants} />
                        </label>

                    </div>
                )}

                <button type="submit" className="form-submit-button">Save</button>
            </form>
        </div>
    );
};

export default CombinedForm;
