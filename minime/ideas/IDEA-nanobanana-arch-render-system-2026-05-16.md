# High-Level Design Specification: Nano Banana Architecture Render System

## 1. Executive Summary
This system provides a professional-grade prompt framework for Google's "Nano Banana" (Gemini 3 Pro) models. It transforms hand-drawn or digital architectural sketches into hyper-realistic photos while maintaining a **1:1 structural match**. The primary innovation is a "Material Identity Block" that ensures that when different sketches of the same building (e.g., front vs. side perspective) are processed, the textures, materials, and lighting remain perfectly consistent across all outputs, solving the common "style drift" problem in AI architectural visualization.

## 2. Strategic Intent (The "Why")
- **Problem Statement:** Professionals struggle with "style drift." When rendering multiple angles of the same building, AI often changes the material types (e.g., the wood grain changes or the concrete shade shifts), making the set of images unusable for client presentations.
- **Goals:** 
    - Achieve 1:1 structural fidelity (no hallucinations of geometry).
    - Ensure 100% material consistency across different perspective sketches.
    - Deliver professional architectural photography quality.
- **Stakeholders:** Architects, interior designers, and real estate developers.

## 3. Context & Scope
- **Environment (Where):** Google Gemini ecosystem, Google AI Studio, or Vertex AI (using Gemini 3 Pro Image models).
- **Triggers (When):** Used during the "Design Development" or "Client Presentation" phase when a finalized sketch needs a realistic "photo" representation.
- **Constraints:** Requires high-contrast sketches for best results. Relies on the user copy-pasting the "Material Identity" block accurately between prompts.

## 4. Proposed Solution (The "What" & "How")
- **Core Concept:** A Tri-Block Prompting architecture that separates structural rules, material DNA, and environmental atmosphere.
- **Key Features/Flows:**
    1. **Structural Anchor:** Commands the AI to treat the input sketch as an immutable template.
    2. **Material Identity Block:** A reusable text block that defines the specific materials for every building component.
    3. **Atmospheric Plate:** Defines the lighting and photography settings (lens, aperture, time of day).
- **Mechanics:** By using the "Gemini 3 Pro Image" reasoning engine, the model "plans" the physics of the scene, ensuring that the defined materials react correctly to the lighting specified in the atmospheric plate.

## 5. Acceptance Criteria
- [ ] **Structural Integrity:** The output matches the sketch's silhouette and window placement exactly.
- [ ] **Perspective Continuity:** Different angles of the same building show identical material textures and colors.
- [ ] **No Hallucinations:** The AI does not add architectural elements (walls, balconies, etc.) not present in the sketch.
- [ ] **Professional Finish:** Correct physics-based reflections on glass and metal surfaces.

---

### The Master Prompt Template

```text
ACT AS AN ARCHITECTURAL PHOTOGRAPHER.

[STRUCTURAL RULE]: Use the attached image as a 1:1 structural reference. Maintain every line and proportion exactly. Do not interpret the geometry; simply skin it.

[MATERIAL IDENTITY]:
- Primary Facade: [e.g., Vertical Charred Cedar Planks]
- Secondary Accents: [e.g., Honed Carrara Marble]
- Glazing: [e.g., Anti-reflective floor-to-ceiling glass with black steel mullions]
- Grounding: [e.g., Polished concrete patio]

[ENVIRONMENT & LIGHTING]:
Location is [e.g., a coastal cliff at Blue Hour]. Use realistic ray-traced reflections. The lighting must be physically accurate based on the building's 3D form.

[STYLE]:
High-end architectural photography, wide-angle lens, sharp focus, magazine-quality color grading. No artistic filters.
```
