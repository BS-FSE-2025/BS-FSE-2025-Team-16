import React, { useState } from "react";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import "./DndBoard.css";

// סוג הפריט
const ITEM_TYPE = "ITEM";

// פריט בודד בסרגל
const SidebarItem = ({ item }) => {
    const [{ isDragging }, drag] = useDrag(() => ({
        type: ITEM_TYPE,
        item,
        collect: (monitor) => ({
            isDragging: !!monitor.isDragging(),
        }),
    }));

    return (
        <div ref={drag} className={`sidebar-item ${isDragging ? "dragging" : ""}`}>
            {item.name}
        </div>
    );
};

// תא בלוח
const BoardCell = ({ x, y, children, onDrop }) => {
    const [{ isOver }, drop] = useDrop(() => ({
        accept: ITEM_TYPE,
        drop: (item) => onDrop(item, x, y),
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

// הלוח
const Board = ({ size, items, onDrop, onRemove }) => {
    const cells = [];
    for (let x = 0; x < size.rows; x++) {
        for (let y = 0; y < size.cols; y++) {
            const itemsInCell = items.filter((item) => item.x === x && item.y === y);
            cells.push(
                <BoardCell key={`${x}-${y}`} x={x} y={y} onDrop={onDrop}>
                    {itemsInCell.map((item) => (
                        <div key={item.id} className="board-item">
                            {item.name}
                            <button
                                className="remove-button"
                                onClick={() => onRemove(item.id)}
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
    const [boardSize] = useState({ rows: 5, cols: 5 });
    const [items, setItems] = useState([]);
    const [sidebarItems] = useState([
        { id: 1, name: "Tree" },
        { id: 2, name: "Rock" },
        { id: 3, name: "Flower" },
    ]);

    const handleDrop = (item, x, y) => {
        setItems((prevItems) => [
            ...prevItems,
            { ...item, id: `${item.id}-${x}-${y}-${Date.now()}`, x, y },
        ]);
    };

    const handleRemoveItem = (id) => {
        setItems((prevItems) => prevItems.filter((item) => item.id !== id));
    };

    return (
        <DndProvider backend={HTML5Backend}>
            <div className="app">
                <div className="sidebar">
                    {sidebarItems.map((item) => (
                        <SidebarItem key={item.id} item={item} />
                    ))}
                </div>
                <Board size={boardSize} items={items} onDrop={handleDrop} onRemove={handleRemoveItem} />
            </div>
        </DndProvider>
    );
};

export default DndBoardApp;
