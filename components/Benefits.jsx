import React,{useEffect} from 'react'
import {TbTruckDelivery} from 'react-icons/tb'
import {BiPhoneCall} from 'react-icons/bi'
import {TiArrowSync} from 'react-icons/ti'
import Aos from 'aos';



const Benefits = () => {

    useEffect(()=>{
        Aos.init({duration:1500, once: false})
    },[])


  return (
    <div className='benefits-container'>
        <div className='benefits-wrapper'  data-aos = 'fade-up' data-aos-delay='200'>
            <div className='ben-extras'>
                <div className='benefit-icon'>
                    <TbTruckDelivery className='icon' />
                </div>
                <div className='benefit-type'>
                    <h1>Free Shipping</h1>
                    <p>When order over R450</p>
                </div>
            </div>
            <div className='ben-extras'>
                <div className='benefit-icon'>
                    <BiPhoneCall className='icon' />
                </div>
                <div className='benefit-type'>
                    <h1>24/7 Support</h1>
                    <p>Get support all day</p>
                </div>
            </div>
            <div className='ben-extras'>
                <div className='benefit-icon'>
                    <TiArrowSync className='icon' />
                </div>
                <div className='benefit-type'>
                    <h1>Refund</h1>
                    <p>Get refund within 3 days!</p>
                </div>
            </div>
        </div>
    </div>
  )
}

export default Benefits