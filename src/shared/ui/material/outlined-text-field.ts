import { createComponent } from '@lit/react'
import { MdOutlinedTextField as MdOutlinedTextFieldElement } from '@material/web/textfield/outlined-text-field.js'
import React from 'react'

export const MdOutlinedTextField = createComponent({
  tagName: 'md-outlined-text-field',
  elementClass: MdOutlinedTextFieldElement,
  react: React,
  events: { onInput: 'input', onChange: 'change' },
})
