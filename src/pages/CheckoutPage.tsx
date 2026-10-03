import React, { useState } from 'react';
import {
  ShieldCheck,
  CreditCard,
  Truck,
  Check,
  ArrowRight,
  Lock,
  DollarSign,
  AlertCircle,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { ShippingAddress } from '../types';

export const CheckoutPage: React.FC = () => {
  const {
    cart,
    cartSubtotal,
    promoDiscountRate,
    createOrder,
    navigate,
    currentUser,
    addToast,
  } = useApp();

  // If cart is empty, redirect
  if (cart.length === 0) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center">
        <h2 className="font-serif text-2xl font-bold mb-3">Your Cart is Empty</h2>
        <p className="text-xs text-slate-500 mb-6">
          Please add items to your cart before proceeding to checkout.
        </p>
        <button
          onClick={() => navigate('books')}
          className="px-6 py-2.5 bg-blue-600 text-white rounded-lg text-xs font-semibold"
        >
          Browse Books
        </button>
      </div>
    );
  }

  // Shipping Form State
  const [fullName, setFullName] = useState(currentUser?.name || 'Sarah Jenkins');
  const [email, setEmail] = useState(currentUser?.email || 'sarah.reader@example.com');
  const [phone, setPhone] = useState(currentUser?.phone || '+1 (555) 234-5678');
  const [street, setStreet] = useState(currentUser?.address?.street || '742 Evergreen Terrace, Apt 4B');
  const [city, setCity] = useState(currentUser?.address?.city || 'Seattle');
  const [state, setState] = useState(currentUser?.address?.state || 'WA');
  const [zipCode, setZipCode] = useState(currentUser?.address?.zipCode || '98101');
  const [country] = useState('United States');

  // Shipping Method
  const [shippingMethod, setShippingMethod] = useState<'standard' | 'express' | 'overnight'>('standard');

  // Payment Method
  const [paymentMethod, setPaymentMethod] = useState<'Credit Card' | 'PayPal' | 'Cash on Delivery'>('Credit Card');
  const [cardNumber, setCardNumber] = useState('4242 •••• •••• 4242');
  const [cardExp, setCardExp] = useState('12/28');
  const [cardCvc, setCardCvc] = useState('888');
  const [isProcessing, setIsProcessing] = useState(false);

  // Financial Calculations
  const isFreeStandard = cartSubtotal >= 35;
  const shippingFee =
    shippingMethod === 'standard'
      ? isFreeStandard
        ? 0
        : 4.99
      : shippingMethod === 'express'
      ? 9.99
      : 19.99;

  const discountAmount = cartSubtotal * promoDiscountRate;
  const taxableAmount = Math.max(0, cartSubtotal - discountAmount);
  const tax = taxableAmount * 0.08;
  const grandTotal = taxableAmount + shippingFee + tax;

  const handlePlaceOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !street.trim() || !city.trim() || !zipCode.trim()) {
      addToast('Please fill out all required shipping fields', 'error');
      return;
    }

    setIsProcessing(true);

    setTimeout(() => {
      const shippingAddress: ShippingAddress = {
        fullName,
        email,
        phone,
        street,
        city,
        state,
        zipCode,
        country,
      };

      const shippingMethodName =
        shippingMethod === 'standard'
          ? 'Standard Delivery (3-5 days)'
          : shippingMethod === 'express'
          ? 'Express Priority (1-2 days)'
          : 'Overnight Air Delivery';

      const order = createOrder({
        items: cart,
        shippingAddress,
        shippingMethod: shippingMethodName,
        shippingFee,
        paymentMethod,
      });

      setIsProcessing(false);
      navigate('order-success', { orderId: order.id });
    }, 1200);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
      <div className="mb-8">
        <h1 className="font-serif text-3xl font-bold text-slate-900 dark:text-white">
          Secure Checkout
        </h1>
        <p className="text-xs text-slate-500 mt-1">Complete your order with 256-bit SSL encrypted security</p>
      </div>

      <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Shipping & Payment Details */}
        <div className="lg:col-span-8 space-y-6">
          {/* Step 1: Shipping Address */}
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs">
            <div className="flex items-center gap-2 mb-4">
              <span className="w-6 h-6 rounded-full bg-blue-600 text-white text-xs font-bold flex items-center justify-center">
                1
              </span>
              <h2 className="font-serif text-lg font-bold text-slate-900 dark:text-white">
                Shipping Information
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs focus:outline-none focus:border-blue-600"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Email Address *
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs focus:outline-none focus:border-blue-600"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Street Address *
                </label>
                <input
                  type="text"
                  required
                  value={street}
                  onChange={(e) => setStreet(e.target.value)}
                  placeholder="Street and house or apartment number"
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs focus:outline-none focus:border-blue-600"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  City *
                </label>
                <input
                  type="text"
                  required
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs focus:outline-none focus:border-blue-600"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    State *
                  </label>
                  <input
                    type="text"
                    required
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs focus:outline-none focus:border-blue-600"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Zip Code *
                  </label>
                  <input
                    type="text"
                    required
                    value={zipCode}
                    onChange={(e) => setZipCode(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs focus:outline-none focus:border-blue-600"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs focus:outline-none focus:border-blue-600"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Country
                </label>
                <input
                  type="text"
                  disabled
                  value={country}
                  className="w-full px-3 py-2 bg-slate-100 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-lg text-xs text-slate-500"
                />
              </div>
            </div>
          </div>

          {/* Step 2: Delivery Method */}
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs">
            <div className="flex items-center gap-2 mb-4">
              <span className="w-6 h-6 rounded-full bg-blue-600 text-white text-xs font-bold flex items-center justify-center">
                2
              </span>
              <h2 className="font-serif text-lg font-bold text-slate-900 dark:text-white">
                Delivery Speed
              </h2>
            </div>

            <div className="space-y-3">
              <label
                className={`flex items-center justify-between p-3.5 rounded-xl border cursor-pointer transition-all ${
                  shippingMethod === 'standard'
                    ? 'border-blue-600 bg-blue-50/30 dark:bg-blue-950/20 ring-1 ring-blue-600'
                    : 'border-slate-200 dark:border-slate-700 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center gap-3">
                  <input
                    type="radio"
                    name="shippingMethod"
                    checked={shippingMethod === 'standard'}
                    onChange={() => setShippingMethod('standard')}
                    className="accent-blue-600"
                  />
                  <div>
                    <div className="text-xs font-bold text-slate-900 dark:text-white">
                      Standard Ground Shipping (3 - 5 Business Days)
                    </div>
                    <div className="text-[11px] text-slate-500">
                      Carefully packed with protective corner guards
                    </div>
                  </div>
                </div>
                <span className="text-xs font-bold text-slate-900 dark:text-white">
                  {isFreeStandard ? <span className="text-emerald-600">FREE</span> : '$4.99'}
                </span>
              </label>

              <label
                className={`flex items-center justify-between p-3.5 rounded-xl border cursor-pointer transition-all ${
                  shippingMethod === 'express'
                    ? 'border-blue-600 bg-blue-50/30 dark:bg-blue-950/20 ring-1 ring-blue-600'
                    : 'border-slate-200 dark:border-slate-700 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center gap-3">
                  <input
                    type="radio"
                    name="shippingMethod"
                    checked={shippingMethod === 'express'}
                    onChange={() => setShippingMethod('express')}
                    className="accent-blue-600"
                  />
                  <div>
                    <div className="text-xs font-bold text-slate-900 dark:text-white">
                      Express 2-Day Air (1 - 2 Business Days)
                    </div>
                    <div className="text-[11px] text-slate-500">
                      Expedited dispatch via FedEx Express
                    </div>
                  </div>
                </div>
                <span className="text-xs font-bold text-slate-900 dark:text-white">$9.99</span>
              </label>

              <label
                className={`flex items-center justify-between p-3.5 rounded-xl border cursor-pointer transition-all ${
                  shippingMethod === 'overnight'
                    ? 'border-blue-600 bg-blue-50/30 dark:bg-blue-950/20 ring-1 ring-blue-600'
                    : 'border-slate-200 dark:border-slate-700 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center gap-3">
                  <input
                    type="radio"
                    name="shippingMethod"
                    checked={shippingMethod === 'overnight'}
                    onChange={() => setShippingMethod('overnight')}
                    className="accent-blue-600"
                  />
                  <div>
                    <div className="text-xs font-bold text-slate-900 dark:text-white">
                      Next-Day Overnight Guaranteed
                    </div>
                    <div className="text-[11px] text-slate-500">
                      Dispatched immediately with priority courier
                    </div>
                  </div>
                </div>
                <span className="text-xs font-bold text-slate-900 dark:text-white">$19.99</span>
              </label>
            </div>
          </div>

          {/* Step 3: Payment Method */}
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs">
            <div className="flex items-center gap-2 mb-4">
              <span className="w-6 h-6 rounded-full bg-blue-600 text-white text-xs font-bold flex items-center justify-center">
                3
              </span>
              <h2 className="font-serif text-lg font-bold text-slate-900 dark:text-white">
                Payment Option
              </h2>
            </div>

            <div className="grid grid-cols-3 gap-3 mb-5">
              <button
                type="button"
                onClick={() => setPaymentMethod('Credit Card')}
                className={`p-3 rounded-xl border text-center transition-all ${
                  paymentMethod === 'Credit Card'
                    ? 'border-blue-600 bg-blue-50/40 dark:bg-blue-950/30 text-blue-900 dark:text-blue-100 font-bold'
                    : 'border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                }`}
              >
                <CreditCard className="w-5 h-5 mx-auto mb-1 text-blue-600" />
                <span className="text-xs">Credit Card</span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('PayPal')}
                className={`p-3 rounded-xl border text-center transition-all ${
                  paymentMethod === 'PayPal'
                    ? 'border-blue-600 bg-blue-50/40 dark:bg-blue-950/30 text-blue-900 dark:text-blue-100 font-bold'
                    : 'border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                }`}
              >
                <DollarSign className="w-5 h-5 mx-auto mb-1 text-amber-500" />
                <span className="text-xs">PayPal</span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('Cash on Delivery')}
                className={`p-3 rounded-xl border text-center transition-all ${
                  paymentMethod === 'Cash on Delivery'
                    ? 'border-blue-600 bg-blue-50/40 dark:bg-blue-950/30 text-blue-900 dark:text-blue-100 font-bold'
                    : 'border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                }`}
              >
                <Truck className="w-5 h-5 mx-auto mb-1 text-emerald-600" />
                <span className="text-xs">Cash on Delivery</span>
              </button>
            </div>

            {paymentMethod === 'Credit Card' && (
              <div className="space-y-3 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200/80 dark:border-slate-700">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Card Number
                  </label>
                  <input
                    type="text"
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value)}
                    placeholder="4242 4242 4242 4242"
                    className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-mono focus:outline-none focus:border-blue-600"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Expiration (MM/YY)
                    </label>
                    <input
                      type="text"
                      value={cardExp}
                      onChange={(e) => setCardExp(e.target.value)}
                      placeholder="12/28"
                      className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-mono focus:outline-none focus:border-blue-600"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      CVC / CVV
                    </label>
                    <input
                      type="password"
                      value={cardCvc}
                      onChange={(e) => setCardCvc(e.target.value)}
                      placeholder="•••"
                      maxLength={4}
                      className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-mono focus:outline-none focus:border-blue-600"
                    />
                  </div>
                </div>
              </div>
            )}

            {paymentMethod === 'PayPal' && (
              <div className="p-4 bg-amber-50 dark:bg-amber-950/30 rounded-xl border border-amber-200 dark:border-amber-800 text-xs text-amber-900 dark:text-amber-200">
                You will be connected to your PayPal account to finalize your authorization after placing your order.
              </div>
            )}

            {paymentMethod === 'Cash on Delivery' && (
              <div className="p-4 bg-emerald-50 dark:bg-emerald-950/30 rounded-xl border border-emerald-200 dark:border-emerald-800 text-xs text-emerald-900 dark:text-emerald-200">
                Pay safely in cash directly to the delivery courier upon doorstep receipt.
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Order Summary & Confirmation */}
        <div className="lg:col-span-4">
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs sticky top-24">
            <h2 className="font-serif text-lg font-bold text-slate-900 dark:text-white mb-4">
              Order Review ({cart.length} items)
            </h2>

            {/* Compact items list */}
            <div className="max-h-56 overflow-y-auto space-y-3 mb-4 pr-1">
              {cart.map((item, idx) => (
                <div key={idx} className="flex items-center gap-3 text-xs">
                  <img
                    src={item.book.coverImage}
                    alt={item.book.title}
                    className="w-10 h-14 object-cover rounded shadow-xs shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-slate-900 dark:text-white truncate">
                      {item.book.title}
                    </h4>
                    <span className="text-[11px] text-slate-400">
                      Qty: {item.quantity} · {item.selectedFormat}
                    </span>
                  </div>
                  <span className="font-bold text-slate-900 dark:text-white">
                    $
                    {(
                      (item.book.discount > 0
                        ? item.book.price * (1 - item.book.discount / 100)
                        : item.book.price) * item.quantity
                    ).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>

            {/* Calculations breakdown */}
            <div className="space-y-2 text-xs py-4 border-t border-b border-slate-100 dark:border-slate-800">
              <div className="flex justify-between text-slate-600 dark:text-slate-400">
                <span>Items Subtotal:</span>
                <span>${cartSubtotal.toFixed(2)}</span>
              </div>
              {discountAmount > 0 && (
                <div className="flex justify-between text-emerald-600 font-semibold">
                  <span>Discount Applied:</span>
                  <span>-${discountAmount.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between text-slate-600 dark:text-slate-400">
                <span>Shipping:</span>
                <span>
                  {shippingFee === 0 ? (
                    <span className="text-emerald-600 font-bold">FREE</span>
                  ) : (
                    `$${shippingFee.toFixed(2)}`
                  )}
                </span>
              </div>
              <div className="flex justify-between text-slate-600 dark:text-slate-400">
                <span>Tax (8%):</span>
                <span>${tax.toFixed(2)}</span>
              </div>
            </div>

            <div className="flex justify-between items-baseline py-4">
              <span className="font-serif text-base font-bold text-slate-900 dark:text-white">
                Total Amount:
              </span>
              <span className="text-2xl font-extrabold text-blue-600 dark:text-blue-400">
                ${grandTotal.toFixed(2)}
              </span>
            </div>

            <button
              type="submit"
              disabled={isProcessing}
              className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs shadow-md shadow-blue-500/20 flex items-center justify-center gap-2 transition-all disabled:opacity-50"
            >
              {isProcessing ? (
                <span>Processing Order...</span>
              ) : (
                <>
                  <Lock className="w-4 h-4" />
                  <span>Place Order · ${grandTotal.toFixed(2)}</span>
                </>
              )}
            </button>

            <p className="text-[11px] text-slate-400 text-center mt-3">
              By placing your order, you agree to BookNest's delivery guidelines and privacy policy.
            </p>
          </div>
        </div>
      </form>
    </div>
  );
};
