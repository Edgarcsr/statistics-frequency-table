import * as React from 'react'
import katex from 'katex'
import 'katex/dist/katex.min.css'

import { cn } from '#/utils/index.ts'

interface MathProps {
  children: string
  className?: string
}

export function Math({ children, className }: MathProps) {
  const html = React.useMemo(
    () =>
      katex.renderToString(children, {
        throwOnError: false,
        displayMode: true,
      }),
    [children]
  )

  return (
    <span
      className={cn('katex-inline', className)}
      // eslint-disable-next-line react/no-danger
      dangerouslySetInnerHTML={{ __html: html }}
    />
  )
}