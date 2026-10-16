import type { FlowNode } from './types'

/*
 * Shared cast for the animated flow diagrams in the video tutorials.
 * Positions are normalised (0–100) so they scale to any stage size.
 */
export const ATTACKER: FlowNode = {
  id: 'attacker',
  label: 'Attacker',
  sub: 'evil.example',
  x: 14,
  y: 22,
  tone: 'attacker',
}
export const VICTIM: FlowNode = {
  id: 'victim',
  label: 'Victim',
  sub: 'signed in',
  x: 14,
  y: 80,
  tone: 'victim',
}
export const BROWSER: FlowNode = {
  id: 'browser',
  label: "Victim's browser",
  sub: 'sends the request',
  x: 34,
  y: 51,
  tone: 'browser',
}
export const CACHE: FlowNode = {
  id: 'cache',
  label: 'CDN cache',
  sub: 'shared edge',
  x: 62,
  y: 51,
  tone: 'neutral',
}
export const TARGET: FlowNode = {
  id: 'target',
  label: 'Origin server',
  sub: 'app.example',
  x: 86,
  y: 51,
  tone: 'target',
}
