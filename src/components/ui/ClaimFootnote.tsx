import { ClaimId, getClaim } from "@/lib/claims"
import { getEvidenceSources } from "@/lib/evidence"
import { cn } from "@/lib/utils"

interface ClaimFootnoteProps {
    claimId: ClaimId
    className?: string
}

export function ClaimFootnote({ claimId, className }: ClaimFootnoteProps) {
    const claim = getClaim(claimId)
    const evidence = getEvidenceSources(claim.evidenceIds)

    return (
        <div className={cn("mt-3 space-y-1 text-[11px] leading-relaxed text-slate-500", className)}>
            <div className="font-semibold uppercase tracking-wide text-slate-400">
                Evidence
            </div>
            <ul className="space-y-1">
                {evidence.map((source, index) => (
                    <li key={source.id}>
                        <span className="mr-1 text-slate-400">[{index + 1}]</span>
                        {source.url ? (
                            <a
                                href={source.url}
                                target="_blank"
                                rel="noreferrer"
                                className="underline decoration-dotted hover:text-slate-700"
                            >
                                {source.shortCitation} ({source.publication})
                            </a>
                        ) : (
                            <span>
                                {source.shortCitation} ({source.publication})
                            </span>
                        )}
                    </li>
                ))}
            </ul>
            <p className="text-slate-400">
                {claim.disclaimer}
            </p>
        </div>
    )
}
