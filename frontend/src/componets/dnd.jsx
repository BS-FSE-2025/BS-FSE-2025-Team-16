import React, { useState } from "react";

function DragAndDropBox() {
  const [droppedItems, setDroppedItems] = useState([]);

  const handleDrop = (e) => {
    e.preventDefault();
    const data = e.dataTransfer.getData("text/plain");
    if (data) {
      setDroppedItems((prev) => [...prev, data]);
    }
  };

  const allowDrop = (e) => {
    e.preventDefault(); // This allows the drop action
  };

  const handleDragStart = (e, item) => {
    e.dataTransfer.setData("text/plain", item);
  };

  return (
    <div style={{ display: "flex", gap: "20px" }}>
      {/* Draggable Items */}
      <div style={{ width: "200px", minHeight: "200px", border: "1px solid black", padding: "10px" }}>
        <h4>Draggable Items</h4>
        {["Item 1", "Item 2", "Item 3"].map((item, index) => (
          <div
            key={index}
            draggable
            onDragStart={(e) => handleDragStart(e, item)}
            style={{
              padding: "10px",
              margin: "5px 0",
              border: "1px solid gray",
              cursor: "grab",
              backgroundColor: "#f9f9f9",
            }}
          >
            {item}
          </div>
        ))}
      </div>

      {/* Drop Box */}
      <div
        onDrop={handleDrop}
        onDragOver={allowDrop}
        style={{
          width: "200px",
          minHeight: "200px",
          border: "1px solid green",
          padding: "10px",
          backgroundColor: "#f0fff0",
        }}
      >
        <h4>Drop Box</h4>
        {droppedItems.length === 0 ? (
          <p>Drop items here</p>
        ) : (
          droppedItems.map((item, index) => (
            <div
              key={index}
              style={{
                padding: "10px",
                margin: "5px 0",
                border: "1px solid gray",
                backgroundColor: "#e0f7e0",
              }}
            >
              {item}
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default DragAndDropBox;
