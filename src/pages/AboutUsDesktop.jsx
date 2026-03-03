import { useEffect, useRef } from "react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import aboutData from "../data/aboutdata"
import { Globe, Instagram, Linkedin } from "lucide-react"

gsap.registerPlugin(ScrollTrigger)

const AboutUsDesktop = () => {
  const sectionsRef = useRef([])

  useEffect(() => {
    sectionsRef.current.forEach((section) => {
      gsap.fromTo(
        section.querySelector(".fade-up"),
        { y: 80, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1.2,
          ease: "power3.out",
          scrollTrigger: {
            trigger: section,
            start: "top center",
            end: "bottom center",
            scrub: true,

          },
        }
      )
    })
  }, [])

  const addToRefs = (el) => {
    if (el && !sectionsRef.current.includes(el)) {
      sectionsRef.current.push(el)
    }
  }

return (
  <div className="bg-gray-900 text-white font-sans overflow-hidden">

    {/* HERO */}
    <section ref={addToRefs} className="h-screen flex items-center justify-center px-6 text-center">
      <div className="fade-up max-w-4xl">
        <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold font-mono tracking-tighter leading-tight">
          {aboutData.hero.titleLine1}
          <br />
          <span className="text-amber-500">
            {aboutData.hero.highlight}
          </span>
        </h1>
        <p className="mt-8 text-xl md:text-2xl text-gray-300 leading-relaxed">
          {aboutData.hero.description}
        </p>
      </div>
    </section>

    {aboutData.sections.map((section) => {

      if (section.type === "left-year") {
        return (
          <section key={section.id} ref={addToRefs} className="h-[50vh] relative flex items-center px-12 md:px-24 bg-gray-800 overflow-hidden">
            <div className="absolute right-10 top-1/2 -translate-y-1/2 text-[180px] font-bold text-gray-200 opacity-40 hidden lg:block">
              {section.year}
            </div>
            <div className="fade-up max-w-3xl relative z-10">
              <h2 className="text-4xl font-semibold font-mono mb-6 text-amber-500">
                {section.title}
              </h2>
              <p className="text-gray-300 text-lg leading-relaxed">
                {section.content1}
              </p>
              <p className="mt-6 text-gray-200">
                {section.content2}
              </p>
            </div>
          </section>
        )
      }

      if (section.type === "right-year") {
        return (
          <section key={section.id} ref={addToRefs} className="h-[50vh] relative flex items-center justify-end px-12 md:px-24 overflow-hidden">
            <div className="absolute left-10 top-1/2 -translate-y-1/2 text-[180px] font-bold text-gray-200 opacity-40 hidden lg:block">
              {section.year}
            </div>
            <div className="fade-up max-w-3xl text-right relative z-10">
              <h2 className="text-6xl font-semibold font-mono mb-6">
                {section.title}
              </h2>
              <p className="text-gray-300 text-2xl leading-relaxed">
                {section.content1}
              </p>
              <p className="mt-6 text-gray-400">
                {section.content2}
              </p>
            </div>
          </section>
        )
      }

      if (section.type === "grid") {
  return (
    <section
      key={section.id}
      ref={addToRefs}
      className="min-h-screen flex items-center px-12 md:px-24 bg-gray-900"
    >
      <div className="fade-up w-full max-w-6xl mx-auto space-y-16">

        {/* Section Title */}
        <h2 className="text-5xl md:text-6xl font-semibold font-mono text-amber-500 text-center">
          {section.title}
        </h2>

        {/* Grid */}
        <div className="grid md:grid-cols-3 gap-12">

          {section.grid.map((item, index) => (
            <div
              key={index}
              className="group relative bg-gray-800/70 backdrop-blur-md border border-gray-700 rounded-2xl p-10 transition-all duration-500 hover:-translate-y-3 hover:border-amber-500 hover:shadow-[0_0_30px_rgba(245,158,11,0.15)]"
            >

              {/* Accent Line */}
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-amber-500 to-transparent rounded-t-2xl opacity-70 group-hover:opacity-100 transition" />

              {/* Content */}
              <div className="space-y-6">
                <h3 className="text-2xl font-semibold tracking-wide">
                  {item.heading}
                </h3>

                <p className="text-gray-400 text-lg leading-relaxed">
                  {item.text}
                </p>
              </div>

            </div>
          ))}

        </div>
      </div>
    </section>
  )
}
if (section.type === "center") {
  return (
    <section
      key={section.id}
      ref={addToRefs}
      className="min-h-screen flex items-center justify-center px-8"
    >
      <div className="fade-up max-w-4xl text-center space-y-10">

        {/* Accent Divider */}
        <div className="w-24 h-1 bg-amber-500 mx-auto rounded-full opacity-70" />

        <h2 className="text-5xl md:text-6xl font-mono font-semibold tracking-tight">
          {section.title}
        </h2>

        <p className="text-2xl text-gray-300 leading-relaxed">
          {section.content1}
        </p>

        <p className="text-lg text-gray-400 max-w-2xl mx-auto">
          {section.content2}
        </p>

      </div>
    </section>
  )
}
if (section.type === "left") {
  return (
    <section
      key={section.id}
      ref={addToRefs}
      className="h-[70vh] flex items-center px-6 md:px-24"
    >
      <div className="fade-up w-full max-w-6xl mx-auto grid md:grid-cols-2 gap-16 items-center">

        {/* Left Content */}
        <div className="space-y-8">
          <h2 className="text-5xl md:text-6xl font-mono font-semibold text-amber-500">
            {section.title}
          </h2>

          <p className="text-xl text-gray-300 leading-relaxed">
            {section.content1}
          </p>

          <p className="text-lg text-gray-400">
            {section.content2}
          </p>
        </div>

        {/* Right Image */}
        <div className="relative h-80 md:h-96 rounded-2xl overflow-hidden shadow-xl border border-gray-700">
          <img
            src={section.image}
            alt={section.title}
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
          />
        </div>

      </div>
    </section>
  )
}
if (section.type === "right") {
  return (
    <section
      key={section.id}
      ref={addToRefs}
      className="h-[70vh] flex items-center px-6 md:px-24"
    >
      <div className="fade-up w-full max-w-6xl mx-auto grid md:grid-cols-2 gap-16 items-center">

        {/* Left Image */}
        <div className="relative h-80 md:h-96 rounded-2xl overflow-hidden shadow-xl border border-gray-700">
          <img
            src={section.image}
            alt={section.title}
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
          />
        </div>

        {/* Right Content */}
        <div className="space-y-8 md:text-left">
          <h2 className="text-5xl md:text-6xl font-mono font-semibold">
            {section.title}
          </h2>

          <p className="text-xl text-gray-300 leading-relaxed">
            {section.content1}
          </p>

          <p className="text-lg text-gray-400">
            {section.content2}
          </p>
        </div>

      </div>
    </section>
  )
}
if (section.type === "dark") {
  return (
    <section
      key={section.id}
      ref={addToRefs}
      className="h-[60vh] flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-950 to-black px-8"
    >
      <div className="fade-up max-w-5xl text-center space-y-10">

        <h2 className="text-6xl md:text-7xl font-bold font-mono text-amber-400">
          {section.title}
        </h2>

        <p className="text-2xl text-gray-300 leading-relaxed">
          {section.content1}
        </p>

        <p className="text-lg text-gray-400 max-w-3xl mx-auto">
          {section.content2}
        </p>

      </div>
    </section>
  )
}

      // Default layout
      return (
        
        <section key={section.id} ref={addToRefs} className="h-screen flex items-center px-12 md:px-24 bg-gray-800">
          <div className="fade-up max-w-3xl">
            <h2 className="text-4xl font-semibold font-mono mb-6 text-amber-500">
              {section.title}
            </h2>
            <p className="text-gray-300 text-lg leading-relaxed">
              {section.content1}
            </p>
            <p className="mt-6 text-gray-400">
              {section.content2}
            </p>
          </div>
        </section>
        
        
        
      )
    })}
  {/* TEAM SECTION */}
<section
  ref={addToRefs}
  className="min-h-screen flex items-center justify-center px-8 bg-gray-950"
>
  <div className="fade-up w-full max-w-6xl mx-auto space-y-20">

    {/* Section Header */}
    <div className="text-center space-y-6">
      <div className="w-24 h-1 bg-amber-500 mx-auto rounded-full opacity-70" />
      <h2 className="text-5xl md:text-6xl font-mono font-semibold text-amber-500">
        The People Behind It
      </h2>
      <p className="text-xl text-gray-400 max-w-2xl mx-auto">
        Three students. One mentor. One idea that never stopped evolving.
      </p>
    </div>

    {/* Students */}
    <div className="grid md:grid-cols-3 gap-12">
      {aboutData.team.students.map((student, index) => (
        <div
          key={index}
          className="group bg-gray-900/70 backdrop-blur-md border border-gray-800 rounded-2xl p-10 transition-all duration-500 hover:-translate-y-3 hover:border-amber-500 hover:shadow-[0_0_30px_rgba(245,158,11,0.15)]"
        >
            <img className="w-32 h-32 mx-auto rounded-full bg-gray-800 border-4 border-amber-400 mb-8" src={student.image} alt={student.name} />


          <h4 className="text-2xl font-semibold text-center">
            {student.name}
          </h4>

          <p className="text-amber-400 text-center mt-2">
            {student.role}
          </p>

          <p className="text-gray-400 text-center mt-6 leading-relaxed">
            {student.description}
          </p>
          <div className="flex justify-center gap-6 mt-6">

  {student.socials?.instagram && (
    <a
      href={student.socials.instagram}
      target="_blank"
      rel="noopener noreferrer"
      className="text-gray-400 hover:text-amber-500 transition duration-300 hover:scale-110 hover:border-amber-400 hover:border-2 p-2 rounded-2xl "
    >
      <Instagram size={22} />
    </a>
  )}

  {student.socials?.linkedin && (
    <a
      href={student.socials.linkedin}
      target="_blank"
      rel="noopener noreferrer"
      className="text-gray-400 hover:text-amber-500 transition duration-300 hover:scale-110 hover:border-amber-400 hover:border-2 p-2 rounded-2xl "
    >
      <Linkedin size={22} />
    </a>
  )}
  {student.socials?.portfolio && (
    <a
      href={student.socials.portfolio}
      target="_blank"
      rel="noopener noreferrer"
      className="text-gray-400 hover:text-amber-500 transition duration-300 hover:scale-110 hover:border-amber-400 hover:border-2 p-2 rounded-2xl "
    >
      <Globe size={22} />
    </a>
  )}

</div>
        </div>
      ))}
    </div>

    {/* Mentor Highlight Card */}
    <div className="max-w-3xl mx-auto my-10 bg-gradient-to-br from-gray-900 to-gray-800 border border-amber-500/30 rounded-3xl p-12 text-center shadow-xl">

            <img className="w-32 h-32 mx-auto rounded-full bg-gray-800 border-4 border-amber-400 mb-8" src={aboutData.team.mentor.image} alt={aboutData.team.mentor.name} />

      <h4 className="text-3xl font-semibold">
        {aboutData.team.mentor.name}
      </h4>

      <p className="text-amber-400 mt-2 text-lg">
        {aboutData.team.mentor.role}
      </p>

      <p className="text-gray-400 mt-8 leading-relaxed text-lg">
        {aboutData.team.mentor.description}
      </p>
     <div className="flex justify-center gap-6 mt-6">

  {aboutData.team.mentor.socials?.linkedin && (
    <a
      href={aboutData.team.mentor.socials.linkedin}
      target="_blank"
      rel="noopener noreferrer"
      className="text-gray-400 hover:text-amber-500 transition duration-300 hover:scale-110 hover:border-amber-400 hover:border-2 p-2 rounded-2xl "
    >
      <Linkedin size={22} />
    </a>
  )}

</div>
    </div>

  </div>
</section>
  </div>
)
}

export default AboutUsDesktop