import React from "react"
import { Link } from "react-router-dom"
import { platformLinks, supportLinks, legalLinks, footerContent } from "../data/FooterData"
import Newsletter from "./Newsletter"

const Footer = () => {
  return (
    <footer className="bg-ca-surface text-ca-text pt-16 pb-10 border-t border-ca-border">
      <div className="container mx-auto px-4 sm:px-6 space-y-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          <div className="space-y-4">
            <Link to="/" className="inline-flex items-center gap-2.5" aria-label="CryptoArt Home">
              <img
                src="/logo/logoMark.png"
                alt=""
                aria-hidden="true"
                className="h-9 w-9 object-contain shrink-0"
              />
              <span className="text-lg font-semibold tracking-tight text-ca-text">
                Crypto<span className="text-ca-accent">Art</span>
              </span>
            </Link>

            <p className="text-ca-text-muted text-sm leading-relaxed">
              {footerContent.brandDescription}
            </p>
          </div>

          <div>
            <h3 className="text-xs font-mono uppercase tracking-[0.18em] font-semibold mb-4 text-ca-text">
              Platform
            </h3>
            <ul className="space-y-2.5">
              {platformLinks.map((item) => (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    className="text-ca-text-muted hover:text-ca-accent text-sm transition-colors"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-xs font-mono uppercase tracking-[0.18em] font-semibold mb-4 text-ca-text">
              Support
            </h3>
            <ul className="space-y-2.5">
              {supportLinks.map((item) => (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    className="text-ca-text-muted hover:text-ca-accent text-sm transition-colors"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <Newsletter />
        </div>

        <div className="border-t border-ca-divider pt-7 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-ca-text-muted">
          <div className="text-center md:text-left space-y-1">
            <p>© {new Date().getFullYear()} CryptoArt. All rights reserved.</p>
            <p className="flex flex-wrap items-center justify-center md:justify-start gap-2">
              <a
                href={footerContent.githubLink}
                target="_blank"
                rel="noopener noreferrer"
                className="font-mono hover:text-ca-accent transition-colors"
              >
                {footerContent.githubLabel}
              </a>
              <span aria-hidden="true">·</span>
              <a
                href={footerContent.portfolioLink}
                target="_blank"
                rel="noopener noreferrer"
                className="font-mono hover:text-ca-accent transition-colors"
              >
                {footerContent.portfolioLabel}
              </a>
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-6">
            {legalLinks.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className="text-ca-text-muted hover:text-ca-accent transition-colors"
              >
                {item.name}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
