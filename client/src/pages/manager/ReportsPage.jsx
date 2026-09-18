import React, { useState, useMemo } from 'react';
import {
  FileText,
  Download,
  Calendar,
  Users,
  TrendingUp,
  Clock,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Eye,
  FileSpreadsheet,
  FileDown,
  Filter,
  Search,
  ChevronDown,
  ArrowUpRight,
  ArrowDownRight,
  X,
  Laptop,
  Building2,
  Check,
  RefreshCw,
  BarChart3,
  Layers,
  Sparkles,
  UploadCloud,
  FolderOpen,
  Folder,
  ShieldCheck,
  FileCheck,
  SlidersHorizontal,
  FilePlus,
  Plus,
  ChevronRight,
  ExternalLink,
  Lock,
  Printer,
  Info
} from 'lucide-react';

const initialStats = {
  complianceRate: { value: '98.4%', change: '+1.8%', subtitle: '142 / 144 Records Verified' },
  teamStrength: { value: '8 Staff', change: '100%', subtitle: 'Direct Engineering Reports' },
  verifiedDocs: { value: '142 Files', change: '+14 this mo', subtitle: 'Encrypted HR Repository' },
  pendingAction: { value: '3 Action Items', change: '2 Due Today', subtitle: '1 Appraisal • 2 Leaves' },
};

// 7-Day Performance & Attendance Trend matching the illustration vector line chart
const trendData = [
  { day: 'Mon', date: '14 Sep', rate: 92, present: 8, wfh: 0, docs: 12 },
  { day: 'Tue', date: '15 Sep', rate: 88, present: 7, wfh: 1, docs: 19 },
  { day: 'Wed', date: '16 Sep', rate: 96, present: 8, wfh: 0, docs: 24 },
  { day: 'Thu', date: '17 Sep', rate: 91, present: 7, wfh: 1, docs: 15 },
  { day: 'Fri', date: '18 Sep', rate: 100, present: 8, wfh: 0, docs: 28 },
  { day: 'Sat', date: '19 Sep', rate: 75, present: 2, wfh: 0, docs: 4 },
  { day: 'Sun', date: '20 Sep', rate: 95, present: 8, wfh: 0, docs: 31 },
];

// Document Repository with HR Categories
const initialDocuments = [
  {
    id: 'DOC-1092',
    title: 'Q3 Team Performance & Appraisal Scorecard',
    category: 'Performance Appraisals',
    format: 'PDF',
    size: '1.4 MB',
    author: 'Vikram Malhotra',
    updatedAt: '18 Sep 2026',
    status: 'Verified',
    downloads: 24,
    description: 'Signed evaluation metrics, OKR completions, and increment notes for Q3.',
    contentSnippet: 'Summary: Overall team velocity increased by 22% with 99.4% sprint delivery accuracy. All 8 direct reportees met primary engineering goals.'
  },
  {
    id: 'DOC-1088',
    title: 'Monthly Timesheet Register & Biometric Logs',
    category: 'Timesheets & Attendance',
    format: 'XLSX',
    size: '2.8 MB',
    author: 'Automated HRMS Sync',
    updatedAt: '18 Sep 2026',
    status: 'Verified',
    downloads: 62,
    description: 'Master time-card ledger with daily in/out punches, LOP days, and shift markers.',
    contentSnippet: 'Data fields: Employee ID, Date, In-Time, Out-Time, Total Hours, Break Duration, Overtime Flags, Approval Signature.'
  },
  {
    id: 'DOC-1074',
    title: 'Overtime Pre-Authorization & Comp-Off Log',
    category: 'Payroll & Compensation',
    format: 'CSV',
    size: '890 KB',
    author: 'Vikram Malhotra',
    updatedAt: '17 Sep 2026',
    status: 'Pending Signature',
    downloads: 11,
    description: 'Weekend sprint hotfix approvals and compensatory rest day credits.',
    contentSnippet: 'Pending approval for: Amit Patel (8.5 hrs weekend deploy) and Vikram Singh (4 hrs cloud maintenance).'
  },
  {
    id: 'DOC-1061',
    title: 'Annual Statutory Leave Audit & Balance Sheet',
    category: 'Leave Management',
    format: 'PDF',
    size: '940 KB',
    author: 'HR Central Compliance',
    updatedAt: '15 Sep 2026',
    status: 'Verified',
    downloads: 48,
    description: 'Casual, sick, and privilege leave utilization quota according to labor guidelines.',
    contentSnippet: 'Audit confirmed zero negative balances. Team leave utilization index stands at 78% healthy quota usage.'
  },
  {
    id: 'DOC-1049',
    title: 'Information Security & Data NDA Sign-Offs',
    category: 'Legal & Compliance',
    format: 'PDF',
    size: '3.1 MB',
    author: 'Legal & Risk Team',
    updatedAt: '12 Sep 2026',
    status: 'Action Required',
    downloads: 8,
    description: 'Annual ISO 27001 workplace confidentiality acknowledgments.',
    contentSnippet: '7 of 8 members have acknowledged. 1 pending sign-off from probationary developer.'
  }
];

// Direct Reports Repository
const teamMembersList = [
  { id: 'EMP-1042', name: 'Rahul Sharma', role: 'Senior Frontend Engineer', avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120&auto=format&fit=crop&q=80', docsCount: 18, status: 'In Office', statusType: 'present', pendingReview: 0 },
  { id: 'EMP-0921', name: 'Priya Verma', role: 'Lead UI/UX Designer', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&auto=format&fit=crop&q=80', docsCount: 22, status: 'Remote (WFH)', statusType: 'wfh', pendingReview: 1 },
  { id: 'EMP-1105', name: 'Amit Patel', role: 'Staff Backend Architect', avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=120&auto=format&fit=crop&q=80', docsCount: 26, status: 'In Office', statusType: 'present', pendingReview: 1 },
  { id: 'EMP-1218', name: 'Neha Roy', role: 'QA Automation Engineer', avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=120&auto=format&fit=crop&q=80', docsCount: 14, status: 'On Leave', statusType: 'leave', pendingReview: 0 },
  { id: 'EMP-0883', name: 'Vikram Singh', role: 'DevOps & Cloud Lead', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80', docsCount: 19, status: 'In Office', statusType: 'present', pendingReview: 1 },
];

export default function ManagerReports() {
  const [documents, setDocuments] = useState(initialDocuments);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [downloadingId, setDownloadingId] = useState(null);
  const [previewDoc, setPreviewDoc] = useState(null);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);
  const [activeTrendIndex, setActiveTrendIndex] = useState(4); // Default to Friday

  // New Upload Form State
  const [uploadForm, setUploadForm] = useState({
    title: '',
    category: 'Performance Appraisals',
    format: 'PDF',
    description: '',
  });

  const showToast = (title, desc) => {
    setToastMessage({ title, desc });
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Filtered documents list
  const filteredDocs = useMemo(() => {
    return documents.filter((doc) => {
      const matchesCategory = selectedCategory === 'All' || doc.category === selectedCategory;
      const matchesSearch =
        doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doc.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doc.id.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [documents, selectedCategory, searchQuery]);

  // Simulate file download
  const handleDownload = (doc) => {
    setDownloadingId(doc.id);
    setTimeout(() => {
      setDownloadingId(null);
      showToast('Document Downloaded', `${doc.title} (${doc.format}) saved to local machine.`);
    }, 1100);
  };

  // Add new Document
  const handleCreateDocument = (e) => {
    e.preventDefault();
    if (!uploadForm.title.trim()) return;

    const newEntry = {
      id: `DOC-${Math.floor(1000 + Math.random() * 9000)}`,
      title: uploadForm.title,
      category: uploadForm.category,
      format: uploadForm.format,
      size: '1.2 MB',
      author: 'Vikram Malhotra',
      updatedAt: 'Just now',
      status: 'Verified',
      downloads: 1,
      description: uploadForm.description || 'Uploaded manager record verified via electronic clearance.',
      contentSnippet: 'Electronic verification passed. Secure cloud hash generated and attached to compliance vault.'
    };

    setDocuments((prev) => [newEntry, ...prev]);
    setShowUploadModal(false);
    setUploadForm({ title: '', category: 'Performance Appraisals', format: 'PDF', description: '' });
    showToast('Document Published', `${newEntry.title} is now live in the repository.`);
  };

  return (
    <div className="min-h-screen bg-[#eef5fc] text-[#163b65] font-sans antialiased relative overflow-x-hidden selection:bg-[#1d70b8] selection:text-white pb-24">
      
      {/* BACKGROUND DECORATIVE LEAVES & VECTOR SILHOUETTES (From Reference Illustration) */}
      <div className="absolute top-10 left-[-20px] opacity-25 pointer-events-none select-none z-0">
        <svg width="240" height="420" viewBox="0 0 200 400" fill="none">
          <path d="M40 380 Q90 280 40 180 T70 20" stroke="#7ea3c4" strokeWidth="6" strokeLinecap="round" />
          <ellipse cx="60" cy="80" rx="35" ry="18" transform="rotate(-30 60 80)" fill="#9bbcd8" />
          <ellipse cx="25" cy="140" rx="32" ry="16" transform="rotate(35 25 140)" fill="#9bbcd8" />
          <ellipse cx="80" cy="190" rx="35" ry="18" transform="rotate(-25 80 190)" fill="#9bbcd8" />
          <ellipse cx="30" cy="260" rx="32" ry="16" transform="rotate(30 30 260)" fill="#9bbcd8" />
          <ellipse cx="75" cy="330" rx="35" ry="18" transform="rotate(-20 75 330)" fill="#9bbcd8" />
        </svg>
      </div>

      <div className="absolute top-32 right-[-25px] opacity-25 pointer-events-none select-none z-0">
        <svg width="240" height="420" viewBox="0 0 200 400" fill="none">
          <path d="M160 380 Q110 280 160 180 T130 20" stroke="#7ea3c4" strokeWidth="6" strokeLinecap="round" />
          <ellipse cx="140" cy="80" rx="35" ry="18" transform="rotate(30 140 80)" fill="#9bbcd8" />
          <ellipse cx="175" cy="140" rx="32" ry="16" transform="rotate(-35 175 140)" fill="#9bbcd8" />
          <ellipse cx="120" cy="190" rx="35" ry="18" transform="rotate(25 120 190)" fill="#9bbcd8" />
          <ellipse cx="170" cy="260" rx="32" ry="16" transform="rotate(-30 170 260)" fill="#9bbcd8" />
          <ellipse cx="125" cy="330" rx="35" ry="18" transform="rotate(20 125 330)" fill="#9bbcd8" />
        </svg>
      </div>

      {/* TOAST NOTIFICATION */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3.5 bg-[#102a45] text-white px-5 py-3.5 rounded-2xl shadow-2xl border-2 border-[#1d70b8] animate-in fade-in slide-in-from-bottom-5 duration-300">
          <div className="p-2 rounded-xl bg-[#1d70b8]/30 text-[#60a5fa]">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <h5 className="text-sm font-bold tracking-tight text-white">{toastMessage.title}</h5>
            <p className="text-xs text-[#cbdfe9] mt-0.5">{toastMessage.desc}</p>
          </div>
          <button
            onClick={() => setToastMessage(null)}
            className="ml-3 p-1 rounded-lg text-slate-400 hover:text-white transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* MAIN CONTAINER */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 relative z-10 space-y-8">
        
        {/* ================= HERO BANNER (MATCHING ILLUSTRATION HEADER) ================= */}
        <div className="bg-gradient-to-r from-[#163b65] via-[#1b4b7f] to-[#1d70b8] rounded-3xl p-6 sm:p-8 text-white shadow-xl shadow-[#102a45]/15 border-2 border-[#102a45]/30 relative overflow-hidden">
          
          {/* Subtle Vector Highlights */}
          <div className="absolute top-0 right-0 translate-x-12 -translate-y-8 w-64 h-64 bg-white/10 rounded-full blur-2xl pointer-events-none" />
          <div className="absolute bottom-0 right-1/4 translate-y-12 w-48 h-48 bg-[#60a5fa]/20 rounded-full blur-xl pointer-events-none" />

          <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="space-y-2 max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md border border-white/20 text-xs font-extrabold uppercase tracking-widest text-[#d8ebfa]">
                <FolderOpen className="w-3.5 h-3.5" />
                HR DOCUMENT MANAGEMENT SOFTWARE
              </div>
              <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white leading-tight">
                Team Reports & Document Repository
              </h1>
              <p className="text-xs sm:text-sm text-[#d1e2f2] font-medium leading-relaxed">
                Centralized vault for engineering time logs, compliance signatures, timesheet registries, and team audit certifications.
              </p>
            </div>

            {/* Global Actions matching illustration buttons */}
            <div className="flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={() => setShowUploadModal(true)}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-white text-[#163b65] hover:bg-[#ebf3fa] text-xs sm:text-sm font-extrabold shadow-md hover:shadow-lg transition-all active:scale-95"
              >
                <UploadCloud className="w-4 h-4 text-[#1d70b8]" />
                Upload Document
              </button>

              <button
                type="button"
                onClick={() => {
                  showToast('Export Triggered', 'Full team document bundle (.zip) is preparing for download.');
                }}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-[#0f294a] text-white hover:bg-[#0b1f38] text-xs sm:text-sm font-extrabold border border-white/20 shadow-md transition-all active:scale-95"
              >
                <Download className="w-4 h-4 text-[#60a5fa]" />
                Export Archive
              </button>
            </div>
          </div>
        </div>

        {/* ================= 4 METRICS CARDS ================= */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          
          <div className="bg-white rounded-3xl p-5 border-2 border-[#cfe1f0] shadow-sm hover:shadow-md hover:border-[#1d70b8] transition-all">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#6387a8]">
                Audit Compliance
              </span>
              <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                <ArrowUpRight className="w-3.5 h-3.5" />
                {initialStats.complianceRate.change}
              </span>
            </div>
            <h3 className="mt-2 text-3xl font-black text-[#102a45] tracking-tight">
              {initialStats.complianceRate.value}
            </h3>
            <p className="mt-1 text-xs text-[#527494] font-semibold">
              {initialStats.complianceRate.subtitle}
            </p>
          </div>

          <div className="bg-white rounded-3xl p-5 border-2 border-[#cfe1f0] shadow-sm hover:shadow-md hover:border-[#1d70b8] transition-all">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#6387a8]">
                Engineering Staff
              </span>
              <span className="inline-flex items-center gap-1 text-xs font-bold text-[#1d70b8] bg-[#eef5fc] px-2 py-0.5 rounded-full border border-[#cbdfe9]">
                <Users className="w-3 h-3" />
                Active
              </span>
            </div>
            <h3 className="mt-2 text-3xl font-black text-[#102a45] tracking-tight">
              {initialStats.teamStrength.value}
            </h3>
            <p className="mt-1 text-xs text-[#527494] font-semibold">
              {initialStats.teamStrength.subtitle}
            </p>
          </div>

          <div className="bg-white rounded-3xl p-5 border-2 border-[#cfe1f0] shadow-sm hover:shadow-md hover:border-[#1d70b8] transition-all">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#6387a8]">
                Certified Records
              </span>
              <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                <ShieldCheck className="w-3.5 h-3.5" />
                Secure
              </span>
            </div>
            <h3 className="mt-2 text-3xl font-black text-[#1d70b8] tracking-tight">
              {initialStats.verifiedDocs.value}
            </h3>
            <p className="mt-1 text-xs text-[#527494] font-semibold">
              {initialStats.verifiedDocs.subtitle}
            </p>
          </div>

          <div className="bg-white rounded-3xl p-5 border-2 border-[#cfe1f0] shadow-sm hover:shadow-md hover:border-[#1d70b8] transition-all">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#6387a8]">
                Pending Actions
              </span>
              <span className="inline-flex items-center gap-1 text-xs font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                <Clock className="w-3.5 h-3.5" />
                Attention
              </span>
            </div>
            <h3 className="mt-2 text-3xl font-black text-[#d97706] tracking-tight">
              {initialStats.pendingAction.value}
            </h3>
            <p className="mt-1 text-xs text-[#527494] font-semibold">
              {initialStats.pendingAction.subtitle}
            </p>
          </div>

        </section>

        {/* ================= MONITOR-STYLE WORKSPACE (MATCHING THE ILLUSTRATION) ================= */}
        <section className="bg-white rounded-3xl border-4 border-[#163b65] p-6 sm:p-8 shadow-2xl shadow-[#102a45]/10 relative">
          
          {/* Top Bar inside Monitor Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between pb-6 border-b-2 border-[#e1ecf5] gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-[#1d70b8] text-white flex items-center justify-center font-black shadow-md">
                <FileText className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-xl sm:text-2xl font-black text-[#102a45] tracking-tight">
                    Weekly Timesheet & Efficiency Graph
                  </h2>
                  <span className="px-2.5 py-0.5 rounded-full text-[11px] font-extrabold bg-[#eaf2f9] text-[#1d70b8] border border-[#cbdfe9]">
                    Live Monitor
                  </span>
                </div>
                <p className="text-xs text-[#6387a8] font-medium">
                  Tracking daily engineering hours, document approvals, and on-time attendance trends.
                </p>
              </div>
            </div>

            {/* Quick Interactive Legend */}
            <div className="flex items-center gap-3 text-xs font-bold bg-[#f1f6fb] px-3.5 py-2 rounded-2xl border border-[#cfe1f0]">
              <span className="flex items-center gap-1.5 text-[#102a45]">
                <span className="w-3 h-3 rounded-full bg-[#1d70b8]" />
                Efficiency Index
              </span>
              <span className="text-slate-300">•</span>
              <span className="flex items-center gap-1.5 text-slate-600">
                <span className="w-3 h-3 rounded-full bg-[#102a45]" />
                Present ({trendData[activeTrendIndex].present}/8)
              </span>
            </div>
          </div>

          {/* TWO-COLUMN WORKSPACE: LINE CHART & INSPECTOR */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pt-6 items-center">
            
            {/* VECTOR LINE CHART CANVAS (Matches the visual vector graph on monitor in illustration) */}
            <div className="lg:col-span-2 bg-[#f4f8fc] rounded-2xl p-5 border-2 border-[#d5e4f2] relative">
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-black uppercase tracking-wider text-[#163b65] flex items-center gap-1.5">
                  <TrendingUp className="w-4 h-4 text-[#1d70b8]" />
                  Team Work Index Trend Line
                </span>
                <span className="text-xs font-mono font-bold text-[#1d70b8]">
                  Selected: {trendData[activeTrendIndex].day}, {trendData[activeTrendIndex].date}
                </span>
              </div>

              {/* Vector SVG Line Chart */}
              <div className="h-52 w-full relative">
                <svg viewBox="0 0 700 200" className="w-full h-full overflow-visible">
                  <defs>
                    <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#1d70b8" stopOpacity="0.25" />
                      <stop offset="100%" stopColor="#1d70b8" stopOpacity="0.0" />
                    </linearGradient>
                  </defs>

                  {/* Horizontal Grid lines */}
                  <line x1="0" y1="30" x2="700" y2="30" stroke="#d5e4f2" strokeWidth="1.5" strokeDasharray="4 4" />
                  <line x1="0" y1="80" x2="700" y2="80" stroke="#d5e4f2" strokeWidth="1.5" strokeDasharray="4 4" />
                  <line x1="0" y1="130" x2="700" y2="130" stroke="#d5e4f2" strokeWidth="1.5" strokeDasharray="4 4" />
                  <line x1="0" y1="180" x2="700" y2="180" stroke="#d5e4f2" strokeWidth="1.5" />

                  {/* Shaded Area under Curve */}
                  <polygon
                    points="
                      50,180
                      50,90
                      150,115
                      250,60
                      350,100
                      450,40
                      550,150
                      650,65
                      650,180
                    "
                    fill="url(#areaGradient)"
                  />

                  {/* High Contrast Primary Blue Line */}
                  <polyline
                    fill="none"
                    stroke="#1d70b8"
                    strokeWidth="4.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    points="
                      50,90
                      150,115
                      250,60
                      350,100
                      450,40
                      550,150
                      650,65
                    "
                  />

                  {/* Clickable Interactive Nodes */}
                  {[
                    { cx: 50, cy: 90, idx: 0 },
                    { cx: 150, cy: 115, idx: 1 },
                    { cx: 250, cy: 60, idx: 2 },
                    { cx: 350, cy: 100, idx: 3 },
                    { cx: 450, cy: 40, idx: 4 },
                    { cx: 550, cy: 150, idx: 5 },
                    { cx: 650, cy: 65, idx: 6 },
                  ].map((node) => {
                    const isSelected = activeTrendIndex === node.idx;
                    return (
                      <g key={node.idx} className="cursor-pointer" onClick={() => setActiveTrendIndex(node.idx)}>
                        <circle
                          cx={node.cx}
                          cy={node.cy}
                          r={isSelected ? 9 : 6}
                          fill={isSelected ? '#102a45' : '#ffffff'}
                          stroke="#1d70b8"
                          strokeWidth="3.5"
                          className="transition-all duration-150"
                        />
                      </g>
                    );
                  })}
                </svg>

                {/* X-Axis Labels */}
                <div className="flex justify-between px-6 mt-1 text-[11px] font-extrabold uppercase text-[#6387a8]">
                  {trendData.map((d, idx) => (
                    <button
                      key={d.day}
                      onClick={() => setActiveTrendIndex(idx)}
                      className={`hover:text-[#1d70b8] transition ${
                        activeTrendIndex === idx ? 'text-[#102a45] font-black underline underline-offset-4' : ''
                      }`}
                    >
                      {d.day}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* INSPECT CARD (MATCHES UPLOAD/AUDIT TILE IN ILLUSTRATION) */}
            <div className="bg-[#102a45] text-white rounded-2xl p-6 shadow-lg border-2 border-[#163b65] flex flex-col justify-between h-full">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-extrabold uppercase tracking-widest text-[#93c5fd]">
                    Day Audit Inspect
                  </span>
                  <span className="px-2 py-0.5 rounded-md bg-[#1d70b8] text-white text-xs font-mono font-bold">
                    {trendData[activeTrendIndex].day}
                  </span>
                </div>

                <div className="pt-1">
                  <div className="text-3xl font-black tracking-tight text-white">
                    {trendData[activeTrendIndex].rate}%
                  </div>
                  <p className="text-xs text-[#cfe1f0] mt-0.5 font-medium">
                    Team Operational Efficiency Rating
                  </p>
                </div>

                <div className="space-y-2 pt-3 border-t border-white/10 text-xs">
                  <div className="flex justify-between">
                    <span className="text-[#93c5fd]">Physical In-Office:</span>
                    <span className="font-bold text-white">{trendData[activeTrendIndex].present} Engineers</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#93c5fd]">Remote Telecommute:</span>
                    <span className="font-bold text-white">{trendData[activeTrendIndex].wfh} Engineers</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#93c5fd]">Documents Signed:</span>
                    <span className="font-bold text-white">{trendData[activeTrendIndex].docs} Records</span>
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => showToast('Audit Verified', `Day sign-off verified for ${trendData[activeTrendIndex].day}.`)}
                className="mt-6 w-full py-2.5 px-4 rounded-xl bg-[#1d70b8] hover:bg-[#165ba2] text-white text-xs font-extrabold transition-all shadow-md text-center"
              >
                Sign Off Daily Register
              </button>
            </div>

          </div>
        </section>

        {/* ================= DOCUMENT REPOSITORY REGISTRY ================= */}
        <section className="bg-white rounded-3xl border-2 border-[#cfe1f0] p-6 sm:p-8 shadow-sm space-y-6">
          
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-[#e1ecf5]">
            <div>
              <h3 className="text-xl font-black text-[#102a45] tracking-tight">
                HR Document Vault & Downloads
              </h3>
              <p className="text-xs text-[#6387a8] font-medium">
                Official registers, statutory time-logs, and appraisal spreadsheets ready for audit.
              </p>
            </div>

            {/* Category Filter Chips */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
              {['All', 'Performance Appraisals', 'Timesheets & Attendance', 'Payroll & Compensation', 'Legal & Compliance'].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-extrabold whitespace-nowrap transition-all ${
                    selectedCategory === cat
                      ? 'bg-[#102a45] text-white shadow-sm'
                      : 'bg-[#eef5fc] text-[#163b65] hover:bg-[#dce9f5]'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Search Box */}
          <div className="relative">
            <Search className="w-4 h-4 text-[#6387a8] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search reports by title, category, or ID (e.g., DOC-1088)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm bg-[#f8fbfe] border-2 border-[#cfe1f0] rounded-2xl outline-none focus:border-[#1d70b8] transition text-[#102a45] font-semibold placeholder:text-slate-400"
            />
          </div>

          {/* Document Table */}
          <div className="border-2 border-[#cfe1f0] rounded-2xl overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#f1f6fb] border-b-2 border-[#cfe1f0] text-[11px] font-black text-[#163b65] uppercase tracking-wider">
                  <th className="py-3.5 px-4">Document Title & Details</th>
                  <th className="py-3.5 px-4">Category</th>
                  <th className="py-3.5 px-4">Format & Size</th>
                  <th className="py-3.5 px-4">Compliance Status</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#e4edf5] text-xs sm:text-sm font-medium">
                {filteredDocs.length > 0 ? (
                  filteredDocs.map((doc) => {
                    const isDownloading = downloadingId === doc.id;
                    return (
                      <tr key={doc.id} className="hover:bg-[#f9fcff] transition">
                        
                        <td className="py-4 px-4 max-w-sm">
                          <div className="flex items-start gap-3">
                            <div className="p-2.5 rounded-xl bg-[#eef5fc] text-[#1d70b8] border border-[#cfe1f0] shrink-0 mt-0.5">
                              {doc.format === 'XLSX' ? (
                                <FileSpreadsheet className="w-5 h-5 text-emerald-600" />
                              ) : doc.format === 'CSV' ? (
                                <FileDown className="w-5 h-5 text-amber-600" />
                              ) : (
                                <FileText className="w-5 h-5 text-[#1d70b8]" />
                              )}
                            </div>
                            <div>
                              <span className="font-extrabold text-[#102a45] block tracking-tight">
                                {doc.title}
                              </span>
                              <span className="text-xs text-[#6387a8] font-medium line-clamp-1 mt-0.5">
                                {doc.description}
                              </span>
                            </div>
                          </div>
                        </td>

                        <td className="py-4 px-4 whitespace-nowrap">
                          <span className="px-2.5 py-1 rounded-lg bg-[#eaf2f9] text-[#163b65] font-bold text-xs border border-[#cbdfe9]">
                            {doc.category}
                          </span>
                        </td>

                        <td className="py-4 px-4 whitespace-nowrap font-mono text-xs text-[#102a45]">
                          <span className="font-bold">.{doc.format}</span>
                          <span className="text-[#6387a8] block text-[11px] font-sans font-medium">{doc.size}</span>
                        </td>

                        <td className="py-4 px-4 whitespace-nowrap">
                          <span
                            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-extrabold border ${
                              doc.status === 'Verified'
                                ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                : doc.status === 'Pending Signature'
                                ? 'bg-amber-50 text-amber-700 border-amber-200'
                                : 'bg-rose-50 text-rose-700 border-rose-200'
                            }`}
                          >
                            <span
                              className={`w-2 h-2 rounded-full ${
                                doc.status === 'Verified'
                                  ? 'bg-emerald-500'
                                  : doc.status === 'Pending Signature'
                                  ? 'bg-amber-500 animate-pulse'
                                  : 'bg-rose-500'
                              }`}
                            />
                            {doc.status}
                          </span>
                        </td>

                        <td className="py-4 px-4 text-right whitespace-nowrap">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              type="button"
                              onClick={() => setPreviewDoc(doc)}
                              className="px-3 py-1.5 rounded-xl border border-[#cfe1f0] bg-white hover:bg-[#eef5fc] text-[#163b65] text-xs font-extrabold transition shadow-2xs inline-flex items-center gap-1"
                            >
                              <Eye className="w-3.5 h-3.5 text-[#1d70b8]" />
                              Preview
                            </button>

                            <button
                              type="button"
                              onClick={() => handleDownload(doc)}
                              disabled={isDownloading}
                              className="px-3.5 py-1.5 rounded-xl bg-[#1d70b8] hover:bg-[#165ba2] text-white text-xs font-extrabold transition shadow-2xs inline-flex items-center gap-1.5 disabled:opacity-50"
                            >
                              {isDownloading ? (
                                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                              ) : (
                                <Download className="w-3.5 h-3.5" />
                              )}
                              <span>{isDownloading ? 'Fetching...' : 'Download'}</span>
                            </button>
                          </div>
                        </td>

                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan="5" className="text-center py-10 text-slate-400 font-medium text-xs">
                      No documents found matching the filter criteria.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>

        {/* ================= DIRECT TEAM ROSTER & TIMESHEET STATUS ================= */}
        <section className="bg-white rounded-3xl border-2 border-[#cfe1f0] p-6 sm:p-8 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-xl font-black text-[#102a45] tracking-tight">
                Direct Report Document Compliance Roster
              </h3>
              <p className="text-xs text-[#6387a8] font-medium">
                Real-time compliance status of engineering team members and pending sign-offs.
              </p>
            </div>
            <span className="text-xs font-bold text-[#163b65] bg-[#eef5fc] px-3 py-1 rounded-xl border border-[#cfe1f0]">
              5 Assigned Team Members
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {teamMembersList.map((member) => (
              <div
                key={member.id}
                className="bg-[#f8fbfe] rounded-2xl p-4 border-2 border-[#d5e4f2] hover:border-[#1d70b8] transition flex flex-col justify-between gap-3 shadow-2xs"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <img
                      src={member.avatar}
                      alt={member.name}
                      className="w-11 h-11 rounded-full object-cover border-2 border-[#1d70b8]"
                    />
                    <div>
                      <h4 className="font-black text-sm text-[#102a45]">{member.name}</h4>
                      <p className="text-[11px] text-[#6387a8] font-medium">{member.role}</p>
                    </div>
                  </div>
                  <span
                    className={`text-[10px] font-extrabold px-2 py-0.5 rounded-md ${
                      member.statusType === 'present'
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : member.statusType === 'wfh'
                        ? 'bg-blue-50 text-blue-700 border border-blue-200'
                        : 'bg-rose-50 text-rose-700 border border-rose-200'
                    }`}
                  >
                    {member.status}
                  </span>
                </div>

                <div className="pt-2 border-t border-[#e2edf7] flex items-center justify-between text-xs">
                  <span className="text-[#6387a8] font-semibold">
                    Vault Docs: <strong className="text-[#102a45]">{member.docsCount} files</strong>
                  </span>
                  {member.pendingReview > 0 ? (
                    <span className="text-[11px] font-extrabold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full">
                      1 Pending Sign
                    </span>
                  ) : (
                    <span className="text-[11px] font-extrabold text-emerald-700 flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" /> All Clear
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>

      </div>

      {/* ================= PREVIEW MODAL ================= */}
      {previewDoc && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#102a45]/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
          <div className="w-full max-w-2xl bg-white rounded-3xl border-4 border-[#163b65] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            
            {/* Modal Header */}
            <div className="p-6 bg-[#163b65] text-white flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-[#60a5fa] border border-white/20">
                  <FileCheck className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-extrabold text-base tracking-tight">{previewDoc.title}</h4>
                  <p className="text-xs text-[#cbdfe9] font-medium">
                    ID: {previewDoc.id} • Format: .{previewDoc.format} • Size: {previewDoc.size}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setPreviewDoc(null)}
                className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-4">
              <div className="rounded-2xl bg-[#eef5fc] p-4 border border-[#cfe1f0] space-y-2">
                <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#163b65]">
                  Document Abstract & Executive Summary
                </span>
                <p className="text-xs sm:text-sm text-[#102a45] leading-relaxed font-semibold">
                  {previewDoc.contentSnippet}
                </p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="text-[#6387a8] block text-[10px] uppercase font-bold">Category</span>
                  <span className="font-extrabold text-[#102a45]">{previewDoc.category}</span>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="text-[#6387a8] block text-[10px] uppercase font-bold">Created By</span>
                  <span className="font-extrabold text-[#102a45]">{previewDoc.author}</span>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="text-[#6387a8] block text-[10px] uppercase font-bold">Compliance Sign</span>
                  <span className="font-extrabold text-emerald-600">{previewDoc.status}</span>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-5 bg-[#f8fbfe] border-t border-[#e2edf7] flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setPreviewDoc(null)}
                className="px-4 py-2 rounded-xl text-xs font-extrabold text-[#163b65] hover:bg-[#dce9f5] transition"
              >
                Close Preview
              </button>
              <button
                type="button"
                onClick={() => {
                  const d = previewDoc;
                  setPreviewDoc(null);
                  handleDownload(d);
                }}
                className="inline-flex items-center gap-2 px-5 py-2 rounded-xl bg-[#1d70b8] hover:bg-[#165ba2] text-white text-xs font-extrabold shadow-sm transition"
              >
                <Download className="w-4 h-4" />
                Download Document
              </button>
            </div>

          </div>
        </div>
      )}

      {/* ================= UPLOAD MODAL ================= */}
      {showUploadModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#102a45]/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
          <form
            onSubmit={handleCreateDocument}
            className="w-full max-w-lg bg-white rounded-3xl border-4 border-[#163b65] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200"
          >
            <div className="p-6 bg-[#163b65] text-white flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <UploadCloud className="w-5 h-5 text-[#60a5fa]" />
                <h4 className="font-extrabold text-base">Publish Document to HR Repository</h4>
              </div>
              <button
                type="button"
                onClick={() => setShowUploadModal(false)}
                className="p-1 rounded-lg text-slate-300 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4 text-xs sm:text-sm">
              <div>
                <label className="block text-[11px] font-extrabold uppercase text-[#163b65] mb-1">
                  Document Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Q4 Sprint Velocity & Overtime Sign-off"
                  value={uploadForm.title}
                  onChange={(e) => setUploadForm({ ...uploadForm, title: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border-2 border-[#cfe1f0] bg-[#f8fbfe] text-[#102a45] font-semibold outline-none focus:border-[#1d70b8]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-extrabold uppercase text-[#163b65] mb-1">
                    Category
                  </label>
                  <select
                    value={uploadForm.category}
                    onChange={(e) => setUploadForm({ ...uploadForm, category: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl border-2 border-[#cfe1f0] bg-[#f8fbfe] text-[#102a45] font-semibold outline-none"
                  >
                    <option value="Performance Appraisals">Performance Appraisals</option>
                    <option value="Timesheets & Attendance">Timesheets & Attendance</option>
                    <option value="Payroll & Compensation">Payroll & Compensation</option>
                    <option value="Legal & Compliance">Legal & Compliance</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-extrabold uppercase text-[#163b65] mb-1">
                    File Type
                  </label>
                  <select
                    value={uploadForm.format}
                    onChange={(e) => setUploadForm({ ...uploadForm, format: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl border-2 border-[#cfe1f0] bg-[#f8fbfe] text-[#102a45] font-semibold outline-none"
                  >
                    <option value="PDF">PDF (.pdf)</option>
                    <option value="XLSX">Excel (.xlsx)</option>
                    <option value="CSV">CSV (.csv)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-extrabold uppercase text-[#163b65] mb-1">
                  Brief Description & Metadata
                </label>
                <textarea
                  rows="3"
                  placeholder="Summarize the contents of this document for auditing..."
                  value={uploadForm.description}
                  onChange={(e) => setUploadForm({ ...uploadForm, description: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border-2 border-[#cfe1f0] bg-[#f8fbfe] text-[#102a45] font-semibold outline-none focus:border-[#1d70b8]"
                />
              </div>
            </div>

            <div className="p-5 bg-[#f8fbfe] border-t border-[#e2edf7] flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setShowUploadModal(false)}
                className="px-4 py-2 rounded-xl text-xs font-extrabold text-[#163b65]"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-[#1d70b8] hover:bg-[#165ba2] text-white text-xs font-extrabold shadow-sm transition"
              >
                Publish Record
              </button>
            </div>
          </form>
        </div>
      )}

    </div>
  );
}