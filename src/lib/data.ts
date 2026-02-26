import { validateClaimCoverage } from "@/lib/claims"

export interface Product {
    id: "cube" | "contour" | "slim"

    /** Short human name that matches what people will recognize on Amazon */
    name: string
    /** One-line positioning for *your* site (not Amazon copy). */
    tagline: string
    /** Short description in your own words (avoid medical claims). */
    description: string

    /** Direct product page (later we can replace with affiliate links). */
    amazonUrl: string

    /** Optional helper for UI (not required). */
    image?: string
}

export type ProductId = Product["id"]
export type SleepPosition = "Side" | "Back" | "Stomach"

/**
 * Minimal mapping from quiz outcome → real products.
 * We deliberately keep this lean for an affiliate MVP.
 */
export const PRODUCTS: Product[] = [
    {
        // SIDE sleepers (value pick): Coop Original Adjustable Pillow
        id: "cube",
        name: "Coop Home Goods Original Adjustable Pillow",
        tagline: "Popular adjustable loft for side sleepers",
        description:
            "An adjustable-fill pillow that lets you fine-tune height for a more comfortable side-sleep setup.",
        amazonUrl: "https://www.amazon.com/dp/B00EINBSEW?th=1",
        image: "/images/cube.png",
    },
    {
        // BACK sleepers: DONAMA Cervical Contour Pillow
        id: "contour",
        name: "DONAMA Cervical Contour Pillow",
        tagline: "Contour support for back sleeping",
        description:
            "A contoured cervical-style pillow designed to support the neck curve and keep your head in a more neutral position.",
        amazonUrl: "https://www.amazon.com/dp/B09S5TZH5N?th=1",
        image: "/images/cradle.png",
    },
    {
        // STOMACH sleepers: Iwacool Thin / Low-profile pillow
        id: "slim",
        name: "Iwacool Thin Pillow (Low Profile)",
        tagline: "Thin, low-loft option for stomach sleeping",
        description:
            "A thinner, flatter pillow that helps reduce neck angle for stomach sleepers who need low loft.",
        amazonUrl: "https://www.amazon.com/dp/B0C2KPM8N5?th=1",
        image: "/images/slim.png",
    },
]

// Position is the primary prescription driver.
export const POSITION_TO_PRODUCT: Record<SleepPosition, ProductId> = {
    Side: "cube",
    Back: "contour",
    Stomach: "slim",
}

export interface SymptomInsightRule {
    id: string
    symptom: string
    relevantPositions: SleepPosition[]
}

// Symptom rules inform insights, but do not override the position-based product.
export const SYMPTOM_INSIGHT_RULES: SymptomInsightRule[] = [
    {
        id: "numbness_hands",
        symptom: "Numbness/Tingling in hands",
        relevantPositions: ["Side", "Back"],
    },
    {
        id: "snoring_airway",
        symptom: "Snoring / Gasping for air",
        relevantPositions: ["Back", "Side"],
    },
    {
        id: "jaw_headache",
        symptom: "Jaw pain or Headaches",
        relevantPositions: ["Back", "Side"],
    },
    {
        id: "lower_back_stiffness",
        symptom: "Lower back stiffness",
        relevantPositions: ["Stomach"],
    },
]

// Cooling variants: we keep this for later (optional upsells).
export interface CoolingVariantConfig {
    enabled: boolean
    variantName: string
    details: string
}

export const COOLING_VARIANT_CONFIG: Record<ProductId, CoolingVariantConfig> = {
    cube: {
        enabled: false,
        variantName: "Cooling cover (optional)",
        details: "Coming soon.",
    },
    contour: {
        enabled: false,
        variantName: "Cooling cover (optional)",
        details: "Coming soon.",
    },
    slim: {
        enabled: false,
        variantName: "Cooling cover (optional)",
        details: "Coming soon.",
    },
}

export function getProductById(id: ProductId): Product {
    const product = PRODUCTS.find((item) => item.id === id)
    if (!product) {
        throw new Error(`Unknown product id: ${id}`)
    }
    return product
}

const claimCoverageErrors = validateClaimCoverage()
if (process.env.NODE_ENV !== "production" && claimCoverageErrors.length > 0) {
    console.warn("[claims] Coverage issues:", claimCoverageErrors)
}
