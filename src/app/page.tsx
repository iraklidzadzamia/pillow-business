"use client"

import { useState } from "react"
import { Header } from "@/components/layout/Header"
import { Hero } from "@/components/sections/Hero"
import { Problem } from "@/components/sections/Problem"
import { ScientificProof } from "@/components/sections/ScientificProof"
import { SocialProof } from "@/components/sections/SocialProof"
import { Offer } from "@/components/sections/Offer"
import { Footer } from "@/components/layout/Footer"
import { Quiz } from "@/components/sections/Quiz"
import { QuizOpenSource, trackEvent } from "@/lib/analytics"

export default function Home() {
  const [isQuizOpen, setIsQuizOpen] = useState(false)

  const openQuiz = (source: QuizOpenSource) => {
    trackEvent("quiz_open", { source })
    setIsQuizOpen(true)
  }
  const closeQuiz = () => setIsQuizOpen(false)

  return (
    <main className="min-h-screen bg-slate-50">
      <Header onOpenQuiz={openQuiz} />

      <Hero onOpenQuiz={openQuiz} />

      <Problem />

      <ScientificProof />

      <Offer />

      <SocialProof />

      <Footer />

      <Quiz isOpen={isQuizOpen} onClose={closeQuiz} />
    </main>
  )
}
