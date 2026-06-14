export interface CoachModel {
  id: string
  label: string
}

export const COACH_MODELS: CoachModel[] = [
  { id: 'anthropic/claude-sonnet-4-5', label: 'Claude Sonnet 4.5' },
  { id: 'anthropic/claude-haiku-4-5', label: 'Claude Haiku 4.5 (Fast)' },
  { id: 'openai/gpt-4o', label: 'GPT-4o' },
  { id: 'openai/gpt-4o-mini', label: 'GPT-4o Mini (Fast)' },
  { id: 'google/gemini-2.0-flash-001', label: 'Gemini 2.0 Flash' },
  { id: 'meta-llama/llama-4-maverick', label: 'Llama 4 Maverick' },
]

export const DEFAULT_COACH_MODEL = COACH_MODELS[0].id

const ALLOWED_IDS = new Set(COACH_MODELS.map((m) => m.id))

export function validateModel(modelId: string | null | undefined): string {
  if (modelId && ALLOWED_IDS.has(modelId)) return modelId
  // Allow env override as an additional default
  const envModel = process.env.COACH_DEFAULT_MODEL
  if (envModel && ALLOWED_IDS.has(envModel)) return envModel
  return DEFAULT_COACH_MODEL
}
