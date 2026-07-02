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
export async function fetchExtraMeta(id: number | string): Promise<ExtraMeta | null> {
  try {
    const res = await fetch(`/api/campaign-meta?id=${id}`, { cache: "no-store" })
    return handleResponse(res)
  } catch (error) {
    return handleFetchError(error)
  }
}

export async function saveExtraMeta(id: number | string, meta: ExtraMeta): Promise<boolean> {
  try {
    const res = await fetch(`/api/campaign-meta`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, meta }),
    })
    return handleResponse(res)
  } catch (error) {
    return handleFetchError(error)
  }
}

function handleResponse(res: Response): ExtraMeta | null | boolean {
  if (!res.ok) return null
  if (res.headers.get('Content-Type')?.includes('application/json')) {
    return res.json().then(json => json?.meta ?? null)
  }
  return res.ok
}

function handleFetchError(error: any): null | false {
  console.error(error)
  return error instanceof Error ? null : false
}
