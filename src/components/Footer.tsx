'use client';

import Link from 'next/link';
import { CONTACT_INFO } from '@/config/contact';
import { motion } from 'framer-motion';
import { Facebook, Instagram, Linkedin, Twitter, Mail, MapPin, Phone, ArrowUpRight, ShieldCheck, Zap, Heart, Sparkles } from 'lucide-react';
import { useTranslations } from '@/hooks/useTranslations';

export default function Footer() {
  const t = useTranslations('Footer');
  const tc = useTranslations('Common');

  return (
    <footer className="bg-[#050505] text-white pt-32 pb-16 rounded-t-[5rem] relative overflow-hidden border-t border-white/5">
      {/* Background Accents */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-amber-600/5 blur-[120px] pointer-events-none rounded-full" />
      <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-amber-600/10 blur-[100px] pointer-events-none rounded-full" />

      <div className="container mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-20 mb-24">
          {/* Brand Identity */}
          <div className="space-y-10">
            <Link href="/" className="flex items-center gap-4 group">
               <div className="w-16 h-16 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center text-white font-black text-3xl shadow-2xl group-hover:rotate-12 transition-all duration-700 relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-amber-700 to-amber-500 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                  <Sparkles className="w-8 h-8 relative z-10 text-amber-500 group-hover:scale-110 transition-transform" />
               </div>
               <div className="flex flex-col">
                  <span className="text-4xl font-black tracking-tighter leading-tight font-heading group-hover:text-amber-500 transition-colors">
                    NET GATE
                  </span>
                  <span className="text-[11px] uppercase tracking-[0.6em] text-amber-500 font-black -mt-1 group-hover:tracking-[0.7em] transition-all">
                    {t('luxuryTack')}
                  </span>
               </div>
            </Link>
            
            <p className="text-gray-400 text-lg leading-relaxed font-medium italic max-w-xs">
              "{t('tagline')}"
            </p>

            <div className="flex gap-4">
               {[
                 { icon: Instagram, href: CONTACT_INFO.social.instagram, label: 'Instagram' },
                 { icon: Twitter, href: CONTACT_INFO.social.twitter, label: 'Twitter' },
                 { icon: Facebook, href: CONTACT_INFO.social.facebook, label: 'Facebook' },
                 { icon: Linkedin, href: CONTACT_INFO.social.linkedin, label: 'LinkedIn' }
               ].map((social, i) => (
                 <a
                   key={i}
                   href={social.href}
                   target="_blank"
                   rel="noopener noreferrer"
                   className="w-12 h-12 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center transition-all duration-500 hover:bg-white hover:text-slate-900 group/icon"
                   aria-label={social.label}
                 >
                   <social.icon className="w-5 h-5 group-hover/icon:scale-110 transition-transform" />
                 </a>
               ))}
            </div>
          </div>

          {/* Curated Collections */}
          <div>
            <h3 className="text-[10px] font-black uppercase tracking-[0.5em] text-gray-500 mb-10">{t('shopTitle')}</h3>
            <ul className="space-y-6">
              {[
                { name: t('shopAll'), href: '/products' },
                { name: t('shopFeatured'), href: '/products?featured=true' },
                { name: t('shopNew'), href: '/products?sort=newest' },
                { name: tc('discoverMore'), href: '/products', highlight: true }
              ].map((link, i) => (
                <li key={i}>
                  <Link 
                    href={link.href} 
                    className={`group flex items-center justify-between text-sm font-black transition-all ${
                      link.highlight ? 'text-amber-500 hover:text-white' : 'text-gray-300 hover:text-white'
                    }`}
                  >
                    <span>{link.name}</span>
                    <ArrowUpRight className="w-4 h-4 opacity-0 -translate-y-1 translate-x-1 group-hover:opacity-100 group-hover:translate-y-0 group-hover:translate-x-0 transition-all" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Client Support */}
          <div>
            <h3 className="text-[10px] font-black uppercase tracking-[0.5em] text-gray-500 mb-10">{t('supportTitle')}</h3>
            <ul className="space-y-6">
              {[
                { name: t('supportFAQ'), href: '/faq' },
                { name: t('supportShipping'), href: '/shipping' },
                { name: t('supportReturns'), href: '/returns' },
                { name: t('contactTitle'), href: '/contact' }
              ].map((link, i) => (
                <li key={i}>
                  <Link 
                    href={link.href} 
                    className="group flex items-center justify-between text-sm font-black text-gray-300 hover:text-white transition-all underline-offset-8 decoration-white/20 hover:underline"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Details */}
          <div>
            <h3 className="text-[10px] font-black uppercase tracking-[0.5em] text-gray-500 mb-10">{t('contactTitle')}</h3>
            <div className="space-y-6">
              <a 
                href={`mailto:${CONTACT_INFO.email}`}
                className="group flex items-center gap-5 bg-white/[0.03] border border-white/5 p-6 rounded-3xl hover:bg-white/5 hover:border-white/10 transition-all duration-500"
              >
                <div className="w-12 h-12 bg-amber-500/10 rounded-2xl flex items-center justify-center text-amber-500 group-hover:bg-amber-600 group-hover:text-white transition-all">
                  <Mail className="w-5 h-5" />
                </div>
                <div className="flex flex-col">
                  <span className="text-[9px] uppercase font-black text-gray-500 tracking-widest">{t('clientService')}</span>
                  <span className="text-sm font-black text-gray-100 truncate max-w-[150px]">{CONTACT_INFO.email}</span>
                </div>
              </a>
              
              <div className="group flex items-center gap-5 bg-white/[0.03] border border-white/5 p-6 rounded-3xl cursor-default">
                 <div className="w-12 h-12 bg-amber-500/10 rounded-2xl flex items-center justify-center text-amber-500">
                   <Phone className="w-5 h-5" />
                 </div>
                 <div className="flex flex-col">
                   <span className="text-[9px] uppercase font-black text-gray-500 tracking-widest">{t('contactPhone')}</span>
                   <span className="text-sm font-black text-gray-100">{CONTACT_INFO.phone}</span>
                 </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="pt-12 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-10">
          <div className="flex flex-col gap-2">
            <p className="text-[11px] font-black uppercase tracking-[0.3em] text-gray-500">
              {t('copyright', { year: new Date().getFullYear() })}
            </p>
            <div className="flex items-center gap-6 mt-2">
               <div className="flex items-center gap-2 text-[10px] font-bold text-gray-600">
                  <ShieldCheck className="w-3 h-3 text-emerald-500" />
                  {t('verifiedMerchant')}
               </div>
               <div className="flex items-center gap-2 text-[10px] font-bold text-gray-600">
                  <Zap className="w-3 h-3 text-yellow-500" />
                  {t('fastShipping')}
               </div>
            </div>
          </div>

          <div className="flex items-center gap-8">
            <img src="https://img.icons8.com/color/48/visa.png" alt="Visa" className="h-6 grayscale opacity-30 hover:grayscale-0 hover:opacity-100 transition-all cursor-pointer" />
            <img src="https://img.icons8.com/color/48/mastercard.png" alt="Mastercard" className="h-6 grayscale opacity-30 hover:grayscale-0 hover:opacity-100 transition-all cursor-pointer" />
            <img src="https://img.icons8.com/color/48/apple-pay.png" alt="Apple Pay" className="h-8 grayscale opacity-30 hover:grayscale-0 hover:opacity-100 transition-all cursor-pointer" />
            <img src="https://img.icons8.com/color/48/paypal.png" alt="Paypal" className="h-6 grayscale opacity-30 hover:grayscale-0 hover:opacity-100 transition-all cursor-pointer" />
          </div>

          <div className="flex items-center gap-2 text-[11px] font-black uppercase tracking-[0.2em] text-gray-500">
            {t('madeBy')} <Heart className="w-3 h-3 text-rose-500 fill-rose-500 animate-pulse" />
          </div>
        </div>
      </div>
    </footer>
  );
}

