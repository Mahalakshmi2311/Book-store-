import React from 'react';
import { CheckCircle2, Package, Printer, ArrowRight, Truck, Calendar, MapPin } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const OrderSuccessPage: React.FC = () => {
  const { pageParams, getOrderById, orders, navigate } = useApp();

  const orderId = pageParams.orderId || orders[0]?.id;
  const order = getOrderById(orderId) || orders[0];

  const handlePrint = () => {
    window.print();
  };

  if (!order) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center">
        <h2 className="font-serif text-2xl font-bold mb-3">No Order Found</h2>
        <button
          onClick={() => navigate('books')}
          className="px-6 py-2.5 bg-blue-600 text-white rounded-lg text-xs font-semibold"
        >
          Return to Books
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-8 shadow-lg text-center">
        {/* Celebration checkmark */}
        <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto mb-4 animate-in zoom-in-75">
          <CheckCircle2 className="w-10 h-10 stroke-[2.2]" />
        </div>

        <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
          Order Confirmed &amp; Dispatched
        </span>

        <h1 className="font-serif text-3xl font-bold text-slate-900 dark:text-white mt-1 mb-2">
          Thank You For Your Order!
        </h1>

        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 max-w-md mx-auto mb-6">
          We’ve received your order and our logistics team is currently packing your volumes with archival-safe materials.
        </p>

        {/* Order Meta Pill */}
        <div className="inline-flex flex-wrap items-center justify-center gap-4 p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200/80 dark:border-slate-700 text-xs mb-8">
          <div>
            <span className="text-slate-400 block text-[10px] uppercase font-bold">Order ID</span>
            <span className="font-mono font-bold text-slate-900 dark:text-white">#{order.id}</span>
          </div>
          <span className="text-slate-300 dark:text-slate-700">|</span>
          <div>
            <span className="text-slate-400 block text-[10px] uppercase font-bold">Estimated Delivery</span>
            <span className="font-bold text-slate-900 dark:text-white">{order.estimatedDelivery}</span>
          </div>
          <span className="text-slate-300 dark:text-slate-700">|</span>
          <div>
            <span className="text-slate-400 block text-[10px] uppercase font-bold">Tracking Number</span>
            <span className="font-mono font-bold text-blue-600 dark:text-blue-400">{order.trackingNumber}</span>
          </div>
        </div>

        {/* Shipping & Delivery card */}
        <div className="text-left grid grid-cols-1 sm:grid-cols-2 gap-4 p-5 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-200/60 dark:border-slate-800 mb-8 text-xs">
          <div>
            <div className="flex items-center gap-1.5 font-bold text-slate-900 dark:text-white mb-1.5">
              <MapPin className="w-4 h-4 text-blue-600" />
              <span>Shipping Address</span>
            </div>
            <p className="font-semibold text-slate-800 dark:text-slate-200">
              {order.shippingAddress.fullName}
            </p>
            <p className="text-slate-600 dark:text-slate-400">
              {order.shippingAddress.street}
              <br />
              {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}
            </p>
            <p className="text-slate-500 mt-1">{order.shippingAddress.phone}</p>
          </div>

          <div>
            <div className="flex items-center gap-1.5 font-bold text-slate-900 dark:text-white mb-1.5">
              <Truck className="w-4 h-4 text-blue-600" />
              <span>Delivery Details</span>
            </div>
            <p className="text-slate-700 dark:text-slate-300">
              Method: <strong>{order.shippingMethod}</strong>
            </p>
            <p className="text-slate-700 dark:text-slate-300">
              Payment: <strong>{order.paymentMethod}</strong> (Confirmed)
            </p>
            <p className="text-slate-700 dark:text-slate-300">
              Status: <span className="text-emerald-600 font-bold">{order.status}</span>
            </p>
          </div>
        </div>

        {/* Items Summary Table */}
        <div className="text-left border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden mb-8 text-xs">
          <table className="w-full">
            <thead className="bg-slate-50 dark:bg-slate-800/80 text-slate-500 font-semibold">
              <tr>
                <th className="p-3 text-left">Book</th>
                <th className="p-3 text-left">Edition</th>
                <th className="p-3 text-center">Qty</th>
                <th className="p-3 text-right">Price</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {order.items.map((item, idx) => (
                <tr key={idx}>
                  <td className="p-3">
                    <div className="flex items-center gap-2.5">
                      <img
                        src={item.coverImage}
                        alt={item.title}
                        className="w-8 h-11 object-cover rounded shadow-xs shrink-0"
                      />
                      <span className="font-semibold text-slate-900 dark:text-white truncate max-w-xs">
                        {item.title}
                      </span>
                    </div>
                  </td>
                  <td className="p-3 text-slate-500">{item.format}</td>
                  <td className="p-3 text-center font-bold">{item.quantity}</td>
                  <td className="p-3 text-right font-bold text-slate-900 dark:text-white">
                    ${(item.price * item.quantity).toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="p-4 bg-slate-50 dark:bg-slate-800/60 border-t border-slate-200 dark:border-slate-800 flex justify-between items-baseline font-bold text-sm">
            <span>Total Paid</span>
            <span className="text-blue-600 dark:text-blue-400 text-lg">
              ${order.total.toFixed(2)}
            </span>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            type="button"
            onClick={handlePrint}
            className="w-full sm:w-auto px-6 py-3 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-colors"
          >
            <Printer className="w-4 h-4" />
            <span>Print Receipt</span>
          </button>

          <button
            type="button"
            onClick={() => navigate('user-profile', { tab: 'orders' })}
            className="w-full sm:w-auto px-6 py-3 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-800 dark:text-slate-200 rounded-xl text-xs font-bold transition-colors"
          >
            View in My Orders
          </button>

          <button
            type="button"
            onClick={() => navigate('books')}
            className="w-full sm:w-auto px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-md shadow-blue-500/20 flex items-center justify-center gap-2 transition-colors"
          >
            <span>Continue Shopping</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
