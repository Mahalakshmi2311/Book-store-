import React, { useState } from 'react';
import { Mail, Phone, MapPin, Clock, Send, ChevronDown, CheckCircle2 } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const ContactPage: React.FC = () => {
  const { addToast } = useApp();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('Order Question');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  // FAQ accordion state
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !message.trim()) {
      addToast('Please fill out all required fields', 'error');
      return;
    }
    setSubmitted(true);
    addToast('Your inquiry has been sent to our customer care team!', 'success');
  };

  const faqs = [
    {
      q: 'How fast is standard shipping and how do I qualify for free delivery?',
      a: 'All orders containing $35 or more in books qualify for free standard ground delivery (3-5 business days) anywhere across the United States. We also offer 2-Day Air ($9.99) and Overnight Air ($19.99) options at checkout.',
    },
    {
      q: 'What is your 30-Day return and refund policy?',
      a: 'If you are unsatisfied with your books or if a volume arrives with any print defect or transit damage, you can request a return within 30 days of delivery. We provide a prepaid shipping return label and issue a full refund to your original payment method.',
    },
    {
      q: 'Are your computer science and academic textbooks genuine original prints?',
      a: 'Yes, 100%. All textbooks, algorithm manuals, and technical references are authentic publisher editions sourced directly from authorized academic presses such as MIT Press, Pearson, McGraw Hill, and O’Reilly Media.',
    },
    {
      q: 'How do I use a promo code like NEST15?',
      a: 'During checkout or inside your shopping cart drawer, enter your promotional code (e.g. NEST15 for 15% off) into the "Have a Promo Code?" box and click Apply. The discount is calculated immediately on your eligible subtotal.',
    },
    {
      q: 'Can I purchase books in bulk for a book club or classroom?',
      a: 'Absolutely! For orders of 10 or more copies of the same title, our institutional sales team provides custom volume discounts. Simply send us a message through this contact form selecting "Wholesale & Bulk Orders".',
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto mb-12">
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white mb-2">
          We’re Here to Help Readers &amp; Authors
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
          Have a question about an existing order, looking for a book recommendation, or want to discuss an event? Get in touch with our team.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-16">
        {/* Contact Form */}
        <div className="lg:col-span-7 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-xs">
          <h2 className="font-serif text-xl font-bold text-slate-900 dark:text-white mb-1">
            Send Us a Message
          </h2>
          <p className="text-xs text-slate-500 mb-6">
            We typically reply within 2 to 4 hours during business days.
          </p>

          {submitted ? (
            <div className="p-8 text-center bg-emerald-50 dark:bg-emerald-950/40 rounded-xl border border-emerald-200 dark:border-emerald-800">
              <CheckCircle2 className="w-12 h-12 text-emerald-600 dark:text-emerald-400 mx-auto mb-3" />
              <h3 className="font-serif text-lg font-bold text-emerald-900 dark:text-emerald-200 mb-1">
                Message Received!
              </h3>
              <p className="text-xs text-emerald-800 dark:text-emerald-300 max-w-sm mx-auto mb-4">
                Thank you, {name}. A member of our reader support team has been assigned to your inquiry and will follow up shortly at {email}.
              </p>
              <button
                type="button"
                onClick={() => {
                  setSubmitted(false);
                  setMessage('');
                }}
                className="px-4 py-2 bg-emerald-600 text-white rounded-lg text-xs font-semibold hover:bg-emerald-700"
              >
                Send Another Message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                    Your Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Jordan Lee"
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs focus:outline-none focus:border-blue-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="jordan@example.com"
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs focus:outline-none focus:border-blue-600"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Inquiry Topic
                </label>
                <select
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs focus:outline-none focus:border-blue-600"
                >
                  <option value="Order Question">Order Inquiry &amp; Tracking</option>
                  <option value="Book Recommendation">Book Recommendations</option>
                  <option value="Wholesale & Bulk Orders">Wholesale &amp; Bulk Orders</option>
                  <option value="Author & Publisher Submissions">Author &amp; Publisher Submissions</option>
                  <option value="Other">General Feedback</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  How can we help? *
                </label>
                <textarea
                  required
                  rows={5}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Provide any details about your question, book title, or order reference..."
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs focus:outline-none focus:border-blue-600"
                />
              </div>

              <button
                type="submit"
                className="w-full sm:w-auto px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-md shadow-blue-500/20 flex items-center justify-center gap-2 transition-colors"
              >
                <span>Send Message</span>
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>
          )}
        </div>

        {/* Contact Info & Location */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs">
            <h3 className="font-serif text-lg font-bold text-slate-900 dark:text-white mb-4">
              Bookstore Contacts
            </h3>

            <div className="space-y-4 text-xs">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-900/30 text-blue-600 flex items-center justify-center shrink-0">
                  <MapPin className="w-4 h-4" />
                </div>
                <div>
                  <strong className="block text-slate-900 dark:text-white">Flagship Store Location</strong>
                  <p className="text-slate-600 dark:text-slate-400 mt-0.5">
                    450 University Avenue, Suite 100<br />
                    Palo Alto, CA 94301, USA
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-900/30 text-blue-600 flex items-center justify-center shrink-0">
                  <Mail className="w-4 h-4" />
                </div>
                <div>
                  <strong className="block text-slate-900 dark:text-white">Email Inquiries</strong>
                  <p className="text-slate-600 dark:text-slate-400 mt-0.5">
                    Customer Support: support@booknest.com<br />
                    Editorial Desk: editorial@booknest.com
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-900/30 text-blue-600 flex items-center justify-center shrink-0">
                  <Phone className="w-4 h-4" />
                </div>
                <div>
                  <strong className="block text-slate-900 dark:text-white">Direct Hotline</strong>
                  <p className="text-slate-600 dark:text-slate-400 mt-0.5">
                    +1 (800) 555-NEST (Toll-Free)<br />
                    Mon - Sat: 9:00 AM - 9:00 PM PST
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-900/30 text-blue-600 flex items-center justify-center shrink-0">
                  <Clock className="w-4 h-4" />
                </div>
                <div>
                  <strong className="block text-slate-900 dark:text-white">Store Hours</strong>
                  <p className="text-slate-600 dark:text-slate-400 mt-0.5">
                    Monday - Saturday: 9:00 AM - 9:00 PM<br />
                    Sunday: 10:00 AM - 6:00 PM
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Interactive Map Visual */}
          <div className="rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-800 h-52 relative">
            <img
              src="https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?auto=format&fit=crop&w=800&q=80"
              alt="Map view"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
              <div className="bg-white/95 dark:bg-slate-900/95 p-3 rounded-xl shadow-lg text-center max-w-xs">
                <MapPin className="w-5 h-5 text-blue-600 mx-auto mb-1" />
                <div className="font-serif font-bold text-xs text-slate-900 dark:text-white">
                  BookNest Palo Alto Flagship
                </div>
                <div className="text-[10px] text-slate-500">450 University Ave, Palo Alto, CA</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <section className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h2 className="font-serif text-2xl font-bold text-slate-900 dark:text-white mb-1">
            Frequently Asked Questions
          </h2>
          <p className="text-xs text-slate-500">
            Quick answers to our most common customer service questions
          </p>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, index) => {
            const isOpen = openFaq === index;
            return (
              <div
                key={index}
                className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden"
              >
                <button
                  type="button"
                  onClick={() => setOpenFaq(isOpen ? null : index)}
                  className="w-full p-4 text-left flex items-center justify-between text-xs font-bold text-slate-900 dark:text-white hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                >
                  <span>{faq.q}</span>
                  <ChevronDown
                    className={`w-4 h-4 text-slate-400 transition-transform ${
                      isOpen ? 'rotate-180 text-blue-600' : ''
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="px-4 pb-4 text-xs text-slate-600 dark:text-slate-400 leading-relaxed border-t border-slate-100 dark:border-slate-800/60 pt-3">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
};
