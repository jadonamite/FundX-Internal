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
const apiRequest = async <T>(method: string, url: string, data?: any): Promise<T | null> => {
  try {
    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: data ? JSON.stringify(data) : undefined,
      cache: method === "GET" ? "no-store" : undefined,
    })
    if (!res.ok) return null
    return await res.json()
  } catch {
    return null
  }
}

export async function fetchExtraMeta(id: number | string): Promise<ExtraMeta | null> {
  const response = await apiRequest<{ meta: ExtraMeta }>("GET", `/api/campaign-meta?id=${id}`)
  return response?.meta ?? null
}

export async function saveExtraMeta(id: number | string, meta: ExtraMeta): Promise<boolean> {
  const response = await apiRequest<void>("POST", `/api/campaign-meta`, { id, meta })
  return response !== null
}