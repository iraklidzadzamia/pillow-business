"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/Button"
import { QuizOpenSource } from "@/lib/analytics"
import { ArrowRight, Clock, CheckCircle2, ShoppingCart, ShieldCheck } from "lucide-react"
import Image from "next/image"

interface HeroProps {
    onOpenQuiz: (source: QuizOpenSource) => void
}

export function Hero({ onOpenQuiz }: HeroProps) {
    return (
        <section className="relative h-screen min-h-[600px] md:min-h-[800px] flex items-center justify-center overflow-hidden bg-background">
            <div className="glow-bg top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"></div>
            {/* Background Image / Video Placeholder */}
            <div className="absolute inset-0 z-0">
                <Image
                    src="/images/hero-main.jpg"
                    alt="Perfect spinal alignment"
                    fill
                    className="object-cover object-center md:object-[68%_center] opacity-90"
                    quality={92}
                    sizes="100vw"
                    priority
                />
                <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(11,17,32,0.94)_0%,rgba(11,17,32,0.86)_36%,rgba(11,17,32,0.58)_62%,rgba(11,17,32,0.30)_100%)]" />
                <div className="absolute inset-0 bg-gradient-to-t from-background via-background/55 to-background/20" />
            </div>

            <div className="container relative z-10 px-4 md:px-8 text-center mt-12 md:mt-0">
                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="text-4xl md:text-5xl lg:text-7xl font-bold font-serif text-white mb-6 tracking-tight max-w-4xl mx-auto leading-tight md:leading-tight"
                >
                    Stop guessing your pillow. <span className="text-accent bg-clip-text text-transparent bg-gradient-to-r from-accent to-emerald-300">Get your match.</span>
                </motion.h1>

                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="text-lg md:text-xl text-gray-300 mb-10 max-w-2xl mx-auto px-4"
                >
                    End the endless trial-and-error. Discover the exact geometric fit your spine needs to heal—not hurt—with our biomechanical quiz.
                </motion.p>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.4 }}
                    className="flex flex-col items-center"
                >
                    <Button variant="pulse" size="lg" className="group" onClick={() => onOpenQuiz("hero")}>
                        Take the 30-Second Sleep Quiz
                        <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </Button>

                    <div className="flex flex-wrap items-center justify-center gap-3 md:gap-4 mt-8 text-xs md:text-sm text-slate-300 font-medium">
                        <div className="flex items-center gap-1.5">
                            <Clock className="w-4 h-4 text-emerald-500" />
                            <span>30 seconds</span>
                        </div>
                        <div className="w-1 h-1 bg-slate-600 rounded-full hidden sm:block"></div>
                        <div className="flex items-center gap-1.5">
                            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                            <span>3 questions</span>
                        </div>
                        <div className="w-1 h-1 bg-slate-600 rounded-full hidden sm:block"></div>
                        <div className="flex items-center gap-1.5">
                            <ShoppingCart className="w-4 h-4 text-emerald-500" />
                            <span>Amazon picks</span>
                        </div>
                        <div className="w-1 h-1 bg-slate-600 rounded-full hidden sm:block"></div>
                        <div className="flex items-center gap-1.5">
                            <ShieldCheck className="w-4 h-4 text-emerald-500" />
                            <span>No email required</span>
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    )
}
