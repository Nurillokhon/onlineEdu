import { createComponent } from '@lit/react'
import { MdSwitch as MdSwitchElement } from '@material/web/switch/switch.js'
import React from 'react'

export const MdSwitch = createComponent({
  tagName: 'md-switch',
  elementClass: MdSwitchElement,
  react: React,
  events: { onChange: 'change' },
})
