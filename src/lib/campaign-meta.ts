export interface ExtraMeta {
  creatorName?: string
  creatorBio?: string
  email?: string
  twitter?: string
  github?: string
  portfolio?: string
  projectStage?: string
  videoUrl?: string
  budgetBreakdown?: string
  roadmap?: string
  location?: string
}

// ─── Client helpers (call the API route) ───────────────────────────
async function fetchApi(url: string, options?: RequestInit): Promise<any> {
  try {
    const res = await fetch(url, options)
    if (!res.ok) return null
    return await res.json()
  } catch {
    return null
  }
}

export async function fetchExtraMeta(id: number | string): Promise<ExtraMeta | null> {
  const response = await fetchApi(`/api/campaign-meta?id=${id}`, { cache: "no-store" })
  return response?.meta ?? null
}

export async function saveExtraMeta(id: number | string, meta: ExtraMeta): Promise<boolean> {
  const response = await fetchApi(`/api/campaign-meta`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id, meta }),
  })
  return response !== null
}