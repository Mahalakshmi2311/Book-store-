import React, { useState } from 'react';
import {
  User as UserIcon,
  Package,
  MapPin,
  Heart,
  Settings,
  Shield,
  Truck,
  CheckCircle2,
  Clock,
  Printer,
  X,
  ExternalLink,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Order, ShippingAddress } from '../types';

export const UserProfilePage: React.FC = () => {
  const {
    currentUser,
    updateUserProfile,
    orders,
    wishlist,
    books,
    navigate,
    pageParams,
    addToast,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'profile' | 'orders' | 'addresses'>(
    pageParams.tab === 'orders' ? 'orders' : 'profile'
  );

  // Edit form state
  const [name, setName] = useState(currentUser?.name || '');
  const [phone, setPhone] = useState(currentUser?.phone || '');
  const [street, setStreet] = useState(currentUser?.address?.street || '742 Evergreen Terrace');
  const [city, setCity] = useState(currentUser?.address?.city || 'Seattle');
  const [state, setState] = useState(currentUser?.address?.state || 'WA');
  const [zipCode, setZipCode] = useState(currentUser?.address?.zipCode || '98101');

  // Selected Order for Modal View
  const [viewOrder, setViewOrder] = useState<Order | null>(null);

  if (!currentUser) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center">
        <h2 className="font-serif text-2xl font-bold mb-3">Sign in required</h2>
        <p className="text-xs text-slate-500 mb-6">
          Please sign in to view your orders, account settings, and saved addresses.
        </p>
        <button
          onClick={() => navigate('login')}
          className="px-6 py-2.5 bg-blue-600 text-white rounded-lg text-xs font-semibold"
        >
          Sign In Now
        </button>
      </div>
    );
  }

  const userOrders = orders.filter((o) => o.userId === currentUser.id);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateUserProfile({
      name,
      phone,
      address: {
        fullName: name,
        email: currentUser.email,
        phone,
        street,
        city,
        state,
        zipCode,
        country: 'United States',
      },
    });
  };

  const handlePrintOrder = () => {
    window.print();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
      {/* Top Banner Profile Summary */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 mb-8 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xs">
        <div className="flex items-center gap-4">
          {currentUser.avatar ? (
            <img
              src={currentUser.avatar}
              alt={currentUser.name}
              className="w-16 h-16 rounded-full object-cover border-2 border-blue-600"
            />
          ) : (
            <div className="w-16 h-16 rounded-full bg-blue-600 text-white flex items-center justify-center font-serif text-2xl font-bold">
              {currentUser.name[0]}
            </div>
          )}

          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-serif text-2xl font-bold text-slate-900 dark:text-white">
                {currentUser.name}
              </h1>
              {currentUser.role === 'admin' ? (
                <span className="px-2 py-0.5 rounded bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300 text-[10px] font-bold">
                  Administrator
                </span>
              ) : (
                <span className="px-2 py-0.5 rounded bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-[10px] font-bold">
                  Reader Member
                </span>
              )}
            </div>
            <p className="text-xs text-slate-500 mt-0.5">{currentUser.email}</p>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Member since {currentUser.createdAt || '2025'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {currentUser.role === 'admin' && (
            <button
              onClick={() => navigate('admin-dashboard')}
              className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-xs"
            >
              <Shield className="w-3.5 h-3.5" />
              <span>Admin Dashboard</span>
            </button>
          )}
          <button
            onClick={() => navigate('wishlist')}
            className="px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-lg text-xs font-semibold flex items-center gap-1.5 hover:bg-slate-200 transition-colors"
          >
            <Heart className="w-3.5 h-3.5 text-rose-500" />
            <span>Wishlist ({wishlist.length})</span>
          </button>
        </div>
      </div>

      {/* Main Profile Tabs */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Navigation Tabs Sidebar */}
        <aside className="lg:col-span-3">
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-2 space-y-1">
            <button
              type="button"
              onClick={() => setActiveTab('profile')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-xs font-semibold transition-colors ${
                activeTab === 'profile'
                  ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
                  : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
              }`}
            >
              <UserIcon className="w-4 h-4" />
              <span>Personal Profile</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('orders')}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-lg text-xs font-semibold transition-colors ${
                activeTab === 'orders'
                  ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
                  : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
              }`}
            >
              <div className="flex items-center gap-3">
                <Package className="w-4 h-4" />
                <span>My Orders</span>
              </div>
              <span className="text-[10px] bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-full font-bold">
                {userOrders.length}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('addresses')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-xs font-semibold transition-colors ${
                activeTab === 'addresses'
                  ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
                  : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
              }`}
            >
              <MapPin className="w-4 h-4" />
              <span>Saved Addresses</span>
            </button>
          </div>
        </aside>

        {/* Tab Content */}
        <main className="lg:col-span-9">
          {/* TAB 1: Profile Details */}
          {activeTab === 'profile' && (
            <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6">
              <h2 className="font-serif text-lg font-bold text-slate-900 dark:text-white mb-1">
                Account Details
              </h2>
              <p className="text-xs text-slate-500 mb-6">
                Update your contact details and default shipping location
              </p>

              <form onSubmit={handleSaveProfile} className="space-y-4 max-w-xl">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs focus:outline-none focus:border-blue-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                    Email Address (Account ID)
                  </label>
                  <input
                    type="email"
                    disabled
                    value={currentUser.email}
                    className="w-full px-3 py-2 bg-slate-100 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-lg text-xs text-slate-500 cursor-not-allowed"
                  />
                  <span className="text-[10px] text-slate-400 mt-1 block">
                    Primary email address cannot be changed directly
                  </span>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+1 (555) 000-0000"
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs focus:outline-none focus:border-blue-600"
                  />
                </div>

                <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white mb-3">
                    Default Shipping Address
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="sm:col-span-2">
                      <label className="block text-xs text-slate-500 mb-1">Street Address</label>
                      <input
                        type="text"
                        value={street}
                        onChange={(e) => setStreet(e.target.value)}
                        className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-slate-500 mb-1">City</label>
                      <input
                        type="text"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs focus:outline-none"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-xs text-slate-500 mb-1">State</label>
                        <input
                          type="text"
                          value={state}
                          onChange={(e) => setState(e.target.value)}
                          className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-slate-500 mb-1">Zip Code</label>
                        <input
                          type="text"
                          value={zipCode}
                          onChange={(e) => setZipCode(e.target.value)}
                          className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs focus:outline-none"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold transition-colors"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* TAB 2: Orders List */}
          {activeTab === 'orders' && (
            <div className="space-y-4">
              <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6">
                <h2 className="font-serif text-lg font-bold text-slate-900 dark:text-white mb-1">
                  My Order History ({userOrders.length})
                </h2>
                <p className="text-xs text-slate-500">
                  Track deliveries and review invoices for your BookNest purchases
                </p>
              </div>

              {userOrders.length === 0 ? (
                <div className="p-8 text-center bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
                  <Package className="w-10 h-10 mx-auto text-slate-300 mb-2" />
                  <p className="text-xs text-slate-500">You haven't placed any orders yet.</p>
                  <button
                    onClick={() => navigate('books')}
                    className="mt-3 px-4 py-2 bg-blue-600 text-white rounded-lg text-xs font-semibold"
                  >
                    Start Browsing
                  </button>
                </div>
              ) : (
                userOrders.map((order) => {
                  const statusColors = {
                    Delivered: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300',
                    Shipped: 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300',
                    Processing: 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300',
                    Pending: 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300',
                    Cancelled: 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300',
                  };

                  return (
                    <div
                      key={order.id}
                      className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 mb-3 border-b border-slate-100 dark:border-slate-800 gap-2">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-mono font-bold text-xs text-slate-900 dark:text-white">
                              Order #{order.id}
                            </span>
                            <span
                              className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                                statusColors[order.status] || 'bg-slate-100 text-slate-800'
                              }`}
                            >
                              {order.status}
                            </span>
                          </div>
                          <span className="text-[11px] text-slate-400">
                            Placed on {new Date(order.createdAt).toLocaleDateString()} · Est. Delivery: {order.estimatedDelivery}
                          </span>
                        </div>

                        <div className="flex items-center gap-3">
                          <span className="text-base font-bold text-slate-900 dark:text-white">
                            ${order.total.toFixed(2)}
                          </span>
                          <button
                            type="button"
                            onClick={() => setViewOrder(order)}
                            className="px-3 py-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-blue-50 dark:hover:bg-blue-950/40 text-blue-600 dark:text-blue-400 rounded-lg text-xs font-semibold transition-colors"
                          >
                            View Invoice / Receipt
                          </button>
                        </div>
                      </div>

                      {/* Items preview */}
                      <div className="flex flex-wrap items-center gap-3">
                        {order.items.map((item, idx) => (
                          <div key={idx} className="flex items-center gap-2 text-xs">
                            <img
                              src={item.coverImage}
                              alt={item.title}
                              className="w-8 h-10 object-cover rounded shadow-xs"
                            />
                            <div className="truncate max-w-[140px]">
                              <span className="font-medium truncate block">{item.title}</span>
                              <span className="text-[10px] text-slate-400">
                                {item.quantity}x (${item.price.toFixed(2)})
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          )}

          {/* TAB 3: Saved Addresses */}
          {activeTab === 'addresses' && (
            <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6">
              <h2 className="font-serif text-lg font-bold text-slate-900 dark:text-white mb-1">
                Saved Shipping Addresses
              </h2>
              <p className="text-xs text-slate-500 mb-6">
                Manage your home, campus, or office delivery destinations
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl border-2 border-blue-600 bg-blue-50/20 dark:bg-blue-950/20 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-bold text-blue-600 uppercase">Primary Home</span>
                      <span className="text-[10px] bg-blue-600 text-white px-2 py-0.5 rounded font-bold">
                        Default
                      </span>
                    </div>
                    <p className="text-xs font-semibold text-slate-900 dark:text-white">{currentUser.name}</p>
                    <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">
                      {street}
                      <br />
                      {city}, {state} {zipCode}
                      <br />
                      United States
                    </p>
                    <p className="text-xs text-slate-500 mt-2">{phone || '+1 (555) 234-5678'}</p>
                  </div>
                </div>

                <div className="p-4 rounded-xl border border-dashed border-slate-300 dark:border-slate-700 flex flex-col items-center justify-center text-center p-6 cursor-pointer hover:border-blue-400">
                  <MapPin className="w-8 h-8 text-slate-400 mb-2" />
                  <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    Add New Address
                  </span>
                  <span className="text-[10px] text-slate-400 mt-1">
                    Add an alternative office or family location
                  </span>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Order Invoice / Receipt Modal */}
      {viewOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 p-6 max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setViewOrder(null)}
              className="absolute top-4 right-4 p-2 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-800"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Receipt Header */}
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-200 dark:border-slate-800">
              <div>
                <span className="font-serif text-xl font-bold text-slate-900 dark:text-white">
                  BookNest Receipt
                </span>
                <span className="block text-xs font-mono text-blue-600 dark:text-blue-400 font-bold mt-0.5">
                  Order #{viewOrder.id}
                </span>
              </div>
              <button
                type="button"
                onClick={handlePrintOrder}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-lg text-xs font-semibold hover:bg-slate-200 transition-colors"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print Invoice</span>
              </button>
            </div>

            {/* Shipping & Order meta */}
            <div className="grid grid-cols-2 gap-4 text-xs mb-6 p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl">
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
                  Shipping Address
                </span>
                <p className="font-semibold text-slate-900 dark:text-white">
                  {viewOrder.shippingAddress.fullName}
                </p>
                <p className="text-slate-600 dark:text-slate-300">
                  {viewOrder.shippingAddress.street}, {viewOrder.shippingAddress.city},{' '}
                  {viewOrder.shippingAddress.state} {viewOrder.shippingAddress.zipCode}
                </p>
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
                  Delivery Details
                </span>
                <p className="text-slate-700 dark:text-slate-300">Method: {viewOrder.shippingMethod}</p>
                <p className="text-slate-700 dark:text-slate-300">Tracking: {viewOrder.trackingNumber}</p>
                <p className="text-slate-700 dark:text-slate-300 font-semibold mt-1">
                  Status: {viewOrder.status}
                </p>
              </div>
            </div>

            {/* Order Items Table */}
            <div className="border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden mb-6 text-xs">
              <table className="w-full text-left">
                <thead className="bg-slate-50 dark:bg-slate-800 text-slate-500 font-semibold">
                  <tr>
                    <th className="p-3">Book Title</th>
                    <th className="p-3">Format</th>
                    <th className="p-3 text-center">Qty</th>
                    <th className="p-3 text-right">Price</th>
                    <th className="p-3 text-right">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {viewOrder.items.map((item, i) => (
                    <tr key={i}>
                      <td className="p-3 font-medium text-slate-900 dark:text-white">
                        {item.title}
                      </td>
                      <td className="p-3 text-slate-500">{item.format}</td>
                      <td className="p-3 text-center">{item.quantity}</td>
                      <td className="p-3 text-right">${item.price.toFixed(2)}</td>
                      <td className="p-3 text-right font-bold">
                        ${(item.price * item.quantity).toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Financial Totals */}
            <div className="max-w-xs ml-auto text-xs space-y-1.5 pb-4">
              <div className="flex justify-between text-slate-500">
                <span>Subtotal:</span>
                <span>${viewOrder.subtotal.toFixed(2)}</span>
              </div>
              {viewOrder.discount > 0 && (
                <div className="flex justify-between text-emerald-600 font-semibold">
                  <span>Discount:</span>
                  <span>-${viewOrder.discount.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between text-slate-500">
                <span>Shipping Fee:</span>
                <span>${viewOrder.shippingFee.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-slate-500">
                <span>Tax (8%):</span>
                <span>${viewOrder.tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-base font-bold text-slate-900 dark:text-white pt-2 border-t border-slate-200 dark:border-slate-800">
                <span>Total Paid:</span>
                <span className="text-blue-600 dark:text-blue-400">
                  ${viewOrder.total.toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
