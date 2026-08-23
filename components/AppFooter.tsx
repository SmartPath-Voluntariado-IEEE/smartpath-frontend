"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Mail, Phone, MapPin, Heart } from "lucide-react";

const FacebookIcon = () => (
  <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
  </svg>
);

const LinkedinIcon = () => (
  <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24">
    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
  </svg>
);

const InstagramIcon = () => (
  <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24">
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
  </svg>
);

const YoutubeIcon = () => (
  <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24">
    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
  </svg>
);

const PRODUCT_LINKS = [
  { href: "#", label: "Cómo funciona" },
  { href: "#", label: "Casos de éxito" },
  { href: "#", label: "Blog" },
];

const COMPANY_LINKS = [
  { href: "#", label: "Sobre nosotros" },
  { href: "#", label: "Carreras" },
  { href: "#", label: "Prensa" },
  { href: "#", label: "Contacto" },
];

const LEGAL_LINKS = [
  { href: "#", label: "Privacidad" },
  { href: "#", label: "Términos" },
  { href: "#", label: "Cookies" },
];

const SOCIALS = [
  { icon: FacebookIcon, label: "Facebook" },
  { icon: LinkedinIcon, label: "LinkedIn" },
  { icon: InstagramIcon, label: "Instagram" },
  { icon: YoutubeIcon, label: "YouTube" },
];

export function AppFooter() {
  const pathname = usePathname();
  if (pathname === "/onboarding") {
    return null;
  }
  return (
    <footer className="bg-gradient-to-br from-[#0B0F2E] via-[#151B3D] to-[#1E1032] text-white">
      <div className="mx-auto max-w-7xl px-6 py-14">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-5">
          {/* Marca */}
          <div className="md:col-span-2">
            <Link href="/" className="flex items-center gap-2">
              <img src="/img/LOGOUNI.png" alt="SmartPath Logo" className="h-9 w-auto object-contain" />
              <span className="font-display text-xl font-bold">Smartpath</span>
            </Link>
            <p className="mt-3 text-sm text-white/60">
              Tu ruta inteligente
              <br />
              hacia el empleo tech.
            </p>
            <div className="mt-5 flex items-center gap-3">
              {SOCIALS.map((social, i) => (
                <span
                  key={i}
                  aria-label={social.label}
                  className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-white"
                >
                  <social.icon />
                </span>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-white">PRODUCTO</h3>
            <ul className="mt-4 space-y-2.5">
              {PRODUCT_LINKS.map((item, i) => (
                <li key={i}>
                  <span className="text-sm text-white/60">{item.label}</span>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-white">EMPRESA</h3>
            <ul className="mt-4 space-y-2.5">
              {COMPANY_LINKS.map((item, i) => (
                <li key={i}>
                  <span className="text-sm text-white/60">{item.label}</span>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-white">LEGAL</h3>
            <ul className="mt-4 space-y-2.5">
              {LEGAL_LINKS.map((item, i) => (
                <li key={i}>
                  <span className="text-sm text-white/60">{item.label}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-2 border-t border-white/10 pt-8 text-sm text-white/70 md:flex-row md:items-center md:justify-end md:gap-8">
          <span className="flex items-center gap-1.5">
            Hecho con <Heart className="h-4 w-4 fill-red-500 text-red-500" /> en Perú
          </span>
          <span className="flex items-center gap-1.5">
            <Mail className="h-4 w-4" /> info@smartpath.pe
          </span>
          <span className="flex items-center gap-1.5">
            <Phone className="h-4 w-4" /> +51 987 654 321
          </span>
          <span className="flex items-center gap-1.5">
            <MapPin className="h-4 w-4" /> Lima, Perú
          </span>
        </div>

        
        <div className="mt-6 border-t border-white/10 pt-6 text-center text-xs text-white/40">
          © 2026 Smartpath. Todos los derechos reservados.
        </div>
      </div>
    </footer>
  );
}