import * as SliderPrimitive from "@radix-ui/react-slider";
import { cn } from "@/lib/utils";

/** Слайдер диапазона: рендерит по одному «ползунку» на значение. aria-label обязателен. */
export function Slider({
  className, value, thumbLabels, ...props
}: React.ComponentProps<typeof SliderPrimitive.Root> & { thumbLabels?: string[] }) {
  return (
    <SliderPrimitive.Root
      value={value}
      className={cn("relative flex h-5 w-full touch-none select-none items-center", className)}
      {...props}
    >
      <SliderPrimitive.Track className="relative h-1.5 w-full grow overflow-hidden rounded-full bg-secondary">
        <SliderPrimitive.Range className="absolute h-full bg-primary" />
      </SliderPrimitive.Track>
      {(value ?? []).map((_, i) => (
        <SliderPrimitive.Thumb
          key={i}
          aria-label={thumbLabels?.[i]}
          className="block h-5 w-5 rounded-full border-2 border-primary bg-card shadow"
        />
      ))}
    </SliderPrimitive.Root>
  );
}
