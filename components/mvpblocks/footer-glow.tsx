'use client';

import { Twitter as BrandIconTwitter,  Instagram as BrandIconInstagram, Mail as BrandIconMail, Linkedin as BrandIconLinkedin, Github as BrandIconGithub } from 'lucide-react';
export default function FooterGlow() {
  return (
    <footer className="relative z-10 mt-8 overflow-hidden pb-8" style={{fontFamily: 'Poppins, sans-serif'}}>
      <style jsx global>{`
  .glass {
    backdrop-filter: blur(6px) saturate(180%);
    background: linear-gradient(135deg, #0a0613 0%, #150d27 100%);
    border: 1px solid rgba(69, 52, 223, 0.1);
    display: flex;
    justify-content: center;
    align-items: center;
    transition: all 0.3s;
  }
  .dark .glass {
    backdrop-filter: blur(6px);
    background: radial-gradient(
      circle at 70% 30%,
      rgba(155, 135, 245, 0.15) 0%,
      rgba(13, 10, 25, 0) 60%
    ) !important;
    border: 1px solid rgba(37, 40, 199, 0.05) !important;
    border-radius: 16px !important;
    display: flex;
    justify-content: space-around;
    align-items: center;
  }
`}</style>
      <div className="pointer-events-none absolute top-0 left-1/2 z-0 h-full w-full -translate-x-1/2 select-none">
        <div className="absolute -top-32 left-1/4 h-72 w-72 rounded-full bg-purple-600/20 blur-3xl"></div>
        <div className="absolute right-1/4 -bottom-24 h-80 w-80 rounded-full bg-purple-600/20 blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 h-60 w-60 -translate-x-1/2 -translate-y-1/2 rounded-full bg-purple-600/10 blur-3xl"></div>
        
      </div>
      <div className="glass relative mx-auto flex max-w-screen flex-col items-center gap-8 rounded-2xl px-6 py-10 md:flex-row md:items-start md:justify-between md:gap-12">
        <div className="flex flex-col items-center md:items-start">
          <a href="#" className="mb-4 flex items-center gap-2">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-rose-400 to-rose-700 text-2xl font-extrabold text-white shadow-md">
              <img src="/icon.png" alt="" className="rounded-lg" />
            </span>
            <span className="bg-gradient-to-r from-gray-100 via-gray-400 to-gray-200 bg-clip-text text-xl font-bold text-transparent">
              EraCrux
            </span>
          </a>
          <p className="text-foreground mb-6 max-w-xs text-center text-sm md:text-left">
            EraCrux is your go-to platform for data analytics, offering powerful tools to clean, organize, and visualize your data effortlessly.
          </p>
          <div className="mt-2 flex gap-3 text-sky-800">
            <a
              href="https://x.com/era_crux"
              aria-label="Twitter"
              className="hover:text-foreground transition"
            >
              <BrandIconTwitter/>
            </a>
            <a
              href="https://www.instagram.com/reel/DMZcH1UTyDu/?igsh=NmpwZTZva2dhaDN2"
              aria-label="Instagram"
              className="hover:text-foreground transition"
            >
              <BrandIconInstagram />
            </a>
            <a
              href="https://www.linkedin.com/company/eracrux"
              aria-label="LinkedIn"
              className="hover:text-foreground transition"
            >
              <BrandIconLinkedin />
            </a>
            <a
              href="mailto:eracruxofficial@gmail.com"
              aria-label="mail"
              className="hover:text-foreground transition"
            >
              <BrandIconMail />
            </a>
            <a
              href="https://github.com/EraCruxOfficial/EraCrux"
              aria-label="Github"
              className="hover:text-foreground transition"
            >
              <BrandIconGithub />
            </a>
          </div>
        </div>
        <nav className="flex w-full flex-col gap-9 text-center md:w-auto md:flex-row md:justify-end md:text-left">
          <div>
            <div className="mb-3 text-xs font-semibold tracking-widest bg-gradient-to-r from-gray-100 via-gray-400 to-gray-200 bg-clip-text text-xl font-bold text-transparent uppercase">
              Product
            </div>
            <ul className="space-y-2">
              <li>
                <a href="#features" className="text-foreground/70">
                  Features
                </a>
              </li>
              <li>
                <a href="/pricing" className="text-foreground/70">
                  Pricing
                </a>
              </li>
              <li>
                <a href="/login" className="text-foreground/70">
                  Integrations
                </a>
              </li>
              <li>
                <a href="https://github.com/EraCruxOfficial/EraCrux" className="text-foreground/70">
                  Updates
                </a>
              </li>
            </ul>
          </div>
          <div>
            <div className="mb-3 text-xs font-semibold tracking-widest bg-gradient-to-r from-gray-100 via-gray-400 to-gray-200 bg-clip-text text-xl font-bold text-transparent uppercase">
              Company
            </div>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-foreground/70">
                  About
                </a>
              </li>
              <li>
                <a href="#" className="text-foreground/70">
                  Careers
                </a>
              </li>
              <li>
                <a href="#" className="text-foreground/70">
                  Blog
                </a>
              </li>
              <li>
                <a href="#" className="text-foreground/70">
                  Contact
                </a>
              </li>
            </ul>
          </div>
          <div>
            <div className="mb-3 text-xs font-semibold tracking-widest bg-gradient-to-r from-gray-100 via-gray-400 to-gray-200 bg-clip-text text-xl font-bold text-transparent uppercase">
              Resources
            </div>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-foreground/70">
                  Docs
                </a>
              </li>
              <li>
                <a href="#" className="text-foreground/70">
                  Community
                </a>
              </li>
              <li>
                <a href="#" className="text-foreground/70">
                  Support
                </a>
              </li>
              <li>
                <a href="#" className="text-foreground/70">
                  Security
                </a>
              </li>
            </ul>
          </div>
        </nav>
      </div>
      <div className="text-foreground relative z-10 mt-10 text-center text-xs">
        <span>&copy; 2025 EraCrux. All rights reserved.</span>
      </div>
    </footer>
  );
}
