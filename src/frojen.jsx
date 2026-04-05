import { useState, useEffect, useCallback, useMemo } from "react";

// ============================================================
// FROZEN FRENCH FRIES FACTORY - ERP SYSTEM
// Modules: Sales | Production | Inventory | Purchasing
// ============================================================

// --- DATA STORE ---
const initialData = {
  products: [
    { id: "P001", name: "بطاطا أصابع كلاسيك 9mm", nameEn: "Classic Fries 9mm", unit: "كجم", category: "أصابع", weight: 2.5, price: 45, cost: 28 },
    { id: "P002", name: "بطاطا أصابع رفيعة 7mm", nameEn: "Thin Fries 7mm", unit: "كجم", category: "أصابع", weight: 1.0, price: 50, cost: 30 },
    { id: "P003", name: "بطاطا ودجز", nameEn: "Potato Wedges", unit: "كجم", category: "ودجز", weight: 2.5, price: 42, cost: 25 },
    { id: "P004", name: "بطاطا كرنكل كت", nameEn: "Crinkle Cut", unit: "كجم", category: "كرنكل", weight: 2.5, price: 48, cost: 29 },
    { id: "P005", name: "بطاطا هاش براون", nameEn: "Hash Browns", unit: "كجم", category: "هاش", weight: 1.5, price: 55, cost: 32 },
  ],
  rawMaterials: [
    { id: "RM001", name: "بطاطا خام طازجة", unit: "طن", stock: 85, minStock: 20, price: 3500 },
    { id: "RM002", name: "زيت نباتي للقلي", unit: "لتر", stock: 2200, minStock: 500, price: 12 },
    { id: "RM003", name: "ملح صناعي", unit: "كجم", stock: 450, minStock: 100, price: 8 },
    { id: "RM004", name: "مادة حافظة E330", unit: "كجم", stock: 120, minStock: 30, price: 65 },
    { id: "RM005", name: "أكياس تغليف 1 كجم", unit: "قطعة", stock: 15000, minStock: 5000, price: 1.5 },
    { id: "RM006", name: "أكياس تغليف 2.5 كجم", unit: "قطعة", stock: 8000, minStock: 3000, price: 2.8 },
    { id: "RM007", name: "كراتين تعبئة", unit: "قطعة", stock: 3200, minStock: 1000, price: 5 },
    { id: "RM008", name: "نشا بطاطا", unit: "كجم", stock: 300, minStock: 80, price: 22 },
  ],
  customers: [
    { id: "C001", name: "سلسلة مطاعم البيك", contact: "أحمد محمد", phone: "0501234567", city: "الرياض", balance: 12500 },
    { id: "C002", name: "هايبر ماركت بنده", contact: "سعيد العلي", phone: "0559876543", city: "جدة", balance: 8200 },
    { id: "C003", name: "مطاعم ماكدونالدز", contact: "خالد إبراهيم", phone: "0567891234", city: "الرياض", balance: 45000 },
    { id: "C004", name: "كارفور السعودية", contact: "عمر حسن", phone: "0543216789", city: "الدمام", balance: 6800 },
    { id: "C005", name: "مطاعم هرفي", contact: "ماجد سعود", phone: "0512345678", city: "الرياض", balance: 22000 },
  ],
  suppliers: [
    { id: "S001", name: "مزارع الجوف للبطاطا", contact: "فهد العتيبي", phone: "0534567890", rating: 4.5 },
    { id: "S002", name: "شركة الزيوت الوطنية", contact: "ناصر القحطاني", phone: "0545678901", rating: 4.2 },
    { id: "S003", name: "مصنع التعبئة المتقدم", contact: "سلطان الحربي", phone: "0556789012", rating: 4.0 },
    { id: "S004", name: "مزارع تبوك الزراعية", contact: "عبدالله الشمري", phone: "0567890123", rating: 4.8 },
  ],
  salesOrders: [
    { id: "SO-2026-001", date: "2026-04-01", customer: "C003", items: [{ product: "P001", qty: 500, price: 44 }, { product: "P004", qty: 300, price: 47 }], status: "delivered", total: 36100 },
    { id: "SO-2026-002", date: "2026-04-02", customer: "C001", items: [{ product: "P002", qty: 200, price: 49 }], status: "shipped", total: 9800 },
    { id: "SO-2026-003", date: "2026-04-03", customer: "C005", items: [{ product: "P001", qty: 800, price: 43 }, { product: "P005", qty: 150, price: 54 }], status: "confirmed", total: 42500 },
    { id: "SO-2026-004", date: "2026-04-04", customer: "C002", items: [{ product: "P003", qty: 400, price: 41 }], status: "pending", total: 16400 },
    { id: "SO-2026-005", date: "2026-04-05", customer: "C004", items: [{ product: "P001", qty: 300, price: 44 }, { product: "P002", qty: 200, price: 49 }, { product: "P003", qty: 150, price: 41 }], status: "pending", total: 28250 },
  ],
  productionOrders: [
    { id: "PO-2026-001", date: "2026-04-01", product: "P001", qty: 1200, status: "completed", line: "خط 1", shift: "صباحي", yield: 94.2 },
    { id: "PO-2026-002", date: "2026-04-02", product: "P004", qty: 800, status: "completed", line: "خط 2", shift: "صباحي", yield: 92.8 },
    { id: "PO-2026-003", date: "2026-04-03", product: "P002", qty: 600, status: "in-progress", line: "خط 1", shift: "مسائي", yield: 0 },
    { id: "PO-2026-004", date: "2026-04-04", product: "P005", qty: 400, status: "planned", line: "خط 3", shift: "صباحي", yield: 0 },
    { id: "PO-2026-005", date: "2026-04-05", product: "P003", qty: 500, status: "planned", line: "خط 2", shift: "مسائي", yield: 0 },
  ],
  purchaseOrders: [
    { id: "PUR-2026-001", date: "2026-03-28", supplier: "S001", items: [{ material: "RM001", qty: 30, price: 3400 }], status: "received", total: 102000 },
    { id: "PUR-2026-002", date: "2026-04-01", supplier: "S002", items: [{ material: "RM002", qty: 1000, price: 11.5 }], status: "shipped", total: 11500 },
    { id: "PUR-2026-003", date: "2026-04-03", supplier: "S003", items: [{ material: "RM005", qty: 10000, price: 1.4 }, { material: "RM006", qty: 5000, price: 2.7 }], status: "confirmed", total: 27500 },
    { id: "PUR-2026-004", date: "2026-04-05", supplier: "S004", items: [{ material: "RM001", qty: 50, price: 3450 }], status: "pending", total: 172500 },
  ],
  finishedGoods: [
    { productId: "P001", stock: 3200, location: "مستودع التبريد A", minStock: 500 },
    { productId: "P002", stock: 1800, location: "مستودع التبريد A", minStock: 300 },
    { productId: "P003", stock: 950, location: "مستودع التبريد B", minStock: 200 },
    { productId: "P004", stock: 2100, location: "مستودع التبريد B", minStock: 400 },
    { productId: "P005", stock: 680, location: "مستودع التبريد A", minStock: 150 },
  ],
};

// --- ICONS ---
const Icons = {
  dashboard: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>,
  sales: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/></svg>,
  production: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M2 20h20"/><path d="M5 20V8l5-4v16"/><path d="M10 20V4l5 4v12"/><path d="M15 20V8l5 4v8"/></svg>,
  inventory: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><path d="M3.27 6.96 12 12.01l8.73-5.05"/><path d="M12 22.08V12"/></svg>,
  purchasing: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>,
  arrow: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M7 17l9.2-9.2M17 17V7.8H7.8"/></svg>,
  arrowDown: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 7l-9.2 9.2M7 7v9.2h9.2"/></svg>,
  check: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M20 6L9 17l-5-5"/></svg>,
  clock: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>,
  alert: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>,
  truck: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="1" y="3" width="15" height="13"/><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>,
  snowflake: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="2" x2="12" y2="22"/><line x1="2" y1="12" x2="22" y2="12"/><line x1="4.93" y1="4.93" x2="19.07" y2="19.07"/><line x1="19.07" y1="4.93" x2="4.93" y2="19.07"/></svg>,
  plus: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>,
  search: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>,
};

// --- STATUS CONFIGS ---
const statusConfig = {
  pending: { label: "قيد الانتظار", color: "#F59E0B", bg: "#FEF3C7" },
  confirmed: { label: "مؤكد", color: "#3B82F6", bg: "#DBEAFE" },
  shipped: { label: "تم الشحن", color: "#8B5CF6", bg: "#EDE9FE" },
  delivered: { label: "تم التسليم", color: "#10B981", bg: "#D1FAE5" },
  "in-progress": { label: "قيد التنفيذ", color: "#F59E0B", bg: "#FEF3C7" },
  completed: { label: "مكتمل", color: "#10B981", bg: "#D1FAE5" },
  planned: { label: "مخطط", color: "#6B7280", bg: "#F3F4F6" },
  received: { label: "تم الاستلام", color: "#10B981", bg: "#D1FAE5" },
  cancelled: { label: "ملغي", color: "#EF4444", bg: "#FEE2E2" },
};

const StatusBadge = ({ status }) => {
  const cfg = statusConfig[status] || { label: status, color: "#6B7280", bg: "#F3F4F6" };
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: 4,
      padding: "3px 10px", borderRadius: 20, fontSize: 11, fontWeight: 600,
      color: cfg.color, background: cfg.bg, whiteSpace: "nowrap",
    }}>
      <span style={{ width: 6, height: 6, borderRadius: "50%", background: cfg.color }} />
      {cfg.label}
    </span>
  );
};

// --- HELPER FUNCTIONS ---
const formatNum = (n) => new Intl.NumberFormat("ar-SA").format(n);
const formatCurrency = (n) => new Intl.NumberFormat("ar-SA", { style: "currency", currency: "SAR", maximumFractionDigits: 0 }).format(n);

// --- MAIN APP ---
export default function FrozenFriesERP() {
  const [activeModule, setActiveModule] = useState("dashboard");
  const [data] = useState(initialData);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const modules = [
    { id: "dashboard", label: "لوحة التحكم", icon: Icons.dashboard },
    { id: "sales", label: "المبيعات", icon: Icons.sales },
    { id: "production", label: "الإنتاج", icon: Icons.production },
    { id: "inventory", label: "المستودعات", icon: Icons.inventory },
    { id: "purchasing", label: "المشتريات", icon: Icons.purchasing },
  ];

  return (
    <div style={{
      display: "flex", width: "100vw", height: "100vh",
      position: "fixed", top: 0, left: 0, zIndex: 1000,
      fontFamily: "'Noto Kufi Arabic', 'Segoe UI', sans-serif",
      direction: "rtl", background: "#F0F2F5", color: "#1A1D23", overflow: "hidden",
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Noto+Kufi+Arabic:wght@300;400;500;600;700;800&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        ::-webkit-scrollbar { width: 5px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: #CBD5E1; border-radius: 10px; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes slideIn { from { opacity: 0; transform: translateX(20px); } to { opacity: 1; transform: translateX(0); } }
        @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.6; } }
        @keyframes countUp { from { opacity: 0; transform: scale(0.8); } to { opacity: 1; transform: scale(1); } }
        .card-hover { transition: all 0.2s ease; }
        .card-hover:hover { transform: translateY(-2px); box-shadow: 0 8px 25px rgba(0,0,0,0.08) !important; }
        .nav-item { transition: all 0.15s ease; cursor: pointer; }
        .nav-item:hover { background: rgba(255,255,255,0.08) !important; }
        .btn { transition: all 0.15s ease; cursor: pointer; border: none; outline: none; }
        .btn:hover { filter: brightness(1.08); transform: translateY(-1px); }
        .btn:active { transform: translateY(0); }
        .table-row { transition: background 0.15s; }
        .table-row:hover { background: #F8FAFC !important; }
        input:focus, select:focus { outline: none; border-color: #2563EB !important; box-shadow: 0 0 0 3px rgba(37,99,235,0.1); }
      `}</style>

      {/* SIDEBAR */}
      <aside style={{
        width: sidebarOpen ? 240 : 68, background: "linear-gradient(195deg, #0F172A 0%, #1E293B 100%)",
        color: "#fff", display: "flex", flexDirection: "column", transition: "width 0.25s ease",
        borderLeft: "1px solid rgba(255,255,255,0.06)", flexShrink: 0, overflow: "hidden",
      }}>
        {/* Logo */}
        <div style={{
          padding: sidebarOpen ? "20px 18px" : "20px 14px", display: "flex", alignItems: "center", gap: 12,
          borderBottom: "1px solid rgba(255,255,255,0.08)", minHeight: 72,
        }}>
          <div style={{
            width: 40, height: 40, borderRadius: 10,
            background: "linear-gradient(135deg, #F59E0B, #EF4444)",
            display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
          }}>
            {Icons.snowflake}
          </div>
          {sidebarOpen && (
            <div style={{ animation: "fadeIn 0.2s ease" }}>
              <div style={{ fontSize: 14, fontWeight: 700, lineHeight: 1.3 }}>فروزن فرايز</div>
              <div style={{ fontSize: 10, opacity: 0.5, fontWeight: 400 }}>نظام إدارة المصنع</div>
            </div>
          )}
        </div>

        {/* Nav */}
        <nav style={{ padding: "12px 8px", flex: 1 }}>
          {modules.map((m) => (
            <div
              key={m.id}
              className="nav-item"
              onClick={() => setActiveModule(m.id)}
              style={{
                display: "flex", alignItems: "center", gap: 12,
                padding: sidebarOpen ? "10px 14px" : "10px 14px",
                borderRadius: 8, marginBottom: 2,
                background: activeModule === m.id ? "rgba(255,255,255,0.12)" : "transparent",
                color: activeModule === m.id ? "#fff" : "rgba(255,255,255,0.55)",
                fontWeight: activeModule === m.id ? 600 : 400,
                fontSize: 13, justifyContent: sidebarOpen ? "flex-start" : "center",
              }}
            >
              <span style={{ flexShrink: 0 }}>{m.icon}</span>
              {sidebarOpen && <span>{m.label}</span>}
            </div>
          ))}
        </nav>

        {/* Toggle */}
        <div
          onClick={() => setSidebarOpen(!sidebarOpen)}
          style={{
            padding: 16, textAlign: "center", cursor: "pointer", opacity: 0.5,
            fontSize: 11, borderTop: "1px solid rgba(255,255,255,0.08)",
          }}
        >
          {sidebarOpen ? "◀ تصغير" : "▶"}
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
        {/* TOPBAR */}
        <header style={{
          height: 60, background: "#fff", display: "flex", alignItems: "center",
          padding: "0 24px", justifyContent: "space-between",
          borderBottom: "1px solid #E8ECF0", flexShrink: 0,
        }}>
          <div>
            <h1 style={{ fontSize: 16, fontWeight: 700, color: "#1A1D23" }}>
              {modules.find(m => m.id === activeModule)?.label}
            </h1>
            <p style={{ fontSize: 11, color: "#94A3B8", marginTop: 2 }}>
              {new Date().toLocaleDateString("ar-SA", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
            </p>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ position: "relative" }}>
              <span style={{ position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)", color: "#94A3B8" }}>{Icons.search}</span>
              <input
                placeholder="بحث..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{
                  padding: "8px 36px 8px 14px", borderRadius: 8, border: "1px solid #E2E8F0",
                  fontSize: 12, width: 200, background: "#F8FAFC",
                  fontFamily: "'Noto Kufi Arabic', sans-serif",
                }}
              />
            </div>
            <div style={{
              width: 36, height: 36, borderRadius: "50%",
              background: "linear-gradient(135deg, #2563EB, #7C3AED)",
              display: "flex", alignItems: "center", justifyContent: "center",
              color: "#fff", fontSize: 13, fontWeight: 700,
            }}>م</div>
          </div>
        </header>

        {/* CONTENT */}
        <div style={{ flex: 1, overflow: "auto", padding: 24 }}>
          <div style={{ animation: "fadeIn 0.3s ease" }}>
            {activeModule === "dashboard" && <Dashboard data={data} setActiveModule={setActiveModule} />}
            {activeModule === "sales" && <SalesModule data={data} />}
            {activeModule === "production" && <ProductionModule data={data} />}
            {activeModule === "inventory" && <InventoryModule data={data} />}
            {activeModule === "purchasing" && <PurchasingModule data={data} />}
          </div>
        </div>
      </main>
    </div>
  );
}

// ============================================================
// DASHBOARD
// ============================================================
function Dashboard({ data, setActiveModule }) {
  const totalSales = data.salesOrders.reduce((s, o) => s + o.total, 0);
  const pendingOrders = data.salesOrders.filter(o => o.status === "pending").length;
  const activeProduction = data.productionOrders.filter(o => o.status === "in-progress").length;
  const lowStockItems = data.rawMaterials.filter(m => m.stock <= m.minStock * 1.5).length;

  const kpis = [
    { label: "إجمالي المبيعات", value: formatCurrency(totalSales), icon: Icons.sales, color: "#2563EB", bg: "#EFF6FF", change: "+12.5%", up: true },
    { label: "طلبات قيد الانتظار", value: pendingOrders, icon: Icons.clock, color: "#F59E0B", bg: "#FFFBEB", change: `${pendingOrders} طلب`, up: false },
    { label: "خطوط الإنتاج النشطة", value: `${activeProduction} / 3`, icon: Icons.production, color: "#10B981", bg: "#ECFDF5", change: "كفاءة 93%", up: true },
    { label: "تنبيهات المخزون", value: lowStockItems, icon: Icons.alert, color: "#EF4444", bg: "#FEF2F2", change: "يتطلب متابعة", up: false },
  ];

  return (
    <div>
      {/* KPIs */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 16, marginBottom: 24 }}>
        {kpis.map((kpi, i) => (
          <div key={i} className="card-hover" style={{
            background: "#fff", borderRadius: 12, padding: 20,
            border: "1px solid #E8ECF0", animation: `fadeIn 0.3s ease ${i * 0.08}s both`,
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <div>
                <p style={{ fontSize: 11, color: "#94A3B8", marginBottom: 8, fontWeight: 500 }}>{kpi.label}</p>
                <p style={{ fontSize: 26, fontWeight: 800, color: "#1A1D23", animation: "countUp 0.5s ease" }}>{kpi.value}</p>
              </div>
              <div style={{
                width: 42, height: 42, borderRadius: 10, background: kpi.bg,
                display: "flex", alignItems: "center", justifyContent: "center", color: kpi.color,
              }}>
                {kpi.icon}
              </div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 4, marginTop: 12, fontSize: 11, color: kpi.up ? "#10B981" : "#F59E0B" }}>
              {kpi.up ? Icons.arrow : Icons.arrowDown}
              <span>{kpi.change}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Row */}
      <div style={{ display: "grid", gridTemplateColumns: "1.5fr 1fr", gap: 16, marginBottom: 24 }}>
        {/* Sales Chart */}
        <div style={{ background: "#fff", borderRadius: 12, padding: 20, border: "1px solid #E8ECF0" }}>
          <h3 style={{ fontSize: 14, fontWeight: 700, marginBottom: 16, color: "#1A1D23" }}>مبيعات الأسبوع الحالي</h3>
          <SalesBarChart data={data} />
        </div>

        {/* Production Status */}
        <div style={{ background: "#fff", borderRadius: 12, padding: 20, border: "1px solid #E8ECF0" }}>
          <h3 style={{ fontSize: 14, fontWeight: 700, marginBottom: 16, color: "#1A1D23" }}>حالة الإنتاج</h3>
          <ProductionDonut data={data} />
        </div>
      </div>

      {/* Quick Access */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        {/* Recent Orders */}
        <div style={{ background: "#fff", borderRadius: 12, padding: 20, border: "1px solid #E8ECF0" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
            <h3 style={{ fontSize: 14, fontWeight: 700 }}>أحدث الطلبات</h3>
            <span onClick={() => setActiveModule("sales")} className="btn" style={{
              fontSize: 11, color: "#2563EB", fontWeight: 600, background: "none", cursor: "pointer",
            }}>عرض الكل ←</span>
          </div>
          {data.salesOrders.slice(-3).reverse().map((order, i) => {
            const cust = data.customers.find(c => c.id === order.customer);
            return (
              <div key={i} className="table-row" style={{
                display: "flex", justifyContent: "space-between", alignItems: "center",
                padding: "10px 0", borderBottom: i < 2 ? "1px solid #F1F5F9" : "none",
              }}>
                <div>
                  <div style={{ fontSize: 12, fontWeight: 600 }}>{cust?.name}</div>
                  <div style={{ fontSize: 10, color: "#94A3B8" }}>{order.id} • {order.date}</div>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <span style={{ fontSize: 13, fontWeight: 700, color: "#1A1D23" }}>{formatCurrency(order.total)}</span>
                  <StatusBadge status={order.status} />
                </div>
              </div>
            );
          })}
        </div>

        {/* Low Stock Alerts */}
        <div style={{ background: "#fff", borderRadius: 12, padding: 20, border: "1px solid #E8ECF0" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
            <h3 style={{ fontSize: 14, fontWeight: 700 }}>تنبيهات المخزون</h3>
            <span onClick={() => setActiveModule("inventory")} className="btn" style={{
              fontSize: 11, color: "#EF4444", fontWeight: 600, background: "none", cursor: "pointer",
            }}>عرض الكل ←</span>
          </div>
          {data.rawMaterials.filter(m => m.stock <= m.minStock * 1.5).map((mat, i) => {
            const pct = Math.round((mat.stock / mat.minStock) * 100);
            const critical = pct <= 100;
            return (
              <div key={i} style={{ marginBottom: 12 }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                  <span style={{ fontSize: 12, fontWeight: 500 }}>{mat.name}</span>
                  <span style={{ fontSize: 11, color: critical ? "#EF4444" : "#F59E0B", fontWeight: 600 }}>
                    {formatNum(mat.stock)} / {formatNum(mat.minStock)} {mat.unit}
                  </span>
                </div>
                <div style={{ height: 6, borderRadius: 3, background: "#F1F5F9" }}>
                  <div style={{
                    height: "100%", borderRadius: 3, width: `${Math.min(pct, 100)}%`,
                    background: critical ? "linear-gradient(90deg, #EF4444, #F97316)" : "linear-gradient(90deg, #F59E0B, #FBBF24)",
                    transition: "width 0.6s ease",
                  }} />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// --- Simple SVG Bar Chart ---
function SalesBarChart({ data }) {
  const days = ["السبت", "الأحد", "الاثنين", "الثلاثاء", "الأربعاء"];
  const values = [36100, 9800, 42500, 16400, 28250];
  const max = Math.max(...values);
  const h = 160;
  const barW = 36;
  const gap = 20;

  return (
    <svg width="100%" height={h + 40} viewBox={`0 0 ${days.length * (barW + gap) + 20} ${h + 40}`}>
      {values.map((v, i) => {
        const barH = (v / max) * h;
        const x = i * (barW + gap) + 10;
        return (
          <g key={i}>
            <defs>
              <linearGradient id={`grad${i}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#2563EB" />
                <stop offset="100%" stopColor="#3B82F6" />
              </linearGradient>
            </defs>
            <rect x={x} y={h - barH} width={barW} height={barH} rx={6} fill={`url(#grad${i})`} opacity={0.9}>
              <animate attributeName="height" from="0" to={barH} dur="0.6s" fill="freeze" />
              <animate attributeName="y" from={h} to={h - barH} dur="0.6s" fill="freeze" />
            </rect>
            <text x={x + barW / 2} y={h + 20} textAnchor="middle" fontSize="10" fill="#94A3B8" fontFamily="'Noto Kufi Arabic', sans-serif">{days[i]}</text>
            <text x={x + barW / 2} y={h - barH - 6} textAnchor="middle" fontSize="9" fill="#64748B" fontWeight="600" fontFamily="'Noto Kufi Arabic', sans-serif">
              {(v / 1000).toFixed(1)}k
            </text>
          </g>
        );
      })}
    </svg>
  );
}

// --- Simple SVG Donut Chart ---
function ProductionDonut({ data }) {
  const counts = {
    completed: data.productionOrders.filter(o => o.status === "completed").length,
    "in-progress": data.productionOrders.filter(o => o.status === "in-progress").length,
    planned: data.productionOrders.filter(o => o.status === "planned").length,
  };
  const total = Object.values(counts).reduce((a, b) => a + b, 0);
  const colors = { completed: "#10B981", "in-progress": "#F59E0B", planned: "#94A3B8" };
  const labels = { completed: "مكتمل", "in-progress": "قيد التنفيذ", planned: "مخطط" };
  const r = 60, cx = 80, cy = 75, strokeW = 18;
  const circumference = 2 * Math.PI * r;
  let offset = 0;

  return (
    <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
      <svg width="160" height="160" viewBox="0 0 160 160">
        {Object.entries(counts).map(([key, val]) => {
          const pct = val / total;
          const dashLen = circumference * pct;
          const dashOffset = -offset;
          offset += dashLen;
          return (
            <circle key={key} cx={cx} cy={cy} r={r} fill="none"
              stroke={colors[key]} strokeWidth={strokeW}
              strokeDasharray={`${dashLen} ${circumference - dashLen}`}
              strokeDashoffset={dashOffset}
              strokeLinecap="round"
              transform={`rotate(-90 ${cx} ${cy})`}
            />
          );
        })}
        <text x={cx} y={cy - 4} textAnchor="middle" fontSize="22" fontWeight="800" fill="#1A1D23">{total}</text>
        <text x={cx} y={cy + 14} textAnchor="middle" fontSize="9" fill="#94A3B8" fontFamily="'Noto Kufi Arabic', sans-serif">أمر إنتاج</text>
      </svg>
      <div>
        {Object.entries(counts).map(([key, val]) => (
          <div key={key} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
            <span style={{ width: 10, height: 10, borderRadius: "50%", background: colors[key] }} />
            <span style={{ fontSize: 12, color: "#64748B" }}>{labels[key]}</span>
            <span style={{ fontSize: 13, fontWeight: 700, marginRight: "auto" }}>{val}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ============================================================
// SALES MODULE
// ============================================================
function SalesModule({ data }) {
  const [tab, setTab] = useState("orders");
  const [showForm, setShowForm] = useState(false);

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
        <div style={{ display: "flex", gap: 4, background: "#fff", borderRadius: 8, padding: 3, border: "1px solid #E8ECF0" }}>
          {[{ id: "orders", l: "أوامر البيع" }, { id: "customers", l: "العملاء" }].map(t => (
            <button key={t.id} className="btn" onClick={() => setTab(t.id)} style={{
              padding: "7px 16px", borderRadius: 6, fontSize: 12, fontWeight: tab === t.id ? 600 : 400,
              background: tab === t.id ? "#2563EB" : "transparent",
              color: tab === t.id ? "#fff" : "#64748B",
              fontFamily: "'Noto Kufi Arabic', sans-serif",
            }}>{t.l}</button>
          ))}
        </div>
        <button className="btn" onClick={() => setShowForm(!showForm)} style={{
          display: "flex", alignItems: "center", gap: 6, padding: "8px 16px",
          borderRadius: 8, background: "#2563EB", color: "#fff", fontSize: 12, fontWeight: 600,
          fontFamily: "'Noto Kufi Arabic', sans-serif",
        }}>
          {Icons.plus} أمر بيع جديد
        </button>
      </div>

      {showForm && <NewSalesOrderForm data={data} onClose={() => setShowForm(false)} />}

      {tab === "orders" ? (
        <div style={{ background: "#fff", borderRadius: 12, border: "1px solid #E8ECF0", overflow: "hidden" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
            <thead>
              <tr style={{ background: "#F8FAFC" }}>
                {["رقم الأمر", "التاريخ", "العميل", "المنتجات", "الإجمالي", "الحالة"].map(h => (
                  <th key={h} style={{ padding: "12px 16px", textAlign: "right", fontWeight: 600, color: "#64748B", fontSize: 11, borderBottom: "1px solid #E8ECF0" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.salesOrders.map((order, i) => {
                const cust = data.customers.find(c => c.id === order.customer);
                return (
                  <tr key={i} className="table-row" style={{ animation: `slideIn 0.3s ease ${i * 0.05}s both` }}>
                    <td style={{ padding: "12px 16px", fontWeight: 600, color: "#2563EB", borderBottom: "1px solid #F1F5F9" }}>{order.id}</td>
                    <td style={{ padding: "12px 16px", borderBottom: "1px solid #F1F5F9" }}>{order.date}</td>
                    <td style={{ padding: "12px 16px", fontWeight: 500, borderBottom: "1px solid #F1F5F9" }}>{cust?.name}</td>
                    <td style={{ padding: "12px 16px", borderBottom: "1px solid #F1F5F9" }}>
                      {order.items.map((item, j) => {
                        const prod = data.products.find(p => p.id === item.product);
                        return <div key={j} style={{ fontSize: 11, color: "#64748B" }}>{prod?.name} × {item.qty}</div>;
                      })}
                    </td>
                    <td style={{ padding: "12px 16px", fontWeight: 700, borderBottom: "1px solid #F1F5F9" }}>{formatCurrency(order.total)}</td>
                    <td style={{ padding: "12px 16px", borderBottom: "1px solid #F1F5F9" }}><StatusBadge status={order.status} /></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 14 }}>
          {data.customers.map((cust, i) => (
            <div key={i} className="card-hover" style={{
              background: "#fff", borderRadius: 12, padding: 18, border: "1px solid #E8ECF0",
              animation: `fadeIn 0.3s ease ${i * 0.06}s both`,
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 700 }}>{cust.name}</div>
                  <div style={{ fontSize: 11, color: "#94A3B8", marginTop: 2 }}>{cust.city} • {cust.contact}</div>
                </div>
                <div style={{
                  width: 36, height: 36, borderRadius: "50%",
                  background: "linear-gradient(135deg, #DBEAFE, #93C5FD)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 14, fontWeight: 700, color: "#2563EB",
                }}>
                  {cust.name[0]}
                </div>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", padding: "10px 0", borderTop: "1px solid #F1F5F9" }}>
                <div>
                  <div style={{ fontSize: 10, color: "#94A3B8" }}>الرصيد</div>
                  <div style={{ fontSize: 15, fontWeight: 700, color: "#10B981" }}>{formatCurrency(cust.balance)}</div>
                </div>
                <div style={{ textAlign: "left" }}>
                  <div style={{ fontSize: 10, color: "#94A3B8" }}>الهاتف</div>
                  <div style={{ fontSize: 12, direction: "ltr" }}>{cust.phone}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function NewSalesOrderForm({ data, onClose }) {
  return (
    <div style={{
      background: "#fff", borderRadius: 12, padding: 24, marginBottom: 20,
      border: "1px solid #E8ECF0", animation: "fadeIn 0.2s ease",
    }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
        <h3 style={{ fontSize: 15, fontWeight: 700 }}>أمر بيع جديد</h3>
        <button className="btn" onClick={onClose} style={{ background: "#F1F5F9", borderRadius: 6, padding: "6px 12px", fontSize: 11, fontFamily: "'Noto Kufi Arabic', sans-serif" }}>إغلاق</button>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16 }}>
        <div>
          <label style={{ fontSize: 11, color: "#64748B", display: "block", marginBottom: 6, fontWeight: 500 }}>العميل</label>
          <select style={{ width: "100%", padding: "9px 12px", borderRadius: 8, border: "1px solid #E2E8F0", fontSize: 12, fontFamily: "'Noto Kufi Arabic', sans-serif" }}>
            {data.customers.map(c => <option key={c.id}>{c.name}</option>)}
          </select>
        </div>
        <div>
          <label style={{ fontSize: 11, color: "#64748B", display: "block", marginBottom: 6, fontWeight: 500 }}>المنتج</label>
          <select style={{ width: "100%", padding: "9px 12px", borderRadius: 8, border: "1px solid #E2E8F0", fontSize: 12, fontFamily: "'Noto Kufi Arabic', sans-serif" }}>
            {data.products.map(p => <option key={p.id}>{p.name}</option>)}
          </select>
        </div>
        <div>
          <label style={{ fontSize: 11, color: "#64748B", display: "block", marginBottom: 6, fontWeight: 500 }}>الكمية (كجم)</label>
          <input type="number" placeholder="500" style={{ width: "100%", padding: "9px 12px", borderRadius: 8, border: "1px solid #E2E8F0", fontSize: 12, fontFamily: "'Noto Kufi Arabic', sans-serif" }} />
        </div>
      </div>
      <div style={{ display: "flex", gap: 10, marginTop: 18, justifyContent: "flex-end" }}>
        <button className="btn" style={{ padding: "9px 24px", borderRadius: 8, background: "#2563EB", color: "#fff", fontSize: 12, fontWeight: 600, fontFamily: "'Noto Kufi Arabic', sans-serif" }}>
          حفظ الأمر
        </button>
      </div>
    </div>
  );
}

// ============================================================
// PRODUCTION MODULE
// ============================================================
function ProductionModule({ data }) {
  const [view, setView] = useState("table");

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
        <div style={{ display: "flex", gap: 4, background: "#fff", borderRadius: 8, padding: 3, border: "1px solid #E8ECF0" }}>
          {[{ id: "table", l: "جدول" }, { id: "kanban", l: "كانبان" }].map(t => (
            <button key={t.id} className="btn" onClick={() => setView(t.id)} style={{
              padding: "7px 16px", borderRadius: 6, fontSize: 12, fontWeight: view === t.id ? 600 : 400,
              background: view === t.id ? "#10B981" : "transparent",
              color: view === t.id ? "#fff" : "#64748B",
              fontFamily: "'Noto Kufi Arabic', sans-serif",
            }}>{t.l}</button>
          ))}
        </div>
        <button className="btn" style={{
          display: "flex", alignItems: "center", gap: 6, padding: "8px 16px",
          borderRadius: 8, background: "#10B981", color: "#fff", fontSize: 12, fontWeight: 600,
          fontFamily: "'Noto Kufi Arabic', sans-serif",
        }}>
          {Icons.plus} أمر إنتاج جديد
        </button>
      </div>

      {/* Production Lines Status */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 14, marginBottom: 20 }}>
        {["خط 1", "خط 2", "خط 3"].map((line, i) => {
          const orders = data.productionOrders.filter(o => o.line === line);
          const active = orders.find(o => o.status === "in-progress");
          return (
            <div key={i} className="card-hover" style={{
              background: "#fff", borderRadius: 12, padding: 16, border: "1px solid #E8ECF0",
              borderTop: `3px solid ${active ? "#10B981" : "#E2E8F0"}`,
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                <span style={{ fontSize: 13, fontWeight: 700 }}>{line}</span>
                <span style={{
                  fontSize: 10, padding: "2px 8px", borderRadius: 10,
                  background: active ? "#D1FAE5" : "#F3F4F6",
                  color: active ? "#10B981" : "#9CA3AF", fontWeight: 600,
                }}>{active ? "🟢 يعمل" : "⚪ متوقف"}</span>
              </div>
              {active ? (
                <div>
                  <div style={{ fontSize: 11, color: "#64748B" }}>
                    {data.products.find(p => p.id === active.product)?.name}
                  </div>
                  <div style={{ fontSize: 11, color: "#94A3B8", marginTop: 2 }}>{formatNum(active.qty)} كجم • وردية {active.shift}</div>
                  <div style={{ height: 4, borderRadius: 2, background: "#E8ECF0", marginTop: 8 }}>
                    <div style={{ height: "100%", borderRadius: 2, width: "62%", background: "linear-gradient(90deg, #10B981, #34D399)", transition: "width 0.6s" }} />
                  </div>
                </div>
              ) : (
                <div style={{ fontSize: 11, color: "#94A3B8" }}>لا يوجد إنتاج حالياً</div>
              )}
            </div>
          );
        })}
      </div>

      {view === "table" ? (
        <div style={{ background: "#fff", borderRadius: 12, border: "1px solid #E8ECF0", overflow: "hidden" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
            <thead>
              <tr style={{ background: "#F8FAFC" }}>
                {["رقم الأمر", "التاريخ", "المنتج", "الكمية", "خط الإنتاج", "الوردية", "الكفاءة %", "الحالة"].map(h => (
                  <th key={h} style={{ padding: "12px 14px", textAlign: "right", fontWeight: 600, color: "#64748B", fontSize: 11, borderBottom: "1px solid #E8ECF0" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.productionOrders.map((order, i) => {
                const prod = data.products.find(p => p.id === order.product);
                return (
                  <tr key={i} className="table-row" style={{ animation: `slideIn 0.3s ease ${i * 0.05}s both` }}>
                    <td style={{ padding: "12px 14px", fontWeight: 600, color: "#10B981", borderBottom: "1px solid #F1F5F9" }}>{order.id}</td>
                    <td style={{ padding: "12px 14px", borderBottom: "1px solid #F1F5F9" }}>{order.date}</td>
                    <td style={{ padding: "12px 14px", fontWeight: 500, borderBottom: "1px solid #F1F5F9" }}>{prod?.name}</td>
                    <td style={{ padding: "12px 14px", borderBottom: "1px solid #F1F5F9" }}>{formatNum(order.qty)} كجم</td>
                    <td style={{ padding: "12px 14px", borderBottom: "1px solid #F1F5F9" }}>{order.line}</td>
                    <td style={{ padding: "12px 14px", borderBottom: "1px solid #F1F5F9" }}>{order.shift}</td>
                    <td style={{ padding: "12px 14px", borderBottom: "1px solid #F1F5F9" }}>
                      {order.yield > 0 ? (
                        <span style={{ fontWeight: 700, color: order.yield >= 93 ? "#10B981" : "#F59E0B" }}>{order.yield}%</span>
                      ) : <span style={{ color: "#CBD5E1" }}>—</span>}
                    </td>
                    <td style={{ padding: "12px 14px", borderBottom: "1px solid #F1F5F9" }}><StatusBadge status={order.status} /></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 14 }}>
          {[
            { status: "planned", label: "مخطط", color: "#94A3B8" },
            { status: "in-progress", label: "قيد التنفيذ", color: "#F59E0B" },
            { status: "completed", label: "مكتمل", color: "#10B981" },
          ].map(col => (
            <div key={col.status} style={{ background: "#F8FAFC", borderRadius: 12, padding: 14 }}>
              <div style={{
                display: "flex", alignItems: "center", gap: 8, marginBottom: 12,
                paddingBottom: 10, borderBottom: `2px solid ${col.color}`,
              }}>
                <span style={{ width: 8, height: 8, borderRadius: "50%", background: col.color }} />
                <span style={{ fontSize: 13, fontWeight: 700 }}>{col.label}</span>
                <span style={{
                  marginRight: "auto", fontSize: 10, background: "#fff", padding: "2px 8px",
                  borderRadius: 10, fontWeight: 600, color: "#64748B",
                }}>
                  {data.productionOrders.filter(o => o.status === col.status).length}
                </span>
              </div>
              {data.productionOrders.filter(o => o.status === col.status).map((order, i) => {
                const prod = data.products.find(p => p.id === order.product);
                return (
                  <div key={i} className="card-hover" style={{
                    background: "#fff", borderRadius: 8, padding: 14, marginBottom: 8,
                    border: "1px solid #E8ECF0",
                  }}>
                    <div style={{ fontSize: 10, color: col.color, fontWeight: 600, marginBottom: 4 }}>{order.id}</div>
                    <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 6 }}>{prod?.name}</div>
                    <div style={{ fontSize: 11, color: "#94A3B8" }}>{formatNum(order.qty)} كجم • {order.line}</div>
                    <div style={{ fontSize: 11, color: "#94A3B8" }}>وردية {order.shift}</div>
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ============================================================
// INVENTORY MODULE
// ============================================================
function InventoryModule({ data }) {
  const [tab, setTab] = useState("raw");

  return (
    <div>
      <div style={{ display: "flex", gap: 4, background: "#fff", borderRadius: 8, padding: 3, border: "1px solid #E8ECF0", marginBottom: 20, width: "fit-content" }}>
        {[{ id: "raw", l: "المواد الخام" }, { id: "finished", l: "المنتجات الجاهزة" }].map(t => (
          <button key={t.id} className="btn" onClick={() => setTab(t.id)} style={{
            padding: "7px 16px", borderRadius: 6, fontSize: 12, fontWeight: tab === t.id ? 600 : 400,
            background: tab === t.id ? "#8B5CF6" : "transparent",
            color: tab === t.id ? "#fff" : "#64748B",
            fontFamily: "'Noto Kufi Arabic', sans-serif",
          }}>{t.l}</button>
        ))}
      </div>

      {tab === "raw" ? (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 14 }}>
          {data.rawMaterials.map((mat, i) => {
            const pct = Math.round((mat.stock / (mat.minStock * 3)) * 100);
            const level = mat.stock <= mat.minStock ? "critical" : mat.stock <= mat.minStock * 1.5 ? "warning" : "ok";
            const colors = { critical: "#EF4444", warning: "#F59E0B", ok: "#10B981" };
            return (
              <div key={i} className="card-hover" style={{
                background: "#fff", borderRadius: 12, padding: 18, border: "1px solid #E8ECF0",
                borderRight: `4px solid ${colors[level]}`, animation: `fadeIn 0.3s ease ${i * 0.05}s both`,
              }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 700 }}>{mat.name}</div>
                    <div style={{ fontSize: 11, color: "#94A3B8", marginTop: 2 }}>الكود: {mat.id}</div>
                  </div>
                  {level !== "ok" && (
                    <span style={{ color: colors[level] }}>{Icons.alert}</span>
                  )}
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 8 }}>
                  <span style={{ fontSize: 22, fontWeight: 800, color: colors[level] }}>{formatNum(mat.stock)}</span>
                  <span style={{ fontSize: 11, color: "#94A3B8" }}>{mat.unit}</span>
                </div>
                <div style={{ height: 6, borderRadius: 3, background: "#F1F5F9", marginBottom: 8 }}>
                  <div style={{
                    height: "100%", borderRadius: 3, width: `${Math.min(pct, 100)}%`,
                    background: `linear-gradient(90deg, ${colors[level]}, ${level === "ok" ? "#34D399" : level === "warning" ? "#FBBF24" : "#F97316"})`,
                    transition: "width 0.6s ease",
                  }} />
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 10, color: "#94A3B8" }}>
                  <span>الحد الأدنى: {formatNum(mat.minStock)} {mat.unit}</span>
                  <span>السعر: {formatCurrency(mat.price)}/{mat.unit}</span>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div style={{ background: "#fff", borderRadius: 12, border: "1px solid #E8ECF0", overflow: "hidden" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
            <thead>
              <tr style={{ background: "#F8FAFC" }}>
                {["المنتج", "الكمية المتوفرة", "الموقع", "الحد الأدنى", "الحالة", "القيمة التقديرية"].map(h => (
                  <th key={h} style={{ padding: "12px 16px", textAlign: "right", fontWeight: 600, color: "#64748B", fontSize: 11, borderBottom: "1px solid #E8ECF0" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.finishedGoods.map((fg, i) => {
                const prod = data.products.find(p => p.id === fg.productId);
                const level = fg.stock <= fg.minStock ? "critical" : fg.stock <= fg.minStock * 2 ? "warning" : "ok";
                return (
                  <tr key={i} className="table-row" style={{ animation: `slideIn 0.3s ease ${i * 0.05}s both` }}>
                    <td style={{ padding: "12px 16px", fontWeight: 600, borderBottom: "1px solid #F1F5F9" }}>
                      <div>{prod?.name}</div>
                      <div style={{ fontSize: 10, color: "#94A3B8" }}>{prod?.nameEn}</div>
                    </td>
                    <td style={{ padding: "12px 16px", fontWeight: 700, borderBottom: "1px solid #F1F5F9" }}>
                      {formatNum(fg.stock)} كجم
                    </td>
                    <td style={{ padding: "12px 16px", borderBottom: "1px solid #F1F5F9" }}>{fg.location}</td>
                    <td style={{ padding: "12px 16px", borderBottom: "1px solid #F1F5F9" }}>{formatNum(fg.minStock)} كجم</td>
                    <td style={{ padding: "12px 16px", borderBottom: "1px solid #F1F5F9" }}>
                      <span style={{
                        display: "inline-flex", alignItems: "center", gap: 4,
                        padding: "3px 10px", borderRadius: 20, fontSize: 11, fontWeight: 600,
                        color: level === "ok" ? "#10B981" : level === "warning" ? "#F59E0B" : "#EF4444",
                        background: level === "ok" ? "#D1FAE5" : level === "warning" ? "#FEF3C7" : "#FEE2E2",
                      }}>
                        {level === "ok" ? "متوفر" : level === "warning" ? "منخفض" : "حرج"}
                      </span>
                    </td>
                    <td style={{ padding: "12px 16px", fontWeight: 600, color: "#2563EB", borderBottom: "1px solid #F1F5F9" }}>
                      {formatCurrency(fg.stock * (prod?.price || 0))}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          <div style={{
            padding: "14px 16px", background: "#F8FAFC", borderTop: "1px solid #E8ECF0",
            display: "flex", justifyContent: "space-between", fontSize: 13,
          }}>
            <span style={{ fontWeight: 600 }}>إجمالي قيمة المخزون الجاهز</span>
            <span style={{ fontWeight: 800, color: "#2563EB" }}>
              {formatCurrency(data.finishedGoods.reduce((s, fg) => {
                const prod = data.products.find(p => p.id === fg.productId);
                return s + fg.stock * (prod?.price || 0);
              }, 0))}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}

// ============================================================
// PURCHASING MODULE
// ============================================================
function PurchasingModule({ data }) {
  const [tab, setTab] = useState("orders");

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
        <div style={{ display: "flex", gap: 4, background: "#fff", borderRadius: 8, padding: 3, border: "1px solid #E8ECF0" }}>
          {[{ id: "orders", l: "أوامر الشراء" }, { id: "suppliers", l: "الموردون" }].map(t => (
            <button key={t.id} className="btn" onClick={() => setTab(t.id)} style={{
              padding: "7px 16px", borderRadius: 6, fontSize: 12, fontWeight: tab === t.id ? 600 : 400,
              background: tab === t.id ? "#F59E0B" : "transparent",
              color: tab === t.id ? "#fff" : "#64748B",
              fontFamily: "'Noto Kufi Arabic', sans-serif",
            }}>{t.l}</button>
          ))}
        </div>
        <button className="btn" style={{
          display: "flex", alignItems: "center", gap: 6, padding: "8px 16px",
          borderRadius: 8, background: "#F59E0B", color: "#fff", fontSize: 12, fontWeight: 600,
          fontFamily: "'Noto Kufi Arabic', sans-serif",
        }}>
          {Icons.plus} أمر شراء جديد
        </button>
      </div>

      {/* Purchase Summary */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 14, marginBottom: 20 }}>
        {[
          { label: "إجمالي المشتريات", value: formatCurrency(data.purchaseOrders.reduce((s, o) => s + o.total, 0)), color: "#F59E0B" },
          { label: "أوامر نشطة", value: data.purchaseOrders.filter(o => !["received", "cancelled"].includes(o.status)).length, color: "#3B82F6" },
          { label: "في انتظار الاستلام", value: data.purchaseOrders.filter(o => o.status === "shipped").length, color: "#8B5CF6" },
        ].map((kpi, i) => (
          <div key={i} className="card-hover" style={{
            background: "#fff", borderRadius: 12, padding: 18, border: "1px solid #E8ECF0",
          }}>
            <div style={{ fontSize: 11, color: "#94A3B8", marginBottom: 6 }}>{kpi.label}</div>
            <div style={{ fontSize: 24, fontWeight: 800, color: kpi.color }}>{kpi.value}</div>
          </div>
        ))}
      </div>

      {tab === "orders" ? (
        <div style={{ background: "#fff", borderRadius: 12, border: "1px solid #E8ECF0", overflow: "hidden" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
            <thead>
              <tr style={{ background: "#F8FAFC" }}>
                {["رقم الأمر", "التاريخ", "المورد", "المواد", "الإجمالي", "الحالة"].map(h => (
                  <th key={h} style={{ padding: "12px 16px", textAlign: "right", fontWeight: 600, color: "#64748B", fontSize: 11, borderBottom: "1px solid #E8ECF0" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.purchaseOrders.map((order, i) => {
                const sup = data.suppliers.find(s => s.id === order.supplier);
                return (
                  <tr key={i} className="table-row" style={{ animation: `slideIn 0.3s ease ${i * 0.05}s both` }}>
                    <td style={{ padding: "12px 16px", fontWeight: 600, color: "#F59E0B", borderBottom: "1px solid #F1F5F9" }}>{order.id}</td>
                    <td style={{ padding: "12px 16px", borderBottom: "1px solid #F1F5F9" }}>{order.date}</td>
                    <td style={{ padding: "12px 16px", fontWeight: 500, borderBottom: "1px solid #F1F5F9" }}>{sup?.name}</td>
                    <td style={{ padding: "12px 16px", borderBottom: "1px solid #F1F5F9" }}>
                      {order.items.map((item, j) => {
                        const mat = data.rawMaterials.find(m => m.id === item.material);
                        return <div key={j} style={{ fontSize: 11, color: "#64748B" }}>{mat?.name} × {formatNum(item.qty)}</div>;
                      })}
                    </td>
                    <td style={{ padding: "12px 16px", fontWeight: 700, borderBottom: "1px solid #F1F5F9" }}>{formatCurrency(order.total)}</td>
                    <td style={{ padding: "12px 16px", borderBottom: "1px solid #F1F5F9" }}><StatusBadge status={order.status} /></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 14 }}>
          {data.suppliers.map((sup, i) => (
            <div key={i} className="card-hover" style={{
              background: "#fff", borderRadius: 12, padding: 18, border: "1px solid #E8ECF0",
              animation: `fadeIn 0.3s ease ${i * 0.06}s both`,
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 14 }}>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 700 }}>{sup.name}</div>
                  <div style={{ fontSize: 11, color: "#94A3B8", marginTop: 2 }}>{sup.contact} • {sup.phone}</div>
                </div>
                <div style={{
                  width: 36, height: 36, borderRadius: "50%",
                  background: "linear-gradient(135deg, #FEF3C7, #FCD34D)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 14, fontWeight: 700, color: "#D97706",
                }}>
                  {sup.name[0]}
                </div>
              </div>
              <div style={{
                display: "flex", alignItems: "center", gap: 4, padding: "10px 0",
                borderTop: "1px solid #F1F5F9",
              }}>
                <span style={{ fontSize: 11, color: "#94A3B8" }}>التقييم:</span>
                <div style={{ display: "flex", gap: 2 }}>
                  {[1, 2, 3, 4, 5].map(star => (
                    <span key={star} style={{ fontSize: 14, color: star <= Math.floor(sup.rating) ? "#F59E0B" : "#E2E8F0" }}>★</span>
                  ))}
                </div>
                <span style={{ fontSize: 12, fontWeight: 700, color: "#F59E0B", marginRight: 4 }}>{sup.rating}</span>
              </div>
              <div style={{ fontSize: 11, color: "#64748B", marginTop: 4 }}>
                عدد الأوامر: {data.purchaseOrders.filter(o => o.supplier === sup.id).length}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}