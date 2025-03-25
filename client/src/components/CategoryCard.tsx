import React from "react";
import { Link } from "wouter";
import { 
  Cpu, 
  Layers3, 
  Package2,
  Database,
  Shield,
  Zap,
  LucideIcon
} from "lucide-react";

interface CategoryCardProps {
  name: string;
  slug: string;
  icon: string;
}

const IconMap: Record<string, LucideIcon> = {
  cpu: Cpu,
  gpu: Layers3,
  memory: Package2,
  database: Database,
  chip: Shield,
  zap: Zap
};

const CategoryCard = ({ name, slug, icon }: CategoryCardProps) => {
  const Icon = IconMap[icon] || Cpu;

  return (
    <Link href={`/products?category=${slug}`}>
      <a className="flex flex-col items-center p-4 border border-gray-200 rounded-lg hover:border-primary hover:shadow-md transition duration-300">
        <div className="bg-gray-100 p-3 rounded-full mb-3">
          <Icon className="h-8 w-8 text-primary" />
        </div>
        <span className="text-gray-800 font-medium text-center">{name}</span>
      </a>
    </Link>
  );
};

export default CategoryCard;
