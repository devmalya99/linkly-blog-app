import { Button as NinnaButton } from '@ninna-ui/primitives'

const APPEARANCE = {
  primary:
    'h-11 rounded-lg bg-primary-container font-label-md text-label-md text-on-primary shadow-sm hover:bg-surface-tint active:scale-[0.99] before:hidden',
  social:
    'h-11 rounded-lg bg-surface-white font-label-md text-label-md text-text-primary shadow-sm hover:bg-background-warm active:scale-[0.99] before:hidden',
  soft:
    'h-11 rounded-lg bg-surface-container-low font-label-md text-label-md text-text-primary shadow-none hover:bg-surface-container before:hidden',
  icon:
    'h-auto min-h-0 w-auto rounded-md bg-transparent p-1 font-normal text-text-muted shadow-none hover:bg-transparent hover:text-text-primary before:hidden',
  surface:
    'h-auto rounded-lg bg-surface-white px-4 py-2 font-label-md text-label-md text-text-primary shadow-xs hover:bg-surface-container-low before:hidden',
  page:
    'h-10 w-10 rounded-lg bg-transparent p-0 font-label-md text-label-md text-text-muted shadow-none hover:bg-surface-white hover:text-text-primary before:hidden',
  pageActive:
    'h-10 w-10 rounded-lg bg-primary-container p-0 font-label-md text-label-md font-semibold text-on-primary shadow-xs hover:bg-primary-container before:hidden',
  filter:
    'h-auto rounded bg-transparent px-3.5 py-1.5 font-label-md text-label-md font-normal text-text-muted shadow-none hover:bg-transparent hover:text-text-primary before:hidden',
  filterActive:
    'h-auto rounded bg-surface-white px-3.5 py-1.5 font-label-md text-label-md font-medium text-text-primary shadow-xs hover:bg-surface-white before:hidden',
  profile:
    'h-8 w-8 rounded-full bg-transparent p-0 shadow-none hover:bg-transparent before:hidden focus-visible:ring-primary-container',
  secondary:
    'h-11 rounded-lg border border-border-subtle bg-surface-white px-5 font-label-md text-label-md text-text-primary shadow-sm hover:bg-background-warm active:scale-[0.99] before:hidden',
  text:
    'h-auto min-h-0 w-auto rounded-md bg-transparent px-1 py-1 font-label-md text-label-md font-medium text-text-primary shadow-none hover:bg-transparent hover:text-primary-container before:hidden',
  compact:
    'h-9 rounded-lg bg-primary-container px-4 font-label-md text-label-md text-on-primary shadow-sm hover:bg-surface-tint active:scale-[0.99] before:hidden',
  chip:
    'h-auto rounded-full border border-border-subtle bg-surface-white px-3.5 py-1.5 font-label-md text-label-md font-normal text-text-primary shadow-none hover:bg-surface-container-low before:hidden',
  segment:
    'h-auto min-h-0 rounded-md bg-transparent px-3 py-1.5 font-label-tag text-label-tag font-normal text-text-muted shadow-none hover:bg-transparent hover:text-text-primary before:hidden',
  segmentActive:
    'h-auto min-h-0 rounded-md bg-text-primary px-3 py-1.5 font-label-tag text-label-tag text-surface-white shadow-xs hover:bg-text-primary hover:text-surface-white before:hidden',
  ghost:
    'h-auto min-h-0 w-auto rounded-md bg-transparent px-2.5 py-1 font-label-md text-label-md text-text-primary shadow-none hover:bg-surface-container before:hidden',
  pagination:
    'h-auto min-h-0 rounded-md bg-transparent px-3 py-1.5 font-label-md text-label-md text-text-muted shadow-none hover:bg-surface-white hover:text-text-primary before:hidden disabled:cursor-not-allowed disabled:opacity-40',
}

export function Button({ appearance = 'primary', className = '', type = 'button', ...props }) {
  return (
    <NinnaButton
      className={`${APPEARANCE[appearance]} ${className}`.trim()}
      color="neutral"
      radius="lg"
      size="lg"
      type={type}
      variant="ghost"
      {...props}
    />
  )
}
