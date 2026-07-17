"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

interface Enquiry {
  id: string;
  name: string;
  age: string;
  gender: string;
  mobile: string;
  email: string;
  city: string;
  level: string;
  preferredDate: string;
  preferredTime: string;
  message: string;
  service: string;
  status: string; // New, Contacted, Follow-up, Closed
  notes: string;
  formType: string; // booking or contact
  createdAt: string;
}

interface Testimonial {
  name: string;
  team: string;
  badge: string;
  quote: string;
}

interface GalleryItem {
  src: string;
  alt: string;
  title: string;
  desc: string;
}

interface Blog {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  date: string;
  author: string;
}

export default function AdminPage() {
  const [passcode, setPasscode] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("sdcf_passcode") || "";
    }
    return "";
  });
  const [isAuthorized, setIsAuthorized] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("sdcf_passcode") === "sdcf2026";
    }
    return false;
  });
  const [loginError, setLoginError] = useState("");
  const [activeTab, setActiveTab] = useState<"enquiries" | "testimonials" | "gallery" | "blogs">("enquiries");

  // Dashboard Data State
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [gallery, setGallery] = useState<GalleryItem[]>([]);
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(false);

  // Search & Filter States
  const [searchTerm, setSearchTerm] = useState("");
  const [filterService, setFilterService] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  // Edit notes states
  const [editNotes, setEditNotes] = useState<{ [id: string]: string }>({});
  const [editStatus, setEditStatus] = useState<{ [id: string]: string }>({});

  // Forms Input States
  const [newTestimonial, setNewTestimonial] = useState({ name: "", team: "", badge: "", quote: "" });
  const [newGallery, setNewGallery] = useState({ src: "/assets/cricket_match.jpg", alt: "", title: "", desc: "" });
  const [newBlog, setNewBlog] = useState({ title: "", excerpt: "", content: "" });

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (passcode === "sdcf2026") {
      setIsAuthorized(true);
      setLoginError("");
      localStorage.setItem("sdcf_passcode", passcode);
    } else {
      setLoginError("Invalid passcode. Please try again.");
    }
  };

  // Fetch admin and content data
  useEffect(() => {
    if (!isAuthorized) return;

    async function loadData() {
      setLoading(true);
      try {
        // Fetch content
        const contentRes = await fetch("/api/content");
        const contentJson = await contentRes.json();
        if (contentJson.success) {
          setTestimonials(contentJson.students || []);
          setGallery(contentJson.gallery || []);
          setBlogs(contentJson.blogs || []);
        }

        // Fetch enquiries
        const enquiriesRes = await fetch(`/api/admin/enquiries?passcode=${passcode}`);
        const enquiriesJson = await enquiriesRes.json();
        if (enquiriesJson.success) {
          const list: Enquiry[] = enquiriesJson.enquiries || [];
          setEnquiries(list);
          
          // Initialise edit states with existing values
          const notesMap: { [id: string]: string } = {};
          const statusMap: { [id: string]: string } = {};
          list.forEach(e => {
            notesMap[e.id] = e.notes || "";
            statusMap[e.id] = e.status || "New";
          });
          setEditNotes(notesMap);
          setEditStatus(statusMap);
        }
      } catch (err) {
        console.error("Error loading admin data: ", err);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [isAuthorized, passcode]);

  // Save content modifications (Blogs, Gallery, Testimonials)
  const saveContent = async (type: "students" | "gallery" | "blogs", updatedData: Testimonial[] | GalleryItem[] | Blog[]) => {
    try {
      const res = await fetch("/api/admin/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          passcode,
          type,
          data: updatedData
        })
      });
      const json = await res.json();
      if (!json.success) {
        alert("Failed to save data: " + json.error);
      }
    } catch (err) {
      console.error(err);
      alert("Error saving data to database.");
    }
  };

  // Testimonials Handler
  const handleAddTestimonial = (e: React.FormEvent) => {
    e.preventDefault();
    const updated = [newTestimonial, ...testimonials];
    setTestimonials(updated);
    saveContent("students", updated);
    setNewTestimonial({ name: "", team: "", badge: "", quote: "" });
  };

  const handleDeleteTestimonial = (index: number) => {
    const updated = testimonials.filter((_, i) => i !== index);
    setTestimonials(updated);
    saveContent("students", updated);
  };

  // Gallery Handler
  const handleAddGallery = (e: React.FormEvent) => {
    e.preventDefault();
    const updated = [newGallery, ...gallery];
    setGallery(updated);
    saveContent("gallery", updated);
    setNewGallery({ src: "/assets/cricket_match.jpg", alt: "", title: "", desc: "" });
  };

  const handleDeleteGallery = (index: number) => {
    const updated = gallery.filter((_, i) => i !== index);
    setGallery(updated);
    saveContent("gallery", updated);
  };

  // Blogs Handler
  const handleAddBlog = (e: React.FormEvent) => {
    e.preventDefault();
    const blogItem = {
      id: Date.now().toString(),
      ...newBlog,
      date: new Date().toISOString().split("T")[0],
      author: "Coach Sandeep Dahad"
    };
    const updated = [blogItem, ...blogs];
    setBlogs(updated);
    saveContent("blogs", updated);
    setNewBlog({ title: "", excerpt: "", content: "" });
  };

  const handleDeleteBlog = (id: string) => {
    const updated = blogs.filter((b) => b.id !== id);
    setBlogs(updated);
    saveContent("blogs", updated);
  };

  const handleNotesChange = (id: string, text: string) => {
    setEditNotes({ ...editNotes, [id]: text });
  };

  // Update Enquiry Details (Status / Notes)
  const handleUpdateEnquiry = async (enquiryId: string) => {
    try {
      const status = editStatus[enquiryId] || "New";
      const notes = editNotes[enquiryId] || "";

      const res = await fetch("/api/admin/enquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          passcode,
          enquiryId,
          status,
          notes
        })
      });
      const json = await res.json();
      if (json.success) {
        setEnquiries(json.enquiries || []);
        alert("Enquiry updated successfully!");
      } else {
        alert("Failed to update enquiry: " + json.error);
      }
    } catch (err) {
      console.error(err);
      alert("Error updating enquiry details.");
    }
  };

  // Export filtered enquiries to CSV (opens directly in Microsoft Excel)
  const handleExportCSV = () => {
    if (filteredEnquiries.length === 0) {
      alert("No records to export.");
      return;
    }

    const headers = [
      "ID", "Date/Time", "Form Type", "Name", "Age", "Gender", 
      "Mobile", "Email", "City", "Playing Level", "Service Requested", 
      "Preferred Date", "Preferred Time", "Message", "Status", "Notes"
    ];

    const rows = filteredEnquiries.map(e => [
      e.id,
      new Date(e.createdAt || "").toLocaleString(),
      e.formType || "booking",
      e.name,
      e.age || "",
      e.gender || "",
      e.mobile,
      e.email,
      e.city,
      e.level || "",
      e.service,
      e.preferredDate || "",
      e.preferredTime || "",
      (e.message || "").replace(/"/g, '""'),
      e.status || "New",
      (e.notes || "").replace(/"/g, '""')
    ]);

    const csvContent = "\uFEFF" + [headers.join(","), ...rows.map(r => r.map(val => `"${val}"`).join(","))].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `enquiries_export_${new Date().toISOString().split("T")[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleLogout = () => {
    localStorage.removeItem("sdcf_passcode");
    setIsAuthorized(false);
    setPasscode("");
  };

  // Filter computation
  const filteredEnquiries = enquiries.filter(enq => {
    const matchesSearch = 
      enq.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      enq.mobile?.includes(searchTerm) ||
      enq.email?.toLowerCase().includes(searchTerm.toLowerCase());
      
    const matchesService = filterService === "all" || enq.service === filterService;
    const matchesStatus = filterStatus === "all" || (enq.status || "New") === filterStatus;
    
    let matchesDate = true;
    if (startDate || endDate) {
      const enqDate = new Date(enq.createdAt).getTime();
      if (startDate) {
        const start = new Date(startDate).setHours(0,0,0,0);
        if (enqDate < start) matchesDate = false;
      }
      if (endDate) {
        const end = new Date(endDate).setHours(23,59,59,999);
        if (enqDate > end) matchesDate = false;
      }
    }
    
    return matchesSearch && matchesService && matchesStatus && matchesDate;
  });

  // Analytics helper calculations
  const totalCount = enquiries.length;
  const privateCount = enquiries.filter(e => e.service === "Private Coaching").length;
  const groupCount = enquiries.filter(e => e.service === "Group Coaching").length;
  const consultCount = enquiries.filter(e => e.service === "Cricket Consultation").length;
  
  const todayCount = enquiries.filter(e => {
    const today = new Date().toDateString();
    return new Date(e.createdAt).toDateString() === today;
  }).length;

  const thisMonthCount = enquiries.filter(e => {
    const d = new Date();
    const eD = new Date(e.createdAt);
    return eD.getMonth() === d.getMonth() && eD.getFullYear() === d.getFullYear();
  }).length;

  // Monthly trends calculation for past 6 months
  const monthlyData = () => {
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const last6: any[] = [];
    for (let i = 5; i >= 0; i--) {
      const d = new Date();
      d.setMonth(d.getMonth() - i);
      const mIdx = d.getMonth();
      const y = d.getFullYear();
      last6.push({
        label: `${months[mIdx]} ${y}`,
        month: mIdx,
        year: y,
        total: 0,
        private: 0,
        group: 0,
        consult: 0
      });
    }

    enquiries.forEach(e => {
      const date = new Date(e.createdAt);
      const m = date.getMonth();
      const y = date.getFullYear();
      const item = last6.find(item => item.month === m && item.year === y);
      if (item) {
        item.total += 1;
        if (e.service === "Private Coaching") item.private += 1;
        else if (e.service === "Group Coaching") item.group += 1;
        else if (e.service === "Cricket Consultation") item.consult += 1;
      }
    });

    return last6;
  };

  const trendData = monthlyData();
  const maxTrendTotal = Math.max(...trendData.map(t => t.total), 1);

  if (!isAuthorized) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", justifyContent: "center", alignItems: "center", background: "#F8FAFC" }}>
        <div className="glass-card" style={{ maxWidth: "400px", width: "100%", padding: "40px", textAlign: "center", boxShadow: "0 10px 30px rgba(0,0,0,0.08)", border: "1px solid rgba(11,19,43,0.08)" }}>
          <h2 style={{ color: "var(--text-white)", marginBottom: "10px", fontFamily: "var(--font-heading)" }}>Admin Portal</h2>
          <p style={{ color: "var(--text-gray)", fontSize: "0.85rem", marginBottom: "30px" }}>Enter passcode to manage foundation details</p>
          
          <form onSubmit={handleLogin} className="contact-form">
            <div className="form-group">
              <input 
                type="password" 
                placeholder="Passcode" 
                value={passcode} 
                onChange={(e) => setPasscode(e.target.value)} 
                required
                style={{ textAlign: "center", letterSpacing: "4px" }}
              />
            </div>
            {loginError && <p style={{ color: "var(--error)", fontSize: "0.85rem", marginTop: "5px" }}>{loginError}</p>}
            <button type="submit" className="btn btn-cta-red" style={{ width: "100%", marginTop: "15px", justifyContent: "center" }}>
              Access Dashboard
            </button>
            <Link href="/" style={{ color: "var(--text-gray)", fontSize: "0.85rem", display: "inline-block", marginTop: "20px", textDecoration: "underline" }}>
              Back to Home
            </Link>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: "#FFFFFF", padding: "40px 20px" }}>
      <div className="container" style={{ maxWidth: "1200px" }}>
        
        {/* Admin Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid rgba(15, 23, 42, 0.08)", paddingBottom: "20px", marginBottom: "35px" }}>
          <div>
            <h1 style={{ color: "var(--text-white)", fontSize: "2rem", fontFamily: "var(--font-heading)" }}>Admin Dashboard</h1>
            <p style={{ color: "var(--text-gray)", fontSize: "0.85rem" }}>Sandeep Dahad Cricket Foundation CMS</p>
          </div>
          <div style={{ display: "flex", gap: "15px" }}>
            <Link href="/" className="btn btn-secondary" style={{ fontSize: "0.85rem", padding: "8px 18px", border: "1px solid rgba(11,19,43,0.15)" }}>
              Visit Website
            </Link>
            <button className="btn" onClick={handleLogout} style={{ background: "var(--error)", color: "#fff", fontSize: "0.85rem", padding: "8px 18px" }}>
              Logout
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="tabs-container" style={{ justifyContent: "flex-start", borderBottom: "1px solid rgba(15, 23, 42, 0.08)", paddingBottom: "15px", marginBottom: "30px" }}>
          <button className={`tab-btn ${activeTab === "enquiries" ? "active" : ""}`} onClick={() => setActiveTab("enquiries")}>
            Enquiries ({enquiries.length})
          </button>
          <button className={`tab-btn ${activeTab === "testimonials" ? "active" : ""}`} onClick={() => setActiveTab("testimonials")}>
            Testimonials ({testimonials.length})
          </button>
          <button className={`tab-btn ${activeTab === "gallery" ? "active" : ""}`} onClick={() => setActiveTab("gallery")}>
            Gallery ({gallery.length})
          </button>
          <button className={`tab-btn ${activeTab === "blogs" ? "active" : ""}`} onClick={() => setActiveTab("blogs")}>
            Blogs ({blogs.length})
          </button>
        </div>

        {loading && <p style={{ color: "var(--accent-gold)" }}>Loading dashboard data...</p>}

        {/* TABS CONTENT */}

        {/* 1. Enquiries Log Tab */}
        {activeTab === "enquiries" && !loading && (
          <div>
            {/* Analytics Summary Cards */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "20px", marginBottom: "35px" }}>
              <div className="glass-card" style={{ padding: "18px", textAlign: "center" }}>
                <div style={{ fontSize: "0.8rem", color: "var(--text-gray)", textTransform: "uppercase", fontWeight: "600" }}>Total Enquiries</div>
                <div style={{ fontSize: "2rem", fontWeight: "800", color: "var(--text-white)", marginTop: "5px" }}>{totalCount}</div>
              </div>
              <div className="glass-card" style={{ padding: "18px", textAlign: "center" }}>
                <div style={{ fontSize: "0.8rem", color: "var(--text-gray)", textTransform: "uppercase", fontWeight: "600" }}>Private Coaching</div>
                <div style={{ fontSize: "2rem", fontWeight: "800", color: "#EF4444", marginTop: "5px" }}>{privateCount}</div>
              </div>
              <div className="glass-card" style={{ padding: "18px", textAlign: "center" }}>
                <div style={{ fontSize: "0.8rem", color: "var(--text-gray)", textTransform: "uppercase", fontWeight: "600" }}>Group Coaching</div>
                <div style={{ fontSize: "2rem", fontWeight: "800", color: "#3B82F6", marginTop: "5px" }}>{groupCount}</div>
              </div>
              <div className="glass-card" style={{ padding: "18px", textAlign: "center" }}>
                <div style={{ fontSize: "0.8rem", color: "var(--text-gray)", textTransform: "uppercase", fontWeight: "600" }}>Consultation</div>
                <div style={{ fontSize: "2rem", fontWeight: "800", color: "var(--accent-gold)", marginTop: "5px" }}>{consultCount}</div>
              </div>
              <div className="glass-card" style={{ padding: "18px", textAlign: "center" }}>
                <div style={{ fontSize: "0.8rem", color: "var(--text-gray)", textTransform: "uppercase", fontWeight: "600" }}>Today</div>
                <div style={{ fontSize: "2rem", fontWeight: "800", color: "#10B981", marginTop: "5px" }}>{todayCount}</div>
              </div>
              <div className="glass-card" style={{ padding: "18px", textAlign: "center" }}>
                <div style={{ fontSize: "0.8rem", color: "var(--text-gray)", textTransform: "uppercase", fontWeight: "600" }}>This Month</div>
                <div style={{ fontSize: "2rem", fontWeight: "800", color: "#8B5CF6", marginTop: "5px" }}>{thisMonthCount}</div>
              </div>
            </div>

            {/* Monthly Trend CSS Bar Chart */}
            <div className="glass-card" style={{ padding: "30px", marginBottom: "40px" }}>
              <h3 style={{ fontSize: "1.2rem", marginBottom: "20px", color: "var(--text-white)", fontFamily: "var(--font-heading)" }}>Monthly Enquiry Trends</h3>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", height: "200px", borderBottom: "2px solid var(--primary-light)", paddingBottom: "10px", gap: "10px" }}>
                {trendData.map((t, idx) => (
                  <div key={idx} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", height: "100%", justifyContent: "flex-end" }}>
                    {/* Hover details */}
                    <div style={{ display: "flex", width: "100%", justifyContent: "center", gap: "4px", height: "100%", alignItems: "flex-end" }}>
                      {/* Bar Total */}
                      <div 
                        title={`Total: ${t.total}`} 
                        style={{ width: "16px", height: `${(t.total / maxTrendTotal) * 100}%`, background: "var(--text-white)", borderRadius: "3px 3px 0 0", minHeight: t.total > 0 ? "4px" : "0" }}
                      ></div>
                      {/* Bar Private */}
                      <div 
                        title={`Private: ${t.private}`} 
                        style={{ width: "10px", height: `${(t.private / maxTrendTotal) * 100}%`, background: "#EF4444", borderRadius: "2px 2px 0 0", minHeight: t.private > 0 ? "4px" : "0" }}
                      ></div>
                      {/* Bar Group */}
                      <div 
                        title={`Group: ${t.group}`} 
                        style={{ width: "10px", height: `${(t.group / maxTrendTotal) * 100}%`, background: "#3B82F6", borderRadius: "2px 2px 0 0", minHeight: t.group > 0 ? "4px" : "0" }}
                      ></div>
                      {/* Bar Consultation */}
                      <div 
                        title={`Consultation: ${t.consult}`} 
                        style={{ width: "10px", height: `${(t.consult / maxTrendTotal) * 100}%`, background: "var(--accent-gold)", borderRadius: "2px 2px 0 0", minHeight: t.consult > 0 ? "4px" : "0" }}
                      ></div>
                    </div>
                    {/* Label */}
                    <div style={{ fontSize: "0.75rem", color: "var(--text-gray)", marginTop: "10px" }}>{t.label}</div>
                  </div>
                ))}
              </div>
              <div style={{ display: "flex", gap: "20px", marginTop: "15px", flexWrap: "wrap", fontSize: "0.8rem", justifyContent: "center" }}>
                <span style={{ display: "flex", alignItems: "center", gap: "6px" }}><span style={{ display: "inline-block", width: "12px", height: "12px", background: "var(--text-white)", borderRadius: "2px" }}></span> Total</span>
                <span style={{ display: "flex", alignItems: "center", gap: "6px" }}><span style={{ display: "inline-block", width: "12px", height: "12px", background: "#EF4444", borderRadius: "2px" }}></span> Private</span>
                <span style={{ display: "flex", alignItems: "center", gap: "6px" }}><span style={{ display: "inline-block", width: "12px", height: "12px", background: "#3B82F6", borderRadius: "2px" }}></span> Group</span>
                <span style={{ display: "flex", alignItems: "center", gap: "6px" }}><span style={{ display: "inline-block", width: "12px", height: "12px", background: "var(--accent-gold)", borderRadius: "2px" }}></span> Consultation</span>
              </div>
            </div>

            {/* Filter Panel */}
            <div className="glass-card" style={{ padding: "20px", marginBottom: "30px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "15px", marginBottom: "15px" }}>
                <h4 style={{ color: "var(--text-white)", fontSize: "1.1rem" }}>Filters & Tools</h4>
                <button onClick={handleExportCSV} className="btn btn-cta-red" style={{ fontSize: "0.85rem", padding: "8px 18px" }}>
                  Export Filtered to CSV (Excel)
                </button>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "15px" }}>
                <div className="form-group">
                  <label style={{ fontSize: "0.75rem", fontWeight: "600", color: "var(--text-gray)" }}>Search (Name, Mobile, Email)</label>
                  <input 
                    type="text" 
                    placeholder="Search query..." 
                    value={searchTerm} 
                    onChange={(e) => setSearchTerm(e.target.value)} 
                    style={{ padding: "8px 12px", fontSize: "0.85rem" }}
                  />
                </div>
                <div className="form-group">
                  <label style={{ fontSize: "0.75rem", fontWeight: "600", color: "var(--text-gray)" }}>Filter by Programme</label>
                  <select 
                    value={filterService} 
                    onChange={(e) => setFilterService(e.target.value)}
                    style={{ padding: "8px 12px", fontSize: "0.85rem" }}
                  >
                    <option value="all">All Programmes</option>
                    <option value="Group Coaching">Group Coaching</option>
                    <option value="Private Coaching">Private Coaching</option>
                    <option value="Cricket Consultation">Cricket Consultation</option>
                    <option value="High Performance Program">High Performance Program</option>
                    <option value="General Contact">General Contact</option>
                    <option value="Coaching Enquiry">Coaching Enquiry</option>
                    <option value="Consultation Enquiry">Consultation Enquiry</option>
                  </select>
                </div>
                <div className="form-group">
                  <label style={{ fontSize: "0.75rem", fontWeight: "600", color: "var(--text-gray)" }}>Filter by Status</label>
                  <select 
                    value={filterStatus} 
                    onChange={(e) => setFilterStatus(e.target.value)}
                    style={{ padding: "8px 12px", fontSize: "0.85rem" }}
                  >
                    <option value="all">All Statuses</option>
                    <option value="New">New</option>
                    <option value="Contacted">Contacted</option>
                    <option value="Follow-up">Follow-up</option>
                    <option value="Closed">Closed</option>
                  </select>
                </div>
                <div className="form-group">
                  <label style={{ fontSize: "0.75rem", fontWeight: "600", color: "var(--text-gray)" }}>Date From</label>
                  <input 
                    type="date" 
                    value={startDate} 
                    onChange={(e) => setStartDate(e.target.value)}
                    style={{ padding: "8px 12px", fontSize: "0.85rem" }}
                  />
                </div>
                <div className="form-group">
                  <label style={{ fontSize: "0.75rem", fontWeight: "600", color: "var(--text-gray)" }}>Date To</label>
                  <input 
                    type="date" 
                    value={endDate} 
                    onChange={(e) => setEndDate(e.target.value)}
                    style={{ padding: "8px 12px", fontSize: "0.85rem" }}
                  />
                </div>
              </div>
            </div>

            {/* List */}
            <h3 style={{ color: "var(--text-white)", marginBottom: "20px" }}>
              Enquiries Log ({filteredEnquiries.length} shown)
            </h3>
            {filteredEnquiries.length === 0 ? (
              <div className="glass-card" style={{ padding: "40px", textAlign: "center", color: "var(--text-gray)" }}>
                No matching enquiries found.
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "25px" }}>
                {filteredEnquiries.map((enq) => (
                  <div key={enq.id} className="glass-card" style={{ borderLeft: `6px solid ${(enq.status === "Closed" ? "#64748B" : enq.status === "Follow-up" ? "#8B5CF6" : enq.status === "Contacted" ? "#3B82F6" : "#EF4444")}`, padding: "25px", border: "1px solid rgba(11,19,43,0.08)", boxShadow: "0 4px 15px rgba(0,0,0,0.02)" }}>
                    {/* Card Header */}
                    <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: "10px", marginBottom: "15px", borderBottom: "1px solid rgba(15, 23, 42, 0.08)", paddingBottom: "10px" }}>
                      <div>
                        <h4 style={{ color: "var(--text-white)", fontSize: "1.2rem" }}>
                          {enq.name}{" "}
                          {enq.age && <span style={{ fontSize: "0.85rem", color: "var(--text-gray)" }}>({enq.age} yrs)</span>}
                          {enq.gender && <span style={{ fontSize: "0.85rem", color: "var(--text-gray)", marginLeft: "5px" }}>[{enq.gender}]</span>}
                        </h4>
                        <p style={{ fontSize: "0.85rem", color: "var(--accent-gold)", textTransform: "uppercase", fontWeight: "700", marginTop: "3px" }}>
                          {enq.service} {enq.level && `• ${enq.level} Level`}
                        </p>
                      </div>
                      <div style={{ textAlign: "right" }}>
                        <span style={{ fontSize: "0.8rem", color: "var(--text-gray)", display: "block" }}>{new Date(enq.createdAt).toLocaleString()}</span>
                        <span style={{ fontSize: "0.75rem", background: "var(--primary-light)", padding: "2px 8px", borderRadius: "4px", color: "var(--text-white)", display: "inline-block", marginTop: "5px" }}>
                          Type: {enq.formType || "booking"}
                        </span>
                      </div>
                    </div>

                    {/* Card Contact details & Meta */}
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "15px", marginBottom: "15px", fontSize: "0.9rem" }}>
                      <div>
                        <strong>Mobile:</strong> <a href={`https://wa.me/${enq.mobile.replace(/[^0-9]/g, "")}`} target="_blank" rel="noopener noreferrer" style={{ color: "var(--accent-gold)", fontWeight: "600" }}>{enq.mobile}</a>
                      </div>
                      <div>
                        <strong>Email:</strong> <a href={`mailto:${enq.email}`} style={{ color: "var(--accent-gold)" }}>{enq.email}</a>
                      </div>
                      <div>
                        <strong>City:</strong> {enq.city}
                      </div>
                      {enq.preferredDate && (
                        <div>
                          <strong>Preferred:</strong> {enq.preferredDate} • {enq.preferredTime}
                        </div>
                      )}
                    </div>

                    {/* Message Box */}
                    <p style={{ background: "rgba(15, 23, 42, 0.04)", padding: "12px", borderRadius: "6px", fontSize: "0.9rem", color: "var(--text-gray)", fontStyle: "italic", marginBottom: "20px" }}>
                      &ldquo;{enq.message}&rdquo;
                    </p>

                    {/* Interactive controls: Status & Remarks */}
                    <div style={{ borderTop: "1px solid rgba(15, 23, 42, 0.08)", paddingTop: "15px", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "20px", alignItems: "flex-end" }}>
                      <div className="form-row" style={{ gap: "15px" }}>
                        <div className="form-group">
                          <label style={{ fontSize: "0.75rem", fontWeight: "600", color: "var(--text-gray)" }}>Update Status</label>
                          <select 
                            value={editStatus[enq.id] !== undefined ? editStatus[enq.id] : (enq.status || "New")}
                            onChange={(e) => setEditStatus({ ...editStatus, [enq.id]: e.target.value })}
                            style={{ padding: "6px 12px", fontSize: "0.85rem", height: "38px" }}
                          >
                            <option value="New">New</option>
                            <option value="Contacted">Contacted</option>
                            <option value="Follow-up">Follow-up</option>
                            <option value="Closed">Closed</option>
                          </select>
                        </div>
                        <div className="form-group" style={{ flexGrow: 1 }}>
                          <label style={{ fontSize: "0.75rem", fontWeight: "600", color: "var(--text-gray)" }}>Internal Remarks/Notes</label>
                          <input 
                            type="text" 
                            placeholder="Add remarks..." 
                            value={editNotes[enq.id] !== undefined ? editNotes[enq.id] : (enq.notes || "")}
                            onChange={(e) => handleNotesChange(enq.id, e.target.value)}
                            style={{ padding: "6px 12px", fontSize: "0.85rem", height: "38px" }}
                          />
                        </div>
                      </div>
                      
                      {/* Action buttons */}
                      <div style={{ display: "flex", gap: "10px", justifyContent: "flex-end", flexWrap: "wrap" }}>
                        <a 
                          href={`https://wa.me/${enq.mobile.replace(/[^0-9]/g, "")}`}
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="btn btn-secondary" 
                          style={{ padding: "8px 15px", fontSize: "0.8rem", border: "1px solid rgba(11,19,43,0.15)" }}
                        >
                          WhatsApp
                        </a>
                        <a 
                          href={`mailto:${enq.email}`} 
                          className="btn btn-secondary" 
                          style={{ padding: "8px 15px", fontSize: "0.8rem", border: "1px solid rgba(11,19,43,0.15)" }}
                        >
                          Email
                        </a>
                        <button 
                          onClick={() => handleUpdateEnquiry(enq.id)} 
                          className="btn btn-cta-red" 
                          style={{ padding: "8px 18px", fontSize: "0.8rem" }}
                        >
                          Save Update
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* 2. Testimonials Edit Tab */}
        {activeTab === "testimonials" && !loading && (
          <div style={{ display: "grid", gridTemplateColumns: "1.2fr 0.8fr", gap: "30px" }}>
            {/* List */}
            <div>
              <h3 style={{ color: "var(--text-white)", marginBottom: "20px" }}>Active Testimonials</h3>
              <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
                {testimonials.map((t, idx) => (
                  <div key={idx} className="glass-card" style={{ display: "flex", justifyContent: "space-between", gap: "20px", alignItems: "flex-start", border: "1px solid rgba(11,19,43,0.08)" }}>
                    <div>
                      <h4 style={{ color: "var(--text-white)" }}>{t.name} <span style={{ fontSize: "0.8rem", color: "var(--accent-gold)", textTransform: "uppercase" }}>({t.badge})</span></h4>
                      <p style={{ fontSize: "0.85rem", color: "var(--text-gray)", margin: "4px 0 10px" }}>{t.team}</p>
                      <p style={{ fontSize: "0.85rem", fontStyle: "italic", borderLeft: "2px solid var(--accent-gold)", paddingLeft: "10px", color: "var(--text-gray)" }}>&ldquo;{t.quote}&rdquo;</p>
                    </div>
                    <button 
                      className="btn" 
                      onClick={() => handleDeleteTestimonial(idx)}
                      style={{ background: "rgba(239, 68, 68, 0.15)", color: "var(--error)", padding: "5px 12px", borderRadius: "6px", fontSize: "0.75rem", flexShrink: 0 }}
                    >
                      Delete
                    </button>
                  </div>
                ))}
              </div>
            </div>
            {/* Add Form */}
            <div>
              <div className="glass-card" style={{ position: "sticky", top: "100px", border: "1px solid rgba(11,19,43,0.08)" }}>
                <h3 style={{ color: "var(--text-white)", marginBottom: "20px", fontFamily: "var(--font-heading)" }}>Add Testimonial</h3>
                <form onSubmit={handleAddTestimonial} className="contact-form">
                  <div className="form-group">
                    <label>Student Name</label>
                    <input 
                      type="text" 
                      required 
                      value={newTestimonial.name} 
                      onChange={(e) => setNewTestimonial({ ...newTestimonial, name: e.target.value })} 
                      placeholder="e.g. Ayush Mhatre" 
                    />
                  </div>
                  <div className="form-group">
                    <label>Team/Association</label>
                    <input 
                      type="text" 
                      required 
                      value={newTestimonial.team} 
                      onChange={(e) => setNewTestimonial({ ...newTestimonial, team: e.target.value })} 
                      placeholder="e.g. Chennai Super Kings (CSK)" 
                    />
                  </div>
                  <div className="form-group">
                    <label>Badge Level</label>
                    <input 
                      type="text" 
                      required 
                      value={newTestimonial.badge} 
                      onChange={(e) => setNewTestimonial({ ...newTestimonial, badge: e.target.value })} 
                      placeholder="e.g. IPL / Domestic" 
                    />
                  </div>
                  <div className="form-group">
                    <label>Quote Text</label>
                    <textarea 
                      required 
                      value={newTestimonial.quote} 
                      onChange={(e) => setNewTestimonial({ ...newTestimonial, quote: e.target.value })} 
                      placeholder="Enter feedback statement..."
                      style={{ minHeight: "100px" }}
                    />
                  </div>
                  <button type="submit" className="btn btn-cta-red" style={{ width: "100%", justifyContent: "center" }}>
                    Save Testimonial
                  </button>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* 3. Gallery Edit Tab */}
        {activeTab === "gallery" && !loading && (
          <div style={{ display: "grid", gridTemplateColumns: "1.2fr 0.8fr", gap: "30px" }}>
            {/* List */}
            <div>
              <h3 style={{ color: "var(--text-white)", marginBottom: "20px" }}>Gallery Images</h3>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: "20px" }}>
                {gallery.map((item, idx) => (
                  <div key={idx} className="glass-card" style={{ padding: "10px", display: "flex", flexDirection: "column", height: "100%", border: "1px solid rgba(11,19,43,0.08)" }}>
                    <div style={{ height: "150px", background: "rgba(15, 23, 42, 0.04)", borderRadius: "8px", display: "flex", justifyContent: "center", alignItems: "center", overflow: "hidden" }}>
                      <span style={{ fontSize: "0.8rem", color: "var(--text-gray)", wordBreak: "break-all", padding: "10px" }}>{item.src}</span>
                    </div>
                    <div style={{ padding: "10px", flexGrow: 1 }}>
                      <h4 style={{ color: "var(--text-white)", fontSize: "0.95rem" }}>{item.title}</h4>
                      <p style={{ fontSize: "0.8rem", color: "var(--text-gray)", marginTop: "4px" }}>{item.desc}</p>
                    </div>
                    <button 
                      className="btn" 
                      onClick={() => handleDeleteGallery(idx)}
                      style={{ background: "rgba(239, 68, 68, 0.15)", color: "var(--error)", padding: "5px 12px", width: "100%", marginTop: "10px", borderRadius: "6px", fontSize: "0.75rem" }}
                    >
                      Delete Image
                    </button>
                  </div>
                ))}
              </div>
            </div>
            {/* Add Form */}
            <div>
              <div className="glass-card" style={{ position: "sticky", top: "100px", border: "1px solid rgba(11,19,43,0.08)" }}>
                <h3 style={{ color: "var(--text-white)", marginBottom: "20px", fontFamily: "var(--font-heading)" }}>Add Gallery Item</h3>
                <form onSubmit={handleAddGallery} className="contact-form">
                  <div className="form-group">
                    <label>Image Resource URL</label>
                    <input 
                      type="text" 
                      required 
                      value={newGallery.src} 
                      onChange={(e) => setNewGallery({ ...newGallery, src: e.target.value })} 
                      placeholder="e.g. /assets/cricket_match.jpg" 
                    />
                  </div>
                  <div className="form-group">
                    <label>Title</label>
                    <input 
                      type="text" 
                      required 
                      value={newGallery.title} 
                      onChange={(e) => setNewGallery({ ...newGallery, title: e.target.value })} 
                      placeholder="e.g. Practice match" 
                    />
                  </div>
                  <div className="form-group">
                    <label>Description</label>
                    <textarea 
                      required 
                      value={newGallery.desc} 
                      onChange={(e) => setNewGallery({ ...newGallery, desc: e.target.value })} 
                      placeholder="Description of the action..."
                      style={{ minHeight: "100px" }}
                    />
                  </div>
                  <button type="submit" className="btn btn-cta-red" style={{ width: "100%", justifyContent: "center" }}>
                    Save Gallery Item
                  </button>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* 4. Blogs Edit Tab */}
        {activeTab === "blogs" && !loading && (
          <div style={{ display: "grid", gridTemplateColumns: "1.2fr 0.8fr", gap: "30px" }}>
            {/* List */}
            <div>
              <h3 style={{ color: "var(--text-white)", marginBottom: "20px" }}>Foundation Blogs</h3>
              <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                {blogs.map((blog) => (
                  <div key={blog.id} className="glass-card" style={{ padding: "25px", border: "1px solid rgba(11,19,43,0.08)" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "10px" }}>
                      <h4 style={{ color: "var(--text-white)", fontSize: "1.1rem" }}>{blog.title}</h4>
                      <button 
                        className="btn" 
                        onClick={() => handleDeleteBlog(blog.id)}
                        style={{ background: "rgba(239, 68, 68, 0.15)", color: "var(--error)", padding: "5px 12px", borderRadius: "6px", fontSize: "0.75rem" }}
                      >
                        Delete
                      </button>
                    </div>
                    <span style={{ fontSize: "0.8rem", color: "var(--accent-gold)" }}>Published: {blog.date} | By {blog.author}</span>
                    <p style={{ fontSize: "0.9rem", color: "var(--text-gray)", margin: "12px 0", fontWeight: "600" }}>{blog.excerpt}</p>
                    <p style={{ fontSize: "0.85rem", color: "var(--text-gray)", whiteSpace: "pre-wrap", background: "rgba(15, 23, 42, 0.04)", padding: "12px", borderRadius: "6px" }}>{blog.content}</p>
                  </div>
                ))}
              </div>
            </div>
            {/* Add Form */}
            <div>
              <div className="glass-card" style={{ position: "sticky", top: "100px", border: "1px solid rgba(11,19,43,0.08)" }}>
                <h3 style={{ color: "var(--text-white)", marginBottom: "20px", fontFamily: "var(--font-heading)" }}>Create Blog Post</h3>
                <form onSubmit={handleAddBlog} className="contact-form">
                  <div className="form-group">
                    <label>Article Title</label>
                    <input 
                      type="text" 
                      required 
                      value={newBlog.title} 
                      onChange={(e) => setNewBlog({ ...newBlog, title: e.target.value })} 
                      placeholder="e.g. How to perfecting wrist release" 
                    />
                  </div>
                  <div className="form-group">
                    <label>Short Excerpt</label>
                    <input 
                      type="text" 
                      required 
                      value={newBlog.excerpt} 
                      onChange={(e) => setNewBlog({ ...newBlog, excerpt: e.target.value })} 
                      placeholder="Brief article summary..." 
                    />
                  </div>
                  <div className="form-group">
                    <label>Article Body</label>
                    <textarea 
                      required 
                      value={newBlog.content} 
                      onChange={(e) => setNewBlog({ ...newBlog, content: e.target.value })} 
                      placeholder="Write full article body content..." 
                      style={{ minHeight: "180px" }}
                    />
                  </div>
                  <button type="submit" className="btn btn-cta-red" style={{ width: "100%", justifyContent: "center" }}>
                    Publish Post
                  </button>
                </form>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
