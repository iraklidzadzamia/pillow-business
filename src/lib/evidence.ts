export interface EvidenceSource {
    id: string
    shortCitation: string
    publication: string
    year?: number
    url?: string
}

export const EVIDENCE_REGISTRY = {
    asj_sleep_crease: {
        shortCitation: "Sleep lines and mechanical facial compression patterns",
        publication: "Aesthetic Surgery Journal",
        year: 2016,
        url: "https://academic.oup.com/asj",
    },
    jcg_reflux_position: {
        shortCitation: "Positional effects on nighttime reflux exposure",
        publication: "Journal of Clinical Gastroenterology",
        year: 2015,
        url: "https://journals.lww.com/jcge/pages/default.aspx",
    },
    pubmed_airway_positioning: {
        shortCitation: "Sleep posture and upper-airway patency (reviewed studies)",
        publication: "PubMed indexed literature",
        url: "https://pubmed.ncbi.nlm.nih.gov/?term=sleep+position+airway+patency",
    },
    pubmed_cervical_posture: {
        shortCitation: "Cervical posture, musculoskeletal load, and symptom correlation",
        publication: "PubMed indexed literature",
        url: "https://pubmed.ncbi.nlm.nih.gov/?term=cervical+spine+posture+sleep+pain",
    },
    pubmed_lumbar_extension: {
        shortCitation: "Lumbar extension stress and low-back symptom patterns",
        publication: "PubMed indexed literature",
        url: "https://pubmed.ncbi.nlm.nih.gov/?term=lumbar+extension+sleep+position",
    },
} as const satisfies Record<string, Omit<EvidenceSource, "id">>

export type EvidenceId = keyof typeof EVIDENCE_REGISTRY

export function getEvidenceSource(id: EvidenceId): EvidenceSource {
    return { id, ...EVIDENCE_REGISTRY[id] }
}

export function getEvidenceSources(ids: readonly EvidenceId[]): EvidenceSource[] {
    return ids.map((id) => getEvidenceSource(id))
}
