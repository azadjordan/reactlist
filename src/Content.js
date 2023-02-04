import React from "react";
import ItemsList from "./ItemsList";

const Content = ({ items, handleCheck, handleDelete }) => {
  // we use const because we NEVER want
  //to change the name directly. We always want to use setName!

  return (
	 <main>
		{items.length ? (
		  <ItemsList
			items = {items}
			handleCheck = {handleCheck}
			handleDelete = {handleDelete}
		  />
		) : (
		  <p style={{ margin: "auto" }}>Your List is empty!</p>
		)}
	 </main>
  );
};

export default Content;
