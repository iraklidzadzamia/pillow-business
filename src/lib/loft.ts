import { SleepPosition } from "@/lib/data"

export type ShoulderWidth = "Petite" | "Average" | "Broad / Muscular"
export type MattressFirmness = "Firm" | "Medium" | "Soft"
export type LoftBucket = "Low" | "Medium" | "High"

export interface LoftCalculation {
    loftInches: number
    bucket: LoftBucket
    explanation: string
    shoulderWidthInches: number
    mattressSinkageInches: number
    positionAdjustmentInches: number
}

const SHOULDER_WIDTH_INCHES: Record<ShoulderWidth, number> = {
    Petite: 4.5,
    Average: 5.75,
    "Broad / Muscular": 6.5,
}

const MATTRESS_SINKAGE_INCHES: Record<MattressFirmness, number> = {
    Firm: 1.0,
    Medium: 1.5,
    Soft: 2.0,
}

function clamp(value: number, min: number, max: number): number {
    return Math.min(Math.max(value, min), max)
}

function roundToHalf(value: number): number {
    return Math.round(value * 2) / 2
}

function resolveBucket(loftInches: number): LoftBucket {
    if (loftInches <= 3.5) return "Low"
    if (loftInches <= 4.5) return "Medium"
    return "High"
}

export function calculateRequiredLoft(
    shoulderWidth: ShoulderWidth,
    mattressFirmness: MattressFirmness,
    position: SleepPosition
): LoftCalculation {
    const shoulderWidthInches = SHOULDER_WIDTH_INCHES[shoulderWidth]
    const mattressSinkageInches = MATTRESS_SINKAGE_INCHES[mattressFirmness]

    const baseLoft = shoulderWidthInches - mattressSinkageInches

    let positionAdjustmentInches = 0
    if (position === "Back") {
        positionAdjustmentInches = -0.25
    } else if (position === "Stomach") {
        positionAdjustmentInches = -1.5
    }

    let correctedLoft = baseLoft + positionAdjustmentInches
    if (position === "Stomach") {
        correctedLoft = Math.min(correctedLoft, 3.0)
    }

    const loftInches = roundToHalf(clamp(correctedLoft, 2.5, 6.5))
    const bucket = position === "Stomach" ? "Low" : resolveBucket(loftInches)

    const explanation =
        position === "Stomach"
            ? `A (${shoulderWidthInches}") - B (${mattressSinkageInches}") with stomach-position adjustment favors a low-loft setup around ${loftInches}".`
            : `A (${shoulderWidthInches}") - B (${mattressSinkageInches}") ${positionAdjustmentInches < 0 ? `+ position adjustment (${positionAdjustmentInches}")` : ""} = approx ${loftInches}" required loft.`

    return {
        loftInches,
        bucket,
        explanation,
        shoulderWidthInches,
        mattressSinkageInches,
        positionAdjustmentInches,
    }
}
