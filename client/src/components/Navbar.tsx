import React, { useState } from "react";
import { Link, useLocation } from "wouter";
import { useCart } from "@/lib/context/CartContext";
import { Button } from "@/components/ui/button";
import {
  Laptop,
  Search,
  User,
  ShoppingCart,
  Menu,
  X,
} from "lucide-react";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [location] = useLocation();
  const { items } = useCart();

  const cartItemsCount = items.reduce((sum, item) => sum + item.quantity, 0);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  const isActive = (path: string) => {
    return location === path;
  };

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between py-4">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center">
              <Laptop className="h-8 w-8 text-primary" />
              <span className="ml-2 text-xl font-bold text-gray-800">
                TechBuild
              </span>
            </Link>
          </div>

          {/* Navigation - Desktop */}
          <nav className="hidden md:flex space-x-8">
            <Link href="/">
              <a className={`text-gray-800 hover:text-primary font-medium ${isActive("/") ? "text-primary" : ""}`}>
                Home
              </a>
            </Link>
            <Link href="/products">
              <a className={`text-gray-800 hover:text-primary font-medium ${isActive("/products") ? "text-primary" : ""}`}>
                Shop
              </a>
            </Link>
            <Link href="/#pc-builder">
              <a className={`text-gray-800 hover:text-primary font-medium ${isActive("/#pc-builder") ? "text-primary" : ""}`}>
                PC Builder
              </a>
            </Link>
            <Link href="/deals">
              <a className={`text-gray-800 hover:text-primary font-medium ${isActive("/deals") ? "text-primary" : ""}`}>
                Deals
              </a>
            </Link>
            <Link href="/support">
              <a className={`text-gray-800 hover:text-primary font-medium ${isActive("/support") ? "text-primary" : ""}`}>
                Support
              </a>
            </Link>
          </nav>

          {/* User Actions */}
          <div className="flex items-center space-x-4">
            <div className="relative">
              <button className="flex items-center focus:outline-none text-gray-700 hover:text-primary">
                <Search className="h-6 w-6" />
              </button>
            </div>
            <div className="relative">
              <button className="flex items-center focus:outline-none text-gray-700 hover:text-primary">
                <User className="h-6 w-6" />
              </button>
            </div>
            <div className="relative">
              <Link href="/cart">
                <a className="flex items-center focus:outline-none text-gray-700 hover:text-primary">
                  <ShoppingCart className="h-6 w-6" />
                  {cartItemsCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-primary text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                      {cartItemsCount}
                    </span>
                  )}
                </a>
              </Link>
            </div>
            <button
              className="md:hidden focus:outline-none"
              onClick={toggleMenu}
            >
              {isMenuOpen ? (
                <X className="h-6 w-6 text-gray-700" />
              ) : (
                <Menu className="h-6 w-6 text-gray-700" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden px-2 pt-2 pb-4 space-y-1">
            <Link href="/">
              <a 
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-800 hover:bg-gray-100"
                onClick={closeMenu}
              >
                Home
              </a>
            </Link>
            <Link href="/products">
              <a 
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-800 hover:bg-gray-100"
                onClick={closeMenu}
              >
                Shop
              </a>
            </Link>
            <Link href="/#pc-builder">
              <a 
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-800 hover:bg-gray-100"
                onClick={closeMenu}
              >
                PC Builder
              </a>
            </Link>
            <Link href="/deals">
              <a 
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-800 hover:bg-gray-100"
                onClick={closeMenu}
              >
                Deals
              </a>
            </Link>
            <Link href="/support">
              <a 
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-800 hover:bg-gray-100"
                onClick={closeMenu}
              >
                Support
              </a>
            </Link>
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;
