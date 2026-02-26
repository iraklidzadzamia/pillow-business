export type QuizOpenSource = "header" | "hero"

type AnalyticsPrimitive = string | number | boolean | null | undefined
type AnalyticsPayload = Record<string, AnalyticsPrimitive>

declare global {
    interface Window {
        dataLayer?: Array<Record<string, unknown>>
        gtag?: (...args: unknown[]) => void
    }
}

export function trackEvent(eventName: string, payload: AnalyticsPayload = {}) {
    if (typeof window === "undefined") return

    const eventPayload = {
        event: eventName,
        timestamp: new Date().toISOString(),
        ...payload,
    }

    if (Array.isArray(window.dataLayer)) {
        window.dataLayer.push(eventPayload)
    }

    if (typeof window.gtag === "function") {
        window.gtag("event", eventName, payload)
    }

    if (!Array.isArray(window.dataLayer) && typeof window.gtag !== "function" && process.env.NODE_ENV !== "production") {
        console.info("[analytics]", eventPayload)
    }
}
