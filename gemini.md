# PROJECT CONTEXT: SpineAlign (Medical-Grade Sleep E-Commerce)

## 1. CORE PHILOSOPHY & BRAND VOICE
**SpineAlign** is not a pillow company; it is a **Spinal Alignment Company**.
We sell "medical devices" disguised as pillows.
* **Tagline:** "Don't buy a pillow. Buy Alignment."
* **The Enemy:** "Comfort" (Soft pillows kill your spine).
* **The Hero:** "Alignment" (Geometric precision).
* **Visual Style:** "Apple meets MRI Scan". Clinical, Dark Mode, High-Contrast Neon Teal.

## 2. TECH STACK & DESIGN SYSTEM
* **Framework:** Next.js 14+ (App Router, TypeScript).
* **Styling:** Tailwind CSS v4.
* **Animation:** Framer Motion (Crucial for "Physics" feel).
* **Colors:**
    * **Background:** `#0F172A` (Deep Navy - Trust).
    * **Success/Aligned:** `#2DD4BF` (Clinical Teal - The Cure).
    * **Danger/Misaligned:** `#EF4444` (Red - The Damage).
    * **Warning:** `#F59E0B` (Amber - Medical Alert).

## 3. HARDCODED PRODUCT DATA (DO NOT CHANGE)
*Use EXACTLY these medical claims in the Product Cards.*

### SKU 1: "The Cube Align" (Side Sleeper)
* **Target:** Side Sleepers (70%).
* **Visual Logic:** 90-degree angle fills the shoulder gap.
* **The "Medical Truth" (Copy):**
    > **⚠️ Stop "Sleep Wrinkles" & Nerve Pinching**
    > Standard pillows compress facial tissue, causing permanent wrinkles that Botox cannot fix (Source: *Aesthetic Surgery Journal*). They also pinch C5-C7 nerves, causing morning arm numbness.
* **Badge:** ✅ **Anti-Aging & Nerve Decompression**

### SKU 2: "The Cervical Cradle" (Back Sleeper)
* **Target:** Back Sleepers (20%).
* **Visual Logic:** Central divot cradles the skull, neck roll supports C-curve.
* **The "Medical Truth" (Copy):**
    > **⚠️ Maximize Oxygen & Stop Snoring**
    > Thick pillows push your chin to your chest, narrowing the airway and reducing oxygen to the brain. This pillow induces the "sniffing position" to keep airways 100% open.
* **Badge:** ✅ **Airway Optimization Tech**

### SKU 3: "The Zero-G Slim" (Stomach Sleeper)
* **Target:** Stomach Sleepers (5%).
* **Visual Logic:** Ultra-thin profile.
* **The "Medical Truth" (Copy):**
    > **⚠️ Prevent the "Banana Back"**
    > Sleeping on your stomach on a normal pillow forces your lumbar spine into hyper-extension (arching like a banana). This pad is ultra-thin to keep your spine neutral.
* **Badge:** ✅ **Lumbar Hyper-Extension Guard**

## 4. COMPONENT LOGIC

### A. The Diagnostic Quiz (The "Doctor")
* **Goal:** The user must feel like they are getting a Prescription, not a product recommendation.
* **Diagnostic Logic:**
    * If `Morning Symptom` == "Numb hands" -> Force recommend **Cube Align** (Explain: "Your numbness is C5 nerve compression").
    * If `Morning Symptom` == "Snoring" -> Force recommend **Cervical Cradle**.
* **Results Page:** MUST display the "Why This Prescription?" block immediately under the buy button.

### B. The "Gap Problem" Slider
* **Visuals:** Use SVG dashed lines representing the spine.
* **Interaction:** Dragging slider changes Spine form Red (Curved) to Teal (Straight). No stock photos of people, only "X-Ray" style schematics.

## 5. CODING RULES FOR AGENT
1.  **No Fluff:** Never write "sleep like a cloud." Write "engineered for support."
2.  **Medical Authority:** Always cite the source (e.g., "Based on NIH studies") in small print.
3.  **Visual Polish:** Use `glassmorphism` for all cards (background blur, thin white border).
