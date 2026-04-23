import express from 'express'
import cors from 'cors'
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs'
import { randomUUID } from 'crypto'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

dotenv.config()

const __dir = dirname(fileURLToPath(import.meta.url))
const DATA = join(__dir, 'data')
if (!existsSync(DATA)) mkdirSync(DATA, { recursive: true })

const app = express()
const PORT = process.env.PORT || 3001
const JWT_SECRET = process.env.JWT_SECRET || 'amai-dev-secret-change-in-prod'
const AMAI_USERNAME = process.env.AMAI_USERNAME || 'amai'
const AMAI_PASSWORD = process.env.AMAI_PASSWORD || 'companion'
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173'

app.use(cors({ origin: FRONTEND_URL, credentials: true }))
app.use(express.json())

// ── JSON file DB ──────────────────────────────────────────────────────────────

function read(file) {
  const p = join(DATA, `${file}.json`)
  if (!existsSync(p)) return file === 'journal' ? {} : []
  try { return JSON.parse(readFileSync(p, 'utf-8')) } catch { return file === 'journal' ? {} : [] }
}

function write(file, data) {
  writeFileSync(join(DATA, `${file}.json`), JSON.stringify(data, null, 2), 'utf-8')
}

// ── Auth ──────────────────────────────────────────────────────────────────────

app.post('/api/auth/login', (req, res) => {
  const { username, password } = req.body ?? {}
  if (username === AMAI_USERNAME && password === AMAI_PASSWORD) {
    const token = jwt.sign({ user: username }, JWT_SECRET, { expiresIn: '7d' })
    return res.json({ token, user: username })
  }
  res.status(401).json({ error: 'Invalid credentials' })
})

const requireAuth = (req, res, next) => {
  const h = req.headers.authorization
  if (!h?.startsWith('Bearer ')) return res.status(401).json({ error: 'Unauthorized' })
  try { req.user = jwt.verify(h.slice(7), JWT_SECRET); next() }
  catch { res.status(401).json({ error: 'Token invalid or expired' }) }
}

app.get('/api/me', requireAuth, (req, res) => res.json({ user: req.user.user }))

// ── Notes ─────────────────────────────────────────────────────────────────────

app.get('/api/notes', requireAuth, (req, res) => res.json(read('notes')))

app.post('/api/notes', requireAuth, (req, res) => {
  const notes = read('notes')
  const note = {
    id: randomUUID(),
    title: req.body.title || 'Untitled',
    content: req.body.content || '',
    pinned: req.body.pinned ?? false,
    color: req.body.color ?? null,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
  notes.unshift(note)
  write('notes', notes)
  res.json(note)
})

app.put('/api/notes/:id', requireAuth, (req, res) => {
  const notes = read('notes')
  const idx = notes.findIndex(n => n.id === req.params.id)
  if (idx === -1) return res.status(404).json({ error: 'Not found' })
  notes[idx] = { ...notes[idx], ...req.body, id: notes[idx].id, createdAt: notes[idx].createdAt, updatedAt: new Date().toISOString() }
  write('notes', notes)
  res.json(notes[idx])
})

app.delete('/api/notes/:id', requireAuth, (req, res) => {
  write('notes', read('notes').filter(n => n.id !== req.params.id))
  res.json({ ok: true })
})

// ── Tasks ─────────────────────────────────────────────────────────────────────

app.get('/api/tasks', requireAuth, (req, res) => res.json(read('tasks')))

app.post('/api/tasks', requireAuth, (req, res) => {
  const tasks = read('tasks')
  const task = { id: randomUUID(), text: req.body.text || '', done: false, createdAt: new Date().toISOString() }
  tasks.push(task)
  write('tasks', tasks)
  res.json(task)
})

app.put('/api/tasks/:id', requireAuth, (req, res) => {
  const tasks = read('tasks')
  const idx = tasks.findIndex(t => t.id === req.params.id)
  if (idx === -1) return res.status(404).json({ error: 'Not found' })
  tasks[idx] = { ...tasks[idx], ...req.body, id: tasks[idx].id }
  write('tasks', tasks)
  res.json(tasks[idx])
})

app.delete('/api/tasks/:id', requireAuth, (req, res) => {
  write('tasks', read('tasks').filter(t => t.id !== req.params.id))
  res.json({ ok: true })
})

// ── Journal ───────────────────────────────────────────────────────────────────

app.get('/api/journal', requireAuth, (req, res) => {
  const j = read('journal')
  const entries = Object.entries(j)
    .sort(([a], [b]) => b.localeCompare(a))
    .slice(0, 60)
    .map(([date, entry]) => ({ date, ...entry }))
  res.json(entries)
})

app.get('/api/journal/:date', requireAuth, (req, res) => {
  const j = read('journal')
  res.json(j[req.params.date] ?? { content: '', date: req.params.date })
})

app.put('/api/journal/:date', requireAuth, (req, res) => {
  const j = read('journal')
  j[req.params.date] = { content: req.body.content ?? '', updatedAt: new Date().toISOString() }
  write('journal', j)
  res.json({ date: req.params.date, ...j[req.params.date] })
})

app.listen(PORT, () => console.log(`✨ AMAI workspace running on http://localhost:${PORT}`))
