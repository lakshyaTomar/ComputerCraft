import React from "react";
import { Laptop, MapPin, Mail, Phone } from "lucide-react";
import { FaTwitter, FaLinkedin, FaFacebook, FaInstagram } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white pt-12 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center mb-4">
              <Laptop className="h-8 w-8 text-primary" />
              <span className="ml-2 text-xl font-bold">TechBuild</span>
            </div>
            <p className="text-gray-400 mb-4">
              Building custom PCs tailored to your needs using AI-powered
              recommendations.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-white">
                <FaTwitter className="h-6 w-6" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white">
                <FaLinkedin className="h-6 w-6" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white">
                <FaFacebook className="h-6 w-6" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white">
                <FaInstagram className="h-6 w-6" />
              </a>
            </div>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Shop</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-gray-400 hover:text-white">
                  Processors
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white">
                  Graphics Cards
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white">
                  Memory
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white">
                  Storage
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white">
                  Cases
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white">
                  Power Supplies
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Services</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-gray-400 hover:text-white">
                  PC Builder
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white">
                  Custom Water Cooling
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white">
                  Tech Support
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white">
                  Extended Warranty
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white">
                  Financing Options
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
            <ul className="space-y-2">
              <li className="flex items-start">
                <MapPin className="h-5 w-5 mr-2 text-gray-400" />
                <span className="text-gray-400">
                  Inderprastha Engineering college, Ghaziabad.
                </span>
              </li>
              <li className="flex items-start">
                <Mail className="h-5 w-5 mr-2 text-gray-400" />
                <span className="text-gray-400">support@techbuild.com</span>
              </li>
              <li className="flex items-start">
                <Phone className="h-5 w-5 mr-2 text-gray-400" />
                <span className="text-gray-400">(91) 9999999999</span>
              </li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-700 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm mb-4 md:mb-0">
            &copy; {new Date().getFullYear()} TechBuild. All rights reserved.
          </p>
          <div className="flex space-x-6">
            <a href="#" className="text-gray-400 text-sm hover:text-white">
              Privacy Policy
            </a>
            <a href="#" className="text-gray-400 text-sm hover:text-white">
              Terms of Service
            </a>
            <a href="#" className="text-gray-400 text-sm hover:text-white">
              Shipping Policy
            </a>
            <a href="#" className="text-gray-400 text-sm hover:text-white">
              Refund Policy
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
