"use client"

import * as React from "react"
import { ChevronDown, ChevronLeft, ChevronRight, ChevronUp } from "lucide-react"
import { DayPicker, getDefaultClassNames } from "react-day-picker"
import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"

export type CalendarProps = React.ComponentProps<typeof DayPicker>

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  ...props
}: CalendarProps) {
  const defaultClassNames = getDefaultClassNames()

  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn("p-2 sm:p-3 select-none w-full max-w-[320px] mx-auto", className)}
      classNames={{
        months: cn("relative flex flex-col gap-3", defaultClassNames.months),
        month: cn("flex flex-col gap-3", defaultClassNames.month),
        month_caption: cn(
          "flex justify-center pt-1 pb-1 relative items-center min-h-9",
          defaultClassNames.month_caption
        ),
        caption_label: cn(
          "inline-flex items-center gap-1 text-xs font-semibold tracking-wide text-foreground",
          defaultClassNames.caption_label
        ),
        nav: cn("flex items-center gap-1", defaultClassNames.nav),
        button_previous: cn(
          buttonVariants({ variant: "outline" }),
          "size-7 bg-background p-0 opacity-70 hover:opacity-100 absolute left-0 top-1 shadow-xs z-20 cursor-pointer",
          defaultClassNames.button_previous
        ),
        button_next: cn(
          buttonVariants({ variant: "outline" }),
          "size-7 bg-background p-0 opacity-70 hover:opacity-100 absolute right-0 top-1 shadow-xs z-20 cursor-pointer",
          defaultClassNames.button_next
        ),
        month_grid: cn("w-full border-collapse space-x-0 sm:space-x-1", defaultClassNames.month_grid),
        weekdays: cn("flex justify-between w-full", defaultClassNames.weekdays),
        weekday: cn(
          "text-muted-foreground rounded-md w-7 sm:w-8 font-normal text-[0.75rem] sm:text-[0.8rem] text-center",
          defaultClassNames.weekday
        ),
        weeks: cn("w-full", defaultClassNames.weeks),
        week: cn("flex w-full mt-1 justify-between", defaultClassNames.week),
        day: cn("relative p-0 text-center text-xs focus-within:relative focus-within:z-20", defaultClassNames.day),
        day_button: cn(
          buttonVariants({ variant: "ghost" }),
          "size-7 sm:size-8 p-0 font-normal rounded-md transition-colors hover:bg-accent hover:text-accent-foreground aria-selected:opacity-100 text-xs cursor-pointer",
          defaultClassNames.day_button
        ),
        selected: cn(
          "bg-primary text-primary-foreground font-semibold hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground rounded-md",
          defaultClassNames.selected
        ),
        today: cn("bg-accent text-accent-foreground font-semibold", defaultClassNames.today),
        outside: cn("text-muted-foreground/40 aria-selected:text-muted-foreground/50 opacity-40", defaultClassNames.outside),
        disabled: cn("text-muted-foreground/30 opacity-30 cursor-not-allowed", defaultClassNames.disabled),
        hidden: cn("invisible", defaultClassNames.hidden),
        dropdowns: cn("flex items-center justify-center gap-1.5 text-xs font-medium mx-7 sm:mx-8", defaultClassNames.dropdowns),
        dropdown_root: cn(
          "relative inline-flex items-center rounded-md border border-input bg-background/60 px-2 py-1 text-xs font-medium shadow-xs hover:bg-accent hover:text-accent-foreground cursor-pointer focus-within:ring-1 focus-within:ring-ring transition-colors",
          defaultClassNames.dropdown_root
        ),
        dropdown: cn(
          "absolute inset-0 opacity-0 cursor-pointer w-full h-full z-10",
          defaultClassNames.dropdown
        ),
        chevron: cn("size-3.5 opacity-60 shrink-0 text-muted-foreground", defaultClassNames.chevron),
        ...classNames,
      }}
      components={{
        Chevron: ({ orientation, className: chevronClass, ...chevronProps }) => {
          if (orientation === "left") {
            return <ChevronLeft className={cn("size-3.5 sm:size-4", chevronClass)} {...chevronProps} />
          }
          if (orientation === "right") {
            return <ChevronRight className={cn("size-3.5 sm:size-4", chevronClass)} {...chevronProps} />
          }
          if (orientation === "up") {
            return <ChevronUp className={cn("size-3 sm:size-3.5", chevronClass)} {...chevronProps} />
          }
          return <ChevronDown className={cn("size-3 sm:size-3.5", chevronClass)} {...chevronProps} />
        },
      }}
      {...props}
    />
  )
}

export { Calendar }
