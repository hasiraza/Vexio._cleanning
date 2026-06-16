import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  Sparkles,
  Zap,
  ArrowRight,
  Code,
  ShieldCheck,
  Check,
  Cpu,
  TrendingUp,
  RotateCcw,
  Sliders,
  BarChart4,
  Layers,
  Database,
  Terminal,
  Play
} from 'lucide-react';

interface LandingPageProps {
  onStartApp: () => void;
  onGoToAuth: () => void;
}

export default function LandingPage({ onStartApp, onGoToAuth }: LandingPageProps) {
  const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'yearly'>('yearly');

  const stats = [
    { value: '12.4M+', label: 'Rows Cleansed', sub: 'Across enterprise logs' },
    { value: '99.94%', label: 'Precision Accuracy', sub: 'Zero-loss auto-imputation' },
    { value: '<2.1s', label: 'Average Compute Speed', sub: 'Per million records' }
  ];

  const features = [
    {
      icon: <Sparkles className="w-5 h-5 text-indigo-400" />,
      title: "Generative AI Auto-imprinting",
      description: "Automatically detects contextual empty cells, filling with hyper-realistic synthetic samples using advanced LLM reasoning."
    },
    {
      icon: <Zap className="w-5 h-5 text-cyan-400" />,
      title: "Outlier & Sensor Noise Filtering",
      description: "Advanced numeric statistical detection (IQR/Z-score) finds extreme anomaly skews or faulty hardware telemetry feeds."
    },
    {
      icon: <Layers className="w-5 h-5 text-purple-400" />,
      title: "One-Hot & Binary Encoder",
      description: "Convert fuzzy strings or un-indexed category keys into fully responsive ML-ready binary numeric columns at scale."
    },
    {
      icon: <Sliders className="w-5 h-5 text-emerald-400" />,
      title: "Logarithmic & Standard Scaling",
      description: "Transform dynamic variance arrays with zero clipping. Normalizes high-skew distributions across secure standards."
    },
    {
      icon: <Database className="w-5 h-5 text-pink-400" />,
      title: "Fuzzy Deduplication Engine",
      description: "Deep text levenshtein similarity logic spots phonetically repeating contacts or nested user duplicates."
    },
    {
      icon: <Code className="w-5 h-5 text-sky-400" />,
      title: "Interactive Spreadsheet Hub",
      description: "Virtual columns, cell inline mouse-editing, full state undo-redo queue, search filtering, and zero-flicker loading."
    }
  ];

  const pricingTiers = [
    {
      name: "Sandbox",
      price_monthly: 0,
      price_yearly: 0,
      desc: "Perfect for students, hobbyists, and diagnostic testing.",
      cta: "Launch Workspace",
      popular: false,
      features: [
        "Up to 5,000 Excel/CSV rows",
        "AI Diagnostic engine scans",
        "Label & binary classification",
        "Standard Min-Max transformations",
        "Local history tracking (10 entries)"
      ]
    },
    {
      name: "Professional",
      price_monthly: 49,
      price_yearly: 39,
      desc: "Ideal for growth-stage data analysts and engineers.",
      cta: "Unlock AI Scaling",
      popular: true,
      features: [
        "Up to 1,000,000 rows per upload",
        "Full generative AI auto-imposition",
        "Continuous IQR anomaly correction",
        "Custom programmatic logic bindings",
        "Instant PDF/Parquet exports",
        "Dedicated API key keyspace"
      ]
    },
    {
      name: "Enterprise",
      price_monthly: 199,
      price_yearly: 159,
      desc: "Engineered for high-volume biomedical and financial systems.",
      cta: "Contact Architecture",
      popular: false,
      features: [
        "Infinite datasets & stream tables",
        "Custom LLM training weights",
        "Dedicated isolated Docker runners",
        "99.99% active SLA guarantee",
        "SAML SSO & OAuth profile bindings",
        "24/7 priority architecture support"
      ]
    }
  ];

  return (
    <div className="bg-[#0A0F1E] text-[#F0F4FF] overflow-x-hidden min-h-screen flex flex-col font-sans" id="landing-container">
      
      {/* Decorative Radial Aurora Canvas Glows */}
      <div className="absolute top-[-10%] left-[10%] w-[500px] h-[500px] bg-indigo-500/10 rounded-full blur-[140px] pointer-events-none select-none" />
      <div className="absolute top-[30%] right-[-10%] w-[600px] h-[600px] bg-cyan-500/5 rounded-full blur-[150px] pointer-events-none select-none" />
      <div className="absolute bottom-[10%] left-[-5%] w-[450px] h-[450px] bg-purple-500/5 rounded-full blur-[130px] pointer-events-none select-none" />

      {/* Landing Header Navigation */}
      <header className="border-b border-white/5 bg-[#0A0F1E]/80 backdrop-blur-md sticky top-0 z-50 py-4 transition-all" id="landing-header">
        <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-indigo-500/10 border border-indigo-500/35 rounded-lg text-[#6C63FF] shadow-inner">
              <Cpu className="w-5 h-5 text-indigo-400" />
            </div>
            <span className="text-xl font-heading font-semibold tracking-tight text-white flex items-center gap-1.5">
              Vexio<span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-indigo-400">.ai</span>
            </span>
          </div>

          {/* Nav links */}
          <nav className="hidden md:flex items-center gap-8 text-sm text-[rgba(240,244,255,0.7)] font-medium">
            <a href="#features" className="hover:text-[#00D4FF] transition-colors">Features</a>
            <a href="#demo" className="hover:text-[#00D4FF] transition-colors">How it Works</a>
            <a href="#pricing" className="hover:text-[#00D4FF] transition-colors">Pricing</a>
            <a href="#footer" className="hover:text-[#00D4FF] transition-colors">Documentation</a>
          </nav>

          <div className="flex items-center gap-3">
            <button
              onClick={onGoToAuth}
              className="text-sm font-semibold hover:text-[#00D4FF] transition-all px-4 py-2 hover:bg-white/5 rounded-lg border border-transparent hover:border-white/5 cursor-pointer"
              id="landing-signin"
            >
              Sign In
            </button>
            <button
              onClick={onStartApp}
              className="px-5 py-2 bg-[#6C63FF] hover:bg-[#5b51ff] shadow-lg shadow-indigo-500/20 text-white text-sm font-semibold rounded-xl transition-all hover:scale-[1.02] cursor-pointer flex items-center gap-1.5"
              id="landing-cta-entry"
            >
              Launch Workspace
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-20 pb-20 px-6 max-w-7xl mx-auto w-full flex flex-col items-center text-center" id="landing-hero">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex flex-col items-center"
        >
          {/* Version Pill */}
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/5 border border-white/10 rounded-full mb-6">
            <Sparkles className="w-3.5 h-3.5 text-[#00D4FF] animate-pulse" />
            <span className="text-xs font-mono text-cyan-400 tracking-wider">VEXIO 3.0 NEXT-GEN COMPUTATION RELEASED</span>
          </div>

          <h1 className="text-4xl md:text-6xl font-heading font-bold text-white tracking-tight leading-[1.1] max-w-3xl">
            Your data, <br className="sm:hidden" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-200 to-indigo-300">perfectly clean.</span>
          </h1>

          <p className="text-base md:text-lg text-[rgba(240,244,255,0.65)] max-w-xl mt-6 leading-relaxed">
            Vexio.ai uses generative artificial intelligence to automatically detect, fix, and scale disordered datasets in seconds. Build pipeline-ready outputs in one click.
          </p>

          {/* Action CTAs */}
          <div className="flex flex-col sm:flex-row gap-4 mt-10 w-full justify-center">
            <button
              onClick={onStartApp}
              className="px-7 py-3 bg-[#6C63FF] hover:bg-[#5b51ff] text-white text-base font-semibold rounded-xl shadow-lg shadow-[#6c63ff]/20 transition-all hover:scale-[1.02] cursor-pointer flex items-center justify-center gap-2"
              id="hero-primary-cta"
            >
              Get Started Free
              <ArrowRight className="w-4.5 h-4.5" />
            </button>
            <button
              onClick={() => {
                const element = document.getElementById('features');
                element?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="px-7 py-3 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 text-[#F0F4FF] text-base font-semibold rounded-xl transition-all cursor-pointer flex items-center justify-center gap-2"
              id="hero-secondary-cta"
            >
              Analyze Features
              <Sliders className="w-4.5 h-4.5 text-indigo-400" />
            </button>
          </div>
        </motion.div>

        {/* Dashboard Frame Mockup Container */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="w-full mt-16 max-w-5xl rounded-2xl border border-white/10 bg-[#0A0F1E]/50 overflow-hidden relative shadow-2xl p-2.5"
          id="hero-mockup"
        >
          {/* Glass Overlay Glow for Premium SaaS look */}
          <div className="absolute top-[-2%] left-[20%] right-[20%] h-[1px] bg-gradient-to-r from-transparent via-[#00D4FF] to-transparent opacity-80" />
          
          <div className="bg-[#090D1A] rounded-xl border border-white/5 overflow-hidden p-4 relative">
            
            {/* Header controls inside mockup */}
            <div className="flex justify-between items-center bg-[#0d142d] border border-white/5 p-3 rounded-lg mb-4">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
                <span className="text-[11px] font-mono text-[rgba(240,244,255,0.4)] ml-3">vexio_clean_leads.parquet</span>
              </div>
              <div className="flex items-center gap-2 px-2.5 py-1 bg-indigo-500/10 border border-indigo-500/30 rounded text-[10px] text-[#6C63FF] font-mono">
                <Sparkles className="w-3 h-3 text-[#A78BFA]" />
                99.8% READY TO TRAIN
              </div>
            </div>

            {/* Simulated interactive grid row content with premium glass panel style */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
              <div className="glass-panel p-4 rounded-xl text-left">
                <span className="text-[10px] font-mono text-cyan-400 block tracking-widest uppercase">Null Fill Rule</span>
                <span className="text-sm font-semibold block text-white mt-1">Imputed 142 records</span>
                <span className="text-xs text-slate-400 mt-0.5 block">Confidence vector: 98% (Mean Model)</span>
              </div>
              <div className="glass-panel-active p-4 rounded-xl text-left">
                <span className="text-[10px] font-mono text-purple-400 block tracking-widest uppercase">ML Binary Encoder</span>
                <span className="text-sm font-semibold block text-white mt-1">One-Hot State Columns</span>
                <span className="text-xs text-slate-400 mt-0.5 block">Generated +18 numerical categories</span>
              </div>
              <div className="glass-panel p-4 rounded-xl text-left">
                <span className="text-[10px] font-mono text-red-400 block tracking-widest uppercase">Sensor Anomaly Scan</span>
                <span className="text-sm font-semibold block text-white mt-1">9 extreme outlier values</span>
                <span className="text-xs text-slate-400 mt-0.5 block">Standard Z-Deviation set to 3.5</span>
              </div>
            </div>

            {/* Quick visualization spreadsheet representation */}
            <div className="border border-white/5 rounded-lg overflow-hidden bg-slate-950 font-mono text-xs text-left">
              <div className="grid grid-cols-5 p-2 bg-[#0E1532] border-b border-white/10 text-[rgba(240,244,255,0.5)]">
                <span>id</span>
                <span>full_name</span>
                <span>email</span>
                <span>purchase_count</span>
                <span>quality</span>
              </div>
              <div className="grid grid-cols-5 p-2.5 border-b border-white/5 text-[rgba(240,244,255,0.7)] hover:bg-white/5 transition-colors">
                <span>001</span>
                <span>Sarah Connor</span>
                <span>sconnor@cyberdyne.com</span>
                <span>1,250</span>
                <span className="text-emerald-400">100% Valid</span>
              </div>
              <div className="grid grid-cols-5 p-2.5 border-b border-white/5 text-[rgba(240,244,255,0.7)] bg-amber-500/10 hover:bg-[#6c63ff]/10 transition-colors">
                <span>002</span>
                <span className="text-slate-500 line-through">john connor</span>
                <span>jconnor@resistance.net</span>
                <span>45</span>
                <span className="text-amber-400 flex items-center gap-1">➔ Title Case Applied</span>
              </div>
              <div className="grid grid-cols-5 p-2.5 text-[rgba(240,244,255,0.7)] hover:bg-white/5 transition-colors">
                <span>003</span>
                <span>Marcus Wright</span>
                <span className="text-indigo-400 bg-indigo-500/10 px-1 rounded">mwright@skynet.com</span>
                <span>--</span>
                <span className="text-[#A78BFA]">Imputed Context</span>
              </div>
            </div>

          </div>
        </motion.div>
      </section>

      {/* Metrics Audit Track Section */}
      <section className="bg-[#090D1A] py-14 border-y border-white/5 relative z-10" id="landing-stats">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8 text-center" id="stats-grid">
          {stats.map((stat, i) => (
            <div key={i} className="flex flex-col items-center">
              <span className="text-4xl md:text-5xl font-heading font-bold text-transparent bg-clip-text bg-gradient-to-r from-white via-[#00D4FF] to-indigo-400 mb-2">
                {stat.value}
              </span>
              <span className="text-base font-semibold text-white tracking-tight">{stat.label}</span>
              <span className="text-xs text-[rgba(240,244,255,0.5)] mt-1">{stat.sub}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Bento Grid Core AI Features */}
      <section className="py-24 px-6 max-w-7xl mx-auto w-full relative z-10" id="features">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-heading font-medium text-white tracking-tight">
            Engineered for elite data architectures.
          </h2>
          <p className="text-sm md:text-base text-[rgba(240,244,255,0.65)] max-w-lg mx-auto mt-4 leading-relaxed">
            Replace dozens of messy Python scripts, nested Jupyter notebook queries, and manual spreadsheet adjustments with a single command workflow.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6" id="features-bento">
          {features.map((feat, i) => (
            <div
              key={i}
              className="glass-panel p-6 rounded-2xl relative hover:glass-panel-active transition-all duration-300 group hover:-translate-y-1 block text-left"
            >
              <div className="p-3 bg-white/5 border border-white/10 rounded-xl w-fit mb-5 text-[#6C63FF] group-hover:bg-[#6C63FF]/15 group-hover:border-[#6C63FF]/30 transition-all duration-300">
                {feat.icon}
              </div>
              <h3 className="text-lg font-heading font-medium text-white mb-2.5 flex items-center gap-1.5">
                {feat.title}
              </h3>
              <p className="text-xs text-[rgba(240,244,255,0.55)] leading-relaxed">
                {feat.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* How it Works Step Wizard */}
      <section className="bg-slate-950/40 py-20 border-t border-white/5" id="demo">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h2 className="text-2xl md:text-3xl font-heading font-medium text-white tracking-tight mb-4">
            Three simple steps to absolute data perfection.
          </h2>
          <p className="text-xs md:text-sm text-slate-400 max-w-md mx-auto mb-16 leading-relaxed">
            Drag, evaluate, clean. Vexio handles extreme values, data alignment, and categorical mapping behind a secure, private cloud infrastructure.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8" id="steps-container">
            <div className="p-6 relative text-left">
              <span className="text-5xl font-mono font-bold text-white/5 absolute top-2 right-4">01</span>
              <div className="p-2.5 bg-[#6C63FF]/10 text-[#6C63FF] w-fit rounded-lg mb-4 text-xs font-semibold tracking-widest font-mono">STEP ONE</div>
              <h4 className="text-base font-semibold text-slate-100 uppercase">Secure Dataset Ingest</h4>
              <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                Drop Excel spreadsheets, clinical test sets, or JSON log tables. Our local-first parser checks columns instantly.
              </p>
            </div>
            <div className="p-6 relative text-left border-t md:border-t-0 md:border-x border-white/5">
              <span className="text-5xl font-mono font-bold text-white/5 absolute top-2 right-4">02</span>
              <div className="p-2.5 bg-[#00D4FF]/10 text-[#00D4FF] w-fit rounded-lg mb-4 text-xs font-semibold tracking-widest font-mono">STEP TWO</div>
              <h4 className="text-base font-semibold text-slate-100 uppercase">AI Neural Incident Scan</h4>
              <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                Our model flags null cells, outlier skew, mismatched strings, and invalid categories, computing a deep quality rating.
              </p>
            </div>
            <div className="p-6 relative text-left">
              <span className="text-5xl font-mono font-bold text-white/5 absolute top-2 right-4">03</span>
              <div className="p-2.5 bg-emerald-500/10 text-emerald-400 w-fit rounded-lg mb-4 text-xs font-semibold tracking-widest font-mono">STEP THREE</div>
              <h4 className="text-base font-semibold text-slate-100 uppercase">Apply Rules & Export</h4>
              <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                Approve synthetic values, scale numeric features, standardize encoding, and download perfect analytical Parquet/CSV files.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Sections */}
      <section className="py-24 px-6 max-w-7xl mx-auto w-full relative z-10" id="pricing">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-heading font-medium text-white tracking-tight">
            Pricing built for every scale.
          </h2>
          <p className="text-sm text-slate-400 mt-3">
            Unlock maximum AI capabilities and start transforming datasets immediately.
          </p>

          {/* Billing Switch */}
          <div className="flex items-center justify-center gap-3.5 mt-8 mb-4">
            <span className={`text-xs font-semibold ${billingPeriod === 'monthly' ? 'text-white' : 'text-slate-500'}`}>Monthly Billing</span>
            <button
              onClick={() => setBillingPeriod(prev => prev === 'monthly' ? 'yearly' : 'monthly')}
              className="w-11 h-6 bg-indigo-500/20 border border-indigo-500/40 rounded-full relative p-0.5 transition-all outline-none"
            >
              <span className={`block w-4.5 h-4.5 rounded-full bg-[#00D4FF] absolute top-0.5 transition-all ${
                billingPeriod === 'yearly' ? 'translate-x-5.5' : 'translate-x-0.5'
              }`} />
            </button>
            <span className={`text-xs font-semibold flex items-center gap-1.5 ${billingPeriod === 'yearly' ? 'text-[#00D4FF]' : 'text-slate-500'}`}>
              Yearly billing
              <span className="px-1.5 py-0.5 bg-indigo-500/20 border border-indigo-500/40 text-[#A78BFA] text-[9px] rounded font-mono font-medium">SAVE 20%</span>
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8" id="pricing-matrix">
          {pricingTiers.map((tier, idx) => (
            <div
              key={idx}
              className={`p-8 rounded-2xl justify-between flex flex-col relative overflow-hidden transition-all duration-300 ${
                tier.popular
                  ? 'glass-panel border-[#6C63FF]/60 hover:border-[#6C63FF]/90 shadow-xl scale-[1.03] text-left'
                  : 'glass-panel hover:glass-panel-active hover:-translate-y-0.5 text-left'
              }`}
            >
              {tier.popular && (
                <div className="absolute top-4 right-4 bg-indigo-500 text-slate-950 font-mono text-[9px] tracking-widest font-bold uppercase px-2.5 py-1 rounded">
                  MOST POPULAR
                </div>
              )}

              <div>
                <h3 className="text-xl font-heading font-medium text-white">{tier.name}</h3>
                <p className="text-xs text-slate-400 mt-2 leading-relaxed">{tier.desc}</p>
                <div className="my-6 border-b border-white/5 pb-6">
                  <span className="text-4xl font-heading font-semibold text-white">
                    ${billingPeriod === 'yearly' ? tier.price_yearly : tier.price_monthly}
                  </span>
                  <span className="text-xs text-slate-500 font-mono"> / month</span>
                </div>

                <ul className="space-y-3.5 mb-8">
                  {tier.features.map((feat, fIdx) => (
                    <li key={fIdx} className="flex items-center gap-2.5 text-xs text-slate-300">
                      <Check className="w-4 h-4 text-[#00D4FF] flex-shrink-0" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <button
                onClick={onStartApp}
                className={`w-full py-2.5 rounded-lg text-xs font-bold transition-all ${
                  tier.popular
                    ? 'bg-[#6C63FF] hover:bg-[#5d54ff] text-white cursor-pointer shadow-md'
                    : 'bg-white/5 hover:bg-white/10 border border-white/10 text-white cursor-pointer'
                }`}
              >
                {tier.cta}
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Landing Screen Footer */}
      <footer className="border-t border-white/5 bg-[#070B16] py-14" id="footer">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8 mb-10 text-left">
          <div>
            <span className="text-base font-heading font-semibold text-white tracking-wide block mb-4">Product</span>
            <div className="flex flex-col gap-2.5 text-xs text-slate-400 font-medium">
              <a href="#features" className="hover:text-cyan-400 transition-colors">Auto Clean</a>
              <a href="#features" className="hover:text-cyan-400 transition-colors">Feature scaling</a>
              <a href="#demo" className="hover:text-cyan-400 transition-colors">Clinics Sandbox</a>
              <a href="#pricing" className="hover:text-cyan-400 transition-colors">Team workspace</a>
            </div>
          </div>
          <div>
            <span className="text-base font-heading font-semibold text-white tracking-wide block mb-4">Resources</span>
            <div className="flex flex-col gap-2.5 text-xs text-slate-400">
              <a href="#" className="hover:text-cyan-400 transition-colors">REST API Docs</a>
              <a href="#" className="hover:text-cyan-400 transition-colors">Python SDK wrapper</a>
              <a href="#" className="hover:text-cyan-400 transition-colors">Parquet Integration</a>
              <a href="#" className="hover:text-cyan-400 transition-colors">Privacy Auditing</a>
            </div>
          </div>
          <div>
            <span className="text-base font-heading font-semibold text-white tracking-wide block mb-4">Company</span>
            <div className="flex flex-col gap-2.5 text-xs text-slate-400">
              <a href="#" className="hover:text-cyan-400 transition-colors">About Us</a>
              <a href="#" className="hover:text-cyan-400 transition-colors">Security Center</a>
              <a href="#" className="hover:text-cyan-400 transition-colors">Pricing Policies</a>
              <a href="#" className="hover:text-cyan-400 transition-colors">Contact Stack</a>
            </div>
          </div>
          <div>
            <span className="text-base font-heading font-semibold text-white tracking-wide block mb-4">Integrations</span>
            <div className="flex flex-col gap-2.5 text-xs text-slate-400">
              <a href="#" className="hover:text-cyan-400 transition-colors">Pandas dataframe</a>
              <a href="#" className="hover:text-cyan-400 transition-colors">Google BigQuery</a>
              <a href="#" className="hover:text-cyan-400 transition-colors">PostgreSQL Client</a>
              <a href="#" className="hover:text-cyan-400 transition-colors">AWS Redshift tables</a>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-6 border-t border-white/5 pt-8 flex flex-col md:flex-row items-center justify-between text-xs text-slate-500 font-mono gap-4">
          <p>© 2026 Vexio.ai Corp. Deep neural offline-first computation standard.</p>
          <div className="flex gap-4">
            <a href="#" className="hover:text-slate-300">Privacy Policy</a>
            <span>//</span>
            <a href="#" className="hover:text-slate-300">Security Rule Matrix</a>
            <span>//</span>
            <a href="#" className="hover:text-slate-300">Support</a>
          </div>
        </div>
      </footer>

    </div>
  );
}
