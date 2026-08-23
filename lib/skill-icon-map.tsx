import React from "react";
import { Code, Terminal } from "lucide-react";
import {
  Git,
  GitHubDark,
  JavaScript,
  TypeScript,
  Python,
  Java,
  CSharp,
  CPlusPlus,
  PHP,
  TailwindCSS,
  React as ReactIcon,
  NodeJs,
  NextJs,
  Angular,
  VueJs,
  Django,
  FastAPI,
  Spring,
  MongoDB,
  MySQL,
  PostgreSQL,
  Docker,
  Redis,
  GraphQL,
  Kubernetes,
  AWS,
  GoogleCloud,
  Azure,
  Tensorflow,
  HTML5,
  CSS3,
  Linux,
  Bash,
} from "developer-icons";

const ICON_MAP: Record<string, React.ComponentType<{ size?: number; className?: string }>> = {
  git: Git,
  github: GitHubDark,
  html: HTML5,
  html5: HTML5,
  css: CSS3,
  css3: CSS3,
  javascript: JavaScript,
  js: JavaScript,
  typescript: TypeScript,
  ts: TypeScript,
  python: Python,
  java: Java,
  csharp: CSharp,
  "c#": CSharp,
  cpp: CPlusPlus,
  "c++": CPlusPlus,
  php: PHP,
  tailwind: TailwindCSS,
  tailwindcss: TailwindCSS,
  react: ReactIcon,
  reactjs: ReactIcon,
  nodejs: NodeJs,
  node: NodeJs,
  nextjs: NextJs,
  next: NextJs,
  angular: Angular,
  vue: VueJs,
  vuejs: VueJs,
  django: Django,
  fastapi: FastAPI,
  springboot: Spring,
  spring: Spring,
  mongodb: MongoDB,
  mongo: MongoDB,
  mysql: MySQL,
  postgres: PostgreSQL,
  postgresql: PostgreSQL,
  docker: Docker,
  redis: Redis,
  graphql: GraphQL,
  kubernetes: Kubernetes,
  k8s: Kubernetes,
  aws: AWS,
  gcp: GoogleCloud,
  googlecloud: GoogleCloud,
  azure: Azure,
  tensorflow: Tensorflow,
  linux: Linux,
  bash: Bash,
};

export function getSkillIcon(skillSlug: string, size: number = 14, className?: string): React.ReactNode {
  const normalizedSlug = (skillSlug || "").toLowerCase().trim().replace(/[-_]/g, "");
  
  // Try direct match or stripped match
  const IconComponent = ICON_MAP[skillSlug.toLowerCase()] || ICON_MAP[normalizedSlug];

  if (IconComponent) {
    return <IconComponent size={size} className={className} />;
  }

  return <Terminal size={size} className={className || "opacity-70"} />;
}
