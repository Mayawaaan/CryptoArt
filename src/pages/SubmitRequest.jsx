import React, { useState } from "react"

const SubmitRequest = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    category: "",
    priority: "Medium",
    message: "",
    consent: false,
  })

  const [submitted, setSubmitted] = useState(false)

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    if (!formData.consent) {
      alert("Please agree to data processing terms.")
      return
    }

    // Future API integration point
    console.log("Support Request Submitted:", formData)

    setSubmitted(true)
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center px-6">
        <div className="text-center max-w-xl">
          <h2 className="text-4xl font-mono font-semibold text-amber-500 mb-6">
            Request Submitted
          </h2>
          <p className="text-gray-400 text-lg">
            Our support team has received your request.
            We’ll respond within 24–48 hours.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white px-6 md:px-16 py-24">

      {/* Header */}
      <div className="max-w-3xl mx-auto text-center mb-20">
        <h1 className="text-5xl font-bold font-mono text-amber-500">
          Submit a Support Request
        </h1>
        <p className="mt-6 text-gray-400 text-lg">
          Describe your issue clearly and our team will assist you promptly.
        </p>
      </div>

      {/* Form */}
      <div className="max-w-4xl mx-auto bg-gray-800/60 border border-gray-700 rounded-2xl p-12">

        <form onSubmit={handleSubmit} className="space-y-10">

          {/* Name & Email */}
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <label className="block mb-3 text-gray-400">
                Full Name
              </label>
              <input
                type="text"
                name="name"
                required
                value={formData.name}
                onChange={handleChange}
                className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 focus:outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="block mb-3 text-gray-400">
                Email Address
              </label>
              <input
                type="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>

          {/* Category & Priority */}
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <label className="block mb-3 text-gray-400">
                Request Category
              </label>
              <select
                name="category"
                required
                value={formData.category}
                onChange={handleChange}
                className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 focus:outline-none focus:border-amber-500"
              >
                <option value="">Select Category</option>
                <option value="technical">Technical Issue</option>
                <option value="billing">Billing & Fees</option>
                <option value="account">Account Support</option>
                <option value="security">Security Concern</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div>
              <label className="block mb-3 text-gray-400">
                Priority Level
              </label>
              <select
                name="priority"
                value={formData.priority}
                onChange={handleChange}
                className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 focus:outline-none focus:border-amber-500"
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
                <option value="Urgent">Urgent</option>
              </select>
            </div>
          </div>

          {/* Message */}
          <div>
            <label className="block mb-3 text-gray-400">
              Describe Your Issue
            </label>
            <textarea
              name="message"
              required
              rows="6"
              value={formData.message}
              onChange={handleChange}
              className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 focus:outline-none focus:border-amber-500"
            />
          </div>

          {/* Attachment Placeholder */}
          <div>
            <label className="block mb-3 text-gray-400">
              Attach File (optional)
            </label>
            <input
              type="file"
              className="text-gray-400"
            />
          </div>

          {/* Consent */}
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              name="consent"
              checked={formData.consent}
              onChange={handleChange}
            />
            <span className="text-gray-400 text-sm">
              I consent to the processing of my data in accordance with the Privacy Policy.
            </span>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full py-4 bg-amber-500 text-black font-semibold rounded-lg hover:bg-amber-400 transition"
          >
            Submit Request
          </button>

        </form>
      </div>

    </div>
  )
}

export default SubmitRequest