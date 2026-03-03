import aboutData from "../data/aboutdata"
import { Globe, Instagram, Linkedin } from "lucide-react"

const AboutUsMobile = () => {
  return (
    <div className="bg-gray-900 text-white font-sans">

      {/* HERO */}
      <section className="min-h-screen flex flex-col justify-center px-6 text-center">
        <h1 className="text-4xl font-bold font-mono leading-tight">
          {aboutData.hero.titleLine1}
          <br />
          <span className="text-amber-500">
            {aboutData.hero.highlight}
          </span>
        </h1>

        <p className="mt-6 text-lg text-gray-300 leading-relaxed">
          {aboutData.hero.description}
        </p>
      </section>

      {/* CONTENT SECTIONS */}
      {aboutData.sections.map((section) => (
        <section
          key={section.id}
          className="py-20 px-6 border-t border-gray-800"
        >
          {section.year && (
            <div className="text-5xl font-bold text-amber-500 opacity-30 mb-6">
              {section.year}
            </div>
          )}

          <h2 className="text-3xl font-semibold font-mono mb-6">
            {section.title}
          </h2>

          <p className="text-gray-300 leading-relaxed text-base">
            {section.content1}
          </p>

          {section.content2 && (
            <p className="mt-4 text-gray-400 text-sm">
              {section.content2}
            </p>
          )}

          {/* GRID TYPE */}
          {section.type === "grid" && section.grid && (
            <div className="mt-10 space-y-6">
              {section.grid.map((item, index) => (
                <div
                  key={index}
                  className="bg-gray-800 border border-gray-700 rounded-xl p-6"
                >
                  <h3 className="text-xl font-semibold mb-3">
                    {item.heading}
                  </h3>
                  <p className="text-gray-400 text-sm leading-relaxed">
                    {item.text}
                  </p>
                </div>
              ))}
            </div>
          )}
        </section>
      ))}

      {/* TEAM SECTION */}
      <section className="py-24 px-6 bg-gray-950">
        <h2 className="text-4xl font-mono font-semibold text-center text-amber-500 mb-4">
          The People Behind It
        </h2>

        <p className="text-gray-400 text-center mb-12">
          Three students. One mentor.
        </p>

        {/* Students */}
        <div className="space-y-10">
          {aboutData.team.students.map((student, index) => (
            <div
              key={index}
              className="bg-gray-900 border border-gray-800 rounded-2xl p-8 text-center"
            >
              <img
                className="w-24 h-24 mx-auto rounded-full border-4 border-amber-400 mb-6"
                src={student.image}
                alt={student.name}
              />

              <h4 className="text-xl font-semibold">
                {student.name}
              </h4>

              <p className="text-amber-400 text-sm mt-1">
                {student.role}
              </p>

              <p className="text-gray-400 mt-4 text-sm leading-relaxed">
                {student.description}
              </p>

              <div className="flex justify-center gap-6 mt-6">
                {student.socials?.instagram && (
                  <a href={student.socials.instagram} target="_blank" rel="noopener noreferrer">
                    <Instagram size={20} />
                  </a>
                )}
                {student.socials?.linkedin && (
                  <a href={student.socials.linkedin} target="_blank" rel="noopener noreferrer">
                    <Linkedin size={20} />
                  </a>
                )}
                {student.socials?.portfolio && (
                  <a href={student.socials.portfolio} target="_blank" rel="noopener noreferrer">
                    <Globe size={20} />
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Mentor */}
        <div className="mt-16 bg-gray-900 border border-amber-500/30 rounded-2xl p-8 text-center">
          <img
            className="w-24 h-24 mx-auto rounded-full border-4 border-amber-400 mb-6"
            src={aboutData.team.mentor.image}
            alt={aboutData.team.mentor.name}
          />

          <h4 className="text-2xl font-semibold">
            {aboutData.team.mentor.name}
          </h4>

          <p className="text-amber-400 text-sm mt-1">
            {aboutData.team.mentor.role}
          </p>

          <p className="text-gray-400 mt-4 text-sm leading-relaxed">
            {aboutData.team.mentor.description}
          </p>
        </div>
      </section>

    </div>
  )
}

export default AboutUsMobile