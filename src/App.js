// we will use npx instead of npm, because we don't want to use our json server as a dependency in our react application
// and the command is: npx json-server -p 3500 -w data/db.json // w for watch p for port
// why json-server ? to run a local REST-API as a development server to work with, and use that rest api while we develop our frontEnd.
// http://localhost:3500/items  THIS is our root URL to contact with the fetch api to get information
/* import './App.css';  WE use this if you want to have separate styling CSS for each component*/

import Header from "./Header";
import Content from "./Content";
import Footer from "./Footer";
import { useState, useEffect } from "react";
import AddItem from "./AddItem";
import SearchItem from "./SearchItem";

function App() {
  const API_URL = "http://localhost:3500/itemss";

  // const [items, setItems] = useState(
  //   JSON.parse(localStorage.getItem("shoppinglist")) || [] );
  const [items, setItems] = useState([]); // 03:25:00
  const [newItem, setNewItem] = useState("");
  const [search, setSearch] = useState("");
  const [fetchError, setFetchError] = useState(null);

  // useEffect(() => {
  //   localStorage.setItem("shoppinglist", JSON.stringify(items)); // when the app loads, it takes the value of the empty array [] that was set for the items state as the default value
  //   console.log(`Items updated`);
  // }, [items]);

  useEffect(() => { // Here we load the data from the REST-API and when we manage the data with state, we also want to send messages back to the api to keep that db in sync with our state of the application
      const fetchItems = async () => {
        try{
          const response = await fetch(API_URL);
          if(!response.ok) throw Error('Did not recieve expected data')
          const listItems = await response.json();
          console.log(listItems)
          setItems(listItems);
        } catch(err) {
          console.log(err.stack)
        }
      }

      (async () => await fetchItems())();
    }, []);

  const addItem = (item) => {
    const id = items.length ? items[items.length - 1].id + 1 : 1;
    const myNewItem = { id, checked: false, item };
    const listItems = [...items, myNewItem];
    setItems(listItems);
  };

  const handleCheck = (id) => {
    const listItems = items.map((item) =>
      item.id === id ? { ...item, checked: !item.checked } : item
    );
    setItems(listItems);
  };

  const handleDelete = (id) => {
    const listItems = items.filter((item) => item.id !== id);
    setItems(listItems);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!newItem) return;
    // console.log(newItem);
    //addItem
    addItem(newItem);
    setNewItem("");
  };

  return (
    <div className="App">
      <Header title={"Grocery List"} />

      <AddItem
        newItem={newItem}
        setNewItem={setNewItem}
        handleSubmit={handleSubmit}
      />

      <SearchItem 
      search={search} 
      setSearch={setSearch} 
      
      />

      <Content
        items={items.filter((item) =>
          item.item.toLowerCase().includes(search.toLowerCase().trim())
        )}
        handleCheck={handleCheck}
        handleDelete={handleDelete}
      />

      <Footer length={items.length} />
    </div>
  );
}

export default App;
