export function Footer() {
    return (
        <footer className="bg-background text-white py-12 border-t border-white/5 relative overflow-hidden">
            <div className="absolute top-0 left-1/2 w-full max-w-3xl h-[200px] bg-accent/5 rounded-full blur-3xl opacity-20 pointer-events-none -translate-x-1/2 -translate-y-1/2" />
            <div className="container mx-auto px-4 grid md:grid-cols-4 gap-8 relative z-10">
                <div className="col-span-1 md:col-span-2">
                    <h3 className="text-2xl font-bold font-serif mb-4 flex items-center gap-2">
                        <span className="text-accent text-3xl">✦</span> SpineAlign
                    </h3>
                    <p className="text-muted-foreground max-w-sm">
                        The first pillow engineered for human geometry. Stop buying pillows. Buy alignment.
                    </p>
                </div>
                <div>
                    <h4 className="font-bold font-serif mb-4 text-white">Menu</h4>
                    <ul className="space-y-2 text-muted-foreground">
                        <li><a href="#problem" className="hover:text-accent transition-colors">The Problem</a></li>
                        <li><a href="#products" className="hover:text-accent transition-colors">Products</a></li>
                        <li><a href="#reviews" className="hover:text-accent transition-colors">Reviews</a></li>
                    </ul>
                </div>
                <div>
                    <h4 className="font-bold font-serif mb-4 text-white">Legal</h4>
                    <ul className="space-y-2 text-muted-foreground">
                        <li className="hover:text-white cursor-pointer transition-colors">Privacy Policy</li>
                        <li className="hover:text-white cursor-pointer transition-colors">Terms of Service</li>
                        <li className="hover:text-white cursor-pointer transition-colors">Returns</li>
                    </ul>
                </div>
            </div>
            <div className="container mx-auto px-4 mt-12 pt-8 border-t border-white/5 text-center text-muted-foreground text-sm relative z-10">
                © {new Date().getFullYear()} SpineAlign. All rights reserved.
            </div>
        </footer>
    )
}
