import { createComponent } from '@lit/react'
import { MdFilledButton as MdFilledButtonElement } from '@material/web/button/filled-button.js'
import React from 'react'

// onClick intentionally omitted: React's native click delegation already handles it here;
// adding it back to `events` would type it as (e: Event) => void, breaking Button.tsx's MouseEventHandler prop.
export const MdFilledButton = createComponent({
  tagName: 'md-filled-button',
  elementClass: MdFilledButtonElement,
  react: React,
})
