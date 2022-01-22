import { React, useState } from "react";
import Logo from './logo.png';

export default function SearchBox(props) {
  const [search, setsearch] = useState("");

  function handleSellerClick(){
    if(search){
      props.searchSellers(search);
    }
  } 
  
  function handleBuyerClick(){
    if(search){
      props.searchBuyers(search);
    }
  }

  return (
    <div className="search-box">
      <input
        type="text"
        name="search-query"
        placeholder="Search Scripts, Brokers"
        value={search}
        onChange={(e) => setsearch(e.target.value.toUpperCase())}
      />
      <button name="seller" onClick={handleSellerClick}>
        Seller
      </button>
      <button name="buyer" onClick={handleBuyerClick}>
        Buyer
      </button>
      <div className="logo">
        <img src={Logo}/>
      </div>
    </div>
  );
}
