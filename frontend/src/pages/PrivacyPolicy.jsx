import React, { useState } from "react"
import { Link } from "react-router-dom"
import DocumentLayout from "../components/common/DocumentLayout"
import Dialog from "../components/ui/Dialog"
import Button from "../components/ui/Button"
import privacyData from "../data/privacyData"

const PrivacyPolicy = () => {
  const [requestOpen, setRequestOpen] = useState(false)

  return (
    <>
      <DocumentLayout
        eyebrow="Legal Policy"
        title="Privacy Policy"
        lastUpdated={privacyData.lastUpdated}
        sections={privacyData.sections}
        sidebarAction={
          <Button
            variant="soft"
            size="sm"
            onClick={() => setRequestOpen(true)}
            className="w-full"
          >
            Request Data Action
          </Button>
        }
      />

      <Dialog
        isOpen={requestOpen}
        onClose={() => setRequestOpen(false)}
        title="Data Privacy Request"
        subtitle="Access, correction, or removal of session or inquiry data."
      >
        <div className="space-y-4">
          <p className="text-ca-text-secondary text-sm leading-relaxed">
            You may request access, correction, or deletion of submitted contact information or demo
            account aliases through our Support Portal.
          </p>
          <div className="flex justify-end gap-3">
            <Button variant="outline" size="sm" onClick={() => setRequestOpen(false)}>
              Close
            </Button>
            <Link
              to="/submit-request"
              onClick={() => setRequestOpen(false)}
              className="px-4 py-2 text-xs font-semibold bg-ca-accent text-ca-text-inverse rounded-xl hover:bg-ca-accent-hover transition-colors"
            >
              Open Support Portal
            </Link>
          </div>
        </div>
      </Dialog>
    </>
  )
}

export default PrivacyPolicy
