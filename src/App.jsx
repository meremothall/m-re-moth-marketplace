import React, { useState } from 'react';

export default function App() {
  const [cart, setCart] = useState([]);
  const products = [
    {id:1, name:"Moth Ankara Dress", price:"15,000 XAF", img:"👗"},
    {id:2, name:"Moth Palm Shoes", price:"25,000 XAF", img:"👞"},
    {id:3, name:"Moth Bag", price:"10,000 XAF", img:"👜"},
  ];
  
  return (
    <div style={{background:"#0f0f0f", color:"#fff", minHeight:"100vh", padding:20, fontFamily:"sans-serif"}}>
      <h1 style={{color:"#FF6B35", textAlign:"center"}}>🧱 MÈRE MOTH MALL</h1>
      <p style={{textAlign:"center"}}>Douala - Agency Code: MMM-DOUALA-2026</p>
      <div style={{display:"grid", gridTemplateColumns:"1fr 1fr", gap:15, marginTop:20}}>
        {products.map(p => (
          <div key={p.id} style={{background:"#222", padding:15, borderRadius:12, textAlign:"center"}}>
            <div style={{fontSize:40}}>{p.img}</div>
            <h3>{p.name}</h3>
            <p style={{color:"#FF6B35"}}>{p.price}</p>
            <button onClick={()=>setCart([...cart, p])} style={{background:"#FF6B35", border:0, padding:10, borderRadius:8, color:"#fff", width:"100%"}}>Add</button>
          </div>
        ))}
      </div>
      <div style={{marginTop:20, background:"#222", padding:15, borderRadius:12}}>
        Cart: {cart.length} items
      </div>
    </div>
  );
}