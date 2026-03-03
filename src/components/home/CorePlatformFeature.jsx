import React, { useRef, useLayoutEffect } from "react"
import { useNavigate } from "react-router-dom"
import { CircleArrowRight, Landmark, Droplets, LineChart, Store } from "lucide-react"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

gsap.registerPlugin(ScrollTrigger)

const features = [
  {
    title: "Stake",
    description:
      "Earn passive rewards by staking your crypto assets with secure smart contracts.",
    route: "/stake",
    icon: <Landmark size={28} className="text-amber-400" />,
  },
  {
    title: "Liquidity",
    description:
      "Provide liquidity to pools and earn transaction fees with optimized yield strategies.",
    route: "/stake",
    icon: <Droplets size={28} className="text-amber-400" />,
  },
  {
    title: "Market Track",
    description:
      "Track crypto & forex markets with real-time analytics and price insights.",
    route: "/market-track",
    icon: <LineChart size={28} className="text-amber-400" />,
  },
  {
    title: "NFT Marketplace",
    description:
      "List, buy, and sell NFTs seamlessly with secure blockchain transactions.",
    route: "/nft-gallery",
    icon: <Store size={28} className="text-amber-400" />,
  },
]

const CorePlatformFeature = () => {
  const navigate = useNavigate()
  const containerRef = useRef(null)
  const headerRef = useRef(null)

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 80%",
          end: "top 20%",
          scrub: 1,
          stagger: 0.2,
        }
      });

      gsap.set(headerRef.current, { opacity: 0, y: 50 });
      gsap.set(".feature-card", { opacity: 0, y: 50 });

      tl.to(headerRef.current, {
        opacity: 1,
        y: 0,
        duration: 1
      })
      .to(".feature-card", {
        opacity: 1,
        y: 0,
        stagger: 0.2,
        duration: 1
      }, "-=0.5");
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={containerRef} className="relative min-h-fit flex items-center bg-gray-900 text-white py-24 px-6 md:px-12">
      {/* Background Glow */}
      <div className="absolute w-[600px] h-[600px] bg-amber-500/10 blur-[150px] rounded-full top-10 left-1/2 -translate-x-1/2" />

      <div className="relative max-w-7xl mx-auto w-full">
        <div ref={headerRef} className="text-center mb-20">
          <h2 className="text-6xl font-bold mb-4 tracking-tight">
            An All-In-One <span className='text-amber-600'>DeFi Powerhouse</span>
          </h2>
          <p className="text-gray-400 text-lg w-2/3 mx-auto">
            From staking and liquidity provision to a dynamic NFT marketplace, our platform offers a full suite of tools for digital asset management.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-10">
          {features.map((feature, index) => (
            <div
              key={index}
              className="feature-card group relative p-[1px] rounded-2xl bg-gradient-to-r from-amber-500/40 via-yellow-500/40 to-orange-500/40 transition duration-300"
            >
              <div className="bg-zinc-900 rounded-2xl p-6 h-full flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-4 mb-4">
                    {feature.icon}
                    <h3 className="text-2xl font-semibold group-hover:text-amber-400 transition">
                      {feature.title}
                    </h3>
                  </div>
                  <p className="text-gray-400 mb-8">
                    {feature.description}
                  </p>
                </div>

                <button
                  onClick={() => navigate(feature.route)}
                  className="group/button relative flex items-center justify-center gap-2 w-full px-6 py-3 rounded-xl text-amber-400 border border-amber-400 overflow-hidden transition-all duration-300 cursor-pointer"
                >
                  <span className="absolute inset-0 bg-amber-500 scale-x-0 group-hover/button:scale-x-100 origin-left transition-transform duration-300"></span>
                  <span className="relative z-10 group-hover/button:text-black transition-colors duration-300 flex items-center gap-2">
                    Explore
                    <CircleArrowRight size={20} />
                  </span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default CorePlatformFeature