"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

interface Enquiry {
  id: string;
  name: string;
  age: string;
  mobile: string;
  email: string;
  city: string;
  level: string;
  preferredTime: string;
  message: string;
  service: string;
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
          setEnquiries(enquiriesJson.enquiries || []);
        }
      } catch (err) {
        console.error("Error loading admin data: ", err);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [isAuthorized, passcode]);

  // Save changes to API
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

  const handleLogout = () => {
    localStorage.removeItem("sdcf_passcode");
    setIsAuthorized(false);
    setPasscode("");
  };

  if (!isAuthorized) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", justifyContent: "center", alignItems: "center", background: "var(--primary-dark)" }}>
        <div className="glass-card" style={{ maxWidth: "400px", width: "100%", padding: "40px", textAlign: "center" }}>
          <h2 style={{ color: "var(--accent-gold)", marginBottom: "10px", fontFamily: "var(--font-heading)" }}>Admin Portal</h2>
          <p style={{ color: "var(--text-gray)", fontSize: "0.85rem", marginBottom: "30px" }}>Enter passcode to manage foundation details</p>
          
          <form onSubmit={handleLogin} className="contact-form">
            <div className="form-group">
              <label htmlFor="passcode" style={{ textAlign: "left" }}>Passcode</label>
              <input 
                type="password" 
                id="passcode" 
                placeholder="Enter admin passcode" 
                value={passcode} 
                onChange={(e) => setPasscode(e.target.value)} 
                required 
              />
            </div>
            {loginError && <p style={{ color: "var(--error)", fontSize: "0.85rem", marginTop: "5px" }}>{loginError}</p>}
            <button type="submit" className="btn btn-primary" style={{ width: "100%", marginTop: "15px", justifyContent: "center" }}>
              Verify & Enter
            </button>
            <Link href="/" style={{ color: "var(--text-gray)", fontSize: "0.85rem", display: "inline-block", marginTop: "20px" }}>
              ← Back to Website
            </Link>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: "var(--primary-dark)", padding: "40px 20px" }}>
      <div className="container" style={{ maxWidth: "1200px" }}>
        
        {/* Admin Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid rgba(15, 23, 42, 0.08)", paddingBottom: "20px", marginBottom: "35px" }}>
          <div>
            <h1 style={{ color: "var(--text-white)", fontSize: "2rem", fontFamily: "var(--font-heading)" }}>Admin Dashboard</h1>
            <p style={{ color: "var(--text-gray)", fontSize: "0.85rem" }}>Sandeep Dahad Cricket Foundation CMS</p>
          </div>
          <div style={{ display: "flex", gap: "15px" }}>
            <Link href="/" className="btn btn-secondary" style={{ fontSize: "0.85rem", padding: "8px 18px" }}>
              Visit Website
            </Link>
            <button className="btn btn-primary" onClick={handleLogout} style={{ background: "var(--error)", color: "#fff", boxShadow: "none", fontSize: "0.85rem", padding: "8px 18px" }}>
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
            <h3 style={{ color: "var(--text-white)", marginBottom: "20px" }}>Enquiries Log</h3>
            {enquiries.length === 0 ? (
              <div className="glass-card" style={{ padding: "40px", textAlign: "center", color: "var(--text-gray)" }}>
                No enquiries submitted yet.
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                {enquiries.map((enq) => (
                  <div key={enq.id} className="glass-card" style={{ borderLeft: "4px solid var(--accent-gold)", padding: "25px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: "10px", marginBottom: "15px", borderBottom: "1px solid rgba(15, 23, 42, 0.08)", paddingBottom: "10px" }}>
                      <div>
                        <h4 style={{ color: "var(--text-white)", fontSize: "1.1rem" }}>{enq.name} <span style={{ fontSize: "0.85rem", color: "var(--text-gray)" }}>({enq.age} yrs)</span></h4>
                        <p style={{ fontSize: "0.8rem", color: "var(--accent-gold)", textTransform: "uppercase", fontWeight: "600", marginTop: "3px" }}>{enq.service} - {enq.level} Level</p>
                      </div>
                      <span style={{ fontSize: "0.8rem", color: "var(--text-gray)" }}>{new Date(enq.createdAt).toLocaleString()}</span>
                    </div>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "15px", marginBottom: "15px", fontSize: "0.9rem" }}>
                      <p><strong>Mobile:</strong> <a href={`https://wa.me/${enq.mobile.replace(/[^0-9]/g, "")}`} target="_blank" rel="noopener noreferrer" style={{ color: "var(--accent-gold)" }}>{enq.mobile}</a></p>
                      <p><strong>Email:</strong> {enq.email}</p>
                      <p><strong>City:</strong> {enq.city}</p>
                      <p><strong>Preferred Session:</strong> {enq.preferredTime}</p>
                    </div>
                    <p style={{ background: "rgba(15, 23, 42, 0.04)", padding: "12px", borderRadius: "6px", fontSize: "0.9rem", color: "var(--text-gray)", fontStyle: "italic" }}>
                      &ldquo;{enq.message}&rdquo;
                    </p>
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
                  <div key={idx} className="glass-card" style={{ display: "flex", justifyContent: "space-between", gap: "20px", alignItems: "flex-start" }}>
                    <div>
                      <h4 style={{ color: "var(--text-white)" }}>{t.name} <span style={{ fontSize: "0.8rem", color: "var(--accent-gold)", textTransform: "uppercase" }}>({t.badge})</span></h4>
                      <p style={{ fontSize: "0.85rem", color: "var(--text-gray)", margin: "4px 0 10px" }}>{t.team}</p>
                      <p style={{ fontSize: "0.85rem", fontStyle: "italic", borderLeft: "2px solid var(--accent-gold)", paddingLeft: "10px", color: "var(--text-gray)" }}>&ldquo;{t.quote}&rdquo;</p>
                    </div>
                    <button 
                      className="btn" 
                      onClick={() => handleDeleteTestimonial(idx)}
                      style={{ background: "rgba(239, 68, 68, 0.15)", color: "var(--error)", padding: "5px 12px", borderRadius: "6px", fontSize: "0.75rem" }}
                    >
                      Delete
                    </button>
                  </div>
                ))}
              </div>
            </div>
            {/* Add Form */}
            <div>
              <div className="glass-card" style={{ position: "sticky", top: "100px" }}>
                <h3 style={{ color: "var(--text-white)", marginBottom: "20px", fontFamily: "var(--font-heading)" }}>Add Testimonial</h3>
                <form onSubmit={handleAddTestimonial} className="contact-form">
                  <div className="form-group">
                    <label>Student Name</label>
                    <input 
                      type="text" 
                      required 
                      value={newTestimonial.name} 
                      onChange={(e) => setNewTestimonial({ ...newTestimonial, name: e.target.value })} 
                      placeholder="e.g. Virat Kohli" 
                    />
                  </div>
                  <div className="form-group">
                    <label>IPL Team or Association</label>
                    <input 
                      type="text" 
                      required 
                      value={newTestimonial.team} 
                      onChange={(e) => setNewTestimonial({ ...newTestimonial, team: e.target.value })} 
                      placeholder="e.g. Royal Challengers Bangalore" 
                    />
                  </div>
                  <div className="form-group">
                    <label>Badge Category</label>
                    <input 
                      type="text" 
                      required 
                      value={newTestimonial.badge} 
                      onChange={(e) => setNewTestimonial({ ...newTestimonial, badge: e.target.value })} 
                      placeholder="e.g. IPL / State" 
                    />
                  </div>
                  <div className="form-group">
                    <label>Quote testimonial</label>
                    <textarea 
                      required 
                      value={newTestimonial.quote} 
                      onChange={(e) => setNewTestimonial({ ...newTestimonial, quote: e.target.value })} 
                      placeholder="Provide their comments..." 
                    />
                  </div>
                  <button type="submit" className="btn btn-primary" style={{ width: "100%", justifyContent: "center" }}>
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
                  <div key={idx} className="glass-card" style={{ padding: "10px", display: "flex", flexDirection: "column", height: "100%" }}>
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
              <div className="glass-card" style={{ position: "sticky", top: "100px" }}>
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
                      placeholder="e.g. Session on Turf Nets" 
                    />
                  </div>
                  <div className="form-group">
                    <label>Description</label>
                    <textarea 
                      required 
                      value={newGallery.desc} 
                      onChange={(e) => setNewGallery({ ...newGallery, desc: e.target.value })} 
                      placeholder="Brief caption describing the image..." 
                    />
                  </div>
                  <button type="submit" className="btn btn-primary" style={{ width: "100%", justifyContent: "center" }}>
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
                  <div key={blog.id} className="glass-card" style={{ padding: "25px" }}>
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
              <div className="glass-card" style={{ position: "sticky", top: "100px" }}>
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
                  <button type="submit" className="btn btn-primary" style={{ width: "100%", justifyContent: "center" }}>
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
