'use client';

import { submitContactForm } from './actions';
import { useActionState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { Send, MapPin, Mail, Phone, MessageSquare, Sparkles, CheckCircle2 } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

function ContactForm() {
  const [state, formAction, isPending] = useActionState(submitContactForm, null);
  const searchParams = useSearchParams();
  const product = searchParams.get('product');

  const defaultMessage = product
    ? `I am interested in the product: ${product}. Please provide more details.`
    : '';

  return (
    <div className="py-24 md:py-40 bg-[#fafafa]">
      <div className="container mx-auto px-6">
        <div className="max-w-6xl mx-auto flex flex-col lg:flex-row gap-24 xl:gap-32">
          
          {/* Left Column: Direct Info */}
          <div className="lg:w-2/5">
             <div className="flex items-center gap-3 mb-8">
                <div className="w-10 h-[1px] bg-amber-200"></div>
                <span className="text-amber-900 font-black text-[10px] uppercase tracking-[0.5em]">Concierge Service</span>
             </div>
             <h1 className="text-6xl md:text-8xl font-black text-slate-950 tracking-[-0.04em] leading-[0.9] mb-12 font-heading">
                Let's start <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-700 to-amber-500 font-heading">the dialogue.</span>
             </h1>
             <p className="text-gray-400 text-xl font-medium leading-relaxed mb-16 max-w-md">
                Our dedicated support team is here to assist you with bespoke requests, order tracking, or partnership inquiries.
             </p>

             <div className="space-y-10">
                {[
                  { icon: MapPin, label: 'Regional Presence', val: 'India', color: 'text-amber-700' },
                  { icon: Mail, label: 'Direct Inquiry', val: 'ksaifullah680@gmail.com', color: 'text-amber-600' }
                ].map((item, i) => (
                  <div key={i} className="flex gap-6 items-center group">
                    <div className="w-16 h-16 rounded-[2rem] bg-white border border-gray-100 shadow-sm flex items-center justify-center transition-all duration-500 group-hover:bg-amber-950 group-hover:text-white group-hover:scale-110">
                       <item.icon size={24} className={cn("transition-colors duration-500", item.color, "group-hover:text-white")} />
                    </div>
                    <div className="flex flex-col gap-1">
                       <span className="text-[9px] font-black uppercase tracking-widest text-gray-400">{item.label}</span>
                       <span className="text-lg font-black text-slate-950">{item.val}</span>
                    </div>
                  </div>
                ))}
             </div>

          </div>

          {/* Right Column: Premium Form */}
          <div className="lg:w-3/5">
            <div className="bg-white p-12 md:p-16 rounded-[4rem] border border-gray-100 shadow-[0_50px_100px_-20px_rgba(0,0,0,0.1)] relative overflow-hidden">
               <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none">
                  <Sparkles size={120} />
               </div>
               
              {state?.success ? (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-20"
                >
                  <div className="w-28 h-28 bg-emerald-50 rounded-[2.5rem] flex items-center justify-center mx-auto mb-10 border border-emerald-100">
                    <CheckCircle2 size={48} className="text-emerald-500" />
                  </div>
                  <h2 className="text-4xl md:text-5xl font-black text-slate-950 mb-6 tracking-tighter font-heading">Protocol Successful</h2>
                  <p className="text-gray-400 text-lg font-medium mb-12 max-w-sm mx-auto leading-relaxed">
                    Your transmission has been logged. A representative will reach out to you within the next 24 business hours.
                  </p>
                  <button
                    onClick={() => window.location.reload()}
                    className="group flex items-center gap-4 bg-slate-950 text-white px-12 py-6 rounded-2xl font-black text-sm hover:bg-amber-600 transition-all shadow-2xl mx-auto uppercase tracking-widest"
                  >
                    Send Another Transmission
                    <Send size={18} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                  </button>
                </motion.div>
              ) : (
                <form action={formAction} className="space-y-10 relative z-10">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                    <div className="flex flex-col gap-3 group">
                       <label htmlFor="name" className="text-[10px] font-black uppercase tracking-[0.3em] text-stone-400 pl-2 group-focus-within:text-amber-600 transition-colors">Client Signature</label>
                       <div className="relative">
                          <input
                            type="text"
                            id="name"
                            name="name"
                            required
                            className="w-full px-8 py-5 bg-stone-50 border border-transparent rounded-[2rem] focus:bg-white focus:ring-4 focus:ring-amber-600/5 focus:border-amber-600 transition-all duration-500 outline-none font-black text-slate-950 text-sm placeholder:text-stone-300"
                            placeholder="Full Legal Name"
                          />
                       </div>
                    </div>
                    <div className="flex flex-col gap-3 group">
                       <label htmlFor="email" className="text-[10px] font-black uppercase tracking-[0.3em] text-stone-400 pl-2 group-focus-within:text-amber-600 transition-colors">Transmission Node</label>
                       <div className="relative">
                          <input
                            type="email"
                            id="email"
                            name="email"
                            required
                            className="w-full px-8 py-5 bg-stone-50 border border-transparent rounded-[2rem] focus:bg-white focus:ring-4 focus:ring-amber-600/5 focus:border-amber-600 transition-all duration-500 outline-none font-black text-slate-950 text-sm placeholder:text-stone-300"
                            placeholder="Email Address"
                          />
                       </div>
                    </div>
                  </div>



                  <div className="flex flex-col gap-3 group">
                     <label htmlFor="message" className="text-[10px] font-black uppercase tracking-[0.3em] text-stone-400 pl-2 group-focus-within:text-amber-600 transition-colors">Inquiry Specification</label>
                     <div className="relative">
                        <textarea
                          id="message"
                          name="message"
                          required
                          rows={6}
                          defaultValue={defaultMessage}
                          className="w-full px-8 py-6 bg-stone-50 border border-transparent rounded-[2.5rem] focus:bg-white focus:ring-4 focus:ring-amber-600/5 focus:border-amber-600 transition-all duration-500 outline-none font-black text-slate-950 text-sm placeholder:text-stone-300 resize-none"
                          placeholder="Please elaborate on your requirements..."
                        />
                         <MessageSquare className="absolute right-8 bottom-8 text-stone-100 group-focus-within:text-amber-100 transition-colors" size={40} />
                     </div>
                  </div>

                  {state?.error && (
                    <motion.div 
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="bg-rose-50 border border-rose-100 text-rose-600 px-8 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-sm"
                    >
                      Protocol Error: {state.error}
                    </motion.div>
                  )}

                  <button
                    type="submit"
                    disabled={isPending}
                    className="w-full flex items-center justify-between bg-slate-950 text-white p-8 rounded-[2.5rem] font-black text-xl hover:bg-amber-600 transition-all duration-700 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.3)] disabled:opacity-50 disabled:cursor-not-allowed group"
                  >
                    <span>{isPending ? 'Propagating Transmission...' : 'Transmit Inquiry'}</span>
                    <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center group-hover:bg-white group-hover:text-amber-700 transition-all">
                       <Send size={24} className={cn("transition-transform duration-500", isPending ? "animate-pulse" : "group-hover:translate-x-1 group-hover:-translate-y-1")} />
                    </div>
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ContactClient() {
  return (
    <Suspense fallback={
       <div className="min-h-screen flex items-center justify-center bg-[#fafafa]">
          <div className="w-12 h-12 border-4 border-slate-950 border-t-transparent rounded-full animate-spin" />
       </div>
    }>
      <ContactForm />
    </Suspense>
  );
}
