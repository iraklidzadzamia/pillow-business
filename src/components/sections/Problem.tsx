"use client"

import { useState } from "react"
import { AlertTriangle, Camera, CheckCircle2, Ruler, ShieldCheck } from "lucide-react"
import Image from "next/image"

type GapStateId = "too_low" | "neutral" | "too_high"

const GAP_STATE_ORDER: GapStateId[] = ["too_low", "neutral", "too_high"]

const GAP_STATE_CONFIG: Record<
    GapStateId,
    {
        label: string
        title: string
        imageSrc: string
        badgeLabel: string
        badgeClass: string
        summary: string
        equationHint: string
        icon: typeof AlertTriangle
    }
> = {
    too_low: {
        label: "Too Low",
        title: "The Orthopedic Nightmare",
        imageSrc: "/images/too-low-new.jpg",
        badgeLabel: "C5-C8 Compression",
        badgeClass: "text-error border-error/30 bg-error/10",
        summary: "Insufficient loft locks your neck in lateral flexion, compressing nerve roots and grinding facet joints all night.",
        equationHint: "If A (shoulder width) is larger than your loft, you're risking tingling arms and morning stiffness.",
        icon: AlertTriangle,
    },
    neutral: {
        label: "Neutral",
        title: "The Algorithmic Solution",
        imageSrc: "/images/gap_neutral_pdf.jpg",
        badgeLabel: "Weightless Alignment",
        badgeClass: "text-accent border-accent/30 bg-accent/10",
        summary: "The pillow precisely bridges your specific anatomical gap. When the math is right, the pillow feels like it disappears.",
        equationHint: "Zero pressure is achieved when your pillow fills the exact space between your head and the mattress.",
        icon: CheckCircle2,
    },
    too_high: {
        label: "Too High",
        title: "The Respiratory Trap",
        imageSrc: "/images/too-high-new.jpg",
        badgeLabel: "Airway Narrowing",
        badgeClass: "text-amber-300 border-amber-300/30 bg-amber-400/10",
        summary: "Excess loft forces a 'chin-to-chest' posture—like bending a straw—narrowing the pharyngeal airway and triggering snoring.",
        equationHint: "If loft exceeds A - B, your vital lung capacity drops as your airway is mechanically compressed.",
        icon: AlertTriangle,
    },
}

export function Problem() {
    const [activeState, setActiveState] = useState<GapStateId>("neutral")
    const active = GAP_STATE_CONFIG[activeState]
    const ActiveIcon = active.icon

    return (
        <section id="problem" className="py-24 bg-background overflow-hidden relative">
            <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-accent/5 rounded-full blur-3xl opacity-50 pointer-events-none -z-10 translate-x-1/3 -translate-y-1/3" />

            <div className="container mx-auto px-4 md:px-8">
                <div className="text-center mb-16 relative z-10">
                    <h2 className="text-3xl md:text-5xl font-bold font-serif text-white mb-4">The 24/7 Alignment Loop</h2>
                    <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                        Your pillow is a medical tool. It either supports your spinal health, or silently undermines it for 8 hours every night.
                    </p>
                </div>

                <div className="max-w-5xl mx-auto">
                    <div className="grid gap-3 sm:grid-cols-3 mb-6">
                        {GAP_STATE_ORDER.map((stateId) => {
                            const option = GAP_STATE_CONFIG[stateId]
                            const isActive = activeState === stateId
                            const OptionIcon = option.icon

                            return (
                                <button
                                    key={stateId}
                                    onClick={() => setActiveState(stateId)}
                                    className={`rounded-xl border p-4 text-left transition-all ${isActive
                                        ? "border-accent/60 bg-accent/10 shadow-[0_0_25px_rgba(16,185,129,0.15)]"
                                        : "border-white/10 bg-secondary/40 hover:border-white/30"
                                        }`}
                                >
                                    <div className="flex items-center gap-2 text-white font-semibold">
                                        <OptionIcon className="w-4 h-4" />
                                        {option.label}
                                    </div>
                                    <p className="mt-2 text-xs text-slate-300">{option.summary}</p>
                                </button>
                            )
                        })}
                    </div>

                    <div className="glass-card rounded-2xl overflow-hidden border border-white/10">
                        <div className="relative aspect-[4/3] md:aspect-[16/9] overflow-hidden bg-black rounded-b-none">
                            {/* Blurred Background Image Container */}
                            <div className="absolute inset-[-20%] z-0">
                                <Image
                                    src={active.imageSrc}
                                    alt={`${active.title} blurred background`}
                                    fill
                                    className="object-cover opacity-70 blur-3xl scale-125"
                                    sizes="(max-width: 640px) 100vw, (max-width: 1280px) 92vw, 1100px"
                                />
                            </div>

                            {/* Foreground Image Container */}
                            <div
                                className="absolute inset-0 z-10 transition-all duration-500"
                                style={{
                                    maskImage: activeState !== "neutral" ? "linear-gradient(to right, transparent 15%, black 25%, black 75%, transparent 85%)" : "none",
                                    WebkitMaskImage: activeState !== "neutral" ? "linear-gradient(to right, transparent 15%, black 25%, black 75%, transparent 85%)" : "none",
                                }}
                            >
                                <Image
                                    src={active.imageSrc}
                                    alt={active.title}
                                    fill
                                    className="object-contain"
                                    quality={100}
                                    sizes="(max-width: 640px) 100vw, (max-width: 1280px) 92vw, 1100px"
                                />
                            </div>

                            {/* Gradient Overlay */}
                            <div className="absolute inset-0 z-20 bg-gradient-to-t from-background/95 via-background/20 to-transparent opacity-90 pointer-events-none" />

                            <div className="absolute top-4 left-4 md:top-6 md:left-6">
                                <span className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-bold uppercase tracking-wide backdrop-blur-sm ${active.badgeClass}`}>
                                    <ActiveIcon className="w-4 h-4" />
                                    {active.badgeLabel}
                                </span>
                            </div>

                            <div className="absolute bottom-0 left-0 right-0 p-4 md:p-6 bg-gradient-to-t from-background/85 to-transparent">
                                <h3 className="text-xl md:text-2xl font-bold font-serif text-white">{active.title}</h3>
                                <p className="mt-2 text-sm text-slate-300 max-w-2xl">{active.summary}</p>
                            </div>
                        </div>

                        <div className="border-t border-white/10 bg-black/20 p-4 md:p-6 space-y-2">
                            <div className="text-xs uppercase tracking-widest text-slate-400 font-semibold">The Physics of Sleep (The Equation)</div>
                            <p className="text-sm md:text-base text-slate-200">
                                <span className="text-white font-semibold">A</span> (Shoulder Width) -{" "}
                                <span className="text-white font-semibold">B</span> (Mattress Sinkage) ={" "}
                                <span className="text-accent font-bold">Required Pillow Loft</span>
                            </p>
                            <p className="text-xs md:text-sm text-slate-400">{active.equationHint}</p>
                        </div>
                    </div>
                </div>

                <div className="max-w-5xl mx-auto mt-8">
                    <div className="text-sm font-semibold text-slate-300 uppercase tracking-wide mb-3">30-Second Selfie Test</div>
                    <div className="grid gap-4 md:grid-cols-3">
                        <div className="rounded-xl border border-white/10 bg-secondary/40 p-4">
                            <div className="flex items-center gap-2 text-white font-semibold mb-2">
                                <Camera className="w-4 h-4 text-accent" />
                                Step 1
                            </div>
                            <p className="text-sm text-slate-300">Lie in your normal side-sleep position and take a quick photo from mattress level.</p>
                        </div>
                        <div className="rounded-xl border border-white/10 bg-secondary/40 p-4">
                            <div className="flex items-center gap-2 text-white font-semibold mb-2">
                                <Ruler className="w-4 h-4 text-accent" />
                                Step 2
                            </div>
                            <p className="text-sm text-slate-300">Draw a line from philtrum (under nose) to suprasternal notch (collarbone center).</p>
                        </div>
                        <div className="rounded-xl border border-white/10 bg-secondary/40 p-4">
                            <div className="flex items-center gap-2 text-white font-semibold mb-2">
                                <ShieldCheck className="w-4 h-4 text-accent" />
                                Step 3
                            </div>
                            <p className="text-sm text-slate-300">If the line tilts down, add loft. If it tilts up, reduce loft. Level means neutral.</p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}
