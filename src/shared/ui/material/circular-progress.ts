import { createComponent } from '@lit/react'
import { MdCircularProgress as MdCircularProgressElement } from '@material/web/progress/circular-progress.js'
import React from 'react'

export const MdCircularProgress = createComponent({
  tagName: 'md-circular-progress',
  elementClass: MdCircularProgressElement,
  react: React,
})
