import React, { useContext, useEffect } from 'react'
import { client, urlFor } from '../../lib/client'
import { BsFillCartFill } from 'react-icons/bs'
import { GrFacebookOption } from 'react-icons/gr'
import { AiOutlineTwitter } from 'react-icons/ai'
import { AiOutlineGooglePlus } from 'react-icons/ai'
import { AiFillLinkedin } from 'react-icons/ai'
import { AiOutlineMinus } from 'react-icons/ai'
import { AiOutlinePlus } from 'react-icons/ai'
import Link from 'next/link'
import { Product } from '../../components'
import { Context } from '../../context/StateContext'
import Aos from 'aos';
import { motion } from 'framer-motion'



const ProductDetails = ({ relatedProducts, products }) => {

    const { name, image, details, category, price } = products;
    const useStateContext = useContext(Context)
    const { qty, decreaseQty, increaseQty, onAdd } = useStateContext;

    useEffect(() => {
        Aos.init({ duration: 1500, once: true })
    }, [])


    return (

        <div className='product-details-container'>
            <div className='product-start-container'>
                <div className='product-start-header'>
                    <p data-aos='fade-down' data-aos-delay='300'>SEE MORE DETAILS</p>
                    <h1 data-aos='fade-up' data-aos-delay='600'>{name}</h1>
                </div>
            </div>
            <div className='details-container'>
                <div className='details-wrapper'>
                    {name === 'Oranges' && <div className='details-item-discount' data-aos='fade-up' data-aos-delay='600'>
                        <p>50%</p>
                    </div>}
                    <motion.div whileTap={{ translate: '100px' }} className='product-image' data-aos='fade-right' data-aos-delay='500'>
                        <img src={urlFor(image && image[0])} />
                    </motion.div>
                    <div className='product-info' data-aos='fade-left' data-aos-delay='800'>
                        <h1 className='product-name'>{name}</h1>
                        <p className='kg'>Per Kg</p>
                        {name === "Oranges" ?
                            <div className='details-discount-before'>
                                <p>$ {price} </p>
                                <h3 className='-details-now-price'> $ {(price / 2).toFixed()}</h3>
                            </div> : <h1 className='product-price'>$ {price}</h1>}
                        <p className='product-desc'>{details}</p>
                        <div className='enter-qty'>
                            <button className='minus' onClick={decreaseQty}><AiOutlineMinus /></button>
                            <p className='qty-input'>{qty}</p>
                            <button className='plus' onClick={increaseQty}><AiOutlinePlus /></button>
                        </div>
                        <button className='add-to-cart' onClick={() => onAdd(products, qty)}>
                            <BsFillCartFill />
                            <p>Add to Cart</p>
                        </button>
                        <p className='product-category'>Categories: <span>{category}</span></p>
                        <div className='share'>
                            <h1>Share:</h1>
                            <div className='social-icons'>
                                <a target='_blank' rel='noopener noreferrer' href='https://www.facebook.com'>
                                    <GrFacebookOption className='icon' />
                                </a>
                                <a target='_blank' rel='noopener noreferrer' href='https://www.twitter.com'>
                                    <AiOutlineTwitter className='icon' />
                                </a>
                                <a target='_blank' rel='noopener noreferrer' href='https://www.google.com'>
                                    <AiOutlineGooglePlus className='icon' />
                                </a>
                                <a target='_blank' rel='noopener noreferrer' href='https://www.linkedin.com'>
                                    <AiFillLinkedin className='icon' />
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export const getStaticPaths = async () => {
    const query = `*[_type == "product"]{
        slug {
            current
        }
    }`

    const products = await client.fetch(query)
    const paths = products.map((product) => ({
        params: {
            slug: product.slug.current
        }
    }))

    return {
        paths,
        fallback: 'blocking'
    }
}


export const getStaticProps = async ({ params: { slug } }) => {
    const query = `*[_type == "product" && slug.current == '${slug}'][0]`
    const relatedQuery = '*[_type == "product"]'
    const products = await client.fetch(query);
    const relatedProducts = await client.fetch(relatedQuery);

    return {
        props: { relatedProducts, products }
    }
}



export default ProductDetails