import { EVIDENCE_REGISTRY, EvidenceId } from "@/lib/evidence"

export interface ClaimDefinition {
    headline: string
    body: string
    evidenceIds: readonly EvidenceId[]
    disclaimer?: string
}

const DEFAULT_DISCLAIMER =
    "Educational content only. Not a diagnosis or a substitute for medical care."

export const CLAIMS = {
    cube_medical_truth: {
        headline: "Address Sleep Creasing & Arm Numbness Risk",
        body: "Sustained facial compression is associated with sleep creasing, and shoulder-drop can contribute to neck and arm irritation in susceptible side sleepers.",
        evidenceIds: ["asj_sleep_crease", "pubmed_cervical_posture"],
        disclaimer: DEFAULT_DISCLAIMER,
    },
    contour_medical_truth: {
        headline: "Support Airway Alignment & Snoring Reduction",
        body: "When pillows flex the neck forward, airway space may narrow. A neutral cervical setup is associated with easier nighttime breathing mechanics.",
        evidenceIds: ["pubmed_airway_positioning", "pubmed_cervical_posture"],
        disclaimer: DEFAULT_DISCLAIMER,
    },
    slim_medical_truth: {
        headline: "Limit Lumbar Over-Extension in Prone Sleep",
        body: "For stomach sleepers, thick loft can increase lumbar extension stress. A low-profile pillow is designed to reduce that extension load.",
        evidenceIds: ["pubmed_lumbar_extension"],
        disclaimer: DEFAULT_DISCLAIMER,
    },
    diagnosis_nerve_compression: {
        headline: "Possible Nerve Compression Pattern",
        body: "Hand tingling on waking can be associated with cervical/shoulder positioning. Structured side support is selected to reduce lateral collapse risk.",
        evidenceIds: ["pubmed_cervical_posture"],
        disclaimer: DEFAULT_DISCLAIMER,
    },
    diagnosis_airway_obstruction: {
        headline: "Possible Airway Compression Pattern",
        body: "Snoring or gasping can be linked with airway narrowing during sleep. Neutral neck support is prioritized to improve positional airflow mechanics.",
        evidenceIds: ["pubmed_airway_positioning"],
        disclaimer: DEFAULT_DISCLAIMER,
    },
    diagnosis_cervical_tension: {
        headline: "Possible Cervical Tension Pattern",
        body: "Morning headaches and jaw discomfort can correlate with cervical load during sleep. Contoured neck support is selected to reduce flexion stress.",
        evidenceIds: ["pubmed_cervical_posture"],
        disclaimer: DEFAULT_DISCLAIMER,
    },
    diagnosis_lumbar_extension: {
        headline: "Possible Lumbar Extension Pattern",
        body: "Lower-back stiffness in prone sleep is commonly associated with extension bias. A low-profile setup is selected to reduce extension load.",
        evidenceIds: ["pubmed_lumbar_extension"],
        disclaimer: DEFAULT_DISCLAIMER,
    },
    diagnosis_position_fallback: {
        headline: "Position-Based Baseline Prescription",
        body: "No dominant symptom rule was triggered, so recommendation is based on sleep position and shoulder geometry.",
        evidenceIds: ["pubmed_cervical_posture", "pubmed_lumbar_extension"],
        disclaimer: DEFAULT_DISCLAIMER,
    },
    scientific_right_side_reflux: {
        headline: "Right-Side Sleep Can Raise Reflux Exposure",
        body: "Positional reflux studies report higher nighttime acid exposure in right-side posture. Left-side positioning is often preferred in reflux management.",
        evidenceIds: ["jcg_reflux_position"],
        disclaimer: DEFAULT_DISCLAIMER,
    },
    scientific_left_side_support: {
        headline: "Left-Side + Neutral Neck Is a Lower-Risk Setup",
        body: "Combining left-side posture with neutral cervical support is used as a conservative strategy to improve reflux and airflow mechanics at night.",
        evidenceIds: ["jcg_reflux_position", "pubmed_airway_positioning"],
        disclaimer: DEFAULT_DISCLAIMER,
    },
} as const satisfies Record<string, ClaimDefinition>

export type ClaimId = keyof typeof CLAIMS

export function getClaim(id: ClaimId): ClaimDefinition {
    return CLAIMS[id]
}

export function validateClaimCoverage(): string[] {
    const errors: string[] = []

    for (const [claimId, claim] of Object.entries(CLAIMS)) {
        if ((claim.evidenceIds.length as number) === 0) {
            errors.push(`${claimId}: missing evidence`)
        }

        for (const evidenceId of claim.evidenceIds) {
            if (!EVIDENCE_REGISTRY[evidenceId]) {
                errors.push(`${claimId}: unknown evidence "${evidenceId}"`)
            }
        }
    }

    return errors
}
