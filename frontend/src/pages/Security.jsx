import React from "react"
import DocumentLayout from "../components/common/DocumentLayout"
import securityData from "../data/securityData"

const Security = () => {
  return (
    <DocumentLayout
      eyebrow="Infrastructure"
      title="Security Architecture"
      lastUpdated={securityData.lastUpdated}
      sections={securityData.sections}
      footerCta={
        <div className="bg-ca-surface border border-ca-border rounded-2xl p-6 sm:p-8 text-center space-y-2">
          <h2 className="text-lg font-semibold text-ca-text">Prototype Contract Notice</h2>
          <p className="text-ca-text-muted max-w-3xl mx-auto text-sm leading-relaxed">
            Smart contracts target local Hardhat nodes and Sepolia testnets only and have not
            undergone third-party mainnet security audits.
          </p>
        </div>
      }
    />
  )
}

export default Security
