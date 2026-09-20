import React from 'react'
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";
import { brand_data } from '../images/brandData';

const Brands = () => {
  return (
    <div className='brands-container'>
         <Slider className='brand-slide desktop-brand' touchMove={true} easing="linear" arrows={false}  slidesToShow={4}  autoplay={true} autoplaySpeed={3000}>

            {brand_data.map((item)=>(
                <div className='brand' key={item.src}>
                    <img src={item.src} alt={item}/>
                </div>
            ))
            
            
            
            }

         </Slider>

         
         <Slider className='brand-slide laptop-brand' arrows={false}  slidesToShow={3}  autoplay={true} autoplaySpeed={3000}>

            {brand_data.map((item)=>(
                <div className='brand' key={item.src}>
                    <img src={item.src} alt={item} />
                </div>
            ))
            
            
            
            }

         </Slider>

         <Slider className='brand-slide tablet-brand' arrows={false}  slidesToShow={2}  autoplay={true} autoplaySpeed={3000}>

            {brand_data.map((item)=>(
                <div className='brand' key={item.src}>
                    <img src={item.src} alt={item} />
                </div>
            ))
            
            
            
            }

         </Slider>

         <Slider className='brand-slide phone-brand' arrows={false}  slidesToShow={1}  autoplay={true} autoplaySpeed={3000}>

            {brand_data.map((item)=>(
                <div className='brand' key={item.src}>
                    <img src={item.src} alt={item} />
                </div>
            ))
            
            
            
            }

         </Slider>
    </div>
  )
}

export default Brands