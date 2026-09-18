import React, { useState, useEffect } from 'react';
import {
  CalendarDays,
  CheckCircle2,
  XCircle,
  Clock,
  Search,
  Filter,
  Check,
  X,
} from 'lucide-react';
import api from '../../api/client';
import { useToast } from '../../context/ToastContext';
import demoAvatars from '../../utils/avatars';

const LeaveApprovalPage = () => {
  const [leaves, setLeaves] = useState([]);
  const [stats, setStats] = useState({ total: 0, pending: 0, approved: 0, rejected: 0 });
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('Pending');
  const [department, setDepartment] = useState('All');
  const [search, setSearch] = useState('');

  // Selected leave for the right-hand detail panel (replaces the modal)
  const [selectedLeave, setSelectedLeave] = useState(null);
  const [decisionType, setDecisionType] = useState('Approved');
  const [adminComment, setAdminComment] = useState('');
  const [actionLoading, setActionLoading] = useState(false);
  const [editingDecision, setEditingDecision] = useState(false);

  const toast = useToast();

  const fetchLeaves = async () => {
    try {
      setLoading(true);
      const params = {};
      if (statusFilter !== 'All') params.status = statusFilter;
      if (department !== 'All') params.department = department;
      if (search) params.search = search;

      const res = await api.get('/leaves/all', { params });
      if (res.data.success) {
        const list = res.data.leaves || [];
        setLeaves(list);
        if (res.data.stats) setStats(res.data.stats);

        // Keep selection in sync with the current list, default to first item
        if (list.length > 0) {
          const stillExists = list.find((l) => l._id === selectedLeave?._id);
          selectLeave(stillExists || list[0]);
        } else {
          setSelectedLeave(null);
        }
      }
    } catch (error) {
      toast.error('Failed to load leave requests');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeaves();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [statusFilter, department]);

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchLeaves();
    }, 300);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search]);

  const selectLeave = (leave) => {
    setSelectedLeave(leave);
    setEditingDecision(false);
    setDecisionType(leave?.status === 'Rejected' ? 'Approved' : 'Approved');
    setAdminComment(
      leave?.status === 'Pending' || !leave
        ? 'Approved. Have a good time off!'
        : leave.adminComment || ''
    );
  };

  const startDecision = (type) => {
    setDecisionType(type);
    setAdminComment(
      type === 'Approved'
        ? 'Approved. Have a good time off!'
        : 'Unfortunately, your request cannot be accommodated due to current deliverables.'
    );
    setEditingDecision(true);
  };

  const handleDecisionSubmit = async (e) => {
    e.preventDefault();
    if (!selectedLeave) return;

    setActionLoading(true);
    try {
      const res = await api.put(`/leaves/${selectedLeave._id}/status`, {
        status: decisionType,
        adminComment,
      });

      if (res.data.success) {
        toast.success(res.data.message);
        setEditingDecision(false);
        fetchLeaves();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update leave status');
    } finally {
      setActionLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Approved':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border border-emerald-500/25">
            <CheckCircle2 className="w-3 h-3 text-emerald-600 dark:text-emerald-400" /> Approved
          </span>
        );
      case 'Pending':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-500/15 text-amber-700 dark:text-amber-300 border border-amber-500/25">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></span> Pending
          </span>
        );
      case 'Rejected':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-rose-500/15 text-rose-700 dark:text-rose-300 border border-rose-500/25">
            <XCircle className="w-3 h-3 text-rose-600 dark:text-rose-400" /> Rejected
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
            {status}
          </span>
        );
    }
  };

  const leaveTypeClasses = (type) =>
    type === 'Paid'
      ? 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border border-emerald-500/25'
      : type === 'Sick'
      ? 'bg-brand-500/15 text-brand-700 dark:text-brand-300 border border-brand-500/25'
      : 'bg-indigo-500/15 text-indigo-700 dark:text-indigo-300 border border-indigo-500/25';

  const balanceFor = (l) =>
    l.leaveType === 'Paid'
      ? `${l.userId?.leaveBalance?.paid || 0}d`
      : l.leaveType === 'Sick'
      ? `${l.userId?.leaveBalance?.sick || 0}d`
      : 'N/A';

  return (
    <div className="space-y-6">
      {/* Title */}
      <div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Leave Approvals
        </h2>
        <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
          Review employee leave requests, approve quotas, and add administrative remarks.
        </p>
      </div>

      

      

      {/* Split view: list (left) + detail panel (right) */}
      <div className="rounded-3xl bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 shadow-sm dark:shadow-card overflow-hidden transition-colors grid grid-cols-1 lg:grid-cols-[320px_minmax(0,1fr)]">
        {/* LEFT: list panel */}
        <div className="border-b lg:border-b-0 lg:border-r border-slate-200 dark:border-slate-800 flex flex-col max-h-[640px]">
          {/* Status tabs */}
          <div className="flex items-center gap-1 p-2 border-b border-slate-200 dark:border-slate-800">
            {['Pending', 'Approved', 'Rejected', 'All'].map((status) => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`flex-1 px-2 py-1.5 rounded-lg text-[11px] font-semibold transition-all cursor-pointer ${
                  statusFilter === status
                    ? 'text-gray-500 underline underline-offset-8'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {status}
                {status === 'Pending' && stats.pending > 0 && (
                  <span className="ml-1 px-1.5 py-0.5 text-[9px] rounded-full bg-amber-400 text-slate-950 font-black">
                    {stats.pending}
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* Search */}
          <div className="relative p-2 border-b border-slate-200 dark:border-slate-800 flex">
            <div>
              <Search className="w-3.5 h-3.5 text-slate-400 absolute inset-y-0 left-6 my-auto" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search employee or reason..."
              className="w-full pl-9 pr-3 py-1.5 bg-slate-50 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-brand-500"
            />
            </div>

            {/* Department Filter (status filter now lives in the list panel below) */}
      
        <div className="flex items-center gap-1.5 w-[70%]">
          <Filter className="w-3.5 h-3.5 text-slate-400" />
          <select
            value={department}
            onChange={(e) => setDepartment(e.target.value)}
            className="px-3 py-1.5 bg-slate-50 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-brand-500"
          >
            <option value="All">All Departments</option>
            <option value="Engineering">Engineering</option>
            <option value="Product Design">Product Design</option>
            <option value="Sales & Marketing">Sales & Marketing</option>
            <option value="Human Resources">Human Resources</option>
            <option value="Finance">Finance</option>
          </select>
        </div>
          </div>

          {/* List */}
          <div className="overflow-y-auto flex-1">
            {loading ? (
              <div className="p-8 text-center text-slate-500 dark:text-slate-400 flex flex-col items-center gap-3">
                <div className="w-6 h-6 border-2 border-brand-500 border-t-transparent rounded-full animate-spin"></div>
                <span className="text-[11px]">Loading...</span>
              </div>
            ) : leaves.length === 0 ? (
              <div className="p-8 text-center text-slate-500 dark:text-slate-400 text-[11px]">
                No {statusFilter !== 'All' ? statusFilter.toLowerCase() : ''} leave requests found.
              </div>
            ) : (
              leaves.map((l) => (
                <button
                  key={l._id}
                  onClick={() => selectLeave(l)}
                  className={`w-full text-left px-4 py-3 border-l-2 transition-colors ${
                    selectedLeave?._id === l._id
                      ? 'border-brand-500 bg-brand-50 dark:bg-brand-500/10'
                      : 'border-transparent hover:bg-slate-50 dark:hover:bg-slate-850/50'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-sm font-bold text-slate-900 dark:text-white truncate">
                      {l.userId?.name || 'Staff Member'}
                    </span>
                    {getStatusBadge(l.status)}
                  </div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                    {l.leaveType} · {l.daysCount} {l.daysCount === 1 ? 'day' : 'days'} · {l.startDate}
                  </div>
                </button>
              ))
            )}
          </div>
        </div>

        {/* RIGHT: detail panel */}
        <div className="p-6">
          {!selectedLeave ? (
            <div className="h-full flex flex-col items-center justify-center text-center text-slate-400 dark:text-slate-500 py-16">
              <CalendarDays className="w-8 h-8 mb-3" />
              <p className="text-sm">Select a request from the list to review it here.</p>
            </div>
          ) : (
            <div className="space-y-5">
              {/* Employee header */}
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <img
                    src={selectedLeave.userId?.avatar || demoAvatars.generic(selectedLeave.userId?.name?.slice(0, 2))}
                    alt={selectedLeave.userId?.name}
                    className="w-12 h-12 rounded-xl object-cover border border-slate-200 dark:border-slate-700 shrink-0"
                  />
                  <div>
                    <div className="text-base font-bold text-slate-900 dark:text-white">
                      {selectedLeave.userId?.name || 'Staff Member'}
                    </div>
                    <div className="text-[11px] text-slate-500 dark:text-slate-400">
                      {selectedLeave.userId?.department} ·{' '}
                      <span className="font-mono">{selectedLeave.userId?.employeeId}</span>
                    </div>
                  </div>
                </div>
                {getStatusBadge(selectedLeave.status)}
              </div>

              {/* Leave type + duration */}
              <div className="flex items-center justify-between gap-2">
                <span className={`text-[11px] font-bold px-2.5 py-1 rounded-lg ${leaveTypeClasses(selectedLeave.leaveType)}`}>
                  {selectedLeave.leaveType} Leave
                </span>
                <div className="text-right">
                  <div className="text-sm font-black text-slate-900 dark:text-white">
                    {selectedLeave.daysCount} {selectedLeave.daysCount === 1 ? 'Day' : 'Days'}
                  </div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400">Duration</div>
                </div>
              </div>

              {/* Date span + balance */}
              <div className="grid grid-cols-3 gap-3">
                <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800">
                  <div className="text-[10px] text-slate-400 uppercase font-semibold">Start</div>
                  <div className="text-xs font-bold text-slate-800 dark:text-slate-200 mt-1">{selectedLeave.startDate}</div>
                </div>
                <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800">
                  <div className="text-[10px] text-slate-400 uppercase font-semibold">End</div>
                  <div className="text-xs font-bold text-slate-800 dark:text-slate-200 mt-1">{selectedLeave.endDate}</div>
                </div>
                <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800">
                  <div className="text-[10px] text-slate-400 uppercase font-semibold">Balance</div>
                  <div className="text-xs font-bold text-slate-800 dark:text-slate-200 mt-1">{balanceFor(selectedLeave)}</div>
                </div>
              </div>

              {/* Reason */}
              <div>
                <div className="text-[10px] text-slate-400 uppercase font-semibold mb-1">Reason</div>
                <p className="text-xs leading-5 text-slate-700 dark:text-slate-300">{selectedLeave.reason}</p>
              </div>

              {/* Decision area */}
              {selectedLeave.status === 'Pending' || editingDecision ? (
                <form onSubmit={handleDecisionSubmit} className="space-y-3 pt-3 border-t border-slate-200 dark:border-slate-800">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      HR Administrator Remarks / Comment
                    </label>
                    <textarea
                      rows={3}
                      value={adminComment}
                      onChange={(e) => setAdminComment(e.target.value)}
                      placeholder="Enter comments visible to employee..."
                      className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-brand-500 resize-none"
                    />
                  </div>

                  {decisionType === 'Approved' && selectedLeave.leaveType !== 'Unpaid' && (
                    <div className="text-[11px] text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                      <span>
                        Approving will deduct {selectedLeave.daysCount} days from the employee&apos;s {selectedLeave.leaveType} balance.
                      </span>
                    </div>
                  )}

                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setDecisionType('Approved')}
                      onClickCapture={() => startDecision('Approved')}
                      className={`flex-1 px-3 py-2.5 rounded-xl font-semibold text-xs transition-all inline-flex items-center justify-center gap-1.5 ${
                        decisionType === 'Approved'
                          ? 'bg-emerald-600 text-white'
                          : 'bg-emerald-600/15 hover:bg-emerald-600 text-emerald-700 dark:text-emerald-300 hover:text-white'
                      }`}
                    >
                      <Check className="w-3.5 h-3.5" /> Approve
                    </button>
                    <button
                      type="button"
                      onClickCapture={() => startDecision('Rejected')}
                      className={`flex-1 px-3 py-2.5 rounded-xl font-semibold text-xs transition-all inline-flex items-center justify-center gap-1.5 ${
                        decisionType === 'Rejected'
                          ? 'bg-rose-600 text-white'
                          : 'bg-rose-600/15 hover:bg-rose-600 text-rose-700 dark:text-rose-300 hover:text-white'
                      }`}
                    >
                      <X className="w-3.5 h-3.5" /> Reject
                    </button>
                  </div>

                  <button
                    type="submit"
                    disabled={actionLoading}
                    className={`w-full px-5 py-2.5 rounded-xl text-white font-semibold flex items-center justify-center gap-1.5 shadow-glow disabled:opacity-50 ${
                      decisionType === 'Approved'
                        ? 'bg-emerald-600 hover:bg-emerald-500'
                        : 'bg-rose-600 hover:bg-rose-500'
                    }`}
                  >
                    {actionLoading ? (
                      <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : decisionType === 'Approved' ? (
                      <Check className="w-3.5 h-3.5" />
                    ) : (
                      <X className="w-3.5 h-3.5" />
                    )}
                    Confirm {decisionType}
                  </button>
                </form>
              ) : (
                <div className="pt-3 border-t border-slate-200 dark:border-slate-800">
                  <div className="text-[10px] text-slate-400 uppercase font-semibold mb-1">Admin Remarks</div>
                  <p className="text-xs text-slate-600 dark:text-slate-400 mb-3">
                    {selectedLeave.adminComment ? `"${selectedLeave.adminComment}"` : 'Reviewed'}
                  </p>
                  <button
                    onClick={() => startDecision(selectedLeave.status === 'Approved' ? 'Rejected' : 'Approved')}
                    className="text-[11px] text-brand-600 dark:text-brand-400 hover:underline font-semibold"
                  >
                    Change Decision
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>


      {/* Metric Counters */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 font-center bg-gray-100 p-5 rounded-xl">
        <div className="p-5 rounded-2xl bg-sky-100 border-1 border-gray-300 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 shadow-sm dark:shadow-card flex items-center justify-between transition-colors">
          <div>
            <span className="text-xs text-slate-500 dark:text-slate-400 font-semibold uppercase">Pending Review</span>
            <div className="text-2xl font-black text-amber-600 dark:text-amber-400 mt-1">{stats.pending}</div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center">
            <Clock className="w-5 h-5" />
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-sky-100 border-1 border-gray-300 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 shadow-sm dark:shadow-card flex items-center justify-between transition-colors">
          <div>
            <span className="text-xs text-slate-500 dark:text-slate-400 font-semibold uppercase">Approved Leaves</span>
            <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-1">{stats.approved}</div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
            <CheckCircle2 className="w-5 h-5" />
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-sky-100 border-1 border-gray-300 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 shadow-sm dark:shadow-card flex items-center justify-between transition-colors">
          <div>
            <span className="text-xs text-slate-500 dark:text-slate-400 font-semibold uppercase">Rejected</span>
            <div className="text-2xl font-black text-rose-600 dark:text-rose-400 mt-1">{stats.rejected}</div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-rose-500/10 text-rose-600 dark:text-rose-400 flex items-center justify-center">
            <XCircle className="w-5 h-5" />
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-sky-100 border-1 border-gray-300 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 shadow-sm dark:shadow-card flex items-center justify-between transition-colors">
          <div>
            <span className="text-xs text-slate-500 dark:text-slate-400 font-semibold uppercase">Total Requests</span>
            <div className="text-2xl font-black text-brand-600 dark:text-brand-400 mt-1">{stats.total}</div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-brand-500/10 text-brand-600 dark:text-brand-400 flex items-center justify-center">
            <CalendarDays className="w-5 h-5" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeaveApprovalPage;


