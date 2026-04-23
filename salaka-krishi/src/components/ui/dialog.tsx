import { Dialog as ChakraDialog, Portal } from "@chakra-ui/react"
import * as React from "react"

export const DialogRoot = ChakraDialog.Root
export const DialogTrigger = ChakraDialog.Trigger
export const DialogHeader = ChakraDialog.Header
export const DialogTitle = ChakraDialog.Title
export const DialogBody = ChakraDialog.Body
export const DialogFooter = ChakraDialog.Footer
export const DialogBackdrop = ChakraDialog.Backdrop

export const DialogContent = React.forwardRef<
  HTMLDivElement,
  ChakraDialog.ContentProps
>(function DialogContent(props, ref) {
  const { children, ...rest } = props
  return (
    <Portal>
      <DialogBackdrop />
      <ChakraDialog.Positioner>
        <ChakraDialog.Content ref={ref} {...rest}>
          {children}
        </ChakraDialog.Content>
      </ChakraDialog.Positioner>
    </Portal>
  )
})

export const DialogCloseTrigger = React.forwardRef<
  HTMLButtonElement,
  ChakraDialog.CloseTriggerProps
>(function DialogCloseTrigger(props, ref) {
  return (
    <ChakraDialog.CloseTrigger
      position="absolute"
      top="2"
      insetEnd="2"
      ref={ref}
      {...props}
    >
      {props.children || <CloseIcon />}
    </ChakraDialog.CloseTrigger>
  )
})

const CloseIcon = () => (
  <svg
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth="2"
    fill="none"
    strokeLinecap="round"
    strokeLinejoin="round"
    style={{ width: "1em", height: "1em" }}
  >
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
)
