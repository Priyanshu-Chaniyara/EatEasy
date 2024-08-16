import { createContext, useEffect, useState } from "react";
import { food_list } from "../assets/assets";
export const StoreContext = createContext(null)

const StoreContextProvider = (props) => {

const [cartItems,setCartItem] = useState({});

const addToCart = (itemId) =>
{
    if(!cartItems[itemId])
    {
        setCartItem((prev)=>({...prev,[itemId]:1}))
    }
    else
    {
        setCartItem((prev)=>({...prev,[itemId]:prev[itemId]+1}))
    }
}

const removeFromCart = (itemId) =>
{
    setCartItem((prev)=>({...prev,[itemId]:prev[itemId]-1}))
}

useEffect(()=>{
console.log(cartItems);
},[cartItems])

    const contextValue = {
food_list,
cartItems,
setCartItem,
addToCart,
removeFromCart
    }
    return (
        <StoreContext.Provider value={contextValue}>
            {props.children}
        </StoreContext.Provider>
    )
}

export default StoreContextProvider;