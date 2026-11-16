import React, { useState } from "react"
import DocumentLayout from "../components/common/DocumentLayout"
import Dialog from "../components/ui/Dialog"
import Button from "../components/ui/Button"
import cookiePolicyData from "../data/cookiePolicyData"

const CookiePolicy = () => {
  const [showModal, setShowModal] = useState(false)
  const [analytics, setAnalytics] = useState(false)
  const [performance, setPerformance] = useState(true)

  return (
    <>
      <DocumentLayout
        eyebrow="Session Storage"
        title="Cookie Policy"
        lastUpdated={cookiePolicyData.lastUpdated}
        sections={cookiePolicyData.sections}
        sidebarAction={
          <Button
            variant="soft"
            size="sm"
            onClick={() => setShowModal(true)}
            className="w-full"
          >
            Manage Cookie Preferences
          </Button>
        }
      />

      <Dialog
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title="Cookie Preferences"
        subtitle="Control optional browser preferences. Essential session cookies are required for Demo Wallet auth."
      >
        <div className="space-y-5">
          <div className="space-y-3.5 text-sm text-ca-text-secondary">
            <label className="flex justify-between items-center">
              <span>Essential Session Cookie (`ca_demo_session`)</span>
              <input type="checkbox" checked disabled className="accent-ca-accent" />
            </label>

            <label className="flex justify-between items-center cursor-pointer">
              <span>Analytics Cookies</span>
              <input
                type="checkbox"
                checked={analytics}
                onChange={(e) => setAnalytics(e.target.checked)}
                className="accent-ca-accent"
              />
            </label>

            <label className="flex justify-between items-center cursor-pointer">
              <span>Performance Preferences</span>
              <input
                type="checkbox"
                checked={performance}
                onChange={(e) => setPerformance(e.target.checked)}
                className="accent-ca-accent"
              />
            </label>
          </div>

          <div className="flex justify-end gap-2.5">
            <Button variant="outline" size="sm" onClick={() => setShowModal(false)}>
              Cancel
            </Button>
            <Button variant="primary" size="sm" onClick={() => setShowModal(false)}>
              Save Preferences
            </Button>
          </div>
        </div>
      </Dialog>
    </>
  )
}

export default CookiePolicy
