// Minimal inline icon set (stroke-based, currentColor). No external dependency.
import type { SVGProps } from "react";

const base = (props: SVGProps<SVGSVGElement>) => ({
  width: 20,
  height: 20,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.8,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  ...props,
});

export const IconHome = (p: SVGProps<SVGSVGElement>) => (
  <svg {...base(p)}>
    <path d="M3 10.5 12 3l9 7.5" />
    <path d="M5 9.5V21h14V9.5" />
    <path d="M9 21v-6h6v6" />
  </svg>
);
export const IconExplore = (p: SVGProps<SVGSVGElement>) => (
  <svg {...base(p)}>
    <circle cx="11" cy="11" r="7" />
    <path d="m16 16 5 5" />
  </svg>
);
export const IconClasses = (p: SVGProps<SVGSVGElement>) => (
  <svg {...base(p)}>
    <rect x="3" y="4" width="18" height="13" rx="2" />
    <path d="M8 21h8M12 17v4" />
  </svg>
);
export const IconProjects = (p: SVGProps<SVGSVGElement>) => (
  <svg {...base(p)}>
    <path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2Z" />
  </svg>
);
export const IconHomework = (p: SVGProps<SVGSVGElement>) => (
  <svg {...base(p)}>
    <path d="M5 3h9l5 5v13a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1Z" />
    <path d="M14 3v5h5M8 13h8M8 17h6" />
  </svg>
);
export const IconQuiz = (p: SVGProps<SVGSVGElement>) => (
  <svg {...base(p)}>
    <circle cx="12" cy="12" r="9" />
    <path d="M9.5 9a2.5 2.5 0 1 1 3.5 2.3c-.8.4-1 .9-1 1.7M12 17h.01" />
  </svg>
);
export const IconProgress = (p: SVGProps<SVGSVGElement>) => (
  <svg {...base(p)}>
    <path d="M4 20V10M10 20V4M16 20v-7M22 20H2" />
  </svg>
);
export const IconCertificate = (p: SVGProps<SVGSVGElement>) => (
  <svg {...base(p)}>
    <circle cx="12" cy="9" r="5" />
    <path d="m9 13-2 8 5-3 5 3-2-8" />
  </svg>
);
export const IconMessages = (p: SVGProps<SVGSVGElement>) => (
  <svg {...base(p)}>
    <path d="M21 15a2 2 0 0 1-2 2H8l-5 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2Z" />
  </svg>
);
export const IconProfile = (p: SVGProps<SVGSVGElement>) => (
  <svg {...base(p)}>
    <circle cx="12" cy="8" r="4" />
    <path d="M4 20a8 8 0 0 1 16 0" />
  </svg>
);
export const IconSettings = (p: SVGProps<SVGSVGElement>) => (
  <svg {...base(p)}>
    <circle cx="12" cy="12" r="3" />
    <path d="M19.4 15a1.6 1.6 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.6 1.6 0 0 0-2.7.7 1.6 1.6 0 0 0-1.6 1.3H12a2 2 0 0 1-4 0 1.6 1.6 0 0 0-1-1.5 1.6 1.6 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.6 1.6 0 0 0-.7-2.7A1.6 1.6 0 0 0 0 12a2 2 0 0 1 4 0" />
  </svg>
);
export const IconParent = (p: SVGProps<SVGSVGElement>) => (
  <svg {...base(p)}>
    <circle cx="8" cy="8" r="3" />
    <circle cx="17" cy="9" r="2.2" />
    <path d="M2 20a6 6 0 0 1 12 0M14.5 20a4.5 4.5 0 0 1 7.5-3.3" />
  </svg>
);
export const IconAdmin = (p: SVGProps<SVGSVGElement>) => (
  <svg {...base(p)}>
    <path d="M12 3l7 3v5c0 4.5-3 8-7 10-4-2-7-5.5-7-10V6Z" />
    <path d="m9.5 12 1.8 1.8L15 10" />
  </svg>
);
export const IconSubscription = (p: SVGProps<SVGSVGElement>) => (
  <svg {...base(p)}>
    <rect x="3" y="5" width="18" height="14" rx="2" />
    <path d="M3 10h18M7 15h4" />
  </svg>
);
export const IconSun = (p: SVGProps<SVGSVGElement>) => (
  <svg {...base(p)}>
    <circle cx="12" cy="12" r="4" />
    <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
  </svg>
);
export const IconMoon = (p: SVGProps<SVGSVGElement>) => (
  <svg {...base(p)}>
    <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8Z" />
  </svg>
);
export const IconMic = (p: SVGProps<SVGSVGElement>) => (
  <svg {...base(p)}>
    <rect x="9" y="3" width="6" height="11" rx="3" />
    <path d="M5 11a7 7 0 0 0 14 0M12 18v3" />
  </svg>
);
export const IconMicOff = (p: SVGProps<SVGSVGElement>) => (
  <svg {...base(p)}>
    <path d="M9 5a3 3 0 0 1 6 0v4M15 12.3A3 3 0 0 1 9 11v-1M5 11a7 7 0 0 0 10.6 6M12 18v3" />
    <path d="m3 3 18 18" />
  </svg>
);
export const IconCamera = (p: SVGProps<SVGSVGElement>) => (
  <svg {...base(p)}>
    <path d="M4 8a2 2 0 0 1 2-2h1.5l1-2h5l1 2H18a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2Z" />
    <circle cx="12" cy="12.5" r="3.2" />
  </svg>
);
export const IconCameraOff = (p: SVGProps<SVGSVGElement>) => (
  <svg {...base(p)}>
    <path d="M4 8a2 2 0 0 1 2-2h1.5l1-2h5l1 2H18a2 2 0 0 1 2 2v9M4 8v9a2 2 0 0 0 2 2h9" />
    <path d="m3 3 18 18" />
  </svg>
);
export const IconPlay = (p: SVGProps<SVGSVGElement>) => (
  <svg {...base(p)}>
    <path d="M7 4v16l13-8Z" />
  </svg>
);
export const IconCheck = (p: SVGProps<SVGSVGElement>) => (
  <svg {...base(p)}>
    <path d="m5 12 5 5L20 6" />
  </svg>
);
export const IconChevron = (p: SVGProps<SVGSVGElement>) => (
  <svg {...base(p)}>
    <path d="m9 6 6 6-6 6" />
  </svg>
);
export const IconMenu = (p: SVGProps<SVGSVGElement>) => (
  <svg {...base(p)}>
    <path d="M3 6h18M3 12h18M3 18h18" />
  </svg>
);
export const IconClose = (p: SVGProps<SVGSVGElement>) => (
  <svg {...base(p)}>
    <path d="M6 6 18 18M18 6 6 18" />
  </svg>
);
export const IconBell = (p: SVGProps<SVGSVGElement>) => (
  <svg {...base(p)}>
    <path d="M6 9a6 6 0 0 1 12 0c0 5 2 6 2 6H4s2-1 2-6M10 20a2 2 0 0 0 4 0" />
  </svg>
);
export const IconFlame = (p: SVGProps<SVGSVGElement>) => (
  <svg {...base(p)}>
    <path d="M12 3s5 4 5 9a5 5 0 0 1-10 0c0-1.5.6-2.7 1.3-3.6C9 10 9.5 8 9 6c2 1 3 2.5 3 4 0-1 .5-4 0-7Z" />
  </svg>
);
export const IconUpload = (p: SVGProps<SVGSVGElement>) => (
  <svg {...base(p)}>
    <path d="M12 16V4M8 8l4-4 4 4M4 16v3a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-3" />
  </svg>
);
export const IconTutorials = (p: SVGProps<SVGSVGElement>) => (
  <svg {...base(p)}>
    <rect x="3" y="5" width="18" height="12" rx="2" />
    <path d="M10 9v4l4-2Z" />
    <path d="M8 21h8" />
  </svg>
);
export const IconVolume = (p: SVGProps<SVGSVGElement>) => (
  <svg {...base(p)}>
    <path d="M4 9v6h4l5 4V5L8 9Z" />
    <path d="M16 8.5a4 4 0 0 1 0 7M18.5 6a7 7 0 0 1 0 12" />
  </svg>
);
