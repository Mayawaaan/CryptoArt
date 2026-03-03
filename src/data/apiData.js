  const endpoints = [
    {
      method: "GET",
      path: "/api/v1/markets",
      description: "Retrieve available trading markets.",
    },
    {
      method: "GET",
      path: "/api/v1/ticker",
      description: "Get real-time market ticker data.",
    },
    {
      method: "POST",
      path: "/api/v1/order",
      description: "Create a new trading order.",
    },
  ];
  
  export default endpoints;