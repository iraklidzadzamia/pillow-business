"use client"

import { PRODUCTS } from "@/lib/data"
import { Button } from "@/components/ui/Button"
import { trackEvent } from "@/lib/analytics"
import Image from "next/image"

export function Offer() {
    return (
        <section id="products" className="py-24 bg-background relative overflow-hidden">
            {/* Subtle background glow */}
            <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-accent/5 rounded-full blur-3xl opacity-40 pointer-events-none -z-10 -translate-x-1/2 translate-y-1/2" />

            <div className="container mx-auto px-4 md:px-8">
                <div className="text-center mb-16 relative z-10">
                    <h2 className="text-3xl md:text-5xl font-bold font-serif text-white mb-4">
                        Recommended Pillows
                    </h2>
                    <p className="text-xl text-muted-foreground">
                        We recommend real, widely available products on Amazon.com for transparency.
                    </p>
                </div>

                <div className="grid md:grid-cols-3 gap-8 relative z-10">
                    {PRODUCTS.map((product) => {
                        return (
                            <div
                                key={product.id}
                                className="glass-card rounded-3xl overflow-hidden hover:shadow-[0_8px_40px_rgba(16,185,129,0.15)] hover:-translate-y-2 transition-all duration-500 flex flex-col group"
                            >
                                <div className="relative h-56 bg-secondary/50 p-6 flex items-center justify-center overflow-hidden">
                                    <div className="absolute inset-0 bg-gradient-to-t from-secondary/80 to-transparent z-10" />
                                    <Image
                                        src={product.image || "/images/cube.png"}
                                        alt={product.name}
                                        fill
                                        className="object-contain p-8 group-hover:scale-110 transition-transform duration-700 relative z-0"
                                    />
                                </div>

                                <div className="p-6 md:p-8 flex-grow flex flex-col relative z-20">
                                    <div className="mb-4">
                                        <div className="text-accent font-bold text-xs uppercase tracking-widest mb-3 flex items-center gap-2">
                                            <span className="w-2 h-2 rounded-full bg-accent animate-pulse-slow"></span>
                                            Amazon Pick
                                        </div>
                                        <h3 className="text-2xl font-bold font-serif text-white mb-2 leading-tight">
                                            {product.name}
                                        </h3>
                                        <div className="text-sm font-medium text-emerald-400">{product.tagline}</div>
                                    </div>

                                    <div className="text-muted-foreground leading-relaxed text-sm md:text-base mb-8">
                                        {product.description}
                                    </div>

                                    <div className="mt-auto">
                                        <Button
                                            className="w-full"
                                            onClick={() => {
                                                trackEvent("amazon_buy_click", {
                                                    product_id: product.id,
                                                    source: "offer_grid",
                                                })
                                                window.open(product.amazonUrl, "_blank", "noopener,noreferrer")
                                            }}
                                        >
                                            Buy on Amazon
                                        </Button>

                                        <div className="text-xs text-slate-400 mt-3">
                                            Prices, shipping, and returns are handled by Amazon.
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>
        </section>
    )
}
