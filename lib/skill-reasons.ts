export const SKILL_REASONS: Record<string, string> = {
  // Desarrollo de Software & Lenguajes
  python: "Esencial para automatización, pruebas técnicas, APIs y scripts de infraestructura.",
  javascript: "Base obligatoria en entrevistas de desarrollo web y lógica frontend/backend.",
  typescript: "Muy valorado por empresas para asegurar código limpio y mantenible en equipo.",
  java: "Muy demandado en grandes empresas y banca para sistemas transaccionales de misión crítica.",
  csharp: "Tecnología empresarial clave en soluciones corporativas y servicios empresariales.",
  php: "Ampliamente utilizado en desarrollo web, plataformas transaccionales y comercio electrónico.",
  golang: "Lenguaje en auge para microservicios de alto rendimiento y herramientas de infraestructura cloud.",
  r: "Lenguaje especializado en modelado estadístico y análisis cuantitativo de datos.",

  // Frameworks Frontend & UI
  react: "El framework con mayor cantidad de vacantes activas para desarrollo de interfaces interactivas.",
  nextjs: "El estándar de React para aplicaciones Full Stack modernas con renderizado rápido y SEO.",
  angular: "Framework empresarial robusto con fuerte presencia en banca y grandes corporaciones.",
  vuejs: "Framework reactivo muy valorado por su ligereza y facilidad de integración en proyectos web.",
  vue: "Framework reactivo muy valorado por su ligereza y facilidad de integración en proyectos web.",
  tailwind: "Estándar actual para maquetar interfaces ágiles con sistemas de diseño consistentes.",
  html: "Estructura semántica indispensable en maquetación web y estándares de accesibilidad.",
  css: "Requerido para replicar diseños Figma con fidelidad técnica y diseño adaptativo móvil.",

  // Frameworks Backend & APIs
  nodejs: "Muy solicitado en vacantes fullstack para arquitecturas backend ágiles en JavaScript.",
  django: "Framework completo de Python para desarrollar aplicaciones robustas con autenticación y ORM.",
  flask: "Microframework versátil de Python ideal para servicios rápidos y prototipado ágil.",
  fastapi: "Framework moderno muy pedido para construir microservicios y APIs REST rápidas en Python.",
  springboot: "El estándar corporativo para construir arquitecturas backend empresariales escalables en Java.",
  spring: "El estándar corporativo para construir arquitecturas backend empresariales escalables en Java.",
  dotnet: "Plataforma empresarial de Microsoft muy demandada en banca, seguros y corporaciones.",
  rest: "Pilar de integración esencial: diseñar y consumir endpoints para comunicar cliente y servidor.",
  "apis-rest": "Pilar de integración esencial: diseñar y consumir endpoints para comunicar cliente y servidor.",
  "api-rest": "Pilar de integración esencial: diseñar y consumir endpoints para comunicar cliente y servidor.",
  graphql: "Alternativa moderna a REST para consultar exactamente los datos requeridos en apps complejas.",

  // Bases de Datos & Almacenamiento
  sql: "Pregunta segura en entrevistas técnicas: consultas, joins y diseño de tablas relacionales.",
  postgresql: "Base de datos relacional preferida en startups y empresas tech para entornos de producción.",
  postgres: "Base de datos empresarial robusta exigida en proyectos backend profesionales.",
  mysql: "Base de datos relacional de código abierto ampliamente utilizada en sistemas web.",
  mongodb: "Base de datos NoSQL líder para arquitecturas orientadas a documentos y prototipado rápido.",
  redis: "Caché en memoria indispensable para optimizar velocidad de respuesta y sesiones de usuario.",

  // Herramientas & DevOps / Cloud
  git: "Filtro inicial de contratación: exigen dominar ramas, pull requests y trabajo colaborativo.",
  github: "Plataforma estándar para control de versiones, revisión de código y flujos colaborativos.",
  docker: "Clave en ofertas modernas para empaquetar aplicaciones y levantar entornos sin fricción.",
  kubernetes: "Estándar de orquestación en la nube muy cotizado para infraestructura y alta disponibilidad.",
  cicd: "Automatización de pruebas y despliegues continuo requerida en metodologías de desarrollo ágil.",
  linux: "Requisito recurrente para administrar servidores y ejecutar despliegues en producción.",
  aws: "Incrementa tu empleabilidad al saber desplegar y conectar servicios en la nube.",
  azure: "Alta demanda en empresas corporativas, sector público e instituciones financieras.",
  gcp: "Plataforma cloud de Google con fuerte adopción en analítica de datos, IA y despliegues modernos.",

  // Datos, IA & Analítica
  pandas: "Herramienta obligatoria en postulaciones de datos para limpieza y transformación eficiente.",
  powerbi: "Muy solicitado para puestos de analítica de negocio y toma de decisiones comerciales.",
  tableau: "Herramienta de BI de alto nivel para diseñar tableros ejecutivos y análisis visual de impacto.",
  excel: "Filtro inicial en analítica: dominio de tablas dinámicas, fórmulas avanzadas y macros para reportes.",
  machine_learning: "Competencia central para crear modelos predictivos, clasificación y automatización.",
  tensorflow: "Librería líder de Deep Learning para entrenar y desplegar modelos neuronales.",
  big_data: "Gestión de grandes volúmenes de datos requerida en analítica avanzada e ingeniería de datos.",
  statistics: "Base matemática indispensable para validar hipótesis, experimentos y modelos analíticos.",
  data_visualization: "Capacidad clave para comunicar hallazgos de datos a líderes de negocio de forma clara.",

  // Redes & Telecomunicaciones
  ccna: "Certificación de referencia que valida dominio práctico de redes, switches y routers Cisco.",
  routing_switching: "Conocimiento estructural para configurar y mantener el tráfico eficiente en redes corporativas.",
  tcp_ip: "Protocolo base de telecomunicaciones indispensable para resolver problemas de conectividad e infraestructura.",
  lan_wan: "Diseño y soporte de redes locales y distribuidas exigido en áreas de infraestructura de TI.",
  firewalls: "Seguridad perimetral obligatoria para proteger redes corporativas frente a accesos no autorizados.",
  vpn: "Configuración de túneles seguros para acceso remoto y comunicación intersedes.",
  voip: "Telefonía IP y comunicación corporativa integrada en redes de telecomunicaciones modernas.",
  structured_cabling: "Instalación y certificación física de redes de voz y datos bajo estándares internacionales.",
  sysadmin: "Administración integral de servidores, permisos, copias de seguridad y disponibilidad de sistemas.",
  fiber_optics: "Tecnología de alta velocidad para infraestructura de transmisión y enlaces de telecomunicaciones.",

  // Ciberseguridad
  network_security: "Protección de infraestructura de red frente a intrusiones, fugas de datos y ataques cibernéticos.",
  ethical_hacking: "Simulación de ataques y pentesting para identificar brechas de seguridad antes que los atacantes.",
  vulnerability_analysis: "Auditoría periódica de sistemas para clasificar y mitigar riesgos de seguridad.",
  siem: "Monitoreo y correlación de eventos de seguridad en tiempo real para centros de operaciones (SOC).",
  cryptography: "Implementación de cifrado, certificados SSL/TLS y protección de información confidencial.",
  incident_management: "Protocolos de respuesta rápida ante fallos o incidentes para mitigar el impacto operativo.",
  iso_27_001: "Estándar internacional de gestión de seguridad de la información muy requerido en auditorías de TI.",
  ids_ips: "Sistemas de detección y prevención de intrusos en redes de producción.",

  // Soporte TI & Metodologías
  hardware_maintenance: "Diagnóstico y mantenimiento preventivo y correctivo de equipos de cómputo y periféricos.",
  tech_support: "Atención a usuarios, mesa de ayuda y resolución oportuna de incidencias técnicas.",
  os: "Manejo y soporte de sistemas operativos Windows y Linux en entornos corporativos.",
  active_directory: "Gestión centralizada de usuarios, dominios, directivas de grupo y accesos en redes corporativas.",
  virtualization: "Administración de máquinas virtuales con VMware o Hyper-V para optimizar recursos de servidores.",
  troubleshooting: "Habilidad crítica para diagnosticar la causa raíz de problemas técnicos bajo presión.",
  itil: "Marco de mejores prácticas para gestión de servicios de TI, soporte y acuerdos de nivel de servicio (SLA).",
  it_inventory: "Control de activos de hardware y licencias de software para optimizar costos y cumplimiento de TI.",
  scrum: "Metodología ágil estándar exigida para trabajar coordinado con sprints, dailies y entregas continuas.",
  english: "Requisito transversal muy valorado para acceder a mejores bandas salariales y documentación global.",
  ingles: "Requisito transversal muy valorado para acceder a mejores bandas salariales y documentación global.",
};

export function getSkillReason(slug: string, roleLabel: string, isCore: boolean): string {
  const normalizedSlug = slug.toLowerCase().trim();
  if (SKILL_REASONS[normalizedSlug]) {
    return SKILL_REASONS[normalizedSlug];
  }

  // Buscar coincidencia parcial si el slug viene con prefijo o sufijo (ej: "ingles-tecnico", "docker-devops")
  const partialKey = Object.keys(SKILL_REASONS).find((key) => normalizedSlug.includes(key));
  if (partialKey) {
    return SKILL_REASONS[partialKey];
  }

  if (isCore) {
    return `Requisito clave evaluado directamente en pruebas técnicas para el puesto de ${roleLabel}.`;
  }
  return `Habilidad complementaria que añade valor a tu perfil y te distingue al postular como ${roleLabel}.`;
}
