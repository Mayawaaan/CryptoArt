import React, { useState } from "react"
import DocumentLayout from "../components/common/DocumentLayout"
import Dialog from "../components/ui/Dialog"
import Button from "../components/ui/Button"
import termsData from "../data/termsData"

const TermsOfService = () => {
  const [acceptOpen, setAcceptOpen] = useState(false)

  return (
    <>
      <DocumentLayout
        eyebrow="Legal Agreement"
        title="Terms of Service"
        lastUpdated={termsData.lastUpdated}
        sections={termsData.sections}
        sidebarAction={
          <Button
            variant="soft"
            size="sm"
            onClick={() => setAcceptOpen(true)}
            className="w-full"
          >
            Review Scope Notice
          </Button>
        }
      />

      <Dialog
        isOpen={acceptOpen}
        onClose={() => setAcceptOpen(false)}
        title="Platform Scope & Terms"
        subtitle="Demo credits and EVM testnets carry zero real monetary value."
      >
        <div className="space-y-4">
          <p className="text-ca-text-secondary text-sm leading-relaxed">
            CryptoArt provides simulated demo credit ledgers in MongoDB alongside prototype
            contracts for Hardhat and Sepolia testnets. None of the demo assets constitute financial
            advice or mainnet custody.
          </p>
          <div className="flex justify-end">
            <Button variant="primary" size="sm" onClick={() => setAcceptOpen(false)}>
              Understood
            </Button>
          </div>
        </div>
      </Dialog>
    </>
  )
}

export default TermsOfService
