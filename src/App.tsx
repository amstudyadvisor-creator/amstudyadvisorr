/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { 
  Plane, 
  MapPin, 
  GraduationCap, 
  FileText, 
  Users, 
  CheckCircle, 
  Phone, 
  Mail, 
  MessageSquare, 
  Instagram, 
  Facebook, 
  Globe, 
  ArrowRight, 
  Menu, 
  X,
  Award,
  BookOpen,
  Briefcase,
  Home as HomeIcon,
  Send,
  ChevronRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { GoogleGenAI } from "@google/genai";

// --- Types ---
interface Destination {
  id: string;
  name: string;
  flag: string;
  image: string;
  programs: string[];
  scholarships: string;
  work: string;
  visa: string;
}

interface Testimonial {
  name: string;
  country: string;
  university: string;
  story: string;
  image: string;
}

// --- Data ---
const destinations: Destination[] = [
  {
    id: 'italy',
    name: 'Italy',
    flag: '🇮🇹',
    image: 'https://images.unsplash.com/photo-1516483638261-f4dbaf036963?auto=format&fit=crop&q=80&w=800',
    programs: ['Bachelors', 'Masters', 'PhD in Engineering, Arts, Medicine'],
    scholarships: 'DSU Scholarship, Regional Scholarships up to €7,000/year',
    work: '20 hours per week part-time allowed',
    visa: 'High success rate for study visa D-type'
  },
  {
    id: 'cyprus',
    name: 'Cyprus',
    flag: '🇨🇾',
    image: 'https://images.unsplash.com/photo-1515542641795-06ed20df9824?auto=format&fit=crop&q=80&w=800',
    programs: ['Business', 'IT', 'Hospitality Management'],
    scholarships: 'Up to 50% tuition fee waiver for international students',
    work: 'Part-time work options available in tourism sector',
    visa: 'Easy processing with minimal documentation'
  },
  {
    id: 'france',
    name: 'France',
    flag: '🇫🇷',
    image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&q=80&w=800',
    programs: ['Fashion', 'Business', 'Culinary Arts', 'Engineering'],
    scholarships: 'Eiffel Excellence Scholarship, CROUS assistance',
    work: 'Student jobs widely available in major cities',
    visa: 'Campus France procedure for streamlined visa'
  },
  {
    id: 'uk',
    name: 'United Kingdom',
    flag: '🇬🇧',
    image: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?auto=format&fit=crop&q=80&w=800',
    programs: ['Law', 'Finance', 'Data Science', 'Healthcare'],
    scholarships: 'Chevening, Commonwealth, University specific bursaries',
    work: 'Graduate Route (PSW) 2 years after studies',
    visa: 'Tier 4 Student Visa point-based system'
  },
  {
    id: 'europe',
    name: 'Other European Countries',
    flag: '🇪🇺',
    image: 'https://images.unsplash.com/photo-1467269204594-9661b134dd2b?auto=format&fit=crop&q=80&w=800',
    programs: ['Germany, Hungary, Poland, Spain'],
    scholarships: 'Erasmus+, Stipendium Hungaricum, DAAD',
    work: 'Varies by country, generally 20h/week',
    visa: 'Schengen study visa benefits'
  }
];

const services = [
  { title: 'University Admission', icon: <GraduationCap className="w-8 h-8" />, desc: 'Expert guidance in choosing the right university and course.' },
  { title: 'Visa File Preparation', icon: <FileText className="w-8 h-8" />, desc: 'Meticulous documentation to ensure high visa success rates.' },
  { title: 'Scholarship Guidance', icon: <Award className="w-8 h-8" />, desc: 'Helping you secure fully funded or partial scholarships.' },
  { title: 'Interview Preparation', icon: <Users className="w-8 h-8" />, desc: 'Mock interviews to build confidence for embassy meetings.' },
  { title: 'Accommodation Guidance', icon: <HomeIcon className="w-8 h-8" />, desc: 'Finding safe and affordable housing near your campus.' },
  { title: 'Application Processing', icon: <Send className="w-8 h-8" />, desc: 'End-to-end support from application to enrollment.' },
  { title: 'SOP Writing', icon: <BookOpen className="w-8 h-8" />, desc: 'Crafting compelling Statements of Purpose that stand out.' }
];

const testimonials: Testimonial[] = [
  {
    name: 'Ali Khan',
    country: 'Italy',
    university: 'University of Bologna',
    story: 'AM Study Advisor helped me get a full DSU scholarship. The visa process was smooth and fast!',
    image: 'https://i.pravatar.cc/150?u=ali'
  },
  {
    name: 'Sara Ahmed',
    country: 'UK',
    university: 'University of Manchester',
    story: 'I was confused about the UK visa rules, but their team guided me step-by-step. Highly recommended!',
    image: 'https://i.pravatar.cc/150?u=sara'
  },
  {
    name: 'Usman Malik',
    country: 'France',
    university: 'Sorbonne University',
    story: 'From SOP to interview prep, they were with me. Now I am studying my dream course in Paris.',
    image: 'https://i.pravatar.cc/150?u=usman'
  }
];

const universities = [
  'University of Bologna',
  'University of Padova',
  'Sapienza University',
  'University of Paris',
  'University of Manchester',
  'Politecnico di Milano',
  'University of Pisa',
  'King\'s College London'
];

// --- Components ---

const Counter = ({ end, label }: { end: number, label: string }) => {
  const [count, setCount] = useState(0);
  const ref = useRef(null);

  useEffect(() => {
    let start = 0;
    const duration = 2000;
    const increment = end / (duration / 16);
    
    const timer = setInterval(() => {
      start += increment;
      if (start >= end) {
        setCount(end);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);

    return () => clearInterval(timer);
  }, [end]);

  return (
    <div className="text-center">
      <div className="text-4xl md:text-5xl font-bold text-primary mb-2">{count}{label.includes('%') ? '%' : '+'}</div>
      <div className="text-gray-600 font-medium">{label}</div>
    </div>
  );
};

const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{role: 'user' | 'bot', text: string}[]>([
    { role: 'bot', text: 'Hello! I am AM Advisor AI. How can I help you with your study abroad journey today?' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;
    
    const userMsg = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setIsLoading(true);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: userMsg,
        config: {
          systemInstruction: "You are a helpful study abroad consultant for AM Study Advisor. Provide brief, professional advice about studying in Italy, UK, France, and Cyprus. Encourage users to contact via WhatsApp +923485534461 for detailed counseling. Keep answers under 3 sentences."
        }
      });
      
      setMessages(prev => [...prev, { role: 'bot', text: response.text || "I'm sorry, I couldn't process that. Please contact us on WhatsApp!" }]);
    } catch (error) {
      setMessages(prev => [...prev, { role: 'bot', text: "I'm having a bit of trouble connecting. Please reach out to us directly on WhatsApp at +923485534461!" }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            className="bg-white rounded-2xl shadow-2xl w-80 md:w-96 mb-4 overflow-hidden border border-gray-100 flex flex-col h-[500px]"
          >
            <div className="bg-primary p-4 text-white flex justify-between items-center">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                  <GraduationCap className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-sm">AM Advisor AI</h3>
                  <p className="text-[10px] opacity-80">Online | Ready to help</p>
                </div>
              </div>
              <button onClick={() => setIsOpen(false)}><X className="w-5 h-5" /></button>
            </div>
            
            <div ref={scrollRef} className="flex-1 p-4 overflow-y-auto space-y-4 bg-gray-50">
              {messages.map((m, i) => (
                <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[80%] p-3 rounded-2xl text-sm ${m.role === 'user' ? 'bg-primary text-white rounded-tr-none' : 'bg-white text-gray-800 shadow-sm rounded-tl-none'}`}>
                    {m.text}
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-white p-3 rounded-2xl shadow-sm rounded-tl-none">
                    <div className="flex gap-1">
                      <div className="w-1.5 h-1.5 bg-gray-300 rounded-full animate-bounce"></div>
                      <div className="w-1.5 h-1.5 bg-gray-300 rounded-full animate-bounce [animation-delay:0.2s]"></div>
                      <div className="w-1.5 h-1.5 bg-gray-300 rounded-full animate-bounce [animation-delay:0.4s]"></div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="p-4 bg-white border-t border-gray-100">
              <div className="flex gap-2">
                <input 
                  type="text" 
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                  placeholder="Ask about scholarships..."
                  className="flex-1 bg-gray-100 rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
                <button 
                  onClick={handleSend}
                  className="bg-primary text-white p-2 rounded-full hover:bg-red-700 transition-colors"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
              <p className="text-[10px] text-center text-gray-400 mt-2">Powered by AM Study Advisor</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex gap-3">
        <a 
          href="https://wa.me/923485534461?text=Hello%20AM%20Study%20Advisor,%20I%20want%20information%20about%20studying%20abroad."
          target="_blank"
          rel="noopener noreferrer"
          className="bg-[#25D366] text-white p-4 rounded-full shadow-lg hover:scale-110 transition-transform flex items-center justify-center"
        >
          <MessageSquare className="w-6 h-6" />
        </a>
        <button 
          onClick={() => setIsOpen(!isOpen)}
          className="bg-black text-white p-4 rounded-full shadow-lg hover:scale-110 transition-transform flex items-center justify-center"
        >
          {isOpen ? <X className="w-6 h-6" /> : <Globe className="w-6 h-6" />}
        </button>
      </div>
    </div>
  );
};

export default function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [selectedDest, setSelectedDest] = useState<Destination | null>(null);

  const navLinks = [
    { name: 'Home', href: '#home' },
    { name: 'About', href: '#about' },
    { name: 'Destinations', href: '#destinations' },
    { name: 'Services', href: '#services' },
    { name: 'Scholarships', href: '#scholarships' },
    { name: 'Student Success', href: '#success' },
    { name: 'Contact', href: '#contact' },
  ];

  return (
    <div className="min-h-screen">
      {/* --- Navigation --- */}
      <nav className="fixed top-0 left-0 w-full z-40 bg-white/80 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 h-20 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center text-white font-bold text-xl">AM</div>
            <span className="font-bold text-xl tracking-tight">Study Advisor</span>
          </div>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-8">
            {navLinks.map(link => (
              <a key={link.name} href={link.href} className="text-sm font-medium hover:text-primary transition-colors">{link.name}</a>
            ))}
            <a href="#apply" className="bg-primary text-white px-6 py-2 rounded-full text-sm font-bold hover:bg-red-700 transition-colors">Apply Now</a>
          </div>

          {/* Mobile Toggle */}
          <button className="lg:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X /> : <Menu />}
          </button>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div 
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="lg:hidden bg-white border-t border-gray-100 overflow-hidden"
            >
              <div className="px-4 py-6 flex flex-col gap-4">
                {navLinks.map(link => (
                  <a 
                    key={link.name} 
                    href={link.href} 
                    onClick={() => setIsMenuOpen(false)}
                    className="text-lg font-medium hover:text-primary"
                  >
                    {link.name}
                  </a>
                ))}
                <a href="#apply" onClick={() => setIsMenuOpen(false)} className="bg-primary text-white px-6 py-3 rounded-xl text-center font-bold">Apply Now</a>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* --- Hero Section --- */}
      <section id="home" className="relative pt-32 pb-20 md:pt-48 md:pb-32 overflow-hidden bg-gray-50">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <div className="absolute top-20 left-10 w-64 h-64 bg-primary rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-black rounded-full blur-3xl"></div>
          <img 
            src="https://www.transparentpng.com/download/world-map/world-map-png-image-15.png" 
            alt="World Map" 
            className="w-full h-full object-contain opacity-20"
          />
        </div>
        
        <div className="airplane text-primary/30 top-1/2 left-0">
          <Plane size={48} />
        </div>

        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div 
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h1 className="text-5xl md:text-7xl font-black leading-tight mb-6">
                Start Your <span className="text-primary">Study Abroad</span> Journey With AM Advisor
              </h1>
              <p className="text-xl text-gray-600 mb-8 max-w-lg">
                Helping students get admission in top international universities with visa and scholarship support. Your future starts here.
              </p>
              <div className="flex flex-wrap gap-4">
                <a href="#apply" className="btn-primary flex items-center gap-2">
                  Apply Now <ArrowRight className="w-5 h-5" />
                </a>
                <a href="https://wa.me/923485534461" className="btn-outline">Free Consultation</a>
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="relative z-10 rounded-3xl overflow-hidden shadow-2xl">
                <img 
                  src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&q=80&w=1200" 
                  alt="Students" 
                  className="w-full h-auto"
                />
              </div>
              {/* Floating Stats Card */}
              <div className="absolute -bottom-6 -left-6 bg-white p-6 rounded-2xl shadow-xl z-20 hidden md:block border border-gray-100">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center text-primary">
                    <CheckCircle className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold">95%</div>
                    <div className="text-xs text-gray-500 uppercase tracking-wider">Visa Success</div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Counters */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-8 mt-24">
            <Counter end={500} label="Students Guided" />
            <Counter end={10} label="Countries" />
            <div className="col-span-2 md:col-span-1">
              <Counter end={95} label="Visa Success Rate" />
            </div>
          </div>
        </div>
      </section>

      {/* --- About Section --- */}
      <section id="about" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl font-bold mb-6">Your Trusted Partner in Global Education</h2>
              <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                AM Study Advisor is a premier consultancy dedicated to bridging the gap between ambitious students and world-class international education. We understand that studying abroad is a life-changing decision, and we are here to ensure your transition is seamless.
              </p>
              <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                Our team of experts provides personalized guidance for university admissions, meticulous visa processing, and strategic scholarship applications. We don't just process files; we build careers.
              </p>
              <ul className="space-y-4">
                {[
                  'Personalized University Selection',
                  'Expert Visa Documentation',
                  'Fully Funded Scholarship Assistance',
                  'Pre-departure & Interview Prep'
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 font-medium">
                    <CheckCircle className="text-primary w-5 h-5" /> {item}
                  </li>
                ))}
              </ul>
            </motion.div>

            <div className="relative">
              <h3 className="text-2xl font-bold mb-12 text-center lg:text-left">Our 4-Step Process</h3>
              <div className="space-y-8 relative before:absolute before:left-[27px] before:top-0 before:w-0.5 before:h-full before:bg-gray-100">
                {[
                  { step: '1', title: 'Free Counseling', desc: 'Initial assessment of your profile and goals.' },
                  { step: '2', title: 'University Admission', desc: 'Securing your offer letter from top universities.' },
                  { step: '3', title: 'Visa Filing', desc: 'Professional handling of your visa application.' },
                  { step: '4', title: 'Fly Abroad', desc: 'Pre-departure briefing and start of your journey.' }
                ].map((item, i) => (
                  <motion.div 
                    key={i}
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    className="flex gap-6 relative z-10"
                  >
                    <div className="w-14 h-14 bg-primary text-white rounded-full flex items-center justify-center font-bold text-xl shrink-0 shadow-lg shadow-red-200">
                      {item.step}
                    </div>
                    <div>
                      <h4 className="text-xl font-bold mb-1">{item.title}</h4>
                      <p className="text-gray-500">{item.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- Study Destinations --- */}
      <section id="destinations" className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="section-title">Top Study <span className="text-primary">Destinations</span></h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {destinations.map((dest) => (
              <motion.div 
                key={dest.id}
                whileHover={{ y: -10 }}
                className="destination-card group cursor-pointer"
                onClick={() => setSelectedDest(dest)}
              >
                <div className="destination-card-inner bg-white rounded-3xl overflow-hidden shadow-lg border border-gray-100 h-full">
                  <div className="relative h-64 overflow-hidden">
                    <img 
                      src={dest.image} 
                      alt={dest.name} 
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                    <div className="absolute bottom-6 left-6 flex items-center gap-3">
                      <span className="text-4xl">{dest.flag}</span>
                      <h3 className="text-2xl font-bold text-white">{dest.name}</h3>
                    </div>
                  </div>
                  <div className="p-6">
                    <p className="text-gray-600 mb-4 line-clamp-2">Explore world-class education and vibrant culture in {dest.name}.</p>
                    <button className="text-primary font-bold flex items-center gap-2 group-hover:gap-3 transition-all">
                      View Details <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Destination Modal */}
      <AnimatePresence>
        {selectedDest && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedDest(null)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            ></motion.div>
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden relative z-10"
            >
              <div className="h-48 relative">
                <img src={selectedDest.image} alt={selectedDest.name} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                  <h2 className="text-4xl font-bold text-white flex items-center gap-4">
                    <span>{selectedDest.flag}</span> {selectedDest.name}
                  </h2>
                </div>
                <button 
                  onClick={() => setSelectedDest(null)}
                  className="absolute top-4 right-4 bg-white/20 backdrop-blur-md text-white p-2 rounded-full hover:bg-white/40 transition-colors"
                >
                  <X />
                </button>
              </div>
              <div className="p-8 grid md:grid-cols-2 gap-8">
                <div>
                  <h4 className="font-bold text-primary uppercase text-xs tracking-widest mb-4">Available Programs</h4>
                  <ul className="space-y-2">
                    {selectedDest.programs.map((p, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                        <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 shrink-0" /> {p}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="font-bold text-primary uppercase text-xs tracking-widest mb-4">Scholarships</h4>
                  <p className="text-sm text-gray-700 leading-relaxed">{selectedDest.scholarships}</p>
                </div>
                <div>
                  <h4 className="font-bold text-primary uppercase text-xs tracking-widest mb-4">Part-time Work</h4>
                  <p className="text-sm text-gray-700 leading-relaxed">{selectedDest.work}</p>
                </div>
                <div>
                  <h4 className="font-bold text-primary uppercase text-xs tracking-widest mb-4">Visa Guidance</h4>
                  <p className="text-sm text-gray-700 leading-relaxed">{selectedDest.visa}</p>
                </div>
              </div>
              <div className="p-6 bg-gray-50 flex justify-end">
                <a 
                  href={`https://wa.me/923485534461?text=I%20am%20interested%20in%20studying%20in%20${selectedDest.name}`}
                  className="btn-primary"
                >
                  Inquire Now
                </a>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* --- Services Section --- */}
      <section id="services" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="section-title">Our Comprehensive <span className="text-primary">Services</span></h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {services.map((service, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="p-8 rounded-3xl bg-gray-50 border border-gray-100 hover:bg-black hover:text-white transition-all duration-500 group"
              >
                <div className="text-primary mb-6 group-hover:text-white transition-colors">{service.icon}</div>
                <h3 className="text-xl font-bold mb-3">{service.title}</h3>
                <p className="text-gray-500 group-hover:text-gray-400 transition-colors text-sm leading-relaxed">{service.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* --- Scholarships Section --- */}
      <section id="scholarships" className="py-24 bg-black text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-primary/10 skew-x-12 translate-x-1/4 pointer-events-none"></div>
        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-4xl md:text-5xl font-bold mb-8">Scholarships & <span className="text-primary">Financial Aid</span></h2>
              <p className="text-gray-400 text-lg mb-12">
                We specialize in helping students secure funding for their international education. From government grants to university-specific discounts, we explore every avenue to make your dream affordable.
              </p>
              
              <div className="space-y-6">
                {[
                  { country: 'Italy', info: 'Fully funded DSU scholarships including tuition waiver, free meals, and up to €7,000 yearly stipend.' },
                  { country: 'France', info: 'Eiffel Excellence scholarships and CROUS housing assistance for international students.' },
                  { country: 'UK', info: 'Chevening, Commonwealth, and university-specific merit bursaries up to £10,000.' },
                  { country: 'Cyprus', info: 'Automatic tuition fee discounts of 50% for high-achieving international applicants.' }
                ].map((item, i) => (
                  <div key={i} className="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
                    <h4 className="text-xl font-bold text-primary mb-2">{item.country}</h4>
                    <p className="text-gray-300 text-sm">{item.info}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white/10 p-8 rounded-3xl backdrop-blur-md border border-white/20">
              <h3 className="text-2xl font-bold mb-6">Types of Aid We Handle</h3>
              <div className="space-y-8">
                <div className="flex gap-4">
                  <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center shrink-0">
                    <Globe className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-bold mb-1">Government Scholarships</h4>
                    <p className="text-gray-400 text-sm">National level funding programs for international researchers and students.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center shrink-0">
                    <GraduationCap className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-bold mb-1">University Merit Awards</h4>
                    <p className="text-gray-400 text-sm">Direct discounts based on your previous academic performance and test scores.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center shrink-0">
                    <Briefcase className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-bold mb-1">Tuition Fee Discounts</h4>
                    <p className="text-gray-400 text-sm">Early bird discounts and regional bursaries for specific student groups.</p>
                  </div>
                </div>
              </div>
              <button className="w-full mt-10 btn-primary">Check Your Eligibility</button>
            </div>
          </div>
        </div>
      </section>

      {/* --- University Logo Slider --- */}
      <section className="py-16 bg-white overflow-hidden border-y border-gray-100">
        <div className="max-w-7xl mx-auto px-4 mb-10 text-center">
          <h3 className="text-gray-400 uppercase tracking-widest text-sm font-bold">Partner Universities</h3>
        </div>
        <div className="relative flex overflow-x-hidden">
          <div className="logo-slider">
            {[...universities, ...universities].map((uni, i) => (
              <div key={i} className="w-[250px] flex items-center justify-center px-8">
                <div className="text-gray-400 font-bold text-lg text-center grayscale hover:grayscale-0 transition-all cursor-default">
                  {uni}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- Student Success Section --- */}
      <section id="success" className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="section-title">Student <span className="text-primary">Success Stories</span></h2>
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((t, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                className="bg-white p-8 rounded-3xl shadow-lg border border-gray-100 flex flex-col"
              >
                <div className="flex items-center gap-4 mb-6">
                  <img src={t.image} alt={t.name} className="w-16 h-16 rounded-full object-cover border-2 border-primary/20" />
                  <div>
                    <h4 className="font-bold text-lg">{t.name}</h4>
                    <p className="text-primary text-sm font-medium">{t.country} | {t.university}</p>
                  </div>
                </div>
                <p className="text-gray-600 italic leading-relaxed flex-1">"{t.story}"</p>
                <div className="mt-6 flex text-yellow-400">
                  {[...Array(5)].map((_, i) => <span key={i}>★</span>)}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* --- Application Form --- */}
      <section id="apply" className="py-24 bg-white">
        <div className="max-w-4xl mx-auto px-4">
          <div className="bg-white rounded-[2rem] shadow-2xl overflow-hidden border border-gray-100">
            <div className="bg-primary p-10 text-white text-center">
              <h2 className="text-3xl font-bold mb-2">Ready to Start?</h2>
              <p className="opacity-80">Fill out the form below and our experts will contact you within 24 hours.</p>
            </div>
            <form className="p-10 space-y-6" onSubmit={(e) => e.preventDefault()}>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700">Full Name</label>
                  <input type="text" placeholder="John Doe" className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700">Phone Number</label>
                  <input type="tel" placeholder="+92 3XX XXXXXXX" className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all" />
                </div>
              </div>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700">Email Address</label>
                  <input type="email" placeholder="john@example.com" className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700">Country Interested In</label>
                  <select className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all">
                    <option>Select Country</option>
                    <option>Italy</option>
                    <option>United Kingdom</option>
                    <option>France</option>
                    <option>Cyprus</option>
                    <option>Other European Countries</option>
                  </select>
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700">Highest Qualification</label>
                <input type="text" placeholder="e.g. Bachelors in CS" className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700">Message</label>
                <textarea rows={4} placeholder="Tell us about your goals..." className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"></textarea>
              </div>
              <button type="submit" className="w-full btn-primary py-4 text-lg">Submit Application</button>
            </form>
          </div>
        </div>
      </section>

      {/* --- Contact Section --- */}
      <section id="contact" className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-16">
            <div>
              <h2 className="text-4xl font-bold mb-8">Get in <span className="text-primary">Touch</span></h2>
              <p className="text-gray-600 mb-12 text-lg">Have questions? We're here to help. Reach out to us via any of the channels below or visit our office in Islamabad.</p>
              
              <div className="space-y-8">
                <div className="flex gap-6">
                  <div className="w-14 h-14 bg-white rounded-2xl shadow-md flex items-center justify-center text-primary shrink-0">
                    <Phone className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-bold text-lg mb-1">Phone</h4>
                    <p className="text-gray-600">0348 5534461</p>
                    <p className="text-gray-600">0323 5435429</p>
                  </div>
                </div>
                <div className="flex gap-6">
                  <div className="w-14 h-14 bg-white rounded-2xl shadow-md flex items-center justify-center text-primary shrink-0">
                    <Mail className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-bold text-lg mb-1">Email</h4>
                    <p className="text-gray-600">amstudyadvisor@gmail.com</p>
                  </div>
                </div>
                <div className="flex gap-6">
                  <div className="w-14 h-14 bg-white rounded-2xl shadow-md flex items-center justify-center text-primary shrink-0">
                    <MapPin className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-bold text-lg mb-1">Address</h4>
                    <p className="text-gray-600">Opposite To Street No 65 G-14/2 Islamabad, Pakistan</p>
                  </div>
                </div>
              </div>

              <div className="flex gap-4 mt-12">
                <a href="https://www.facebook.com/share/17zK5PNoZn/" target="_blank" className="w-12 h-12 bg-black text-white rounded-full flex items-center justify-center hover:bg-primary transition-colors"><Facebook className="w-5 h-5" /></a>
                <a href="https://www.instagram.com/amstudyadvisor" target="_blank" className="w-12 h-12 bg-black text-white rounded-full flex items-center justify-center hover:bg-primary transition-colors"><Instagram className="w-5 h-5" /></a>
                <a href="https://tiktok.com/@am.study.advisor" target="_blank" className="w-12 h-12 bg-black text-white rounded-full flex items-center justify-center hover:bg-primary transition-colors font-bold">T</a>
              </div>
            </div>

            <div className="h-[500px] rounded-3xl overflow-hidden shadow-xl border-4 border-white">
              <iframe 
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3321.308894856024!2d72.9841!3d33.6484!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x38df9675aaaaaaab%3A0x1234567890abcdef!2sG-14%2F2%20Islamabad!5e0!3m2!1sen!2s!4v1625567890123!5m2!1sen!2s" 
                width="100%" 
                height="100%" 
                style={{ border: 0 }} 
                allowFullScreen 
                loading="lazy"
                title="Office Location"
              ></iframe>
            </div>
          </div>
        </div>
      </section>

      {/* --- Footer --- */}
      <footer className="bg-black text-white py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
            <div className="col-span-1 lg:col-span-1">
              <div className="flex items-center gap-2 mb-6">
                <div className="w-8 h-8 bg-primary rounded flex items-center justify-center text-white font-bold">AM</div>
                <span className="font-bold text-xl">Study Advisor</span>
              </div>
              <p className="text-gray-400 text-sm leading-relaxed">
                Empowering students to achieve their dreams of international education through expert guidance and personalized support.
              </p>
            </div>
            
            <div>
              <h4 className="font-bold mb-6">Quick Links</h4>
              <ul className="space-y-3 text-sm text-gray-400">
                {navLinks.map(link => (
                  <li key={link.name}><a href={link.href} className="hover:text-primary transition-colors">{link.name}</a></li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="font-bold mb-6">Destinations</h4>
              <ul className="space-y-3 text-sm text-gray-400">
                <li><a href="#destinations" className="hover:text-primary transition-colors">Study in Italy</a></li>
                <li><a href="#destinations" className="hover:text-primary transition-colors">Study in UK</a></li>
                <li><a href="#destinations" className="hover:text-primary transition-colors">Study in France</a></li>
                <li><a href="#destinations" className="hover:text-primary transition-colors">Study in Cyprus</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold mb-6">Newsletter</h4>
              <p className="text-sm text-gray-400 mb-4">Get the latest updates on scholarships and admissions.</p>
              <div className="flex gap-2">
                <input type="email" placeholder="Email" className="bg-white/10 border border-white/10 rounded-lg px-4 py-2 text-sm flex-1 focus:outline-none focus:ring-1 focus:ring-primary" />
                <button className="bg-primary p-2 rounded-lg"><ArrowRight className="w-4 h-4" /></button>
              </div>
            </div>
          </div>
          
          <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-500">
            <p>© 2026 AM Study Advisor. All Rights Reserved.</p>
            <div className="flex gap-6">
              <a href="#" className="hover:text-white">Privacy Policy</a>
              <a href="#" className="hover:text-white">Terms of Service</a>
            </div>
          </div>
        </div>
      </footer>

      {/* --- Floating Elements --- */}
      <ChatBot />
    </div>
  );
}
