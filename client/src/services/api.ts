const API_BASE = import.meta.env.VITE_API_URL
  ? (import.meta.env.VITE_API_URL.endsWith('/api') ? import.meta.env.VITE_API_URL : `${import.meta.env.VITE_API_URL}/api`)
  : '/api'

export interface User {
  id: string
  name: string
  email: string
}

export interface BackendGeneration {
  id: string
  company: string
  company_context?: string
  research: string
  analysis: string
  lead_score: {
    score: number
    priority: string
    confidence: string
    reasons: string[]
  }
  email: {
    subject: string
    body: string
  }
  created_at: string
}

export async function loginApi(email: string, password: string): Promise<{ user: User; token: string }> {
  const response = await fetch(`${API_BASE}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  })

  if (!response.ok) {
    const errData = await response.json().catch(() => ({}))
    throw new Error(errData.detail || 'Invalid email or password')
  }

  const data = await response.json()
  const token = data.access_token
  localStorage.setItem('sdr_auth_token', token)

  const user = await fetchMeApi(token)
  return { user, token }
}

export async function registerApi(name: string, email: string, password: string): Promise<{ user: User; token: string }> {
  const response = await fetch(`${API_BASE}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, email, password }),
  })

  if (!response.ok) {
    const errData = await response.json().catch(() => ({}))
    throw new Error(errData.detail || 'Failed to create account')
  }

  return await loginApi(email, password)
}

export async function fetchMeApi(tokenOverride?: string): Promise<User> {
  const token = tokenOverride || localStorage.getItem('sdr_auth_token')
  if (!token) throw new Error('No auth token found')

  const response = await fetch(`${API_BASE}/auth/me`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })

  if (!response.ok) {
    localStorage.removeItem('sdr_auth_token')
    throw new Error('Session expired')
  }

  return await response.json()
}

export function logoutApi() {
  localStorage.removeItem('sdr_auth_token')
}

export async function ensureAuthToken(): Promise<string> {
  const existingToken = localStorage.getItem('sdr_auth_token')
  if (existingToken) return existingToken
  throw new Error('User not authenticated')
}

export async function generatePipelineApi(company: string, companyContext: string): Promise<BackendGeneration> {
  const token = await ensureAuthToken()

  const response = await fetch(`${API_BASE}/generate/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      company,
      company_context: companyContext,
    }),
  })

  if (!response.ok) {
    const errData = await response.json().catch(() => ({}))
    throw new Error(errData.detail || `API Error: ${response.statusText}`)
  }

  return await response.json()
}

export async function fetchGenerationsApi(): Promise<BackendGeneration[]> {
  const token = await ensureAuthToken()

  const response = await fetch(`${API_BASE}/generate/`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })

  if (!response.ok) {
    throw new Error(`API Error: ${response.statusText}`)
  }

  return await response.json()
}

export async function fetchGenerationByIdApi(id: string): Promise<BackendGeneration> {
  const token = await ensureAuthToken()

  const response = await fetch(`${API_BASE}/generate/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })

  if (!response.ok) {
    throw new Error(`API Error: ${response.statusText}`)
  }

  return await response.json()
}
