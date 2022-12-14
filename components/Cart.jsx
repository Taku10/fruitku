import React, { useState, useRef, useContext, useEffect } from 'react'
import { Context } from '../context/StateContext'
import { MdArrowBackIos } from 'react-icons/md'
import { BsBasket } from 'react-icons/bs'
import Link from 'next/link'
import { urlFor } from '../lib/client'
import { AiOutlineMinus } from 'react-icons/ai'
import { AiOutlinePlus } from 'react-icons/ai'
import { BsTrash } from 'react-icons/bs'
import getStripe from '../lib/getStripe'
import toast from 'react-hot-toast'
import { useAuthState } from 'react-firebase-hooks/auth'
import { auth } from '../utils/firebase'
import RequiredLogin from './RequiredLogin'




const Cart = () => {
  const [user, loading] = useAuthState(auth);
  const useStateContext = useContext(Context)
  const { log, setLog, showCart, setShowCart, cartItems, setCartItems, totalQuantities, totalPrice, toggleCartItemQuantity, onRemove } = useStateContext;
  const [nav, setNav] = useState(false)



  console.log(cartItems.length)

  useEffect(() => {
    const changeNav = () => {
      console.log(window.scrollY)
      if (window.scrollY >= 1) {
        setNav(true)
      } else {
        setNav(false)
      }
    }
    window.addEventListener('scroll', changeNav);
  })

  
 
  

  const handleCheckout = async () => {
    const stripe = await getStripe();

    // make api request
    const response = await fetch('/api/stripe', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(cartItems),
    });


    if (response.statusCode === 500) return;

    const data = await response.json();
    console.log(data.id)





    if (!user) {
      setLog(true)
    } else {
      toast.loading('Redirecting...');
      stripe.redirectToCheckout({ sessionId: data.id });
    }
  }



  return (
    <div className={`${showCart ? 'cart-container anim' : 'cart-container animBack'}`}>
      <div className={`${log ? 'cart-dim active' : 'cart-dim'}`} onClick={()=>setLog(false)}></div>
      <div className='cart-wrapper'>
        <div className='cart-top-info'>
          <div className='back-button' onClick={() => setShowCart(false)}>
            <MdArrowBackIos />
            <p>Back</p>
          </div>

          <div className='cart-qty-top'>
            <p>Your Cart </p>
            <p className='qty-number-top'>({totalQuantities} items)</p>
          </div>

        </div>

        {cartItems.length < 1 && (
          <div className='empty-cart'>
            <h3>Your Basket is Empty!!</h3>
            <BsBasket className='empty-basket-icon' />
            <Link href='/shop'>
              <button type='button' className='continue-shopping-button' onClick={() => setShowCart(false)} > Continue Shopping</button>
            </Link>
          </div>
        )}


        <div className='cart-product-container'>
          {cartItems.length >= 1 && cartItems.map((item, index) => (
            <div className='cart-product' key={index}>
              <div className='cart-left'>
                <div className='cart-image'>
                  <img src={urlFor(item?.image[0])} alt="" />
                </div>
                <div className='name-qty'>
                  <h1>{item.name}</h1>
                  <BsTrash className='delete-product' onClick={() => onRemove(item)} />
                  <div className='enter-qty'>
                    <button className='minus' onClick={() => toggleCartItemQuantity(item._id, 'dec')}><AiOutlineMinus /></button>
                    <p className='qty-input'>{item.quantity}</p>
                    <button className='plus' onClick={() => toggleCartItemQuantity(item._id, 'inc')}><AiOutlinePlus /></button>
                  </div>
                </div>


              </div>
              <div className='cart-right'>
                <p className='cart-price'>$ {item.price}</p>

              </div>
            </div>
          ))}

          {cartItems.length >= 1 && (
            <div className='cart-bottom'>
              <div className='total'>
                <h3 className='subtotal'>Subtotal:</h3>
                <h3 className='subtotal-number'>$ {totalPrice}</h3>
              </div>
              <div className='proceed-checkout'>
                <button onClick={handleCheckout}>Proceed to Checkout</button>
              </div>
            </div>
          )}
        </div>

        {log && <RequiredLogin />}
      </div>
    </div>
  )
}

export default Cart
