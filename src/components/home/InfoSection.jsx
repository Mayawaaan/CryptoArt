import { CircleCheck } from "lucide-react"
import Logo from "../../assets/CryptoArt.png"
import features from "../../data/features"
import { useEffect, useRef } from "react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

gsap.registerPlugin(ScrollTrigger)

const InfoSection = () => {
  const sectionRef = useRef(null)
  const imageRef = useRef(null)
  const contentRef = useRef(null)
  const featuresRef = useRef([])

  useEffect(() => {
    const ctx = gsap.context(() => {

      // Image animation
      gsap.from(imageRef.current, {
        x: -100,
        opacity: 0,
        duration: 1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 80%",
          end: "top 70%",
          scrub: 1,
        },
      })

      // Heading + paragraph animation
      gsap.from(contentRef.current.children, {
        y: 40,
        opacity: 0,
        duration: 0.8,
        stagger: 0.2,
        ease: "power3.out",
        scrollTrigger: {
          trigger: contentRef.current,
          start: "top 85%",
          end: "top 70%",
          scrub: 1,
        },
      })

      // Features stagger animation
      gsap.from(featuresRef.current, {
        y: 30,
        opacity: 0,
        duration: 0.6,
        stagger: 0.15,
        ease: "power2.out",
        scrollTrigger: {
          trigger: featuresRef.current[0],
          start: "top 90%",
          end: "top 70%",
          scrub: 1,
        },
      })

    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section ref={sectionRef} className="w-full my-16">
      <div className="container mx-auto px-6 flex flex-col-reverse lg:flex-row items-center gap-12">

        {/* LEFT IMAGE */}
        <div className="lg:w-1/2 flex justify-center">
          <img
            ref={imageRef}
            src={Logo}
            alt="Platform Features"
            className="w-full max-w-md object-contain rounded-3xl shadow-2xl"
          />
        </div>

        {/* RIGHT CONTENT */}
        <div className="lg:w-1/2">
          <div ref={contentRef} className="flex flex-col gap-6">
            <h1 className="text-4xl font-bold">
              Built for Builders and Investors Alike
            </h1>

            <p className="text-gray-500">
              Our platform provides robust APIs for developers and intuitive
              dashboards for long-term investors. Whether you're scaling a dApp
              or managing a private portfolio, we have the tools you need.
            </p>

            {/* FEATURES GRID */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-6">
              {features.map((feature, index) => (
                <div
                  key={index}
                  ref={(el) => (featuresRef.current[index] = el)}
                  className="flex items-start gap-3"
                >
                  <div className="bg-gray-100 dark:bg-slate-800 p-2 rounded-lg">
                    <CircleCheck size={18} className="text-green-500" />
                  </div>
                  <span className="text-sm text-gray-700 dark:text-gray-300">
                    {feature}
                  </span>
                </div>
              ))}
            </div>

          </div>
        </div>

      </div>
    </section>
  )
}

export default InfoSection