// src/App.jsx
import { useState, useEffect } from 'react';
import { 
  Droplets, User, Phone, CheckCircle, 
  Thermometer, FlaskConical, Wind, Zap, 
  Power, Timer, Menu, X, ShoppingCart, 
  BarChart3, MessageSquare, TrendingUp, AlertTriangle, Activity,
  Fish, Mail, ArrowRight, ShieldCheck // New Icons for Landing/Login
} from 'lucide-react';
import { getDatabase } from './database';
import RasBoxScene from './RasBox';

function App() {
  // --- CORE APP STATE ---
  const [formData, setFormData] = useState(() => {
    const savedUser = localStorage.getItem('aquagenUser');
    return savedUser ? JSON.parse(savedUser) : { name: '', email: '', phoneNumber: '', tankCount: '' };
  });

  // Start on 'dashboard' if saved, otherwise start on the new 'landing' page
  const [currentView, setCurrentView] = useState(() => {
    return localStorage.getItem('aquagenUser') ? 'dashboard' : 'landing';
  });

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [impactData, setImpactData] = useState(null);

  // --- HARDWARE CONTROL STATES ---
  const [pumpActive, setPumpActive] = useState(true);
  const [blowerActive, setBlowerActive] = useState(true);
  const [feederStatus, setFeederStatus] = useState('Standby');
  const [lastFeedTime, setLastFeedTime] = useState('02:09 PM'); 

  useEffect(() => {
    if (!['landing', 'login', 'onboarding', 'impact'].includes(currentView)) {
      getDatabase().then(() => console.log("🟢 Offline Database Ready"));
    }
  }, [currentView]);

  const handleInputChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  // Handle New Registration
  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:3001/api/onboard', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const data = await response.json();
      if (data.success) {
        localStorage.setItem('aquagenUser', JSON.stringify(formData));
        setImpactData(data);
        setCurrentView('impact');
      }
    } catch (error) {
      console.error("Failed to connect to backend", error);
      alert("Network error. Please try again.");
    }
  };

  // Handle Existing Farmer Login (Mock for now)
  const handleLogin = (e) => {
    e.preventDefault();
    // In a real app, this verifies with the backend. For now, we just log them in locally.
    const mockUser = { name: 'Returning Farmer', email: formData.email, phoneNumber: formData.phoneNumber, tankCount: '3' };
    localStorage.setItem('aquagenUser', JSON.stringify(mockUser));
    setFormData(mockUser);
    setCurrentView('dashboard');
  };

  // --- HARDWARE BUTTON HANDLERS ---
  const handlePump = (start) => setPumpActive(start);
  const handleBlower = (start) => setBlowerActive(start);
  const handleFeedDrop = () => {
    if (feederStatus === 'Dropping...') return; 
    setFeederStatus('Dropping...');
    setTimeout(() => {
      setFeederStatus('Standby');
      const currentTime = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
      setLastFeedTime(currentTime);
      alert("✅ Manual feed ration dropped successfully.");
    }, 3000);
  };

  // --- NAVIGATION HELPERS ---
  const navigateTo = (view) => {
    setCurrentView(view);
    setIsMenuOpen(false);
    window.scrollTo(0, 0);
  };

  const handleLogout = () => {
    localStorage.removeItem('aquagenUser');
    setFormData({ name: '', email: '', phoneNumber: '', tankCount: '' });
    navigateTo('landing');
  };

  // ==========================================
  // VIEW: LANDING PAGE (New!)
  // ==========================================
  if (currentView === 'landing') {
    return (
      <div style={{ padding: '20px', maxWidth: '450px', margin: '40px auto 0', textAlign: 'center' }}>
        {/* Logo & Header */}
        <div style={{ display: 'inline-flex', backgroundColor: 'var(--aquamarine)', padding: '16px', borderRadius: '16px', marginBottom: '24px' }}>
          <Fish size={40} color="#022b26" />
        </div>
        <h1 style={{ color: 'var(--text-light)', marginBottom: '8px', fontSize: '28px' }}>Aquagen Farm Limited</h1>
        <p style={{ color: 'var(--text-muted)', marginBottom: '40px', fontSize: '14px' }}>Smart Turnkey RAS Support & Management</p>

        {/* Action Card */}
        <div style={{ backgroundColor: 'rgba(255,255,255,0.03)', padding: '32px 24px', borderRadius: '16px', border: '1px solid var(--border-color)', textAlign: 'left' }}>
          
          {/* Option 1: Register */}
          <h2 style={{ fontSize: '18px', color: 'var(--text-light)', margin: '0 0 8px 0' }}>New to Aquagen?</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '14px', margin: '0 0 16px 0' }}>Apply for RAS support and get your farm registered.</p>
          <button onClick={() => navigateTo('onboarding')} style={{ marginBottom: '24px' }}>
            Register New Farm <ArrowRight size={20} />
          </button>

          {/* Divider */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
            <div style={{ flex: 1, height: '1px', backgroundColor: 'var(--border-color)' }}></div>
            <span style={{ color: 'var(--text-muted)', fontSize: '12px', fontWeight: '500' }}>OR</span>
            <div style={{ flex: 1, height: '1px', backgroundColor: 'var(--border-color)' }}></div>
          </div>

          {/* Option 2: Login */}
          <h2 style={{ fontSize: '18px', color: 'var(--text-light)', margin: '0 0 8px 0' }}>Existing Farmer?</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '14px', margin: '0 0 16px 0' }}>Sign in to your live dashboard and hardware controls.</p>
          <button onClick={() => navigateTo('login')} style={{ backgroundColor: 'transparent', border: '1px solid var(--border-color)', color: 'var(--text-light)' }}>
            Sign In to Dashboard <ShieldCheck size={20} color="var(--aquamarine)" />
          </button>

        </div>
      </div>
    );
  }

  // ==========================================
  // VIEW: LOGIN (For existing farmers)
  // ==========================================
  if (currentView === 'login') {
    return (
      <div style={{ padding: '20px', maxWidth: '400px', margin: '40px auto 0' }}>
        <button onClick={() => navigateTo('landing')} style={{ backgroundColor: 'transparent', width: 'auto', padding: '0 0 20px 0', color: 'var(--text-muted)', fontSize: '14px', border: 'none' }}>← Back</button>
        <h1 style={{ color: 'var(--aquamarine)', marginBottom: '8px', fontSize: '32px' }}>Welcome Back</h1>
        <p style={{ color: 'var(--text-muted)', marginBottom: '32px', fontSize: '16px' }}>Enter your details to access your farm.</p>
        <form onSubmit={handleLogin}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}><Mail size={20} color="var(--aquamarine)" /><label style={{ color: 'var(--text-light)', fontWeight: '500' }}>Email Address</label></div>
          <input type="email" name="email" placeholder="you@example.com" required onChange={handleInputChange} />
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}><Phone size={20} color="var(--aquamarine)" /><label style={{ color: 'var(--text-light)', fontWeight: '500' }}>Phone Number</label></div>
          <input type="tel" name="phoneNumber" placeholder="07XX XXX XXX" required onChange={handleInputChange} />
          <button type="submit" style={{ marginTop: '24px' }}>Secure Login</button>
        </form>
      </div>
    );
  }

  // ==========================================
  // VIEW: ONBOARDING (Registration)
  // ==========================================
  if (currentView === 'onboarding') {
    return (
      <div style={{ padding: '20px', maxWidth: '400px', margin: '20px auto 0' }}>
        <button onClick={() => navigateTo('landing')} style={{ backgroundColor: 'transparent', width: 'auto', padding: '0 0 20px 0', color: 'var(--text-muted)', fontSize: '14px', border: 'none' }}>← Back</button>
        <h1 style={{ color: 'var(--aquamarine)', marginBottom: '8px', fontSize: '32px' }}>Register Farm</h1>
        <p style={{ color: 'var(--text-muted)', marginBottom: '24px', fontSize: '16px' }}>Join the Aquagen network.</p>
        <form onSubmit={handleRegister}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}><User size={20} color="var(--aquamarine)" /><label style={{ color: 'var(--text-light)', fontWeight: '500' }}>Full Name</label></div>
          <input type="text" name="name" placeholder="e.g. John Mutua" required onChange={handleInputChange} />
          
          {/* New Email Field */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}><Mail size={20} color="var(--aquamarine)" /><label style={{ color: 'var(--text-light)', fontWeight: '500' }}>Email Address</label></div>
          <input type="email" name="email" placeholder="john@example.com" required onChange={handleInputChange} />
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}><Phone size={20} color="var(--aquamarine)" /><label style={{ color: 'var(--text-light)', fontWeight: '500' }}>Phone Number</label></div>
          <input type="tel" name="phoneNumber" placeholder="07XX XXX XXX" required onChange={handleInputChange} />
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}><Droplets size={20} color="var(--aquamarine)" /><label style={{ color: 'var(--text-light)', fontWeight: '500' }}>Number of Fish Tanks</label></div>
          <input type="number" name="tankCount" placeholder="e.g. 3" required onChange={handleInputChange} />
          
          <button type="submit" style={{ marginTop: '16px' }}>Join Aquagen</button>
        </form>
      </div>
    );
  }

  // ==========================================
  // VIEW: IMPACT
  // ==========================================
  if (currentView === 'impact') {
    return (
      <div style={{ padding: '20px', textAlign: 'center', marginTop: '40px' }}>
        <CheckCircle size={64} color="var(--aquamarine)" style={{ margin: '0 auto 20px' }} />
        <h1 style={{ fontSize: '24px', color: 'var(--text-light)' }}>Welcome, {formData.name}</h1>
        <p style={{ fontSize: '18px', lineHeight: '1.5', color: 'var(--text-muted)' }}>Kenya faces a 300,000 metric tonne fish deficit. You are now joining live Aquagen farmers closing this gap.</p>
        <button onClick={() => navigateTo('dashboard')} style={{ marginTop: '30px' }}>Go to My Farm</button>
      </div>
    );
  }

  // ==========================================
  // MAIN APP WRAPPER (Includes Navbar)
  // ==========================================
  return (
    <div style={{ padding: '20px', maxWidth: '900px', margin: '0 auto', paddingBottom: '80px', position: 'relative' }}>
      
      {/* GLOBAL TOP NAVBAR */}
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', paddingBottom: '16px', borderBottom: '1px solid var(--border-color)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button onClick={() => setIsMenuOpen(true)} style={{ width: 'auto', padding: '8px', backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: '8px', color: 'var(--text-light)', border: 'none' }}>
            <Menu size={24} />
          </button>
          <h1 style={{ color: 'var(--text-light)', fontSize: '20px', margin: 0 }}>
            {currentView === 'dashboard' && 'Live Telemetry'}
            {currentView === 'orders' && 'Orders & Support'}
            {currentView === 'analytics' && 'Farm Analytics'}
          </h1>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', backgroundColor: 'rgba(45, 212, 191, 0.1)', padding: '6px 12px', borderRadius: '20px', border: '1px solid rgba(45, 212, 191, 0.3)' }}>
          <div style={{ width: '8px', height: '8px', backgroundColor: 'var(--aquamarine)', borderRadius: '50%' }}></div>
          <span style={{ color: 'var(--aquamarine)', fontSize: '12px', fontWeight: '500' }}>System Online</span>
        </div>
      </header>

      {/* FULL SCREEN HAMBURGER MENU OVERLAY */}
      {isMenuOpen && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', backgroundColor: 'rgba(2, 43, 38, 0.98)', zIndex: 9999, display: 'flex', flexDirection: 'column', padding: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
            <h2 style={{ color: 'var(--aquamarine)', margin: 0, fontSize: '24px' }}>Aquagen OS Menu</h2>
            <button onClick={() => setIsMenuOpen(false)} style={{ width: 'auto', padding: '8px', backgroundColor: 'transparent', color: 'var(--text-light)', border: 'none' }}><X size={32} /></button>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '16px', backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: '12px', marginBottom: '32px', border: '1px solid var(--border-color)' }}>
            <div style={{ backgroundColor: 'var(--aquamarine)', width: '40px', height: '40px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#000', fontWeight: 'bold', fontSize: '18px' }}>
              {formData.name ? formData.name.charAt(0).toUpperCase() : 'F'}
            </div>
            <div>
              <p style={{ margin: 0, color: 'var(--text-light)', fontWeight: '600' }}>{formData.name || 'Farmer'}</p>
              <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '12px' }}>{formData.email || 'Aquagen Farm'}</p>
            </div>
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', flex: 1 }}>
            <button onClick={() => navigateTo('dashboard')} style={{ justifyContent: 'flex-start', padding: '20px', backgroundColor: currentView === 'dashboard' ? 'rgba(45, 212, 191, 0.2)' : 'rgba(255,255,255,0.05)', color: 'var(--text-light)', fontSize: '18px', border: '1px solid var(--border-color)' }}>
              <Activity size={24} style={{ marginRight: '16px', color: 'var(--aquamarine)' }}/> Dashboard
            </button>
            <button onClick={() => navigateTo('analytics')} style={{ justifyContent: 'flex-start', padding: '20px', backgroundColor: currentView === 'analytics' ? 'rgba(45, 212, 191, 0.2)' : 'rgba(255,255,255,0.05)', color: 'var(--text-light)', fontSize: '18px', border: '1px solid var(--border-color)' }}>
              <BarChart3 size={24} style={{ marginRight: '16px', color: '#a855f7' }}/> Analytics & Insights
            </button>
            <button onClick={() => navigateTo('orders')} style={{ justifyContent: 'flex-start', padding: '20px', backgroundColor: currentView === 'orders' ? 'rgba(45, 212, 191, 0.2)' : 'rgba(255,255,255,0.05)', color: 'var(--text-light)', fontSize: '18px', border: '1px solid var(--border-color)' }}>
              <ShoppingCart size={24} style={{ marginRight: '16px', color: '#f59e0b' }}/> Orders & Support
            </button>
          </div>

          <button onClick={handleLogout} style={{ justifyContent: 'center', padding: '16px', backgroundColor: 'transparent', color: '#ef4444', fontSize: '16px', border: '1px solid #ef4444', marginTop: 'auto' }}>
            Sign Out
          </button>
        </div>
      )}

      {/* DASHBOARD, ANALYTICS, AND ORDERS CONTENT (Unchanged from previous code block) */}
      
      {currentView === 'dashboard' && (
        <>
          <RasBoxScene systemStatus="warning" />
          
          <section style={{ marginBottom: '32px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '12px' }}>
              <div style={{ backgroundColor: 'rgba(255,255,255,0.03)', padding: '16px', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
                <div style={{ backgroundColor: 'rgba(239, 68, 68, 0.1)', width: '32px', height: '32px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '12px' }}><Thermometer color="#ef4444" size={18} /></div>
                <p style={{ color: 'var(--text-muted)', fontSize: '12px', margin: '0 0 4px 0' }}>Water Temp</p>
                <h3 style={{ color: 'var(--text-light)', fontSize: '24px', margin: 0 }}>26.5<span style={{ fontSize: '14px', color: 'var(--text-muted)', marginLeft: '2px' }}>°C</span></h3>
              </div>
              <div style={{ backgroundColor: 'rgba(255,255,255,0.03)', padding: '16px', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
                <div style={{ backgroundColor: 'rgba(45, 212, 191, 0.1)', width: '32px', height: '32px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '12px' }}><FlaskConical color="var(--aquamarine)" size={18} /></div>
                <p style={{ color: 'var(--text-muted)', fontSize: '12px', margin: '0 0 4px 0' }}>pH Level</p>
                <h3 style={{ color: 'var(--text-light)', fontSize: '24px', margin: 0 }}>7.2</h3>
              </div>
              <div style={{ backgroundColor: 'rgba(255,255,255,0.03)', padding: '16px', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
                <div style={{ backgroundColor: 'rgba(59, 130, 246, 0.1)', width: '32px', height: '32px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '12px' }}><Wind color="#3b82f6" size={18} /></div>
                <p style={{ color: 'var(--text-muted)', fontSize: '12px', margin: '0 0 4px 0' }}>Dissolved Oxygen</p>
                <h3 style={{ color: 'var(--text-light)', fontSize: '24px', margin: 0 }}>6.8<span style={{ fontSize: '14px', color: 'var(--text-muted)', marginLeft: '2px' }}>mg/L</span></h3>
              </div>
            </div>
          </section>

          <section>
            <h2 style={{ fontSize: '18px', color: 'var(--text-light)', marginBottom: '16px', fontWeight: '600' }}>RAS Hardware Controls</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '16px' }}>
              <div style={{ backgroundColor: 'rgba(255,255,255,0.03)', padding: '20px', borderRadius: '12px', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-light)' }}><Power size={18} color="#3b82f6" /> <span style={{ fontWeight: '500' }}>Main Pump</span></div>
                    {pumpActive ? <span style={{ backgroundColor: 'rgba(45, 212, 191, 0.1)', color: 'var(--aquamarine)', padding: '4px 10px', borderRadius: '12px', fontSize: '12px', fontWeight: '500' }}>Active</span> : <span style={{ backgroundColor: 'rgba(255, 255, 255, 0.1)', color: 'var(--text-muted)', padding: '4px 10px', borderRadius: '12px', fontSize: '12px', fontWeight: '500' }}>Off</span>}
                  </div>
                  <p style={{ color: 'var(--text-muted)', fontSize: '13px', marginBottom: '24px' }}>Status: {pumpActive ? "Running smoothly" : "Manually stopped"}</p>
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button onClick={() => handlePump(true)} style={{ flex: 1, padding: '10px', backgroundColor: pumpActive ? 'rgba(45, 212, 191, 0.1)' : 'transparent', border: '1px solid rgba(255,255,255,0.1)', color: pumpActive ? 'var(--aquamarine)' : 'var(--text-muted)', fontSize: '14px', borderRadius: '8px' }}>Start</button>
                  <button onClick={() => handlePump(false)} style={{ flex: 1, padding: '10px', backgroundColor: !pumpActive ? 'rgba(239, 68, 68, 0.1)' : 'transparent', border: '1px solid #ef4444', color: '#ef4444', fontSize: '14px', borderRadius: '8px' }}>Stop</button>
                </div>
              </div>

              <div style={{ backgroundColor: 'rgba(255,255,255,0.03)', padding: '20px', borderRadius: '12px', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-light)' }}><Wind size={18} color="#3b82f6" /> <span style={{ fontWeight: '500' }}>O₂ Blower</span></div>
                    {blowerActive ? <span style={{ backgroundColor: 'rgba(45, 212, 191, 0.1)', color: 'var(--aquamarine)', padding: '4px 10px', borderRadius: '12px', fontSize: '12px', fontWeight: '500' }}>Aerating</span> : <span style={{ backgroundColor: 'rgba(255, 255, 255, 0.1)', color: 'var(--text-muted)', padding: '4px 10px', borderRadius: '12px', fontSize: '12px', fontWeight: '500' }}>Off</span>}
                  </div>
                  <p style={{ color: 'var(--text-muted)', fontSize: '13px', marginBottom: '24px' }}>Status: {blowerActive ? "AI Fix applied" : "Manually stopped"}</p>
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button onClick={() => handleBlower(true)} style={{ flex: 1, padding: '10px', backgroundColor: blowerActive ? 'rgba(45, 212, 191, 0.1)' : 'transparent', border: '1px solid rgba(255,255,255,0.1)', color: blowerActive ? 'var(--aquamarine)' : 'var(--text-muted)', fontSize: '14px', borderRadius: '8px' }}>Start</button>
                  <button onClick={() => handleBlower(false)} style={{ flex: 1, padding: '10px', backgroundColor: !blowerActive ? 'rgba(239, 68, 68, 0.1)' : 'transparent', border: '1px solid #ef4444', color: '#ef4444', fontSize: '14px', borderRadius: '8px' }}>Stop</button>
                </div>
              </div>

              <div style={{ backgroundColor: 'rgba(255,255,255,0.03)', padding: '20px', borderRadius: '12px', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-light)' }}><Timer size={18} color="#f97316" /> <span style={{ fontWeight: '500' }}>Auto-Feeder</span></div>
                    <span style={{ backgroundColor: feederStatus === 'Dropping...' ? 'rgba(249, 115, 22, 0.2)' : 'rgba(255, 255, 255, 0.1)', color: feederStatus === 'Dropping...' ? '#f97316' : 'var(--text-muted)', padding: '4px 10px', borderRadius: '12px', fontSize: '12px', fontWeight: '500' }}>{feederStatus}</span>
                  </div>
                  <p style={{ color: 'var(--text-muted)', fontSize: '13px', margin: '0 0 4px 0' }}>Next scheduled: 14:00</p>
                  <p style={{ color: '#3b82f6', fontSize: '13px', margin: '0 0 24px 0' }}>Manual ration dropped at {lastFeedTime}</p>
                </div>
                <button onClick={handleFeedDrop} disabled={feederStatus === 'Dropping...'} style={{ width: '100%', padding: '10px', backgroundColor: feederStatus === 'Dropping...' ? 'rgba(249, 115, 22, 0.2)' : 'transparent', border: '1px solid var(--border-color)', color: feederStatus === 'Dropping...' ? '#f97316' : 'var(--text-light)', fontSize: '14px', borderRadius: '8px' }}>
                  {feederStatus === 'Dropping...' ? 'Dispensing Feed...' : 'Manual Feed Drop'}
                </button>
              </div>
            </div>
          </section>
        </>
      )}

      {currentView === 'analytics' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <div style={{ backgroundColor: 'rgba(255,255,255,0.03)', padding: '20px', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
            <h2 style={{ fontSize: '18px', color: 'var(--text-light)', marginTop: 0, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}><TrendingUp color="var(--aquamarine)"/> Actionable Insights</h2>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', padding: '12px', backgroundColor: 'rgba(45, 212, 191, 0.1)', borderRadius: '8px', marginBottom: '12px', borderLeft: '4px solid var(--aquamarine)' }}>
              <CheckCircle size={20} color="var(--aquamarine)" style={{ flexShrink: 0, marginTop: '2px' }}/>
              <div>
                <p style={{ margin: '0 0 4px 0', color: 'var(--text-light)', fontWeight: '500' }}>Biomass Growth Optimal</p>
                <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '13px' }}>Current growth trajectory is 4% ahead of schedule for your tilapia batch.</p>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', padding: '12px', backgroundColor: 'rgba(245, 158, 11, 0.1)', borderRadius: '8px', borderLeft: '4px solid #f59e0b' }}>
              <AlertTriangle size={20} color="#f59e0b" style={{ flexShrink: 0, marginTop: '2px' }}/>
              <div>
                <p style={{ margin: '0 0 4px 0', color: 'var(--text-light)', fontWeight: '500' }}>Feed Inventory Low</p>
                <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '13px' }}>Based on recent auto-feeder usage, you have ~3 days of feed remaining.</p>
                <button onClick={() => navigateTo('orders')} style={{ marginTop: '12px', padding: '8px 16px', fontSize: '14px', width: 'auto' }}>Order Feed Now</button>
              </div>
            </div>
          </div>
          <div style={{ backgroundColor: 'rgba(255,255,255,0.03)', padding: '20px', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
            <h2 style={{ fontSize: '18px', color: 'var(--text-light)', marginTop: 0, marginBottom: '24px' }}>Weekly Feed Usage (kg)</h2>
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: '12px', height: '150px', paddingBottom: '20px', borderBottom: '1px solid var(--border-color)' }}>
              {[40, 55, 45, 70, 65, 80, 50].map((height, i) => (
                <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                  <div style={{ width: '100%', backgroundColor: 'var(--aquamarine)', height: `${height}%`, borderRadius: '4px 4px 0 0', opacity: i === 6 ? 1 : 0.5, transition: 'height 1s ease' }}></div>
                </div>
              ))}
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '8px', color: 'var(--text-muted)', fontSize: '12px' }}>
              <span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span><span>Today</span>
            </div>
          </div>
        </div>
      )}

      {currentView === 'orders' && (
        <div style={{ backgroundColor: 'rgba(255,255,255,0.03)', padding: '24px', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
          <h2 style={{ fontSize: '20px', color: 'var(--text-light)', marginTop: 0, marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}><ShoppingCart color="#f59e0b"/> Request Supplies</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '14px', marginBottom: '24px' }}>Order feed, fingerlings, or request technical support directly to Aquagen HQ.</p>
          <form onSubmit={(e) => { e.preventDefault(); alert("Order sent to Aquagen HQ!"); navigateTo('dashboard'); }}>
            <label style={{ color: 'var(--text-light)', fontSize: '14px', marginBottom: '8px', display: 'block' }}>What do you need?</label>
            <select style={{ width: '100%', padding: '16px', marginBottom: '20px', backgroundColor: 'var(--bg-dark)', border: '1px solid var(--border-color)', color: 'var(--text-light)', borderRadius: '8px', fontSize: '16px' }} required>
              <option value="">Select an option...</option>
              <option value="feed">Fish Feed (25kg Bags)</option>
              <option value="fingerlings">Fingerlings (Batch)</option>
              <option value="maintenance">Hardware Maintenance / Support</option>
              <option value="vet">Veterinary Consultation</option>
            </select>
            <label style={{ color: 'var(--text-light)', fontSize: '14px', marginBottom: '8px', display: 'block' }}>Details / Quantity</label>
            <textarea rows="4" placeholder="e.g., I need 5 bags of feed and my O2 blower is making a strange noise." style={{ width: '100%', padding: '16px', marginBottom: '24px', backgroundColor: 'var(--bg-dark)', border: '1px solid var(--border-color)', color: 'var(--text-light)', borderRadius: '8px', fontSize: '16px', fontFamily: 'inherit', resize: 'vertical' }} required></textarea>
            <button type="submit" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px', backgroundColor: '#f59e0b', color: '#000' }}>
              <MessageSquare size={20} /> Send Request
            </button>
          </form>
        </div>
      )}

    </div>
  );
}

export default App;