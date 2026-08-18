import { createComponent } from '@lit/react'
import { MdFab as MdFabElement } from '@material/web/fab/fab.js'
import React from 'react'

export const MdFab = createComponent({
  tagName: 'md-fab',
  elementClass: MdFabElement,
  react: React,
})
