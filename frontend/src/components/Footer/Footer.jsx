import React from 'react'
import './Footer.css'
import { assets } from '../../assets/assets'
const Footer = () => {
  return (
    <div className='footer' id='footer'>
        <div className="footer-content">
             <div className="footer-content-left">
<img src={assets.logo} alt="" />
<p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Provident voluptatum aliquid, dolorem repudiandae quidem corporis ipsam nam, totam vitae maxime ut deleniti laborum asperiores odit praesentium, sed similique debitis velit!</p>
<div className="footer-social-icons">
    <img src={assets.facebook_icon} alt="" />
    <img src={assets.twitter_icon} alt="" />
    <img src={assets.linkedin_icon} alt="" />
</div>
             </div>
             <div className="footer-content-center">
<h2>COMPANY</h2>
<ul>
    <li>Home</li>
    <li>About us</li>
    <li>Delivery</li>
    <li>Privacy Policy</li>
    
</ul>
             </div>
             <div className="footer-content-right">

             </div>
        </div>
      
    </div>
  )
}

export default Footer
