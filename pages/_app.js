import "react-responsive-carousel/lib/styles/carousel.min.css"
import '../styles/globals.css'
import '../styles/home.css'
import '../styles/benefits.css'
import '../styles/ourproducts.css'
import '../styles/dealmonth.css'
import '../styles/shop.css'
import '../styles/productdetails.css'
import '../styles/cart.css'
import '../styles/testimonials.css'
import '../styles/video.css'
import '../styles/promo.css'
import '../styles/news.css'
import '../styles/brands.css'
import '../styles/footer.css'
import '../styles/news_details.css'
import '../styles/about.css'
import '../styles/contact.css'
import '../styles/team.css'
import '../styles/login.css'
import '../styles/search.css'
import 'aos/dist/aos.css';
import React from 'react'
import { Layout } from '../components'
import { StateContext } from '../context/StateContext'
import {Toaster} from 'react-hot-toast';
import { client } from '../lib/client'

function MyApp({ Component, pageProps }) {

  const{products, news}=pageProps;

  return (
    <StateContext>
      <Layout products={products}>
        <Toaster />
        <Component {...pageProps} />
      </Layout>
    </StateContext>

  )
}

export const getServerSideProps = async () => {
  const query = '*[_type == "product"]'
  const newsQuery = '*[_type == "news"]'
  const news = await client.fetch(newsQuery)
  const products = await client.fetch(query)

  return {
    props: {
      products,news
    }
  }
}


export default MyApp
