"use client"

import { useEffect, useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { Button } from "@/components/ui/Button"
import { POSITION_TO_PRODUCT, Product, SleepPosition, getProductById } from "@/lib/data"
import { calculateRequiredLoft, LoftBucket, MattressFirmness, ShoulderWidth } from "@/lib/loft"
import { trackEvent } from "@/lib/analytics"
import { X, Check, AlertTriangle, ArrowRight, ChevronDown } from "lucide-react"

interface QuizProps {
    isOpen: boolean
    onClose: () => void
}

type StomachMixAnswer = "" | "no" | "mixed_primary" | "stomach_dominant"

interface QuizAnswers {
    position: SleepPosition | ""
    symptoms: string[]
    stomachMix: StomachMixAnswer
    shoulderWidth: ShoulderWidth | ""
    mattressFirmness: MattressFirmness | ""
    sleepHot: "Yes" | "No" | ""
}

interface QuizResultState {
    primaryProduct: Product
    secondaryProduct: Product | null
    dominantPosition: SleepPosition
    secondaryPosition: SleepPosition | null
    sleepHot: "Yes" | "No" | ""
    hasClinicalSymptoms: boolean
    shoulderWidth: ShoulderWidth
    mattressFirmness: MattressFirmness
    loftInches: number
    loftBucket: LoftBucket
    loftExplanation: string
    shoulderWidthInches: number
    mattressSinkageInches: number
    positionAdjustmentInches: number
    fitNote: string
}

const NONE_SYMPTOM = "None, I just want better sleep"

const SYMPTOM_OPTIONS = [
    "Numbness/Tingling in hands",
    "Snoring / Gasping for air",
    "Jaw pain or Headaches",
    "Lower back stiffness",
    NONE_SYMPTOM,
]

const SHOULDER_WIDTH_OPTIONS: Array<{
    value: ShoulderWidth
    subtitle: string
}> = [
    {
        value: "Petite",
        subtitle: "Usually narrower shoulder-to-mattress gap.",
    },
    {
        value: "Average",
        subtitle: "Balanced shoulder geometry for most sleepers.",
    },
    {
        value: "Broad / Muscular",
        subtitle: "Larger shoulder gap often needs more loft.",
    },
]

const MATTRESS_FIRMNESS_OPTIONS: Array<{
    value: MattressFirmness
    subtitle: string
}> = [
    {
        value: "Firm",
        subtitle: "Less sinkage, so pillow usually needs more loft.",
    },
    {
        value: "Medium",
        subtitle: "Moderate sinkage and moderate loft demand.",
    },
    {
        value: "Soft",
        subtitle: "More sinkage, so effective loft requirement drops.",
    },
]

const STEP_NAMES: Record<number, string> = {
    0: "position",
    1: "symptoms",
    2: "position_mix",
    3: "shoulder_width",
    4: "mattress_firmness",
    5: "sleep_hot",
    6: "result",
}

function resolveDominantAndSecondaryPosition(answers: QuizAnswers): {
    dominantPosition: SleepPosition
    secondaryPosition: SleepPosition | null
} {
    const selectedPosition = answers.position || "Side"

    if (selectedPosition === "Stomach") {
        return {
            dominantPosition: "Stomach",
            secondaryPosition: null,
        }
    }

    if (answers.stomachMix === "stomach_dominant") {
        return {
            dominantPosition: "Stomach",
            secondaryPosition: selectedPosition,
        }
    }

    if (answers.stomachMix === "mixed_primary") {
        return {
            dominantPosition: selectedPosition,
            secondaryPosition: "Stomach",
        }
    }

    return {
        dominantPosition: selectedPosition,
        secondaryPosition: null,
    }
}

function formatInches(value: number): string {
    return Number.isInteger(value) ? String(value) : value.toFixed(1)
}

function getLoftRangeLabel(loftInches: number): string {
    const low = Math.max(2.5, loftInches - 0.5)
    const high = Math.min(6.5, loftInches + 0.5)
    return `${formatInches(low)}\"-${formatInches(high)}\"`
}

function getFitNote(position: SleepPosition, loftBucket: LoftBucket, loftInches: number): string {
    if (position === "Stomach") {
        return "Stomach sleep usually performs best with a low, flat setup. Keep rotation low and avoid thick stacking."
    }

    if (position === "Back") {
        return `Target around ${formatInches(loftInches)}\" (${loftBucket.toLowerCase()} range). Keep the chin neutral and avoid over-padding under the neck.`
    }

    if (loftBucket === "High") {
        return "High-loft profile: prioritize stable shoulder fill, then fine-tune in small adjustments so the neck line stays level."
    }

    if (loftBucket === "Medium") {
        return "Medium-loft profile: use a balanced setup and adjust only one variable at a time for adaptation."
    }

    return "Low-loft profile: keep support light but controlled so the head does not drop toward the mattress."
}

export function Quiz({ isOpen, onClose }: QuizProps) {
    const [step, setStep] = useState(0)
    const [answers, setAnswers] = useState<QuizAnswers>({
        position: "",
        symptoms: [],
        stomachMix: "",
        shoulderWidth: "",
        mattressFirmness: "",
        sleepHot: "",
    })
    const [resultState, setResultState] = useState<QuizResultState | null>(null)

    const includesMixStep = answers.position !== "" && answers.position !== "Stomach"
    const totalSteps = includesMixStep ? 7 : 6
    const uiStep = (() => {
        if (includesMixStep) {
            return Math.min(step + 1, totalSteps)
        }

        if (step >= 3) {
            return Math.min(step, totalSteps)
        }

        return Math.min(step + 1, totalSteps)
    })()
    const progress = (uiStep / totalSteps) * 100

    useEffect(() => {
        if (isOpen) {
            trackEvent("quiz_open", { timestamp: Date.now() })
        }
    }, [isOpen])

    useEffect(() => {
        if (!isOpen) return

        trackEvent("quiz_step_view", {
            step_index: step,
            step_name: STEP_NAMES[step] ?? "unknown",
        })
    }, [isOpen, step])

    const handlePositionAnswer = (position: SleepPosition) => {
        setAnswers((prev) => ({ ...prev, position }))
        trackEvent("quiz_step_submit", {
            step_index: step,
            field: "position",
            value: position,
        })
        setStep(1)
    }

    const handleSymptomToggle = (symptom: string) => {
        let nextSymptoms = [...answers.symptoms]

        if (symptom === NONE_SYMPTOM) {
            nextSymptoms = nextSymptoms.includes(symptom) ? [] : [symptom]
        } else {
            nextSymptoms = nextSymptoms.filter((item) => item !== NONE_SYMPTOM)
            if (nextSymptoms.includes(symptom)) {
                nextSymptoms = nextSymptoms.filter((item) => item !== symptom)
            } else {
                nextSymptoms.push(symptom)
            }
        }

        setAnswers((prev) => ({ ...prev, symptoms: nextSymptoms }))
    }

    const submitSymptoms = () => {
        trackEvent("quiz_step_submit", {
            step_index: step,
            field: "symptoms",
            selected_values: answers.symptoms.join("|"),
            selected_count: answers.symptoms.length,
        })

        if (answers.position !== "Stomach") {
            setStep(2)
            return
        }

        setAnswers((prev) => ({ ...prev, stomachMix: "no" }))
        setStep(3)
    }

    const handleStomachMixAnswer = (mix: StomachMixAnswer) => {
        setAnswers((prev) => ({ ...prev, stomachMix: mix }))
        trackEvent("quiz_step_submit", {
            step_index: step,
            field: "stomachMix",
            value: mix,
        })
        setStep(3)
    }

    const handleShoulderWidthAnswer = (shoulderWidth: ShoulderWidth) => {
        setAnswers((prev) => ({ ...prev, shoulderWidth }))
        trackEvent("quiz_step_submit", {
            step_index: step,
            field: "shoulder_width",
            value: shoulderWidth,
        })
        setStep(4)
    }

    const handleMattressFirmnessAnswer = (mattressFirmness: MattressFirmness) => {
        setAnswers((prev) => ({ ...prev, mattressFirmness }))
        trackEvent("quiz_step_submit", {
            step_index: step,
            field: "mattress_firmness",
            value: mattressFirmness,
        })
        setStep(5)
    }

    const runDiagnosis = (finalAnswers: QuizAnswers) => {
        const { dominantPosition, secondaryPosition } = resolveDominantAndSecondaryPosition(finalAnswers)
        const primaryProduct = getProductById(POSITION_TO_PRODUCT[dominantPosition])
        const secondaryProduct = secondaryPosition
            ? getProductById(POSITION_TO_PRODUCT[secondaryPosition])
            : null

        const shoulderWidth = finalAnswers.shoulderWidth || "Average"
        const mattressFirmness = finalAnswers.mattressFirmness || "Medium"
        const loft = calculateRequiredLoft(shoulderWidth, mattressFirmness, dominantPosition)

        const hasClinicalSymptoms = finalAnswers.symptoms.some((symptom) => symptom !== NONE_SYMPTOM)

        const nextResultState: QuizResultState = {
            primaryProduct,
            secondaryProduct,
            dominantPosition,
            secondaryPosition,
            sleepHot: finalAnswers.sleepHot,
            hasClinicalSymptoms,
            shoulderWidth,
            mattressFirmness,
            loftInches: loft.loftInches,
            loftBucket: loft.bucket,
            loftExplanation: loft.explanation,
            shoulderWidthInches: loft.shoulderWidthInches,
            mattressSinkageInches: loft.mattressSinkageInches,
            positionAdjustmentInches: loft.positionAdjustmentInches,
            fitNote: getFitNote(dominantPosition, loft.bucket, loft.loftInches),
        }

        trackEvent("quiz_complete", {
            dominant_position: dominantPosition,
            secondary_position: secondaryPosition ?? "none",
            primary_product_id: primaryProduct.id,
            secondary_product_id: secondaryProduct?.id ?? "none",
            symptoms_count: finalAnswers.symptoms.length,
            sleep_hot: finalAnswers.sleepHot || "unknown",
            shoulder_width: shoulderWidth,
            mattress_firmness: mattressFirmness,
            loft_bucket: loft.bucket,
            loft_inches: loft.loftInches,
        })

        setResultState(nextResultState)
        setStep(6)
    }

    const handleSleepHotAnswer = (sleepHot: "Yes" | "No") => {
        const finalAnswers: QuizAnswers = { ...answers, sleepHot }
        setAnswers(finalAnswers)
        trackEvent("quiz_step_submit", {
            step_index: step,
            field: "sleepHot",
            value: sleepHot,
        })
        runDiagnosis(finalAnswers)
    }

    const reset = () => {
        setStep(0)
        setAnswers({
            position: "",
            symptoms: [],
            stomachMix: "",
            shoulderWidth: "",
            mattressFirmness: "",
            sleepHot: "",
        })
        setResultState(null)
    }

    const handleClose = () => {
        trackEvent("quiz_close", {
            step_index: step,
            has_result: Boolean(resultState),
        })
        onClose()
        setTimeout(reset, 500)
    }

    const selectedBasePosition = answers.position || "Side"

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={handleClose}
                        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                    />

                    <motion.div
                        initial={{ scale: 0.9, opacity: 0, y: 20 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.9, opacity: 0, y: 20 }}
                        className="relative glass-card bg-secondary/95 border border-white/10 shadow-[0_0_40px_rgba(0,0,0,0.5)] rounded-2xl w-full max-w-2xl overflow-hidden max-h-[90vh] overflow-y-auto"
                    >
                        <button
                            onClick={handleClose}
                            className="absolute top-4 right-4 p-2 rounded-full hover:bg-white/10 transition-colors z-10"
                        >
                            <X className="w-6 h-6 text-muted-foreground hover:text-white transition-colors" />
                        </button>

                        <div className="p-8 md:p-12">
                            <div className="mb-8">
                                <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
                                    <motion.div
                                        className="h-full bg-accent"
                                        initial={{ width: "0%" }}
                                        animate={{ width: `${progress}%` }}
                                    />
                                </div>
                                <div className="mt-2 text-xs text-slate-400 font-medium tracking-wide uppercase flex justify-between">
                                    <span>Position + Loft Prescription</span>
                                    <span>Step {uiStep} of {totalSteps}</span>
                                </div>
                            </div>

                            <AnimatePresence mode="wait">
                                {step === 0 && (
                                    <motion.div
                                        key="step0"
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: -20 }}
                                    >
                                        <h3 className="text-2xl md:text-3xl font-bold font-serif text-white mb-3">Primary Sleep Position?</h3>
                                        <p className="text-muted-foreground mb-6 text-sm">
                                            Your primary position defines your pillow type.
                                        </p>
                                        <div className="grid gap-4">
                                            {(["Side", "Back", "Stomach"] as SleepPosition[]).map((position) => (
                                                <button
                                                    key={position}
                                                    onClick={() => handlePositionAnswer(position)}
                                                    className="p-4 text-left border border-white/10 rounded-xl hover:border-accent hover:bg-accent/10 transition-all font-medium text-lg flex justify-between items-center group text-white"
                                                >
                                                    {position} Sleeper
                                                    {position === "Stomach" && (
                                                        <span className="text-xs text-error border border-error/20 bg-error/10 px-2 py-1 rounded">
                                                            Low-Loft Needed
                                                        </span>
                                                    )}
                                                </button>
                                            ))}
                                        </div>
                                    </motion.div>
                                )}

                                {step === 1 && (
                                    <motion.div
                                        key="step1"
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: -20 }}
                                    >
                                        <h3 className="text-2xl md:text-3xl font-bold font-serif text-white mb-2">Morning Symptoms?</h3>
                                        <p className="text-muted-foreground mb-6 text-sm">
                                            Symptoms add context, while prescription type still follows your dominant position.
                                        </p>
                                        <div className="grid gap-3 mb-6">
                                            {SYMPTOM_OPTIONS.map((symptom) => (
                                                <button
                                                    key={symptom}
                                                    onClick={() => handleSymptomToggle(symptom)}
                                                    className={`p-4 text-left border rounded-xl transition-all font-medium text-lg flex items-center gap-3 ${answers.symptoms.includes(symptom)
                                                        ? "border-accent bg-accent/10 text-white shadow-sm"
                                                        : "hover:bg-white/5 border-white/10 text-white"
                                                        }`}
                                                >
                                                    <div
                                                        className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${answers.symptoms.includes(symptom)
                                                            ? "bg-accent border-accent"
                                                            : "border-white/20 bg-white/5"
                                                            }`}
                                                    >
                                                        {answers.symptoms.includes(symptom) && (
                                                            <Check className="w-3 h-3 text-white" />
                                                        )}
                                                    </div>
                                                    {symptom}
                                                </button>
                                            ))}
                                        </div>
                                        <Button onClick={submitSymptoms} className="w-full" disabled={answers.symptoms.length === 0}>
                                            Next Step
                                            <ArrowRight className="w-4 h-4 ml-2" />
                                        </Button>
                                    </motion.div>
                                )}

                                {step === 2 && includesMixStep && (
                                    <motion.div
                                        key="step2"
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: -20 }}
                                    >
                                        <h3 className="text-2xl md:text-3xl font-bold font-serif text-white mb-2">
                                            Do You Also Rotate to Stomach Sleep?
                                        </h3>
                                        <p className="text-muted-foreground mb-6 text-sm">
                                            If yes, we can show primary + secondary prescriptions so you understand the tradeoff.
                                        </p>
                                        <div className="grid gap-4">
                                            {[
                                                {
                                                    value: "no" as const,
                                                    title: `No, I am mostly ${selectedBasePosition}`,
                                                    subtitle: "Single-position prescription.",
                                                },
                                                {
                                                    value: "mixed_primary" as const,
                                                    title: `Yes, but ${selectedBasePosition} is dominant`,
                                                    subtitle: "Primary stays the same, secondary option is added.",
                                                },
                                                {
                                                    value: "stomach_dominant" as const,
                                                    title: "Yes, stomach is dominant",
                                                    subtitle: "Prescription switches to low-loft stomach logic.",
                                                },
                                            ].map((option) => (
                                                <button
                                                    key={option.value}
                                                    onClick={() => handleStomachMixAnswer(option.value)}
                                                    className="p-4 text-left border border-white/10 rounded-xl hover:border-accent hover:bg-accent/10 transition-all"
                                                >
                                                    <div className="font-semibold text-white">{option.title}</div>
                                                    <div className="text-sm text-muted-foreground mt-1">{option.subtitle}</div>
                                                </button>
                                            ))}
                                        </div>
                                    </motion.div>
                                )}

                                {step === 3 && (
                                    <motion.div
                                        key="step3"
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: -20 }}
                                    >
                                        <h3 className="text-2xl md:text-3xl font-bold font-serif text-white mb-2">Shoulder Width?</h3>
                                        <p className="text-muted-foreground mb-6 text-sm">
                                            This defines A in the gap equation (A - B = required loft).
                                        </p>
                                        <div className="grid gap-4">
                                            {SHOULDER_WIDTH_OPTIONS.map((option) => (
                                                <button
                                                    key={option.value}
                                                    onClick={() => handleShoulderWidthAnswer(option.value)}
                                                    className="p-4 text-left border border-white/10 rounded-xl hover:border-accent hover:bg-accent/10 transition-all"
                                                >
                                                    <div className="font-semibold text-white text-lg">{option.value}</div>
                                                    <div className="text-sm text-muted-foreground mt-1">{option.subtitle}</div>
                                                </button>
                                            ))}
                                        </div>
                                    </motion.div>
                                )}

                                {step === 4 && (
                                    <motion.div
                                        key="step4"
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: -20 }}
                                    >
                                        <h3 className="text-2xl md:text-3xl font-bold font-serif text-white mb-2">Mattress Firmness?</h3>
                                        <p className="text-muted-foreground mb-6 text-sm">
                                            This defines B (mattress sinkage) in your loft estimate.
                                        </p>
                                        <div className="grid gap-4">
                                            {MATTRESS_FIRMNESS_OPTIONS.map((option) => (
                                                <button
                                                    key={option.value}
                                                    onClick={() => handleMattressFirmnessAnswer(option.value)}
                                                    className="p-4 text-left border border-white/10 rounded-xl hover:border-accent hover:bg-accent/10 transition-all"
                                                >
                                                    <div className="font-semibold text-white text-lg">{option.value}</div>
                                                    <div className="text-sm text-muted-foreground mt-1">{option.subtitle}</div>
                                                </button>
                                            ))}
                                        </div>
                                    </motion.div>
                                )}

                                {step === 5 && (
                                    <motion.div
                                        key="step5"
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: -20 }}
                                    >
                                        <h3 className="text-2xl md:text-3xl font-bold font-serif text-white mb-2">Do You Typically Sleep Hot?</h3>
                                        <p className="text-muted-foreground mb-6 text-sm">
                                            If yes, we will add a cooling-material recommendation in your result.
                                        </p>
                                        <div className="grid gap-4">
                                            {(["Yes", "No"] as const).map((option) => (
                                                <button
                                                    key={option}
                                                    onClick={() => handleSleepHotAnswer(option)}
                                                    className="p-4 text-left border border-white/10 rounded-xl hover:border-accent hover:bg-accent/10 transition-all font-medium text-lg text-white"
                                                >
                                                    {option}
                                                </button>
                                            ))}
                                        </div>
                                    </motion.div>
                                )}

                                {step === 6 && resultState && (
                                    <motion.div
                                        key="result"
                                        initial={{ opacity: 0, scale: 0.95 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        className="text-center"
                                    >
                                        <div className="inline-flex items-center justify-center w-16 h-16 bg-accent/20 rounded-full mb-6 text-accent ring-4 ring-accent/10">
                                            <Check className="w-8 h-8" />
                                        </div>
                                        <h3 className="text-2xl md:text-3xl font-bold font-serif text-white mb-1">Your Amazon Pick Is Ready</h3>
                                        <p className="text-muted-foreground mb-8 text-sm">
                                            Based on {resultState.hasClinicalSymptoms ? "your symptoms, sleep pattern, and loft inputs" : "your sleep pattern and loft inputs"}.
                                        </p>

                                        <div className="glass-card bg-secondary/50 border border-white/10 rounded-2xl p-6 mb-6 text-left relative overflow-hidden">
                                            <div className="mb-4 relative z-10">
                                                <h4 className="text-2xl font-bold font-serif text-white tracking-tight">
                                                    {resultState.primaryProduct.name}
                                                </h4>
                                                <p className="text-sm text-accent font-bold uppercase tracking-wider">
                                                    {resultState.primaryProduct.tagline}
                                                </p>
                                            </div>

                                            <p className="text-slate-300 mb-4 text-sm leading-relaxed relative z-10">
                                                {resultState.primaryProduct.description}
                                            </p>

                                            <div className="bg-black/20 border border-white/10 rounded-lg p-3 mb-4 text-xs text-slate-300 space-y-2">
                                                <div>
                                                    Dominant position: <span className="font-semibold text-white">{resultState.dominantPosition}</span>
                                                    {resultState.secondaryPosition && (
                                                        <>
                                                            {" "}• Secondary position: <span className="font-semibold text-white">{resultState.secondaryPosition}</span>
                                                        </>
                                                    )}
                                                </div>

                                                <div>
                                                    Shoulder width: <span className="font-semibold text-white">{resultState.shoulderWidth}</span>
                                                    {" "}• Mattress feel: <span className="font-semibold text-white">{resultState.mattressFirmness}</span>
                                                </div>

                                                <div className="rounded-md border border-white/10 bg-black/30 p-3 space-y-1">
                                                    <div className="font-semibold text-slate-200">A - B Loft Formula</div>
                                                    <div>
                                                        A ({resultState.shoulderWidth} = {formatInches(resultState.shoulderWidthInches)}&quot;) - B ({resultState.mattressFirmness} = {formatInches(resultState.mattressSinkageInches)}&quot;)
                                                        {resultState.positionAdjustmentInches !== 0 && (
                                                            <> + position adjustment ({formatInches(resultState.positionAdjustmentInches)}&quot;)</>
                                                        )}
                                                        {" "}= <span className="font-bold text-accent">{formatInches(resultState.loftInches)}&quot; required loft</span>
                                                    </div>
                                                    <div>
                                                        Recommended bucket: <span className="font-semibold text-white">{resultState.loftBucket}</span>
                                                        {" "}({getLoftRangeLabel(resultState.loftInches)})
                                                    </div>
                                                </div>

                                                <div className="text-slate-300">{resultState.fitNote}</div>
                                            </div>

                                            <Button
                                                onClick={() => {
                                                    trackEvent("amazon_click", {
                                                        product_id: resultState.primaryProduct.id,
                                                        from: "quiz_result",
                                                        dominant_position: resultState.dominantPosition,
                                                        loft_bucket: resultState.loftBucket,
                                                        loft_inches: resultState.loftInches,
                                                    })
                                                    window.open(resultState.primaryProduct.amazonUrl, "_blank", "noopener,noreferrer")
                                                }}
                                                className="w-full mb-3 shadow-lg shadow-teal-500/20"
                                            >
                                                Buy on Amazon
                                            </Button>

                                            <div className="text-xs text-slate-400 mb-4 text-center">
                                                Transparent recommendation: opens Amazon in a new tab.
                                            </div>

                                            <details className="group mt-2">
                                                <summary className="bg-black/20 border border-white/10 rounded-lg p-3 cursor-pointer text-xs font-bold uppercase text-slate-400 hover:text-white transition-colors flex justify-between items-center select-none">
                                                    More Details
                                                    <ChevronDown className="w-4 h-4 transition-transform group-open:rotate-180" />
                                                </summary>

                                                <div className="pt-3 space-y-3">
                                                    <div className="bg-black/20 border border-white/10 rounded-lg p-4">
                                                        <div className="text-xs font-bold uppercase text-slate-500 mb-1">Why this loft</div>
                                                        <div className="text-xs text-slate-300">{resultState.loftExplanation}</div>
                                                    </div>

                                                    {(resultState.dominantPosition === "Stomach" || resultState.secondaryPosition === "Stomach") && (
                                                        <div className="bg-black/20 border border-white/10 rounded-lg p-4">
                                                            <div className="text-xs font-bold uppercase text-slate-500 mb-1">Stomach sleeper note</div>
                                                            <div className="text-xs text-slate-300">
                                                                Stomach sleepers usually perform best with a thin profile. Keep loft low to limit cervical rotation and extension load.
                                                            </div>
                                                        </div>
                                                    )}

                                                    {resultState.secondaryProduct && (
                                                        <div className="bg-black/20 border border-white/10 rounded-lg p-4">
                                                            <div className="text-xs font-bold uppercase text-slate-500 mb-1">Secondary Option</div>
                                                            <div className="text-sm font-semibold text-white">{resultState.secondaryProduct.name}</div>
                                                            <div className="text-xs text-slate-300">
                                                                Use this if your {resultState.secondaryPosition} sleeping becomes dominant.
                                                            </div>
                                                        </div>
                                                    )}

                                                    <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-4">
                                                        <div className="flex items-center gap-2 text-amber-400 font-bold text-xs uppercase mb-2">
                                                            <AlertTriangle className="w-3 h-3" />
                                                            Quick fit tips
                                                        </div>
                                                        <ul className="text-xs text-amber-200/80 space-y-1">
                                                            <li>- Start from the calculated loft and adjust in small increments only.</li>
                                                            <li>- Re-check your line after 2-3 nights before changing direction.</li>
                                                            <li>- If pain is severe or persistent, consider speaking with a clinician.</li>
                                                        </ul>
                                                    </div>

                                                    {resultState.sleepHot === "Yes" && (
                                                        <div className="bg-accent/10 border border-accent/20 rounded-xl p-4">
                                                            <div className="text-accent font-bold text-xs uppercase mb-2">
                                                                Cooling note
                                                            </div>
                                                            <p className="text-xs text-emerald-100/80">
                                                                If you sleep hot, prioritize breathable fill and a cooling cover on the final Amazon listing.
                                                            </p>
                                                        </div>
                                                    )}
                                                </div>
                                            </details>
                                        </div>

                                        <div className="text-xs text-muted-foreground font-medium">
                                            Prices, shipping, and returns are handled by Amazon and may vary.
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    )
}
