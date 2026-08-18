import { createComponent } from '@lit/react'
import { MdIconButton as MdIconButtonElement } from '@material/web/iconbutton/icon-button.js'
import React from 'react'

export const MdIconButton = createComponent({
  tagName: 'md-icon-button',
  elementClass: MdIconButtonElement,
  react: React,
})
