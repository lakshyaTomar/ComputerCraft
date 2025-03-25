import React, { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { 
  Cpu, 
  MonitorPlay,
  Package2,
  HardDrive,
  Info,
  PencilRuler, 
  ImageIcon,
  Briefcase,
  Server,
  BarChart3,
} from "lucide-react";
import { PCBuilderRequirements, PCBuildRecommendation } from "@/lib/types";
import { useCart } from "@/lib/context/CartContext";

const PCBuilderWizard = () => {
  const [step, setStep] = useState(1);
  const [purpose, setPurpose] = useState("");
  const [requirements, setRequirements] = useState<PCBuilderRequirements>({
    purpose: "",
    budget: "Under $800",
    performance: "Entry-level",
    storage: "Basic (500GB - 1TB)",
    resolution: "1080p (Full HD)",
    additionalRequirements: "",
  });
  
  const { toast } = useToast();
  const { addToCart } = useCart();

  const recommendationMutation = useMutation({
    mutationFn: (data: PCBuilderRequirements) =>
      apiRequest("POST", "/api/pc-builder/recommend", data),
    onSuccess: () => {
      setStep(3);
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to get recommendations. Please try again.",
        variant: "destructive",
      });
    },
  });

  const recommendation = recommendationMutation.data
    ? (recommendationMutation.data as unknown as PCBuildRecommendation)
    : null;
    
  // Ensure recommendation has components or provide a default empty array
  const components = recommendation?.components || [];

  const handlePurposeSelect = (selectedPurpose: string) => {
    setPurpose(selectedPurpose);
    setRequirements({
      ...requirements,
      purpose: selectedPurpose,
    });
  };

  const handleRequirementChange = (
    field: keyof PCBuilderRequirements,
    value: string
  ) => {
    setRequirements({
      ...requirements,
      [field]: value,
    });
  };

  const goToNextStep = () => {
    setStep(step + 1);
  };

  const goToPreviousStep = () => {
    setStep(step - 1);
  };

  const getRecommendations = () => {
    recommendationMutation.mutate(requirements);
  };

  const getPurposeIcon = (purposeType: string) => {
    switch (purposeType) {
      case "Gaming":
        return <MonitorPlay className="h-6 w-6 text-primary" />;
      case "Video Editing":
        return <PencilRuler className="h-6 w-6 text-primary" />;
      case "Data Analysis":
        return <BarChart3 className="h-6 w-6 text-primary" />;
      case "Office Work":
        return <Briefcase className="h-6 w-6 text-primary" />;
      case "3D Rendering":
        return <ImageIcon className="h-6 w-6 text-primary" />;
      case "AI & ML":
        return <Server className="h-6 w-6 text-primary" />;
      default:
        return <Cpu className="h-6 w-6 text-primary" />;
    }
  };

  const addAllToCart = () => {
    if (recommendation && recommendation.components) {
      recommendation.components.forEach(component => {
        if (component.id) {
          addToCart(component.id);
        }
      });
      
      toast({
        title: "Success",
        description: "All components added to cart",
      });
      
      // Go to the review step
      setStep(4);
    }
  };

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-md overflow-hidden">
      <div className="p-6">
        {/* Progress Steps */}
        <div className="flex justify-between mb-8">
          <div className="flex flex-col items-center">
            <div
              className={`w-10 h-10 rounded-full ${
                step >= 1 ? "bg-primary text-white" : "bg-gray-200 text-gray-600"
              } flex items-center justify-center font-bold`}
            >
              1
            </div>
            <span className="text-sm font-medium mt-2">Purpose</span>
          </div>
          <div className="flex-1 flex items-center">
            <div className="h-1 w-full bg-gray-200">
              <div
                className="h-1 bg-primary transition-all duration-300"
                style={{ width: step >= 2 ? "100%" : "0%" }}
              ></div>
            </div>
          </div>
          <div className="flex flex-col items-center">
            <div
              className={`w-10 h-10 rounded-full ${
                step >= 2 ? "bg-primary text-white" : "bg-gray-200 text-gray-600"
              } flex items-center justify-center font-bold`}
            >
              2
            </div>
            <span className="text-sm font-medium mt-2">Requirements</span>
          </div>
          <div className="flex-1 flex items-center">
            <div className="h-1 w-full bg-gray-200">
              <div
                className="h-1 bg-primary transition-all duration-300"
                style={{ width: step >= 3 ? "100%" : "0%" }}
              ></div>
            </div>
          </div>
          <div className="flex flex-col items-center">
            <div
              className={`w-10 h-10 rounded-full ${
                step >= 3 ? "bg-primary text-white" : "bg-gray-200 text-gray-600"
              } flex items-center justify-center font-bold`}
            >
              3
            </div>
            <span className="text-sm font-medium mt-2">Recommendations</span>
          </div>
          <div className="flex-1 flex items-center">
            <div className="h-1 w-full bg-gray-200">
              <div
                className="h-1 bg-primary transition-all duration-300"
                style={{ width: step >= 4 ? "100%" : "0%" }}
              ></div>
            </div>
          </div>
          <div className="flex flex-col items-center">
            <div
              className={`w-10 h-10 rounded-full ${
                step >= 4 ? "bg-primary text-white" : "bg-gray-200 text-gray-600"
              } flex items-center justify-center font-bold`}
            >
              4
            </div>
            <span className="text-sm font-medium mt-2">Review</span>
          </div>
        </div>

        {/* Step 1: Purpose Selection */}
        {step === 1 && (
          <div>
            <h3 className="text-xl font-bold text-gray-800 mb-6">
              What will you use your PC for?
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {["Gaming", "Video Editing", "Data Analysis", "Office Work", "3D Rendering", "AI & ML"].map(
                (purposeType) => (
                  <div
                    key={purposeType}
                    className={`border ${
                      purpose === purposeType
                        ? "border-primary shadow-md"
                        : "border-gray-200"
                    } rounded-lg p-4 hover:border-primary hover:shadow-md cursor-pointer transition-all`}
                    onClick={() => handlePurposeSelect(purposeType)}
                  >
                    <div className="flex items-start">
                      <div className="bg-primary/10 p-3 rounded-full mr-4">
                        {getPurposeIcon(purposeType)}
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-800">
                          {purposeType}
                        </h4>
                        <p className="text-sm text-gray-600 mt-1">
                          {purposeType === "Gaming"
                            ? "High-performance for modern games"
                            : purposeType === "Video Editing"
                            ? "For professional video production"
                            : purposeType === "Data Analysis"
                            ? "For large datasets and simulations"
                            : purposeType === "Office Work"
                            ? "For everyday productivity tasks"
                            : purposeType === "3D Rendering"
                            ? "For 3D modeling and rendering"
                            : "For machine learning workflows"}
                        </p>
                      </div>
                    </div>
                  </div>
                )
              )}
            </div>
            <div className="mt-8 flex justify-end">
              <Button
                onClick={goToNextStep}
                disabled={!purpose}
              >
                Continue
              </Button>
            </div>
          </div>
        )}

        {/* Step 2: Requirements */}
        {step === 2 && (
          <div>
            <h3 className="text-xl font-bold text-gray-800 mb-6">
              Tell us more about your requirements
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  Budget Range
                </label>
                <Select
                  value={requirements.budget}
                  onValueChange={(value) =>
                    handleRequirementChange("budget", value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select budget range" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Under $800">Under $800</SelectItem>
                    <SelectItem value="$800 - $1,200">$800 - $1,200</SelectItem>
                    <SelectItem value="$1,200 - $2,000">$1,200 - $2,000</SelectItem>
                    <SelectItem value="$2,000 - $3,000">$2,000 - $3,000</SelectItem>
                    <SelectItem value="Over $3,000">Over $3,000</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  Performance Level
                </label>
                <Select
                  value={requirements.performance}
                  onValueChange={(value) =>
                    handleRequirementChange("performance", value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select performance level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Entry-level">Entry-level</SelectItem>
                    <SelectItem value="Mid-range">Mid-range</SelectItem>
                    <SelectItem value="High-end">High-end</SelectItem>
                    <SelectItem value="Professional/Workstation">
                      Professional/Workstation
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  Storage Needs
                </label>
                <Select
                  value={requirements.storage}
                  onValueChange={(value) =>
                    handleRequirementChange("storage", value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select storage needs" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Basic (500GB - 1TB)">
                      Basic (500GB - 1TB)
                    </SelectItem>
                    <SelectItem value="Standard (1TB - 2TB)">
                      Standard (1TB - 2TB)
                    </SelectItem>
                    <SelectItem value="Extensive (2TB - 4TB)">
                      Extensive (2TB - 4TB)
                    </SelectItem>
                    <SelectItem value="Professional (4TB+)">
                      Professional (4TB+)
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  Monitor Resolution
                </label>
                <Select
                  value={requirements.resolution}
                  onValueChange={(value) =>
                    handleRequirementChange("resolution", value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select monitor resolution" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1080p (Full HD)">
                      1080p (Full HD)
                    </SelectItem>
                    <SelectItem value="1440p (2K)">1440p (2K)</SelectItem>
                    <SelectItem value="4K">4K</SelectItem>
                    <SelectItem value="Multiple monitors">
                      Multiple monitors
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="md:col-span-2">
                <label className="block text-gray-700 font-medium mb-2">
                  Additional Requirements
                </label>
                <Textarea
                  value={requirements.additionalRequirements || ""}
                  onChange={(e) =>
                    handleRequirementChange(
                      "additionalRequirements",
                      e.target.value
                    )
                  }
                  placeholder="Tell us about any specific software, peripherals, or other requirements..."
                  className="h-24 resize-none"
                />
              </div>
            </div>
            <div className="mt-8 flex justify-between">
              <Button
                variant="outline"
                onClick={goToPreviousStep}
              >
                Back
              </Button>
              <Button
                onClick={getRecommendations}
                disabled={recommendationMutation.isPending}
              >
                {recommendationMutation.isPending
                  ? "Getting Recommendations..."
                  : "Get Recommendations"}
              </Button>
            </div>
          </div>
        )}

        {/* Step 3: AI Recommendations */}
        {step === 3 && recommendation && (
          <div>
            <div className="flex items-center mb-6">
              <h3 className="text-xl font-bold text-gray-800">
                Your AI-Recommended Build
              </h3>
              <span className="ml-4 bg-secondary/20 text-secondary px-3 py-1 rounded-full text-sm font-medium">
                {recommendation.purpose} PC
              </span>
            </div>

            <div className="bg-gray-50 rounded-lg p-6 mb-6">
              <div className="flex items-start">
                <div className="bg-primary/10 p-3 rounded-full">
                  <Info className="h-6 w-6 text-primary" />
                </div>
                <div className="ml-4">
                  <h4 className="font-medium text-gray-800">AI Analysis</h4>
                  <p className="text-gray-600 mt-1">
                    {recommendation.analysis}
                  </p>
                </div>
              </div>
            </div>

            <div className="mb-6">
              <h4 className="font-semibold text-gray-800 mb-4">
                Recommended Components
              </h4>
              <div className="space-y-4">
                {components.map((component, index) => (
                  <div
                    key={index}
                    className="border border-gray-200 rounded-lg"
                  >
                    <div className="flex items-center p-4">
                      <div className="flex-shrink-0">
                        <img
                          src={component.image}
                          alt={component.name}
                          className="w-16 h-16 object-cover rounded"
                        />
                      </div>
                      <div className="ml-4 flex-grow">
                        <div className="flex justify-between">
                          <h5 className="font-medium text-gray-800">
                            {component.name}
                          </h5>
                          <span className="text-gray-800 font-semibold">
                            ${component.price}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600">
                          {component.description}
                        </p>
                      </div>
                      <Button
                        className="ml-4"
                        variant="outline"
                        size="sm"
                        onClick={() => component.id && addToCart(component.id)}
                      >
                        Add to Cart
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex justify-between items-center">
                <div>
                  <span className="text-gray-600">Estimated Total:</span>
                  <span className="text-xl font-bold text-gray-800 ml-2">
                    ${recommendation.totalPrice}
                  </span>
                </div>
                <div>
                  <span className="text-sm text-gray-600">
                    Performance Rating:
                  </span>
                  <div className="flex items-center ml-2">
                    {[...Array(5)].map((_, i) => (
                      <div
                        key={i}
                        className={`w-2 h-${
                          6 + (i === 2 ? 4 : i === 3 ? 6 : i === 4 ? 2 : 0)
                        } ${
                          i < recommendation.performanceRating
                            ? "bg-green-500"
                            : "bg-gray-300"
                        } rounded-sm mx-0.5`}
                      ></div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8 flex justify-between">
              <Button
                variant="outline"
                onClick={goToPreviousStep}
              >
                Adjust Requirements
              </Button>
              <Button onClick={addAllToCart}>
                Add All to Cart
              </Button>
            </div>
          </div>
        )}

        {/* Step 4: Review and Checkout */}
        {step === 4 && recommendation && (
          <div>
            <h3 className="text-xl font-bold text-gray-800 mb-6">
              Review Your Custom Build
            </h3>

            <div className="bg-gray-50 rounded-lg p-6 mb-6">
              <div className="flex flex-col md:flex-row">
                <div className="md:w-1/3 mb-4 md:mb-0">
                  <img
                    src="https://images.unsplash.com/photo-1587202372745-7799dededec1?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80"
                    alt="Custom PC Build"
                    className="rounded-lg shadow-md"
                  />
                </div>
                <div className="md:w-2/3 md:pl-6">
                  <h4 className="font-semibold text-gray-800 mb-3">
                    {recommendation.purpose} PC Build
                  </h4>
                  <div className="text-sm text-gray-600 space-y-2">
                    {components.map((component, index) => (
                      <p key={index}>• {component.name}</p>
                    ))}
                  </div>
                  <div className="mt-4">
                    <div className="flex justify-between font-medium">
                      <span>Performance Rating:</span>
                      <span className="text-green-600">
                        {recommendation.performanceRating === 5
                          ? "Excellent"
                          : recommendation.performanceRating === 4
                          ? "Very Good"
                          : recommendation.performanceRating === 3
                          ? "Good"
                          : recommendation.performanceRating === 2
                          ? "Average"
                          : "Basic"}{" "}
                        for {recommendation.purpose}
                      </span>
                    </div>
                    <div className="flex justify-between font-medium">
                      <span>Estimated Power Draw:</span>
                      <span>{recommendation.estimatedPowerDraw}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="border border-gray-200 rounded-lg p-6 mb-6">
              <h4 className="font-semibold text-gray-800 mb-4">
                Order Summary
              </h4>
              <div className="space-y-2 mb-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="text-gray-800">
                    ${recommendation.totalPrice}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Assembly Fee</span>
                  <span className="text-gray-800">$99.99</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Shipping</span>
                  <span className="text-gray-800">$0.00</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Tax</span>
                  <span className="text-gray-800">
                    ${(parseFloat(recommendation.totalPrice) * 0.1).toFixed(2)}
                  </span>
                </div>
              </div>
              <div className="border-t border-gray-200 pt-4">
                <div className="flex justify-between font-semibold">
                  <span>Total</span>
                  <span className="text-xl">
                    $
                    {(
                      parseFloat(recommendation.totalPrice) +
                      99.99 +
                      parseFloat(recommendation.totalPrice) * 0.1
                    ).toFixed(2)}
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-8 flex justify-between">
              <Button
                variant="outline"
                onClick={() => setStep(3)}
              >
                Back to Components
              </Button>
              <Link to="/cart">
                <Button>
                  Go to Cart & Checkout
                </Button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PCBuilderWizard;
