// import React, { useState, useRef } from "react";
// import Draggable from "react-draggable";
// import "./dnd1.css";

// const initialItems = [
//   { id: "1", name: "Tree 🌳" },
//   { id: "2", name: "Flower 🌸" },
//   { id: "3", name: "Bench 🪑" },
//   { id: "4", name: "Pathway 🚶" },
// ];

// function Dnd1() {
//   const [workspaceItems, setWorkspaceItems] = useState([]);
//   const [positions, setPositions] = useState({});
//   const [workspaceSize, setWorkspaceSize] = useState({ width: 600, height: 400 }); // גודל התיבה
//   const workspaceRef = useRef(null);

//   const addItemToWorkspace = (item) => {
//     const newItem = {
//       ...item,
//       id: `${item.id}-${Date.now()}`, // מזהה ייחודי
//     };
//     setWorkspaceItems([...workspaceItems, newItem]);
//     setPositions({
//       ...positions,
//       [newItem.id]: { x: 0, y: 0 },
//     });
//   };

//   const handleDrag = (e, data, id) => {
//     setPositions({
//       ...positions,
//       [id]: { x: data.x, y: data.y },
//     });
//   };

//   const handleResize = (e) => {
//     // עדכון הגודל החדש של ה-Workspace
//     const newWidth = e.clientX - workspaceRef.current.offsetLeft;
//     const newHeight = e.clientY - workspaceRef.current.offsetTop;

//     // בדיקה למינימום גודל
//     if (newWidth > 300 && newHeight > 300) {
//       setWorkspaceSize({ width: newWidth, height: newHeight });
//     }
//   };

//   return (
//     <div className="App">
//       <h1>Dynamic Garden Designer 🌱</h1>
//       <div className="container">
//         {/* תיבת המוצרים */}
//         <div className="sidebar">
//           <h2>Available Items</h2>
//           {initialItems.map((item) => (
//             <div
//               key={item.id}
//               className="item"
//               onClick={() => addItemToWorkspace(item)}
//             >
//               {item.name}
//             </div>
//           ))}
//         </div>

//         {/* אזור העבודה הדינמי */}
//         <div
//           className="workspace"
//           ref={workspaceRef}
//           style={{ width: workspaceSize.width, height: workspaceSize.height }}
//         >
//           <h2>Workspace</h2>
//           {workspaceItems.map((item) => (
//             <Draggable
//               key={item.id}
//               bounds="parent" // מניעת גרירה מחוץ לתיבה
//               defaultPosition={positions[item.id]}
//               onDrag={(e, data) => handleDrag(e, data, item.id)}
//             >
//               <div className="draggable-item">{item.name}</div>
//             </Draggable>
//           ))}
//           {/* אלמנט שינוי הגודל */}
//           <div
//             className="resizer"
//             onMouseDown={(e) => {
//               document.addEventListener("mousemove", handleResize);
//               document.addEventListener("mouseup", () => {
//                 document.removeEventListener("mousemove", handleResize);
//               });
//             }}
//           />
//         </div>
//       </div>

//       {/* הצגת הקורדינטות */}
//       <div className="coordinates">
//         <h2>Coordinates</h2>
//         <ul>
//           {Object.entries(positions).map(([id, pos]) => (
//             <li key={id}>
//               Item {id}: (x: {pos.x}, y: {pos.y})
//             </li>
//           ))}
//         </ul>
//       </div>
//     </div>
//   );
// }

// export default Dnd1;
// import React, { useState } from "react";
// import "./dnd1.css";

// const initialItems = [
//   { id: "1", name: "Tree 🌳" },
//   { id: "2", name: "Flower 🌸" },
//   { id: "3", name: "Bench 🪑" },
//   { id: "4", name: "Pathway 🚶" },
// ];

// const GRID_SIZE = 50; // גודל המשבצות (פיקסלים, לדוגמה מטר)

// function Dnd1() {
//   const [workspaceItems, setWorkspaceItems] = useState([]);

//   const addItemToWorkspace = (item) => {
//     const newItem = {
//       ...item,
//       id: `${item.id}-${Date.now()}`, // מזהה ייחודי
//       position: { x: 0, y: 0 }, // מיקום התחלתי
//     };
//     setWorkspaceItems([...workspaceItems, newItem]);
//   };

//   const handleDragEnd = (e, id) => {
//     const rect = e.target.getBoundingClientRect();
//     const x = Math.round((rect.left - rect.width / 2) / GRID_SIZE) * GRID_SIZE;
//     const y = Math.round((rect.top - rect.height / 2) / GRID_SIZE) * GRID_SIZE;

//     setWorkspaceItems((prevItems) =>
//       prevItems.map((item) =>
//         item.id === id ? { ...item, position: { x, y } } : item
//       )
//     );
//   };

//   return (
//     <div className="App">
//       <h1>Garden Designer with Grid 🌱</h1>
//       <div className="container">
//         {/* אזור המוצרים */}
//         <div className="sidebar">
//           <h2>Available Items</h2>
//           {initialItems.map((item) => (
//             <div
//               key={item.id}
//               className="item"
//               onClick={() => addItemToWorkspace(item)}
//             >
//               {item.name}
//             </div>
//           ))}
//         </div>

//         {/* לוח העבודה */}
//         <div className="workspace">
//           <div className="grid">
//             {/* האלמנטים בלוח */}
//             {workspaceItems.map((item) => (
//               <div
//                 key={item.id}
//                 className="draggable-item"
//                 style={{
//                   transform: `translate(${item.position.x}px, ${item.position.y}px)`,
//                 }}
//                 draggable
//                 onDragEnd={(e) => handleDragEnd(e, item.id)}
//               >
//                 {item.name}
//               </div>
//             ))}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default Dnd1;
// import React, { useState, useRef } from "react";
// import "./dnd1.css";

// const initialItems = [
//   { id: "1", name: "Tree 🌳" },
//   { id: "2", name: "Flower 🌸" },
//   { id: "3", name: "Bench 🪑" },
//   { id: "4", name: "Pathway 🚶" },
// ];

// const GRID_SIZE = 50; // גודל המשבצות בפיקסלים (לדוגמה, מטר)

// function Dnd1() {
//   const [workspaceItems, setWorkspaceItems] = useState([]);
//   const [workspaceSize, setWorkspaceSize] = useState({ width: 800, height: 800 }); // גודל לוח התחלתי
//   const workspaceRef = useRef(null);

//   const addItemToWorkspace = (item) => {
//     const newItem = {
//       ...item,
//       id: `${item.id}-${Date.now()}`, // מזהה ייחודי לכל פריט
//       position: { x: 0, y: 0 }, // מיקום התחלתי
//     };
//     setWorkspaceItems([...workspaceItems, newItem]);
//   };

//   const handleDragEnd = (e, id) => {
//     const rect = workspaceRef.current.getBoundingClientRect();
//     const x = Math.round((e.clientX - rect.left) / GRID_SIZE) * GRID_SIZE;
//     const y = Math.round((e.clientY - rect.top) / GRID_SIZE) * GRID_SIZE;

//     setWorkspaceItems((prevItems) =>
//       prevItems.map((item) =>
//         item.id === id ? { ...item, position: { x, y } } : item
//       )
//     );
//   };

//   const handleResize = (e) => {
//     // מאפשר שינוי גודל על ידי גרירה
//     const newWidth = e.clientX - workspaceRef.current.offsetLeft;
//     const newHeight = e.clientY - workspaceRef.current.offsetTop;

//     if (newWidth > GRID_SIZE && newHeight > GRID_SIZE) {
//       setWorkspaceSize({ width: newWidth, height: newHeight });
//     }
//   };

//   return (
//     <div className="App">
//       <h1>Dynamic Garden Designer with Resizable Grid 🌱</h1>
//       <div className="container">
//         {/* Sidebar של הפריטים */}
//         <div className="sidebar">
//           <h2>Available Items</h2>
//           {initialItems.map((item) => (
//             <div
//               key={item.id}
//               className="item"
//               onClick={() => addItemToWorkspace(item)}
//             >
//               {item.name}
//             </div>
//           ))}
//         </div>

//         {/* לוח העבודה */}
//         <div
//           className="workspace"
//           ref={workspaceRef}
//           style={{ width: workspaceSize.width, height: workspaceSize.height }}
//         >
//           <div className="grid">
//             {workspaceItems.map((item) => (
//               <div
//                 key={item.id}
//                 className="draggable-item"
//                 style={{
//                   transform: `translate(${item.position.x}px, ${item.position.y}px)`,
//                 }}
//                 draggable
//                 onDragEnd={(e) => handleDragEnd(e, item.id)}
//               >
//                 {item.name}
//               </div>
//             ))}
//           </div>
//           {/* Resizer */}
//           <div
//             className="resizer"
//             onMouseDown={(e) => {
//               document.addEventListener("mousemove", handleResize);
//               document.addEventListener("mouseup", () => {
//                 document.removeEventListener("mousemove", handleResize);
//               });
//             }}
//           />
//         </div>
//       </div>

//       {/* תצוגת הקורדינטות */}
//       <div className="coordinates">
//         <h2>Coordinates</h2>
//         <ul>
//           {workspaceItems.map((item) => (
//             <li key={item.id}>
//               {item.name}: (x: {item.position.x}, y: {item.position.y})
//             </li>
//           ))}
//         </ul>
//       </div>
//     </div>
//   );
// }

// export default Dnd1;
import React, { useState, useRef } from "react";
import "./dnd1.css";

const initialItems = [
  { id: "1", name: "Tree 🌳" },
  { id: "2", name: "Flower 🌸" },
  { id: "3", name: "Bench 🪑" },
  { id: "4", name: "Pathway 🚶" },
];

const GRID_SIZE = 50; // גודל המשבצות בפיקסלים

function Dnd1() {
  const [workspaceItems, setWorkspaceItems] = useState([]);
  const [workspaceSize, setWorkspaceSize] = useState({ width: 800, height: 800 }); // גודל לוח התחלתי
  const workspaceRef = useRef(null);

  const addItemToWorkspace = (item) => {
    const newItem = {
      ...item,
      id: `${item.id}-${Date.now()}`, // מזהה ייחודי לכל פריט
      position: { x: 0, y: 0 }, // מיקום התחלתי
    };
    setWorkspaceItems([...workspaceItems, newItem]);
  };

  const handleDragEnd = (e, id) => {
    const rect = workspaceRef.current.getBoundingClientRect();
    const x = Math.round((e.clientX - rect.left) / GRID_SIZE) * GRID_SIZE;
    const y = Math.round((e.clientY - rect.top) / GRID_SIZE) * GRID_SIZE;

    setWorkspaceItems((prevItems) =>
      prevItems.map((item) =>
        item.id === id ? { ...item, position: { x, y } } : item
      )
    );
  };

  const handleResize = (e) => {
    // מאפשר שינוי גודל על ידי גרירה
    const newWidth = e.clientX - workspaceRef.current.offsetLeft;
    const newHeight = e.clientY - workspaceRef.current.offsetTop;

    if (newWidth > GRID_SIZE && newHeight > GRID_SIZE) {
      setWorkspaceSize({ width: newWidth, height: newHeight });
    }
  };

  return (
    <div className="App">
      <h1>Dynamic Garden Designer with Resizable Grid 🌱</h1>
      <div className="container">
        {/* Sidebar של הפריטים */}
        <div className="sidebar">
          <h2>Available Items</h2>
          {initialItems.map((item) => (
            <div
              key={item.id}
              className="item"
              onClick={() => addItemToWorkspace(item)}
            >
              {item.name}
            </div>
          ))}
        </div>

        {/* לוח העבודה */}
        <div
          className="workspace"
          ref={workspaceRef}
          style={{ width: workspaceSize.width, height: workspaceSize.height }}
        >
          <div className="grid">
            {workspaceItems.map((item) => (
              <div
                key={item.id}
                className="draggable-item"
                style={{
                  transform: `translate(${item.position.x}px, ${item.position.y}px)`,
                }}
                draggable
                onDragEnd={(e) => handleDragEnd(e, item.id)}
              >
                {item.name}
              </div>
            ))}
          </div>
          {/* Resizer */}
          <div
            className="resizer"
            onMouseDown={(e) => {
              document.addEventListener("mousemove", handleResize);
              document.addEventListener("mouseup", () => {
                document.removeEventListener("mousemove", handleResize);
              });
            }}
          />
        </div>
      </div>

      {/* תצוגת הקורדינטות */}
      <div className="coordinates">
        <h2>Coordinates</h2>
        <ul>
          {workspaceItems.map((item) => (
            <li key={item.id}>
              {item.name}: (x: {item.position.x}, y: {item.position.y})
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default Dnd1;
