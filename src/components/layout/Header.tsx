"use client"

import Link from "next/link"
import { Button } from "@/components/ui/Button"
import { QuizOpenSource } from "@/lib/analytics"
import { Brain } from "lucide-react"

interface HeaderProps {
    onOpenQuiz: (source: QuizOpenSource) => void
}

export function Header({ onOpenQuiz }: HeaderProps) {
    return (
        <header className="fixed top-0 w-full z-50 glass border-b border-white/5 transition-all duration-300">
            <div className="container mx-auto px-4 md:px-8 h-16 md:h-20 flex items-center justify-between">
                <Link href="/" className="flex items-center space-x-2 md:space-x-3">
                    <Brain className="w-6 h-6 md:w-8 md:h-8 text-accent" />
                    <span className="text-lg md:text-2xl font-bold font-serif tracking-tight text-white">SpineAlign</span>
                </Link>

                <nav className="hidden md:flex items-center gap-6">
                    <Link href="#problem" className="text-sm font-medium text-gray-600 hover:text-[var(--color-primary)]">The Problem</Link>
                    <Link href="#products" className="text-sm font-medium text-gray-600 hover:text-[var(--color-primary)]">Products</Link>
                    <Link href="#reviews" className="text-sm font-medium text-gray-600 hover:text-[var(--color-primary)]">Reviews</Link>
                </nav>

                <Button variant="primary" size="sm" onClick={() => onOpenQuiz("header")}>
                    Take the Sleep Quiz
                </Button>
            </div>
        </header>
    )
}
