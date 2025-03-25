import React from "react";
import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import ProductCard from "@/components/ProductCard";
import CategoryCard from "@/components/CategoryCard";
import FeatureCard from "@/components/FeatureCard";
import PCBuilderWizard from "@/components/PCBuilderWizard";
import { Product, Category } from "@/lib/types";
import { Lightbulb, Shield, Package2 } from "lucide-react";

const Home = () => {
  const { data: categories } = useQuery<Category[]>({
    queryKey: ["/api/categories"],
  });

  const { data: featuredProducts } = useQuery<Product[]>({
    queryKey: ["/api/products?featured=true"],
  });

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white">
        <div className="container mx-auto px-4 py-16 md:py-24">
          <div className="flex flex-col md:flex-row items-center">
            <div className="md:w-1/2 mb-8 md:mb-0">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                Build Your Perfect PC
              </h1>
              <p className="text-xl mb-6">
                Tell us your needs, and we'll help you create the ideal computer
                setup with our AI-powered recommendation engine.
              </p>
              <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4">
                <a href="#pc-builder">
                  <Button variant="white" size="xl">
                    Build My PC
                  </Button>
                </a>
                <Link href="/products">
                  <Button variant="outline_primary" size="xl">
                    Browse Parts
                  </Button>
                </Link>
              </div>
            </div>
            <div className="md:w-1/2">
              <img
                src="https://images.unsplash.com/photo-1587202372775-e229f172b9d7?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
                alt="High-performance PC"
                className="rounded-lg shadow-xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Category Navigation */}
      <section className="py-8 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">
            Shop by Category
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {categories?.map((category) => (
              <CategoryCard
                key={category.id}
                name={category.name}
                slug={category.slug}
                icon={category.icon}
              />
            ))}
          </div>
        </div>
      </section>

      {/* PC Builder Section */}
      <section id="pc-builder" className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">
              Build Your Custom PC
            </h2>
            <p className="text-lg text-gray-600">
              Tell us what you need your computer for, and our AI will recommend
              the perfect parts for your budget.
            </p>
          </div>

          <PCBuilderWizard />
        </div>
      </section>

      {/* Featured Products Section */}
      <section id="products" className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-gray-800 mb-6">
            Featured Products
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts?.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
          <div className="text-center mt-10">
            <Link href="/products">
              <Button variant="outline">View All Products</Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-gray-800 mb-12 text-center">
            Why Choose TechBuild?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FeatureCard
              title="AI-Powered Recommendations"
              description="Our advanced AI engine analyzes your needs and budget to recommend the perfect PC components for your specific use case."
              icon={Lightbulb}
            />
            <FeatureCard
              title="Compatibility Guaranteed"
              description="Every component we recommend is verified for compatibility, ensuring your build works perfectly together without any issues."
              icon={Shield}
            />
            <FeatureCard
              title="Expert Assembly"
              description="Our experienced technicians can build and test your PC, ensuring it's ready to use right out of the box with proper cable management."
              icon={Package2}
            />
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-12 bg-primary">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-white mb-4">
              Stay Updated
            </h2>
            <p className="text-white/80 mb-6">
              Subscribe to our newsletter for the latest component releases,
              exclusive deals, and PC building tips.
            </p>
            <form className="flex flex-col sm:flex-row gap-2">
              <input
                type="email"
                placeholder="Your email address"
                className="flex-grow px-4 py-3 rounded-lg focus:outline-none"
              />
              <Button variant="white">Subscribe</Button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
