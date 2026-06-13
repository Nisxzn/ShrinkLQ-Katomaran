import * as React from "react"
import { cn } from "../../lib/utils"

const Tooltip = React.forwardRef(({ className, children, content, ...props }, ref) => {
  const [isVisible, setIsVisible] = React.useState(false)

  return (
    <div
      ref={ref}
      className="relative inline-block"
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
      {...props}
    >
      {children}
      {isVisible && (
        <div
          className={cn(
            "absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1 text-xs text-white bg-gray-900 rounded-md whitespace-nowrap z-50",
            className
          )}
        >
          {content}
        </div>
      )}
    </div>
  )
})
Tooltip.displayName = "Tooltip"

export { Tooltip }
