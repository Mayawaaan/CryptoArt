const helpData = {
  categories: [
    {
      id: "account",
      title: "Account & Login",
      articles: [
        {
          question: "How do I reset my password?",
          answer:
            "Go to the login page and click 'Forgot Password'. Follow the instructions sent to your registered email.",
        },
        {
          question: "How do I update my profile information?",
          answer:
            "Navigate to account settings and update your personal details under the profile section.",
        },
      ],
    },
    {
      id: "billing",
      title: "Billing & Fees",
      articles: [
        {
          question: "How are fees calculated?",
          answer:
            "Fees are based on your selected plan and usage. Refer to the Pricing page for detailed breakdowns.",
        },
        {
          question: "Can I request a refund?",
          answer:
            "Refund eligibility depends on your plan terms. Please submit a support request for review.",
        },
      ],
    },
    {
      id: "technical",
      title: "Technical Support",
      articles: [
        {
          question: "Why is the dashboard not loading?",
          answer:
            "Check your internet connection and browser cache. If the issue persists, submit a support ticket.",
        },
        {
          question: "How do I report a bug?",
          answer:
            "Use the Submit Request page and select 'Technical Issue' as your category.",
        },
      ],
    },
  ],
}

export default helpData