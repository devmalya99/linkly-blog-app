import { forwardRef } from 'react'
import { Link as NinnaLink } from '@ninna-ui/primitives'
import { useHref, useLinkClickHandler } from 'react-router-dom'

export const Link = forwardRef(function Link(
  { to, replace = false, state, target, onClick, underline = 'none', color = 'neutral', ...props },
  ref,
) {
  const href = useHref(to)
  const handleClick = useLinkClickHandler(to, { replace, state, target })

  return (
    <NinnaLink
      color={color}
      href={href}
      onClick={(event) => {
        onClick?.(event)
        if (!event.defaultPrevented) {
          handleClick(event)
        }
      }}
      ref={ref}
      target={target}
      underline={underline}
      {...props}
    />
  )
})
