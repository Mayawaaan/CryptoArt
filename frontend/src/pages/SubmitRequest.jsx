import React, { useState } from "react"
import PageHeader from "../components/ui/PageHeader"
import { Input, Textarea } from "../components/ui/Input"
import Select from "../components/ui/Select"
import Button from "../components/ui/Button"
import { submitSupportTicket } from "../services/demoApi"

const SubmitRequest = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    category: "",
    priority: "Medium",
    message: "",
    consent: false,
  })

  const [submitting, setSubmitting] = useState(false)
  const [submittedRef, setSubmittedRef] = useState(null)
  const [error, setError] = useState("")

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }))
    setError("")
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!formData.consent) {
      setError("Please consent to data processing before submitting.")
      return
    }

    try {
      setSubmitting(true)
      setError("")
      const body = await submitSupportTicket(formData)
      setSubmittedRef(body.data?.ticketId || "SUBMITTED")
    } catch (err) {
      setError(err.message || "Unable to reach support backend.")
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <main className="min-h-screen bg-ca-bg text-ca-text px-4 sm:px-6 py-10">
      <div className="container mx-auto max-w-3xl space-y-8">
        <PageHeader
          eyebrow="Support Portal"
          title="Submit a Support Request"
          description="Log a bug report, testnet question, or partnership inquiry with reference tracking."
        />

        {submittedRef ? (
          <div className="bg-ca-surface border border-ca-border rounded-2xl p-8 space-y-4">
            <h2 className="text-xl font-semibold text-ca-accent">Request Recorded</h2>
            <p className="text-ca-text-secondary text-sm leading-relaxed">
              Your support ticket has been logged cleanly. Reference ID:{" "}
              <span className="font-mono text-ca-text font-semibold">{submittedRef}</span>
            </p>
            <Button
              variant="primary"
              onClick={() => {
                setSubmittedRef(null)
                setFormData({
                  name: "",
                  email: "",
                  category: "",
                  priority: "Medium",
                  message: "",
                  consent: false,
                })
              }}
            >
              Submit Another Request
            </Button>
          </div>
        ) : (
          <div className="bg-ca-surface border border-ca-border rounded-2xl p-6 sm:p-8">
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid md:grid-cols-2 gap-5">
                <Input
                  id="req-name"
                  name="name"
                  label="Full Name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                />
                <Input
                  id="req-email"
                  name="email"
                  type="email"
                  label="Email Address"
                  required
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>

              <div className="grid md:grid-cols-2 gap-5">
                <Select
                  id="req-category"
                  name="category"
                  label="Request Category"
                  required
                  value={formData.category}
                  onChange={handleChange}
                  options={[
                    { value: "", label: "Select Category" },
                    { value: "technical", label: "Technical Issue" },
                    { value: "billing", label: "Billing & Fees" },
                    { value: "account", label: "Account Support" },
                    { value: "security", label: "Security Concern" },
                    { value: "other", label: "Other" },
                  ]}
                />
                <Select
                  id="req-priority"
                  name="priority"
                  label="Priority Level"
                  value={formData.priority}
                  onChange={handleChange}
                  options={[
                    { value: "Low", label: "Low" },
                    { value: "Medium", label: "Medium" },
                    { value: "High", label: "High" },
                    { value: "Urgent", label: "Urgent" },
                  ]}
                />
              </div>

              <Textarea
                id="req-message"
                name="message"
                label="Describe Your Issue"
                required
                rows={5}
                value={formData.message}
                onChange={handleChange}
              />

              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  name="consent"
                  checked={formData.consent}
                  onChange={handleChange}
                  className="accent-ca-accent"
                />
                <span className="text-ca-text-muted text-xs sm:text-sm">
                  I consent to the processing of this inquiry in accordance with the Privacy Policy.
                </span>
              </label>

              {error && (
                <p role="alert" className="text-xs text-ca-negative">
                  {error}
                </p>
              )}

              <Button type="submit" variant="primary" size="lg" loading={submitting} className="w-full">
                Submit Request
              </Button>
            </form>
          </div>
        )}
      </div>
    </main>
  )
}

export default SubmitRequest
