"use client";

import Link from "next/link";
import { Mail, Phone, MapPin, Heart } from "lucide-react";
import { SiFacebook, SiLinkerd, SiInstagram, SiYoutube } from "@icons-pack/react-simple-icons";

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
  { icon: SiFacebook, label: "Facebook" },
  { icon: SiLinkerd, label: "LinkedIn" },
  { icon: SiInstagram, label: "Instagram" },
  { icon: SiYoutube, label: "YouTube" },
];

export function AppFooter() {
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
                  <social.icon size={16} />
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