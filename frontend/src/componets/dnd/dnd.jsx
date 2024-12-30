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
        <div
            ref={drag}
            className={`sidebar-item ${isDragging ? "dragging" : ""}`}
        >
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
        <div
            ref={drop}
            className={`board-cell ${isOver ? "hover" : ""}`}
        >
            {children}
        </div>
    );
};

// הלוח
const Board = ({ size, items, onDrop }) => {
    const cells = [];
    for (let x = 0; x < size.rows; x++) {
        for (let y = 0; y < size.cols; y++) {
            const itemInCell = items.find(
                (item) => item.x === x && item.y === y
            );
            cells.push(
                <BoardCell key={`${x}-${y}`} x={x} y={y} onDrop={onDrop}>
                    {itemInCell && <div className="board-item">{itemInCell.name}</div>}
                </BoardCell>
            );
        }
    }

    return <div className="board" style={{ gridTemplateColumns: `repeat(${size.cols}, 1fr)` }}>{cells}</div>;
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
            ...prevItems.filter((i) => i.id !== item.id), // הסרת פריט קיים
            { ...item, x, y },
        ]);
    };

    return (
        <DndProvider backend={HTML5Backend}>
            <div className="app">
                <div className="sidebar">
                    {sidebarItems.map((item) => (
                        <SidebarItem key={item.id} item={item} />
                    ))}
                </div>
                <Board size={boardSize} items={items} onDrop={handleDrop} />
            </div>
        </DndProvider>
    );
};

export default DndBoardApp;
