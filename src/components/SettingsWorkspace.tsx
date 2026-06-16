import React, { useState } from 'react';
import {
  Settings,
  Key,
  Shield,
  CreditCard,
  Users,
  Plus,
  RefreshCw,
  Trash2,
  Check,
  Globe,
  Lock,
  Mail,
  User,
  ExternalLink,
  Cpu
} from 'lucide-react';
import { UserProfile } from '../types/data';

interface SettingsWorkspaceProps {
  user: UserProfile;
  onChangeUser: (updated: UserProfile) => void;
  onAddToast: (msg: string, type: 'success' | 'warning' | 'error') => void;
}

interface ApiKeyItem {
  id: string;
  name: string;
  keyStr: string;
  scope: string;
  createdAt: string;
}

export default function SettingsWorkspace({
  user,
  onChangeUser,
  onAddToast
}: SettingsWorkspaceProps) {
  const [activeSubTab, setActiveSubTab] = useState<'profile' | 'api' | 'billing' | 'team'>('profile');

  // Profile forms
  const [nameVal, setNameVal] = useState(user.name);
  const [emailVal, setEmailVal] = useState(user.email);
  const [planVal, setPlanVal] = useState(user.plan);

  // Api Keys collections state
  const [apiKeys, setApiKeys] = useState<ApiKeyItem[]>([
    { id: 'key-1', name: 'Vexio Production Pipeline', keyStr: 'vx_live_e9389fb89320faccc82', scope: 'Read-Write', createdAt: '2026-04-12' },
    { id: 'key-2', name: 'Clinical Imputer Lambda', keyStr: 'vx_test_92c8172900fa27dcb8', scope: 'Read Only', createdAt: '2026-05-30' }
  ]);
  const [newKeyName, setNewKeyName] = useState('');
  const [newKeyScope, setNewKeyScope] = useState('Read-Write');

  // Team list state
  const [teamMembers, setTeamMembers] = useState([
    { name: 'Dr. Helen Vance', role: 'Clinical Data Scientist', status: 'Online', email: 'helen@vexio.ai' },
    { name: 'Marcus Sterling', role: 'DevOps Architect', status: 'Offline', email: 'marcus@vexio.ai' }
  ]);
  const [newMemberEmail, setNewMemberEmail] = useState('');
  const [newMemberRole, setNewMemberRole] = useState('Data Wrangler');

  const handleUpdateProfileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onChangeUser({
      ...user,
      name: nameVal,
      email: emailVal,
      plan: planVal as any
    });
    onAddToast('Credentials profile updated on host node.', 'success');
  };

  const handleGenerateApiKey = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newKeyName.trim()) {
      onAddToast('Please declare an API key descriptor first.', 'error');
      return;
    }
    const token = `vx_${newKeyScope === 'Read-Write' ? 'live' : 'test'}_${Math.random().toString(16).substring(2, 10)}${Math.random().toString(16).substring(2, 10)}`;
    const newKeyItem: ApiKeyItem = {
      id: `key-${Date.now()}`,
      name: newKeyName,
      keyStr: token,
      scope: newKeyScope,
      createdAt: new Date().toISOString().slice(0, 10)
    };

    setApiKeys((prev) => [...prev, newKeyItem]);
    setNewKeyName('');
    onAddToast(`Dispatched secret mesh credential token: ${newKeyName}`, 'success');
  };

  const handleDeleteApiKey = (keyId: string) => {
    setApiKeys((prev) => prev.filter((k) => k.id !== keyId));
    onAddToast('Revoked specific API credentials pipeline route.', 'warning');
  };

  const handleAddTeamMember = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMemberEmail.trim() || !newMemberEmail.includes('@')) {
      onAddToast('Declare a valid cooperative email account.', 'error');
      return;
    }
    setTeamMembers((prev) => [
      ...prev,
      { name: newMemberEmail.split('@')[0], role: newMemberRole, status: 'Online', email: newMemberEmail }
    ]);
    setNewMemberEmail('');
    onAddToast(`Broadcasted team invitation to: ${newMemberEmail}`, 'success');
  };

  const handleCycleUserPlan = (selectedPlan: string) => {
    setPlanVal(selectedPlan);
    let mappedPlan: 'Free' | 'Professional' | 'Enterprise' = 'Free';
    if (selectedPlan === 'Architect Mode') mappedPlan = 'Professional';
    if (selectedPlan === 'Enterprise Node') mappedPlan = 'Enterprise';
    
    onChangeUser({
      ...user,
      plan: mappedPlan
    });
    onAddToast(`Workspace license tier updated to "${selectedPlan}".`, 'success');
  };

  return (
    <div className="bg-[#0E1532] border border-white/5 rounded-2xl p-5 shadow-2xl flex flex-col gap-5 text-left" id="settings-workbench">
      
      {/* Settings Top Tabs */}
      <div className="flex border-b border-white/5 pb-1 gap-4 overflow-x-auto whitespace-nowrap shrink-0">
        {[
          { id: 'profile' as const, label: 'Profile Settings', icon: <User className="w-4 h-4" /> },
          { id: 'api' as const, label: 'API Secrets Routing', icon: <Key className="w-4 h-4 text-purple-400" /> },
          { id: 'billing' as const, label: 'Workspace Subscription', icon: <CreditCard className="w-4 h-4 text-[#00D4FF]" /> },
          { id: 'team' as const, label: 'Collaborator Team', icon: <Users className="w-4 h-4" /> }
        ].map((sub) => (
          <button
            key={sub.id}
            onClick={() => setActiveSubTab(sub.id)}
            className={`pb-2 text-xs font-semibold uppercase font-heading tracking-wider cursor-pointer border-b-2 flex items-center gap-1.5 transition-all ${
              activeSubTab === sub.id ? 'border-[#00D4FF] text-white' : 'border-transparent text-slate-500 hover:text-slate-300'
            }`}
          >
            {sub.icon}
            {sub.label}
          </button>
        ))}
      </div>

      {/* SUB-TAB: PROFILE SETTINGS */}
      {activeSubTab === 'profile' && (
        <form onSubmit={handleUpdateProfileSubmit} className="grid grid-cols-1 md:grid-cols-12 gap-6 leading-relaxed animate-fade">
          <div className="md:col-span-7 flex flex-col gap-4">
            <div className="bg-slate-950/40 p-4 border border-white/5 rounded-xl flex flex-col gap-3.5">
              
              <div className="flex flex-col gap-1.5">
                <label className="text-xs text-slate-400 font-mono">WORKSPACE USER DISPLAY NAME:</label>
                <div className="relative">
                  <User className="absolute left-3 top-3 w-4 h-4 text-slate-500" />
                  <input
                    type="text"
                    required
                    value={nameVal}
                    onChange={(e) => setNameVal(e.target.value)}
                    className="w-full bg-[#0A0F1E] border border-white/10 rounded-xl pl-9 pr-4 py-2.5 text-xs text-slate-200 focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs text-slate-400 font-mono">ACCOUNT EMAIL ADDRESS:</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 w-4 h-4 text-slate-500" />
                  <input
                    type="email"
                    required
                    value={emailVal}
                    onChange={(e) => setEmailVal(e.target.value)}
                    className="w-full bg-[#0A0F1E] border border-white/10 rounded-xl pl-9 pr-4 py-2.5 text-xs text-slate-200 focus:outline-none"
                  />
                </div>
              </div>

            </div>

            <div className="flex justify-end pt-2">
              <button
                type="submit"
                className="px-6 py-2.5 bg-[#6C63FF] hover:bg-[#5b51ff] text-slate-950 text-xs font-bold uppercase tracking-wider rounded-xl transition-all shadow-md cursor-pointer"
              >
                Commit Profile Values
              </button>
            </div>
          </div>

          <div className="md:col-span-5 flex flex-col gap-4">
            <div className="bg-slate-950/60 p-4 border border-white/5 rounded-xl text-xs text-slate-400">
              <span className="text-[10px] font-mono text-[#00D4FF] block tracking-wider uppercase font-semibold">Active Node Security</span>
              <p className="mt-2 text-slate-300 leading-relaxed">
                Your credentials are encrypted inside isolation keys in your browser standard local sandbox index. We never save raw credentials on external cloud stores.
              </p>

              <div className="mt-4 p-3 border border-white/5 bg-[#0A0F1E] rounded-xl flex gap-3 text-[10px] font-mono justify-between">
                <span>ENCRYPTION SYSTEM:</span>
                <span className="text-emerald-400 font-bold">AES-256 BIT GCM</span>
              </div>
            </div>
          </div>
        </form>
      )}

      {/* SUB-TAB: API SECRETS ROUTING */}
      {activeSubTab === 'api' && (
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 leading-relaxed animate-fade">
          
          {/* Key Generator FORM (5 cols) */}
          <form onSubmit={handleGenerateApiKey} className="md:col-span-5 flex flex-col gap-4">
            <div className="bg-slate-950/40 p-4 border border-white/5 rounded-xl flex flex-col gap-3">
              <span className="text-[10px] font-mono text-[#00D4FF] block tracking-wider uppercase font-semibold">Generate Secret route</span>
              
              <div className="flex flex-col gap-1.5 mt-2">
                <label className="text-xs text-slate-400 font-mono">TOKEN DESCRIPTOR:</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. AWS Lambda worker"
                  value={newKeyName}
                  onChange={(e) => setNewKeyName(e.target.value)}
                  className="w-full bg-[#0A0F1E]/80 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-slate-200 focus:outline-none"
                />
              </div>

              <div className="flex flex-col gap-1.5 mt-1">
                <label className="text-xs text-slate-400 font-mono">PERMISSIONS SCOPE:</label>
                <select
                  value={newKeyScope}
                  onChange={(e) => setNewKeyScope(e.target.value)}
                  className="w-full bg-[#0A0F1E] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-slate-200 font-mono"
                >
                  <option value="Read-Write">Full Read-Write Pipeline</option>
                  <option value="Read-Only">Read Only Access</option>
                </select>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-gradient-to-r from-[#6C63FF] to-[#00D4FF] text-slate-950 text-xs font-bold uppercase rounded-xl transition-all cursor-pointer shadow-md mt-2 flex items-center justify-center gap-1.5"
              >
                <Plus className="w-4 h-4 stroke-[3]" />
                Generate Key Access Route
              </button>
            </div>
          </form>

          {/* Active tokens directory listing (7 cols) */}
          <div className="md:col-span-7 flex flex-col gap-3">
            <div className="bg-slate-950/40 p-4 border border-white/5 rounded-xl">
              <h4 className="text-xs font-semibold text-slate-300 font-mono uppercase">Authorized API Credentials</h4>
              <p className="text-[11px] text-slate-500 font-mono mt-0.5">Use these keys to ingest tables programmatically.</p>

              <div className="flex flex-col gap-3 mt-4">
                {apiKeys.length === 0 ? (
                  <span className="text-xs text-slate-600 block text-center py-4">No active API secrets generated yet.</span>
                ) : (
                  apiKeys.map((k) => (
                    <div key={k.id} className="p-3 bg-slate-950 border border-white/5 rounded-xl flex items-center justify-between gap-3">
                      <div className="min-w-0">
                        <span className="text-xs font-semibold text-slate-100 font-mono block truncate">{k.name}</span>
                        <div className="flex items-center gap-2 mt-1">
                          <code className="text-[10px] text-[#00D4FF] font-mono tracking-wider truncate max-w-[200px] bg-[#0A0F1E] px-1.5 py-0.5 rounded border border-white/5">
                            {k.keyStr}
                          </code>
                          <span className="text-[9px] px-1 bg-purple-500/10 border border-purple-500/20 text-[#A78BFA] rounded font-mono uppercase">
                            {k.scope}
                          </span>
                        </div>
                      </div>

                      <button
                        onClick={() => handleDeleteApiKey(k.id)}
                        className="p-2 hover:bg-red-500/15 text-slate-500 hover:text-red-400 rounded-lg transition-colors cursor-pointer"
                        title="Revoke access immediately"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

        </div>
      )}

      {/* SUB-TAB: WORKSPACE SUBSCRIPTION */}
      {activeSubTab === 'billing' && (
        <div className="flex flex-col gap-4 animate-fade">
          <div>
            <h4 className="text-xs font-semibold text-slate-300 font-mono uppercase">Workspace License Configuration</h4>
            <p className="text-xs text-slate-400 mt-1">Select and cycle your sandbox resource orchestration limits.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-2">
            {[
              { id: 'Free/Dev', price: '$0', limit: '3 active sandboxes', features: ['Core Tabular Imputation', 'One-Hot Encoders', 'CSV Outputs'] },
              { id: 'Architect Mode', price: '$49', limit: '20 active sandboxes', features: ['Full Neural AI Scanner', 'Infinite CSV/JSON Parsing', 'API keys routing integration', 'Priority CPU Threads'] },
              { id: 'Enterprise Node', price: 'Custom', limit: 'Infinite limits', features: ['AES-256 Private DB Encryption', 'SOC2 Cloud Integration', '24/7 dedicated workspace', 'Full pipeline replication'] }
            ].map((plan) => {
              const isSelected = planVal.includes(plan.id) || (plan.id === 'Free/Dev' && user.plan === 'Free') || (plan.id === 'Architect Mode' && user.plan === 'Professional') || (plan.id === 'Enterprise Node' && user.plan === 'Enterprise');
              return (
                <div
                  key={plan.id}
                  onClick={() => handleCycleUserPlan(plan.id)}
                  className={`p-4 rounded-xl border flex flex-col justify-between cursor-pointer transition-all ${
                    isSelected 
                      ? 'bg-indigo-500/10 border-indigo-500 text-indigo-100 hover:scale-101 shadow-lg' 
                      : 'bg-slate-950/40 border-white/5 hover:border-white/15 text-slate-400 hover:bg-slate-950/70'
                  }`}
                >
                  <div>
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-semibold text-white uppercase font-mono">{plan.id}</span>
                      {isSelected && (
                        <span className="text-[8px] bg-indigo-500 text-slate-950 px-1.5 py-0.5 rounded font-mono font-bold uppercase">
                          Active
                        </span>
                      )}
                    </div>
                    <span className="text-2xl font-bold text-slate-200 mt-2 block font-heading">{plan.price} <span className="text-[10px] text-slate-500 font-mono">/Mo</span></span>
                    
                    <span className="text-[10px] block font-mono text-cyan-400 mt-2">{plan.limit}</span>

                    <div className="flex flex-col gap-1.5 mt-4 border-t border-white/5 pt-3">
                      {plan.features.map((f, i) => (
                        <div key={i} className="flex gap-2 items-center text-[9px] font-mono leading-snug">
                          <Check className="w-3 h-3 text-emerald-400 shrink-0" />
                          <span className="truncate">{f}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* SUB-TAB: TEAM MEMBERS */}
      {activeSubTab === 'team' && (
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 leading-relaxed animate-fade">
          
          {/* Add Team Invite (5 cols) */}
          <form onSubmit={handleAddTeamMember} className="md:col-span-5 flex flex-col gap-4">
            <div className="bg-slate-950/40 p-4 border border-white/5 rounded-xl flex flex-col gap-3">
              <span className="text-[10px] font-mono text-[#00D4FF] block tracking-wider uppercase font-semibold">Invite Collaborative Member</span>
              
              <div className="flex flex-col gap-1.5 mt-2">
                <label className="text-xs text-slate-400 font-mono">MEMBER EMAIL:</label>
                <input
                  type="email"
                  required
                  placeholder="name@organization.com"
                  value={newMemberEmail}
                  onChange={(e) => setNewMemberEmail(e.target.value)}
                  className="w-full bg-[#0A0F1E]/80 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-slate-200 focus:outline-none"
                />
              </div>

              <div className="flex flex-col gap-1.5 mt-1">
                <label className="text-xs text-slate-400 font-mono">TEAM ASSIGNED ROLE:</label>
                <select
                  value={newMemberRole}
                  onChange={(e) => setNewMemberRole(e.target.value)}
                  className="w-full bg-[#0A0F1E] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-slate-200 font-mono"
                >
                  <option value="Data Scientist">Clinical Data Scientist</option>
                  <option value="DevOps Architect">DevOps Architect</option>
                  <option value="Data Wrangler">Data Wrangler</option>
                </select>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-indigo-500 hover:bg-indigo-400 text-slate-950 text-xs font-bold uppercase rounded-xl transition-all cursor-pointer shadow-md mt-2 flex items-center justify-center gap-1.5"
              >
                <Plus className="w-4 h-4 stroke-[3]" />
                Dispatch Invitation Link
              </button>
            </div>
          </form>

          {/* Directory directory (7 cols) */}
          <div className="md:col-span-7 flex flex-col gap-3">
            <div className="bg-slate-950/40 p-4 border border-white/5 rounded-xl">
              <h4 className="text-xs font-semibold text-slate-300 font-mono uppercase">Authorized Cooperators</h4>
              <p className="text-[11px] text-slate-500 font-mono mt-0.5">Active team workspace participants.</p>

              <div className="flex flex-col gap-3 mt-4">
                {teamMembers.map((m, idx) => (
                  <div key={idx} className="p-3 bg-slate-950 border border-white/5 rounded-xl flex items-center justify-between gap-3">
                    <div>
                      <span className="text-xs font-semibold text-slate-100 font-mono block uppercase">{m.name}</span>
                      <span className="text-[9px] text-[#00D4FF] font-mono mt-0.5 block">{m.role}</span>
                      <span className="text-[9px] text-slate-500 font-mono mt-0.5 block truncate">{m.email}</span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
                      <span className="text-[9px] font-mono font-medium text-emerald-400 uppercase">{m.status}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>
      )}

    </div>
  );
}
