import React from "react"
import endpoints from "../data/apiData"

const API = () => {


  return (
    <div className="min-h-screen bg-gray-950 text-gray-300 flex">

      {/* Sidebar */}
      <aside className="hidden md:block w-72 bg-gray-900 border-r border-gray-800 p-8 sticky top-0 h-screen">
        <h2 className="text-2xl font-bold text-amber-500 mb-8">
          API Docs
        </h2>

        <nav className="space-y-4 text-sm">
          <a href="#overview" className="block hover:text-amber-400">
            Overview
          </a>
          <a href="#authentication" className="block hover:text-amber-400">
            Authentication
          </a>
          <a href="#endpoints" className="block hover:text-amber-400">
            Endpoints
          </a>
          <a href="#rate-limits" className="block hover:text-amber-400">
            Rate Limits
          </a>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 px-8 md:px-20 py-20 max-w-6xl">

        {/* Header */}
        <section id="overview" className="mb-20">
          <h1 className="text-5xl font-bold font-mono text-amber-500 mb-6">
            Platform API
          </h1>
          <p className="text-lg text-gray-400">
            Our REST API allows developers to integrate trading,
            market data, and account functionality programmatically.
          </p>
        </section>

        {/* Base URL */}
        <section className="mb-20">
          <h2 className="text-3xl font-semibold text-white mb-6">
            Base URL
          </h2>

          <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 font-mono text-sm">
            https://api.yourplatform.com/api/v1
          </div>
        </section>

        {/* Authentication */}
        <section id="authentication" className="mb-20">
          <h2 className="text-3xl font-semibold text-white mb-6">
            Authentication
          </h2>

          <p className="text-gray-400 mb-6">
            All private endpoints require an API key passed via headers.
          </p>

          <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 font-mono text-sm">
{`Headers:
Authorization: Bearer YOUR_API_KEY
Content-Type: application/json`}
          </div>
        </section>

        {/* Endpoints */}
        <section id="endpoints" className="mb-20">
          <h2 className="text-3xl font-semibold text-white mb-10">
            Endpoints
          </h2>

          <div className="space-y-8">
            {endpoints.map((endpoint, index) => (
              <div
                key={index}
                className="border border-gray-800 rounded-xl p-8 bg-gray-900"
              >
                <div className="flex items-center gap-4 mb-4">
                  <span className="px-3 py-1 text-sm rounded bg-amber-500 text-black font-semibold">
                    {endpoint.method}
                  </span>
                  <span className="font-mono text-gray-300">
                    {endpoint.path}
                  </span>
                </div>

                <p className="text-gray-400">
                  {endpoint.description}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Example Request */}
        <section className="mb-20">
          <h2 className="text-3xl font-semibold text-white mb-6">
            Example Request
          </h2>

          <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 font-mono text-sm whitespace-pre">
{`curl -X GET "https://api.yourplatform.com/api/v1/markets" \\
-H "Authorization: Bearer YOUR_API_KEY"`}
          </div>
        </section>

        {/* Rate Limits */}
        <section id="rate-limits" className="mb-20">
          <h2 className="text-3xl font-semibold text-white mb-6">
            Rate Limits
          </h2>

          <p className="text-gray-400">
            Public endpoints: 60 requests per minute.
            <br />
            Private endpoints: 30 requests per minute.
          </p>
        </section>

        {/* CTA */}
        <section className="border-t border-gray-800 pt-12">
          <h2 className="text-3xl font-semibold text-white mb-6">
            Ready to Build?
          </h2>
          <p className="text-gray-400 mb-8">
            Generate your API key from the dashboard and start integrating today.
          </p>

          <a
            href="/dashboard"
            className="px-8 py-4 bg-amber-500 text-black font-semibold rounded-lg hover:bg-amber-400 transition"
          >
            Go to Dashboard
          </a>
        </section>

      </main>
    </div>
  )
}

export default API