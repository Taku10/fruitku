import React, { useContext } from 'react'
import Head from 'next/head'
import Footer from './Footer'
import Navbar from './Navbar'
import Brands from './Brands'
import Cart from './Cart'
import { Context } from '../context/StateContext'
import Search from './Search'
import { motion,useScroll } from 'framer-motion';
import { useRouter } from 'next/router'

const Layout = ({ children, products}) => {

  const useStateContext = useContext(Context);
  const { video, setVideo, showSearch ,showCart, menu, setMenu} = useStateContext;
  const { scrollYProgress } = useScroll();

  const router = useRouter();

if (router.pathname.includes('/login')) return children;
if (router.pathname.includes('/success')) return children;
if (router.pathname.includes('/cancelled')) return children;

  return (

    <>

    <div className='layout' >
      {/* dim background on video click */}
      <div className={`${video ? 'dim active' : 'dim'}`} onClick={() => setVideo(false)}></div>
      <motion.div className="progress-bar"style={{ scaleX: scrollYProgress }}/>
        
      {showCart && <Cart />} 
      <Head>
        <title>FruitKu </title>
        <link rel="shortcut icon" href="/tab-logo.png" />
      </Head>
      <header>
        <Navbar />
      </header>
      <main onClick={()=> setMenu(false)}>
        {children}
      </main>
      <footer>
        <Brands />
        <Footer />
      </footer>
    </div>
    </>
  )
}

export default Layout