"use client"

import { motion } from "framer-motion"
import { Star } from "lucide-react"
import { useState, useEffect } from "react"

const TESTIMONIALS = [
    {
        id: 1,
        text: "I spent $2,000 on a mattress, but my neck pain didn't stop until I spent $89 on this pillow. The 'Gap' logic just makes sense.",
        author: "Sarah J.",
        role: "Side Sleeper",
        rating: 5
    },
    {
        id: 2,
        text: "Neck pain gone in 3 days. I didn't verify it scientifically, but I woke up without a headache for the first time in years.",
        author: "Michael R.",
        role: "Back Sleeper",
        rating: 5
    },
    {
        id: 3,
        text: "Finally a pillow that doesn't suffocate me. The Ultra-Low profile is exactly what I needed as a stomach sleeper.",
        author: "Jessica T.",
        role: "Stomach Sleeper",
        rating: 5
    }
]

export function SocialProof() {
    const [active, setActive] = useState(0)

    useEffect(() => {
        const timer = setInterval(() => {
            setActive((prev) => (prev + 1) % TESTIMONIALS.length)
        }, 5000)
        return () => clearInterval(timer)
    }, [])

    return (
        <section id="reviews" className="py-24 bg-background relative overflow-hidden">
            <div className="absolute top-0 left-1/2 w-full max-w-3xl h-[400px] bg-accent/5 rounded-full blur-3xl opacity-30 pointer-events-none -z-10 -translate-x-1/2 -translate-y-1/2" />

            <div className="container mx-auto px-4 md:px-8 text-center relative z-10">
                <h2 className="text-sm md:text-base font-bold text-accent uppercase tracking-[0.2em] mb-12 flex items-center justify-center gap-3">
                    <span className="w-8 h-px bg-accent/30"></span>
                    Rated 4.9/5 by 10,000+ Sleepers
                    <span className="w-8 h-px bg-accent/30"></span>
                </h2>

                <div className="relative max-w-4xl mx-auto min-h-[350px]">
                    <div className="overflow-hidden">
                        <motion.div
                            key={active}
                            initial={{ opacity: 0, scale: 0.95, filter: "blur(10px)" }}
                            animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                            exit={{ opacity: 0, scale: 1.05, filter: "blur(10px)" }}
                            transition={{ duration: 0.5, ease: "easeOut" }}
                            className="glass-card bg-secondary/40 p-8 md:p-12 rounded-3xl border border-white/10 shadow-[0_10px_40px_rgba(0,0,0,0.5)]"
                        >
                            <div className="flex justify-center gap-1.5 mb-8">
                                {[...Array(5)].map((_, i) => (
                                    <Star key={i} className="w-5 h-5 md:w-6 md:h-6 fill-accent text-accent drop-shadow-[0_0_8px_rgba(16,185,129,0.8)]" />
                                ))}
                            </div>
                            <p className="text-xl md:text-3xl font-medium font-serif text-white mb-10 leading-relaxed italic">
                                &ldquo;{TESTIMONIALS[active].text}&rdquo;
                            </p>
                            <div className="flex flex-col items-center">
                                <div className="w-12 h-px bg-white/20 mb-4"></div>
                                <div className="font-bold text-lg text-white font-serif">{TESTIMONIALS[active].author}</div>
                                <div className="text-accent text-sm md:text-base mt-1 font-medium">{TESTIMONIALS[active].role}</div>
                            </div>
                        </motion.div>
                    </div>

                    <div className="flex justify-center gap-3 mt-8">
                        {TESTIMONIALS.map((_, i) => (
                            <button
                                key={i}
                                onClick={() => setActive(i)}
                                className={`w-2.5 h-2.5 md:w-3 md:h-3 rounded-full transition-all duration-300 ${i === active ? "bg-accent w-8 md:w-10 shadow-[0_0_10px_rgba(16,185,129,0.5)]" : "bg-white/20 hover:bg-white/40"}`}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </section>
    )
}
