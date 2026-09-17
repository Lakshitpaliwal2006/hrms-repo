import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import {
  Users,
  Clock,
  Calendar,
  DollarSign,
  CheckCircle2,
  Building,
  ArrowRight,
  TrendingUp,
  Check,
  X,
  Sparkles,
  Activity,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../../api/client';
import { format } from 'date-fns';
import Meetings from '../meetings/Meetings';

const AdminDashboard = () => {
  const { user } = useAuth();
  const toast = useToast();
  // const [activeLink, setActiveLink] = useState("Dashboard");
  const [loading, setLoading] = useState(true);
  const [employees, setEmployees] = useState([]);
  const [activeBox, setActiveBox] = useState("department")
  const [attendanceStats, setAttendanceStats] = useState({ totalPresent: 0, totalHalfDay: 0, totalLeave: 0 });
  const [todayRecords, setTodayRecords] = useState([]);
  const [pendingLeaves, setPendingLeaves] = useState([]);
  const [leaveStats, setLeaveStats] = useState({ total: 0, pending: 0, approved: 0, rejected: 0 });
  const [payrollStats, setPayrollStats] = useState({ totalDisbursed: 0, totalGross: 0, paidCount: 0 });


  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [attRes, usersRes, leavesRes, payRes] = await Promise.all([
        api.get('/attendance/all'),
        api.get('/users'),
        api.get('/leaves/all?status=Pending'),
        api.get('/salaries/all?month=8&year=2026'),
      ]);

      if (attRes.data.success) {
        setAttendanceStats(attRes.data.stats || { totalPresent: 0, totalHalfDay: 0, totalLeave: 0 });
        setTodayRecords(attRes.data.records || []);
      }

      if (usersRes.data.success) {
        setEmployees(usersRes.data.employees || []);
      }

      if (leavesRes.data.success) {
        setPendingLeaves(leavesRes.data.leaves || []);
        if (leavesRes.data.stats) setLeaveStats(leavesRes.data.stats);
      }

      if (payRes.data.success && payRes.data.stats) {
        setPayrollStats(payRes.data.stats);
      }
    } catch (error) {
      console.error('Error fetching admin dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  // Quick 1-click approve/reject from dashboard
  const handleQuickDecision = async (leaveId, status) => {
    try {
      const res = await api.put(`/leaves/${leaveId}/status`, {
        status,
        adminComment: status === 'Approved' ? 'Approved via Admin Quick Actions' : 'Rejected via Admin Quick Actions',
      });
      if (res.data.success) {
        toast.success(`Leave request ${status.toLowerCase()}!`);
        fetchDashboardData();
      }
    } catch (error) {
      toast.error('Failed to process leave decision');
    }
  };

  const totalEmployees = employees.length || 1;
  const activeEmployees = employees.filter((e) => e.status === 'Active').length;
  const presentRate = Math.min(100, Math.round((attendanceStats.totalPresent / totalEmployees) * 100));

  // Department distribution calculation
  const deptCounts = employees.reduce((acc, emp) => {
    const dept = emp.department || 'General';
    acc[dept] = (acc[dept] || 0) + 1;
    return acc;
  }, {});

  const departmentColors = {
    Engineering: 'from-blue-500 to-indigo-600',
    'Product Design': 'from-purple-500 to-pink-500',
    'Sales & Marketing': 'from-amber-500 to-orange-600',
    'Human Resources': 'from-emerald-500 to-teal-600',
    Finance: 'from-cyan-500 to-blue-600',
  };

  const monthLabel = new Date().toLocaleString('en-IN', {
    month: 'long',
    year: 'numeric',
  });
  // const links = [
  //   "Department",
  //   "Attendance",
  //   "Time Off Approvals",
  // ];
  const navItems = [
    { id: "department", label: "Department" },
    { id: "attendence", label: "Attendance Activity" },
    { id: "time", label: "Time Off Approvals" },
    { id: "meetings", label: "Events & Meetings" },
  ];

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Month Banner That show  the Summary and Time */}
      <div className="relative px-5 py-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="absolute left-0 top-0 h-full w-1 bg-gradient-to-b from-emerald-400 via-brand-500 to-indigo-500" />
        {/* Subtle background dot pattern */}
        <div
          className="absolute inset-0 opacity-[0.03] pointer-events-none"
          style={{
            backgroundImage: "radial-gradient(circle, currentColor 1px, transparent 1px)",
            backgroundSize: "14px 14px",
          }}
        />

        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4 pl-3">
          <div>
            <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white leading-tight">
              Workforce Summary — {new Date().toLocaleDateString("en-US", { weekday: "long", month: "short", day: "numeric" })}
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Real-time snapshot of staff, attendance, and approvals
            </p>
          </div>

          <div className="flex items-center gap-4 sm:gap-6 pl-0 sm:border-l sm:border-slate-200 sm:dark:border-slate-800 sm:pl-6">
            <div className="text-center">
              <p className="text-sm font-bold text-slate-900 dark:text-white">{totalEmployees}</p>
              <p className="text-[10px] text-slate-400 uppercase tracking-wide">Total Staff</p>
            </div>
            <div className="text-center">
              <p className="text-sm font-bold text-emerald-500">{attendanceStats.totalPresent}</p>
              <p className="text-[10px] text-slate-400 uppercase tracking-wide">Present Today</p>
            </div>
            <div className="text-center">
              <p className="text-sm font-bold text-amber-500">{pendingLeaves.length}</p>
              <p className="text-[10px] text-slate-400 uppercase tracking-wide">Pending Leaves</p>
            </div>
          </div>
        </div>
      </div>

      {/* Cards Grid That show Cards Key performance attendance */}
      <div className="bg-white dark:bg-[#171D19] border border-slate-200 dark:border-white/10 rounded-2xl overflow-hidden shadow-sm">
        <div className="grid grid-cols-2 lg:grid-cols-4 divide-x divide-y lg:divide-y-0 divide-slate-200 dark:divide-white/10">
          <div className="p-5 flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <span className="text-[11px] uppercase tracking-wide text-slate-500 dark:text-slate-400">Roll call</span>
              <div className="w-8 h-8 rounded-full bg-emerald-100 dark:bg-emerald-400/10 flex items-center justify-center">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" strokeWidth={2} />
              </div>
            </div>
            <div className="font-serif font-semibold text-[28px] leading-tight text-slate-900 dark:text-white tabular-nums">
              {attendanceStats.totalPresent}
              <span className="text-sm font-sans font-medium text-slate-500 dark:text-slate-400 ml-1">/ {totalEmployees}</span>
            </div>
            <div className="text-xs text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
              <TrendingUp className="w-3 h-3" /> {presentRate}% present today
            </div>
          </div>

          <div className="p-5 flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <span className="text-[11px] uppercase tracking-wide text-slate-500 dark:text-slate-400">Approvals</span>
              <div className="w-8 h-8 rounded-full bg-amber-100 dark:bg-amber-400/10 flex items-center justify-center">
                <Clock className="w-4 h-4 text-amber-600 dark:text-amber-400" strokeWidth={2} />
              </div>
            </div>
            <div className="font-serif font-semibold text-[28px] leading-tight text-slate-900 dark:text-white tabular-nums">
              {pendingLeaves.length}
            </div>
            <div className="text-xs text-slate-500 dark:text-slate-400">
              {pendingLeaves.length > 0 ? 'Awaiting HR sign-off' : 'All caught up'}
            </div>
          </div>

          <div className="p-5 flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <span className="text-[11px] uppercase tracking-wide text-slate-500 dark:text-slate-400">Workforce</span>
              <div className="w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-400/10 flex items-center justify-center">
                <Users className="w-4 h-4 text-indigo-600 dark:text-indigo-400" strokeWidth={2} />
              </div>
            </div>
            <div className="font-serif font-semibold text-[28px] leading-tight text-slate-900 dark:text-white tabular-nums">
              {activeEmployees}
              <span className="text-sm font-sans font-medium text-slate-500 dark:text-slate-400 ml-1">active</span>
            </div>
            <div className="text-xs text-slate-500 dark:text-slate-400">
              Across {Object.keys(deptCounts).length} departments
            </div>
          </div>

          <div className="p-5 flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <span className="text-[11px] uppercase tracking-wide text-slate-500 dark:text-slate-400">Payroll — {monthLabel}</span>
              <div className="w-8 h-8 rounded-full bg-rose-100 dark:bg-rose-400/10 flex items-center justify-center">
                <DollarSign className="w-4 h-4 text-rose-700 dark:text-rose-400" strokeWidth={2} />
              </div>
            </div>
            <div className="font-serif font-semibold text-[24px] leading-tight text-slate-900 dark:text-white tabular-nums">
              ₹{(payrollStats.totalDisbursed || 568700).toLocaleString('en-IN')}
            </div>
            <div className="text-xs text-slate-500 dark:text-slate-400">Net disbursement</div>
          </div>
        </div>
      </div>

      {/* Navbar for Switching */}
      <nav className="h-12 flex items-center justify-between px-3.5 border-b border-neutral-200 bg-zinc-00">
        <div className="flex items-center gap-4 overflow-x-auto scrollbar-none">

          {/* Other links */}
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveBox(item.id)}
              className={`h-12 px-2 text-sm relative ${activeBox === item.id
                ? "text-black font-medium after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[2px] after:bg-black"
                : "text-slate-500"
                }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </nav>
      {/* Department Distribution & Attendance Status */}

      {/* Department Workforce Distribution */}
      {activeBox === "department" && <><div className="rounded-3xl bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 p-6 space-y-4 shadow-sm dark:shadow-card transition-colors">
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
            <Building className="w-4 h-4 text-brand-600 dark:text-brand-400" />
            Workforce Distribution by Department
          </h3>
          <span className="text-xs text-slate-500 dark:text-slate-400 font-mono">{totalEmployees} Total</span>
        </div>

        <div className="space-y-3.5 pt-1">
          {Object.entries(deptCounts).map(([dept, count]) => {
            const pct = Math.round((count / totalEmployees) * 100);
            const gradient = departmentColors[dept] || 'from-indigo-500 to-brand-500';
            return (
              <div key={dept} className="space-y-1">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-slate-700 dark:text-slate-300">{dept}</span>
                  <span className="text-slate-500 dark:text-slate-400">
                    {count} {count === 1 ? 'member' : 'members'} ({pct}%)
                  </span>
                </div>
                <div className="w-full h-2.5 rounded-full bg-slate-100 dark:bg-slate-950 overflow-hidden border border-slate-200 dark:border-slate-800">
                  <div
                    className={`h-full rounded-full bg-gradient-to-r ${gradient} transition-all duration-500`}
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div></>}

      {/* Today's Attendance Breakdown */}
      {activeBox === "attendence" && (
        <>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 w-full">
            <div className="rounded-3xl bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 p-6 space-y-4 shadow-sm dark:shadow-card transition-colors">
              <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
                  <Activity className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  Today's Attendance Status Breakdown
                </h3>
                <span className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold">{presentRate}% Present</span>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-1">
                <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 flex items-center justify-between">
                  <div>
                    <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 uppercase">Present</span>
                    <div className="text-xl font-bold text-slate-900 dark:text-white mt-0.5">
                      {attendanceStats.totalPresent}
                    </div>
                  </div>
                  <div className="w-3 h-3 rounded-full bg-emerald-500 shadow-sm" />
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 flex items-center justify-between">
                  <div>
                    <span className="text-[11px] font-semibold text-amber-600 dark:text-amber-400 uppercase">Half-Day</span>
                    <div className="text-xl font-bold text-slate-900 dark:text-white mt-0.5">
                      {attendanceStats.totalHalfDay}
                    </div>
                  </div>
                  <div className="w-3 h-3 rounded-full bg-amber-500" />
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 flex items-center justify-between">
                  <div>
                    <span className="text-[11px] font-semibold text-violet-600 dark:text-violet-400 uppercase">On Leave</span>
                    <div className="text-xl font-bold text-slate-900 dark:text-white mt-0.5">
                      {attendanceStats.totalLeave}
                    </div>
                  </div>
                  <div className="w-3 h-3 rounded-full bg-violet-500" />
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 flex items-center justify-between">
                  <div>
                    <span className="text-[11px] font-semibold text-rose-600 dark:text-rose-400 uppercase">Absent / Off</span>
                    <div className="text-xl font-bold text-slate-900 dark:text-white mt-0.5">
                      {Math.max(
                        0,
                        totalEmployees -
                        (attendanceStats.totalPresent +
                          attendanceStats.totalHalfDay +
                          attendanceStats.totalLeave)
                      )}
                    </div>
                  </div>
                  <div className="w-3 h-3 rounded-full bg-rose-500" />
                </div>
              </div>

              <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-400 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-brand-600 dark:text-brand-400 shrink-0" />
                <span>Attendance records are synced in real-time upon employee punch in/out.</span>
              </div>
            </div>

            {/* Live Punch Feed */}
            <div className="rounded-3xl bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 p-6 space-y-4 shadow-sm dark:shadow-card transition-colors">
              <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
                  <Clock className="w-4 h-4 text-brand-600 dark:text-brand-400" />
                  Today's Live Attendance Feed
                </h3>
                <Link
                  to="/admin/attendance"
                  className="text-xs text-brand-600 dark:text-brand-400 hover:underline font-semibold flex items-center gap-1"
                >
                  <span>View All</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              {todayRecords.length === 0 ? (
                <div className="p-8 text-center text-slate-500 dark:text-slate-400 text-xs">
                  No punch events recorded yet today.
                </div>
              ) : (
                <div className="space-y-2.5">
                  {todayRecords.slice(0, 4).map((r) => (
                    <div
                      key={r._id}
                      className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 flex items-center justify-between"
                    >
                      <div className="flex items-center gap-3">
                        <img
                          src={r.userId?.avatar || "/default-avatar.png"}
                          alt={r.userId?.name || "Employee"}
                          className="w-9 h-9 rounded-xl object-cover border border-slate-300 dark:border-slate-700"
                        />
                        <div>
                          <div className="text-xs font-bold text-slate-900 dark:text-white">{r.userId?.name}</div>
                          <div className="text-[11px] text-slate-500 dark:text-slate-400">
                            {r.userId?.department} • <span className="font-semibold text-slate-700 dark:text-slate-300">{r.workMode}</span>
                          </div>
                        </div>
                      </div>

                      <div className="text-right">
                        <div className="text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400">
                          {r.checkIn ? format(new Date(r.checkIn), "hh:mm a") : "—"}
                        </div>
                        <span className="text-[10px] font-semibold text-slate-500 dark:text-slate-400">
                          {r.totalHours ? `${r.totalHours} hrs` : "Working..."}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </>
      )}

      {/* pending leave Show */}
      {activeBox === "time" && <div className="rounded-3xl bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 p-6 space-y-4 shadow-sm dark:shadow-card transition-colors">
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center">
              <Calendar className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                Pending Leave Approvals Queue
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">Fast 1-click review directly from dashboard</p>
            </div>
          </div>

          <Link
            to="/admin/leaves"
            className="text-xs text-brand-600 dark:text-brand-400 hover:underline font-semibold flex items-center gap-1"
          >
            <span>View Full Portal</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {pendingLeaves.length === 0 ? (
          <div className="p-8 text-center text-slate-500 dark:text-slate-400 text-xs rounded-2xl bg-slate-50 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-800/60">
            <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto mb-2 opacity-80" />
            <p className="font-semibold text-slate-800 dark:text-white">All Leave Requests Processed</p>
            <p className="text-slate-500 mt-0.5">No pending employee leave requests requiring review.</p>
          </div>
        ) : (
          <div className="space-y-2.5">
            {pendingLeaves.slice(0, 3).map((l) => (
              <div
                key={l._id}
                className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div className="flex items-center gap-3">
                  <img
                    src={l.userId?.avatar}
                    alt={l.userId?.name}
                    className="w-9 h-9 rounded-xl object-cover border border-slate-300 dark:border-slate-700"
                  />
                  <div>
                    <div className="text-xs font-bold text-slate-900 dark:text-white">
                      {l.userId?.name}{' '}
                      <span className="text-[10px] text-slate-500 dark:text-slate-400 font-normal">
                        ({l.userId?.department})
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-600 dark:text-slate-300 mt-0.5">
                      <span className="font-semibold text-brand-600 dark:text-brand-300">{l.leaveType} Leave</span>: {l.startDate} to {l.endDate} ({l.daysCount} days)
                    </div>
                    <div className="text-[10px] text-slate-500 dark:text-slate-400 italic mt-0.5">
                      "{l.reason}"
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                  <button
                    onClick={() => handleQuickDecision(l._id, 'Approved')}
                    className="px-3 py-1.5 rounded-xl bg-emerald-600 text-white hover:bg-emerald-500 text-xs font-semibold flex items-center gap-1 transition-all shadow-sm"
                  >
                    <Check className="w-3.5 h-3.5" /> Approve
                  </button>
                  <button
                    onClick={() => handleQuickDecision(l._id, 'Rejected')}
                    className="px-3 py-1.5 rounded-xl bg-rose-600 text-white hover:bg-rose-500 text-xs font-semibold flex items-center gap-1 transition-all shadow-sm"
                  >
                    <X className="w-3.5 h-3.5" /> Reject
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>}

      {activeBox === "meetings" && <><Meetings />
      </>}


    </div>
  );
};

export default AdminDashboard;
