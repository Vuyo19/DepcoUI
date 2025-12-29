import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useUser } from '@clerk/clerk-react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui'
import { cn } from '@/lib/utils'

const slides = [
  {
    id: 1,
    title: 'Your Dream Home Awaits',
    subtitle: "Don't let a deposit hold you back",
    description:
      'Get the rental deposit you need with affordable monthly payments. Apply in minutes.',
    gradient: 'from-blue-500 to-blue-700',
    image: '/images/hero-1.jpg',
  },
  {
    id: 2,
    title: 'First-Time Borrower?',
    subtitle: 'No credit history? No problem',
    description:
      'Our AI-powered assessment looks beyond traditional credit scores to give you a fair chance.',
    gradient: 'from-sky-500 to-sky-700',
    image: '/images/hero-2.jpg',
  },
  {
    id: 3,
    title: 'Quick & Easy Process',
    subtitle: 'Apply from anywhere',
    description:
      'Mobile-first application. Get approved in as little as 24 hours.',
    gradient: 'from-indigo-500 to-indigo-700',
    image: '/images/hero-3.jpg',
  },
]

export function HeroSlider() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const { isSignedIn } = useUser()

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length)
    }, 6000)
    return () => clearInterval(timer)
  }, [])

  const goToSlide = (index: number) => {
    setCurrentSlide(index)
  }

  const goToPrevious = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length)
  }

  const goToNext = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length)
  }

  return (
    <section className="relative h-[600px] overflow-hidden lg:h-[700px]">
      <AnimatePresence mode="wait">
        {slides.map(
          (slide, index) =>
            index === currentSlide && (
              <motion.div
                key={slide.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
                className={cn(
                  'absolute inset-0 bg-gradient-to-br',
                  slide.gradient
                )}
              >
                <div className="absolute inset-0 bg-black/20" />
                <div className="relative mx-auto flex h-full max-w-7xl items-center px-4 sm:px-6 lg:px-8">
                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3, duration: 0.5 }}
                    className="max-w-2xl text-white"
                  >
                    <p className="text-lg font-medium text-white/90 lg:text-xl">
                      {slide.subtitle}
                    </p>
                    <h1 className="mt-2 text-4xl font-bold leading-tight lg:text-6xl">
                      {slide.title}
                    </h1>
                    <p className="mt-6 text-lg text-white/90 lg:text-xl">
                      {slide.description}
                    </p>
                    <div className="mt-8 flex flex-col gap-4 sm:flex-row">
                      <Link to={isSignedIn ? '/apply' : '/register'}>
                        <Button
                          size="lg"
                          className="!bg-white !text-sky-600 hover:!bg-sky-50 shadow-lg"
                          rightIcon={<ArrowRight className="h-5 w-5" />}
                        >
                          {isSignedIn ? 'Apply Now' : 'Get Started'}
                        </Button>
                      </Link>
                      <Link to="/about">
                        <Button
                          variant="outline"
                          size="lg"
                          className="!border-white !text-white hover:!bg-white/10"
                        >
                          Learn More
                        </Button>
                      </Link>
                    </div>
                  </motion.div>
                </div>
              </motion.div>
            )
        )}
      </AnimatePresence>

      {/* Navigation Arrows */}
      <button
        onClick={goToPrevious}
        className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-white/20 p-2 text-white backdrop-blur-sm transition-colors hover:bg-white/30 lg:left-8"
        aria-label="Previous slide"
      >
        <ChevronLeft className="h-6 w-6" />
      </button>
      <button
        onClick={goToNext}
        className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-white/20 p-2 text-white backdrop-blur-sm transition-colors hover:bg-white/30 lg:right-8"
        aria-label="Next slide"
      >
        <ChevronRight className="h-6 w-6" />
      </button>

      {/* Slide Indicators */}
      <div className="absolute bottom-8 left-1/2 flex -translate-x-1/2 gap-2">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={cn(
              'h-2 rounded-full transition-all duration-300',
              index === currentSlide
                ? 'w-8 bg-white'
                : 'w-2 bg-white/50 hover:bg-white/70'
            )}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </section>
  )
}
