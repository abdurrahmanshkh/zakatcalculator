'use client';

import React, { useEffect, useMemo, useState } from 'react';
import {
  Calculator,
  Coins,
  CreditCard,
  Info,
  ChevronDown,
  ChevronUp,
  Wallet,
  Gem,
  Briefcase,
  TrendingUp,
  Download,
  Phone,
  MessageCircle,
  Mail,
  MapPin,
  Globe,
  ExternalLink,
  HandHeart,
  ArrowRight,
  Home,
  Heart,
  GraduationCap,
} from 'lucide-react';

/**
 * Types
 */
type FiqhType = 'hanafi' | 'shafii' | 'maliki' | 'hanbali' | 'unspecified';

interface Sections {
  cash: boolean;
  gold: boolean;
  business: boolean;
  investments: boolean;
  liabilities: boolean;
}

interface Assets {
  cashInHand: number;
  bankDeposit: number;
  digitalWallets: number;
  goldItems: Array<{ karat: number; grams: number }>;
  goldJewelryUsage: boolean;
  silverGrams: number;
  businessStock: number;
  businessCash: number;
  receivables: number;
  stocksValue: number;
  cryptoValue: number;
}

interface Liabilities {
  immediateDebts: number;
}

/**
 * Presentational components with explicit props
 */

const Card: React.FC<React.PropsWithChildren<{ className?: string }>> = ({
  children,
  className = '',
}) => (
  <div
    className={`bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden ${className}`}
  >
    {children}
  </div>
);

type IconProps = {
  size?: number;
  className?: string;
};

interface SectionHeaderProps {
  icon: React.ComponentType<IconProps>;
  title: string;
  isOpen: boolean;
  toggle: () => void;
  total: number;
  currency: string;
}
const SectionHeader: React.FC<SectionHeaderProps> = ({
  icon: Icon,
  title,
  isOpen,
  toggle,
  total,
  currency,
}) => (
  <button
    onClick={toggle}
    className="w-full flex items-center justify-between p-4 bg-slate-50 hover:bg-slate-100 transition-colors border-b border-slate-100 no-print cursor-pointer"
  >
    <div className="flex items-center gap-3">
      <div className="p-2 bg-emerald-100 text-emerald-700 rounded-lg">
        <Icon size={20} />
      </div>
      <h3 className="font-semibold text-slate-800 text-left">{title}</h3>
    </div>
    <div className="flex items-center gap-4">
      {total > 0 && (
        <span className="text-sm font-medium text-emerald-600">
          {currency}{' '}
          {total.toLocaleString(undefined, {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}
        </span>
      )}
      {isOpen ? (
        <ChevronUp size={18} className="text-slate-400" />
      ) : (
        <ChevronDown size={18} className="text-slate-400" />
      )}
    </div>
  </button>
);

interface InputGroupProps {
  label: string;
  sublabel?: string;
  value: number;
  onChange: (v: number) => void;
  placeholder?: string;
  tooltip?: string;
  currencySymbol?: string;
}
const InputGroup: React.FC<InputGroupProps> = ({
  label,
  sublabel,
  value,
  onChange,
  placeholder = '0.00',
  tooltip,
  currencySymbol = '',
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const parsed = parseFloat(e.target.value);
    onChange(Number.isFinite(parsed) ? parsed : 0);
  };

  return (
    <div className="mb-4 break-inside-avoid">
      <div className="flex items-center gap-2 mb-1.5">
        <label className="block text-sm font-medium text-slate-700">{label}</label>
        {tooltip && (
          <div className="group relative no-print">
            <Info size={14} className="text-slate-400 cursor-help" />
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 p-2 bg-slate-800 text-white text-xs rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
              {tooltip}
            </div>
          </div>
        )}
      </div>
      {sublabel && <p className="text-xs text-slate-500 mb-2">{sublabel}</p>}
      <div className="relative">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-medium">
          {currencySymbol}
        </span>
        <input
          type="number"
          min="0"
          value={value || ''}
          onChange={handleChange}
          className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
          placeholder={placeholder}
        />
      </div>
    </div>
  );
};

interface ToggleProps {
  label: string;
  active: boolean;
  onToggle: (v: boolean) => void;
  tooltip?: string;
}
const Toggle: React.FC<ToggleProps> = ({ label, active, onToggle, tooltip }) => (
  <div className="flex items-center justify-between mb-4 break-inside-avoid">
    <div className="flex items-center gap-2 flex-1 min-w-0">
      <span className="text-sm font-medium text-slate-700">{label}</span>
      {tooltip && (
        <div className="group relative no-print">
          <Info size={14} className="text-slate-400 cursor-help mr-6" />
          <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 p-2 bg-slate-800 text-white text-xs rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
            {tooltip}
          </div>
        </div>
      )}
    </div>
    <button
      onClick={() => onToggle(!active)}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 no-print cursor-pointer ${
        active ? 'bg-emerald-600' : 'bg-slate-200'
      }`}
    >
      <span
        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
          active ? 'translate-x-6' : 'translate-x-1'
        }`}
      />
    </button>
    {/* Text fallback for print view */}
    <span className="hidden print:block text-sm font-bold">{active ? 'Yes' : 'No'}</span>
  </div>
);

// ---------- ShareCard component ----------
const Icons = {
  X: (props: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z" />
    </svg>
  ),
  Facebook: (props: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
  ),
  LinkedIn: (props: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  ),
  WhatsApp: (props: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
    </svg>
  ),
  Copy: (props: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
    </svg>
  ),
  Check: (props: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <polyline points="20 6 9 17 4 12" />
    </svg>
  ),
  Share: (props: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <circle cx="18" cy="5" r="3" />
      <circle cx="6" cy="12" r="3" />
      <circle cx="18" cy="19" r="3" />
      <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
      <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
    </svg>
  )
};

const ShareCard: React.FC = () => {
  const [copied, setCopied] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const id = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(id);
  }, []);

  // Prevent hydration mismatch by checking mount
  if (!mounted) return null;
  
  const pageUrl = 'https://myzakat.vercel.app';
  const shareText = encodeURIComponent(
    'Discover the Zakat Calculator — an accurate, privacy-first tool to estimate your Zakat. Select your School of Thought, enter assets & liabilities, get a clear breakdown and printable report. No data leaves your device — try it now:'
  );
  
  const whatsappShareText = encodeURIComponent(
    "*Zakat Calculator* — Accurate & Private Tool\n\n" +
    "Calculate your Zakat easily:\n" +
    "- Choose your School of Thought\n" +
    "- Enter assets & liabilities\n" +
    "- Get a clear breakdown + printable report\n\n" +
    "Try it now:"
  );

  const shareUrlEncoded = encodeURIComponent(pageUrl);

  const handleCopy = async () => {
    try {
      if (navigator?.clipboard?.writeText) {
        await navigator.clipboard.writeText(pageUrl);
      } else {
        const input = document.createElement('input');
        input.value = pageUrl;
        document.body.appendChild(input);
        input.select();
        document.execCommand('copy');
        document.body.removeChild(input);
      }
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const openWindow = (url: string) => {
    window.open(url, '_blank', 'noopener,noreferrer,width=600,height=600');
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Zakat Calculator',
          text: 'Discover the Zakat Calculator — an accurate, privacy-first tool to estimate your Zakat. Select your School of Thought, enter assets & liabilities, get a clear breakdown and printable report. No data leaves your device — try it now:',
          url: pageUrl,
        });
      } catch {
        /* user cancelled */
      }
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg border border-slate-100 p-6 max-w-md w-full mx-auto">
      {/* Header Section */}
      <div className="flex items-start justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-linear-to-br from-emerald-50 to-emerald-100 rounded-lg text-emerald-700 shadow-sm border border-emerald-200/50">
            <Icons.Share className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-base font-bold text-slate-800 leading-tight">Share this tool</h4>
            <p className="text-sm text-slate-500 mt-0.5">Help others calculate correctly.</p>
          </div>
        </div>

        {mounted && typeof navigator !== "undefined" && "share" in navigator && (
          <button
            onClick={handleNativeShare}
            className="md:hidden text-slate-400 hover:text-slate-600 p-2 cursor-pointer"
            aria-label="Native Share"
          >
            <Icons.Share className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Copy Link Input Section */}
      <div className="relative flex items-center mb-6 group">
        <div className="absolute left-3 text-slate-400">
           <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"></path></svg>
        </div>
        <input 
          type="text" 
          readOnly 
          value={pageUrl} 
          className="w-full pl-9 pr-24 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-lg text-slate-600 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
        />
        <button
          onClick={handleCopy}
          className={`absolute right-1.5 top-1.5 bottom-1.5 px-3 rounded-md text-xs font-medium transition-all duration-200 flex items-center gap-1.5 cursor-pointer
            ${copied 
              ? 'bg-emerald-100 text-emerald-700 shadow-none' 
              : 'bg-white shadow-sm border border-slate-200 text-slate-700 hover:text-emerald-700 hover:border-emerald-300'
            }`}
        >
          {copied ? <Icons.Check className="w-3.5 h-3.5" /> : <Icons.Copy className="w-3.5 h-3.5" />}
          {copied ? 'Copied' : 'Copy'}
        </button>
      </div>

      <div className="h-px bg-slate-100 w-full mb-5"></div>

      {/* Social Buttons Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-2 gap-2">

        <SocialButton
          onClick={() => openWindow(`https://wa.me/?text=${encodeURIComponent(`${decodeURIComponent(whatsappShareText)} ${pageUrl}`)}`)}
          icon={<Icons.WhatsApp className="w-4 h-4" />}
          label="WhatsApp"
          colorClass="bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border-emerald-100"
        />

        <SocialButton
          onClick={() => openWindow(`https://www.facebook.com/sharer/sharer.php?u=${shareUrlEncoded}`)}
          icon={<Icons.Facebook className="w-4 h-4" />}
          label="Facebook"
          colorClass="bg-blue-50 text-blue-700 hover:bg-blue-100 border-blue-100"
        />

        <SocialButton
          onClick={() => openWindow(`https://twitter.com/intent/tweet?text=${shareText}&url=${shareUrlEncoded}`)}
          icon={<Icons.X className="w-4 h-4" />}
          label="Post"
          colorClass="bg-slate-50 text-slate-700 hover:bg-slate-100 border-slate-200"
        />

        <SocialButton
          onClick={() => openWindow(`https://www.linkedin.com/shareArticle?mini=true&url=${shareUrlEncoded}&title=${shareText}`)}
          icon={<Icons.LinkedIn className="w-4 h-4" />}
          label="LinkedIn"
          colorClass="bg-indigo-50 text-indigo-700 hover:bg-indigo-100 border-indigo-100"
        />

      </div>
    </div>
  );
};

// Extracted button component for cleaner JSX
const SocialButton: React.FC<{ onClick: () => void; icon: React.ReactNode; label: string; colorClass: string }> = ({ 
  onClick, icon, label, colorClass 
}) => (
  <button
    onClick={onClick}
    className={`flex items-center justify-center gap-2.5 px-3 py-2.5 rounded-lg border transition-all duration-200 group cursor-pointer ${colorClass}`}
    title={`Share on ${label}`}
  >
    <span className="shrink-0 transition-transform group-hover:scale-110">{icon}</span>
    <span className="text-xs font-semibold">{label}</span>
  </button>
);

/**
 * Donation Stats Card – Always visible, links to Il An Noor Foundation
 */
const PayZakatCard: React.FC<{ zakatAmount: number; currency: string; currencySymbol: string }> = ({
  zakatAmount,
  currencySymbol,
}) => {
  const stats = [
    { label: 'Total Funds Donated', amount: 1870381, icon: Coins },
    { label: 'Ration & Shelter', amount: 1320962, icon: Home },
    { label: 'Medical Aid', amount: 424138, icon: Heart },
    { label: 'Education Aid', amount: 117581, icon: GraduationCap },
  ];

  const formatAmount = (amt: number) => {
    return amt.toLocaleString(undefined, { maximumFractionDigits: 0 });
  };

  let paymentUrl = "https://www.ilannoor.org/payments";

  if (zakatAmount > 0) {
    paymentUrl = `https://www.ilannoor.org/payments?type=zakat&amount=${Math.floor(zakatAmount)}`;
  }

  return (
    <div className="bg-white rounded-xl shadow-lg border border-emerald-200 overflow-hidden relative">
      {/* Decorative gradients */}
      <div className="absolute top-0 right-0 w-40 h-40 bg-emerald-200 rounded-full blur-3xl opacity-30 -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-40 h-40 bg-amber-200 rounded-full blur-3xl opacity-20 translate-y-1/2 -translate-x-1/2" />

      <div className="relative p-6">
        {/* Header with Foundation link */}
        <div className="flex items-center gap-3 mb-5">
          <div className="p-3 bg-linear-to-br from-emerald-600 to-emerald-700 rounded-xl shadow-md">
            <HandHeart className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900">
              <div>Donate Zakat now to</div>
              <a 
                href="https://www.ilannoor.org/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="hover:text-emerald-700 transition-colors underline"
              >
                Il An Noor Foundation
              </a>
            </h3>
            <p className="text-sm text-slate-500">100% reaches the most needy</p>
          </div>
        </div>

        {/* Impact Stats Grid */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          {stats.map((stat, idx) => (
            <div key={idx} className="bg-slate-50 rounded-lg p-3 border border-slate-100">
              <div className="flex items-center gap-2 mb-1">
                <stat.icon className="w-4 h-4 text-emerald-600" />
                <span className="text-xs text-slate-500">{stat.label}</span>
              </div>
              <p className="text-lg font-bold text-slate-800">
                {currencySymbol}
                {formatAmount(stat.amount)}
              </p>
            </div>
          ))}
        </div>

        {/* Conditional Zakat Due & CTA */}
        <div className="bg-linear-to-r from-emerald-50 to-emerald-100/50 rounded-xl p-5 mb-2 border border-emerald-200">
          {zakatAmount > 0 && (
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-emerald-800">Your Zakat Due</span>
              <span className="text-2xl font-bold text-emerald-700">
                {currencySymbol}
                {formatAmount(zakatAmount)}
              </span>
            </div>
          )}
          <p className="text-xs text-emerald-700 mb-4">
            Help us continue our work – every contribution changes lives.
          </p>
          <a
            href={paymentUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 w-full bg-emerald-700 hover:bg-emerald-800 text-white font-semibold py-3.5 px-4 rounded-xl transition-all shadow-md hover:shadow-lg"
          >
            {zakatAmount > 0 ? 'Pay Zakat Now ' : 'Donate Now'}<ArrowRight className="w-4 h-4" />
          </a>
        </div>

        <p className="text-xs text-center text-slate-400 mt-2">
          You&apos;ll be redirected to our secure payment page.
        </p>
      </div>
    </div>
  );
};

/**
 * Page component
 */
export default function App(): React.ReactElement {
  // --- State Management ---
  const [fiqh, setFiqh] = useState<FiqhType>('hanafi');

  // Currency State
  const [currency, setCurrency] = useState<string>('INR');

  // Precious Metal Prices (Defaults per gram in INR)
  const [goldPrice, setGoldPrice] = useState<number>(15505.72);
  const [silverPrice, setSilverPrice] = useState<number>(255.89);

  // Expanded open/close state for sections
  const [sections, setSections] = useState<Sections>({
    cash: true,
    gold: true,
    business: true,
    investments: true,
    liabilities: true,
  });

  // Assets Data
  const [assets, setAssets] = useState<Assets>({
    cashInHand: 0,
    bankDeposit: 0,
    digitalWallets: 0,
    goldItems: [{ karat: 24, grams: 0 }],
    goldJewelryUsage: true,
    silverGrams: 0,
    businessStock: 0,
    businessCash: 0,
    receivables: 0,
    stocksValue: 0,
    cryptoValue: 0,
  });

  // Liabilities Data
  const [liabilities, setLiabilities] = useState<Liabilities>({
    immediateDebts: 0,
  });

  // --- Effects ---

  // Update Symbol when currency changes
  const currencySymbol =
    {
      INR: '₹',
      USD: '$',
      GBP: '£',
      EUR: '€',
      AED: 'د.إ',
      SAR: '﷼',
    }[currency] || '$';

  // --- Logic & Calculations ---

  const toggleSection = (key: keyof Sections) => {
    setSections((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  // Helper to update gold items
  function updateGoldItem(index: number, field: 'karat' | 'grams', value: number) {
    setAssets(prev => {
      const newItems = [...prev.goldItems];
      newItems[index] = { ...newItems[index], [field]: value };
      return { ...prev, goldItems: newItems };
    });
  }

  function addGoldItem() {
    setAssets(prev => ({
      ...prev,
      goldItems: [...prev.goldItems, { karat: 24, grams: 0 }]
    }));
  }

  function removeGoldItem(index: number) {
    setAssets(prev => ({
      ...prev,
      goldItems: prev.goldItems.filter((_, i) => i !== index)
    }));
  }

  // generic typed updateAsset that maintains correct asset value types
  function updateAsset<K extends keyof Assets>(key: K, value: Assets[K]) {
    setAssets((prev) => ({ ...prev, [key]: value }));
  }
  function updateLiability<K extends keyof Liabilities>(key: K, value: Liabilities[K]) {
    setLiabilities((prev) => ({ ...prev, [key]: value }));
  }

  // --- Memoized raw values (before exemption) ---
  const rawGoldValue = useMemo(() => {
    return assets.goldItems.reduce(
      (sum, item) => sum + item.grams * goldPrice * (item.karat / 24),
      0
    );
  }, [assets.goldItems, goldPrice]);

  const rawSilverValue = useMemo(() => {
    return assets.silverGrams * silverPrice;
  }, [assets.silverGrams, silverPrice]);

  // --- Exempted values (apply jewelry rule) ---
  const goldValue = useMemo(() => {
    if (assets.goldJewelryUsage && fiqh !== 'hanafi') return 0;
    return rawGoldValue;
  }, [rawGoldValue, assets.goldJewelryUsage, fiqh]);

  const silverValue = useMemo(() => {
    if (assets.goldJewelryUsage && fiqh !== 'hanafi') return 0;
    return rawSilverValue;
  }, [rawSilverValue, assets.goldJewelryUsage, fiqh]);

  // Then inside `calculations`, use these precomputed values directly:
  const calculations = useMemo(() => {
    let zakatableAssets = 0;
    let deductibleLiabilities = 0;
    const breakdown: { label: string; amount: number }[] = [];

    // 1. Cash (unchanged)
    const cashTotal = assets.cashInHand + assets.bankDeposit + assets.digitalWallets + assets.businessCash;
    zakatableAssets += cashTotal;
    if (cashTotal > 0) breakdown.push({ label: 'Cash & Savings', amount: cashTotal });

    // 2. Gold & Silver – use exempted values
    const preciousMetalsTotal = goldValue + silverValue;
    zakatableAssets += preciousMetalsTotal;
    if (preciousMetalsTotal > 0)
      breakdown.push({ label: 'Zakatable Gold & Silver', amount: preciousMetalsTotal });

    // 3. Business (unchanged)
    const businessTotal = assets.businessStock + assets.receivables;
    zakatableAssets += businessTotal;
    if (businessTotal > 0) breakdown.push({ label: 'Business Assets', amount: businessTotal });

    // 4. Investments (unchanged)
    const investmentsTotal = assets.stocksValue + assets.cryptoValue;
    zakatableAssets += investmentsTotal;
    if (investmentsTotal > 0) breakdown.push({ label: 'Investments', amount: investmentsTotal });

    // 5. Liabilities (unchanged)
    if (fiqh === 'shafii') {
      deductibleLiabilities = 0;
    } else {
      deductibleLiabilities = liabilities.immediateDebts;
    }

    const netWorth = Math.max(0, zakatableAssets - deductibleLiabilities);

    // Nisab (using raw values for presence checks)
    let silverNisab = 0;
    let goldNisab = 0;
    if (fiqh === 'hanafi') {
      silverNisab = 612.36 * silverPrice;
      goldNisab = 87.48 * goldPrice;
    } else {
      silverNisab = 595 * silverPrice;
      goldNisab = 85 * goldPrice;
    }

    const hasMixedAssets = cashTotal + businessTotal + investmentsTotal + rawSilverValue > 0;
    const applicableNisab = hasMixedAssets
      ? silverNisab
      : rawGoldValue > 0
      ? goldNisab
      : silverNisab;

    const isEligible = netWorth >= applicableNisab;
    const zakatPayable = isEligible ? netWorth * 0.025 : 0;

    return {
      zakatableAssets,
      deductibleLiabilities,
      netWorth,
      applicableNisab,
      isEligible,
      zakatPayable,
      breakdown,
      goldNisab,
      silverNisab,
    };
  }, [assets, liabilities, fiqh, goldPrice, silverPrice, goldValue, silverValue, rawGoldValue, rawSilverValue]);

  // Handle Print
  const handlePrint = () => {
    if (typeof window !== 'undefined' && window.print) window.print();
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 print:bg-white print:text-black">
      {/* Styles for Printing */}
      <style>{`
        /* Hide printable report from screen view */
        .print-only {
          display: none;
        }

        @media print {
          body * {
            visibility: hidden;
          }

          .print-area,
          .print-area * {
            visibility: visible;
          }

          .print-area {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
          }

          /* Show printable report only when printing */
          .print-only {
            display: block;
          }

          .no-print {
            display: none !important;
          }

          input {
            border: none !important;
            padding: 0 !important;
            font-weight: bold;
          }
        }
      `}</style>

      {/* --- HEADER --- */}
      <header className="bg-emerald-900 text-white shadow-lg no-print">
        {/* Top Bar */}
        <div className="bg-emerald-950 px-4 py-2 text-xs md:text-sm text-emerald-200 border-b border-emerald-800">
          <div className="max-w-5xl mx-auto flex flex-col md:flex-row justify-between items-center gap-2">
            <span>
              In Collaboration with{' '}
              <strong>
                <a
                  href="https://www.ilannoor.org/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white underline decoration-emerald-600 underline-offset-2"
                >
                  Il An Noor Foundation
                </a>
              </strong>
            </span>
            <span className="flex items-center gap-4">
              <a
                href="mailto:ilannoorirc@gmail.com"
                className="hover:text-white flex items-center gap-1"
              >
                <Mail size={12} /> ilannoorirc@gmail.com
              </a>
            </span>
          </div>
        </div>

        {/* Main Header */}
        <div className="max-w-5xl mx-auto px-4 py-8 md:py-12">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-emerald-800">
                  <Calculator size={24} strokeWidth={2.5} />
                </div>
                <h1 className="text-3xl md:text-4xl font-bold tracking-tight">Zakat Calculator</h1>
              </div>
              <p className="text-emerald-100 text-lg opacity-90">
                Accurate, private, and easy-to-use calculation based on your School of Thought.
              </p>
            </div>

            <div className="flex flex-col gap-3 w-full md:w-auto md:m-0 mb-3">
              <div className="flex gap-2">
                <select
                  value={fiqh}
                  onChange={(e) => setFiqh(e.target.value as FiqhType)}
                  className="bg-emerald-800 text-white border border-emerald-600 text-sm rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-emerald-400 flex-1 cursor-pointer"
                >
                  <option value="hanafi">Hanafi</option>
                  <option value="shafii">Shafi&apos;i</option>
                  <option value="maliki">Maliki</option>
                  <option value="hanbali">Hanbali</option>
                  <option value="unspecified">Unspecified</option>
                </select>

                <select
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value)}
                  className="bg-emerald-800 text-white border border-emerald-600 text-sm rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-emerald-400 md:w-48 w-28 cursor-pointer"
                >
                  <option value="INR">INR (₹)</option>
                  <option value="USD">USD ($)</option>
                  <option value="EUR">EUR (€)</option>
                  <option value="GBP">GBP (£)</option>
                  <option value="AED">AED (د.إ)</option>
                  <option value="SAR">SAR (﷼)</option>
                </select>
              </div>

              {/* Responsive info note */}
              <div
                id="fiqh-help"
                className="bg-emerald-800/30 border border-emerald-600/30 rounded-lg p-3 text-sm text-emerald-100 flex items-start gap-3"
              >
                <div className="shrink-0">
                  <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-emerald-900/40 text-emerald-100">
                    <Info size={14} />
                  </span>
                </div>

                <div className="flex-1">
                  <p className="text-emerald-100 text-xs sm:text-sm leading-snug">
                    Zakat calculation differs only for <strong>Hanafi</strong> and <strong>Shafi&apos;i</strong> fiqh. Selecting <strong>Unspecified</strong> applies the general calculation used by the majority of schools.
                  </p>
                </div>
              </div>

              {/* Market Rates */}
              <div className="bg-emerald-800/50 p-3 rounded-lg border border-emerald-600/30 text-sm">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-emerald-200 text-xs font-semibold uppercase tracking-wider">
                    Market Rates (Per Gram)
                  </p>
                  <span className="text-xs text-white bg-emerald-900/50 px-2 py-0.5 rounded-full">
                    Mumbai, India • 27/02/2026
                  </span>
                </div>
                <div className="flex gap-4">
                  <div className="flex-1">
                    <label className="text-emerald-100 text-xs block">Gold (24K)</label>
                    <div className="flex items-center border-b border-emerald-500/50">
                      <span className="text-emerald-300 mr-1">{currencySymbol}</span>
                      <input
                        type="number"
                        value={goldPrice}
                        onChange={(e) => {
                          const parsed = parseFloat(e.target.value);
                          setGoldPrice(Number.isFinite(parsed) ? parsed : 0);
                        }}
                        className="bg-transparent text-white w-full py-1 outline-none font-medium"
                      />
                    </div>
                  </div>
                  <div className="flex-1">
                    <label className="text-emerald-100 text-xs block">Silver</label>
                    <div className="flex items-center border-b border-emerald-500/50">
                      <span className="text-emerald-300 mr-1">{currencySymbol}</span>
                      <input
                        type="number"
                        value={silverPrice}
                        onChange={(e) => {
                          const parsed = parseFloat(e.target.value);
                          setSilverPrice(Number.isFinite(parsed) ? parsed : 0);
                        }}
                        className="bg-transparent text-white w-full py-1 outline-none font-medium"
                      />
                    </div>
                  </div>
                </div>
                <div className="mt-2 text-xs text-white">
                  <Info size={12} className="inline mr-1 mb-0.5" />
                  Update rates to match your local market and currency.
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 -mt-8 pb-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* LEFT COLUMN: Calculator Inputs */}
          <div className="lg:col-span-2 space-y-6">
            {/* 1. Cash */}
            <Card className="no-print">
              <SectionHeader
                icon={Wallet}
                title="Cash & Liquid Assets"
                isOpen={sections.cash}
                toggle={() => toggleSection('cash')}
                total={assets.cashInHand + assets.bankDeposit + assets.digitalWallets}
                currency={currencySymbol}
              />
              {sections.cash && (
                <div className="p-6 bg-white animate-in slide-in-from-top-2 duration-200">
                  <InputGroup
                    label="Cash on Hand"
                    value={assets.cashInHand}
                    onChange={(v) => updateAsset('cashInHand', v)}
                    tooltip="Physical currency notes and coins."
                    currencySymbol={currencySymbol}
                  />
                  <InputGroup
                    label="Bank Accounts"
                    value={assets.bankDeposit}
                    onChange={(v) => updateAsset('bankDeposit', v)}
                    sublabel="Savings, Current, Fixed Deposits."
                    currencySymbol={currencySymbol}
                  />
                  <InputGroup
                    label="Digital Wallets"
                    value={assets.digitalWallets}
                    onChange={(v) => updateAsset('digitalWallets', v)}
                    sublabel="UPI, Paytm, PayPal, etc."
                    currencySymbol={currencySymbol}
                  />
                </div>
              )}
            </Card>

            {/* 2. Gold */}
            <Card className="no-print">
              <SectionHeader
                icon={Gem}
                title="Gold & Silver"
                isOpen={sections.gold}
                toggle={() => toggleSection('gold')}
                total={goldValue + (fiqh === 'hanafi' || !assets.goldJewelryUsage ? assets.silverGrams * silverPrice : 0)}
                currency={currencySymbol}
              />
              {sections.gold && (
                <div className="p-6 bg-white animate-in slide-in-from-top-2 duration-200">
                  <div className="gap-4">
                  {/* Gold Items List */}
                    <div className="space-y-4 mb-4">
                      {assets.goldItems.map((item, index) => (
                        <div key={index} className="flex gap-2 sm:gap-3 items-end">
                          <div className="w-20 sm:w-30">
                            <label className="block text-sm font-medium text-slate-700 mb-1">Karat</label>
                            <select
                              value={item.karat}
                              onChange={(e) => updateGoldItem(index, 'karat', Number(e.target.value))}
                              className="w-full p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 cursor-pointer"
                            >
                              {[24, 22, 21, 18, 14, 10, 8].map(k => (
                                <option key={k} value={k}>{k}K</option>
                              ))}
                            </select>
                          </div>
                          <div className="flex-1">
                            <label className="block text-sm font-medium text-slate-700 mb-1">Gold (Grams)</label>
                            <input
                              type="number"
                              min="0"
                              step="0.01"
                              value={item.grams || ''}
                              onChange={(e) => updateGoldItem(index, 'grams', parseFloat(e.target.value) || 0)}
                              className="w-full p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                              placeholder="0.00"
                            />
                          </div>
                          {assets.goldItems.length > 1 && (
                            <button
                              onClick={() => removeGoldItem(index)}
                              className="p-2.5 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors mb-1 cursor-pointer"
                              aria-label="Remove gold item"
                              title="Remove this gold item"
                            >
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                            </button>
                          )}
                        </div>
                      ))}
                    </div>

                    {/* Add More Button */}
                    <button
                      onClick={addGoldItem}
                      className="text-sm text-emerald-600 hover:text-emerald-700 font-medium flex items-center gap-1 mb-4 cursor-pointer"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                      </svg>
                      Add another gold item
                    </button>
                    <InputGroup
                      label="Silver (Grams)"
                      value={assets.silverGrams}
                      onChange={(v) => updateAsset('silverGrams', v)}
                      currencySymbol="g"
                      placeholder="0"
                    />
                  </div>
                  <div className="bg-slate-50 p-4 rounded-lg border border-slate-100">
                    <Toggle
                      label="Is gold and silver used for personal jewelry?"
                      active={assets.goldJewelryUsage}
                      onToggle={(v) => updateAsset('goldJewelryUsage', v)}
                      tooltip="Exempt in Shafi'i, Maliki, Hanbali, Unspecified if used for adornment."
                    />
                    {assets.goldJewelryUsage && fiqh !== 'hanafi' && (
                      <p className="text-xs text-emerald-600">Exempt from Zakat based on {fiqh} fiqh.</p>
                    )}
                    {assets.goldJewelryUsage && fiqh === 'hanafi' && (
                      <p className="text-xs text-amber-600">Zakatable in Hanafi fiqh.</p>
                    )}
                  </div>
                </div>
              )}
            </Card>

            {/* 3. Business */}
            <Card className="no-print">
              <SectionHeader
                icon={Briefcase}
                title="Business Assets"
                isOpen={sections.business}
                toggle={() => toggleSection('business')}
                total={assets.businessStock + assets.businessCash + assets.receivables}
                currency={currencySymbol}
              />
              {sections.business && (
                <div className="p-6 bg-white animate-in slide-in-from-top-2 duration-200">
                  <InputGroup
                    label="Value of Inventory/Stock"
                    value={assets.businessStock}
                    onChange={(v) => updateAsset('businessStock', v)}
                    tooltip="Market value of goods for sale."
                    currencySymbol={currencySymbol}
                  />
                  <InputGroup
                    label="Cash in Business Accounts"
                    value={assets.businessCash}
                    onChange={(v) => updateAsset('businessCash', v)}
                    currencySymbol={currencySymbol}
                  />
                  <InputGroup
                    label="Receivables (Loans Given)"
                    value={assets.receivables}
                    onChange={(v) => updateAsset('receivables', v)}
                    tooltip="Money you expect to be repaid."
                    currencySymbol={currencySymbol}
                  />
                </div>
              )}
            </Card>

            {/* 4. Investments */}
            <Card className="no-print">
              <SectionHeader
                icon={TrendingUp}
                title="Investments"
                isOpen={sections.investments}
                toggle={() => toggleSection('investments')}
                total={assets.stocksValue + assets.cryptoValue}
                currency={currencySymbol}
              />
              {sections.investments && (
                <div className="p-6 bg-white animate-in slide-in-from-top-2 duration-200">
                  <InputGroup
                    label="Shares/Stocks Value"
                    value={assets.stocksValue}
                    onChange={(v) => updateAsset('stocksValue', v)}
                    currencySymbol={currencySymbol}
                  />
                  <InputGroup
                    label="Crypto Value"
                    value={assets.cryptoValue}
                    onChange={(v) => updateAsset('cryptoValue', v)}
                    currencySymbol={currencySymbol}
                  />
                </div>
              )}
            </Card>

            {/* 5. Liabilities */}
            <Card className="no-print">
              <SectionHeader
                icon={CreditCard}
                title="Deductible Liabilities"
                isOpen={sections.liabilities}
                toggle={() => toggleSection('liabilities')}
                total={calculations.deductibleLiabilities}
                currency={currencySymbol}
              />
              {sections.liabilities && (
                <div className="p-6 bg-white animate-in slide-in-from-top-2 duration-200">
                  {fiqh === 'shafii' && (
                    <p className="text-xs text-red-500 mb-2">Debts are not deductible in Shafi'i fiqh.</p>
                  )}
                  <InputGroup
                    label="Immediate Debts"
                    value={liabilities.immediateDebts}
                    onChange={(v) => updateLiability('immediateDebts', v)}
                    currencySymbol={currencySymbol}
                  />
                </div>
              )}
            </Card>
          </div>

          {/* RIGHT COLUMN: Summary & Contact */}
          <div className="lg:col-span-1 space-y-6">
            {/* Result Card */}
            <div className="bg-white rounded-xl shadow-lg border border-emerald-100 overflow-hidden">
              <div className="bg-slate-900 text-white p-6 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500 rounded-full blur-3xl opacity-20 -translate-y-1/2 translate-x-1/2" />
                <h2 className="text-xl font-bold flex items-center gap-2 relative z-10">Summary</h2>
                <p className="text-slate-400 text-sm relative z-10">
                  Based on {fiqh.charAt(0).toUpperCase() + fiqh.slice(1)} Fiqh
                </p>
              </div>

              <div className="p-6">
                <div className="space-y-4">
                  {/* Total Assets */}
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-slate-500">Total Zakatable Assets</span>
                    <span className="font-semibold text-slate-800">
                      {currencySymbol} {calculations.zakatableAssets.toLocaleString()}
                    </span>
                  </div>

                  {/* Liabilities */}
                  {calculations.deductibleLiabilities > 0 && (
                    <div className="flex justify-between items-center text-sm text-red-600">
                      <span>Deductible Debts</span>
                      <span>
                        - {currencySymbol} {calculations.deductibleLiabilities.toLocaleString()}
                      </span>
                    </div>
                  )}

                  <div className="h-px bg-slate-200 my-2" />

                  {/* Net Worth */}
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-slate-700">Net Wealth</span>
                    <span className="font-bold text-slate-900 text-lg">
                      {currencySymbol} {calculations.netWorth.toLocaleString()}
                    </span>
                  </div>

                  {/* Nisab Status */}
                  <div
                    className={`p-4 rounded-lg text-center border ${
                      calculations.isEligible ? 'bg-emerald-50 border-emerald-200' : 'bg-slate-50 border-slate-200'
                    }`}
                  >
                    <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-1">
                      Threshold (Nisab)
                    </span>
                    <span className="text-slate-700 font-medium block mb-2">
                      {currencySymbol}{' '}
                      {calculations.applicableNisab.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                    </span>

                    {calculations.isEligible ? (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-700 text-xs font-bold">
                        <Coins size={12} /> Zakat Due
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-200 text-slate-600 text-xs font-bold">
                        Not Eligible
                      </span>
                    )}
                  </div>

                  {/* Final Amount */}
                  {calculations.isEligible && (
                    <div className="mt-4 pt-4 border-t border-dashed border-emerald-200">
                      <p className="text-center text-sm text-slate-500 mb-1">Total Payable (2.5%)</p>
                      <p className="text-center text-4xl font-bold text-emerald-700">
                        {currencySymbol} {calculations.zakatPayable.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                      </p>
                    </div>
                  )}

                  {/* Download Button */}
                  <button
                    onClick={handlePrint}
                    className="w-full mt-4 flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-900 text-white py-3 rounded-lg transition-colors font-medium text-sm no-print cursor-pointer"
                  >
                    <Download size={16} /> Download Summary Report
                  </button>
                </div>
              </div>
            </div>

            {/* Pay Zakat Card – always visible */}
            <PayZakatCard
              zakatAmount={calculations.zakatPayable}
              currency={currency}
              currencySymbol={currencySymbol}
            />

            {/* Share Card */}
            <ShareCard/>

            {/* Contact Card */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 no-print">
              <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                <HelpCircleIcon /> Have Doubts?
              </h3>
              <p className="text-sm text-slate-600 mb-6">
                Zakat rulings can be complex. For specific queries, contact
                {fiqh === 'shafii' ? ' Mufti Sohail ' : ' Mufti Danish '}directly.
              </p>
              <div className="space-y-3">
                <a
                  href={"whatsapp://send?phone=" + (fiqh === 'shafii' ? '919324656650' : '918104998499')}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 w-full py-2.5 bg-emerald-50 text-emerald-700 rounded-lg font-medium hover:bg-emerald-100 transition-colors border border-emerald-200"
                >
                  <MessageCircle size={18} /> WhatsApp
                </a>
                <a
                  href={"tel:" + (fiqh === 'shafii' ? '+919324656650' : '+918104998499')}
                  className="flex items-center justify-center gap-2 w-full py-2.5 bg-white text-slate-700 rounded-lg font-medium hover:bg-slate-50 transition-colors border border-slate-200"
                >
                  <Phone size={18} /> Call Now
                </a>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* --- FOOTER --- */}
      <footer className="bg-slate-900 text-slate-400 py-12 no-print">
        <div className="max-w-5xl mx-auto px-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 text-sm">
          <div className="space-y-4">
            <h4 className="text-white font-bold text-lg">Il An Noor</h4>
            <p>Empowering the community with knowledge and tools.</p>
            <div className="flex gap-4 pt-2">
              <a href="#" className="hover:text-white transition-colors">
                <Globe size={20} />
              </a>
              <a href="#" className="hover:text-white transition-colors">
                <Mail size={20} />
              </a>
            </div>
          </div>

          <div>
            <h4 className="text-white font-bold mb-4">Contact</h4>
            <ul className="space-y-2">
              <li className="flex items-start gap-2">
                <MapPin size={16} className="mt-0.5 shrink-0" />
                <span>Il An Noor Library, Sapphire CHS, Sector 35F, Kharghar, Navi Mumbai</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail size={16} /> ilannoorirc@gmail.com
              </li>
              <li className="flex items-center gap-2">
                <Phone size={16} /> +91 8104998499
              </li>
            </ul>
          </div>

          <div className="lg:col-span-2 md:text-right">
            <p className="mb-2">Developed by</p>
            <a
              href="https://abdurrahmanshkh.vercel.app/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-emerald-400 hover:text-emerald-300 font-medium inline-flex items-center gap-1 mb-4"
            >
              Abdur Rehman Shaikh <ExternalLink size={12} />
            </a>
            <p className="text-xs opacity-60">
              Disclaimer: This calculator provides an estimate based on standard Fiqh opinions. Please verify complex assets with a qualified scholar.
            </p>
          </div>
        </div>
      </footer>

      {/* --- PRINTABLE REPORT VIEW (Hidden normally) --- */}
      <div className="print-only p-8 max-w-3xl mx-auto print-area">
        {/* Print Header */}
        <div className="flex justify-between items-start border-b-2 border-slate-800 pb-6 mb-8">
          <div>
            <h1 className="text-4xl font-bold text-slate-900 mb-2">Zakat Assessment</h1>
            <p className="text-slate-600">Generated on {new Date().toLocaleDateString()}</p>
          </div>
          <div className="text-right">
            <h2 className="font-bold text-xl text-emerald-800">Il An Noor Foundation</h2>
            <p className="text-sm text-slate-500">Kharghar, Navi Mumbai</p>
            <p className="text-sm text-slate-500">Reg: Mufti Danish</p>
          </div>
        </div>

        {/* Client Inputs Summary */}
        <div className="grid grid-cols-2 gap-8 mb-8">
          <div>
            <h3 className="font-bold border-b border-slate-300 pb-1 mb-2">Parameters</h3>
            <div className="grid grid-cols-2 gap-y-1 text-sm">
              <span className="text-slate-600">Fiqh:</span>{' '}
              <span className="font-medium capitalize">{fiqh}</span>
              <span className="text-slate-600">Currency:</span>{' '}
              <span className="font-medium">{currency}</span>
              <span className="text-slate-600">Gold Price:</span>{' '}
              <span>
                {currencySymbol}
                {goldPrice}/g
              </span>
              <span className="text-slate-600">Silver Price:</span>{' '}
              <span>
                {currencySymbol}
                {silverPrice}/g
              </span>
            </div>
          </div>
          <div>
            <h3 className="font-bold border-b border-slate-300 pb-1 mb-2">Result</h3>
            <div className="grid grid-cols-2 gap-y-1 text-sm">
              <span className="text-slate-600">Net Wealth:</span>{' '}
              <span className="font-bold">
                {currencySymbol}
                {calculations.netWorth.toLocaleString()}
              </span>
              <span className="text-slate-600">Nisab Threshold:</span>{' '}
              <span>
                {currencySymbol}
                {calculations.applicableNisab.toLocaleString(undefined, { maximumFractionDigits: 0 })}
              </span>
              <span className="text-slate-600">Status:</span>
              <span className={`font-bold ${calculations.isEligible ? 'text-black' : 'text-slate-500'}`}>
                {calculations.isEligible ? 'ZAKAT DUE' : 'NOT ELIGIBLE'}
              </span>
            </div>
          </div>
        </div>

        {/* Detailed Breakdown Table */}
        <table className="w-full text-sm mb-8">
          <thead className="bg-slate-100">
            <tr>
              <th className="text-left p-3 font-bold border-b border-slate-300">Asset Class</th>
              <th className="text-right p-3 font-bold border-b border-slate-300">Value</th>
            </tr>
          </thead>
          <tbody>
            {calculations.breakdown.map((item, idx) => (
              <tr key={idx} className="border-b border-slate-100">
                <td className="p-3 text-slate-700">{item.label}</td>
                <td className="p-3 text-right font-medium">
                  {currencySymbol} {item.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                </td>
              </tr>
            ))}
            {calculations.deductibleLiabilities > 0 && (
              <tr className="border-b border-slate-100 text-red-600">
                <td className="p-3">Less: Deductible Liabilities</td>
                <td className="p-3 text-right font-medium">
                  - {currencySymbol} {calculations.deductibleLiabilities.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                </td>
              </tr>
            )}
          </tbody>
          <tfoot>
            <tr className="bg-slate-50 font-bold text-lg">
              <td className="p-4 text-slate-900 text-right">Zakat Payable (2.5%)</td>
              <td className="p-4 text-emerald-800 text-right">
                {currencySymbol} {calculations.zakatPayable.toLocaleString(undefined, { minimumFractionDigits: 2 })}
              </td>
            </tr>
          </tfoot>
        </table>

        {/* Footer for Print */}
        <div className="text-center text-xs text-slate-400 mt-12 pt-8 border-t border-slate-200">
          <p>Calculated using Il An Noor Zakat Calculator | Developed by <a href="https://abdurrahmanshkh.vercel.app" target="_blank" className="text-emerald-600 hover:underline">Abdur Rehman Shaikh</a></p>
          <p>For doubts contact Mufti Danish: +91 8104998499 | ilannoorirc@gmail.com</p>
        </div>
      </div>
    </div>
  );
}

/* Icon Helper */
const HelpCircleIcon: React.FC = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="text-emerald-600"
  >
    <circle cx="12" cy="12" r="10"></circle>
    <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path>
    <line x1="12" y1="17" x2="12.01" y2="17"></line>
  </svg>
);
