import React, { useState } from 'react';
import {
  ShoppingBag,
  Trash2,
  ArrowRight,
  ShieldCheck,
  Tag,
  Truck,
  RotateCcw,
  Plus,
  Minus,
  Check,
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const CartPage: React.FC = () => {
  const {
    cart,
    removeFromCart,
    updateCartQuantity,
    clearCart,
    cartSubtotal,
    appliedPromo,
    promoDiscountRate,
    applyPromo,
    removePromo,
    navigate,
  } = useApp();

  const [promoInput, setPromoInput] = useState('');

  const FREE_SHIPPING_THRESHOLD = 35;
  const isFreeShipping = cartSubtotal >= FREE_SHIPPING_THRESHOLD;
  const shippingFee = isFreeShipping || cart.length === 0 ? 0 : 4.99;
  const discountAmount = cartSubtotal * promoDiscountRate;
  const taxableAmount = Math.max(0, cartSubtotal - discountAmount);
  const tax = taxableAmount * 0.08;
  const total = taxableAmount + shippingFee + tax;

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    if (promoInput.trim()) {
      applyPromo(promoInput);
      setPromoInput('');
    }
  };

  if (cart.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <div className="w-16 h-16 mx-auto rounded-full bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-4">
          <ShoppingBag className="w-8 h-8" />
        </div>
        <h1 className="font-serif text-3xl font-bold text-slate-900 dark:text-white mb-2">
          Your Cart is Empty
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-sm mx-auto mb-6">
          Looks like you haven't added any books to your cart yet. Explore our curated bestseller shelves or check our deals of the day!
        </p>
        <button
          type="button"
          onClick={() => navigate('books')}
          className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-md shadow-blue-500/20 transition-all inline-flex items-center gap-2"
        >
          <span>Start Shopping</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-serif text-3xl font-bold text-slate-900 dark:text-white">
            Shopping Cart ({cart.reduce((a, b) => a + b.quantity, 0)} items)
          </h1>
          <p className="text-xs text-slate-500 mt-1">Review your selected volumes before checkout</p>
        </div>
        <button
          type="button"
          onClick={clearCart}
          className="text-xs text-rose-600 dark:text-rose-400 hover:underline font-semibold"
        >
          Clear Entire Cart
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Cart Items List */}
        <div className="lg:col-span-8 flex flex-col gap-4">
          {/* Free shipping progress bar */}
          <div className="p-4 bg-blue-50 dark:bg-blue-950/40 rounded-xl border border-blue-200/80 dark:border-blue-900">
            <div className="flex items-center justify-between text-xs mb-2">
              <span className="font-bold text-blue-900 dark:text-blue-100 flex items-center gap-1.5">
                <Truck className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                {isFreeShipping ? (
                  <span className="text-emerald-700 dark:text-emerald-300 font-bold">
                    You've unlocked Free Standard Delivery!
                  </span>
                ) : (
                  <span>
                    Add ${(FREE_SHIPPING_THRESHOLD - cartSubtotal).toFixed(2)} more for{' '}
                    <strong>Free Shipping</strong>
                  </span>
                )}
              </span>
              <span className="font-semibold text-blue-700 dark:text-blue-300">
                {Math.min(100, Math.round((cartSubtotal / FREE_SHIPPING_THRESHOLD) * 100))}%
              </span>
            </div>
            <div className="w-full h-2 bg-blue-200 dark:bg-blue-900 rounded-full overflow-hidden">
              <div
                className="h-full bg-blue-600 rounded-full transition-all duration-500"
                style={{
                  width: `${Math.min(100, (cartSubtotal / FREE_SHIPPING_THRESHOLD) * 100)}%`,
                }}
              />
            </div>
          </div>

          {/* Items */}
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 divide-y divide-slate-100 dark:divide-slate-800">
            {cart.map((item) => {
              const effectivePrice =
                item.book.discount > 0
                  ? item.book.price * (1 - item.book.discount / 100)
                  : item.book.price;
              const lineTotal = effectivePrice * item.quantity;

              return (
                <div
                  key={`${item.book.id}-${item.selectedFormat}`}
                  className="p-4 sm:p-5 flex flex-col sm:flex-row items-center sm:items-start gap-4"
                >
                  <img
                    src={item.book.coverImage}
                    alt={item.book.title}
                    className="w-20 aspect-[3/4] object-cover rounded-lg shadow-xs shrink-0 cursor-pointer"
                    onClick={() => navigate('book-details', { id: item.book.id })}
                  />

                  <div className="flex-1 min-w-0 flex flex-col justify-between w-full">
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
                      <div>
                        <span className="text-[10px] font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider">
                          {item.book.category}
                        </span>
                        <h3
                          onClick={() => navigate('book-details', { id: item.book.id })}
                          className="font-serif font-bold text-sm sm:text-base text-slate-900 dark:text-white cursor-pointer hover:text-blue-600 truncate"
                        >
                          {item.book.title}
                        </h3>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                          by {item.book.author} · <span className="font-medium text-slate-700 dark:text-slate-300">{item.selectedFormat}</span>
                        </p>
                      </div>

                      <div className="text-right">
                        <div className="text-base font-bold text-slate-900 dark:text-white">
                          ${lineTotal.toFixed(2)}
                        </div>
                        {item.quantity > 1 && (
                          <div className="text-[11px] text-slate-400">
                            ${effectivePrice.toFixed(2)} each
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
                      {/* Quantity Controller */}
                      <div className="flex items-center border border-slate-200 dark:border-slate-700 rounded-lg overflow-hidden bg-slate-50 dark:bg-slate-800">
                        <button
                          type="button"
                          onClick={() =>
                            updateCartQuantity(item.book.id, item.quantity - 1, item.selectedFormat)
                          }
                          className="p-1.5 px-2.5 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="px-3 text-xs font-bold text-slate-800 dark:text-slate-200">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() =>
                            updateCartQuantity(item.book.id, item.quantity + 1, item.selectedFormat)
                          }
                          className="p-1.5 px-2.5 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                          aria-label="Increase quantity"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {/* Remove Button */}
                      <button
                        type="button"
                        onClick={() => removeFromCart(item.book.id, item.selectedFormat)}
                        className="text-xs text-rose-600 hover:text-rose-700 dark:text-rose-400 flex items-center gap-1 font-medium transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Remove</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="flex items-center justify-between text-xs text-slate-500 pt-2">
            <button
              onClick={() => navigate('books')}
              className="text-blue-600 dark:text-blue-400 hover:underline font-semibold flex items-center gap-1"
            >
              &larr; Continue Exploring Catalog
            </button>
          </div>
        </div>

        {/* Order Summary Column */}
        <div className="lg:col-span-4">
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs sticky top-24">
            <h2 className="font-serif text-lg font-bold text-slate-900 dark:text-white mb-4">
              Order Summary
            </h2>

            {/* Promo Code Input */}
            <div className="mb-5 pb-5 border-b border-slate-100 dark:border-slate-800">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2">
                Have a Promo Code?
              </label>
              {appliedPromo ? (
                <div className="flex items-center justify-between p-2.5 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded-lg text-xs text-emerald-800 dark:text-emerald-200">
                  <div className="flex items-center gap-1.5 font-bold">
                    <Check className="w-4 h-4 text-emerald-600" />
                    <span>{appliedPromo}</span>
                  </div>
                  <button
                    onClick={removePromo}
                    className="text-rose-600 hover:underline font-semibold"
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <form onSubmit={handleApplyPromo} className="flex gap-2">
                  <input
                    type="text"
                    value={promoInput}
                    onChange={(e) => setPromoInput(e.target.value)}
                    placeholder="e.g. NEST15"
                    className="flex-1 px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs uppercase focus:outline-none focus:border-blue-600"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-lg text-xs font-bold hover:bg-slate-800"
                  >
                    Apply
                  </button>
                </form>
              )}
              <span className="text-[10px] text-slate-400 block mt-1.5">
                Try promo code <strong>NEST15</strong> for 15% off
              </span>
            </div>

            {/* Price Calculations */}
            <div className="space-y-2.5 text-xs pb-4 border-b border-slate-100 dark:border-slate-800">
              <div className="flex justify-between text-slate-600 dark:text-slate-400">
                <span>Subtotal</span>
                <span className="font-semibold text-slate-900 dark:text-white">
                  ${cartSubtotal.toFixed(2)}
                </span>
              </div>

              {discountAmount > 0 && (
                <div className="flex justify-between text-emerald-600 dark:text-emerald-400 font-semibold">
                  <span>Promo Discount ({promoDiscountRate * 100}%)</span>
                  <span>-${discountAmount.toFixed(2)}</span>
                </div>
              )}

              <div className="flex justify-between text-slate-600 dark:text-slate-400">
                <span>Estimated Shipping</span>
                <span className="font-semibold text-slate-900 dark:text-white">
                  {isFreeShipping ? (
                    <span className="text-emerald-600 font-bold">FREE</span>
                  ) : (
                    `$${shippingFee.toFixed(2)}`
                  )}
                </span>
              </div>

              <div className="flex justify-between text-slate-600 dark:text-slate-400">
                <span>Estimated Tax (8%)</span>
                <span className="font-semibold text-slate-900 dark:text-white">
                  ${tax.toFixed(2)}
                </span>
              </div>
            </div>

            {/* Total */}
            <div className="flex justify-between items-baseline pt-4 mb-6">
              <span className="font-serif text-base font-bold text-slate-900 dark:text-white">
                Total
              </span>
              <span className="text-2xl font-extrabold text-blue-600 dark:text-blue-400">
                ${total.toFixed(2)}
              </span>
            </div>

            {/* Proceed to checkout button */}
            <button
              type="button"
              onClick={() => navigate('checkout')}
              className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs shadow-md shadow-blue-500/20 flex items-center justify-center gap-2 transition-all hover:gap-3"
            >
              <span>Proceed to Checkout</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            {/* Trust Badges */}
            <div className="mt-6 pt-5 border-t border-slate-100 dark:border-slate-800 space-y-2 text-[11px] text-slate-500 dark:text-slate-400">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Encrypted 256-bit SSL transaction</span>
              </div>
              <div className="flex items-center gap-2">
                <RotateCcw className="w-4 h-4 text-blue-600" />
                <span>30-day money-back satisfaction guarantee</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
