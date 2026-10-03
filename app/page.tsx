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
  Copy,
  Check,
  Share2,
  ShieldCheck,
  Scale,
  RotateCcw,
  Sparkles,
  HelpCircle,
  Plus,
  Trash2,
  SlidersHorizontal,
  Lock,
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

interface GoldItem {
  id: string;
  karat: number;
  grams: number;
}

interface Assets {
  cashInHand: number;
  bankDeposit: number;
  digitalWallets: number;
  goldItems: GoldItem[];
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
 * Custom UI Components
 */

interface SectionHeaderProps {
  icon: React.ComponentType<{ size?: number; className?: string }>;
  title: string;
  subtitle?: string;
  isOpen: boolean;
  toggle: () => void;
  total: number;
  currency: string;
}

const SectionHeader: React.FC<SectionHeaderProps> = ({
  icon: Icon,
  title,
  subtitle,
  isOpen,
  toggle,
  total,
  currency,
}) => (
  <button
    type="button"
    onClick={toggle}
    aria-expanded={isOpen}
    className="w-full flex items-center justify-between p-4 sm:p-5 bg-white hover:bg-slate-50/80 transition-all border-b border-slate-100 no-print cursor-pointer text-left select-none group"
  >
    <div className="flex items-center gap-3.5 min-w-0">
      <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0 border border-emerald-100/80 group-hover:bg-emerald-100/70 transition-colors">
        <Icon size={20} className="shrink-0" />
      </div>
      <div className="min-w-0">
        <h3 className="font-semibold text-slate-900 text-base sm:text-lg leading-tight truncate">
          {title}
        </h3>
        {subtitle && (
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5 truncate">{subtitle}</p>
        )}
      </div>
    </div>
    <div className="flex items-center gap-3 shrink-0 ml-3">
      {total > 0 && (
        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs sm:text-sm font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200/60 font-tabular">
          {currency}{' '}
          {total.toLocaleString(undefined, {
            minimumFractionDigits: 0,
            maximumFractionDigits: 2,
          })}
        </span>
      )}
      <div className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 group-hover:text-slate-600 group-hover:bg-slate-100 transition-colors">
        {isOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
      </div>
    </div>
  </button>
);

interface InputGroupProps {
  id?: string;
  label: string;
  sublabel?: string;
  value: number;
  onChange: (v: number) => void;
  placeholder?: string;
  tooltip?: string;
  currencySymbol?: string;
}

const InputGroup: React.FC<InputGroupProps> = ({
  id,
  label,
  sublabel,
  value,
  onChange,
  placeholder = '0.00',
  tooltip,
  currencySymbol = '',
}) => {
  const [showTooltip, setShowTooltip] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const parsed = parseFloat(e.target.value);
    onChange(Number.isFinite(parsed) ? Math.max(0, parsed) : 0);
  };

  const handleClear = () => {
    onChange(0);
  };

  return (
    <div className="mb-4 last:mb-0 break-inside-avoid">
      <div className="flex items-center justify-between gap-2 mb-1.5">
        <div className="flex items-center gap-1.5">
          <label htmlFor={id} className="block text-sm font-medium text-slate-700">
            {label}
          </label>
          {tooltip && (
            <div className="relative inline-block no-print">
              <button
                type="button"
                onMouseEnter={() => setShowTooltip(true)}
                onMouseLeave={() => setShowTooltip(false)}
                onClick={() => setShowTooltip((prev) => !prev)}
                aria-label={`Info about ${label}`}
                className="text-slate-400 hover:text-slate-600 p-0.5 rounded-full hover:bg-slate-100 transition-colors cursor-help"
              >
                <Info size={14} />
              </button>
              {showTooltip && (
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 p-2.5 bg-slate-900 text-slate-100 text-xs rounded-lg shadow-xl z-30 pointer-events-none leading-relaxed border border-slate-700">
                  {tooltip}
                </div>
              )}
            </div>
          )}
        </div>
        {value > 0 && (
          <button
            type="button"
            onClick={handleClear}
            className="text-xs text-slate-400 hover:text-red-500 font-medium transition-colors no-print cursor-pointer"
          >
            Clear
          </button>
        )}
      </div>

      {sublabel && <p className="text-xs text-slate-500 mb-2">{sublabel}</p>}

      <div className="relative flex items-center rounded-xl bg-slate-50/80 border border-slate-200 focus-within:bg-white focus-within:border-emerald-500 focus-within:ring-4 focus-within:ring-emerald-500/10 transition-all shadow-2xs">
        <span className="pl-3.5 pr-1 text-slate-500 font-semibold text-sm select-none">
          {currencySymbol}
        </span>
        <input
          id={id}
          type="number"
          min="0"
          step="any"
          value={value === 0 ? '' : value}
          onChange={handleChange}
          placeholder={placeholder}
          className="w-full py-2.5 pl-1 pr-3 text-slate-900 font-medium text-sm sm:text-base outline-none bg-transparent font-tabular placeholder:text-slate-400"
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
  badge?: string;
}

const Toggle: React.FC<ToggleProps> = ({ label, active, onToggle, tooltip, badge }) => (
  <div className="flex items-center justify-between py-2 break-inside-avoid gap-4">
    <div className="flex-1 min-w-0">
      <div className="flex items-center gap-2 flex-wrap">
        <span className="text-sm font-medium text-slate-800 leading-snug">{label}</span>
        {badge && (
          <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
            {badge}
          </span>
        )}
      </div>
      {tooltip && <p className="text-xs text-slate-500 mt-1 leading-normal">{tooltip}</p>}
    </div>
    <button
      type="button"
      role="switch"
      aria-checked={active}
      onClick={() => onToggle(!active)}
      className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2 no-print cursor-pointer ${
        active ? 'bg-emerald-600' : 'bg-slate-200'
      }`}
    >
      <span
        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform shadow-xs ${
          active ? 'translate-x-6' : 'translate-x-1'
        }`}
      />
    </button>
  </div>
);

/**
 * Share Card Component
 */
const ShareCard: React.FC = () => {
  const [copied, setCopied] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const id = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(id);
  }, []);

  if (!mounted) return null;

  const pageUrl = 'https://myzakat.vercel.app';
  const shareText =
    'Discover the Zakat Calculator — an accurate, privacy-first tool to estimate your Zakat based on your School of Thought. Free & completely private.';
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
      setTimeout(() => setCopied(false), 2200);
    } catch {
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    }
  };

  const openWindow = (url: string) => {
    window.open(url, '_blank', 'noopener,noreferrer,width=600,height=600');
  };

  const handleNativeShare = async () => {
    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share({
          title: 'Zakat Calculator — Accurate, Private & Free',
          text: shareText,
          url: pageUrl,
        });
      } catch {
        /* user cancelled */
      }
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200/80 p-5 sm:p-6 no-print">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-100">
            <Share2 className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-slate-900 leading-tight">Share this Tool</h4>
            <p className="text-xs text-slate-500">Help others calculate accurately</p>
          </div>
        </div>

        {typeof navigator !== 'undefined' && 'share' in navigator && (
          <button
            type="button"
            onClick={handleNativeShare}
            className="md:hidden text-slate-500 hover:text-emerald-700 p-2 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
            aria-label="Native Share"
          >
            <Share2 className="w-4 h-4" />
          </button>
        )}
      </div>

      <div className="relative flex items-center mb-4">
        <input
          type="text"
          readOnly
          value={pageUrl}
          className="w-full pl-3 pr-22 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-600 focus:outline-none"
        />
        <button
          type="button"
          onClick={handleCopy}
          className={`absolute right-1 px-3 py-1.5 rounded-md text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
            copied
              ? 'bg-emerald-600 text-white'
              : 'bg-white border border-slate-200 text-slate-700 hover:text-emerald-700 hover:border-emerald-300'
          }`}
        >
          {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
          {copied ? 'Copied' : 'Copy'}
        </button>
      </div>

      <div className="grid grid-cols-2 gap-2 text-xs">
        <button
          type="button"
          onClick={() =>
            openWindow(
              `https://wa.me/?text=${encodeURIComponent(`${shareText} ${pageUrl}`)}`
            )
          }
          className="flex items-center justify-center gap-2 py-2 px-3 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-100 font-medium transition-colors cursor-pointer"
        >
          <MessageCircle className="w-3.5 h-3.5" /> WhatsApp
        </button>
        <button
          type="button"
          onClick={() =>
            openWindow(
              `https://twitter.com/intent/tweet?text=${encodeURIComponent(
                shareText
              )}&url=${shareUrlEncoded}`
            )
          }
          className="flex items-center justify-center gap-2 py-2 px-3 rounded-lg bg-slate-50 text-slate-700 hover:bg-slate-100 border border-slate-200 font-medium transition-colors cursor-pointer"
        >
          <Globe className="w-3.5 h-3.5" /> Post / X
        </button>
      </div>
    </div>
  );
};

/**
 * Il An Noor Charity Impact Card
 */
const PayZakatCard: React.FC<{
  zakatAmount: number;
  currency: string;
  currencySymbol: string;
}> = ({ zakatAmount, currencySymbol }) => {
  const stats = [
    { label: 'Total Funds Donated', amount: 1870381, icon: Coins },
    { label: 'Ration & Shelter', amount: 1320962, icon: Home },
    { label: 'Medical Aid', amount: 424138, icon: Heart },
    { label: 'Education Aid', amount: 117581, icon: GraduationCap },
  ];

  const formatAmount = (amt: number) => {
    return amt.toLocaleString(undefined, { maximumFractionDigits: 0 });
  };

  let paymentUrl = 'https://www.ilannoor.org/payments';
  if (zakatAmount > 0) {
    paymentUrl = `https://www.ilannoor.org/payments?type=zakat&amount=${Math.floor(zakatAmount)}`;
  }

  return (
    <div className="bg-linear-to-b from-white to-emerald-50/40 rounded-2xl shadow-sm border border-emerald-200/80 p-5 sm:p-6 relative overflow-hidden">
      {/* Decorative gradient orb */}
      <div className="absolute top-0 right-0 w-36 h-36 bg-emerald-200/40 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />

      <div className="relative">
        <div className="flex items-center justify-between gap-3 mb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-emerald-600 text-white rounded-xl shadow-xs">
              <HandHeart className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[11px] font-semibold text-emerald-700 uppercase tracking-wider block">
                Verified Partner Charity
              </span>
              <a
                href="https://www.ilannoor.org/"
                target="_blank"
                rel="noopener noreferrer"
                className="font-bold text-slate-900 hover:text-emerald-700 transition-colors inline-flex items-center gap-1 text-base leading-tight"
              >
                Il An Noor Foundation
                <ExternalLink size={13} className="text-slate-400" />
              </a>
            </div>
          </div>
          <span className="inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
            <ShieldCheck size={12} /> 100% Policy
          </span>
        </div>

        <p className="text-xs text-slate-600 mb-4 leading-relaxed">
          100% of your Zakat reaches verified eligible recipients (mustahiqeen) for direct ration, medical relief, and shelter.
        </p>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-2 mb-4">
          {stats.map((stat, idx) => (
            <div
              key={idx}
              className="bg-white/90 backdrop-blur-xs rounded-xl p-2.5 border border-emerald-100/70 shadow-2xs"
            >
              <div className="flex items-center gap-1.5 text-slate-500 mb-1">
                <stat.icon className="w-3.5 h-3.5 text-emerald-600" />
                <span className="text-[11px] font-medium truncate">{stat.label}</span>
              </div>
              <p className="text-sm sm:text-base font-bold text-slate-900 font-tabular">
                ₹{formatAmount(stat.amount)}
              </p>
            </div>
          ))}
        </div>

        {/* Action Button */}
        <div className="bg-emerald-100/60 rounded-xl p-4 border border-emerald-200/80">
          {zakatAmount > 0 && (
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-emerald-800">Your Calculated Zakat</span>
              <span className="text-base font-bold text-emerald-900 font-tabular">
                {currencySymbol} {formatAmount(zakatAmount)}
              </span>
            </div>
          )}
          <a
            href={paymentUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 w-full bg-emerald-600 hover:bg-emerald-700 active:scale-[0.99] text-white font-semibold py-3 px-4 rounded-xl transition-all shadow-sm hover:shadow-md cursor-pointer text-sm"
          >
            {zakatAmount > 0 ? 'Fulfill Zakat Now' : 'Donate Sadaqah / Zakat'}
            <ArrowRight className="w-4 h-4" />
          </a>
          <p className="text-[11px] text-center text-emerald-700/80 mt-2">
            Secure redirect to Il An Noor official payment portal
          </p>
        </div>
      </div>
    </div>
  );
};

/**
 * Main Application Component
 */
export default function App(): React.ReactElement {
  // --- State Management ---
  const [fiqh, setFiqh] = useState<FiqhType>('hanafi');
  const [currency, setCurrency] = useState<string>('INR');

  // Market Rates
  const [goldPrice, setGoldPrice] = useState<number>(15971.82);
  const [silverPrice, setSilverPrice] = useState<number>(270.20);
  const [isEditingRates, setIsEditingRates] = useState<boolean>(false);
  const [showFiqhModal, setShowFiqhModal] = useState<boolean>(false);
  const [copiedSummary, setCopiedSummary] = useState<boolean>(false);

  // Accordion Sections
  const [sections, setSections] = useState<Sections>({
    cash: true,
    gold: true,
    business: true,
    investments: true,
    liabilities: true,
  });

  // Assets
  const [assets, setAssets] = useState<Assets>({
    cashInHand: 0,
    bankDeposit: 0,
    digitalWallets: 0,
    goldItems: [{ id: '1', karat: 24, grams: 0 }],
    goldJewelryUsage: true,
    silverGrams: 0,
    businessStock: 0,
    businessCash: 0,
    receivables: 0,
    stocksValue: 0,
    cryptoValue: 0,
  });

  // Liabilities
  const [liabilities, setLiabilities] = useState<Liabilities>({
    immediateDebts: 0,
  });

  // FAQ open state
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

  // Currency Symbol
  const currencySymbol =
    {
      INR: '₹',
      USD: '$',
      GBP: '£',
      EUR: '€',
      AED: 'د.إ',
      SAR: '﷼',
    }[currency] || '$';

  // Section Toggle
  const toggleSection = (key: keyof Sections) => {
    setSections((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  // Gold Item Helpers
  const updateGoldItem = (index: number, field: 'karat' | 'grams', value: number) => {
    setAssets((prev) => {
      const newItems = [...prev.goldItems];
      newItems[index] = { ...newItems[index], [field]: value };
      return { ...prev, goldItems: newItems };
    });
  };

  const addGoldItem = () => {
    setAssets((prev) => ({
      ...prev,
      goldItems: [
        ...prev.goldItems,
        { id: Math.random().toString(), karat: 24, grams: 0 },
      ],
    }));
  };

  const removeGoldItem = (index: number) => {
    setAssets((prev) => ({
      ...prev,
      goldItems: prev.goldItems.filter((_, i) => i !== index),
    }));
  };

  // Asset/Liability generic setters
  function updateAsset<K extends keyof Assets>(key: K, value: Assets[K]) {
    setAssets((prev) => ({ ...prev, [key]: value }));
  }

  function updateLiability<K extends keyof Liabilities>(key: K, value: Liabilities[K]) {
    setLiabilities((prev) => ({ ...prev, [key]: value }));
  }

  // Reset form handler
  const handleResetForm = () => {
    if (typeof window !== 'undefined') {
      const confirmReset = window.confirm(
        'Are you sure you want to reset all entered numbers to zero?'
      );
      if (!confirmReset) return;
    }
    setAssets({
      cashInHand: 0,
      bankDeposit: 0,
      digitalWallets: 0,
      goldItems: [{ id: '1', karat: 24, grams: 0 }],
      goldJewelryUsage: true,
      silverGrams: 0,
      businessStock: 0,
      businessCash: 0,
      receivables: 0,
      stocksValue: 0,
      cryptoValue: 0,
    });
    setLiabilities({ immediateDebts: 0 });
  };

  // --- Calculations ---
  const rawGoldValue = useMemo(() => {
    return assets.goldItems.reduce(
      (sum, item) => sum + item.grams * goldPrice * (item.karat / 24),
      0
    );
  }, [assets.goldItems, goldPrice]);

  const rawSilverValue = useMemo(() => {
    return assets.silverGrams * silverPrice;
  }, [assets.silverGrams, silverPrice]);

  // Jewelry exemption (Hanafi counts jewelry; other 3 schools and majority consider personal jewelry exempt)
  const isJewelryExempt = assets.goldJewelryUsage && fiqh !== 'hanafi';
  const goldValue = isJewelryExempt ? 0 : rawGoldValue;
  const silverValue = isJewelryExempt ? 0 : rawSilverValue;

  const calculations = useMemo(() => {
    let zakatableAssets = 0;
    let deductibleLiabilities = 0;
    const breakdown: { label: string; amount: number; color: string }[] = [];

    // 1. Cash
    const cashTotal =
      assets.cashInHand + assets.bankDeposit + assets.digitalWallets;
    zakatableAssets += cashTotal;
    if (cashTotal > 0) {
      breakdown.push({ label: 'Cash & Liquid Savings', amount: cashTotal, color: '#10b981' });
    }

    // 2. Gold & Silver
    const preciousMetalsTotal = goldValue + silverValue;
    zakatableAssets += preciousMetalsTotal;
    if (preciousMetalsTotal > 0) {
      breakdown.push({
        label: 'Zakatable Gold & Silver',
        amount: preciousMetalsTotal,
        color: '#f59e0b',
      });
    }

    // 3. Business
    const businessTotal =
      assets.businessStock + assets.businessCash + assets.receivables;
    zakatableAssets += businessTotal;
    if (businessTotal > 0) {
      breakdown.push({ label: 'Business & Trade Stock', amount: businessTotal, color: '#6366f1' });
    }

    // 4. Investments
    const investmentsTotal = assets.stocksValue + assets.cryptoValue;
    zakatableAssets += investmentsTotal;
    if (investmentsTotal > 0) {
      breakdown.push({ label: 'Investments & Shares', amount: investmentsTotal, color: '#8b5cf6' });
    }

    // 5. Deductible Liabilities
    if (fiqh === 'shafii') {
      deductibleLiabilities = 0;
    } else {
      deductibleLiabilities = liabilities.immediateDebts;
    }

    const netWorth = Math.max(0, zakatableAssets - deductibleLiabilities);

    // Nisab thresholds (Gold: 87.48g Hanafi vs 85g others; Silver: 612.36g Hanafi vs 595g others)
    let silverNisab = 0;
    let goldNisab = 0;
    if (fiqh === 'hanafi') {
      silverNisab = 612.36 * silverPrice;
      goldNisab = 87.48 * goldPrice;
    } else {
      silverNisab = 595 * silverPrice;
      goldNisab = 85 * goldPrice;
    }

    // Applicable Nisab Standard:
    // If wealth consists purely of gold with zero cash/business/silver, gold Nisab applies.
    // In all mixed asset portfolios, classical scholarly consensus uses Silver Nisab to maximize benefit for the impoverished.
    const hasMixedAssets =
      cashTotal + businessTotal + investmentsTotal + rawSilverValue > 0;
    const applicableNisab = hasMixedAssets
      ? silverNisab
      : rawGoldValue > 0
      ? goldNisab
      : silverNisab;

    const isEligible = netWorth >= applicableNisab && netWorth > 0;
    const zakatPayable = isEligible ? netWorth * 0.025 : 0;
    const nisabProgress =
      applicableNisab > 0 ? Math.min(150, Math.round((netWorth / applicableNisab) * 100)) : 0;

    return {
      cashTotal,
      preciousMetalsTotal,
      businessTotal,
      investmentsTotal,
      zakatableAssets,
      deductibleLiabilities,
      netWorth,
      applicableNisab,
      silverNisab,
      goldNisab,
      isEligible,
      zakatPayable,
      nisabProgress,
      breakdown,
    };
  }, [
    assets,
    liabilities,
    fiqh,
    goldPrice,
    silverPrice,
    goldValue,
    silverValue,
    rawGoldValue,
    rawSilverValue,
  ]);

  // Handle Print
  const handlePrint = () => {
    if (typeof window !== 'undefined' && window.print) {
      window.print();
    }
  };

  // Copy Summary to Clipboard
  const handleCopySummary = async () => {
    const summaryText = `--- ZAKAT ASSESSMENT SUMMARY ---
School of Thought: ${fiqh.toUpperCase()}
Total Zakatable Assets: ${currencySymbol} ${calculations.zakatableAssets.toLocaleString()}
Deductible Liabilities: - ${currencySymbol} ${calculations.deductibleLiabilities.toLocaleString()}
Net Wealth: ${currencySymbol} ${calculations.netWorth.toLocaleString()}
Nisab Threshold: ${currencySymbol} ${calculations.applicableNisab.toLocaleString(undefined, { maximumFractionDigits: 0 })}
Status: ${calculations.isEligible ? 'ZAKAT OBLIGATORY' : 'BELOW NISAB'}
Total Zakat Payable (2.5%): ${currencySymbol} ${calculations.zakatPayable.toLocaleString(undefined, { maximumFractionDigits: 0 })}

Calculated on ${new Date().toLocaleDateString()} using MyZakat (Il An Noor Foundation).`;

    try {
      if (navigator?.clipboard?.writeText) {
        await navigator.clipboard.writeText(summaryText);
        setCopiedSummary(true);
        setTimeout(() => setCopiedSummary(false), 2500);
      }
    } catch {
      /* ignore */
    }
  };

  const faqItems = [
    {
      q: 'How is the Nisab threshold calculated?',
      a: 'Nisab is the minimum net wealth a Muslim must possess for one lunar year before Zakat becomes obligatory. It is defined as 87.48 grams of gold or 612.36 grams of silver in Hanafi fiqh (85g gold / 595g silver in Shafi\'i, Maliki, and Hanbali). When a person holds mixed assets (such as cash, investments, or trade goods), classical scholars agree on applying the silver Nisab threshold because it ensures greater social assistance reaches the poor.',
    },
    {
      q: 'Why does personal jewelry differ between Hanafi and other Madhabs?',
      a: 'In the Hanafi school of thought, all gold and silver is zakatable, even if crafted into jewelry and actively worn for personal adornment. In the Shafi\'i, Maliki, and Hanbali schools, gold and silver jewelry kept for lawful personal use within reasonable customary limits is considered a personal possession and exempt from Zakat.',
    },
    {
      q: 'Which debts and liabilities can I deduct?',
      a: 'In the majority of schools (Hanafi, Maliki, Hanbali), you may deduct immediate debts—such as bills due this month, immediate loan payments, or short-term trade debts. Long-term debts (like a 20-year home mortgage) cannot be deducted in their full principal amount; only the immediate installment due in the current calculation period is deductible. In Shafi\'i fiqh, debts do not offset zakatable wealth directly.',
    },
    {
      q: 'Why is the standard rate 2.5%?',
      a: 'The Prophet Muhammad (ﷺ) established the standard rate of Zakat on wealth, currency, and trade goods at one-fortieth (1/40th), which corresponds exactly to 2.5% per lunar year (or ~2.577% if calculating according to the longer Gregorian solar calendar).',
    },
    {
      q: 'Is any of my financial data recorded or sent to a server?',
      a: 'No. This application is completely client-side and privacy-preserving. None of your entered assets, debts, or personal numbers ever leave your device or get stored in any database.',
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50/70 text-slate-900 font-sans selection:bg-emerald-100 selection:text-emerald-900 print:bg-white print:text-black">
      {/* Print Styles */}
      <style>{`
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

          .print-only {
            display: block;
          }

          .no-print {
            display: none !important;
          }

          input, select {
            border: none !important;
            padding: 0 !important;
            background: transparent !important;
          }
        }
      `}</style>

      {/* --- TOP PARTNERSHIP BAR --- */}
      <nav className="bg-slate-900 text-slate-300 text-xs border-b border-slate-800 no-print">
        <div className="max-w-6xl mx-auto px-4 py-2.5 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="text-slate-400">
              In Collaboration with{' '}
              <a
                href="https://www.ilannoor.org/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white hover:text-emerald-300 font-semibold underline decoration-emerald-500/60 underline-offset-2 transition-colors"
              >
                Il An Noor Foundation
              </a>
            </span>
          </div>

          <div className="flex items-center gap-4 text-xs">
            <span className="hidden sm:inline-flex items-center gap-1.5 text-slate-400">
              <Lock size={12} className="text-emerald-400" />
              100% Private (No data saved)
            </span>
            <a
              href="mailto:ilannoorirc@gmail.com"
              className="text-slate-400 hover:text-white transition-colors inline-flex items-center gap-1"
            >
              <Mail size={12} /> ilannoorirc@gmail.com
            </a>
          </div>
        </div>
      </nav>

      {/* --- HERO & CONTROLS DECK --- */}
      <header className="relative bg-gradient-to-b from-emerald-950 via-emerald-900 to-slate-900 text-white overflow-hidden no-print pb-16 sm:pb-20">
        {/* Subtle background glow and geometric pattern */}
        <div className="absolute inset-0 bg-islamic-pattern opacity-15 pointer-events-none" />
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-1/2 -left-24 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative max-w-6xl mx-auto px-4 pt-8 sm:pt-12">
          {/* Hero Branding */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 mb-8">
            <div className="max-w-xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-800/60 border border-emerald-600/40 text-emerald-200 text-xs font-semibold mb-3 backdrop-blur-md">
                <Sparkles size={13} className="text-amber-300" />
                <span>Shariah Aligned • Instant Calculation</span>
              </div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-tight">
                Zakat Calculator
              </h1>
              <p className="mt-2.5 text-emerald-100/90 text-sm sm:text-base leading-relaxed">
                Determine your annual Zakat with scholarly precision, live gold & silver rates, and multi-school Fiqh compliance.
              </p>
            </div>

            {/* Quick Settings Deck */}
            <div className="w-full lg:w-auto flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              {/* Fiqh Selector */}
              <div className="flex-1 sm:flex-initial">
                <label className="block text-[11px] font-semibold text-emerald-200 uppercase tracking-wider mb-1">
                  School of Thought
                </label>
                <div className="relative">
                  <select
                    value={fiqh}
                    onChange={(e) => setFiqh(e.target.value as FiqhType)}
                    className="w-full sm:w-44 appearance-none bg-emerald-900/80 hover:bg-emerald-800/90 text-white font-medium text-sm rounded-xl px-3.5 py-2.5 pr-9 border border-emerald-600/50 outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent transition-all cursor-pointer backdrop-blur-sm"
                  >
                    <option value="hanafi" className="bg-slate-900 text-white">Hanafi</option>
                    <option value="shafii" className="bg-slate-900 text-white">Shafi&apos;i</option>
                    <option value="maliki" className="bg-slate-900 text-white">Maliki</option>
                    <option value="hanbali" className="bg-slate-900 text-white">Hanbali</option>
                    <option value="unspecified" className="bg-slate-900 text-white">Unspecified</option>
                  </select>
                  <ChevronDown
                    size={16}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-emerald-300 pointer-events-none"
                  />
                </div>
              </div>

              {/* Currency Selector */}
              <div className="flex-1 sm:flex-initial">
                <label className="block text-[11px] font-semibold text-emerald-200 uppercase tracking-wider mb-1">
                  Base Currency
                </label>
                <div className="relative">
                  <select
                    value={currency}
                    onChange={(e) => setCurrency(e.target.value)}
                    className="w-full sm:w-36 appearance-none bg-emerald-900/80 hover:bg-emerald-800/90 text-white font-medium text-sm rounded-xl px-3.5 py-2.5 pr-9 border border-emerald-600/50 outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent transition-all cursor-pointer backdrop-blur-sm"
                  >
                    <option value="INR" className="bg-slate-900 text-white">INR (₹)</option>
                    <option value="USD" className="bg-slate-900 text-white">USD ($)</option>
                    <option value="EUR" className="bg-slate-900 text-white">EUR (€)</option>
                    <option value="GBP" className="bg-slate-900 text-white">GBP (£)</option>
                    <option value="AED" className="bg-slate-900 text-white">AED (د.إ)</option>
                    <option value="SAR" className="bg-slate-900 text-white">SAR (﷼)</option>
                  </select>
                  <ChevronDown
                    size={16}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-emerald-300 pointer-events-none"
                  />
                </div>
              </div>

              {/* Fiqh Explanation Trigger Button */}
              <div className="sm:self-end">
                <button
                  type="button"
                  onClick={() => setShowFiqhModal(true)}
                  className="w-full sm:w-auto h-11 px-3.5 rounded-xl bg-emerald-800/50 hover:bg-emerald-700/60 border border-emerald-600/40 text-emerald-100 text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                >
                  <Scale size={14} className="text-amber-300" />
                  <span>Fiqh Rulings</span>
                </button>
              </div>
            </div>
          </div>

          {/* Market Rates Strip */}
          <div className="glass-panel-dark rounded-2xl p-4 sm:p-5 border border-emerald-600/30">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3 pb-3 border-b border-emerald-700/40">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                <span className="text-xs font-semibold uppercase tracking-wider text-emerald-200">
                  Precious Metals Valuation Benchmark
                </span>
                <span className="text-[11px] text-emerald-300/80 hidden md:inline">
                  • Mumbai, India (14/03/2026)
                </span>
              </div>
              <button
                type="button"
                onClick={() => setIsEditingRates((prev) => !prev)}
                className="text-xs font-medium text-emerald-200 hover:text-white inline-flex items-center gap-1.5 transition-colors cursor-pointer self-start sm:self-auto"
              >
                <SlidersHorizontal size={13} />
                <span>{isEditingRates ? 'Done Customizing' : 'Adjust Live Rates'}</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
              {/* Gold 24K */}
              <div className="bg-emerald-950/60 rounded-xl p-3 border border-emerald-700/30">
                <div className="flex items-center justify-between text-xs text-emerald-300 mb-1">
                  <span className="font-medium flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-amber-400" /> Gold (24K / gram)
                  </span>
                  <span className="text-[10px] text-emerald-400 font-mono">99.9% Pure</span>
                </div>
                {isEditingRates ? (
                  <div className="flex items-center gap-1 mt-1 border-b border-amber-400/60 pb-0.5">
                    <span className="text-amber-300 font-semibold">{currencySymbol}</span>
                    <input
                      type="number"
                      step="any"
                      value={goldPrice}
                      onChange={(e) => {
                        const parsed = parseFloat(e.target.value);
                        setGoldPrice(Number.isFinite(parsed) ? Math.max(0, parsed) : 0);
                      }}
                      className="w-full bg-transparent text-white font-bold text-base outline-none font-tabular"
                    />
                  </div>
                ) : (
                  <p className="text-lg font-bold text-white font-tabular mt-0.5">
                    {currencySymbol}{' '}
                    {goldPrice.toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </p>
                )}
                <p className="text-[11px] text-emerald-300/70 mt-1">
                  Nisab (Hanafi: 87.48g): {currencySymbol}{' '}
                  {Math.round(calculations.goldNisab).toLocaleString()}
                </p>
              </div>

              {/* Silver */}
              <div className="bg-emerald-950/60 rounded-xl p-3 border border-emerald-700/30">
                <div className="flex items-center justify-between text-xs text-emerald-300 mb-1">
                  <span className="font-medium flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-slate-300" /> Silver (per gram)
                  </span>
                  <span className="text-[10px] text-emerald-400 font-mono">Fine Silver</span>
                </div>
                {isEditingRates ? (
                  <div className="flex items-center gap-1 mt-1 border-b border-slate-300/60 pb-0.5">
                    <span className="text-slate-200 font-semibold">{currencySymbol}</span>
                    <input
                      type="number"
                      step="any"
                      value={silverPrice}
                      onChange={(e) => {
                        const parsed = parseFloat(e.target.value);
                        setSilverPrice(Number.isFinite(parsed) ? Math.max(0, parsed) : 0);
                      }}
                      className="w-full bg-transparent text-white font-bold text-base outline-none font-tabular"
                    />
                  </div>
                ) : (
                  <p className="text-lg font-bold text-white font-tabular mt-0.5">
                    {currencySymbol}{' '}
                    {silverPrice.toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </p>
                )}
                <p className="text-[11px] text-emerald-300/70 mt-1">
                  Nisab (Hanafi: 612.36g): {currencySymbol}{' '}
                  {Math.round(calculations.silverNisab).toLocaleString()}
                </p>
              </div>

              {/* Active Nisab Rule */}
              <div className="bg-emerald-950/60 rounded-xl p-3 border border-emerald-700/30 lg:col-span-2 flex flex-col justify-center">
                <div className="flex items-center justify-between text-xs text-emerald-200 mb-1">
                  <span className="font-semibold flex items-center gap-1.5">
                    <Scale size={13} className="text-amber-300" /> Active Nisab Threshold
                  </span>
                  <span className="text-[11px] font-bold text-amber-300 font-tabular">
                    {currencySymbol}{' '}
                    {Math.round(calculations.applicableNisab).toLocaleString()}
                  </span>
                </div>
                <p className="text-xs text-emerald-100/80 leading-relaxed">
                  Calculated using the <strong>Silver Standard</strong> ({fiqh === 'hanafi' ? '612.36g' : '595g'}), which majority scholarship favors for modern diversified assets to provide broader aid to the needy.
                </p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* --- MAIN WORKSPACE --- */}
      <main className="max-w-6xl mx-auto px-4 -mt-8 pb-16 sm:pb-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* LEFT 7 COLUMNS: Calculator Inputs */}
          <div className="lg:col-span-7 space-y-5">
            {/* Header controls for resetting / collapsing */}
            <div className="flex items-center justify-between px-1 no-print">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Asset Categories
              </span>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={handleResetForm}
                  className="text-xs font-medium text-slate-500 hover:text-red-600 inline-flex items-center gap-1 transition-colors cursor-pointer"
                >
                  <RotateCcw size={13} /> Reset All
                </button>
              </div>
            </div>

            {/* 1. Cash & Liquid Assets */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200/80 overflow-hidden no-print">
              <SectionHeader
                icon={Wallet}
                title="Cash & Liquid Assets"
                subtitle="Currency on hand, bank balances & electronic wallets"
                isOpen={sections.cash}
                toggle={() => toggleSection('cash')}
                total={calculations.cashTotal}
                currency={currencySymbol}
              />
              {sections.cash && (
                <div className="p-5 sm:p-6 bg-white animate-in slide-in-from-top-1 duration-150">
                  <InputGroup
                    id="cash-on-hand"
                    label="Cash on Hand"
                    value={assets.cashInHand}
                    onChange={(v) => updateAsset('cashInHand', v)}
                    tooltip="Physical currency notes, coins, and immediate petty cash."
                    currencySymbol={currencySymbol}
                  />
                  <InputGroup
                    id="bank-deposits"
                    label="Bank Account Balances"
                    value={assets.bankDeposit}
                    onChange={(v) => updateAsset('bankDeposit', v)}
                    sublabel="Savings, current, checking accounts and fixed deposit balances."
                    tooltip="Include all bank accounts under your ownership."
                    currencySymbol={currencySymbol}
                  />
                  <InputGroup
                    id="digital-wallets"
                    label="Digital Wallets & Fintech"
                    value={assets.digitalWallets}
                    onChange={(v) => updateAsset('digitalWallets', v)}
                    sublabel="UPI, Paytm, PayPal, Apple Pay, Wise, or balance in payment apps."
                    currencySymbol={currencySymbol}
                  />
                </div>
              )}
            </div>

            {/* 2. Gold & Silver */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200/80 overflow-hidden no-print">
              <SectionHeader
                icon={Gem}
                title="Gold & Silver"
                subtitle="Bullion, bars, coins, and personal precious jewelry"
                isOpen={sections.gold}
                toggle={() => toggleSection('gold')}
                total={calculations.preciousMetalsTotal}
                currency={currencySymbol}
              />
              {sections.gold && (
                <div className="p-5 sm:p-6 bg-white animate-in slide-in-from-top-1 duration-150">
                  {/* Gold items */}
                  <div className="mb-5">
                    <div className="flex items-center justify-between mb-3">
                      <label className="text-sm font-semibold text-slate-800">
                        Gold Holdings
                      </label>
                      <span className="text-xs text-slate-500">
                        Total: {assets.goldItems.reduce((acc, curr) => acc + curr.grams, 0).toFixed(2)}g
                      </span>
                    </div>

                    <div className="space-y-3">
                      {assets.goldItems.map((item, index) => {
                        const itemVal = item.grams * goldPrice * (item.karat / 24);
                        return (
                          <div
                            key={item.id || index}
                            className="p-3 sm:p-3.5 bg-slate-50/80 rounded-xl border border-slate-200/80 flex flex-col sm:flex-row sm:items-center gap-3"
                          >
                            <div className="w-full sm:w-32 shrink-0">
                              <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1">
                                Purity / Karat
                              </label>
                              <div className="relative">
                                <select
                                  value={item.karat}
                                  onChange={(e) =>
                                    updateGoldItem(index, 'karat', Number(e.target.value))
                                  }
                                  className="w-full appearance-none bg-white border border-slate-200 text-slate-800 text-sm font-semibold rounded-lg px-2.5 py-1.5 pr-7 outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer"
                                >
                                  <option value={24}>24K (99.9%)</option>
                                  <option value={22}>22K (91.6%)</option>
                                  <option value={21}>21K (87.5%)</option>
                                  <option value={18}>18K (75.0%)</option>
                                  <option value={14}>14K (58.3%)</option>
                                  <option value={10}>10K (41.7%)</option>
                                </select>
                                <ChevronDown
                                  size={14}
                                  className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
                                />
                              </div>
                            </div>

                            <div className="flex-1">
                              <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1">
                                Weight in Grams
                              </label>
                              <div className="relative flex items-center bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 focus-within:ring-2 focus-within:ring-emerald-500">
                                <input
                                  type="number"
                                  min="0"
                                  step="0.01"
                                  value={item.grams === 0 ? '' : item.grams}
                                  onChange={(e) => {
                                    const val = parseFloat(e.target.value);
                                    updateGoldItem(index, 'grams', Number.isFinite(val) ? Math.max(0, val) : 0);
                                  }}
                                  placeholder="0.00"
                                  className="w-full bg-transparent text-sm font-semibold text-slate-900 outline-none font-tabular"
                                />
                                <span className="text-xs text-slate-400 font-medium">grams</span>
                              </div>
                            </div>

                            <div className="flex items-center justify-between sm:justify-end gap-3 sm:w-36 shrink-0 pt-1 sm:pt-0">
                              <div className="text-left sm:text-right">
                                <span className="text-[10px] text-slate-400 block uppercase tracking-wider">
                                  Worth
                                </span>
                                <span className="text-xs sm:text-sm font-bold text-slate-800 font-tabular">
                                  {currencySymbol} {Math.round(itemVal).toLocaleString()}
                                </span>
                              </div>

                              {assets.goldItems.length > 1 && (
                                <button
                                  type="button"
                                  onClick={() => removeGoldItem(index)}
                                  className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                                  title="Delete item"
                                  aria-label="Delete item"
                                >
                                  <Trash2 size={16} />
                                </button>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    <button
                      type="button"
                      onClick={addGoldItem}
                      className="mt-3 inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700 hover:text-emerald-800 bg-emerald-50 hover:bg-emerald-100/70 border border-emerald-200/60 px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
                    >
                      <Plus size={14} /> Add Another Gold Item
                    </button>
                  </div>

                  {/* Silver */}
                  <InputGroup
                    id="silver-grams"
                    label="Silver Weight"
                    value={assets.silverGrams}
                    onChange={(v) => updateAsset('silverGrams', v)}
                    sublabel={`Valued at ${currencySymbol} ${silverPrice.toFixed(2)} / gram.`}
                    currencySymbol="grams"
                    placeholder="0.00"
                  />

                  {/* Personal Jewelry Exemption Box */}
                  <div className="mt-4 p-4 rounded-xl bg-slate-50 border border-slate-200/80">
                    <Toggle
                      label="Is this gold/silver worn for personal jewelry?"
                      active={assets.goldJewelryUsage}
                      onToggle={(v) => updateAsset('goldJewelryUsage', v)}
                      badge={isJewelryExempt ? 'Exempt under this Fiqh' : 'Zakatable'}
                      tooltip="Shafi'i, Maliki, and Hanbali scholars consider reasonable personal jewelry exempt. Hanafi scholars consider all gold and silver zakatable regardless of usage."
                    />

                    <div className="mt-2 text-xs">
                      {isJewelryExempt ? (
                        <p className="text-emerald-700 flex items-center gap-1.5">
                          <Check size={14} className="shrink-0" />
                          <span>
                            Personal jewelry is <strong>exempt</strong> from Zakat in {fiqh.charAt(0).toUpperCase() + fiqh.slice(1)} fiqh (total metal worth {currencySymbol} {Math.round(rawGoldValue + rawSilverValue).toLocaleString()} excluded).
                          </span>
                        </p>
                      ) : (
                        <p className="text-amber-800 flex items-center gap-1.5">
                          <Info size={14} className="shrink-0 text-amber-600" />
                          <span>
                            Personal jewelry is <strong>zakatable</strong> in Hanafi fiqh and included in the total.
                          </span>
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* 3. Business & Commercial Assets */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200/80 overflow-hidden no-print">
              <SectionHeader
                icon={Briefcase}
                title="Business Assets"
                subtitle="Trade inventory, commercial liquid funds & receivables"
                isOpen={sections.business}
                toggle={() => toggleSection('business')}
                total={calculations.businessTotal}
                currency={currencySymbol}
              />
              {sections.business && (
                <div className="p-5 sm:p-6 bg-white animate-in slide-in-from-top-1 duration-150">
                  <InputGroup
                    id="business-stock"
                    label="Market Value of Saleable Stock / Inventory"
                    value={assets.businessStock}
                    onChange={(v) => updateAsset('businessStock', v)}
                    sublabel="Wholesale/retail market selling value of goods ready for sale (exclude fixed equipment, machines, or office furniture)."
                    tooltip="Only goods held for trade or resale are zakatable."
                    currencySymbol={currencySymbol}
                  />
                  <InputGroup
                    id="business-cash"
                    label="Cash in Business Accounts"
                    value={assets.businessCash}
                    onChange={(v) => updateAsset('businessCash', v)}
                    sublabel="Liquid commercial bank balances and trade operating funds."
                    currencySymbol={currencySymbol}
                  />
                  <InputGroup
                    id="receivables"
                    label="Good Receivables / Trade Invoices"
                    value={assets.receivables}
                    onChange={(v) => updateAsset('receivables', v)}
                    sublabel="Money owed to you that you genuinely expect to collect within the year."
                    tooltip="Bad debts that are doubtful or unlikely to be recovered are excluded."
                    currencySymbol={currencySymbol}
                  />
                </div>
              )}
            </div>

            {/* 4. Investments */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200/80 overflow-hidden no-print">
              <SectionHeader
                icon={TrendingUp}
                title="Investments & Modern Assets"
                subtitle="Public equities, mutual funds & cryptocurrency"
                isOpen={sections.investments}
                toggle={() => toggleSection('investments')}
                total={calculations.investmentsTotal}
                currency={currencySymbol}
              />
              {sections.investments && (
                <div className="p-5 sm:p-6 bg-white animate-in slide-in-from-top-1 duration-150">
                  <InputGroup
                    id="stocks-value"
                    label="Stocks, Equities & Mutual Funds"
                    value={assets.stocksValue}
                    onChange={(v) => updateAsset('stocksValue', v)}
                    sublabel="For short-term trading, enter full market value. For long-term holding, enter value of underlying zakatable assets."
                    currencySymbol={currencySymbol}
                  />
                  <InputGroup
                    id="crypto-value"
                    label="Cryptocurrency Holdings"
                    value={assets.cryptoValue}
                    onChange={(v) => updateAsset('cryptoValue', v)}
                    sublabel="Bitcoin, Ethereum, Stablecoins, and tokens at current market valuation."
                    currencySymbol={currencySymbol}
                  />
                </div>
              )}
            </div>

            {/* 5. Liabilities */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200/80 overflow-hidden no-print">
              <SectionHeader
                icon={CreditCard}
                title="Deductible Liabilities"
                subtitle="Immediate debts, bills, and short-term obligations"
                isOpen={sections.liabilities}
                toggle={() => toggleSection('liabilities')}
                total={calculations.deductibleLiabilities}
                currency={currencySymbol}
              />
              {sections.liabilities && (
                <div className="p-5 sm:p-6 bg-white animate-in slide-in-from-top-1 duration-150">
                  {fiqh === 'shafii' && (
                    <div className="mb-4 p-3 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 leading-relaxed">
                      <strong>Shafi&apos;i Fiqh Ruling:</strong> In the Shafi&apos;i school, debts owed to others do not deduct from your zakatable assets if you currently possess the assets.
                    </div>
                  )}
                  <InputGroup
                    id="immediate-debts"
                    label="Immediate Debts & Short-term Dues"
                    value={liabilities.immediateDebts}
                    onChange={(v) => updateLiability('immediateDebts', v)}
                    sublabel="Outstanding utility bills, rent due, immediate credit card balances, or upcoming loan payments."
                    tooltip="Do not deduct total long-term mortgage principal—only the immediate installment due in this period."
                    currencySymbol={currencySymbol}
                  />
                </div>
              )}
            </div>
          </div>

          {/* RIGHT 5 COLUMNS: Sticky Summary & Community Deck */}
          <div className="lg:col-span-5 space-y-6 lg:sticky lg:top-6 no-print">
            {/* Primary Result Card */}
            <div className="bg-white rounded-2xl shadow-lg border border-emerald-100 overflow-hidden transition-all">
              {/* Card Header */}
              <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-emerald-950 text-white p-5 sm:p-6 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/20 rounded-full blur-2xl pointer-events-none" />
                <div className="flex items-center justify-between relative z-10">
                  <div>
                    <h2 className="text-lg sm:text-xl font-bold flex items-center gap-2">
                      <Calculator size={18} className="text-emerald-400" />
                      Zakat Summary
                    </h2>
                    <p className="text-xs text-slate-300 mt-0.5">
                      Ruling based on <strong>{fiqh.charAt(0).toUpperCase() + fiqh.slice(1)} Fiqh</strong>
                    </p>
                  </div>
                  <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-900/80 text-emerald-200 border border-emerald-600/50 uppercase tracking-wider">
                    {currency}
                  </span>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-5 sm:p-6">
                {/* Nisab Progress Bar */}
                <div className="mb-5 p-4 rounded-xl bg-slate-50 border border-slate-200/80">
                  <div className="flex items-center justify-between text-xs mb-1.5">
                    <span className="font-semibold text-slate-700">Nisab Threshold Status</span>
                    <span className="font-bold text-slate-900 font-tabular">
                      {calculations.nisabProgress}% Reached
                    </span>
                  </div>
                  <div className="w-full h-2.5 bg-slate-200 rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all duration-300 ${
                        calculations.isEligible ? 'bg-emerald-600' : 'bg-amber-500'
                      }`}
                      style={{ width: `${Math.min(100, calculations.nisabProgress)}%` }}
                    />
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-slate-500 mt-2">
                    <span>Threshold: {currencySymbol} {Math.round(calculations.applicableNisab).toLocaleString()}</span>
                    {calculations.isEligible ? (
                      <span className="text-emerald-700 font-bold flex items-center gap-1">
                        <Check size={12} /> Nisab Met
                      </span>
                    ) : (
                      <span className="text-amber-700 font-medium">Below Nisab</span>
                    )}
                  </div>
                </div>

                {/* Ledger Breakdown */}
                <div className="space-y-3 text-sm pb-4 border-b border-slate-100">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-600">Total Zakatable Assets</span>
                    <span className="font-semibold text-slate-900 font-tabular">
                      {currencySymbol} {calculations.zakatableAssets.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 2 })}
                    </span>
                  </div>

                  {calculations.deductibleLiabilities > 0 && (
                    <div className="flex justify-between items-center text-red-600">
                      <span>Deductible Liabilities</span>
                      <span className="font-semibold font-tabular">
                        - {currencySymbol} {calculations.deductibleLiabilities.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 2 })}
                      </span>
                    </div>
                  )}

                  <div className="flex justify-between items-center pt-2 border-t border-slate-100 font-bold text-slate-900">
                    <span>Net Zakatable Wealth</span>
                    <span className="text-base font-tabular">
                      {currencySymbol} {calculations.netWorth.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 2 })}
                    </span>
                  </div>
                </div>

                {/* Allocation visualizer when multiple assets exist */}
                {calculations.breakdown.length > 1 && (
                  <div className="py-4 border-b border-slate-100">
                    <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block mb-2">
                      Portfolio Distribution
                    </span>
                    <div className="h-2 w-full rounded-full flex overflow-hidden gap-0.5 bg-slate-100">
                      {calculations.breakdown.map((item, i) => {
                        const pct = (item.amount / calculations.zakatableAssets) * 100;
                        return (
                          <div
                            key={i}
                            title={`${item.label}: ${pct.toFixed(1)}%`}
                            style={{ width: `${pct}%`, backgroundColor: item.color }}
                            className="h-full first:rounded-l-full last:rounded-r-full"
                          />
                        );
                      })}
                    </div>
                    <div className="flex flex-wrap gap-x-3 gap-y-1 mt-2 text-[11px] text-slate-500">
                      {calculations.breakdown.map((item, i) => (
                        <div key={i} className="flex items-center gap-1">
                          <span
                            className="w-2 h-2 rounded-full shrink-0"
                            style={{ backgroundColor: item.color }}
                          />
                          <span className="truncate">{item.label}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Final Payable Hero Block */}
                <div className="mt-5 p-5 rounded-2xl bg-gradient-to-br from-emerald-50 via-emerald-100/50 to-teal-50 border border-emerald-200/80 text-center relative overflow-hidden">
                  <p className="text-xs font-semibold text-emerald-800 uppercase tracking-wider mb-1">
                    Total Zakat Payable (2.5%)
                  </p>
                  <p className="text-3xl sm:text-4xl font-extrabold text-emerald-900 font-tabular tracking-tight">
                    {currencySymbol}{' '}
                    {calculations.isEligible
                      ? calculations.zakatPayable.toLocaleString(undefined, {
                          minimumFractionDigits: 0,
                          maximumFractionDigits: 2,
                        })
                      : '0.00'}
                  </p>

                  <p className="text-xs text-emerald-700/90 mt-1.5">
                    {calculations.isEligible
                      ? 'One-fortieth (1/40th) of net wealth'
                      : 'Net wealth has not reached the required Nisab threshold.'}
                  </p>
                </div>

                {/* Primary Actions */}
                <div className="grid grid-cols-2 gap-2 mt-4">
                  <button
                    type="button"
                    onClick={handlePrint}
                    className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold transition-all cursor-pointer shadow-xs"
                  >
                    <Download size={14} /> Print / Save PDF
                  </button>
                  <button
                    type="button"
                    onClick={handleCopySummary}
                    className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold transition-all cursor-pointer"
                  >
                    {copiedSummary ? <Check size={14} className="text-emerald-600" /> : <Copy size={14} />}
                    {copiedSummary ? 'Copied!' : 'Copy Summary'}
                  </button>
                </div>
              </div>
            </div>

            {/* Donation Card */}
            <PayZakatCard
              zakatAmount={calculations.zakatPayable}
              currency={currency}
              currencySymbol={currencySymbol}
            />

            {/* Share Card */}
            <ShareCard />

            {/* Scholar Consultation Card */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200/80 p-5 sm:p-6 no-print">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-100">
                    <HelpCircle className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 text-sm leading-tight">
                      Scholarly Consultation
                    </h3>
                    <p className="text-xs text-slate-500">Have questions about complex assets?</p>
                  </div>
                </div>
                <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200/50">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> Available
                </span>
              </div>

              <p className="text-xs text-slate-600 mb-4 leading-relaxed">
                Connect with{' '}
                <strong>{fiqh === 'shafii' ? 'Mufti Sohail' : 'Mufti Danish'}</strong> directly for qualified guidance regarding specific family, business, or estate rulings.
              </p>

              <div className="grid grid-cols-2 gap-2">
                <a
                  href={`whatsapp://send?phone=${
                    fiqh === 'shafii' ? '919324656650' : '918104998499'
                  }`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200 font-semibold text-xs transition-colors"
                >
                  <MessageCircle size={15} /> WhatsApp
                </a>
                <a
                  href={`tel:${fiqh === 'shafii' ? '+919324656650' : '+918104998499'}`}
                  className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-slate-50 text-slate-700 hover:bg-slate-100 border border-slate-200 font-semibold text-xs transition-colors"
                >
                  <Phone size={15} /> Direct Call
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* --- FREQUENTLY ASKED QUESTIONS SECTION --- */}
        <section className="mt-16 sm:mt-20 max-w-4xl mx-auto no-print">
          <div className="text-center mb-8">
            <span className="text-xs font-semibold text-emerald-700 uppercase tracking-wider bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200/60">
              Clear Guidance
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-2">
              Frequently Asked Questions
            </h2>
            <p className="text-sm text-slate-500 mt-1 max-w-lg mx-auto">
              Answers to common queries regarding Zakat computation, asset classifications, and Madhab rulings.
            </p>
          </div>

          <div className="space-y-3">
            {faqItems.map((item, index) => {
              const isOpen = openFaqIndex === index;
              return (
                <div
                  key={index}
                  className="bg-white rounded-xl border border-slate-200/80 overflow-hidden shadow-2xs"
                >
                  <button
                    type="button"
                    onClick={() => setOpenFaqIndex(isOpen ? null : index)}
                    className="w-full flex items-center justify-between p-4 sm:p-5 text-left font-semibold text-slate-900 text-sm sm:text-base hover:bg-slate-50/60 transition-colors cursor-pointer"
                  >
                    <span>{item.q}</span>
                    <span className="ml-3 shrink-0 text-slate-400">
                      {isOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                    </span>
                  </button>
                  {isOpen && (
                    <div className="px-4 pb-5 sm:px-5 sm:pb-5 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-100 pt-3">
                      {item.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>
      </main>

      {/* --- FLOATING MOBILE SUMMARY BAR (Mobile Responsive Guard) --- */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 p-3 sm:p-4 shadow-xl no-print">
        <div className="flex items-center justify-between gap-3 max-w-md mx-auto">
          <div className="min-w-0">
            <div className="flex items-center gap-1.5 text-xs text-slate-500">
              <span>Zakat Due (2.5%)</span>
              <span
                className={`text-[10px] font-bold px-1.5 py-0.2 rounded ${
                  calculations.isEligible ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-600'
                }`}
              >
                {calculations.isEligible ? 'Due' : 'Below Nisab'}
              </span>
            </div>
            <p className="text-lg font-extrabold text-slate-900 font-tabular">
              {currencySymbol}{' '}
              {calculations.isEligible
                ? calculations.zakatPayable.toLocaleString(undefined, {
                    maximumFractionDigits: 0,
                  })
                : '0'}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePrint}
              aria-label="Download statement"
              className="p-2.5 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-100 cursor-pointer"
            >
              <Download size={18} />
            </button>
            <a
              href={`https://www.ilannoor.org/payments?type=zakat&amount=${Math.floor(
                calculations.zakatPayable
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs sm:text-sm py-2.5 px-4 rounded-xl shadow-sm inline-flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
            >
              {calculations.zakatPayable > 0 ? 'Fulfill Zakat' : 'Donate'}
              <ArrowRight size={14} />
            </a>
          </div>
        </div>
      </div>

      {/* --- FOOTER --- */}
      <footer className="bg-slate-900 text-slate-400 py-14 border-t border-slate-800 no-print">
        <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 text-sm">
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-white font-bold text-lg">
              <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center text-white">
                <Calculator size={18} />
              </div>
              <span>Il An Noor</span>
            </div>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
              Empowering the Ummah with scholarly knowledge, transparent charitable aid, and modern civic tools.
            </p>
            <div className="flex gap-3 pt-1">
              <a
                href="https://www.ilannoor.org"
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white flex items-center justify-center transition-colors"
                aria-label="Foundation Website"
              >
                <Globe size={16} />
              </a>
              <a
                href="mailto:ilannoorirc@gmail.com"
                className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white flex items-center justify-center transition-colors"
                aria-label="Email Foundation"
              >
                <Mail size={16} />
              </a>
            </div>
          </div>

          <div>
            <h4 className="text-white font-bold text-sm mb-4">Location & Center</h4>
            <ul className="space-y-2.5 text-xs text-slate-400">
              <li className="flex items-start gap-2">
                <MapPin size={15} className="mt-0.5 text-emerald-400 shrink-0" />
                <span>Il An Noor Library, Sapphire CHS, Sector 35F, Kharghar, Navi Mumbai</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail size={15} className="text-emerald-400 shrink-0" /> ilannoorirc@gmail.com
              </li>
              <li className="flex items-center gap-2">
                <Phone size={15} className="text-emerald-400 shrink-0" /> +91 8104998499
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold text-sm mb-4">Scholarly Verification</h4>
            <p className="text-xs text-slate-400 leading-relaxed mb-3">
              Calculations reviewed under supervision of Mufti Danish and Mufti Sohail according to classical texts of Fiqh.
            </p>
            <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-emerald-400 bg-emerald-950/60 px-2.5 py-1 rounded-full border border-emerald-800/50">
              <ShieldCheck size={13} /> Verified Shariah Logic
            </span>
          </div>

          <div className="space-y-3">
            <h4 className="text-white font-bold text-sm">Engineering & Design</h4>
            <p className="text-xs text-slate-400">
              Engineered with care and dedication by
            </p>
            <a
              href="https://abdurrahmanshkh.vercel.app/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-emerald-400 hover:text-emerald-300 font-semibold inline-flex items-center gap-1 text-sm transition-colors"
            >
              Abdur Rehman Shaikh <ExternalLink size={13} />
            </a>
            <p className="text-[11px] text-slate-500 leading-normal pt-2">
              Disclaimer: This calculator provides an accurate estimate based on standard Fiqh opinions. For complex estates or corporate assets, kindly consult a qualified scholar.
            </p>
          </div>
        </div>
      </footer>

      {/* --- FIQH MODAL (Detailed rulings explanation) --- */}
      {showFiqhModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs no-print">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <div className="flex items-center gap-2">
                <Scale className="w-5 h-5 text-emerald-600" />
                <h3 className="font-bold text-slate-900 text-lg">School of Thought (Fiqh) Rulings</h3>
              </div>
              <button
                type="button"
                onClick={() => setShowFiqhModal(false)}
                className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-100 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs sm:text-sm text-slate-600 leading-relaxed max-h-[70vh] overflow-y-auto pr-1">
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <h4 className="font-bold text-slate-900 mb-1">1. Personal Jewelry Exemption</h4>
                <p>
                  <strong>Hanafi:</strong> All gold and silver items are subject to Zakat, even if worn routinely as personal jewelry.
                </p>
                <p className="mt-1">
                  <strong>Shafi&apos;i, Maliki, Hanbali:</strong> Gold and silver jewelry kept solely for lawful personal use is exempt from Zakat.
                </p>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <h4 className="font-bold text-slate-900 mb-1">2. Deductible Liabilities & Debts</h4>
                <p>
                  <strong>Hanafi, Maliki, Hanbali:</strong> Immediate debts due reduce your net zakatable wealth before applying Nisab.
                </p>
                <p className="mt-1">
                  <strong>Shafi&apos;i:</strong> Debts owed do not deduct from zakatable assets already in your hand.
                </p>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <h4 className="font-bold text-slate-900 mb-1">3. Nisab Standards</h4>
                <p>
                  Gold Nisab is 87.48 grams (Hanafi) vs 85 grams (other schools). Silver Nisab is 612.36 grams (Hanafi) vs 595 grams (other schools). When holding mixed assets, the silver standard is applied in accord with classical consensus to benefit the needy.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setShowFiqhModal(false)}
              className="mt-5 w-full py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs sm:text-sm transition-colors cursor-pointer"
            >
              Understood
            </button>
          </div>
        </div>
      )}

      {/* --- PRINTABLE REPORT VIEW (Official Assessment Document) --- */}
      <div className="print-only p-10 max-w-3xl mx-auto print-area bg-white text-slate-900">
        {/* Document Header */}
        <div className="flex justify-between items-start border-b-2 border-slate-900 pb-6 mb-6">
          <div>
            <span className="text-xs uppercase tracking-widest text-emerald-800 font-bold block mb-1">
              Official Assessment Record
            </span>
            <h1 className="text-3xl font-extrabold text-slate-900">Zakat Calculation Statement</h1>
            <p className="text-xs text-slate-600 mt-1">
              Assessment Date: {new Date().toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
          </div>
          <div className="text-right">
            <h2 className="font-bold text-lg text-emerald-900">Il An Noor Foundation</h2>
            <p className="text-xs text-slate-600">Navi Mumbai, Maharashtra</p>
            <p className="text-xs text-slate-500">Supervision: Mufti Danish & Mufti Sohail</p>
          </div>
        </div>

        {/* Calculation Parameters */}
        <div className="grid grid-cols-2 gap-6 p-4 rounded-lg bg-slate-50 border border-slate-200 mb-6 text-xs">
          <div>
            <h3 className="font-bold text-slate-900 mb-2 uppercase tracking-wider text-[11px]">
              Parameters & Standards
            </h3>
            <div className="space-y-1">
              <div className="flex justify-between">
                <span className="text-slate-600">Fiqh School:</span>
                <span className="font-semibold uppercase">{fiqh}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Currency:</span>
                <span className="font-semibold">{currency}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Gold Valuation (24K):</span>
                <span className="font-semibold">{currencySymbol} {goldPrice}/g</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Silver Valuation:</span>
                <span className="font-semibold">{currencySymbol} {silverPrice}/g</span>
              </div>
            </div>
          </div>

          <div>
            <h3 className="font-bold text-slate-900 mb-2 uppercase tracking-wider text-[11px]">
              Nisab & Eligibility
            </h3>
            <div className="space-y-1">
              <div className="flex justify-between">
                <span className="text-slate-600">Applied Standard:</span>
                <span className="font-semibold">Silver Benchmark</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Nisab Threshold:</span>
                <span className="font-semibold">
                  {currencySymbol} {Math.round(calculations.applicableNisab).toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Net Wealth:</span>
                <span className="font-bold">
                  {currencySymbol} {calculations.netWorth.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Obligation Status:</span>
                <span className="font-bold text-slate-900">
                  {calculations.isEligible ? 'ZAKAT OBLIGATORY' : 'BELOW NISAB THRESHOLD'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Detailed Itemized Ledger */}
        <table className="w-full text-xs mb-6 border-collapse">
          <thead>
            <tr className="border-b-2 border-slate-900 bg-slate-100">
              <th className="text-left p-2.5 font-bold text-slate-800">Asset Category / Ledger Class</th>
              <th className="text-right p-2.5 font-bold text-slate-800">Zakatable Amount ({currencySymbol})</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-slate-200">
              <td className="p-2.5 text-slate-700">Cash, Bank Accounts & Digital Liquid Assets</td>
              <td className="p-2.5 text-right font-medium">
                {calculations.cashTotal.toLocaleString(undefined, { minimumFractionDigits: 2 })}
              </td>
            </tr>
            <tr className="border-b border-slate-200">
              <td className="p-2.5 text-slate-700">
                Gold & Silver Valuations {isJewelryExempt ? '(Personal jewelry exempted)' : ''}
              </td>
              <td className="p-2.5 text-right font-medium">
                {calculations.preciousMetalsTotal.toLocaleString(undefined, { minimumFractionDigits: 2 })}
              </td>
            </tr>
            <tr className="border-b border-slate-200">
              <td className="p-2.5 text-slate-700">Business Inventory, Operating Balances & Good Receivables</td>
              <td className="p-2.5 text-right font-medium">
                {calculations.businessTotal.toLocaleString(undefined, { minimumFractionDigits: 2 })}
              </td>
            </tr>
            <tr className="border-b border-slate-200">
              <td className="p-2.5 text-slate-700">Equities, Shares, Mutual Funds & Digital Assets</td>
              <td className="p-2.5 text-right font-medium">
                {calculations.investmentsTotal.toLocaleString(undefined, { minimumFractionDigits: 2 })}
              </td>
            </tr>
            {calculations.deductibleLiabilities > 0 && (
              <tr className="border-b border-slate-200 text-red-600">
                <td className="p-2.5">Less: Immediate Deductible Liabilities</td>
                <td className="p-2.5 text-right font-medium">
                  - {calculations.deductibleLiabilities.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                </td>
              </tr>
            )}
          </tbody>
          <tfoot>
            <tr className="border-t-2 border-slate-900 bg-slate-50 font-bold">
              <td className="p-3 text-slate-900">Total Net Zakatable Wealth</td>
              <td className="p-3 text-right text-slate-900 font-tabular">
                {currencySymbol} {calculations.netWorth.toLocaleString(undefined, { minimumFractionDigits: 2 })}
              </td>
            </tr>
            <tr className="bg-emerald-50 border-t border-emerald-200 text-emerald-950 font-bold text-sm">
              <td className="p-3.5">Total Zakat Due (2.5% of Net Wealth)</td>
              <td className="p-3.5 text-right font-tabular text-base text-emerald-900">
                {currencySymbol} {calculations.zakatPayable.toLocaleString(undefined, { minimumFractionDigits: 2 })}
              </td>
            </tr>
          </tfoot>
        </table>

        {/* Print Sign-off */}
        <div className="grid grid-cols-2 gap-8 pt-8 mt-6 border-t border-slate-300 text-xs">
          <div>
            <p className="font-semibold text-slate-800 mb-6">Assessed By:</p>
            <div className="border-b border-slate-400 w-48 mb-1" />
            <p className="text-slate-500">Signature / Seal</p>
          </div>
          <div className="text-right">
            <p className="font-semibold text-slate-800 mb-6">Verified for Payment:</p>
            <div className="border-b border-slate-400 w-48 ml-auto mb-1" />
            <p className="text-slate-500">Il An Noor Foundation Representative</p>
          </div>
        </div>

        <div className="mt-8 text-center text-[10px] text-slate-400">
          Generated via MyZakat Calculator • In Collaboration with Il An Noor Foundation • Engineered by Abdur Rehman Shaikh
        </div>
      </div>
    </div>
  );
}
