"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";

// Static Data
const pillars = [
  {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
    title: "Batting 360° Development",
    desc: "Developing all-direction stroke-making ability with conceptual awareness, tactical mastery, and technical refinement."
  },
  {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
      </svg>
    ),
    title: "Fast Bowling Weaponry",
    desc: "Wicket-taking tactical weaponry sharpening, run stopping, field setting, and situational adaptability skill development."
  },
  {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    title: "Fielding Excellence",
    desc: "Building athletic, agile, and intelligent fielders who take pride, create direct-hit impacts, and change match outcomes."
  },
  {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.364l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
      </svg>
    ),
    title: "Match Temperament",
    desc: "Preparing players to stay calm, focused, and courageous under high-pressure scenarios, fostering strong self-belief."
  },
  {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    ),
    title: "Winning Strategy & Team",
    desc: "Creating smart, analytical game plans, fostering trust, unit clarity, and collaboration to build championship team spirits."
  },
  {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
      </svg>
    ),
    title: "Cricket Culture",
    desc: "Instilling discipline, extreme professionalism, mutual respect, and a continuous growth mindset for long-term athletic success."
  }
];

const achievements = {
  coach: [
    { num: "01", title: "MCL Dubai 2016 Runner-up", desc: "Served as coach to the 'Brian Lara' led 'Leo Lions' International T-20 team in the Dubai Masters Champions League." },
    { num: "02", title: "Head Coach Mizoram First-Class", desc: "Head Coach for Mizoram Senior First-Class Team leading them to historical performance peaks in 2024-25." },
    { num: "03", title: "Head Coach Tripura Ranji Women", desc: "Led Tripura First-Class Senior Women's Team to qualify for BCCI Knockouts in 2023-24." },
    { num: "04", title: "India's Youngest Chief Ranji Coach", desc: "Appointed as Tripura State Cricket Chief Coach in 2009-10, making him India's youngest First-class state head coach." },
    { num: "05", title: "Historical Ranji Knockouts", desc: "Tripura Ranji team qualified for knockouts (Plate group semi-final) for the first time in 24 years of their history." },
    { num: "06", title: "Historic Bengal Win", desc: "Led Tripura Ranji One-Day team to defeat a star-studded Bengal Team filled with IPL and national players (2010)." },
    { num: "07", title: "MSPL Championship", desc: "Guided team to the Championship of Maharashtra State Premier League in 2010." },
    { num: "08", title: "Goa State Junior Team Coach", desc: "As Head Coach of Goa State Junior Team, defeated bigger state associations like Tamilnadu, Andhra, and Kerala (2011-12)." },
    { num: "09", title: "Mumbai U-16 NCA Selections", desc: "Head Coach for Mumbai Under-16 Team; secured a record-breaking 10 player selections for BCCI-NCA in a single season." }
  ],
  player: [
    { num: "01", title: "Ranji Trophy Career", desc: "Represented premier state teams including Mumbai, Goa, Tripura, and Maharashtra in the prestigious Ranji Trophy." },
    { num: "02", title: "Duleep Trophy Representative", desc: "Selected and represented the South Zone division in the Duleep Trophy matches." },
    { num: "03", title: "Deodhar Trophy Selection", desc: "Represented South Zone division in the elite Deodhar Trophy tournament." },
    { num: "04", title: "MRF Pace Foundation Alumnus", desc: "Trained under elite conditions as a fast bowler at the world-renowned MRF Pace Foundation." },
    { num: "05", title: "Inter-University Representative", desc: "Represented Dr. Babasaheb Ambedkar Marathwada University in national tournaments." }
  ]
};

const legends = [
  { name: "Dennis Lillee", role: "Australian Fast Bowling Legend", desc: "Worked alongside the former Head Coach of MRF Pace Foundation and legendary Australian fast bowler." },
  { name: "Frank Tyson", role: "England Test Cricketer & Coach Educator", desc: "Collaborated closely with the famous England pacer and master coach educator on modern training techniques." },
  { name: "Pravin Amre", role: "Indian Test Cricketer", desc: "Worked alongside the former Indian test batsman and Delhi Capitals IPL Head Coach." },
  { name: "Lalchand Rajput", role: "Indian Test Cricketer & Coach", desc: "Collaborated on team strategies and training drills with the former Indian opener and current UAE Head Coach." },
  { name: "Jeff Thomson", role: "Australian Pace Icon", desc: "Cooperated in fast bowling development at the MCA-IDBI Pace Foundation with the feared speedster." },
  { name: "Chandrakant Pandit", role: "Indian Test Cricketer & KKR Coach", desc: "Collaborated on domestic talent development with the veteran Indian wicketkeeper and IPL winning coach." }
];

const students = [
  { name: "Ayush Mhatre", team: "Chennai Super Kings (CSK)", badge: "IPL / Domestic", quote: "Under Coach Dahad's batting refinement structures, my situational awareness and shot selections reached IPL standard." },
  { name: "Suryansh Shedge", team: "India National / IPL Pool", badge: "India", quote: "His fast-paced batting drills and match-temperament development gave me the edge to perform at the highest national levels." },
  { name: "Suyash Prabhudessai", team: "Royal Challengers Bangalore (RCB)", badge: "IPL / State", quote: "The customized 360-degree stroke development plan and athletic training prepared me perfectly for high-intensity IPL matches." },
  { name: "Abhigyan Kundu", team: "India U-19 Representative", badge: "India U-19", quote: "Coach Sandeep's mentorship helped me structure my red-ball game and secure my place in the India Under-19 national squad." },
  { name: "Sushant Modani", team: "USA National Cricket Team", badge: "USA National", quote: "His international coaching exposure and focus on batting fundamentals helped me adjust to international conditions seamlessly." },
  { name: "Heena Hotchandani", team: "UAE Women's National Team", badge: "UAE National", quote: "The bowling weaponry and field setting analysis provided by Coach Sandeep has significantly improved my wickets tally." },
  { name: "Akshay Darekar", team: "India A representative", badge: "India A", quote: "His strategic intelligence and advice on spinner match-up tactics helped me earn my India A call-up." },
  { name: "Shashank Attarde", team: "Mumbai Ranji Trophy", badge: "Ranji Trophy", quote: "Dahad sir's emphasis on team chemistry, game plans, and personal discipline changed my perspective on domestic cricket." }
];

const certificates = [
  {
    id: "bcci",
    title: "BCCI Level-3 Coach Certificate",
    authority: "Board of Control for Cricket in India",
    desc: "The highest coaching credential in Indian Cricket. Conducted at the National Cricket Academy (NCA), Bangalore in 2005. Signed by NCA Director Brijesh Patel and BCCI Secretary S.K. Nair. Qualifies the recipient to coach all State and National level squads.",
    year: "2005",
    type: "Level III Elite"
  },
  {
    id: "ecb",
    title: "ECB Level-1 Coach Certificate",
    authority: "England and Wales Cricket Board",
    desc: "Coaching certification awarded in association with Hertfordshire Cricket Board, United Kingdom in 2004. Certifies competency in developing cricket from playground to test arena.",
    year: "2004",
    type: "Level I International"
  },
  {
    id: "omtex",
    title: "Jonty's Way Fielding Coach Certificate",
    authority: "Omtex Sports Academy & Jonty Rhodes",
    desc: "Specialist certificate in advanced fielding training methodologies, completed under the direct personal guidance and instruction of Jonty Rhodes, the world's greatest fielder, at Bombay Gymkhana.",
    year: "2011",
    type: "Fielding Specialisation"
  }
];

const countries = [
  { name: "India", flag: "🇮🇳" },
  { name: "Sri Lanka", flag: "🇱🇰" },
  { name: "Nepal", flag: "🇳🇵" },
  { name: "UAE", flag: "🇦🇪" },
  { name: "USA", flag: "🇺🇸" },
  { name: "United Kingdom", flag: "🇬🇧" },
  { name: "West Indies", flag: "🌴" },
  { name: "Qatar", flag: "🇶🇦" },
  { name: "Oman", flag: "🇴🇲" },
  { name: "Kuwait", flag: "🇰🇼" }
];

const coachingPrograms = [
  {
    title: "Group Coaching",
    tag: "Ages 8 and Above",
    price: "Enquire for Batches",
    features: [
      "Rigorous batch training with low coach-to-student ratio",
      "Regular net practice sessions and target bowling drills",
      "Friendly inter-academy matches and tournament exposure",
      "Basic physical conditioning and sportsmanship guidance"
    ]
  },
  {
    title: "Private Coaching",
    tag: "Personalised 1-on-1 Focus",
    price: "Custom Scheduling",
    features: [
      "Exclusive 1-on-1 attention with Coach Sandeep Dahad",
      "High-speed video analysis for batting stance & bowling actions",
      "Customised skill development plan catering to weaknesses",
      "Flexible schedule coordination at premium facilities"
    ]
  },
  {
    title: "Cricket Consultation",
    tag: "Institutions & Academies",
    price: "Corporate Consultation",
    features: [
      "Curriculum layout design for schools, colleges & clubs",
      "High-performance workshop programs for local coaches",
      "Infrastructure planning and net layout installations",
      "Talent scouting methodologies and academy setup support"
    ]
  },
  {
    title: "High Performance Program",
    tag: "Professional & Aspiring Elite",
    price: "By Selection Only",
    features: [
      "Advanced 5-tier High Performance Framework implementation",
      "Mental toughness conditioning & situational simulations",
      "Tactical preparation for Ranji, IPL, and national trials",
      "Elite fitness profiling, diet charts, and recovery tracking"
    ]
  }
];

export default function Home() {
  const [activeTab, setActiveTab] = useState<"coach" | "player">("coach");
  const [activeModalCert, setActiveModalCert] = useState<typeof certificates[0] | null>(null);
  const [bookingService, setBookingService] = useState("Group Coaching");
  
  // Dynamic content states
  const [studentsList, setStudentsList] = useState(students);
  const [galleryList, setGalleryList] = useState([
    {
      src: "/assets/coach_nets.jpg",
      alt: "Batting coaching net session",
      title: "Indoor Practice Nets",
      desc: "Providing rigorous batting drill practice in fully-controlled indoor setups."
    },
    {
      src: "/assets/cricket_match.jpg",
      alt: "Outdoor cricket match",
      title: "Open Field Tournaments",
      desc: "Participating and coaching players during real match situation simulations."
    }
  ]);

  // Instagram states
  const [instaFeed, setInstaFeed] = useState<any[]>([]);
  const [instaTab, setInstaTab] = useState<"all" | "post" | "reel" | "avatar">("all");

  // Form Tab Switcher
  const [formTab, setFormTab] = useState<"booking" | "contact">("booking");

  // Form Submission Success Modal
  const [formSuccess, setFormSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  // Load dynamic content from API
  useEffect(() => {
    async function loadDynamicContent() {
      try {
        const res = await fetch("/api/content");
        const json = await res.json();
        if (json.success) {
          if (json.students && json.students.length > 0) setStudentsList(json.students);
          if (json.gallery && json.gallery.length > 0) setGalleryList(json.gallery);
          if (json.instagram && json.instagram.length > 0) setInstaFeed(json.instagram);
        }
      } catch (err) {
        console.error("Failed to load dynamic content:", err);
      }
    }
    loadDynamicContent();
  }, []);

  // Counters State
  const [yearsExp, setYearsExp] = useState(0);
  const [playersTrained, setPlayersTrained] = useState(0);
  const [nationsCoached, setNationsCoached] = useState(0);
  const [teamsCoached, setTeamsCoached] = useState(0);

  // Form State
  const [formData, setFormData] = useState({
    name: "",
    age: "",
    gender: "",
    mobile: "",
    email: "",
    city: "",
    level: "Beginner",
    preferredDate: "",
    preferredTime: "",
    message: ""
  });

  const carouselRef = useRef<HTMLDivElement>(null);

  // Intersection Observer for Scroll Reveal
  useEffect(() => {
    const reveals = document.querySelectorAll(".reveal");
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("active");
          }
        });
      },
      { threshold: 0.15 }
    );

    reveals.forEach((reveal) => observer.observe(reveal));
    return () => observer.disconnect();
  }, []);

  // Stats Counter Animation
  useEffect(() => {
    const handleScrollForStats = () => {
      const statsSection = document.getElementById("home");
      if (!statsSection) return;

      const rect = statsSection.getBoundingClientRect();
      const inView = rect.top < window.innerHeight && rect.bottom >= 0;

      if (inView) {
        // Trigger counting
        const duration = 1500;
        const steps = 30;
        const stepTime = duration / steps;

        let currentStep = 0;
        const interval = setInterval(() => {
          currentStep++;
          setYearsExp(Math.min(20, Math.floor((20 / steps) * currentStep)));
          setPlayersTrained(Math.min(1000, Math.floor((1000 / steps) * currentStep)));
          setNationsCoached(Math.min(10, Math.floor((10 / steps) * currentStep)));
          setTeamsCoached(Math.min(6, Math.floor((6 / steps) * currentStep)));

          if (currentStep >= steps) {
            clearInterval(interval);
            setYearsExp(20);
            setPlayersTrained(1000);
            setNationsCoached(10);
            setTeamsCoached(6);
          }
        }, stepTime);

        window.removeEventListener("scroll", handleScrollForStats);
      }
    };

    window.addEventListener("scroll", handleScrollForStats);
    // Initial check
    handleScrollForStats();
    return () => window.removeEventListener("scroll", handleScrollForStats);
  }, []);

  // Carousel Navigation
  const scrollCarousel = (direction: "left" | "right") => {
    if (carouselRef.current) {
      const cardWidth = carouselRef.current.firstElementChild
        ? (carouselRef.current.firstElementChild as HTMLElement).offsetWidth + 25
        : 300;
      const scrollAmount = direction === "left" ? -cardWidth : cardWidth;
      carouselRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  // Form Change Handler
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  // Form Submit (WhatsApp click to chat + API email call + Confirmation Modal)
  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    let waMessage = "";
    let confMessage = "";

    if (formTab === "booking") {
      waMessage = `*NEW BOOKING ENQUIRY - SANDEEP DAHAD CRICKET FOUNDATION*\n` +
        `-----------------------------------------\n` +
        `*Name:* ${formData.name}\n` +
        `*Age:* ${formData.age} Years\n` +
        (formData.gender ? `*Gender:* ${formData.gender}\n` : "") +
        `*Mobile:* ${formData.mobile}\n` +
        `*Email:* ${formData.email}\n` +
        `*City:* ${formData.city}\n` +
        `*Service Required:* ${bookingService}\n` +
        `*Playing Level:* ${formData.level}\n` +
        `*Preferred Date:* ${formData.preferredDate}\n` +
        `*Preferred Time:* ${formData.preferredTime}\n` +
        `*Message:* ${formData.message}`;
        
      confMessage = "Thank you for your enquiry.\nOur team has successfully received your request.\nWe will contact you within 24 hours to discuss your coaching requirements.";
    } else {
      waMessage = `*NEW GENERAL ENQUIRY - SANDEEP DAHAD CRICKET FOUNDATION*\n` +
        `-----------------------------------------\n` +
        `*Name:* ${formData.name}\n` +
        `*Mobile:* ${formData.mobile}\n` +
        `*Email:* ${formData.email}\n` +
        `*City:* ${formData.city}\n` +
        `*Enquiry Type:* ${bookingService}\n` +
        `*Message:* ${formData.message}`;
        
      confMessage = "Thank you for your enquiry.\nOur team has received your request and will contact you shortly.";
    }

    const encodedMessage = encodeURIComponent(waMessage);
    const waUrl = `https://wa.me/919136357333?text=${encodedMessage}`;

    // 2. Attempt API call
    try {
      await fetch("/api/enquire", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          ...formData, 
          service: bookingService,
          formType: formTab
        })
      });
    } catch (err) {
      console.error("API submission failed: ", err);
    }

    // Set success modal states
    setSuccessMessage(confMessage);
    setFormSuccess(true);

    // 3. Open WhatsApp link
    window.open(waUrl, "_blank");
  };

  const handleSelectProgramAndScroll = (progTitle: string) => {
    setFormTab("booking");
    setBookingService(progTitle);
    const contactEl = document.getElementById("contact");
    if (contactEl) {
      contactEl.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleSelectContactAndScroll = (enquiryType: string = "General Contact") => {
    setFormTab("contact");
    setBookingService(enquiryType);
    const contactEl = document.getElementById("contact");
    if (contactEl) {
      contactEl.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <>
      <Header />

      {/* Hero Section */}
      <section id="home" className="hero">
        <div className="container hero-grid">
          <div className="hero-content">
            <div className="hero-badge-container">
              <span className="hero-badge">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" viewBox="0 0 24 24" style={{ marginRight: "4px" }}>
                  <path d="M12 2L2 22h20L12 2zm0 3.99L19.53 19H4.47L12 5.99zM13 16h-2v2h2v-2zm0-6h-2v4h2v-4z" />
                </svg>
                Level-3 Certified Coach
              </span>
              <span className="hero-badge" style={{ borderColor: "rgba(239, 68, 68, 0.4)", color: "#EF4444", background: "rgba(239, 68, 68, 0.1)" }}>
                BCCI NCA Faculty
              </span>
            </div>
            <h1>
              <span className="brand-title">Saandip Dahaad Cricket Foundation</span>
              <span>Transforming Talent</span>
              <span>Into Charged Performance</span>
            </h1>
            <p className="lead">
              Elite guidance for aspiring cricketers, coaches, and sports institutes. Receive world-class training under Sandeep Dahad, one of India&apos;s most highly accredited coaches.
            </p>
            <div className="hero-ctas" style={{ display: "flex", flexWrap: "wrap", gap: "12px", marginTop: "25px" }}>
              <button onClick={() => handleSelectProgramAndScroll("Private Coaching")} className="btn btn-cta-red">Book Private Coaching</button>
              <button onClick={() => handleSelectProgramAndScroll("Group Coaching")} className="btn btn-cta-red">Join Group Coaching</button>
              <button onClick={() => handleSelectProgramAndScroll("Cricket Consultation")} className="btn btn-cta-red">Book Cricket Consultation</button>
            </div>

            <div className="hero-stats">
              <div className="stat-item">
                <div className="stat-number">{yearsExp}+</div>
                <div className="stat-label">Years Coaching</div>
              </div>
              <div className="stat-item">
                <div className="stat-number">{playersTrained}+</div>
                <div className="stat-label">Players Trained</div>
              </div>
              <div className="stat-item">
                <div className="stat-number">{nationsCoached}+</div>
                <div className="stat-label">Nations Available</div>
              </div>
              <div className="stat-item">
                <div className="stat-number">{teamsCoached}+</div>
                <div className="stat-label">First-Class Teams</div>
              </div>
            </div>
          </div>

          <div className="hero-image-wrapper">
            <div className="hero-image-glow"></div>
            <div className="hero-image">
              <Image 
                src="/assets/sandeep_img.jpg" 
                alt="Coach Sandeep Dahad" 
                width={390} 
                height={512}
                priority
                style={{ objectFit: "cover", width: "100%", height: "auto" }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* About/Executive Profile Section */}
      <section id="about" className="about reveal">
        <div className="container">
          <div className="section-header">
            <h2>Executive Profile</h2>
            <p>Meet our Founder & Head Coach, Sandeep Dahad</p>
          </div>

          <div className="about-grid" style={{ marginTop: "40px" }}>
            <div className="about-image-card">
              <div className="about-image-frame">
                <Image 
                  src="/assets/coach_nets.jpg" 
                  alt="Sandeep Dahad coaching in nets" 
                  width={500} 
                  height={400}
                  style={{ width: "100%", height: "auto" }}
                />
              </div>
              <div className="about-quote">
                <p>&ldquo;Great players are developed through preparation, discipline, resilience, and belief.&rdquo;</p>
                <span>- Sandeep Dahad</span>
              </div>
            </div>

            <div className="about-text">
              <h3>BCCI & Cricket Australia JV <span>Level-3 Cricket Coach</span></h3>
              <p style={{ color: "var(--text-gray)", marginBottom: "25px", fontSize: "1.05rem" }}>
                Sandeep Dahad is a highly distinguished former First-Class cricketer and national level coach. He brings an unparalleled wealth of over 20+ years of high-performance cricket exposure. As a batting and fast bowling specialist, he has successfully coached elite state teams, guided Ranji squads, and served as faculty at the BCCI&apos;s National Cricket Academy.
              </p>

              <div className="snapshot-grid">
                <div className="snapshot-item">
                  <div className="snapshot-icon">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                    </svg>
                  </div>
                  <div className="snapshot-info">
                    <h4>BCCI NCA Faculty</h4>
                    <p>Former teaching faculty at the Board of Control for Cricket in India&apos;s National Cricket Academy.</p>
                  </div>
                </div>

                <div className="snapshot-item">
                  <div className="snapshot-icon">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <div className="snapshot-info">
                    <h4>First-Class Cricketer</h4>
                    <p>Played Ranji Trophy cricket representing Mumbai, Goa, Tripura, and Maharashtra.</p>
                  </div>
                </div>

                <div className="snapshot-item">
                  <div className="snapshot-icon">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 9.172V5L8 4z" />
                    </svg>
                  </div>
                  <div className="snapshot-info">
                    <h4>High Performance Coach</h4>
                    <p>Engineered comprehensive technical blueprints and structures to groom domestic state players.</p>
                  </div>
                </div>

                <div className="snapshot-item">
                  <div className="snapshot-icon">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 002 2h2a2.5 2.5 0 002.5-2.5V14a2 2 0 012-2h.055M11 20.055V18a2 2 0 00-2-2h-.5a2 2 0 01-2-2v-1.5a2.5 2.5 0 00-2.5-2.5H4" />
                    </svg>
                  </div>
                  <div className="snapshot-info">
                    <h4>Global Footprint</h4>
                    <p>Accredited to coach across ten cricket playing nations including UK, USA, West Indies, and UAE.</p>
                  </div>
                </div>
              </div>

              <div className="associations-container">
                <h4>COACHING ASSOCIATIONS</h4>
                <div className="associations-list">
                  <span className="assoc-tag">Mumbai Cricket Association</span>
                  <span className="assoc-tag">Goa Cricket Association</span>
                  <span className="assoc-tag">Tripura Cricket Association</span>
                  <span className="assoc-tag">Mizoram Cricket Association</span>
                  <span className="assoc-tag">National Cricket Academy (BCCI)</span>
                  <span className="assoc-tag">Masters Champions League (Dubai)</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Coaching Philosophy & Pillars Section */}
      <section id="philosophy" className="pillars reveal">
        <div className="container">
          <div className="section-header">
            <h2>Coaching Pillars</h2>
            <p>Our foundational coaching systems targeting complete player transformation</p>
          </div>

          <div className="pillars-grid" style={{ marginTop: "40px" }}>
            {pillars.map((p, idx) => (
              <div key={idx} className="glass-card pillar-card">
                <div className="pillar-icon-box">{p.icon}</div>
                <h3>{p.title}</h3>
                <p>{p.desc}</p>
              </div>
            ))}
          </div>

          {/* High Performance Framework (Pyramid) */}
          <div className="framework-section" style={{ marginTop: "80px" }}>
            <div className="framework-content">
              <h3 style={{ fontFamily: "var(--font-heading)" }}>High Performance <span>Framework</span></h3>
              <p style={{ lineHeight: "1.7", color: "var(--text-gray)", fontSize: "0.95rem" }}>
                Our holistic approach targets the systematic progress of a player. By climbing through the structured tiers of elite training, we address core mechanical faults, build game intelligence, and prepare cricketers to perform and dominate in big match situations.
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: "15px", marginTop: "20px" }}>
                <div style={{ display: "flex", gap: "10px", alignItems: "flex-start" }}>
                  <span style={{ color: "var(--accent-gold)", fontWeight: "bold" }}>➔</span>
                  <p style={{ fontSize: "0.9rem", color: "var(--text-white)" }}><strong>Technical Development:</strong> Refines stances, batting shots, and bowling releases.</p>
                </div>
                <div style={{ display: "flex", gap: "10px", alignItems: "flex-start" }}>
                  <span style={{ color: "var(--accent-gold)", fontWeight: "bold" }}>➔</span>
                  <p style={{ fontSize: "0.9rem", color: "var(--text-white)" }}><strong>Elite Game Intelligence:</strong> Develops match-readiness, field set analysis, and cricket IQ.</p>
                </div>
                <div style={{ display: "flex", gap: "10px", alignItems: "flex-start" }}>
                  <span style={{ color: "var(--accent-gold)", fontWeight: "bold" }}>➔</span>
                  <p style={{ fontSize: "0.9rem", color: "var(--text-white)" }}><strong>Match Situation Adaptability:</strong> Prepares players for tactical adjustments under pressure.</p>
                </div>
              </div>
            </div>

            <div className="pyramid-container">
              <div className="pyramid-level pyramid-level-1">TECHNICAL DEVELOPMENT</div>
              <div className="pyramid-level pyramid-level-2">ELITE GAME INTELLIGENCE</div>
              <div className="pyramid-level pyramid-level-3">MATCH SITUATION ADAPTABILITY</div>
              <div className="pyramid-level pyramid-level-4">MASTERFUL SKILL EXECUTION</div>
              <div className="pyramid-level pyramid-level-5">BIG MATCH WINNING ABILITY</div>
            </div>
          </div>
        </div>
      </section>

      {/* Achievements Section */}
      <section id="achievements" className="achievements reveal">
        <div className="container">
          <div className="section-header">
            <h2>Key Achievements</h2>
            <p>Proven track record representing teams as a player and mentoring champions as a head coach</p>
          </div>

          <div className="tabs-container">
            <button 
              className={`tab-btn ${activeTab === "coach" ? "active" : ""}`}
              onClick={() => setActiveTab("coach")}
            >
              Accomplishments as a Coach
            </button>
            <button 
              className={`tab-btn ${activeTab === "player" ? "active" : ""}`}
              onClick={() => setActiveTab("player")}
            >
              Achievements as a Player
            </button>
          </div>

          {/* Coach Achievements Panel */}
          <div className={`tab-panel ${activeTab === "coach" ? "active" : ""}`}>
            {achievements.coach.map((ach, idx) => (
              <div key={idx} className="glass-card achievement-card">
                <div className="achievement-num-box">{ach.num}</div>
                <div className="achievement-detail">
                  <h4>{ach.title}</h4>
                  <p>{ach.desc}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Player Achievements Panel */}
          <div className={`tab-panel ${activeTab === "player" ? "active" : ""}`}>
            {achievements.player.map((ach, idx) => (
              <div key={idx} className="glass-card achievement-card">
                <div className="achievement-num-box">{ach.num}</div>
                <div className="achievement-detail">
                  <h4>{ach.title}</h4>
                  <p>{ach.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Coaching Legends Section */}
      <section id="legends" className="legends reveal">
        <div className="container">
          <div className="section-header">
            <h2>Coaching Legends</h2>
            <p>Sandeep Dahad has collaborated and worked closely alongside world-class masters</p>
          </div>

          <div className="carousel-outer" style={{ marginTop: "40px" }}>
            <div className="carousel-container" ref={carouselRef}>
              {legends.map((leg, idx) => (
                <div key={idx} className="glass-card legend-card">
                  <div className="legend-image-box">
                    <div style={{ display: "flex", width: "100%", height: "100%", background: "var(--primary-light)", justifyContent: "center", alignItems: "center" }}>
                      <span style={{ color: "var(--accent-gold)", fontWeight: "bold", fontSize: "1.2rem" }}>
                        {leg.name.split(" ").map(n => n[0]).join("")}
                      </span>
                    </div>
                  </div>
                  <h3>{leg.name}</h3>
                  <span>{leg.role}</span>
                  <p>{leg.desc}</p>
                </div>
              ))}
            </div>

            <div className="carousel-controls">
              <button className="carousel-btn" onClick={() => scrollCarousel("left")} aria-label="Slide Left">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button className="carousel-btn" onClick={() => scrollCarousel("right")} aria-label="Slide Right">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Top Cricketers (Students Grid) */}
      <section id="students" className="students reveal">
        <div className="container">
          <div className="section-header">
            <h2>Top Cricketers Mentored</h2>
            <p>Elite domestic and international players trained under Coach Dahad</p>
          </div>

          <div className="students-grid" style={{ marginTop: "40px" }}>
            {studentsList.map((student, idx) => (
              <div key={idx} className="glass-card student-card">
                <div className="student-photo-wrapper">
                  <div style={{ display: "flex", width: "100%", height: "100%", background: "var(--primary-dark)", justifyContent: "center", alignItems: "center" }}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="60" height="60" fill="none" viewBox="0 0 24 24" stroke="currentColor" style={{ color: "var(--primary-light)" }}>
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <span className="student-badge">{student.badge}</span>
                </div>
                <div className="student-info">
                  <h4>{student.name}</h4>
                  <p className="association">{student.team}</p>
                  <p className="student-quote">&ldquo;{student.quote}&rdquo;</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Certifications & Attainments */}
      <section id="certifications" className="certifications reveal">
        <div className="container">
          <div className="section-header">
            <h2>Certifications & Attainments</h2>
            <p>Accredited by major cricket boards globally. Click on cards to view verification details.</p>
          </div>

          <div className="certs-grid" style={{ marginTop: "40px" }}>
            {certificates.map((cert) => (
              <div 
                key={cert.id} 
                className="glass-card cert-card"
                onClick={() => setActiveModalCert(cert)}
              >
                <div className="cert-image-preview">
                  <div style={{ display: "flex", width: "100%", height: "100%", background: "rgba(15, 23, 42, 0.03)", justifyContent: "center", alignItems: "center", minHeight: "180px" }}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" fill="none" viewBox="0 0 24 24" stroke="currentColor" style={{ color: "var(--accent-gold)" }}>
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                  </div>
                  <div className="cert-zoom-overlay">
                    <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                </div>
                <div className="cert-info">
                  <h3>{cert.title}</h3>
                  <p>{cert.authority}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Certificate Modal */}
      {activeModalCert && (
        <div className="modal-overlay open" onClick={() => setActiveModalCert(null)}>
          <div className="modal-container" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close-btn" onClick={() => setActiveModalCert(null)}>
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <div className="modal-content-split">
              <div className="modal-cert-image">
                <div style={{ display: "flex", width: "100%", height: "100%", background: "var(--primary-navy)", justifyContent: "center", alignItems: "center", minHeight: "350px", padding: "40px" }}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" fill="none" viewBox="0 0 24 24" stroke="currentColor" style={{ color: "var(--accent-gold)" }}>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
              </div>
              <div className="modal-cert-details">
                <h2>{activeModalCert.title}</h2>
                <div className="cert-authority">{activeModalCert.authority}</div>
                <p>{activeModalCert.desc}</p>
                <div className="modal-meta-list">
                  <div className="modal-meta-item">
                    <span>Year Attained</span>
                    <span>{activeModalCert.year}</span>
                  </div>
                  <div className="modal-meta-item">
                    <span>Classification</span>
                    <span>{activeModalCert.type}</span>
                  </div>
                  <div className="modal-meta-item">
                    <span>Verification</span>
                    <span style={{ color: "var(--success)" }}>Verified ✓</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Countries Available to Coach Marquee */}
      <section className="map-section">
        <div className="container">
          <h3 style={{ textTransform: "uppercase", fontSize: "1rem", letterSpacing: "0.05em", color: "var(--text-gray)", textAlign: "center", marginBottom: "25px", fontFamily: "var(--font-heading)" }}>
            Countries Available for On-Site Camps & Consultations
          </h3>
          <div className="marquee-container">
            <div className="marquee-content">
              {/* Double arrays for infinite scroll marquee trick */}
              {[...countries, ...countries].map((country, idx) => (
                <div key={idx} className="marquee-item">
                  <span style={{ fontSize: "1.4rem" }}>{country.flag}</span>
                  <span>{country.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Coaching Programs Grid Section */}
      <section id="programs" className="reveal" style={{ background: "var(--primary-navy)" }}>
        <div className="container">
          <div className="section-header">
            <h2>Coaching Programs</h2>
            <p>Custom training pathways designed to groom cricketers of all skill levels</p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "30px", marginTop: "40px" }}>
            {coachingPrograms.map((prog, idx) => (
              <div key={idx} className="glass-card" style={{ display: "flex", flexDirection: "column", height: "100%", border: "1px solid rgba(255,255,255,0.05)" }}>
                <span style={{ fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.05em", color: "var(--accent-gold)", fontWeight: "600", display: "block", marginBottom: "5px" }}>
                  {prog.tag}
                </span>
                <h3 style={{ fontSize: "1.4rem", color: "var(--text-white)", marginBottom: "15px", fontFamily: "var(--font-heading)" }}>
                  {prog.title}
                </h3>
                <ul style={{ display: "flex", flexDirection: "column", gap: "10px", padding: 0, margin: "0 0 30px 0", flexGrow: 1 }}>
                  {prog.features.map((feat, fIdx) => (
                    <li key={fIdx} style={{ fontSize: "0.85rem", color: "var(--text-gray)", display: "flex", gap: "8px", alignItems: "flex-start" }}>
                      <span style={{ color: "var(--accent-gold)" }}>✓</span>
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
                <button 
                  className="btn btn-cta-red" 
                  style={{ width: "100%", marginTop: "auto" }}
                  onClick={() => handleSelectProgramAndScroll(prog.title)}
                >
                  Enquire Now
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Instagram Feed Section */}
      <section id="instagram" className="reveal" style={{ background: "var(--primary-navy)" }}>
        <div className="container">
          <div className="section-header">
            <h2>Instagram Feed</h2>
            <p>Follow <a href="https://www.instagram.com/sandeepbdahad/?hl=en" target="_blank" rel="noopener noreferrer" style={{ color: "var(--accent-gold)", fontWeight: "600" }}>@sandeepbdahad</a> for recent net sessions, reels, and coaching updates.</p>
          </div>

          {/* Instagram Tab Selector */}
          <div className="tabs-container" style={{ justifyContent: "center", marginBottom: "30px" }}>
            <button className={`tab-btn ${instaTab === "all" ? "active" : ""}`} onClick={() => setInstaTab("all")}>All Feed</button>
            <button className={`tab-btn ${instaTab === "post" ? "active" : ""}`} onClick={() => setInstaTab("post")}>Posts</button>
            <button className={`tab-btn ${instaTab === "reel" ? "active" : ""}`} onClick={() => setInstaTab("reel")}>Reels</button>
            <button className={`tab-btn ${instaTab === "avatar" ? "active" : ""}`} onClick={() => setInstaTab("avatar")}>Coach's Avatar</button>
          </div>

          {/* Feed Grid */}
          <div className="instagram-grid">
            {instaFeed
              .filter(item => instaTab === "all" || item.type === instaTab)
              .map((item) => (
                <div key={item.id} className="instagram-card" onClick={() => window.open("https://www.instagram.com/sandeepbdahad/?hl=en", "_blank")}>
                  {/* Badge indicating type */}
                  <div className="insta-type-badge">
                    {item.type === "reel" && (
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M16 16c0 1.104-.896 2-2 2h-4c-1.104 0-2-.896-2-2v-4c0-1.104.896-2 2-2h4c1.104 0 2 .896 2 2v4zm8-10v12c0 3.309-2.691 6-6 6h-12c-3.309 0-6-2.691-6-6v-12c0-3.309 2.691-6 6-6h12c3.309 0 6 2.691 6 6zm-2 0c0-2.206-1.794-4-4-4h-12c-2.206 0-4 1.794-4 4v12c0 2.206 1.794 4 4 4h12c2.206 0 4-1.794 4-4v-12zm-6 5l-6 4v-8l6 4z"/>
                      </svg>
                    )}
                    {item.type === "post" && (
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M22 16V4a2 2 0 00-2-2H4a2 2 0 00-2 2v12a2 2 0 002 2h16a2 2 0 002-2zm-11-4l2.03 2.71L16 11l4 5H4l7-9z"/>
                      </svg>
                    )}
                    {item.type === "avatar" && (
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z"/>
                      </svg>
                    )}
                  </div>
                  <img src={item.image} alt={item.caption} />
                  <div className="instagram-card-overlay">
                    <p className="instagram-card-caption">{item.caption}</p>
                    <div className="instagram-card-stats">
                      <span>♥ {item.likes}</span>
                      <span>💬 {item.comments}</span>
                    </div>
                    <span style={{ display: "block", color: "var(--text-gray)", fontSize: "0.75rem", marginTop: "10px" }}>{item.date}</span>
                  </div>
                </div>
              ))}
          </div>

          <div className="insta-follow-row">
            <a href="https://www.instagram.com/sandeepbdahad/?hl=en" target="_blank" rel="noopener noreferrer" className="btn insta-follow-btn">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 24 24" style={{ marginRight: "8px" }}>
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771-4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.051.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
              </svg>
              Follow on Instagram
            </a>
          </div>
        </div>
      </section>

      {/* Gallery Section */}
      <section id="gallery" className="reveal" style={{ background: "var(--primary-dark)" }}>
        <div className="container">
          <div className="section-header">
            <h2>Academy Gallery</h2>
            <p>Glimpses of daily practice schedules, matches, and interactive setups</p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(360px, 1fr))", gap: "30px", marginTop: "40px" }}>
            {galleryList.map((item, idx) => (
              <div key={idx} className="glass-card" style={{ padding: "10px", borderRadius: "12px", overflow: "hidden" }}>
                <div style={{ width: "100%", height: "360px", overflow: "hidden", borderRadius: "8px" }}>
                  <Image 
                    src={item.src} 
                    alt={item.alt} 
                    width={500} 
                    height={500} 
                    style={{ objectFit: "cover", width: "100%", height: "100%" }}
                  />
                </div>
                <h4 style={{ padding: "15px 10px 5px", color: "var(--text-white)" }}>{item.title}</h4>
                <p style={{ padding: "0 10px 10px", fontSize: "0.85rem", color: "var(--text-gray)" }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Booking Form and Contact Us */}
      <section id="contact" className="contact reveal">
        <div className="container contact-grid">
          <div className="contact-info-panel">
            <h3>Start Your Journey</h3>
            <p>
              Leave your details to request booking information for our academy sessions. We will coordinate schedule timings, location access, and custom plans.
            </p>

            <div className="contact-methods">
              <div className="contact-method-card">
                <div className="method-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.94.725l.548 2.2a1 1 0 01-.321.988l-1.305.98a10.582 10.582 0 004.872 4.872l.98-1.305a1 1 0 01.988-.321l2.2.548a1 1 0 01.725.94V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                </div>
                <div className="method-info">
                  <h4>WhatsApp Enquiry</h4>
                  <p>+91 91363 57333</p>
                </div>
              </div>

              <div className="contact-method-card">
                <div className="method-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <div className="method-info">
                  <h4>Primary Email</h4>
                  <p>sdcricketfoundation@gmail.com</p>
                </div>
              </div>
            </div>

            <div className="social-links-row">
              <h4>Follow Our Channels</h4>
              <div className="social-icons">
                <a href="https://www.instagram.com/sandeepbdahad/?hl=en" target="_blank" rel="noopener noreferrer" className="social-icon-btn" aria-label="Instagram">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.051.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
                  </svg>
                </a>
                <a href="https://www.facebook.com/sandeep.dahad.3/" target="_blank" rel="noopener noreferrer" className="social-icon-btn" aria-label="Facebook">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                </a>
              </div>
            </div>
          </div>

          <div className="glass-card" style={{ padding: "40px" }}>
            {/* Form Tabs */}
            <div className="form-tab-container">
              <button 
                type="button" 
                className={`form-tab-btn ${formTab === "booking" ? "active" : ""}`}
                onClick={() => {
                  setFormTab("booking");
                  if (["General Contact", "Coaching Enquiry", "Consultation Enquiry"].includes(bookingService)) {
                    setBookingService("Group Coaching");
                  }
                }}
              >
                Booking Form
              </button>
              <button 
                type="button" 
                className={`form-tab-btn ${formTab === "contact" ? "active" : ""}`}
                onClick={() => {
                  setFormTab("contact");
                  setBookingService("General Contact");
                }}
              >
                Contact Form
              </button>
            </div>

            <form className="contact-form" onSubmit={handleFormSubmit}>
              {/* Row 1 */}
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="name">Full Name</label>
                  <input type="text" id="name" name="name" required placeholder="Enter full name" value={formData.name} onChange={handleInputChange} />
                </div>
                {formTab === "booking" ? (
                  <div className="form-group">
                    <label htmlFor="age">Age</label>
                    <input type="number" id="age" name="age" required placeholder="Enter age" value={formData.age} onChange={handleInputChange} />
                  </div>
                ) : (
                  <div className="form-group">
                    <label htmlFor="mobile">Mobile Number</label>
                    <input type="tel" id="mobile" name="mobile" required placeholder="WhatsApp number" value={formData.mobile} onChange={handleInputChange} />
                  </div>
                )}
              </div>

              {/* Row 2 */}
              <div className="form-row">
                {formTab === "booking" ? (
                  <>
                    <div className="form-group">
                      <label htmlFor="gender">Gender (Optional)</label>
                      <select id="gender" name="gender" value={formData.gender} onChange={handleInputChange}>
                        <option value="">Select Gender</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Prefer not to say">Prefer not to say</option>
                      </select>
                    </div>
                    <div className="form-group">
                      <label htmlFor="mobile">Mobile Number</label>
                      <input type="tel" id="mobile" name="mobile" required placeholder="WhatsApp number" value={formData.mobile} onChange={handleInputChange} />
                    </div>
                  </>
                ) : (
                  <>
                    <div className="form-group">
                      <label htmlFor="email">Email Address</label>
                      <input type="email" id="email" name="email" required placeholder="Your email address" value={formData.email} onChange={handleInputChange} />
                    </div>
                    <div className="form-group">
                      <label htmlFor="city">City</label>
                      <input type="text" id="city" name="city" required placeholder="e.g. Mumbai" value={formData.city} onChange={handleInputChange} />
                    </div>
                  </>
                )}
              </div>

              {/* Row 3 */}
              <div className="form-row">
                {formTab === "booking" ? (
                  <>
                    <div className="form-group">
                      <label htmlFor="email">Email Address</label>
                      <input type="email" id="email" name="email" required placeholder="Your email address" value={formData.email} onChange={handleInputChange} />
                    </div>
                    <div className="form-group">
                      <label htmlFor="city">City</label>
                      <input type="text" id="city" name="city" required placeholder="e.g. Mumbai" value={formData.city} onChange={handleInputChange} />
                    </div>
                  </>
                ) : (
                  <div className="form-group">
                    <label htmlFor="service">Enquiry Type</label>
                    <select id="service" name="service" value={bookingService} onChange={(e) => setBookingService(e.target.value)}>
                      <option value="General Contact">General Contact</option>
                      <option value="Coaching Enquiry">Coaching Enquiry</option>
                      <option value="Consultation Enquiry">Consultation Enquiry</option>
                    </select>
                  </div>
                )}
              </div>

              {/* Row 4 (Booking-only fields) */}
              {formTab === "booking" && (
                <>
                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="level">Playing Level</label>
                      <select id="level" name="level" value={formData.level} onChange={handleInputChange}>
                        <option value="Beginner">Beginner (Recreational)</option>
                        <option value="Intermediate">Intermediate (School/Club)</option>
                        <option value="Advanced">Advanced (First-class/District)</option>
                      </select>
                    </div>
                    <div className="form-group">
                      <label htmlFor="service">Service Required</label>
                      <select id="service" name="service" value={bookingService} onChange={(e) => setBookingService(e.target.value)}>
                        <option value="Group Coaching">Group Coaching</option>
                        <option value="Private Coaching">Private Coaching</option>
                        <option value="Cricket Consultation">Cricket Consultation</option>
                        <option value="High Performance Program">High Performance Program</option>
                      </select>
                    </div>
                  </div>
                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="preferredDate">Preferred Date</label>
                      <input type="date" id="preferredDate" name="preferredDate" required value={formData.preferredDate} onChange={handleInputChange} />
                    </div>
                    <div className="form-group">
                      <label htmlFor="preferredTime">Preferred Time</label>
                      <input type="text" id="preferredTime" name="preferredTime" required placeholder="e.g. Saturdays 4:00 PM" value={formData.preferredTime} onChange={handleInputChange} />
                    </div>
                  </div>
                </>
              )}

              <div className="form-group">
                <label htmlFor="message">Message</label>
                <textarea id="message" name="message" required placeholder="Describe your experience or requests..." value={formData.message} onChange={handleInputChange}></textarea>
              </div>

              <button type="submit" className="btn btn-cta-red" style={{ width: "100%", justifyContent: "center" }}>
                Confirm & Submit via WhatsApp
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* Confirmation Success Modal */}
      {formSuccess && (
        <div className="modal-overlay open" onClick={() => setFormSuccess(false)}>
          <div className="modal-container" onClick={(e) => e.stopPropagation()} style={{ maxWidth: "450px", padding: "30px", textAlign: "center" }}>
            <button className="modal-close-btn" onClick={() => setFormSuccess(false)}>
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <div style={{ color: "var(--success)", fontSize: "3rem", marginBottom: "15px" }}>✓</div>
            <h3 style={{ fontSize: "1.5rem", marginBottom: "15px", color: "var(--text-white)", fontFamily: "var(--font-heading)" }}>Enquiry Received!</h3>
            <p style={{ fontSize: "0.95rem", color: "var(--text-gray)", lineHeight: "1.6", whiteSpace: "pre-line", marginBottom: "20px" }}>
              {successMessage}
            </p>
            <button className="btn btn-cta-red" style={{ width: "100%" }} onClick={() => setFormSuccess(false)}>
              Close
            </button>
          </div>
        </div>
      )}

      <Footer />
      <WhatsAppButton />
    </>
  );
}
