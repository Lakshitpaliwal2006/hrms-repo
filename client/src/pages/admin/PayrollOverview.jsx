import React, { useState, useEffect } from 'react';
import { DollarSign, Calendar, TrendingUp, TrendingDown, CreditCard } from 'lucide-react';
import api from '../../api/client';
import { useToast } from '../../context/ToastContext';

const months = [
  { num: 1, name: 'January' }, { num: 2, name: 'February' }, { num: 3, name: 'March' },
  { num: 4, name: 'April' }, { num: 5, name: 'May' }, { num: 6, name: 'June' },
  { num: 7, name: 'July' }, { num: 8, name: 'August' }, { num: 9, name: 'September' },
  { num: 10, name: 'October' }, { num: 11, name: 'November' }, { num: 12, name: 'December' },
];

const PayrollOverview = () => {
  const [selectedMonth, setSelectedMonth] = useState(8);
  const [selectedYear, setSelectedYear] = useState(2026);
  const [stats, setStats] = useState({ totalGross: 0, totalNet: 0, totalDisbursed: 0, totalDeductions: 0 });
  const [recordsCount, setRecordsCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const toast = useToast();

  const fetchStats = async () => {
    try {
      setLoading(true);
      const res = await api.get('/salaries/all', {
        params: { month: selectedMonth, year: selectedYear },
      });
      if (res.data.success) {
        setRecordsCount(res.data.records?.length || 0);
        if (res.data.stats) setStats(res.data.stats);
      }
    } catch (error) {
      toast.error('Failed to load payroll summary');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, [selectedMonth, selectedYear]);

  return (
    <div className="space-y-6">
      <div className="p-4 rounded-2xl bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 shadow-sm dark:shadow-card flex items-center gap-2 w-fit">
        <Calendar className="w-3.5 h-3.5 text-brand-600 dark:text-brand-400" />
        <span className="text-xs text-slate-500 dark:text-slate-400">Cycle:</span>
        <select
          value={selectedMonth}
          onChange={(e) => setSelectedMonth(Number(e.target.value))}
          className="px-3 py-1.5 bg-slate-50 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-brand-500"
        >
          {months.map((m) => (
            <option key={m.num} value={m.num}>{m.name}</option>
          ))}
        </select>
        <select
          value={selectedYear}
          onChange={(e) => setSelectedYear(Number(e.target.value))}
          className="px-3 py-1.5 bg-slate-50 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-brand-500"
        >
          <option value={2026}>2026</option>
          <option value={2025}>2025</option>
        </select>
      </div>

      {loading ? (
        <div className="p-12 text-center text-slate-500 dark:text-slate-400 flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-brand-500 border-t-transparent rounded-full animate-spin"></div>
          <span className="text-xs">Loading payroll summary...</span>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 shadow-sm dark:shadow-card flex items-center justify-between transition-colors">
            <div>
              <span className="text-xs text-slate-500 dark:text-slate-400 font-semibold uppercase">Total Disbursed</span>
              <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-1">
                ₹{stats.totalDisbursed?.toLocaleString('en-IN')}
              </div>
              <span className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 block">Disbursed net salary</span>
            </div>
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 shadow-sm dark:shadow-card flex items-center justify-between transition-colors">
            <div>
              <span className="text-xs text-slate-500 dark:text-slate-400 font-semibold uppercase">Gross Payroll</span>
              <div className="text-2xl font-black text-slate-900 dark:text-white mt-1">
                ₹{stats.totalGross?.toLocaleString('en-IN')}
              </div>
              <span className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 block">Pre-deductions volume</span>
            </div>
            <div className="w-10 h-10 rounded-xl bg-brand-500/10 text-brand-600 dark:text-brand-400 flex items-center justify-center">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 shadow-sm dark:shadow-card flex items-center justify-between transition-colors">
            <div>
              <span className="text-xs text-slate-500 dark:text-slate-400 font-semibold uppercase">Total Deductions</span>
              <div className="text-2xl font-black text-rose-600 dark:text-rose-400 mt-1">
                ₹{stats.totalDeductions?.toLocaleString('en-IN')}
              </div>
              <span className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 block">PF, TDS & Adjustments</span>
            </div>
            <div className="w-10 h-10 rounded-xl bg-rose-500/10 text-rose-600 dark:text-rose-400 flex items-center justify-center">
              <TrendingDown className="w-5 h-5" />
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 shadow-sm dark:shadow-card flex items-center justify-between transition-colors">
            <div>
              <span className="text-xs text-slate-500 dark:text-slate-400 font-semibold uppercase">Processed Slips</span>
              <div className="text-2xl font-black text-indigo-600 dark:text-indigo-400 mt-1">{recordsCount}</div>
              <span className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 block">Staff in cycle</span>
            </div>
            <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
              <CreditCard className="w-5 h-5" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PayrollOverview;