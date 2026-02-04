import React, { useState, useEffect, useRef } from 'react';
import { Github, Linkedin, Mail, Code, Award, Briefcase, GraduationCap, ChevronDown, Terminal, Sparkles, Zap, Trophy, Star, ArrowRight, Send, Eye, BookOpen, TrendingUp, Download, Calendar, Clock, Search, X, Share2, Heart, CheckCircle } from 'lucide-react';
import { blogPosts } from '../data/blogPosts';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const Portfolio = () => {
  const [activeSection, setActiveSection] = useState('hero');
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isLoaded, setIsLoaded] = useState(false);
  const [skillsHovered, setSkillsHovered] = useState(null);
  const [contactForm, setContactForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [contactStatus, setContactStatus] = useState({ type: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [stats, setStats] = useState({ totalVisitors: 0, projectViews: [] });
  const [selectedProject, setSelectedProject] = useState(null);
  const [blogFilter, setBlogFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterStatus, setNewsletterStatus] = useState('');
  const [theme, setTheme] = useState('warm'); // 'warm' or 'cool'
  const [selectedBlogPost, setSelectedBlogPost] = useState(null);
  const observerRef = useRef(null);

  useEffect(() => {
    setIsLoaded(true);
    trackVisitor();
    fetchStats();
    
    const handleMouseMove = (e) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth - 0.5) * 20,
        y: (e.clientY / window.innerHeight - 0.5) * 20
      });
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate-in');
            setActiveSection(entry.target.id);
          }
        });
      },
      { threshold: 0.2 }
    );
    
    document.querySelectorAll('section[id]').forEach((section) => {
      observerRef.current.observe(section);
    });
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, []);

  const trackVisitor = async () => {
    try {
      await fetch(`${API_URL}/track/visitor`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          page: window.location.pathname,
          referrer: document.referrer
        })
      });
    } catch (error) {
      console.error('Tracking error:', error);
    }
  };

  const trackProjectView = async (projectName) => {
    try {
      const response = await fetch(`${API_URL}/track/project/${projectName}`, {
        method: 'POST'
      });
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Project tracking error:', error);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await fetch(`${API_URL}/analytics`);
      const data = await response.json();
      if (data.success) {
        setStats({
          totalVisitors: data.analytics.totalVisitors,
          projectViews: data.analytics.projectViews
        });
      }
    } catch (error) {
      console.error('Stats fetch error:', error);
    }
  };

  const handleContactSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setContactStatus({ type: '', message: '' });

    try {
      const response = await fetch(`${API_URL}/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(contactForm)
      });

      const data = await response.json();

      if (data.success) {
        setContactStatus({ type: 'success', message: data.message });
        setContactForm({ name: '', email: '', subject: '', message: '' });
      } else {
        setContactStatus({ type: 'error', message: data.message });
      }
    } catch (error) {
      setContactStatus({ type: 'error', message: 'Failed to send message. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleNewsletterSubmit = async (e) => {
    e.preventDefault();
    setNewsletterStatus('Subscribing...');
    
    try {
      const response = await fetch(`${API_URL}/newsletter/subscribe`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: newsletterEmail }),
      });

      const data = await response.json();

      if (response.ok) {
        setNewsletterStatus('✓ ' + data.message);
        setNewsletterEmail('');
        setTimeout(() => setNewsletterStatus(''), 5000);
      } else {
        setNewsletterStatus('✗ ' + data.message);
        setTimeout(() => setNewsletterStatus(''), 5000);
      }
    } catch (error) {
      console.error('Newsletter error:', error);
      setNewsletterStatus('✗ Failed to subscribe. Please try again.');
      setTimeout(() => setNewsletterStatus(''), 5000);
    }
  };

  const handleInputChange = (e) => {
    setContactForm({
      ...contactForm,
      [e.target.name]: e.target.value
    });
  };

  const downloadResume = () => {
    // Create a simple resume download link
    const resumeUrl = '/Sakshi_Maan_Resume.pdf';
    const link = document.createElement('a');
    link.href = resumeUrl;
    link.download = 'Sakshi_Maan_Resume.pdf';
    link.click();
  };

  const projects = [
    {
      title: "NextStepAI",
      period: "Feb 2026 – Present",
      tech: ["React.js", "Node.js", "Express.js", "PostgreSQL", "XGBoost", "Gemini Pro", "GitHub API", "LeetCode API"],
      highlights: [
        "AI-powered Career Copilot with personalized trajectory planning using XGBoost and Gemini Pro",
        "XGBoost classification with 92% accuracy for role-based skill recommendations",
        "Gemini Pro generates personalized milestones and learning paths",
        "GitHub & LeetCode integration for real-time skill assessment and progress tracking",
        "DAG-based roadmaps with 85% user-reported improvement in goal clarity",
        "PostgreSQL schema optimized for complex career trajectory queries"
      ],
      gradient: "from-purple-500 via-pink-500 to-rose-500",
      icon: <Sparkles className="w-6 h-6" />,
      id: "nextstepai",
      category: "AI & Career Tech",
      github: "https://github.com/SakshiiKiet/NEXTSTEPAI",
      caseStudy: {
        problem: "Students and early-career professionals struggle to create personalized career roadmaps due to information overload and lack of tailored guidance. Generic advice doesn't account for individual skill levels, interests, or learning pace.",
        solution: "Built NextStepAI, an AI-powered Career Copilot that uses machine learning (XGBoost) to classify user profiles and Gemini Pro to generate personalized career milestones. Integrated GitHub and LeetCode APIs for real-time skill assessment, creating dynamic DAG-based roadmaps that adapt to user progress.",
        impact: "92% classification accuracy for role recommendations, 85% user-reported improvement in goal clarity, 70% reduction in decision paralysis through structured milestone planning.",
        technologies: "React.js for responsive UI, Node.js/Express for API orchestration, PostgreSQL for relational data storage, XGBoost for role classification, Gemini Pro for content generation, GitHub/LeetCode APIs for skill tracking.",
        challenges: "Balancing ML model accuracy with inference speed, handling API rate limits for real-time updates, designing scalable DAG structures for diverse career paths, ensuring recommendations remain relevant across rapidly changing tech landscape.",
        outcomes: "Successfully deployed with 100+ beta users, average session time of 25 minutes, 4.6/5 user satisfaction rating, positive feedback on personalization quality and actionable milestone breakdowns."
      }
    },
    {
      title: "Civic Platform",
      period: "Apr 2025 – May 2025",
      tech: ["React.js", "Node.js", "Express.js", "MongoDB", "GPT-4"],
      highlights: [
        "AI-driven platform for one-click civic campaign creation using GPT-4",
        "Reduced setup time by 70% with automated campaign generation",
        "45% improvement in campaign participation through map-based discovery",
        "4-tier trust model cutting duplicate/fake campaigns by 60%",
        "90% task success rate in usability testing with 15+ participants"
      ],
      gradient: "from-orange-500 via-coral-500 to-amber-500",
      icon: <Sparkles className="w-6 h-6" />,
      id: "civic-platform",
      category: "AI & Civic Tech",
      github: "https://github.com/SakshiiKiet/Civic-Platform",
      caseStudy: {
        problem: "Citizens struggle to organize civic campaigns due to complex processes and lack of digital tools. Traditional campaign setup requires extensive time, resources, and technical knowledge, creating barriers to community engagement.",
        solution: "Built an AI-powered platform that generates complete campaign materials from a single photo using GPT-4. Implemented map-based discovery for local campaigns, trust scoring system to verify authenticity, and automated content generation for posters, descriptions, and social media posts.",
        impact: "70% reduction in campaign setup time, 45% increase in participation rates, 60% decrease in fake/duplicate campaigns through trust verification, democratized civic engagement for non-technical users.",
        technologies: "React.js for dynamic UI with map integration, Node.js/Express backend for API orchestration, MongoDB for campaign data persistence, GPT-4 for intelligent content generation, location-based services for discovery.",
        challenges: "Trust verification without compromising privacy, content moderation at scale, preventing misuse while maintaining accessibility, balancing AI automation with human oversight, ensuring real-time performance for concurrent campaigns.",
        outcomes: "Successfully validated with 15+ users in field testing, 90% task success rate in usability studies, positive feedback from civic leaders and community organizers, featured in local government innovation showcase."
      }
    },
    {
      title: "DevScope",
      period: "Dec 2024 – Feb 2025",
      tech: ["React.js", "Node.js", "Express.js", "Supabase", "Recharts", "OpenAI", "GitHub GraphQL API"],
      highlights: [
        "GitHub-powered portfolio builder with OAuth2 integration",
        "Real-time activity graphs via GraphQL API",
        "GPT-4 generated resumes reducing profile creation by 65%",
        "50+ developers onboarded during closed beta",
        "85% user satisfaction with ease of use and quality"
      ],
      gradient: "from-teal-500 via-emerald-500 to-cyan-500",
      icon: <Code className="w-6 h-6" />,
      id: "devscope",
      category: "Developer Tools",
      github: "https://github.com/SakshiiKiet/DevScope",
      caseStudy: {
        problem: "Developers spend hours creating and maintaining portfolios instead of coding. Traditional portfolio sites require manual updates, lack integration with developer activity, and don't showcase real-time technical growth.",
        solution: "Automated portfolio generation using GitHub data and AI-powered content creation. Built OAuth2 integration for seamless GitHub authentication, GraphQL API for real-time activity fetching, and OpenAI for professional resume/bio generation. Recharts visualizes contribution patterns and skill progression.",
        impact: "65% time savings in portfolio creation, 50+ developers onboarded during beta, 85% satisfaction rate, eliminated need for manual portfolio updates through automated GitHub sync.",
        technologies: "GitHub GraphQL API for comprehensive data fetching, OpenAI GPT-4 for content generation, Recharts for interactive visualizations, Supabase for authentication and data storage, React.js for responsive UI.",
        challenges: "API rate limiting with GitHub's aggressive throttling, OAuth flow complexity for secure authentication, real-time data synchronization across multiple data sources, generating contextual content from raw commit/PR data, handling diverse GitHub profiles (students to senior devs).",
        outcomes: "Successful beta launch with organic growth, high user satisfaction and retention, featured in developer communities and Reddit threads, consistently positive feedback on automation quality and time savings, established as go-to tool for junior developers."
      }
    }
  ];

  const experience = {
    role: "Curation and Documentation Team Member",
    company: "TEDx KIET, KIET Group of Institutions",
    period: "Nov 2023 – Jan 2024",
    achievements: [
      "Curated speaker profiles for 300+ attendees event",
      "Streamlined 15+ communication workflows",
      "Managed 5+ core teams, reducing delays by 30%",
      "Improved prep efficiency by 20%",
      "Introduced version-controlled documentation"
    ]
  };

  const skills = {
    languages: ["Java", "C", "JavaScript", "HTML", "CSS"],
    frameworks: ["React.js", "Node.js", "Express.js", "Mongoose.js", "Tailwind CSS"],
    databases: ["MongoDB", "MySQL", "PostgreSQL"],
    tools: ["Git", "Supabase", "GitHub", "DigiLocker API", "OpenAI API"],
    concepts: ["DSA", "Operating Systems", "DBMS", "OOPS (in JAVA)"]
  };

  const achievements = [
    { icon: <Trophy className="w-5 h-5" />, text: "LeetCode max rating: 1464", highlight: "300+ problems solved" },
    { icon: <Star className="w-5 h-5" />, text: "4th place in DevNexus 2025", highlight: "Inter-college hackathon" },
    { icon: <Star className="w-5 h-5" />, text: "Winner of INNOTECH", highlight: "Department Level" },
    { icon: <Star className="w-5 h-5" />, text: "Hackemon Finalist, Galgotia", highlight: "Top 10/500+ teams" }
  ];

  const certifications = [
    { name: "Database Programming with SQL - English", issuer: "Oracle Database Academy", year: "2025" },
    { name: "NoSQL Course Training - MongoDB Developer", issuer: "Infosys Springboard", year: "2025" },
    { name: "Database Application Development Training", issuer: "Infosys Springboard", year: "2025" },
    { name: "Artificial Intelligence", issuer: "Infosys Springboard", year: "2024" },
    { name: "Cybersecurity Foundation", issuer: "Palo Alto Networks", year: "2025" }
  ];

  const getProjectViews = (projectId) => {
    const project = stats.projectViews.find(p => p.projectName === projectId);
    return project ? project.views : 0;
  };

  const filteredBlogs = blogPosts.filter(post => {
    const matchesCategory = blogFilter === 'all' || post.category === blogFilter;
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const categories = ['all', ...new Set(blogPosts.map(post => post.category))];

  return (
    <div className={`min-h-screen ${theme === 'warm' ? 'bg-gradient-to-br from-slate-950 via-orange-950/30 to-slate-950' : 'bg-gradient-to-br from-slate-950 via-blue-950/30 to-slate-950'} text-white overflow-x-hidden transition-colors duration-700`}>
      {/* Animated background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div 
          className={`absolute w-[600px] h-[600px] ${theme === 'warm' ? 'bg-orange-500/20' : 'bg-blue-600/20'} rounded-full blur-3xl`}
          style={{
            top: '10%',
            left: '10%',
            transform: `translate(${mousePosition.x}px, ${mousePosition.y}px)`,
            transition: 'transform 0.3s ease-out, background-color 0.7s ease'
          }}
        />
        <div 
          className={`absolute w-[600px] h-[600px] ${theme === 'warm' ? 'bg-teal-500/20' : 'bg-purple-600/20'} rounded-full blur-3xl`}
          style={{
            bottom: '10%',
            right: '10%',
            transform: `translate(${-mousePosition.x}px, ${-mousePosition.y}px)`,
            transition: 'transform 0.3s ease-out, background-color 0.7s ease'
          }}
        />
        <div 
          className={`absolute w-[400px] h-[400px] ${theme === 'warm' ? 'bg-amber-500/15' : 'bg-cyan-600/15'} rounded-full blur-3xl`}
          style={{
            top: '50%',
            left: '50%',
            transform: `translate(-50%, -50%)`,
            transition: 'background-color 0.7s ease'
          }}
        />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:100px_100px]" />
      </div>

      {/* Navigation */}
      <nav className={`fixed top-0 left-0 right-0 z-50 backdrop-blur-xl ${theme === 'warm' ? 'bg-slate-950/70 border-orange-500/10' : 'bg-slate-950/70 border-blue-500/10'} border-b transition-all duration-700 ${isLoaded ? 'translate-y-0' : '-translate-y-full'}`}>
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2 group cursor-pointer">
            <Terminal className={`w-6 h-6 ${theme === 'warm' ? 'text-coral-400' : 'text-blue-400'} group-hover:rotate-180 transition-transform duration-500`} />
            <span className={`text-xl font-bold bg-gradient-to-r ${theme === 'warm' ? 'from-coral-400 via-amber-400 to-teal-400' : 'from-blue-400 via-purple-400 to-cyan-400'} bg-clip-text text-transparent`}>
              Sakshi Maan
            </span>
          </div>
          
          <div className="hidden md:flex items-center gap-6">
            {['hero', 'projects', 'blog', 'experience', 'skills', 'contact'].map((section) => (
              <a
                key={section}
                href={`#${section}`}
                className={`text-sm font-medium transition-all duration-300 ${theme === 'warm' ? 'hover:text-coral-400' : 'hover:text-blue-400'} relative group ${
                  activeSection === section ? (theme === 'warm' ? 'text-coral-400' : 'text-blue-400') : 'text-slate-400'
                }`}
              >
                {section.charAt(0).toUpperCase() + section.slice(1)}
                <span className={`absolute -bottom-1 left-0 h-0.5 bg-gradient-to-r ${theme === 'warm' ? 'from-coral-400 to-teal-400' : 'from-blue-400 to-cyan-400'} transition-all duration-300 ${
                  activeSection === section ? 'w-full' : 'w-0 group-hover:w-full'
                }`} />
              </a>
            ))}
          </div>
          
          <div className="flex items-center gap-4">
            <button
              onClick={() => setTheme(theme === 'warm' ? 'cool' : 'warm')}
              className="px-4 py-2 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 transition-all duration-300 text-sm font-medium flex items-center gap-2"
              title="Toggle theme"
            >
              <Sparkles className="w-4 h-4" />
              {theme === 'warm' ? 'Cool' : 'Warm'}
            </button>
            <button
              onClick={downloadResume}
              className={`hidden md:flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r ${theme === 'warm' ? 'from-orange-600/20 to-teal-600/20 border-coral-400/30 hover:border-coral-400/50' : 'from-blue-600/20 to-purple-600/20 border-blue-400/30 hover:border-blue-400/50'} border transition-all duration-300 text-sm font-medium`}
            >
              <Download className="w-4 h-4" />
              Resume
            </button>
            <a href="https://github.com/SakshiiKiet" target="_blank" rel="noopener noreferrer" 
               className={`${theme === 'warm' ? 'hover:text-coral-400' : 'hover:text-blue-400'} transition-colors duration-300`}>
              <Github className="w-5 h-5" />
            </a>
            <a href="https://www.linkedin.com/in/sakshii-maan/" target="_blank" rel="noopener noreferrer"
               className={`${theme === 'warm' ? 'hover:text-teal-400' : 'hover:text-cyan-400'} transition-colors duration-300`}>
              <Linkedin className="w-5 h-5" />
            </a>
            <a href="mailto:sakshiatkiet@gmail.com"
               className={`${theme === 'warm' ? 'hover:text-amber-400' : 'hover:text-purple-400'} transition-colors duration-300`}>
              <Mail className="w-5 h-5" />
            </a>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section id="hero" className="min-h-screen flex items-center justify-center relative pt-20 px-6">
        <div className={`max-w-5xl text-center transition-all duration-1000 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className="inline-block mb-6">
            <div className={`px-4 py-2 rounded-full bg-gradient-to-r ${theme === 'warm' ? 'from-orange-600/20 to-teal-600/20 border-coral-400/30' : 'from-blue-600/20 to-purple-600/20 border-blue-400/30'} border backdrop-blur-sm`}>
              <span className={`text-sm font-medium bg-gradient-to-r ${theme === 'warm' ? 'from-coral-400 to-teal-400' : 'from-blue-400 to-cyan-400'} bg-clip-text text-transparent flex items-center gap-2`}>
                <Zap className={`w-4 h-4 ${theme === 'warm' ? 'text-coral-400' : 'text-blue-400'}`} />
                Full-Stack Developer & AI Enthusiast
              </span>
            </div>
          </div>
          
          <h1 className="text-7xl md:text-8xl font-black mb-6 leading-none">
            <span className={`inline-block animate-gradient bg-gradient-to-r ${theme === 'warm' ? 'from-coral-400 via-amber-400 to-teal-400' : 'from-blue-400 via-purple-400 to-cyan-400'} bg-clip-text text-transparent bg-300% hover:scale-105 transition-transform duration-300`}>
              Sakshi Maan
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl text-slate-300 mb-4 max-w-3xl mx-auto leading-relaxed font-light">
            Building intelligent, impactful solutions at the intersection of{' '}
            <span className={`${theme === 'warm' ? 'text-coral-400' : 'text-blue-400'} font-semibold`}>AI</span>,{' '}
            <span className={`${theme === 'warm' ? 'text-teal-400' : 'text-cyan-400'} font-semibold`}>full-stack development</span>, and{' '}
            <span className={`${theme === 'warm' ? 'text-amber-400' : 'text-purple-400'} font-semibold`}>civic technology</span>
          </p>
          
          <div className="flex items-center justify-center gap-4 mb-8">
            <div className="flex items-center gap-2 text-slate-400">
              <GraduationCap className="w-5 h-5" />
              <span>KIET Group of Institutions</span>
            </div>
            <div className="w-1.5 h-1.5 rounded-full bg-slate-600" />
            <div className="flex items-center gap-2 text-slate-400">
              <Code className="w-5 h-5" />
              <span>B.Tech CS '27</span>
            </div>
          </div>

          {/* Live Stats */}
          <div className="flex items-center justify-center gap-6 mb-12">
            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 backdrop-blur-sm border border-white/10">
              <Eye className={`w-4 h-4 ${theme === 'warm' ? 'text-coral-400' : 'text-blue-400'}`} />
              <span className="text-sm font-semibold">{stats.totalVisitors.toLocaleString()}</span>
              <span className="text-xs text-slate-400">visitors</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 backdrop-blur-sm border border-white/10">
              <BookOpen className={`w-4 h-4 ${theme === 'warm' ? 'text-teal-400' : 'text-cyan-400'}`} />
              <span className="text-sm font-semibold">{blogPosts.length}</span>
              <span className="text-xs text-slate-400">articles</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 backdrop-blur-sm border border-white/10">
              <TrendingUp className={`w-4 h-4 ${theme === 'warm' ? 'text-amber-400' : 'text-purple-400'}`} />
              <span className="text-sm font-semibold">2</span>
              <span className="text-xs text-slate-400">projects</span>
            </div>
          </div>
          
          <div className="flex items-center justify-center gap-4">
            <a href="#projects" className={`group px-8 py-4 bg-gradient-to-r ${theme === 'warm' ? 'from-orange-500 to-coral-500 hover:shadow-orange-500/50' : 'from-blue-600 to-purple-600 hover:shadow-blue-500/50'} rounded-full font-semibold hover:shadow-lg transition-all duration-300 flex items-center gap-2 hover:scale-105`}>
              View Projects
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
            </a>
            <a href="#contact" className="px-8 py-4 bg-white/5 backdrop-blur-sm rounded-full font-semibold hover:bg-white/10 transition-all duration-300 border border-white/10 hover:scale-105">
              Get in Touch
            </a>
          </div>
        </div>
        
        <a href="#projects" className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce">
          <ChevronDown className={`w-8 h-8 ${theme === 'warm' ? 'text-coral-400' : 'text-blue-400'}`} />
        </a>
      </section>

      {/* Projects Section with Case Studies */}
      <section id="projects" className="min-h-screen py-32 px-6 relative">
        <div className="max-w-7xl mx-auto">
          <div className="mb-16 opacity-0 section-animate">
            <h2 className="text-5xl md:text-6xl font-black mb-4">
              Featured <span className={`bg-gradient-to-r ${theme === 'warm' ? 'from-coral-400 to-teal-400' : 'from-blue-400 to-cyan-400'} bg-clip-text text-transparent`}>Projects</span>
            </h2>
            <p className="text-xl text-slate-400">Building the future, one commit at a time</p>
          </div>
          
          <div className="grid gap-8">
            {projects.map((project, index) => (
              <div 
                key={index}
                className="opacity-0 section-animate group"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className={`relative p-8 md:p-10 rounded-3xl ${theme === 'warm' ? 'bg-gradient-to-br from-slate-900/80 via-orange-900/10 to-slate-800/80' : 'bg-gradient-to-br from-slate-900/80 via-blue-900/10 to-slate-800/80'} backdrop-blur-xl border border-white/5 hover:border-white/10 transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl`}>
                  <div className={`absolute inset-0 rounded-3xl bg-gradient-to-br ${project.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-500`} />
                  
                  <div className="relative z-10">
                    <div className="flex items-start justify-between mb-6">
                      <div className="flex items-center gap-4">
                        <div className={`p-3 rounded-2xl bg-gradient-to-br ${project.gradient}`}>
                          {project.icon}
                        </div>
                        <div>
                          <h3 className="text-3xl font-bold mb-1">{project.title}</h3>
                          <p className="text-slate-400">{project.period}</p>
                          <span className="text-sm text-violet-400 font-medium">{project.category}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10">
                          <Eye className="w-4 h-4 text-coral-400" />
                          <span className="text-sm font-semibold">{getProjectViews(project.id)}</span>
                        </div>
                        {project.github && (
                          <a
                            href={project.github}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 transition-all duration-300 text-sm font-medium"
                          >
                            <Github className="w-4 h-4" />
                            <span>GitHub</span>
                          </a>
                        )}
                        <button
                          onClick={() => {
                            setSelectedProject(selectedProject === index ? null : index);
                            trackProjectView(project.id);
                          }}
                          className="px-4 py-2 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 transition-all duration-300 text-sm font-medium"
                        >
                          {selectedProject === index ? 'Hide' : 'Case Study'}
                        </button>
                      </div>
                    </div>
                    
                    <div className="flex flex-wrap gap-2 mb-6">
                      {project.tech.map((tech, i) => (
                        <span key={i} className="px-3 py-1.5 text-sm rounded-full bg-white/5 text-slate-300 border border-white/10">
                          {tech}
                        </span>
                      ))}
                    </div>
                    
                    <div className="grid gap-3 mb-6">
                      {project.highlights.map((highlight, i) => (
                        <div key={i} className="flex items-start gap-3 group/item">
                          <div className={`w-1.5 h-1.5 rounded-full bg-gradient-to-r ${project.gradient} mt-2 group-hover/item:scale-150 transition-transform duration-300`} />
                          <p className="text-slate-300 leading-relaxed group-hover/item:text-white transition-colors duration-300">
                            {highlight}
                          </p>
                        </div>
                      ))}
                    </div>

                    {/* Case Study Expandable Section */}
                    {selectedProject === index && (
                      <div className="mt-8 pt-8 border-t border-white/10 animate-fadeIn">
                        <h4 className="text-2xl font-bold mb-6 bg-gradient-to-r from-coral-400 to-teal-400 bg-clip-text text-transparent">
                          Case Study Deep Dive
                        </h4>
                        
                        <div className="grid md:grid-cols-2 gap-6">
                          <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
                            <h5 className="text-lg font-bold mb-3 text-coral-400">Problem Statement</h5>
                            <p className="text-slate-300 leading-relaxed">{project.caseStudy.problem}</p>
                          </div>
                          
                          <div className={`p-6 rounded-2xl ${theme === 'warm' ? 'bg-teal-500/5' : 'bg-cyan-500/5'} border border-white/10`}>
                            <h5 className="text-lg font-bold mb-3 text-teal-400">Solution Approach</h5>
                            <p className="text-slate-300 leading-relaxed">{project.caseStudy.solution}</p>
                          </div>
                          
                          <div className={`p-6 rounded-2xl ${theme === 'warm' ? 'bg-amber-500/5' : 'bg-purple-500/5'} border border-white/10`}>
                            <h5 className="text-lg font-bold mb-3 text-amber-400">Impact & Results</h5>
                            <p className="text-slate-300 leading-relaxed">{project.caseStudy.impact}</p>
                          </div>
                          
                          <div className={`p-6 rounded-2xl ${theme === 'warm' ? 'bg-orange-500/5' : 'bg-blue-500/5'} border border-white/10`}>
                            <h5 className="text-lg font-bold mb-3 text-orange-400">Technologies Used</h5>
                            <p className="text-slate-300 leading-relaxed">{project.caseStudy.technologies}</p>
                          </div>
                          
                          <div className={`p-6 rounded-2xl ${theme === 'warm' ? 'bg-emerald-500/5' : 'bg-indigo-500/5'} border border-white/10`}>
                            <h5 className="text-lg font-bold mb-3 text-emerald-400">Challenges Overcome</h5>
                            <p className="text-slate-300 leading-relaxed">{project.caseStudy.challenges}</p>
                          </div>
                          
                          <div className={`p-6 rounded-2xl ${theme === 'warm' ? 'bg-rose-500/5' : 'bg-violet-500/5'} border border-white/10`}>
                            <h5 className="text-lg font-bold mb-3 text-rose-400">Key Outcomes</h5>
                            <p className="text-slate-300 leading-relaxed">{project.caseStudy.outcomes}</p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Blog Section */}
      <section id="blog" className="min-h-screen py-32 px-6 relative">
        <div className="max-w-7xl mx-auto">
          <div className="mb-16 opacity-0 section-animate">
            <h2 className="text-5xl md:text-6xl font-black mb-4">
              Latest <span className="bg-gradient-to-r from-teal-400 to-emerald-400 bg-clip-text text-transparent">Articles</span>
            </h2>
            <p className="text-xl text-slate-400">Thoughts on development, AI, and technology</p>
          </div>

          {/* Search and Filter */}
          <div className="mb-12 opacity-0 section-animate">
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search articles..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-cyan-400/50 focus:outline-none focus:ring-2 focus:ring-cyan-400/20 transition-all duration-300"
                />
              </div>
              
              <div className="flex gap-2 overflow-x-auto">
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => setBlogFilter(category)}
                    className={`px-4 py-3 rounded-xl font-medium whitespace-nowrap transition-all duration-300 ${
                      blogFilter === category
                        ? 'bg-gradient-to-r from-teal-500 to-emerald-500 text-white'
                        : 'bg-white/5 text-slate-300 hover:bg-white/10 border border-white/10'
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Blog Grid */}
          <div className="grid md:grid-cols-2 gap-8">
            {filteredBlogs.map((post, index) => (
              <div
                key={post.id}
                className="opacity-0 section-animate group cursor-pointer"
                style={{ animationDelay: `${index * 0.1}s` }}
                onClick={() => setSelectedBlogPost(post)}
              >
                <div className={`relative h-full p-6 rounded-3xl ${theme === 'warm' ? 'bg-gradient-to-br from-slate-900/80 via-orange-900/10 to-slate-800/80' : 'bg-gradient-to-br from-slate-900/80 via-blue-900/10 to-slate-800/80'} backdrop-blur-xl border border-white/5 hover:border-${theme === 'warm' ? 'teal' : 'cyan'}-400/30 transition-all duration-500 hover:scale-[1.02]`}>
                  {post.featured && (
                    <div className="absolute top-4 right-4 px-3 py-1 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 text-xs font-bold">
                      FEATURED
                    </div>
                  )}
                  
                  <div className="mb-4">
                    <div className="flex items-center gap-2 text-sm text-slate-400 mb-3">
                      <Calendar className="w-4 h-4" />
                      <span>{new Date(post.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
                      <span>•</span>
                      <Clock className="w-4 h-4" />
                      <span>{post.readTime}</span>
                    </div>
                    
                    <h3 className="text-2xl font-bold mb-3 group-hover:text-teal-400 transition-colors duration-300">
                      {post.title}
                    </h3>
                    
                    <p className="text-slate-300 leading-relaxed mb-4">
                      {post.excerpt}
                    </p>
                    
                    <div className="flex flex-wrap gap-2 mb-4">
                      {post.tags.map((tag, i) => (
                        <span key={i} className="px-3 py-1 rounded-full bg-teal-500/20 text-teal-400 text-xs font-medium border border-teal-400/30">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between pt-4 border-t border-white/10">
                    <span className="text-sm font-medium text-teal-400">{post.category}</span>
                    <button className="flex items-center gap-2 text-sm font-medium text-slate-300 hover:text-white transition-colors duration-300">
                      Read More
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredBlogs.length === 0 && (
            <div className="text-center py-20">
              <p className="text-xl text-slate-400">No articles found matching your criteria.</p>
            </div>
          )}

          {/* Newsletter Signup */}
          <div className="mt-20 opacity-0 section-animate">
            <div className={`p-10 rounded-3xl ${theme === 'warm' ? 'bg-gradient-to-br from-teal-500/20 via-orange-500/10 to-emerald-500/20' : 'bg-gradient-to-br from-blue-500/20 via-purple-500/10 to-cyan-500/20'} backdrop-blur-xl border ${theme === 'warm' ? 'border-teal-400/30' : 'border-blue-400/30'} transition-all duration-700`}>
              <div className="max-w-2xl mx-auto text-center">
                <h3 className="text-3xl font-bold mb-4">Stay Updated</h3>
                <p className="text-slate-300 mb-8">Get the latest articles and insights delivered to your inbox</p>
                
                <form onSubmit={handleNewsletterSubmit} className="flex gap-4">
                  <input
                    type="email"
                    value={newsletterEmail}
                    onChange={(e) => setNewsletterEmail(e.target.value)}
                    placeholder="your.email@example.com"
                    required
                    className="flex-1 px-6 py-4 rounded-xl bg-white/10 border border-white/20 focus:border-teal-400/50 focus:outline-none focus:ring-2 focus:ring-teal-400/20 transition-all duration-300"
                  />
                  <button
                    type="submit"
                    className="px-8 py-4 bg-gradient-to-r from-teal-500 to-emerald-500 rounded-xl font-semibold hover:shadow-lg hover:shadow-teal-500/50 transition-all duration-300 hover:scale-105"
                  >
                    Subscribe
                  </button>
                </form>
                
                {newsletterStatus && (
                  <p className="mt-4 text-sm text-teal-400">{newsletterStatus}</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Experience Section */}
      <section id="experience" className="min-h-screen py-32 px-6 relative">
        <div className="max-w-7xl mx-auto">
          <div className="mb-16 opacity-0 section-animate">
            <h2 className="text-5xl md:text-6xl font-black mb-4">
              Professional <span className="bg-gradient-to-r from-teal-400 to-emerald-400 bg-clip-text text-transparent">Experience</span>
            </h2>
            <p className="text-xl text-slate-400">Leadership and impact in action</p>
          </div>
          
          <div className="opacity-0 section-animate">
            <div className={`relative p-10 rounded-3xl ${theme === 'warm' ? 'bg-gradient-to-br from-slate-900/80 via-teal-900/10 to-slate-800/80' : 'bg-gradient-to-br from-slate-900/80 via-blue-900/10 to-slate-800/80'} backdrop-blur-xl border border-white/5 hover:border-${theme === 'warm' ? 'teal' : 'blue'}-400/30 transition-all duration-700 group`}>
              <div className={`absolute inset-0 rounded-3xl ${theme === 'warm' ? 'bg-gradient-to-br from-teal-500/10 to-emerald-500/10' : 'bg-gradient-to-br from-blue-500/10 to-purple-500/10'} opacity-0 group-hover:opacity-100 transition-opacity duration-700`} />
              
              <div className="relative z-10">
                <div className="flex items-center gap-4 mb-6">
                  <div className="p-3 rounded-2xl bg-gradient-to-br from-teal-500 to-emerald-500">
                    <Briefcase className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-3xl font-bold mb-1">{experience.role}</h3>
                    <p className="text-xl text-slate-400">{experience.company}</p>
                    <p className="text-slate-500 mt-1">{experience.period}</p>
                  </div>
                </div>
                
                <div className="grid gap-4 mt-8">
                  {experience.achievements.map((achievement, i) => (
                    <div key={i} className="flex items-start gap-3 group/item">
                      <CheckCircle className="w-5 h-5 text-teal-400 mt-1 group-hover/item:scale-110 transition-transform duration-300" />
                      <p className="text-slate-300 leading-relaxed group-hover/item:text-white transition-colors duration-300 text-lg">
                        {achievement}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Certifications */}
          <div className="mt-16 opacity-0 section-animate">
            <h3 className="text-3xl font-bold mb-8">Certifications & Learning</h3>
            <div className="grid md:grid-cols-2 gap-6">
              {certifications.map((cert, index) => (
                <div
                  key={index}
                  className="p-6 rounded-2xl bg-gradient-to-br from-slate-900/80 to-slate-800/80 backdrop-blur-xl border border-white/5 hover:border-teal-400/30 transition-all duration-300 group"
                >
                  <div className="flex items-start gap-4">
                    <div className="p-2 rounded-xl bg-teal-500/20 text-teal-400">
                      <Award className="w-5 h-5" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-bold text-lg mb-1 group-hover:text-teal-400 transition-colors duration-300">
                        {cert.name}
                      </h4>
                      <p className="text-slate-400 text-sm">{cert.issuer}</p>
                      <p className="text-slate-500 text-sm mt-1">{cert.year}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Skills Section */}
      <section id="skills" className="min-h-screen py-32 px-6 relative">
        <div className="max-w-7xl mx-auto">
          <div className="mb-16 opacity-0 section-animate">
            <h2 className="text-5xl md:text-6xl font-black mb-4">
              Technical <span className="bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text text-transparent">Arsenal</span>
            </h2>
            <p className="text-xl text-slate-400">Tools and technologies I work with</p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Object.entries(skills).map(([category, items], index) => (
              <div 
                key={category}
                className="opacity-0 section-animate"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div 
                  className="p-8 rounded-3xl bg-gradient-to-br from-slate-900/80 to-slate-800/80 backdrop-blur-xl border border-white/5 hover:border-amber-400/30 transition-all duration-500 h-full group cursor-pointer"
                  onMouseEnter={() => setSkillsHovered(category)}
                  onMouseLeave={() => setSkillsHovered(null)}
                >
                  <h3 className="text-2xl font-bold mb-6 capitalize bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text text-transparent">
                    {category}
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {items.map((item, i) => (
                      <span 
                        key={i}
                        className={`px-3 py-2 rounded-xl bg-white/5 text-slate-300 border border-white/10 transition-all duration-300 ${
                          skillsHovered === category ? 'bg-white/10 text-white scale-105' : ''
                        }`}
                        style={{ transitionDelay: `${i * 30}ms` }}
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Achievements */}
          <div className="mt-20 opacity-0 section-animate">
            <h3 className="text-4xl font-bold mb-8">
              Notable <span className="bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text text-transparent">Achievements</span>
            </h3>
            
            <div className="grid md:grid-cols-2 gap-6">
              {achievements.map((achievement, index) => (
                <div 
                  key={index}
                  className="group"
                >
                  <div className="p-8 rounded-3xl bg-gradient-to-br from-slate-900/80 to-slate-800/80 backdrop-blur-xl border border-white/5 hover:border-amber-400/30 transition-all duration-500 hover:scale-105">
                    <div className="flex items-start gap-4">
                      <div className="p-3 rounded-2xl bg-gradient-to-br from-amber-600 to-orange-600 group-hover:rotate-12 transition-transform duration-500">
                        {achievement.icon}
                      </div>
                      <div>
                        <p className="text-xl font-semibold mb-2 text-white">{achievement.text}</p>
                        <p className="text-slate-400 group-hover:text-amber-400 transition-colors duration-300">{achievement.highlight}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="min-h-screen py-32 px-6 relative">
        <div className="max-w-4xl mx-auto">
          <div className="mb-16 text-center opacity-0 section-animate">
            <h2 className="text-5xl md:text-6xl font-black mb-4">
              Get in <span className="bg-gradient-to-r from-coral-400 to-teal-400 bg-clip-text text-transparent">Touch</span>
            </h2>
            <p className="text-xl text-slate-400">Let's create something amazing together</p>
          </div>

          <div className="opacity-0 section-animate">
            <div className={`p-10 rounded-3xl ${theme === 'warm' ? 'bg-gradient-to-br from-slate-900/80 via-orange-900/10 to-slate-800/80' : 'bg-gradient-to-br from-slate-900/80 via-blue-900/10 to-slate-800/80'} backdrop-blur-xl border border-white/5 transition-all duration-700`}>
              <form onSubmit={handleContactSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold mb-2 text-slate-300">Name</label>
                    <input
                      type="text"
                      name="name"
                      value={contactForm.name}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-coral-400/50 focus:outline-none focus:ring-2 focus:ring-coral-400/20 transition-all duration-300"
                      placeholder="Your name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-2 text-slate-300">Email</label>
                    <input
                      type="email"
                      name="email"
                      value={contactForm.email}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-teal-400/50 focus:outline-none focus:ring-2 focus:ring-teal-400/20 transition-all duration-300"
                      placeholder="your.email@example.com"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2 text-slate-300">Subject</label>
                  <input
                    type="text"
                    name="subject"
                    value={contactForm.subject}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-amber-400/50 focus:outline-none focus:ring-2 focus:ring-amber-400/20 transition-all duration-300"
                    placeholder="What's this about?"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2 text-slate-300">Message</label>
                  <textarea
                    name="message"
                    value={contactForm.message}
                    onChange={handleInputChange}
                    required
                    rows="6"
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-coral-400/50 focus:outline-none focus:ring-2 focus:ring-coral-400/20 transition-all duration-300 resize-none"
                    placeholder="Tell me about your project or idea..."
                  />
                </div>

                {contactStatus.message && (
                  <div className={`p-4 rounded-xl ${
                    contactStatus.type === 'success' 
                      ? 'bg-green-500/10 border border-green-500/30 text-green-400' 
                      : 'bg-red-500/10 border border-red-500/30 text-red-400'
                  }`}>
                    {contactStatus.message}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`w-full group px-8 py-4 bg-gradient-to-r ${theme === 'warm' ? 'from-orange-500 to-coral-500 hover:shadow-orange-500/50' : 'from-blue-600 to-purple-600 hover:shadow-blue-500/50'} rounded-xl font-semibold hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-2 hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
                      Send Message
                    </>
                  )}
                </button>
              </form>

              <div className="mt-10 pt-10 border-t border-white/10">
                <div className="flex flex-col md:flex-row items-center justify-center gap-6">
                  <a href="mailto:sakshiatkiet@gmail.com" className="flex items-center gap-2 text-slate-300 hover:text-coral-400 transition-colors duration-300">
                    <Mail className="w-5 h-5" />
                    sakshiatkiet@gmail.com
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-white/5">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-2">
              <Terminal className="w-5 h-5 text-coral-400" />
              <span className="font-semibold">© 2025 Sakshi Maan</span>
            </div>
            
            <div className="flex items-center gap-6">
              <a href="https://github.com/SakshiiKiet" target="_blank" rel="noopener noreferrer" 
                 className="text-slate-400 hover:text-coral-400 transition-colors duration-300">
                GitHub
              </a>
              <a href="https://www.linkedin.com/in/sakshii-maan/" target="_blank" rel="noopener noreferrer"
                 className="text-slate-400 hover:text-teal-400 transition-colors duration-300">
                LinkedIn
              </a>
              <a href="https://leetcode.com/u/Sakshikiet/" target="_blank" rel="noopener noreferrer"
                 className="text-slate-400 hover:text-amber-400 transition-colors duration-300">
                LeetCode
              </a>
            </div>
            
            <p className="text-slate-400 text-sm">
              Built with ❤️ by Sakshi Maan
            </p>
          </div>
        </div>
      </footer>

      {/* Blog Post Modal */}
      {selectedBlogPost && (
        <div 
          className="fixed inset-0 z-50 flex items-start justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto"
          onClick={() => setSelectedBlogPost(null)}
        >
          <div 
            className={`relative w-full max-w-4xl my-8 ${theme === 'warm' ? 'bg-gradient-to-br from-slate-900 via-orange-900/20 to-slate-800' : 'bg-gradient-to-br from-slate-900 via-blue-900/20 to-slate-800'} rounded-3xl shadow-2xl border border-white/10 transition-colors duration-700`}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button */}
            <button
              onClick={() => setSelectedBlogPost(null)}
              className="absolute top-6 right-6 p-2 rounded-full bg-white/10 hover:bg-white/20 transition-all duration-300 z-10"
            >
              <X className="w-6 h-6" />
            </button>

            {/* Header Image */}
            <div className="relative h-80 overflow-hidden rounded-t-3xl">
              <img
                src={selectedBlogPost.heroImage}
                alt={selectedBlogPost.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900 to-transparent" />
              
              {/* Title overlay */}
              <div className="absolute bottom-0 left-0 right-0 p-8">
                <div className="flex items-center gap-2 text-sm text-slate-300 mb-3">
                  <Calendar className="w-4 h-4" />
                  <span>{new Date(selectedBlogPost.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
                  <span>•</span>
                  <Clock className="w-4 h-4" />
                  <span>{selectedBlogPost.readTime}</span>
                </div>
                <h1 className="text-4xl font-black text-white mb-4">
                  {selectedBlogPost.title}
                </h1>
                <div className="flex flex-wrap gap-2">
                  {selectedBlogPost.tags.map((tag, i) => (
                    <span key={i} className="px-3 py-1 rounded-full bg-teal-500/20 text-teal-400 text-sm font-medium border border-teal-400/30">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="p-8 md:p-12">
              <div 
                className="prose prose-invert prose-lg max-w-none"
                dangerouslySetInnerHTML={{ __html: selectedBlogPost.fullContent }}
                style={{
                  color: '#e2e8f0',
                  lineHeight: '1.8'
                }}
              />

              {/* Related articles */}
              <div className="mt-12">
                <h3 className="text-2xl font-bold mb-6">Related Articles</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  {blogPosts
                    .filter(post => post.id !== selectedBlogPost.id && post.category === selectedBlogPost.category)
                    .slice(0, 2)
                    .map(post => (
                      <div
                        key={post.id}
                        className="p-4 rounded-2xl bg-white/5 hover:bg-white/10 transition-all duration-300 cursor-pointer border border-white/10"
                        onClick={() => setSelectedBlogPost(post)}
                      >
                        <h4 className="font-bold mb-2 text-teal-400">{post.title}</h4>
                        <p className="text-sm text-slate-400">{post.excerpt}</p>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&display=swap');
        
        * {
          font-family: 'Space Grotesk', system-ui, -apple-system, sans-serif;
        }
        
        @keyframes gradient {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        
        .animate-gradient {
          animation: gradient 3s ease infinite;
        }
        
        .bg-300% {
          background-size: 300%;
        }
        
        .section-animate {
          animation: fadeInUp 0.8s ease forwards;
        }
        
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.5s ease forwards;
        }
        
        .animate-in {
          opacity: 1 !important;
        }
        
        ::-webkit-scrollbar {
          width: 10px;
        }
        
        ::-webkit-scrollbar-track {
          background: #0f172a;
        }
        
        ::-webkit-scrollbar-thumb {
          background: linear-gradient(to bottom, #fb923c, #14b8a6);
          border-radius: 10px;
        }
        
        ::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(to bottom, #fdba74, #2dd4bf);
        }
        
        html {
          scroll-behavior: smooth;
        }
        
        /* Blog content styles */
        .prose h2 {
          font-size: 2rem;
          font-weight: 800;
          margin-top: 2.5rem;
          margin-bottom: 1.5rem;
          color: #f1f5f9;
        }
        
        .prose h3 {
          font-size: 1.5rem;
          font-weight: 700;
          margin-top: 2rem;
          margin-bottom: 1rem;
          color: #e2e8f0;
        }
        
        .prose p {
          margin-bottom: 1.5rem;
          color: #cbd5e1;
        }
        
        .prose ul, .prose ol {
          margin: 1.5rem 0;
          padding-left: 1.5rem;
        }
        
        .prose li {
          margin-bottom: 0.75rem;
          color: #cbd5e1;
        }
        
        .prose code {
          background: #1e293b;
          padding: 0.2rem 0.4rem;
          border-radius: 0.25rem;
          font-size: 0.9em;
          color: #14b8a6;
        }
        
        .prose pre {
          margin: 1.5rem 0;
        }
        
        .prose pre code {
          padding: 0;
          background: transparent;
          color: #e2e8f0;
        }
        
        .prose a {
          color: #14b8a6;
          text-decoration: underline;
        }
        
        .prose a:hover {
          color: #2dd4bf;
        }
        
        .prose strong {
          color: #f1f5f9;
          font-weight: 600;
        }
        
        .prose img {
          border-radius: 12px;
          margin: 2rem 0;
        }
      `}</style>
    </div>
  );
};

export default Portfolio;
