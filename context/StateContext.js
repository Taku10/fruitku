import React, { useState, useContext, createContext } from "react";
import { toast } from 'react-hot-toast'

export const Context = createContext();

let foundProduct;
let index;

export const StateContext = ({ children }) => {
    const [showCart, setShowCart] = useState(false);
    const [cartItems, setCartItems] = useState([]);
    const [totalPrice, setTotalPrice] = useState(0);
    const [totalQuantities, setTotalQuantities] = useState(0);
    const [qty, setQty] = useState(1)

    //cart item quantity increment and decrement
    const toggleCartItemQuantity = (id, value) => {
        foundProduct = cartItems.find((item)=>item._id === id);
        index= cartItems.findIndex((product)=> product._id === id)
        const newCartItems = cartItems.filter((item)=> item._id !== id)


        //check if value is incrementing or decrementing
        if(value === 'inc'){
            setCartItems([...newCartItems, {...foundProduct, quantity: foundProduct.quantity + 1}]);
            setTotalPrice((prev) =>prev + foundProduct.price);
            setTotalQuantities((prev) => prev + 1)
        }else if(value === 'dec'){
            if(foundProduct.quantity > 1){
                setCartItems([...newCartItems, {...foundProduct, quantity: foundProduct.quantity - 1}]);
                setTotalPrice((prev) =>prev - foundProduct.price);
                setTotalQuantities((prev) => prev - 1)
            }
            
        }
    }

    const onRemove =(product)=>{
        foundProduct = cartItems.find((item)=>item._id === product._id);
        const newCartItems = cartItems.filter((item)=> item._id !== product._id)

        setTotalPrice((prev)=> prev - foundProduct.price * foundProduct.quantity);
        setTotalQuantities((prev) => prev - foundProduct.quantity)
        setCartItems(newCartItems)
    }

    const onAdd = (product, quantity) => {
        const checkProduct = cartItems.find((item) => item._id === product._id)
        setTotalPrice((prev) => prev + product.price * quantity);
        setTotalQuantities((prev) => prev + quantity)

        if (checkProduct) {
            const updatedCartItems = cartItems.map((cartProduct) => {
                if (cartProduct._id === product._id) return {
                    ...cartProduct,
                    quantity: cartProduct.quantity + quantity
                }
            })
            setCartItems(updatedCartItems)
        } else {
            product.quantity = quantity;

            setCartItems([...cartItems, { ...product }])
        }

        toast.success('Added to Cart')
    }


    const increaseQty = () => {
        setQty((prevQty) => prevQty + 1)
    }

    const decreaseQty = () => {
        setQty((prevQty) => {
            if (prevQty - 1 < 1) return 1; //keep decrementing, but not go lower than one

            return prevQty - 1;

        })
    }

    return (
        <Context.Provider value={{ onRemove, showCart, setShowCart, cartItems, totalPrice, totalQuantities, qty, increaseQty, decreaseQty, onAdd, toggleCartItemQuantity }}>
            {children}
        </Context.Provider>
    )
}


