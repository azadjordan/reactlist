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
import apiRequest from "./apiRequest";

function App() {
  const API_URL = "http://localhost:3500/items";

  // const [items, setItems] = useState(
  //   JSON.parse(localStorage.getItem("shoppinglist")) || [] );
  const [items, setItems] = useState([]); // 03:25:00
  const [newItem, setNewItem] = useState("");
  const [search, setSearch] = useState("");
  const [fetchError, setFetchError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

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
          setItems(listItems);
          setFetchError(null);
        } catch(err) {
          //console.log(err.message) // throw: 'Did not recieve expected data'
          setFetchError(err.message);
        } finally {
          setIsLoading(false);
        }
      }
      setTimeout(() => { //we use this because: an api may not be as fast as the one in our local server. online servers might be slower so we us this.
        (async () => await fetchItems())();

      },1000) // we used 2 seconds just to see it
    }, []);

  const addItem = async (item) => {
    const id = items.length ? items[items.length - 1].id + 1 : 1;
    const myNewItem = { id, checked: false, item };
    const listItems = [...items, myNewItem];
    setItems(listItems);

    // we want to update the rest api as well.
    const postOptions ={
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(myNewItem) // we dont need the full list
    }

    const result = await apiRequest(API_URL, postOptions);
    if (result) setFetchError(result);
  };

  const handleCheck = async (id) => {
    const listItems = items.map((item) =>
      item.id === id ? { ...item, checked: !item.checked } : item
    );
    setItems(listItems);

    // now update the api
    const myItem = listItems.filter(item => item.id === id);
    const updateOptions = {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({checked: myItem[0].checked})
    };

    const reqUrl = `${API_URL}/${id}`;
    const result = await apiRequest(reqUrl, updateOptions);
    if(result) setFetchError(result)
  };

  const handleDelete = async(id) => {
    const listItems = items.filter((item) => item.id !== id);
    setItems(listItems);

    // deleting from the api
    const deleteOptions = {method: 'DELETE'}
    const reqUrl = `${API_URL}/${id}`;
    const result = await apiRequest(reqUrl, deleteOptions);
    if(result) setFetchError(result)
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

      <main>
      {isLoading && <p>Loading Items...</p>}
      {fetchError && 
      <p style={{color: "red"}}>{`Error: ${fetchError}`}</p>}
          {!fetchError && !isLoading && <Content
            items={items.filter((item) =>
              item.item.toLowerCase().includes(search.toLowerCase().trim())
            )}
            handleCheck={handleCheck}
            handleDelete={handleDelete}
          />}
      </main>
      

      <Footer length={items.length} />
    </div>
  );
}

export default App;
