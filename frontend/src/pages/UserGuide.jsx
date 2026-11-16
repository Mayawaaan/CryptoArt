import React from "react"
import { Link } from "react-router-dom"
import DocumentLayout from "../components/common/DocumentLayout"
import userGuideData from "../data/userGuideData"

const UserGuide = () => {
  return (
    <DocumentLayout
      eyebrow="Platform Handbook"
      title="User Guide"
      lastUpdated={userGuideData.lastUpdated}
      sections={userGuideData.sections}
      footerCta={
        <div className="bg-ca-surface border border-ca-border rounded-2xl p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold text-ca-text">Need More Assistance?</h2>
            <p className="text-ca-text-muted text-sm mt-1">
              Explore the Help Center or submit a support inquiry directly.
            </p>
          </div>
          <Link
            to="/submit-request"
            className="shrink-0 px-5 py-2.5 bg-ca-accent text-ca-text-inverse font-semibold text-xs rounded-xl hover:bg-ca-accent-hover transition-colors"
          >
            Contact Support
          </Link>
        </div>
      }
    />
  )
}

export default UserGuide
