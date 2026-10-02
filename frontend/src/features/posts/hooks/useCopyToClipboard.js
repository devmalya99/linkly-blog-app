import { useState } from 'react'

/**
 * Clipboard interaction for UI — keeps browser APIs out of pure utils.
 */
export function useCopyToClipboard(resetMs = 2000) {
  const [copyState, setCopyState] = useState('idle')

  async function copy(text) {
    if (!text) {
      setCopyState('error')
      throw new Error('Nothing to copy')
    }

    if (!navigator.clipboard?.writeText) {
      setCopyState('error')
      throw new Error('Clipboard is not available in this browser')
    }

    await navigator.clipboard.writeText(text)
    setCopyState('copied')
    window.setTimeout(() => setCopyState('idle'), resetMs)
  }

  return { copyState, copy }
}
