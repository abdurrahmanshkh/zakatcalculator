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
} from 'lucide-react';

/**
 * Types
 */
type FiqhType = 'hanafi' | 'shafii' | 'maliki' | 'hanbali';
type StocksStrategy = 'passive' | 'active';

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
  goldGrams: number;
  goldJewelryUsage: boolean;
  silverGrams: number;
  businessStock: number;
  businessCash: number;
  receivables: number;
  stocksValue: number;
  stocksStrategy: StocksStrategy;
  pensionAmount: number;
  pensionAccess: boolean;
  cryptoValue: number;
}

interface Liabilities {
  immediateDebts: number;
  expensesDue: number;
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

interface SectionHeaderProps {
  icon: React.ComponentType<any>;
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
    className="w-full flex items-center justify-between p-4 bg-slate-50 hover:bg-slate-100 transition-colors border-b border-slate-100 no-print"
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
    <div className="flex items-center gap-2">
      <span className="text-sm font-medium text-slate-700">{label}</span>
      {tooltip && (
        <div className="group relative no-print">
          <Info size={14} className="text-slate-400 cursor-help" />
          <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 p-2 bg-slate-800 text-white text-xs rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
            {tooltip}
          </div>
        </div>
      )}
    </div>
    <button
      onClick={() => onToggle(!active)}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 no-print ${
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

/**
 * Page component
 */
export default function App(): React.ReactElement {
  // --- State Management ---
  const [fiqh, setFiqh] = useState<FiqhType>('hanafi');

  // Currency State
  const [currency, setCurrency] = useState<string>('INR');
  const [currencySymbol, setCurrencySymbol] = useState<string>('₹');
  const [exchangeRates, setExchangeRates] = useState<Record<string, number>>({ INR: 1 });

  // Precious Metal Prices (Defaults per gram in INR)
  const [goldPrice, setGoldPrice] = useState<number>(7200.0);
  const [silverPrice, setSilverPrice] = useState<number>(92.0);

  // Expanded open/close state for sections
  const [sections, setSections] = useState<Sections>({
    cash: true,
    gold: true,
    business: true,
    investments: false,
    liabilities: true,
  });

  // Assets Data
  const [assets, setAssets] = useState<Assets>({
    cashInHand: 0,
    bankDeposit: 0,
    digitalWallets: 0,
    goldGrams: 0,
    goldJewelryUsage: true,
    silverGrams: 0,
    businessStock: 0,
    businessCash: 0,
    receivables: 0,
    stocksValue: 0,
    stocksStrategy: 'passive',
    pensionAmount: 0,
    pensionAccess: false,
    cryptoValue: 0,
  });

  // Liabilities Data
  const [liabilities, setLiabilities] = useState<Liabilities>({
    immediateDebts: 0,
    expensesDue: 0,
  });

  // --- Effects ---

  // Update Symbol when currency changes
  useEffect(() => {
    const symbols: Record<string, string> = {
      INR: '₹',
      USD: '$',
      GBP: '£',
      EUR: '€',
      AED: 'د.إ',
      SAR: '﷼',
    };
    setCurrencySymbol(symbols[currency] || '$');
  }, [currency]);

  // Fetch Currency Rates (Free API)
  const fetchRates = async (): Promise<void> => {
    try {
      const response = await fetch('https://api.exchangerate-api.com/v4/latest/INR');
      const data = await response.json();
      if (data?.rates && typeof data.rates === 'object') {
        setExchangeRates(data.rates as Record<string, number>);
      }
      // Note: We intentionally don't mutate gold/silver prices automatically here.
    } catch (error) {
      // Graceful fallback in case API fails
      // eslint-disable-next-line no-console
      console.error('Failed to fetch rates', error);
    }
  };

  useEffect(() => {
    fetchRates();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // --- Logic & Calculations ---

  const toggleSection = (key: keyof Sections) => {
    setSections((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  // generic typed updateAsset that maintains correct asset value types
  function updateAsset<K extends keyof Assets>(key: K, value: Assets[K]) {
    setAssets((prev) => ({ ...prev, [key]: value }));
  }
  function updateLiability<K extends keyof Liabilities>(key: K, value: Liabilities[K]) {
    setLiabilities((prev) => ({ ...prev, [key]: value }));
  }

  const calculations = useMemo(() => {
    let zakatableAssets = 0;
    let deductibleLiabilities = 0;
    const breakdown: { label: string; amount: number }[] = [];

    // 1. Cash
    const cashTotal =
      assets.cashInHand + assets.bankDeposit + assets.digitalWallets + assets.businessCash;
    zakatableAssets += cashTotal;
    if (cashTotal > 0) breakdown.push({ label: 'Cash & Savings', amount: cashTotal });

    // 2. Gold & Silver
    let goldValue = 0;
    const silverValue = assets.silverGrams * silverPrice;

    if (fiqh === 'hanafi') {
      goldValue = assets.goldGrams * goldPrice;
    } else {
      // Shafi, Maliki, Hanbali: Exempt personal jewelry
      if (assets.goldJewelryUsage) {
        goldValue = 0;
      } else {
        goldValue = assets.goldGrams * goldPrice;
      }
    }

    const preciousMetalsTotal = goldValue + silverValue;
    zakatableAssets += preciousMetalsTotal;
    if (preciousMetalsTotal > 0)
      breakdown.push({ label: 'Zakatable Gold & Silver', amount: preciousMetalsTotal });

    // 3. Business
    const businessTotal = assets.businessStock + assets.receivables;
    zakatableAssets += businessTotal;
    if (businessTotal > 0) breakdown.push({ label: 'Business Assets', amount: businessTotal });

    // 4. Investments
    let investmentsTotal = 0;
    if (assets.stocksStrategy === 'active') {
      investmentsTotal += assets.stocksValue;
    } else {
      investmentsTotal += assets.stocksValue * 0.25;
    }
    if (assets.pensionAccess) {
      investmentsTotal += assets.pensionAmount * 0.25;
    }
    investmentsTotal += assets.cryptoValue;
    zakatableAssets += investmentsTotal;
    if (investmentsTotal > 0) breakdown.push({ label: 'Investments', amount: investmentsTotal });

    // 5. Liabilities
    if (fiqh === 'hanafi') {
      deductibleLiabilities = liabilities.immediateDebts + liabilities.expensesDue;
    } else if (fiqh === 'shafii') {
      deductibleLiabilities = 0;
    } else if (fiqh === 'maliki' || fiqh === 'hanbali') {
      deductibleLiabilities = liabilities.immediateDebts;
    }

    const netWorth = Math.max(0, zakatableAssets - deductibleLiabilities);

    // Nisab
    const silverNisab = 595 * silverPrice;
    const goldNisab = 85 * goldPrice;

    // Rule: Use Silver Nisab if mixed assets
    const hasMixedAssets =
      cashTotal + businessTotal + investmentsTotal + silverValue > 0;
    const applicableNisab = hasMixedAssets
      ? silverNisab
      : assets.goldGrams > 0
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
  }, [assets, liabilities, fiqh, goldPrice, silverPrice]);

  // Handle Print
  const handlePrint = () => {
    if (typeof window !== 'undefined' && window.print) window.print();
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 print:bg-white print:text-black">
      {/* Styles for Printing */}
      <style>{`
        @media print {
          .no-print { display: none !important; }
          .print-only { display: block !important; }
          body { background: white; }
          .page-break { page-break-before: always; }
          input { border: none !important; padding: 0 !important; font-weight: bold; }
        }
        .print-only { display: none; }
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
              <p className="text-emerald-100 text-lg opacity-90 max-w-lg">
                Accurate, private, and easy-to-use calculation based on your School of Thought.
              </p>
            </div>

            <div className="flex flex-col gap-3 w-full md:w-auto">
              <div className="flex gap-2">
                <select
                  value={fiqh}
                  onChange={(e) => setFiqh(e.target.value as FiqhType)}
                  className="bg-emerald-800 text-white border border-emerald-600 text-sm rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-emerald-400 flex-1 cursor-pointer"
                >
                  <option value="hanafi">Hanafi</option>
                  <option value="shafii">Shafi'i</option>
                  <option value="maliki">Maliki</option>
                  <option value="hanbali">Hanbali</option>
                </select>

                <select
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value)}
                  className="bg-emerald-800 text-white border border-emerald-600 text-sm rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-emerald-400 w-24 cursor-pointer"
                >
                  <option value="INR">INR (₹)</option>
                  <option value="USD">USD ($)</option>
                  <option value="EUR">EUR (€)</option>
                  <option value="GBP">GBP (£)</option>
                  <option value="AED">AED (د.إ)</option>
                  <option value="SAR">SAR (﷼)</option>
                </select>
              </div>

              {/* Market Rates */}
              <div className="bg-emerald-800/50 p-3 rounded-lg border border-emerald-600/30 text-sm">
                <p className="text-emerald-200 text-xs font-semibold uppercase tracking-wider mb-2">
                  Market Rates (Per Gram)
                </p>
                <div className="flex gap-4">
                  <div className="flex-1">
                    <label className="text-emerald-100 text-xs block">Gold (24k)</label>
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
                total={
                  assets.silverGrams * silverPrice +
                  (fiqh === 'hanafi' || !assets.goldJewelryUsage ? assets.goldGrams * goldPrice : 0)
                }
                currency={currencySymbol}
              />
              {sections.gold && (
                <div className="p-6 bg-white animate-in slide-in-from-top-2 duration-200">
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <InputGroup
                      label="Gold (Grams)"
                      value={assets.goldGrams}
                      onChange={(v) => updateAsset('goldGrams', v)}
                      currencySymbol="g"
                      placeholder="0"
                    />
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
                      label="Is gold used for personal jewelry?"
                      active={assets.goldJewelryUsage}
                      onToggle={(v) => updateAsset('goldJewelryUsage', v)}
                      tooltip="Exempt in Shafi'i, Maliki, Hanbali if used for adornment."
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
                total={assets.businessStock + assets.receivables}
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
                total={
                  (assets.stocksStrategy === 'active' ? assets.stocksValue : assets.stocksValue * 0.25) +
                  assets.cryptoValue +
                  (assets.pensionAccess ? assets.pensionAmount * 0.25 : 0)
                }
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
                  <div className="flex gap-4 mb-4">
                    <button
                      onClick={() => updateAsset('stocksStrategy', 'passive')}
                      className={`flex-1 py-2 text-xs rounded-md border ${
                        assets.stocksStrategy === 'passive'
                          ? 'bg-emerald-50 border-emerald-500 text-emerald-700'
                          : 'bg-white border-slate-200'
                      }`}
                    >
                      Passive (25%)
                    </button>
                    <button
                      onClick={() => updateAsset('stocksStrategy', 'active')}
                      className={`flex-1 py-2 text-xs rounded-md border ${
                        assets.stocksStrategy === 'active'
                          ? 'bg-emerald-50 border-emerald-500 text-emerald-700'
                          : 'bg-white border-slate-200'
                      }`}
                    >
                      Trader (100%)
                    </button>
                  </div>
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
                    className="w-full mt-4 flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-900 text-white py-3 rounded-lg transition-colors font-medium text-sm no-print"
                  >
                    <Download size={16} /> Download Summary Report
                  </button>
                </div>
              </div>
            </div>

            {/* Contact Card */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 no-print">
              <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                <HelpCircleIcon /> Have Doubts?
              </h3>
              <p className="text-sm text-slate-600 mb-6">
                Zakat rulings can be complex. For specific queries, contact Mufti Danish directly.
              </p>
              <div className="space-y-3">
                <a
                  href="https://wa.me/918104998499"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 w-full py-2.5 bg-emerald-50 text-emerald-700 rounded-lg font-medium hover:bg-emerald-100 transition-colors border border-emerald-200"
                >
                  <MessageCircle size={18} /> WhatsApp
                </a>
                <a
                  href="tel:+918104998499"
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
      <footer className="bg-slate-900 text-slate-400 py-12 mt-12 no-print">
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
      <div className="print-only p-8 max-w-3xl mx-auto">
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
          <p>Calculated using Il An Noor Zakat Calculator | Developed by Abdur Rehman Shaikh</p>
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
