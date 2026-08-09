import React from "react";
import { Code } from "lucide-react";
import {
  Git,
  GitHubDark,
  JavaScript,
  TypeScript,
  Python,
  Java,
  TailwindCSS,
  React as ReactIcon,
  NodeJs,
  NextJs,
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
  tailwind: TailwindCSS,
  tailwindcss: TailwindCSS,
  react: ReactIcon,
  reactjs: ReactIcon,
  nodejs: NodeJs,
  node: NodeJs,
  nextjs: NextJs,
  next: NextJs,
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
};

export function getSkillIcon(skillSlug: string, size: number = 28, className?: string): React.ReactNode {
  const normalizedSlug = skillSlug.toLowerCase().trim();
  const IconComponent = ICON_MAP[normalizedSlug];

  if (IconComponent) {
    return <IconComponent size={size} className={className} />;
  }

  return <Code size={size} className={className || "text-primary"} />;
}
