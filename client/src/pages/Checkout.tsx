import React, { useState } from "react";
import { useLocation } from "wouter";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Checkbox } from "@/components/ui/checkbox";
import { useCart } from "@/lib/context/CartContext";
import { useToast } from "@/hooks/use-toast";
import { CreditCard, Package, Check } from "lucide-react";

const Checkout = () => {
  const [_, setLocation] = useLocation();
  const { items, cartTotal, clearCart } = useCart();
  const { toast } = useToast();
  const [formStep, setFormStep] = useState(1);
  const [orderComplete, setOrderComplete] = useState(false);
  const [orderId, setOrderId] = useState("");

  const [shippingInfo, setShippingInfo] = useState({
    firstName: "",
    lastName: "",
    email: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    country: "United States",
    phone: "",
  });

  const [paymentInfo, setPaymentInfo] = useState({
    cardName: "",
    cardNumber: "",
    expiryDate: "",
    cvv: "",
    saveCard: false,
  });

  // Calculate order summary
  const tax = cartTotal * 0.1;
  const shipping = cartTotal > 100 ? 0 : 10;
  const orderTotal = cartTotal + tax + shipping;

  const checkoutMutation = useMutation({
    mutationFn: (data: any) => apiRequest("POST", "/api/checkout", data),
    onSuccess: (data) => {
      setOrderId(data.orderId);
      setOrderComplete(true);
      clearCart();
    },
    onError: (error) => {
      toast({
        title: "Checkout Failed",
        description: "There was an error processing your payment. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleShippingInfoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setShippingInfo((prev) => ({ ...prev, [name]: value }));
  };

  const handlePaymentInfoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPaymentInfo((prev) => ({ ...prev, [name]: value }));
  };

  const goToNextStep = () => {
    // Validate shipping info
    if (formStep === 1) {
      const { firstName, lastName, email, address, city, state, zipCode, phone } = shippingInfo;
      if (!firstName || !lastName || !email || !address || !city || !state || !zipCode || !phone) {
        toast({
          title: "Missing Information",
          description: "Please fill in all required shipping fields.",
          variant: "destructive",
        });
        return;
      }
    }
    setFormStep(formStep + 1);
  };

  const goToPreviousStep = () => {
    setFormStep(formStep - 1);
  };

  const handleCheckout = () => {
    // Validate payment info
    const { cardName, cardNumber, expiryDate, cvv } = paymentInfo;
    if (!cardName || !cardNumber || !expiryDate || !cvv) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required payment fields.",
        variant: "destructive",
      });
      return;
    }

    checkoutMutation.mutate({
      shippingInfo,
      paymentInfo: { ...paymentInfo, cardNumber: "****" + paymentInfo.cardNumber.slice(-4) },
      items,
      orderTotal,
    });
  };

  // If cart is empty and not in complete order state, redirect to cart
  React.useEffect(() => {
    if (items.length === 0 && !orderComplete) {
      setLocation("/cart");
    }
  }, [items, orderComplete, setLocation]);

  // Order complete view
  if (orderComplete) {
    return (
      <div className="container mx-auto px-4 py-16 max-w-3xl">
        <div className="bg-white shadow-md rounded-lg p-8 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Check className="h-8 w-8 text-green-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Order Complete!</h1>
          <p className="text-gray-600 mb-8">
            Thank you for your purchase. Your order #{orderId} has been placed successfully.
          </p>
          <p className="text-gray-600 mb-2">
            We've sent a confirmation email to {shippingInfo.email} with the order details.
          </p>
          <p className="text-gray-600 mb-8">
            Your items will be shipped to {shippingInfo.address}, {shippingInfo.city},{" "}
            {shippingInfo.state} {shippingInfo.zipCode}.
          </p>
          <Button onClick={() => setLocation("/")}>Continue Shopping</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
      <h1 className="text-2xl font-bold text-gray-800 mb-8">Checkout</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
            {/* Checkout Steps */}
            <div className="flex justify-between mb-8">
              <div className="flex flex-col items-center">
                <div
                  className={`w-10 h-10 rounded-full ${
                    formStep >= 1 ? "bg-primary text-white" : "bg-gray-200 text-gray-600"
                  } flex items-center justify-center font-bold`}
                >
                  1
                </div>
                <span className="text-sm font-medium mt-2">Shipping</span>
              </div>
              <div className="flex-1 flex items-center mx-4">
                <div className="h-1 w-full bg-gray-200">
                  <div
                    className="h-1 bg-primary transition-all duration-300"
                    style={{ width: formStep >= 2 ? "100%" : "0%" }}
                  ></div>
                </div>
              </div>
              <div className="flex flex-col items-center">
                <div
                  className={`w-10 h-10 rounded-full ${
                    formStep >= 2 ? "bg-primary text-white" : "bg-gray-200 text-gray-600"
                  } flex items-center justify-center font-bold`}
                >
                  2
                </div>
                <span className="text-sm font-medium mt-2">Payment</span>
              </div>
              <div className="flex-1 flex items-center mx-4">
                <div className="h-1 w-full bg-gray-200">
                  <div
                    className="h-1 bg-primary transition-all duration-300"
                    style={{ width: formStep >= 3 ? "100%" : "0%" }}
                  ></div>
                </div>
              </div>
              <div className="flex flex-col items-center">
                <div
                  className={`w-10 h-10 rounded-full ${
                    formStep >= 3 ? "bg-primary text-white" : "bg-gray-200 text-gray-600"
                  } flex items-center justify-center font-bold`}
                >
                  3
                </div>
                <span className="text-sm font-medium mt-2">Review</span>
              </div>
            </div>

            {/* Step 1: Shipping Information */}
            {formStep === 1 && (
              <div>
                <div className="flex items-center mb-6">
                  <Package className="h-6 w-6 mr-2 text-primary" />
                  <h2 className="text-xl font-semibold text-gray-800">Shipping Information</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="firstName">First Name *</Label>
                    <Input
                      id="firstName"
                      name="firstName"
                      value={shippingInfo.firstName}
                      onChange={handleShippingInfoChange}
                      className="mt-1"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="lastName">Last Name *</Label>
                    <Input
                      id="lastName"
                      name="lastName"
                      value={shippingInfo.lastName}
                      onChange={handleShippingInfoChange}
                      className="mt-1"
                      required
                    />
                  </div>
                  <div className="md:col-span-2">
                    <Label htmlFor="email">Email Address *</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={shippingInfo.email}
                      onChange={handleShippingInfoChange}
                      className="mt-1"
                      required
                    />
                  </div>
                  <div className="md:col-span-2">
                    <Label htmlFor="address">Street Address *</Label>
                    <Input
                      id="address"
                      name="address"
                      value={shippingInfo.address}
                      onChange={handleShippingInfoChange}
                      className="mt-1"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="city">City *</Label>
                    <Input
                      id="city"
                      name="city"
                      value={shippingInfo.city}
                      onChange={handleShippingInfoChange}
                      className="mt-1"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="state">State/Province *</Label>
                    <Input
                      id="state"
                      name="state"
                      value={shippingInfo.state}
                      onChange={handleShippingInfoChange}
                      className="mt-1"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="zipCode">Zip/Postal Code *</Label>
                    <Input
                      id="zipCode"
                      name="zipCode"
                      value={shippingInfo.zipCode}
                      onChange={handleShippingInfoChange}
                      className="mt-1"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="country">Country *</Label>
                    <Input
                      id="country"
                      name="country"
                      value={shippingInfo.country}
                      onChange={handleShippingInfoChange}
                      className="mt-1"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone">Phone Number *</Label>
                    <Input
                      id="phone"
                      name="phone"
                      value={shippingInfo.phone}
                      onChange={handleShippingInfoChange}
                      className="mt-1"
                      required
                    />
                  </div>
                </div>

                <div className="mt-8 flex justify-end">
                  <Button onClick={goToNextStep}>Continue to Payment</Button>
                </div>
              </div>
            )}

            {/* Step 2: Payment Information */}
            {formStep === 2 && (
              <div>
                <div className="flex items-center mb-6">
                  <CreditCard className="h-6 w-6 mr-2 text-primary" />
                  <h2 className="text-xl font-semibold text-gray-800">Payment Information</h2>
                </div>

                <div className="space-y-6">
                  <div>
                    <Label htmlFor="cardName">Name on Card *</Label>
                    <Input
                      id="cardName"
                      name="cardName"
                      value={paymentInfo.cardName}
                      onChange={handlePaymentInfoChange}
                      className="mt-1"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="cardNumber">Card Number *</Label>
                    <Input
                      id="cardNumber"
                      name="cardNumber"
                      value={paymentInfo.cardNumber}
                      onChange={handlePaymentInfoChange}
                      placeholder="**** **** **** ****"
                      className="mt-1"
                      required
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="expiryDate">Expiry Date *</Label>
                      <Input
                        id="expiryDate"
                        name="expiryDate"
                        value={paymentInfo.expiryDate}
                        onChange={handlePaymentInfoChange}
                        placeholder="MM/YY"
                        className="mt-1"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="cvv">CVV *</Label>
                      <Input
                        id="cvv"
                        name="cvv"
                        value={paymentInfo.cvv}
                        onChange={handlePaymentInfoChange}
                        placeholder="***"
                        className="mt-1"
                        required
                      />
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="saveCard"
                      checked={paymentInfo.saveCard}
                      onCheckedChange={(checked) =>
                        setPaymentInfo({ ...paymentInfo, saveCard: !!checked })
                      }
                    />
                    <label
                      htmlFor="saveCard"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      Save this card for future purchases
                    </label>
                  </div>
                </div>

                <div className="mt-8 flex justify-between">
                  <Button variant="outline" onClick={goToPreviousStep}>
                    Back to Shipping
                  </Button>
                  <Button onClick={goToNextStep}>Review Order</Button>
                </div>
              </div>
            )}

            {/* Step 3: Review Order */}
            {formStep === 3 && (
              <div>
                <h2 className="text-xl font-semibold text-gray-800 mb-6">Review Your Order</h2>

                <div className="space-y-6">
                  {/* Shipping Info Summary */}
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="font-medium text-gray-800">Shipping Information</h3>
                      <Button
                        variant="link"
                        className="text-primary p-0 h-auto"
                        onClick={() => setFormStep(1)}
                      >
                        Edit
                      </Button>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-gray-600">
                        {shippingInfo.firstName} {shippingInfo.lastName}
                      </p>
                      <p className="text-gray-600">{shippingInfo.address}</p>
                      <p className="text-gray-600">
                        {shippingInfo.city}, {shippingInfo.state} {shippingInfo.zipCode}
                      </p>
                      <p className="text-gray-600">{shippingInfo.country}</p>
                      <p className="text-gray-600 mt-2">Email: {shippingInfo.email}</p>
                      <p className="text-gray-600">Phone: {shippingInfo.phone}</p>
                    </div>
                  </div>

                  {/* Payment Info Summary */}
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="font-medium text-gray-800">Payment Information</h3>
                      <Button
                        variant="link"
                        className="text-primary p-0 h-auto"
                        onClick={() => setFormStep(2)}
                      >
                        Edit
                      </Button>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-gray-600">{paymentInfo.cardName}</p>
                      <p className="text-gray-600">
                        Card ending in {paymentInfo.cardNumber.slice(-4)}
                      </p>
                      <p className="text-gray-600">Expires: {paymentInfo.expiryDate}</p>
                    </div>
                  </div>

                  {/* Order Items Summary */}
                  <div>
                    <h3 className="font-medium text-gray-800 mb-2">Order Items</h3>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      {items.map((item) => (
                        <div key={item.id} className="flex justify-between mb-2">
                          <div className="flex">
                            <span className="text-gray-600">
                              {item.quantity} x {item.product.name}
                            </span>
                          </div>
                          <span className="text-gray-800 font-medium">
                            ${(Number(item.product.price) * item.quantity).toFixed(2)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="mt-8 flex justify-between">
                  <Button variant="outline" onClick={goToPreviousStep}>
                    Back to Payment
                  </Button>
                  <Button 
                    onClick={handleCheckout}
                    disabled={checkoutMutation.isPending}
                  >
                    {checkoutMutation.isPending ? "Processing..." : "Place Order"}
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-sm p-6 sticky top-24">
            <h2 className="text-xl font-semibold text-gray-800 mb-6">Order Summary</h2>
            <div className="space-y-4">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal ({items.length} {items.length === 1 ? "item" : "items"})</span>
                <span>${cartTotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Shipping</span>
                <span>{shipping === 0 ? "Free" : `$${shipping.toFixed(2)}`}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Tax</span>
                <span>${tax.toFixed(2)}</span>
              </div>
              <Separator />
              <div className="flex justify-between font-semibold text-gray-800">
                <span>Total</span>
                <span>${orderTotal.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
