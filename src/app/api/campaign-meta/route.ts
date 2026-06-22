import { NextRequest, NextResponse } from "next/server"
import type { ExtraMeta } from "@/lib/campaign-meta"

// Upstash Redis REST — set these on the Vercel project (Storage → Redis):
// UPSTASH_REDIS_REST_URL, UPSTASH_REDIS_REST_TOKEN
const URL = process.env.UPSTASH_REDIS_REST_URL
const TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN
const KEY = (id: string) => `fundx:meta:${id}`

const configured = () => Boolean(URL && TOKEN)

async function redis(command: (string | number)[]): Promise<any> {
  const res = await fetch(URL!, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${TOKEN}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify(command),
    cache: "no-store",
  })
  if (!res.ok) throw new Error(`upstash ${res.status}`)
  return res.json()
}

const ALLOWED: (keyof ExtraMeta)[] = [
  "creatorName",
  "creatorBio",
  "email",
  "twitter",
  "github",
  "portfolio",
  "projectStage",
  "videoUrl",
  "budgetBreakdown",
  "roadmap",
  "location",
]

function sanitize(input: unknown): ExtraMeta {
  const out: ExtraMeta = {}
  if (input && typeof input === "object") {
    for (const k of ALLOWED) {
      const v = (input as Record<string, unknown>)[k]
      if (typeof v === "string" && v.length > 0) out[k] = v.slice(0, 2000)
    }
  }
  return out
}

export async function GET(req: NextRequest) {
  const id = req.nextUrl.searchParams.get("id")
  if (!id) return NextResponse.json({ error: "missing id" }, { status: 400 })
  if (!configured()) return NextResponse.json({ meta: null })
  try {
    const { result } = await redis(["GET", KEY(id)])
    return NextResponse.json({ meta: result ? JSON.parse(result) : null })
  } catch {
    return NextResponse.json({ meta: null })
  }
}

export async function POST(req: NextRequest) {
  if (!configured()) return NextResponse.json({ ok: false, reason: "store not configured" }, { status: 503 })
  let body: any
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: "bad json" }, { status: 400 })
  }
  const id = body?.id
  if (id === undefined || id === null) return NextResponse.json({ error: "missing id" }, { status: 400 })
  const meta = sanitize(body?.meta)
  try {
    await redis(["SET", KEY(String(id)), JSON.stringify(meta)])
    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ ok: false }, { status: 502 })
  }
}