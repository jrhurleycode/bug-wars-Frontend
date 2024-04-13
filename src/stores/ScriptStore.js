import { defineStore } from 'pinia'

export const useScriptStore = defineStore('scriptStore', {
  state: () => ({
    commands: [
      { label: ':ifEnemy', type: 'keyword' },
      { label: ':ifAlly', type: 'keyword' },
      { label: ':ifFood', type: 'keyword' },
      { label: ':ifEmpty', type: 'keyword' },
      { label: ':ifWall', type: 'keyword' },
      { label: ':goto', type: 'keyword' },
      { label: ':START', type: 'keyword' }
    ],
    actions: [
      { label: 'noop', type: 'keyword' },
      { label: 'mov', type: 'keyword' },
      { label: 'rotr', type: 'keyword' },
      { label: 'rotl', type: 'keyword' },
      { label: 'att', type: 'keyword' },
      { label: 'eat', type: 'keyword' }
    ]
  })
})
