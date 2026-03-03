import StudentPic1 from "../assets/CryptoArt.png"
import StudentPic2 from "../assets/CryptoArt.png"
import StudentPic3 from "../assets/CryptoArt.png"
import MentorPic from "../assets/CryptoArt.png"
import Pic1 from "../assets/CryptoArt.png"
import Pic2 from "../assets/CryptoArt.png"
import Pic3 from "../assets/CryptoArt.png"

const aboutData = {
  hero: {
    titleLine1: "From Academic Project",
    highlight: "to Product Evolution",
    description:
      "What started in 2022 as a minor college submission has transformed into a redesigned platform in 2026 — driven by experience, maturity, and long-term vision.",
  },

  sections: [
    {
      id: "beginning",
      type: "left-year",
      year: "2022",
      title: "2022 — The Beginning",
      content1:
        "Built as a minor project under academic supervision, the first version focused on staking simulation, dashboard visualization, and frontend architecture.",
      content2:
        "It was structured, academically strong, and technically sound — but limited in scope.",
    },

    {
      id: "presentation",
      type: "right-year",
        year: "2023",
      title: "The First Presentation",
      content1:
        "Presenting it in 2023 felt like completion. But deep down, we knew it was only a prototype.",
      content2:
        "The logic worked. The UI responded. Yet it lacked real-world depth and scalability.",
    },

    {
  id: "year-2023",
  type: "left-year",
  year: "2023",
  title: "The Shift Begins",
  content1:
    "In 2023, we stepped beyond academics and began working on real-world problems. Exposure to production environments changed how we evaluated our own system.",
  content2:
    "We started noticing architectural shortcuts, rigid state management, and areas where scalability was limited."
},

{
  id: "year-2024",
  type: "right-year",
  year: "2024",
  title: "Professional Growth",
  content1:
    "In 2024, our technical maturity improved significantly. We understood performance optimization, system modularity, and maintainable code structures.",
  content2:
    "The original project began to feel like a prototype — functional, but not engineered for longevity."
},

{
  id: "year-2025",
  type: "left-year",
  year: "2025",
  title: "The Realization",
  content1:
    "By 2025, revisiting the original codebase felt unfamiliar. Our standards had evolved.",
  content2:
    "We recognized inefficiencies in UI structure, data flow, and scalability — and knew a redesign was inevitable."
},

    {
      id: "rebuild",
      type: "right-year",
      year: "2026",
      title: "Rebuilding With Intent",
      content1:
        "In 2026, we didn’t update the system. We rebuilt it entirely.",
      content2:
        "From student mindset → to product thinking.",
    },

    {
      id: "redesign",
      type: "grid",
      title: "2026 — The Redesign",
      grid: [
        {
          heading: "Architecture",
          text: "Modular components, scalable structure, performance-driven rendering.",
        },
        {
          heading: "Experience",
          text: "Clean UI, interaction refinement, user-centered design principles.",
        },
        {
          heading: "Vision",
          text: "Built not for grades — but for long-term sustainability.",
        },
      ],
    },

    {
      id: "learning",
      type: "center",
      title: "What Four Years Taught Us",
      content1:
        "Growth is not about rewriting code. It is about rewriting mindset.",
      content2:
        "We learned scalability. We learned product discipline. We learned long-term thinking.",
    },

    {
      id: "latenights",
      type: "left",
      title: "The Late Nights",
      image: Pic1,
      content1:
        "The first version was built between lectures, assignments, and internal deadlines.",
      content2:
        "We debugged logic at midnight. Refined UI after presentations.",
    },

    {
      id: "curriculum",
      type: "right",
      title: "Beyond The Curriculum",
      image: Pic2,
      content1:
        "The syllabus taught concepts. The project taught execution.",
      content2:
        "We learned component structure and how small architectural decisions impact scalability.",
    },

    {
      id: "turning",
      type: "left",
      title: "The Turning Point",
        image: Pic3,
      content1:
        "In 2025, we revisited the codebase. And it felt unfamiliar.",
      content2:
        "Our standards were higher. Our thinking was sharper.",
    },

    {
      id: "system",
      type: "dark",
      title: "From Feature Thinking to System Thinking",
      content1:
        "The redesign wasn’t about adding features.",
      content2:
        "It was about building a foundation — one that supports analytics and future expansion.",
    },

    {
      id: "version",
      type: "center",
      title: "This Is Only Version One",
      content1:
        "The 2026 redesign marks a restart — not a finish line.",
      content2:
        "The roadmap continues. The system evolves.",
    },
    
  ],
  team: {
  students: [
    {
        image: StudentPic1,
        name: "Arpit Nigam",
        role: "Project Lead & System Architect",
        socials: {
        instagram: "https://instagram.com/yourusername",
        linkedin: "https://linkedin.com/in/yourusername",
      },
        description:
        "Led overall architecture planning.Implemented core components and ensured modular design principles were followed throughout the rebuild.",
    },
    {
      image: StudentPic2,
      name: "Ayan Magardey",
      role: "3D Frontend Developer",
      socials: {
        instagram: "https://instagram.com/yourusername",
        linkedin: "https://linkedin.com/in/yourusername",
        portfolio: "https://yourportfolio.com",
      },
      description:
        "Built reusable components, refined user interaction flows, and optimized visual consistency across modules. Redesigned the UI with a focus on user experience and scalability.",
    },
    {
      image: StudentPic3,
      name: "Samkit Jain",
      role: "Backend & Logic Developer",
      socials: {
        instagram: "https://instagram.com/yourusername",
        linkedin: "https://linkedin.com/in/yourusername",
      },
      description:
        "Designed business logic structure, data modeling, and system-level functional integration. Ensured the backend supported future analytics and expansion needs.",
    },
  ],

  mentor: {
    image: MentorPic,
    name: "Prof. Swapnil Waghela",
    role: "Academic Supervisor & Guide",
    socials: {
        linkedin: "https://linkedin.com/in/yourusername",
      },
    description:
      "Provided architectural direction, academic validation, and strategic feedback during the foundation phase of the project. While the mentor’s role was crucial in the early stages, the 2026 redesign was driven by the team’s own growth and vision for a sustainable product.",
  },
}
}


export default aboutData