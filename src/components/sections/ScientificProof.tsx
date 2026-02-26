"use client"

import { motion } from "framer-motion"
import { ShieldCheck, AlertTriangle } from "lucide-react"
import { getClaim } from "@/lib/claims"
import { ClaimFootnote } from "@/components/ui/ClaimFootnote"

export function ScientificProof() {
    const refluxClaim = getClaim("scientific_right_side_reflux")
    const supportClaim = getClaim("scientific_left_side_support")

    return (
        <section className="py-24 bg-background relative overflow-hidden">
            <div className="absolute top-1/2 left-0 w-[500px] h-[500px] bg-accent/5 rounded-full blur-3xl opacity-30 pointer-events-none -z-10 -translate-x-1/2 -translate-y-1/2" />
            <div className="container mx-auto px-4 md:px-8 relative z-10">
                <div className="grid md:grid-cols-2 gap-12 items-center">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="space-y-6"
                    >
                        <h2 className="text-3xl md:text-5xl font-bold font-serif text-white">Why <span className="text-error underline decoration-4 decoration-error/50">Right</span> is Wrong.</h2>
                        <p className="text-lg text-muted-foreground leading-relaxed">
                            {refluxClaim.body}
                        </p>

                        <div className="glass-card p-6 md:p-8 rounded-2xl mt-8">
                            <div className="flex items-start gap-4 mb-6">
                                <div className="bg-error/20 p-3 rounded-xl text-error">
                                    <AlertTriangle className="w-6 h-6" />
                                </div>
                                <div>
                                    <h4 className="font-bold font-serif text-white text-lg">Right Side Sleeping</h4>
                                    <p className="text-sm text-muted-foreground mt-1">Increases Esophageal Acid Exposure</p>
                                </div>
                            </div>
                            <div className="h-px bg-white/10 my-6" />
                            <div className="flex items-start gap-4">
                                <div className="bg-accent/20 p-3 rounded-xl text-accent">
                                    <ShieldCheck className="w-6 h-6" />
                                </div>
                                <div>
                                    <h4 className="font-bold font-serif text-white text-lg">Left Side + SpineAlign</h4>
                                    <p className="text-sm text-muted-foreground mt-1">{supportClaim.headline}</p>
                                </div>
                            </div>
                        </div>

                        <ClaimFootnote claimId="scientific_right_side_reflux" />
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        className="glass-card bg-secondary/50 rounded-3xl p-8 md:p-12 text-white relative overflow-hidden border border-white/10 shadow-[0_0_40px_rgba(16,185,129,0.1)]"
                    >
                        {/* Abstract medical graphic background */}
                        <div className="absolute top-0 right-0 w-64 h-64 bg-accent/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
                        <div className="absolute bottom-0 left-0 w-48 h-48 bg-accent/20 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />

                        <div className="relative z-10 text-center">
                            <div className="text-5xl md:text-6xl font-bold font-serif text-transparent bg-clip-text bg-gradient-to-r from-accent to-emerald-200 mb-3 drop-shadow-sm">Left Side</div>
                            <div className="text-lg md:text-xl font-medium mb-10 text-slate-300">Commonly favored in reflux-positioning guidance</div>

                            <div className="text-5xl md:text-6xl font-bold font-serif text-transparent bg-clip-text bg-gradient-to-r from-accent to-emerald-200 mb-3 drop-shadow-sm">Neutral Neck</div>
                            <div className="text-lg md:text-xl font-medium text-slate-300">Positioning strategy for airway mechanics</div>
                        </div>

                        <ClaimFootnote claimId="scientific_left_side_support" className="relative z-10 mt-10 text-slate-400 [&_a]:text-accent hover:[&_a]:text-emerald-300 [&_p]:text-slate-400 [&_span]:text-slate-500 text-sm" />
                    </motion.div>
                </div>

                {/* The Beauty Angle / Sleep Wrinkles */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="mt-16 glass-card p-8 md:p-12 rounded-3xl border border-white/10 relative overflow-hidden"
                >
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-accent via-emerald-400 to-transparent" />
                    <div className="grid md:grid-cols-2 gap-8 items-center">
                        <div>
                            <h3 className="text-2xl md:text-3xl font-bold font-serif text-white mb-4">Side-Sleeper Sag: <br /><span className="text-slate-400">The Pillow is Your Face's Gravity</span></h3>
                            <p className="text-base md:text-lg text-slate-300 leading-relaxed mb-6">
                                Consumers spend a fortune on anti-aging creams, but expression wrinkles are different from <strong>sleep wrinkles</strong>. Botox cannot fix permanent dermal "fault lines" caused by smashing your face into a collapsing pillow for 8 hours.
                            </p>
                            <ul className="space-y-4">
                                <li className="flex items-start gap-3">
                                    <ShieldCheck className="w-5 h-5 text-accent shrink-0 mt-1" />
                                    <span className="text-sm md:text-base text-slate-300"><strong className="text-white">64% of people</strong> exhibit facial asymmetry directly corresponding to their preferred sleep side.</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <ShieldCheck className="w-5 h-5 text-accent shrink-0 mt-1" />
                                    <span className="text-sm md:text-base text-slate-300">As we age, we shift positions less (dropping to just 16 times a night), trapping aging skin under <strong>static mechanical compression</strong> for longer.</span>
                                </li>
                            </ul>
                        </div>
                        <div className="relative h-64 md:h-full min-h-[300px] rounded-2xl overflow-hidden bg-black/40 border border-white/5 flex items-center justify-center">
                            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(16,185,129,0.1)_0%,transparent_70%)]" />
                            <div className="text-center p-6 relative z-10">
                                <div className="text-5xl md:text-6xl font-bold text-white mb-2 drop-shadow-md">8 Hours</div>
                                <div className="text-sm md:text-base text-accent uppercase tracking-widest font-bold">Of Static Compression</div>
                                <div className="mt-6 h-px w-12 bg-accent/50 mx-auto"></div>
                                <p className="text-sm text-slate-400 mt-6 max-w-xs mx-auto">Our geometric fit keeps your head level, reducing the sheer facial forces caused by generic pillows.</p>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    )
}
