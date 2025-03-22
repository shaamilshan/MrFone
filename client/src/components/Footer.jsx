import React from 'react';
import Logo from '../assets/Logo.png'

function Footer() {
  return (
    <footer className="bg-white text-black py-8">
      <div className="container mx-auto flex flex-col md:flex-row justify-between items-start">
        <div className="ml-12 w-2/4 mb-6 md:mb-0">
          <img
          src={Logo}
          className='w-28 ml-0 p-0'
          />
          {/* <h4 className="text-lg font-medium mb-4">TrendKart</h4> */}
          <p className="text-sm">
           Asha Complex, Koduvally <br />
           +91 956245 2000
          </p>
        </div>
        <div className="ml-6 grid grid-cols-2 md:grid-cols-4 gap-6">
          <div>
            <h4 className="text-lg font-medium mb-4">Links</h4>
            <ul className="space-y-2">
              <li>
                <a href="/" className="hover:text-gray-400 transition-colors">
                  Home
                </a>
              </li>
              <li>
                <a href="/collections" className="hover:text-gray-400 transition-colors">
                  Shop
                </a>
              </li>
              <li>
                <a href="/about-us" className="hover:text-gray-400 transition-colors">
                  About
                </a>
              </li>
              <li>
                <a href="/contact-us" className="hover:text-gray-400 transition-colors">
                  Contact
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="text-lg font-medium mb-4">Help</h4>
            <ul className="space-y-2">
              <li>
                <a href="/" className="hover:text-gray-400 transition-colors">
                  Payment Options
                </a>
              </li>
              <li>
                <a href="https://merchant.razorpay.com/policy/PQGLwBVaRsVDHy/refund" className="hover:text-gray-400 transition-colors">
                  Returns
                </a>
              </li>
              <li>
                <a href="https://merchant.razorpay.com/policy/PQGLwBVaRsVDHy/terms" className="hover:text-gray-400 transition-colors">
                  Privacy Policies
                </a>
              </li>
              <li>
                <a href="https://merchant.razorpay.com/policy/PQGLwBVaRsVDHy/shipping" className="hover:text-gray-400 transition-colors">
                Shipping & Delivery Policy
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="text-lg font-medium mb-4">Newsletter</h4>
            <div className="flex gap-1 items-center">
              <input
                type="email"
                placeholder="Enter Your Email Address"
                className="bg-white border-none rounded-l-md py-2 px-4 text-sm flex-1"
              />
              <button className="bg-white border-none text-red-500 rounded-r-md py-2 px-4 text-sm hover:bg-gray-700 transition-colors">
                SUBSCRIBE
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="mt-8 text-center text-sm">
        <p>&copy; 2025 MrFone. All rights revered</p>
      </div>
    </footer>
  );
}

export default Footer;