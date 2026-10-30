# Gemini AI Assistant Integration

The FamilyLink Guardian AI assistant is powered by Google Gemini 1.5 Flash via the official `@google/generative-ai` SDK.

## Privacy Guardrails
1. **Never Call Gemini From Android or Browser:** All Gemini requests must pass through `/api/ai/` on the Railway backend.
2. **Context Minimization & Redaction:** Device telemetry is anonymized and stripped of sensitive phone numbers or unshared metadata before prompting the model.
3. **Account Isolation:** Queries strictly filter by the requesting Guardian's authenticated `familyGroupId`.

## Example AI Prompts Supported
- *"Summarize device health and battery states across my family today."*
- *"Are any member devices showing unusual sync delays or offline status?"*
- *"Summarize location activity for Aryan between 9 AM and 5 PM."*
