import * as THREE from 'three'

export type FlowNode = {
  id: string
  label: string
  position: [number, number, number]
  kind: 'main' | 'satellite'
  parent?: string
}

export const flowNodes: FlowNode[] = [
  { id: 'elicit', label: 'Elicit', position: [-4.2, 0.3, 0], kind: 'main' },
  { id: 'analyze', label: 'Analyze', position: [-2.1, -0.4, 0.3], kind: 'main' },
  { id: 'model', label: 'Model', position: [0, 0.5, -0.2], kind: 'main' },
  { id: 'design', label: 'Design', position: [2.1, -0.3, 0.2], kind: 'main' },
  { id: 'deliver', label: 'Deliver', position: [4.2, 0.2, 0], kind: 'main' },

  { id: 'stakeholders', label: 'Stakeholders', position: [-4.8, 1.6, -0.6], kind: 'satellite', parent: 'elicit' },
  { id: 'requirements', label: 'Requirements', position: [-2.6, 1.5, 0.8], kind: 'satellite', parent: 'analyze' },
  { id: 'erd', label: 'ERD', position: [-0.3, 2.0, 0.6], kind: 'satellite', parent: 'model' },
  { id: 'brd', label: 'BRD · SRS · SDD', position: [0.6, -1.7, -0.5], kind: 'satellite', parent: 'model' },
  { id: 'mockups', label: 'Mockups', position: [2.7, 1.6, -0.7], kind: 'satellite', parent: 'design' },
  { id: 'database', label: 'Database', position: [4.9, -1.5, 0.5], kind: 'satellite', parent: 'deliver' },
]

export const spine = ['elicit', 'analyze', 'model', 'design', 'deliver']

export function getNode(id: string): FlowNode {
  const node = flowNodes.find((n) => n.id === id)
  if (!node) throw new Error(`Unknown node id: ${id}`)
  return node
}

export function nodeVector(id: string): THREE.Vector3 {
  return new THREE.Vector3(...getNode(id).position)
}
