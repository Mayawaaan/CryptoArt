import React from "react"
import { ArrowUpRight } from "lucide-react"
import StatusBadge from "../ui/StatusBadge"

const isVerifiedExternalUrl = (url) =>
  typeof url === "string" &&
  url.startsWith("http") &&
  !url.includes("yourusername") &&
  !url.includes("yourportfolio.com")

const AboutTeamSection = ({ team }) => {
  return (
    <section
      id="about-team"
      aria-labelledby="about-team-heading"
      className="py-16 sm:py-24 border-b border-ca-divider bg-ca-surface/30"
    >
      <div className="container mx-auto px-4 sm:px-6 space-y-14">
        {/* Section Header */}
        <div className="max-w-3xl space-y-3">
          <p className="text-xs font-mono uppercase tracking-[0.2em] text-ca-accent font-semibold">
            {team.eyebrow}
          </p>
          <h2
            id="about-team-heading"
            className="text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-tight text-ca-text"
          >
            {team.title}
          </h2>
          <p className="text-sm sm:text-base text-ca-text-secondary leading-relaxed">
            {team.subtitle}
          </p>
        </div>

        {/* Core Engineering Contributors */}
        <div className="space-y-6">
          {team.students.map((member, idx) => {
            const verifiedLinks = Object.entries(member.socials || {}).filter(([, url]) =>
              isVerifiedExternalUrl(url)
            )
            return (
              <article
                key={member.name}
                className="about-reveal bg-ca-surface border border-ca-border rounded-2xl p-6 sm:p-8 grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10 items-start"
              >
                {/* Left Contributor Identity */}
                <div className="lg:col-span-4 flex flex-col justify-between gap-5 lg:border-r lg:border-ca-divider lg:pr-8">
                  <div className="flex items-center gap-4">
                    <img
                      src={member.image}
                      alt={member.name}
                      loading="lazy"
                      className="w-16 h-16 rounded-2xl bg-ca-bg border border-ca-accent object-cover p-1 shrink-0"
                    />
                    <div>
                      <span className="text-xs font-mono text-ca-accent font-semibold">
                        CONTRIBUTOR {member.index || `0${idx + 1}`}
                      </span>
                      <h3 className="text-xl font-semibold text-ca-text mt-0.5">
                        {member.name}
                      </h3>
                      <p className="text-xs sm:text-sm text-ca-text-secondary font-medium">
                        {member.role}
                      </p>
                    </div>
                  </div>

                  {member.focusAreas && (
                    <div className="space-y-2">
                      <p className="text-[11px] font-mono uppercase tracking-wider text-ca-text-muted">
                        Architectural Focus
                      </p>
                      <div className="flex flex-wrap gap-1.5">
                        {member.focusAreas.map((area) => (
                          <span
                            key={area}
                            className="px-2.5 py-1 rounded-md bg-ca-bg border border-ca-border text-xs font-mono text-ca-text-secondary"
                          >
                            {area}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {verifiedLinks.length > 0 && (
                    <div className="flex flex-wrap gap-2 pt-1">
                      {verifiedLinks.map(([network, url]) => (
                        <a
                          key={network}
                          href={url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-ca-accent-soft border border-ca-accent-border text-xs font-semibold text-ca-accent hover:bg-ca-accent hover:text-ca-text-inverse capitalize transition-colors"
                        >
                          {network}
                          <ArrowUpRight size={13} aria-hidden="true" />
                        </a>
                      ))}
                    </div>
                  )}
                </div>

                {/* Right Editorial Contribution Bio */}
                <div className="lg:col-span-8 space-y-4">
                  <p className="text-xs font-mono uppercase tracking-wider text-ca-text-muted">
                    Verified Role &amp; Engineering Contribution
                  </p>
                  <p className="text-sm sm:text-base text-ca-text font-medium leading-relaxed">
                    {member.description}
                  </p>
                  {member.extendedBio && (
                    <p className="text-xs sm:text-sm text-ca-text-secondary leading-relaxed">
                      {member.extendedBio}
                    </p>
                  )}
                </div>
              </article>
            )
          })}
        </div>

        {/* Academic Supervisor Dossier */}
        <article className="about-reveal bg-ca-surface border border-ca-accent-border rounded-2xl p-6 sm:p-8 lg:p-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-4 flex items-center gap-4">
            <img
              src={team.mentor.image}
              alt={team.mentor.name}
              loading="lazy"
              className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-ca-bg border border-ca-accent object-cover p-1.5 shrink-0"
            />
            <div className="space-y-1">
              <StatusBadge tone="accent">Academic Mentorship</StatusBadge>
              <h3 className="text-xl font-semibold text-ca-text pt-1">
                {team.mentor.name}
              </h3>
              <p className="text-xs sm:text-sm text-ca-accent font-medium">
                {team.mentor.role}
              </p>
            </div>
          </div>

          <div className="lg:col-span-8 space-y-3 lg:border-l lg:border-ca-divider lg:pl-8">
            <p className="text-xs font-mono uppercase tracking-wider text-ca-text-muted">
              Foundational Guidance (2022–2023)
            </p>
            <p className="text-sm sm:text-base text-ca-text-secondary leading-relaxed">
              {team.mentor.description}
            </p>
          </div>
        </article>
      </div>
    </section>
  )
}

export default AboutTeamSection
