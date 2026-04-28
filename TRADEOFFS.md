# Mumz-Shield AI: Architectural Tradeoffs & Decisions

This document explains the "Why" behind the technical choices made during the development of Mumz-Shield AI.

## 1. Problem Selection: Why a Pediatric Safety Auditor?
Mumzworld serves millions of parents who deal with high anxiety regarding product safety. While a "Gift Finder" is a UX improvement, an **AI Safety Sentinel** is a **Trust Engine**. We chose this problem because it requires high precision, multimodal reasoning, and sophisticated uncertainty handling—the core pillars of senior AI engineering.

## 2. Architecture: FastAPI + Next.js
-   **FastAPI:** Chosen for its native asynchronous support and Pydantic integration. This allows us to handle high-concurrency image processing and validate AI outputs against a strict schema.
-   **Next.js:** Provides a robust framework for building a high-performance "Medical Dashboard" UI with optimized client-side state management.

## 3. Model Choice: GPT-4o-mini
-   **Decision:** We prioritized **GPT-4o-mini** for the production Vision engine.
-   **Tradeoff:** While GPT-4o is slightly more capable in logic, **GPT-4o-mini** is significantly faster and more cost-effective for multimodal OCR and ingredient extraction. For a consumer-facing app, "speed-to-result" is more important than marginal logic gains that don't affect safety ratings.

## 4. Handling Uncertainty & Out-of-Scope Inputs
-   **Schema-Level Rejection:** We added an `is_in_scope` boolean to our Pydantic schema. If the AI detects a product that isn't for babies (e.g., a power drill or a pizza), it returns `false`, and the backend rejects the audit.
-   **Confidence-Based Warnings:** The system returns a `confidence_score`. If the image is blurry, the score drops, and the UI proactively warns the user that the audit may be incomplete.
-   **"I don't know" principle:** We explicitly instructed the AI to avoid hallucinating ingredients. If a label is unreadable, it must flag it rather than guessing.

## 5. Performance Engineering
-   **SQLAlchemy Persistence:** We moved from an in-memory cache to a persistent SQLite database. This ensures that redundant scans are served in <10ms, saving both user time and API costs.
-   **SSE Token Streaming:** We implemented Server-Sent Events for the pediatric chat to mask latency. By streaming the response, we lower the "Time to First Token," making the app feel significantly more responsive.

## 6. What's Next? (Future Scope)
-   **Vector Search RAG:** Integrating a real-time vector database (like Pinecone) to ground the pediatric expert's answers in official WHO or FDA safety documents.
-   **PWA Offline Mode:** Allowing parents to scan products even in supermarkets with poor signal.
-   **Direct API Integration:** Connecting directly to the Mumzworld catalog API for real-time price and stock updates on "Safe-Swap" recommendations.
