
import React, { useEffect, useState } from "react";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { customAlphabet } from "nanoid";
import "./DndBoard.css";
import APIService from "../APIService";
import Navbar from "../landing page/src/Components/navbar/navbar";
import LoginPopup from "../LoginPopup";
import html2canvas from "html2canvas"; // ייבוא הספרייה לצילום מסך

const ITEM_TYPE = "ITEM";
const nanoid = customAlphabet('1234567890', 10); // Creates unique numerical IDs

// Helper function to normalize item structure
const normalizeItem = (item) => {
    return {
        name: item.name || item.itemName || "Unknown",
        price: item.price || item.total_price || 0,
    };
};

// פריט בודד בסרגל
const SidebarItem = ({ item }) => {
    const normalizedItem = normalizeItem(item);
    const [{ isDragging }, drag] = useDrag(() => ({
        type: ITEM_TYPE,
        item,
        collect: (monitor) => ({
            isDragging: !!monitor.isDragging(),
        }),
    }));

    return (
        <div ref={drag} className={`sidebar-item ${isDragging ? "dragging" : ""}`}>
            {normalizedItem.name} - ${normalizedItem.price}
        </div>
    );
};

// תא בלוח
const BoardCell = ({ x, y, children, onDrop, items, showMessage }) => {
    const [{ isOver }, drop] = useDrop(() => ({
        accept: ITEM_TYPE,
        drop: (item) => {
            const isCellOccupied = items.some((existingItem) => existingItem.x === x && existingItem.y === y);
            if (!isCellOccupied) {
                onDrop(item, x, y);
            } else {
                showMessage("Cell is already occupied!");
            }
        },
        collect: (monitor) => ({
            isOver: !!monitor.isOver(),
        }),
    }));

    return (
        <div ref={drop} className={`board-cell ${isOver ? "hover" : ""}`}>
            {children}
        </div>
    );
};

// רכיב הרשימה של פריטים שנקנו
const PurchasedList = ({ purchasedItems, onRemove }) => {
    const totalPrice = purchasedItems.reduce((sum, item) => {
        const normalizedItem = normalizeItem(item);
        return sum + normalizedItem.price;
    }, 0);

    return (
        <div className="purchased-list">
            <h3>Purchased Items</h3>
            <ul>
                {purchasedItems.map((item) => {
                    const normalizedItem = normalizeItem(item);
                    return (
                        <li key={item.uniqueId}>
                            {normalizedItem.name} - ${normalizedItem.price}
                            <button
                                className="remove-button-purchased"
                                onClick={() => onRemove(item.uniqueId)}
                            >
                                X
                            </button>
                        </li>
                    );
                })}
            </ul>
            <h4>Total Price: ${totalPrice}</h4>
        </div>
    );
};

// הלוח
const Board = ({ size, items, onDrop, onRemove, showMessage }) => {
    const cells = [];
    for (let x = 0; x < size.rows; x++) {
        for (let y = 0; y < size.cols; y++) {
            const itemsInCell = items.filter((item) => item.x === x && item.y === y);
            cells.push(
                <BoardCell
                    key={`${x}-${y}`}
                    x={x}
                    y={y}
                    onDrop={onDrop}
                    items={items}
                    showMessage={showMessage}
                >
                    {itemsInCell.map((item) => (
                        <div key={item.uniqueId} className="board-item">
                            <img
                                src={`data:image/jpeg;base64,${item.img}`}
                                alt="Selected Product"
                            />
                            <button
                                className="remove-button"
                                onClick={() => onRemove(item.uniqueId)}
                            >
                                X
                            </button>
                        </div>
                    ))}
                </BoardCell>
            );
        }
    }

    return (
        <div className="board" style={{ gridTemplateColumns: `repeat(${size.cols}, 1fr)` }}>
            {cells}
        </div>
    );
};

// האפליקציה
const DndBoardApp = () => {
    const [loggedInUser, setLoggedInUser] = useState(null);
    const [project, setProject] = useState({});
    const [boardSize, setBoardSize] = useState({ rows: 5, cols: 5 });
    const [items, setItems] = useState([]);
    const [purchasedItems, setPurchasedItems] = useState([]);
    const [removedItems, setRemovedItems] = useState([]); // רשימת פריטים שהוסרו
    const [sidebarItems, setSidebarItems] = useState([]);
    const [show, setshow] = useState(false);
    const [message, setMessage] = useState("");

    useEffect(() => {
        const initialize = async () => {
            const savedUser = JSON.parse(localStorage.getItem("loggedInUser"));
            if (!savedUser) {
                window.location.href = '/';
                return;
            }
    
            try {
                // בדיקת פרויקטים בשרת
                const projectsResponse = await APIService.projects();
                if (projectsResponse.data.filter((project) => project.inactive === 1 && project.client_id==savedUser.Id).length === 0) {
                    window.location.href = '/';
                    return;
                }
    
                // בדיקת פרויקט שמור ב-localStorage
                const savedProject = JSON.parse(localStorage.getItem("project"));
                console.log("Saved Project:", savedProject);
    
                if (savedUser) {
                    setLoggedInUser(savedUser);
    
                    if (savedProject) {
                        setProject(savedProject);
                        setBoardSize({ rows: savedProject.Width, cols: savedProject.Len });
                    }
                }
    
                // הבאת פריטים לסרגל הצד
                const fetchSidebarItems = async () => {
                    try {
                        const plantsResponse = await APIService.plants();
                        const gardenElementsResponse = await APIService.GardenElement();
                        const plants = plantsResponse.data.map((plant) => ({
                            ...plant,
                            type: "Plant",
                            uniqueId: parseInt(nanoid()),
                        }));
                        const gardenElements = gardenElementsResponse.data.map((element) => ({
                            ...element,
                            type: "Garden Element",
                            uniqueId: parseInt(nanoid()),
                        }));
                        setSidebarItems([...plants, ...gardenElements]);
                    } catch (error) {
                        console.error("Error fetching sidebar items:", error);
                    }
                };
    
                await fetchSidebarItems(); // קריאה לפונקציה שהביאה פריטים
            } catch (error) {
                console.error("Error during initialization:", error);
            }
        };
    
        initialize(); // קריאה לפונקציה
    }, []);
    

    useEffect(() => {

        if (project.id) { // בדיקה אם project הוגדר
            console.log(project.id)

            APIService.ProjectDetails(project)
                .then((res) => {
                    console.log("Project details:", res.data);
    
                    // מיפוי הנתונים למבנה הנדרש
                    const updatedItems = res.data["data"].map((item) => ({
                        ...item,
                        uniqueId: item.detail_id || parseInt(nanoid()), // יצירת uniqueId במידת הצורך
                        x: item.x || 0, // ברירת מחדל אם לא קיים ערך
                        y: item.y || 0, // ברירת מחדל אם לא קיים ערך
                    }));
    
                    setItems(updatedItems); // עדכון items
                    setPurchasedItems(updatedItems); // עדכון Purchased Items


                })
                .catch((error) => console.error("Error fetching project details:", error));
        }
    }, [project]); // פועל בכל פעם ש-project משתנה


    const handleDrop = (item, x, y) => {
        // בדיקה אם כבר קיים פריט עם אותן קורדינטות
        const isCellOccupied = items.some(existingItem => existingItem.x === x && existingItem.y === y);
        if (isCellOccupied) {
            showMessage("Cell is already occupied!"); // הצגת הודעה למשתמש
            return; // עצירה אם המשבצת תפוסה
        }
    
        // יצירת פריט חדש עם מזהה ייחודי
        const uniqueId = parseInt(nanoid());
        const newItem = { ...item, uniqueId, x, y };
    
        // הוספת הפריט החדש
        setItems((prevItems) => {
            const updatedItems = [...prevItems, newItem];
    
            // בדיקה אם יש יותר מפריט אחד עם אותן קורדינטות
            const itemsWithSameCoordinates = updatedItems.filter(existingItem => existingItem.x === x && existingItem.y === y);
            if (itemsWithSameCoordinates.length > 1) {
                showMessage("Cell is already occupied!");
                // שמירה על הפריט האחרון בלבד
                return updatedItems.filter(existingItem => existingItem.uniqueId !== uniqueId);
                 
            }
    
            return updatedItems;
        });
    
        setPurchasedItems((prevPurchased) => {
            const updatedPurchased = [...prevPurchased, newItem];
    
            // בדיקה אם יש יותר מפריט אחד עם אותן קורדינטות
            const itemsWithSameCoordinates = updatedPurchased.filter(existingItem => existingItem.x === x && existingItem.y === y);
            if (itemsWithSameCoordinates.length > 1) {
                showMessage("Cell is already occupied!");
                // שמירה על הפריט האחרון בלבד
                return updatedPurchased.filter(existingItem => existingItem.uniqueId !== uniqueId);
            }
    
            return updatedPurchased;
        });
    
        console.log("Added new item:", newItem);
    };
    
    
    

    const handleRemoveItem = (uniqueId) => {
        setItems((prevItems) => prevItems.filter((item) => item.uniqueId !== uniqueId));
        setPurchasedItems((prevPurchased) =>
            prevPurchased.filter((item) => item.uniqueId !== uniqueId)
        );
        setRemovedItems((prevRemoved) => [
            ...prevRemoved,
            items.find((item) => item.uniqueId === uniqueId),
        ]); // שמירה ברשימת הפריטים שהוסרו
    };

    const showMessage = (msg) => {
        setMessage(msg);
        setTimeout(() => setMessage(""), 3000);
    };

    const hundleOpenLoginPopup = () => {
        setshow(!show);
    };

    // const handleSave = async () => {
    //     console.log("Save button clicked");
    //     const categorizedItems = items.reduce(
    //         (acc, item) => {
    //             acc[item.type] = acc[item.type] || [];
    //             acc[item.type].push(item);
    //             return acc;
    //         },
    //         { "Plant": [], "Garden Element": [], project, removedItems }
    //     );
    //     console.log("Categorized Items:", categorizedItems);
    //     APIService.insertItemProject(categorizedItems);
    //     const boardElement = document.querySelector(".board"); // בוחר את הלוח
    //     if (boardElement) {
    //         try {
    //             const canvas = await html2canvas(boardElement); // יצירת קנבס מהאלמנט
    //             const base64Image = canvas.toDataURL("image/png"); // המרה ל-base64
    
    //             // console.log("Base64 Image String:", base64Image); // הדפסת המחרוזת ל-console
    //             APIService.InsertImgToProject({"img":base64Image,"id":project.id})
    //             // כאן ניתן לשלוח את המחרוזת לשרת Python
    //             // sendToPython(base64Image);
    //         } catch (error) {
    //             console.error("Error capturing screenshot:", error);
    //         }
    //     }
    // };
    const handleSave = async () => {
        console.log("Save button clicked");
    
        const categorizedItems = items.reduce(
            (acc, item) => {
                acc[item.type] = acc[item.type] || [];
                acc[item.type].push(item);
                return acc;
            },
            { "Plant": [], "Garden Element": [], project, removedItems }
        );
        console.log("Categorized Items:", categorizedItems);
    
        APIService.insertItemProject(categorizedItems);
    
        const boardElement = document.querySelector(".board"); // בוחר את הלוח
    
        if (boardElement) {
            try {
                // הוספת מחלקה להסתרת כפתורי המחיקה
                boardElement.classList.add("hide-remove-buttons");
    
                const canvas = await html2canvas(boardElement); // יצירת קנבס מהאלמנט
                const base64Image = canvas.toDataURL("image/png"); // המרה ל-base64
    
                APIService.InsertImgToProject({ img: base64Image, id: project.id });
    
                // הסרת המחלקה לאחר צילום המסך
                boardElement.classList.remove("hide-remove-buttons");
            } catch (error) {
                console.error("Error capturing screenshot:", error);
    
                // הסרת המחלקה במקרה של שגיאה
                boardElement.classList.remove("hide-remove-buttons");
            }
        }
    };
    

    return (
        <div>
            <Navbar hundleOpenLoginPopup={hundleOpenLoginPopup} />
            {show ? <LoginPopup isOpen={show} setIsOpen={setshow} /> : null}
            {message && <div className="message-box">{message}</div>}
            <DndProvider backend={HTML5Backend}>
                <div className="app">
                    <div className="sidebar">
                        {sidebarItems.map((item) => (
                            <SidebarItem key={item.uniqueId} item={item} />
                        ))}
                    </div>
                    <Board
                        size={boardSize}
                        items={items}
                        onDrop={handleDrop}
                        onRemove={handleRemoveItem}
                        showMessage={showMessage}
                    />
                    <div className="save-button-container">
                        <button className="save-button" onClick={handleSave}>
                            Save
                        </button>
                        {/* <button className="finish-button" onClick={handleFinish}>
                            Finish
                        </button> */}
                    </div>
                    <PurchasedList purchasedItems={purchasedItems} onRemove={handleRemoveItem} />
                </div>
            </DndProvider>
        </div>
    );
};

export default DndBoardApp;

    


