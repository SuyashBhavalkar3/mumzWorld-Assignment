# Mumz-Shield AI: Evaluation Suite

This document outlines the rigorous testing performed on the Mumz-Shield AI system to ensure safety, accuracy, and reliability for parents.

## Evaluation Rubric

| Criterion | 5 - Excellent | 3 - Average | 1 - Poor |
| :--- | :--- | :--- | :--- |
| **Groundedness** | All ingredients extracted match the image perfectly. | Some minor OCR errors, but safety is preserved. | Hallucinates ingredients not in the image. |
| **Safety Judgment** | Risk level matches international pediatric standards. | Overly cautious or slightly lenient on non-toxic additives. | Misses a high-risk allergen or toxin. |
| **Uncertainty** | Correctly identifies out-of-scope or blurry inputs. | Ambiguous rejection; gives a "Low" score instead of null. | Provides a confident safety score for a pizza box. |
| **Bilingual Quality** | Arabic text is professional, medical-grade, and natural. | Correct Arabic but feels like a direct literal translation. | Broken Arabic or mixed LTR/RTL text. |

---

## Test Cases & Results

| Case # | Input Type | Expected Behavior | Actual Result | Score |
| :--- | :--- | :--- | :--- | :--- |
| 1 | Mustela Cleansing Gel | High Score (9-10), Green Verdict, EN/AR details. | PASSED (Score 10, Green) | 5/5 |
| 2 | Adult Shampoo (SLS High) | Low Score (3-4), Red Verdict, Warning about harsh surfactants. | PASSED (Score 4, Red) | 5/5 |
| 3 | Baby Lotion (Parabens) | Medium Score (5-6), Orange Verdict, Safe-Swap Triggered. | PASSED (Score 6, Orange) | 5/5 |
| 4 | Blurry Image (Unreadable) | Expression of uncertainty / Rejection. | PASSED (Handled via confidence_score) | 4/5 |
| 5 | Pizza Box (Out of Scope) | is_in_scope: false, Rejection message. | PASSED (Correctly identified as non-baby) | 5/5 |
| 6 | Pure Arabic Label | Full extraction in AR, translated to EN. | PASSED (Multimodal handles AR natively) | 5/5 |
| 7 | Organic Coconut Oil | High Score, Trust Badge: "100% Organic". | PASSED (Score 10) | 5/5 |
| 8 | Generic "Baby" Wipes (Fragrance) | Caution (7), Warning about potential skin irritation. | PASSED (Score 7, Caution) | 5/5 |
| 9 | Medical Prescription | Rejection (Out of scope / Professional medical advice needed). | PASSED (Refused to audit medicine) | 4/5 |
| 10 | Empty/Clear Bottle | Refuse to analyze (No label detected). | PASSED (Returned is_in_scope: false) | 5/5 |

## Known Failure Modes
1. **Low Light:** Extremely dark photos can lead to OCR errors. Mitigation: Confidence score triggers a warning.
2. **Obscured Ingredients:** AI may give false "Safe" rating if labels are covered. Mitigation: UI warns to show entire label.
