import Link from "next/link";
import type { Project } from "@/data/projects";
import Image from "next/image";
import { useState } from "react";

type Variant = "classic" | "image";
type Tokens = {
  radius?: string;
  border?: string;
  bg?: string;
  glow?: string;
  accent?: string;
};

type Props = {
  name: string;
  blurb: string;
  tech: string[];
  repo?: string;
  demo?: string;
  images: [string, string];
  variant?: Variant;
  tokens?: Tokens;
};

export default function ProjectCard({
  name,
  blurb,
  tech,
  repo,
  demo,
  images,
  variant = "image",
  tokens = {},
}: Props) {
  const [expandedImage, setExpandedImage] = useState<string | null>(null);

  // Apply default tokens if not provided
  const {
    radius = "rounded-3xl",
    border = "border border-white/10",
    bg = "bg-white/5",
    glow = "hover:shadow-[0_12px_40px_-12px_rgba(96,165,250,.45)]",
    accent = "text-[#60a5fa]",
  } = tokens;

  // Content sections
  const ImagesSection = (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {images.map((img, i) => (
        <div
          key={i}
          className={`${radius} overflow-hidden ${border} group-hover:border-white/20 transition-all duration-500 cursor-pointer`}
          onClick={() => setExpandedImage(img)}
        >
          <div className="overflow-hidden">
            <Image
              src={img}
              alt={`${name} screenshot ${i + 1}`}
              className="w-full h-full object-cover aspect-video group-hover:scale-105 transition-transform duration-500 will-change-transform"
              width={1920}
              height={1080}
            />
          </div>
        </div>
      ))}
    </div>
  );

  const InfoSection = (
    <div>
      <h3 className={`text-3xl md:text-4xl font-bold text-white mb-4 group-hover:${accent} transition-colors duration-300`}>
        {name}
      </h3>
      <p className="text-gray-300 leading-relaxed text-lg mb-6">
        {blurb}
      </p>
      <div className="flex flex-wrap gap-2 mb-8">
        {tech.map((t, i) => (
          <span
            key={i}
            className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-xs font-medium text-gray-300 hover:bg-white/10 transition-colors duration-200"
          >
            {t}
          </span>
        ))}
      </div>
      <div className="flex flex-wrap gap-4">
        {repo && (
          <a
            href={repo}
            target="_blank"
            rel="noreferrer"
            className="glass-card text-gray-300 hover:text-white px-6 py-3 rounded-full text-sm font-medium border-white/10 hover:border-white/20 transition-colors duration-300"
          >
            View Code
          </a>
        )}
        {demo && (
          <a
            href={demo}
            target="_blank"
            rel="noreferrer"
            className="bg-white text-black px-6 py-3 rounded-full text-sm font-bold shadow-lg hover:scale-105 transition-transform duration-300"
          >
            Live Demo
          </a>
        )}
      </div>
    </div>
  );

  return (
    <>
      <article
        className={`group ${radius} ${bg} backdrop-blur-lg ${border} p-8 md:p-12 relative overflow-hidden hover:-translate-y-1 transition-all duration-500 ${glow} scroll-reveal`}
      >
        {/* Ambient Glow Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#60a5fa]/5 via-transparent to-[#3b82f6]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>

        <div className="relative z-10">
          {variant === "classic" ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div>{InfoSection}</div>
              <div>{ImagesSection}</div>
            </div>
          ) : (
            <div className="space-y-8">
              {ImagesSection}
              {InfoSection}
            </div>
          )}
        </div>
      </article>

      {/* Fullscreen Image Modal */}
      {expandedImage && (
        <div
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4 md:p-8 backdrop-blur-lg"
          onClick={() => setExpandedImage(null)}
        >
          <div className="relative max-w-7xl max-h-full">
            <img
              src={expandedImage}
              alt={`${name} expanded view`}
              className="max-w-full max-h-[90vh] object-contain shadow-2xl"
            />
            <button
              className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/10 text-white flex items-center justify-center hover:bg-white/20 transition-colors"
              onClick={() => setExpandedImage(null)}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>
        </div>
      )}
    </>
  );
}
