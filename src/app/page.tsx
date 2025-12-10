"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

import { Mail, Linkedin, Github, Download } from 'lucide-react'; // Import icons
import ParticleBackground from "@/components/ParticleBackground";
import InteractiveGlobe from "@/components/InteractiveGlobe";
import InteractiveTerminal from "@/components/InteractiveTerminal";

// Matrix code rain effect using canvas
function MatrixRain() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = window.innerWidth;
    let height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;

    const fontSize = 14; // Slightly smaller for more density
    const columns = Math.floor(width / fontSize);
    
    // Enhanced rain drop system with varying speeds and brightness
    const drops = Array.from({ length: columns }, () => ({
      y: Math.random() * -height, // Start above the screen for staggered entry
      speed: 0.8 + Math.random() * 1.5, // Varying speeds
      brightness: 0.5 + Math.random() * 0.5, // Varying brightness
      glitching: false, // For glitch effect
      glitchTimeout: 0,
      lastChar: ""
    }));

    // Collection of characters to use (mix of Katakana, numbers, and special symbols)
    const charTypes = {
      katakana: { start: 0x30A0, range: 96, weight: 0.7 },
      numbers: { start: 0x30, range: 10, weight: 0.2 },
      symbols: { start: 0x21, range: 15, weight: 0.1 },
    };

    // Select a random character based on weights
    function getRandomChar() {
      const rand = Math.random();
      let charSet;
      
      if (rand < charTypes.katakana.weight) {
        charSet = charTypes.katakana;
      } else if (rand < charTypes.katakana.weight + charTypes.numbers.weight) {
        charSet = charTypes.numbers;
      } else {
        charSet = charTypes.symbols;
      }
      
      return String.fromCharCode(charSet.start + Math.floor(Math.random() * charSet.range));
    }

    function draw() {
      if (!ctx) return;
      ctx.fillStyle = "rgba(10, 10, 10, 0.15)"; // Slightly darker trail
      ctx.fillRect(0, 0, width, height);

      for (let i = 0; i < drops.length; i++) {
        const drop = drops[i];
        
        // Only draw if within canvas
        if (drop.y > 0) {
          // Determine brightness
          let brightness = drop.brightness;
          let char = drop.lastChar;
          
          // Glitching effect: occasionally characters change or glitch visually
          if (Math.random() > 0.99) {
            drop.glitching = true;
            drop.glitchTimeout = 3 + Math.floor(Math.random() * 5);
          }
          
          if (drop.glitching) {
            brightness = 1; // Brighter during glitch
            char = getRandomChar(); // Change character rapidly
            drop.glitchTimeout--;
            
            if (drop.glitchTimeout <= 0) {
              drop.glitching = false;
            }
          } else if (Math.random() > 0.9) {
            char = getRandomChar();
          }
          
          drop.lastChar = char;
          
          // First character in each column is brighter (head of the "rain")
          const isFirstChar = Math.floor(drop.y / fontSize) === Math.floor(drop.y / fontSize);
          
          // Set gradient color for more dynamic effect
          if (isFirstChar) {
            ctx.fillStyle = `rgba(57, 255, 20, ${brightness * 1.0})`; // Head is brighter
          } else {
            ctx.fillStyle = `rgba(57, 255, 20, ${brightness * 0.8})`; // Body is slightly dimmer
          }
          
          ctx.font = `${fontSize}px 'Share Tech Mono', monospace`;
          
          // Random chance for character to be slightly larger (more "3D" effect)
          if (Math.random() > 0.995) {
            ctx.font = `${fontSize * 1.2}px 'Share Tech Mono', monospace`;
          }
          
          // Draw the character
          ctx.fillText(char, i * fontSize, drop.y);
          
          // Occasional cyan highlights for diversity
          if (Math.random() > 0.99) {
            ctx.fillStyle = `rgba(0, 255, 249, ${brightness * 0.9})`;
            ctx.fillText(getRandomChar(), i * fontSize, drop.y - (fontSize * (Math.random() * 5)));
          }
        }
        
        // Update position
        drop.y += drop.speed * fontSize * 0.1;
        
        // Reset if off-screen with some randomness to avoid syncing
        if (drop.y > height && Math.random() > 0.96) {
          drop.y = Math.random() * -100; // Start above screen
          drop.speed = 0.8 + Math.random() * 1.5; // New random speed
          drop.brightness = 0.5 + Math.random() * 0.5; // New random brightness
        }
      }
    }

    let animationId: number;
    function animate() {
      draw();
      animationId = requestAnimationFrame(animate);
    }
    animate();

    function handleResize() {
      width = window.innerWidth;
      height = window.innerHeight;
      if (canvas) {
        canvas.width = width;
        canvas.height = height;
      }
    }
    window.addEventListener("resize", handleResize);

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full z-0 pointer-events-none"
      style={{ opacity: 0.4 }} // More visible rain for better effect
    />
  );
}


export default function Home() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const sectionRefs = useRef<{ [key: string]: HTMLElement | null }>({});

  const navItems = ["About", "Skills", "Experience", "Projects", "Achievements", "Certifications", "Blog", "Tools", "Fun Facts", "Testimonials", "Contact"];


  const handleDownloadPdf = async () => {
    const mainContent = document.getElementById('about'); // Select only the About Me section
    if (!mainContent) {
      console.error("Could not find main content element to capture.");
      return;
    }

    console.log("Starting PDF generation...");

    try {
      await new Promise(resolve => setTimeout(resolve, 500)); // Add a 500ms delay
      const canvas = await html2canvas(mainContent, {
        scale: 2, // Increase scale for better resolution
        useCORS: true, // Important if images are from external sources
        logging: true, // Enable logging for debugging
      });
      console.log("Canvas generated from HTML.");

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'p',
        unit: 'px',
        format: [canvas.width, canvas.height] // Use canvas dimensions for initial format
      });
      console.log("jsPDF instance created.");

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const imgWidth = canvas.width;
      const imgHeight = canvas.height;
      const ratio = imgHeight / imgWidth;
      const calculatedHeight = pdfWidth * ratio;
      let heightLeft = calculatedHeight;
      let position = 0;

      pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, calculatedHeight);
      heightLeft -= pdfHeight;

      // Add new pages if content is longer than one page
      while (heightLeft >= 0) {
        position = heightLeft - calculatedHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, calculatedHeight);
        heightLeft -= pdfHeight;
      }
      console.log("Image added to PDF, potentially across multiple pages.");

      pdf.save('AdityaKumarTiwari_Resume.pdf');
      console.log("PDF saved.");

    } catch (error) {
      console.error("Error generating PDF:", error);
    }
  };

  // Intersection Observer for active section highlighting
  useEffect(() => {
    const observerOptions = {
      root: null, // relative to document viewport
      rootMargin: '0px',
      threshold: 0.4 // 40% of section visible
    };

    const observerCallback = (entries: IntersectionObserverEntry[]) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id);
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);

    navItems.forEach(item => {
      const sectionId = item.toLowerCase().replace(/\s/g, "");
      const element = document.getElementById(sectionId);
      if (element) {
        sectionRefs.current[sectionId] = element;
        observer.observe(element);
      }
    });

    return () => {
      Object.values(sectionRefs.current).forEach(element => {
        if (element) {
          observer.unobserve(element);
        }
      });
    };
  }, [navItems]); // Re-run if navItems change (though they don't here)
  return (
    <div className="relative min-h-screen bg-black text-[#39ff14] font-mono">
      <MatrixRain />
      <ParticleBackground />
      <InteractiveGlobe size={300} position={{ bottom: '20px', right: '20px' }} opacity={0.7} />
      <div className="relative z-10">
        {/* Hacker Nav */}
        <nav className="w-full flex flex-wrap justify-between items-center gap-2 py-2 sm:py-4 px-2 sm:px-4 bg-black/90 border-b-2 border-[#39ff14] sticky top-0 z-50 shadow-lg backdrop-blur-md"> {/* Increased blur and opacity */}
          {/* Hamburger Button - Mobile */}
          <button
            className="terminal-btn text-sm px-3 py-1 md:hidden" // Smaller button on mobile
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle Menu"
          >
            ☰ Menu
          </button>
          {/* Desktop Nav Links */}
          {/* Desktop Nav Links - Centered and allows horizontal scroll if needed */}
          <div className="hidden md:flex flex-1 justify-center items-center gap-1 md:gap-2 overflow-x-auto scrollbar-hide"> {/* Removed flex-grow, added flex-1, overflow-x-auto */}
            {navItems.map((item) => {
              const sectionId = item.toLowerCase().replace(/\s/g, "");
              return (
                <a
                  key={item}
                  href={`#${sectionId}`}
                  className={`terminal-btn text-xs sm:text-sm whitespace-nowrap ${activeSection === sectionId ? 'nav-active' : ''}`}
                >
                  {item}
                </a>
              );
            })}
          </div>
          {/* Mobile Menu Dropdown */}
          {isMobileMenuOpen && (
            <div className="absolute top-full left-0 w-full bg-black/95 border-x-2 border-b-2 border-[#39ff14] md:hidden flex flex-col items-center py-4 z-40 shadow-lg"> {/* Added shadow */}
              {navItems.map((item) => {
                const sectionId = item.toLowerCase().replace(/\s/g, "");
                return (
                  <a
                    key={item}
                    href={`#${sectionId}`}
                    className={`terminal-btn w-11/12 text-center mb-2 text-sm ${activeSection === sectionId ? 'nav-active' : ''}`} // Use w-11/12 for slight padding
                    onClick={() => setIsMobileMenuOpen(false)} // Close menu on click
                  >
                    {item}
                  </a>
                );
              })}
            </div>
          )}
        </nav>        {/* Interactive Terminal */}
        <div className="w-full max-w-4xl mx-auto mt-8 sm:mt-12 mb-8 sm:mb-10">
          <InteractiveTerminal />
        </div>

        {/* Main Content Area */}
        <main className="max-w-4xl mx-auto px-2 sm:px-4">
          {/* About Me */}
          <section id="about" className="terminal-card mb-6 sm:mb-8 p-6 sm:p-10 bg-gradient-to-br from-[#0f2d0f] via-[#111] to-[#1a1a1a] relative overflow-visible">
            <div className="absolute -top-8 left-1/2 -translate-x-1/2 z-10">
              <div className="text-green-400 text-xs sm:text-base font-mono text-center select-none" style={{ letterSpacing: "0.1em" }}>
                <span className="block">{"{ 0xAditya }"}</span>
                <span className="block text-green-700">Cybersecurity Enthusiast</span>
              </div>
            </div>
            <h2 className="text-lg sm:text-2xl md:text-3xl font-bold glitch mb-4 mt-6 text-center tracking-widest">[ About Me ]</h2>
            <div className="flex flex-col sm:flex-row gap-6 items-center justify-center">
              <div className="relative group">
                <Image
                  src="/1.png"
                  alt="Aditya's Profile Picture"
                  width={160}
                  height={160}
                  className="rounded-full border-2 border-[#39ff14] shadow-xl w-32 h-32 sm:w-40 sm:h-40 transition-transform duration-300 group-hover:scale-105"
                  style={{ boxShadow: "0 0 20px #39ff14aa" }} /* Simplified shadow */
                />
                <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 px-2 py-1 bg-black/80 border border-[#39ff14] rounded text-green-300 text-xs font-mono animate-pulse">
                  {"0xAditya"}
                </div>
              </div>
              {/* Separator for larger screens */}
              <div className="hidden sm:block w-px bg-gradient-to-b from-transparent via-[#39ff14]/60 to-transparent mx-4 self-stretch shadow-[0_0_8px_#39ff14]"></div>
              <div className="flex-1 flex flex-col gap-2">
                <p className="text-xs sm:text-base md:text-lg leading-relaxed text-green-100 bg-black/60 rounded p-3 shadow-inner border border-[#39ff14]/30">
                  Hi, I&apos;m <span className="text-green-400 font-bold">Aditya Kumar Tiwari</span>, a passionate <span className="text-green-300">Cybersecurity Specialist</span> and <span className="text-green-300">Full-Stack Developer</span>. I thrive at the intersection of technology and innovation, crafting secure and scalable solutions for real-world challenges.
                </p>
                <p className="text-xs sm:text-base md:text-lg leading-relaxed text-green-100 bg-black/60 rounded p-3 shadow-inner border border-[#39ff14]/30">
                  Currently pursuing a <span className="text-green-400 font-bold">BCA in Cybersecurity</span> at Sushant University, I specialize in <span className="text-green-300">Python, JavaScript, Linux, and Cloud Computing</span>. My mission is to combine security and creativity to build impactful digital experiences.
                </p>
                {/* Social Icons and Badges */}
                <div className="flex flex-col sm:flex-row gap-4 items-center mt-4"> {/* Increased mt from 2 to 4 */}
                  {/* Social Icons */}
                  <div className="flex gap-3">
                    <a href="mailto:aditya@email.com" className="about-icon-btn" aria-label="Email"><Mail size={22} /></a>
                    <a href="#" className="about-icon-btn" aria-label="LinkedIn"><Linkedin size={22} /></a>
                    <a href="#" className="about-icon-btn" aria-label="GitHub"><Github size={22} /></a>
                    <button onClick={handleDownloadPdf} className="about-icon-btn" aria-label="Download Resume"><Download size={22} /></button>
                  </div>
                  {/* Animated Badges */}
                  <div className="flex gap-2 flex-wrap">
                    <span className="about-badge">Cybersecurity</span>
                    <span className="about-badge">Full-Stack</span>
                    <span className="about-badge">Cloud</span>
                    <span className="about-badge">Linux</span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Skills */}
          <section id="skills" className="terminal-card mb-6 sm:mb-8 p-4 sm:p-6">
            <h2 className="text-lg sm:text-xl md:text-2xl font-bold glitch mb-2">[ Skills ]</h2>
            <div className="space-y-4">
              <SkillBar name="Penetration Testing" percent={90} />
              <SkillBar name="React / Next.js" percent={85} />
              <SkillBar name="Node.js" percent={80} />
              <SkillBar name="Python" percent={75} />
              <SkillBar name="Network Security" percent={80} />
              <SkillBar name="Linux" percent={70} />
              <SkillBar name="Reverse Engineering" percent={60} />
              <SkillBar name="Cloud Security" percent={65} />
            </div>
          </section>

          {/* Tech Stack */}
          <section id="techstack" className="terminal-card mb-6 sm:mb-8 p-4 sm:p-6">
            <h2 className="text-lg sm:text-xl md:text-2xl font-bold glitch mb-2">[ Tech Stack ]</h2>
            <div className="flex flex-wrap gap-2">
              {["Next.js", "React", "Node.js", "Express", "MongoDB", "PostgreSQL", "Python", "Flask", "Linux", "Docker", "AWS", "Nmap", "Burp Suite", "Metasploit", "Wireshark"].map((tech) => (
                <span key={tech} className="px-2 sm:px-3 py-1 border border-[#39ff14] rounded bg-black/80 text-green-200 text-xs sm:text-sm mb-2 hover:bg-[#39ff14] hover:text-black transition duration-200 cursor-default">{tech}</span>
              ))}
            </div>
          </section>

          {/* Professional Experience */}
          <section id="experience" className="terminal-card mb-6 sm:mb-8 p-4 sm:p-6">
            <h2 className="text-lg sm:text-xl md:text-2xl font-bold glitch mb-2">[ Professional Experience ]</h2>
            <div className="space-y-4">
              <ExperienceCard
                title="Mentor (Part-time)"
                company="JhaMobi Technologies Pvt. Ltd., Remote"
                period="Aug 2024 - Present"
                details={[
                  "Provided technical mentorship in cybersecurity to junior professionals and interns.",
                  "Guided team members through vulnerability assessments, threat analysis, and incident response strategies.",
                  "Supported learners in mastering security frameworks, cloud security, and penetration testing.",
                  "Ensured mentees understood best practices for securing networks and applications in real-world environments."
                ]}
              />
              <ExperienceCard
                title="Cybersecurity Intern"
                company="Null, Remote"
                period="Jun 2024 - Present"
                details={[
                  "Conducted vulnerability assessments and implemented robust network security protocols.",
                  "Monitored network traffic and responded to security incidents with a focus on intrusion detection.",
                  "Worked with remote teams to secure client systems, ensuring compliance with industry standards.",
                  "Gained hands-on experience with SIEM tools, firewall configurations, and incident response strategies."
                ]}
              />
              <ExperienceCard
                title="Cybersecurity and AI/ML Intern"
                company="Quantam Pvt. Ltd., Gurugram, Haryana"
                period="Oct 2024 - Present"
                details={[
                  "Focused on hands-on projects in cybersecurity and AI/ML, applying theoretical knowledge to real-world challenges.",
                  "Collaborated with the Counseling Team and worked under the guidance of a dedicated mentor.",
                  "Enhanced understanding of cybersecurity protocols, AI/ML applications, confidentiality, and data protection.",
                  "Gained insights into corporate ethics and best practices for data security in a professional environment."
                ]}
              />
            </div>
          </section>

          {/* Projects */}
          <section id="projects" className="terminal-card mb-6 sm:mb-8 p-4 sm:p-6">
            <h2 className="text-lg sm:text-xl md:text-2xl font-bold glitch mb-2">[ Projects ]</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <ProjectCard title="Flappy" description="A 2D game built using HTML, CSS, and JavaScript. A fun project for game enthusiasts." />
              <ProjectCard title="Movie Website (Cinesphere)" description="A movie website developed to provide high-rated movies for free. Ideal for entertainment lovers." />
              <ProjectCard title="Innova" description="A modern, responsive e-commerce website designed for a seamless shopping experience. Great for e-commerce enthusiasts." />
              <ProjectCard title="SEO Optimized Website" description="An SEO-optimized website to improve search engine visibility using best practices. Perfect for SEO and digital marketing enthusiasts." />
              <ProjectCard title="MovieVerse Explorer" description="A movie exploration site with dynamic content fetched from APIs to provide the latest movie info. Great for API and movie lovers." />
              <ProjectCard title="Animate Responsive Tales" description="A responsive and animated website showcasing creative storytelling techniques using animations. Perfect for animation and UI design enthusiasts." />
              <ProjectCard title="PropDekho" description="A real estate website that helps users find and explore properties easily. Ideal for those interested in real estate or property search." />
              <ProjectCard title="Real Estate Chatbot" description="A chatbot developed for real estate inquiries, offering users assistance in finding properties. Ideal for chatbot development enthusiasts." />
            </div>
          </section>

          {/* Achievements */}
          <section id="achievements" className="terminal-card mb-6 sm:mb-8 p-4 sm:p-6">
            <h2 className="text-lg sm:text-xl md:text-2xl font-bold glitch mb-2">[ Achievements ]</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"> {/* Adjusted grid for 3 items */}
              <AchievementCard title="University Sports Leader" description="Sushant University | 2023 - 2024. Led the university's sports teams, organizing and managing multiple events that increased student participation by 30%. Spearheaded inter-university competitions, securing top positions in regional tournaments." />
              <AchievementCard title="NSS Leader(President)" description="National Service Scheme | 2023 - Present. Coordinated and led various community service initiatives, driving awareness on key social issues. Managed a team of 120+ volunteers, organizing events and workshops focusing on health and education." />
              <AchievementCard title="Subhead at Gaming Nexus (Gaming Club)" description="Gaming Nexus | 2023 - Present. Oversaw gaming tournaments and interactive workshops aimed at promoting esports on campus. Facilitated strategic partnerships with external gaming sponsors, leading to a 50% increase in club funding. Mentored new members in strategy-based games, focusing on team-building and competitive gaming skills." />
            </div>
          </section>

          {/* Certifications */}
          <section id="certifications" className="terminal-card mb-6 sm:mb-8 p-4 sm:p-6">
            <h2 className="text-lg sm:text-xl md:text-2xl font-bold glitch mb-2">[ Certifications ]</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <CertificationCard title="Foundations of Cybersecurity" issuer="Issued by Google, Issued Aug 2024." />
              <CertificationCard title="Cisco Cyber Threat Management" issuer="Issued by CISCO, Currently in progress as of July 2024." />
              <CertificationCard title="OSForensics Triage Certification" issuer="Issued by OSForensics by PassMark Software, Currently in progress as of July 2024." />
              <CertificationCard title="Cisco Computer Hardware Basics" issuer="Issued by CISCO, Currently in progress as of July 2024." />
              <CertificationCard title="Cybersecurity for Everyone" issuer="Issued by University of Maryland, College Park, Issued July 2024." />
              <CertificationCard title="Endpoint Security" issuer="Issued by Cisco, Issued Jul 2024." />
              <CertificationCard title="ISO 27001 Course" issuer="Issued by AKITRA, Issued Nov 2024." />
              <CertificationCard title="Digital Footprint" issuer="Issued by United Latino Students Association, Issued Aug 2024." />
              <CertificationCard title="Ethical Hacker" issuer="Issued by Cisco, Issued July 2024." />
              <CertificationCard title="Introduction to Cybersecurity" issuer="Issued by Cisco, Issued Jul 2024." />
              <CertificationCard title="Introduction to Prompt Engineering for Generative AI" issuer="Issued by LinkedIn, Issued July 2024." />
              <CertificationCard title="Network Support and Security" issuer="Issued by Cisco, Issued July 2024." />
              <CertificationCard title="Recent Advances in Freeform Electronics" issuer="Issued by Yonsei University, Issued July 2024." />
              <CertificationCard title="Technical Support Fundamental" issuer="Issued by Google, Issued July 2024." />
              <CertificationCard title="Computer Architecture: Digital Components" issuer="Issued by Great Learning, Issued Jun 2024." />
              <CertificationCard title="Excel for Beginners" issuer="Issued by Great Learning, Issued Jun 2024." />
              <CertificationCard title="Excel for Intermediate Level" issuer="Issued by Great Learning, Issued Jun 2024." />
              <CertificationCard title="Introduction to Cyber Security" issuer="Issued by Great Learning, Issued Jun 2024." />
              <CertificationCard title="Linux Tutorial" issuer="Issued by Great Learning, Issued Jun 2024." />
              <CertificationCard title="Linux Tutorial - Networking Basics" issuer="Issued by Cisco, Issued Jun 2024." />
              <CertificationCard title="Prompt Engineering for ChatGPT" issuer="Issued by Great Learning, Issued Jun 2024." />
            </div>
          </section>

          {/* Blog */}
          <section id="blog" className="terminal-card mb-6 sm:mb-8 p-4 sm:p-6">
            <h2 className="text-lg sm:text-xl md:text-2xl font-bold glitch mb-2">[ Blog ]</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <BlogCard title="Blog Post Title" description="A brief introduction to the blog post content." />
              {/* Add more blog cards as needed */}
            </div>
          </section>

          {/* Hacker Tools */}
          <section id="tools" className="terminal-card mb-6 sm:mb-8 p-4 sm:p-6">
            <h2 className="text-lg sm:text-xl md:text-2xl font-bold glitch mb-2">[ Hacker Tools ]</h2>
            <div className="flex flex-wrap gap-2">
              {["Nmap", "Burp Suite", "Metasploit", "Wireshark", "John the Ripper", "Hydra", "Gobuster", "Nikto", "Sqlmap", "Aircrack-ng", "Hashcat", "Netcat", "Tcpdump", "Recon-ng", "Dirbuster"].map((tool) => (
                <span key={tool} className="px-2 sm:px-3 py-1 border border-[#39ff14] rounded bg-black/80 text-green-200 text-xs sm:text-sm mb-2 hover:bg-[#39ff14] hover:text-black transition duration-200 cursor-default">{tool}</span>
              ))}
            </div>
          </section>

          {/* Fun Facts / Hacker Stats */}
          <section id="funfacts" className="terminal-card mb-6 sm:mb-8 p-4 sm:p-6">
            <h2 className="text-lg sm:text-xl md:text-2xl font-bold glitch mb-2">[ Fun Facts & Hacker Stats ]</h2>
            <ul className="list-disc list-inside text-green-100 space-y-2 text-xs sm:text-sm">
              <li>Lines of code written: <span className="text-green-400">100,000+</span></li>
              <li>CTF challenges solved: <span className="text-green-400">250+</span></li>
              <li>Linux distros tried: <span className="text-green-400">12</span></li>
              <li>Security blogs read per week: <span className="text-green-400">20+</span></li>
              <li>Favorite hacking movie: <span className="text-green-400">Mr. Robot</span></li>
              <li>Favorite editor: <span className="text-green-400">VS Code (with a terminal theme!)</span></li>
            </ul>
          </section>

          {/* Testimonials */}
          <section id="testimonials" className="terminal-card mb-6 sm:mb-8 p-4 sm:p-6">
            <h2 className="text-lg sm:text-xl md:text-2xl font-bold glitch mb-2">[ Testimonials ]</h2>
            <div className="grid grid-cols-1 gap-4"> {/* Only one testimonial shown */}
              <TestimonialCard
                name="Siddharth Anand (Aditya's Teacher)"
                text="Aditya is a stellar student and proficient future technology professional... he has all the qualities to become an influential leader and a professional game changer... he is actively able to perform the most daunting tasks with enormous ease... as a mentor it is a privilege to impart professional skills to this stupendous future leader and top performer... 11 on 10 to Aditya... keep rocking and kick ass..."
              />
              {/* Add more testimonial cards as needed */}
            </div>
          </section>

          {/* Contact Me */}
          <section id="contact" className="terminal-card mb-6 sm:mb-8 p-4 sm:p-6">
            <h2 className="text-lg sm:text-xl md:text-2xl font-bold glitch mb-2">[ Contact Me ]</h2>
            <p className="text-center mb-4 text-sm sm:text-base">Feel free to reach out to me for collaborations, projects, or just a friendly chat.</p>
            <form className="flex flex-col gap-4">
              <input type="text" placeholder="Your Name" className="p-2 rounded bg-black border border-[#39ff14] text-[#39ff14] focus:ring-2 focus:ring-green-400 transition w-full text-sm sm:text-base" />
              <input type="email" placeholder="Your Email" className="p-2 rounded bg-black border border-[#39ff14] text-[#39ff14] focus:ring-2 focus:ring-green-400 transition w-full text-sm sm:text-base" />
              <textarea placeholder="Your Message" className="p-2 rounded bg-black border border-[#39ff14] text-[#39ff14] focus:ring-2 focus:ring-green-400 transition w-full text-sm sm:text-base" rows={4}></textarea>
              <button type="submit" className="terminal-btn text-sm sm:text-base self-center">Send Message</button> {/* Centered button */}
            </form>
          </section>
        </main>
      </div>
      {/* Decorative Earth image */}
      <div className="absolute bottom-0 right-0 w-24 sm:w-40 opacity-60 z-0 pointer-events-none">
        <Image
          src="/earth_nightmap.jpg"
          alt="Earth at night"
          width={256}
          height={256}
          className="rounded-full"
        />
      </div>
      {/* Terminal/Matrix styles */}
      <style jsx global>{`
        html {
          scroll-behavior: smooth; /* Enable smooth scrolling */
        }
        body {
          background: #0f0f0f;
          color: #39ff14;
          font-family: 'Share Tech Mono', 'Fira Mono', 'Consolas', monospace;
        }
        .matrix-bg {
          position: fixed;
          top: 0; left: 0; width: 100vw; height: 100vh;
          z-index: 0;
          pointer-events: none;
          opacity: 0.25; /* Adjusted opacity */
        }
        .glitch {
          color: #39ff14;
          position: relative;
          text-shadow:
            0 0 2px #39ff14,
            0 0 10px #39ff14,
            2px 0 2px #00fff9,
            -2px 0 2px #ff00ea;
          animation: glitch 1s infinite linear alternate-reverse; /* Slightly faster glitch */
        }
        @keyframes glitch {
          0% { text-shadow: 2px 0 #00fff9, -2px 0 #ff00ea, 0 0 1px #39ff14; }
          10% { text-shadow: -1px -1px #00fff9, 1px 1px #ff00ea, 0 0 2px #39ff14; }
          20% { text-shadow: 1px -1px #00fff9, -1px 1px #ff00ea, 0 0 3px #39ff14; }
          30% { text-shadow: -2px 2px #00fff9, 2px -2px #ff00ea, 0 0 1px #39ff14; }
          40% { text-shadow: 1px 0 #00fff9, -1px 0 #ff00ea, 0 0 2px #39ff14; }
          50% { text-shadow: 0 0 10px #39ff14, 0 0 2px #39ff14; }
          60% { text-shadow: 0 2px #00fff9, 0 -2px #ff00ea, 0 0 1px #39ff14; }
          70% { text-shadow: -1px 0 #00fff9, 1px 0 #ff00ea, 0 0 2px #39ff14; }
          80% { text-shadow: 1px 1px #00fff9, -1px -1px #ff00ea, 0 0 3px #39ff14; }
          90% { text-shadow: -2px -1px #00fff9, 2px 1px #ff00ea, 0 0 1px #39ff14; }
          100% { text-shadow: 2px 0 #00fff9, -2px 0 #ff00ea, 0 0 1px #39ff14; }
        }
        .terminal-card {
          background: #111; /* Simple solid background */
          border: 2px solid #39ff14;
          border-radius: 0.75rem;
          box-shadow: 0 0 16px #39ff1455;
          margin-bottom: 2rem;
          padding: 2rem 1.5rem;
          font-family: 'Share Tech Mono', 'Fira Mono', 'Consolas', monospace;
          color: #39ff14;
          position: relative;
          overflow: hidden;
          transition: transform 0.3s, box-shadow 0.3s;
        }
        @keyframes card-glow {
          0% { box-shadow: 0 0 16px #39ff1455, 0 0 6px #00fff988, inset 0 0 20px rgba(10, 20, 10, 0.8);}
          100% { box-shadow: 0 0 32px #39ff14cc, 0 0 18px #00fff9cc, inset 0 0 32px #39ff1444;}
        }
        .terminal-card:hover {
           transform: translateY(-5px) scale(1.01);
           box-shadow: 0 0 32px #39ff14cc, 0 0 12px #00fff9cc, inset 0 0 16px rgba(10, 20, 10, 0.7);
           background: rgba(10, 20, 10, 0.99);
        }
        .terminal-btn, .terminal-icon-btn {
          background: #111;
          color: #39ff14;
          border: 1.5px solid #39ff14;
          border-radius: 0.25rem;
          padding: 0.5rem 1.2rem;
          font-family: inherit;
          margin-right: 0.5rem;
          margin-bottom: 0.5rem;
          transition: background 0.2s, color 0.2s, box-shadow 0.3s, border-color 0.3s;
          box-shadow: 0 0 5px #39ff1466, inset 0 0 3px #39ff1433;
          animation: btn-glow 2.5s infinite alternate;
        }
        @keyframes btn-glow {
          0% { box-shadow: 0 0 5px #39ff1466, 0 0 2px #00fff966; }
          100% { box-shadow: 0 0 16px #39ff14cc, 0 0 8px #00fff9cc; }
        }
        .terminal-btn:focus-visible, .terminal-icon-btn:focus-visible {
          outline: 2px solid #00fff9;
          outline-offset: 2px;
          box-shadow: 0 0 0 4px #00fff966;
        }
        .terminal-btn:hover, .terminal-icon-btn:hover {
          background: #39ff14;
          color: #0a0a0a;
          box-shadow: 0 0 18px #39ff14, 0 0 5px #00fff9;
          border-color: #00fff9;
        }
        .nav-active {
          background: #39ff14;
          color: #0a0a0a;
          box-shadow: 0 0 18px #39ff14, 0 0 5px #00fff9;
          border-color: #00fff9;
          animation: nav-glitch 1.2s infinite alternate;
        }
        @keyframes nav-glitch {
          0% { filter: none; }
          20% { filter: blur(0.5px) brightness(1.2); }
          40% { filter: none; }
          60% { filter: blur(1px) brightness(1.3); }
          80% { filter: none; }
          100% { filter: blur(0.5px) brightness(1.2); }
        }
        /* Glitch effect for headings */
        .glitch {
          color: #39ff14;
          position: relative;
          text-shadow:
            0 0 2px #39ff14,
            0 0 10px #39ff14,
            2px 0 2px #00fff9,
            -2px 0 2px #ff00ea;
          animation: glitch 1s infinite linear alternate-reverse;
        }
        @keyframes glitch {
          0% { text-shadow: 2px 0 #00fff9, -2px 0 #ff00ea, 0 0 1px #39ff14; }
          10% { text-shadow: -1px -1px #00fff9, 1px 1px #ff00ea, 0 0 2px #39ff14; }
          20% { text-shadow: 1px -1px #00fff9, -1px 1px #ff00ea, 0 0 3px #39ff14; }
          30% { text-shadow: -2px 2px #00fff9, 2px -2px #ff00ea, 0 0 1px #39ff14; }
          40% { text-shadow: 1px 0 #00fff9, -1px 0 #ff00ea, 0 0 2px #39ff14; }
          50% { text-shadow: 0 0 10px #39ff14, 0 0 2px #39ff14; }
          60% { text-shadow: 0 2px #00fff9, 0 -2px #ff00ea, 0 0 1px #39ff14; }
          70% { text-shadow: -1px 0 #00fff9, 1px 0 #ff00ea, 0 0 2px #39ff14; }
          80% { text-shadow: 1px 1px #00fff9, -1px -1px #ff00ea, 0 0 3px #39ff14; }
          90% { text-shadow: -2px -1px #00fff9, 2px 1px #ff00ea, 0 0 1px #39ff14; }
          100% { text-shadow: 2px 0 #00fff9, -2px 0 #ff00ea, 0 0 1px #39ff14; }
        }
        /* Scanline overlay for CRT effect */
        body:before {
          content: "";
          pointer-events: none;
          position: fixed;
          z-index: 9999;
          left: 0; top: 0; width: 100vw; height: 100vh;
          background: repeating-linear-gradient(
            to bottom,
            rgba(57,255,20,0.08) 0px,
            rgba(57,255,20,0.08) 1px,
            transparent 1px,
            transparent 4px
          );
          opacity: 0.5;
          mix-blend-mode: lighten;
        }
        /* Custom hacker cursor */
        html, body {
          cursor: url('data:image/svg+xml;utf8,<svg width="32" height="32" xmlns="http://www.w3.org/2000/svg"><rect width="32" height="32" fill="black"/><rect x="8" y="8" width="16" height="16" fill="lime" stroke="lime" stroke-width="2"/></svg>') 16 16, crosshair;
        }
        /* Subtle background gradient for depth */
        body {
          background: linear-gradient(135deg, #0f0f0f 0%, #1a1a1a 100%);
        }

        /* Styles for About Me Icons and Badges */
        .about-icon-btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          background: #111;
          color: #39ff14;
          border: 1.5px solid #39ff14;
          border-radius: 0.25rem;
          padding: 0.6rem;
          margin-right: 0.3rem;
          margin-bottom: 0.3rem;
          transition: background 0.2s, color 0.2s, box-shadow 0.3s, border-color 0.3s, transform 0.2s;
          box-shadow: 0 0 8px #39ff1466, inset 0 0 3px #39ff1433;
          font-size: 1.1rem;
        }
        .about-icon-btn:hover {
          background: #39ff14;
          color: #0a0a0a;
          box-shadow: 0 0 18px #39ff14, 0 0 5px #00fff9;
          border-color: #00fff9;
          transform: scale(1.12) rotate(-3deg);
        }
        .about-badge {
          display: inline-block;
          background: linear-gradient(90deg, #39ff14 60%, #00fff9 100%);
          color: #0a0a0a;
          font-weight: bold;
          border-radius: 0.5rem;
          padding: 0.3rem 0.9rem;
          font-size: 0.85rem;
          margin-bottom: 0.2rem;
          box-shadow: 0 0 8px #39ff14cc;
          animation: badge-float 2.2s infinite ease-in-out alternate;
        }
        @keyframes badge-float {
          0% { transform: translateY(0px) scale(1);}
          100% { transform: translateY(-6px) scale(1.07);}
        }

      `}</style>
    </div>
  );
}

// Helper components for skills, projects, etc.
type SkillBarProps = { name: string; percent: number };
function SkillBar({ name, percent }: SkillBarProps) {
  return (
    <div className="text-xs sm:text-sm">
      <div className="flex justify-between mb-1">
        <span>{name}</span>
        <span>{percent}%</span>
      </div>
      <div className="w-full bg-[#222] rounded h-3 border border-[#39ff14]">
        <div className="bg-[#39ff14] h-3 rounded" style={{ width: `${percent}%` }}></div>
      </div>
    </div>
  );
}

type ExperienceCardProps = { title: string; company: string; period: string; details: string[] };
function ExperienceCard({ title, company, period, details }: ExperienceCardProps) {
  return (
    <div className="mb-4 border border-[#39ff14] rounded p-3 sm:p-4 bg-black/80 hover:bg-[#111] hover:border-cyan-400 transition shadow-md hover:shadow-lg hover:shadow-cyan-500/30">
      <div className="font-bold text-green-200 text-sm sm:text-base">{title}</div>
      <div className="text-green-100 text-xs sm:text-sm">{company} {period}</div>
      <ul className="list-disc list-inside text-green-100 mt-2 text-xs sm:text-sm">
        {details.map((d: string, i: number) => <li key={i}>{d}</li>)}
      </ul>
    </div>
  );
}

type ProjectCardProps = { title: string; description: string };
function ProjectCard({ title, description }: ProjectCardProps) {
  return (
    <div className="border border-[#39ff14] rounded p-3 sm:p-4 bg-black/80 hover:bg-[#111] hover:border-cyan-400 transition shadow-md hover:shadow-lg hover:shadow-cyan-500/30">
      <div className="font-bold text-green-200 text-sm sm:text-base">{title}</div>
      <div className="text-green-100 text-xs sm:text-sm">{description}</div>
    </div>

  );
}

type AchievementCardProps = { title: string; description: string };
function AchievementCard({ title, description }: AchievementCardProps) {
  return (
    <div className="border border-[#39ff14] rounded p-3 sm:p-4 bg-black/80 hover:bg-[#111] hover:border-cyan-400 transition shadow-md hover:shadow-lg hover:shadow-cyan-500/30">
      <div className="font-bold text-green-200 text-sm sm:text-base">{title}</div>
      <div className="text-green-100 text-xs sm:text-sm">{description}</div>
    </div>
  );
}

type CertificationCardProps = { title: string; issuer?: string }; // Added optional issuer
function CertificationCard({ title, issuer }: CertificationCardProps) {
  return (
    <div className="border border-[#39ff14] rounded p-3 sm:p-4 bg-black/80 hover:bg-[#111] hover:border-cyan-400 transition text-green-200 font-semibold text-xs sm:text-sm shadow-md hover:shadow-lg hover:shadow-cyan-500/30">
      <div>{title}</div>
      {issuer && <div className="text-xs text-green-300 mt-1">{issuer}</div>} {/* Display issuer */}
    </div>
  );
}

type BlogCardProps = { title: string; description: string };
function BlogCard({ title, description }: BlogCardProps) {
  return (
    <div className="border border-[#39ff14] rounded p-3 sm:p-4 bg-black/80 hover:bg-[#111] hover:border-cyan-400 transition shadow-md hover:shadow-lg hover:shadow-cyan-500/30">
      <div className="font-bold text-green-200 text-sm sm:text-base">{title}</div>
      <div className="text-green-100 text-xs sm:text-sm">{description}</div>
    </div>
  );
}

type TestimonialCardProps = { name: string; text: string };
function TestimonialCard({ name, text }: TestimonialCardProps) {
  return (
    <div className="border border-[#39ff14] rounded p-3 sm:p-4 bg-black/80 hover:bg-[#111] hover:border-cyan-400 transition shadow-md hover:shadow-lg hover:shadow-cyan-500/30">
      <div className="italic text-green-100 text-xs sm:text-sm">&quot;{text}&quot;</div>
      <div className="mt-2 text-green-300 font-bold text-xs sm:text-sm">{name}</div>
    </div>
  );
}
