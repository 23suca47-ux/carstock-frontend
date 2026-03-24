import React, { useEffect, useState } from "react";
import "./App.css";

const apiUrl = "http://localhost:8081/api/cars";

function App() {

  const [cars, setCars] = useState([]);
  const [brand, setBrand] = useState("");
  const [model, setModel] = useState("");
  const [price, setPrice] = useState("");
  const [quantity, setQuantity] = useState("");
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    loadCars();
  }, []);

  const loadCars = () => {
    fetch(apiUrl)
      .then(res => res.json())
      .then(data => setCars(data));
  };

  const saveCar = () => {

    const car = { brand, model, price, quantity };

    if (editingId === null) {

      fetch(apiUrl,{
        method:"POST",
        headers:{
          "Content-Type":"application/json"
        },
        body:JSON.stringify(car)
      }).then(()=>{
        loadCars();
        clearForm();
      });

    } else {

      fetch(`${apiUrl}/${editingId}`,{
        method:"PUT",
        headers:{
          "Content-Type":"application/json"
        },
        body:JSON.stringify(car)
      }).then(()=>{
        loadCars();
        clearForm();
        setEditingId(null);
      });

    }
  };

  const editCar = (car) => {
    setBrand(car.brand);
    setModel(car.model);
    setPrice(car.price);
    setQuantity(car.quantity);
    setEditingId(car.id);
  };

  const deleteCar = (id) => {
    fetch(`${apiUrl}/${id}`,{
      method:"DELETE"
    }).then(()=> loadCars());
  };

  const clearForm = () => {
    setBrand("");
    setModel("");
    setPrice("");
    setQuantity("");
  };
  const downloadCSV = () => {
    const headers = ["ID", "Brand", "Model", "Price", "Quantity"];

    const rows = filteredCars.map(car => [
      car.id,
      car.brand,
      car.model,
      car.price,
      car.quantity
    ]);

    let csvContent =
      "data:text/csv;charset=utf-8," +
      [headers, ...rows].map(e => e.join(",")).join("\n");

    const encodedUri = encodeURI(csvContent);

    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "car_stock.csv");
    document.body.appendChild(link);

    link.click();
  };  

  return (

    <div className="container">

      <h1 className="title">🚗 Car Stock Management</h1>

      <div className="form">

        <input
          placeholder="Brand"
          value={brand}
          onChange={(e)=>setBrand(e.target.value)}
        />

        <input
          placeholder="Model"
          value={model}
          onChange={(e)=>setModel(e.target.value)}
        />

        <input
          placeholder="Price"
          value={price}
          onChange={(e)=>setPrice(e.target.value)}
        />

        <input
          placeholder="Quantity"
          value={quantity}
          onChange={(e)=>setQuantity(e.target.value)}
        />

        <button className="save-btn" onClick={saveCar}>
          Save
        </button>
            <button
        onClick={downloadCSV}
        style={{
          margin: "10px",
          padding: "10px",
          background: "green",
          color: "white",
          border: "none",
          borderRadius: "8px",
          cursor: "pointer"
        }}
      >
        Download CSV
      </button>

      </div>

      <table>

        <thead>
          <tr>
            <th>ID</th>
            <th>Brand</th>
            <th>Model</th>
            <th>Price</th>
            <th>Quantity</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>

          {cars.map(car => (

            <tr key={car.id}>

              <td>{car.id}</td>
              <td>{car.brand}</td>
              <td>{car.model}</td>
              <td>{car.price}</td>
              <td>{car.quantity}</td>

              <td>
                <button
                  className="edit-btn"
                  onClick={()=>editCar(car)}
                >
                  Edit
                </button>

                <button
                  className="delete-btn"
                  onClick={()=>deleteCar(car.id)}
                >
                  Delete
                </button>
              </td>

            </tr>

          ))}

        </tbody>

      </table>

    </div>

  );
}

export default App;
