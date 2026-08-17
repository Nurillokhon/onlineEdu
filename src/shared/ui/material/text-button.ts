import { createComponent } from '@lit/react'
import { MdTextButton as MdTextButtonElement } from '@material/web/button/text-button.js'
import React from 'react'

// onClick intentionally omitted: React's native click delegation already handles it here;
// adding it back to `events` would type it as (e: Event) => void, breaking Button.tsx's MouseEventHandler prop.
export const MdTextButton = createComponent({
  tagName: 'md-text-button',
  elementClass: MdTextButtonElement,
  react: React,
})
