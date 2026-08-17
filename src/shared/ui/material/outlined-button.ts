import { createComponent } from '@lit/react'
import { MdOutlinedButton as MdOutlinedButtonElement } from '@material/web/button/outlined-button.js'
import React from 'react'

// onClick intentionally omitted: React's native click delegation already handles it here;
// adding it back to `events` would type it as (e: Event) => void, breaking Button.tsx's MouseEventHandler prop.
export const MdOutlinedButton = createComponent({
  tagName: 'md-outlined-button',
  elementClass: MdOutlinedButtonElement,
  react: React,
})
