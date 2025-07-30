import React, { CSSProperties, ComponentPropsWithoutRef } from "react";
import { cn } from "@/lib/utils";

export interface ShimmerButtonProps extends ComponentPropsWithoutRef<"button"> {
  shimmerColor?: string;
  shimmerSize?: string;
  borderRadius?: string;
  shimmerDuration?: string;
  background?: string;
  className?: string;
  children?: React.ReactNode;
}

export const ShimmerButton = React.forwardRef<
  HTMLButtonElement,
  ShimmerButtonProps
>(
  (
    {
      shimmerColor = "#ffffff",
      shimmerSize = "0.08em",
      shimmerDuration = "3s",
      borderRadius = "100px",
      background = "rgba(255, 255, 255, 0.1)", // default semi-transparent
      className,
      children,
      ...props
    },
    ref,
  ) => {
    return (
      <button
        style={
          {
            "--spread": "90deg",
            "--shimmer-color": shimmerColor,
            "--radius": borderRadius,
            "--speed": shimmerDuration,
            "--cut": shimmerSize,
            "--bg": background,
          } as CSSProperties
        }
        className={cn(
          // glassmorphic background
          "group relative z-0 flex cursor-pointer items-center justify-center overflow-hidden whitespace-nowrap border px-6 py-3 text-white [background:var(--bg)] [border-radius:var(--radius)]",
          "border-white/20 backdrop-blur-md shadow-sm",
          "transition-transform duration-300 ease-in-out transform-gpu active:translate-y-px",
          className,
        )}
        ref={ref}
        {...props}
      >
        {/* shimmer spark container */}
        <div
          className={cn(
            "-z-30 blur-[2px]",
            "absolute inset-0 overflow-visible [container-type:size]",
          )}
        >
          {/* rotating shimmer */}
          <div className="absolute inset-0 h-[100cqh] animate-shimmerSlide [aspect-ratio:1] [border-radius:0] [mask:none]">
  <div className="absolute -inset-full w-auto rotate-0 animate-spinAround [background:conic-gradient(from_calc(270deg-(var(--spread)*0.5)),transparent_0,var(--shimmer-color)_var(--spread),transparent_var(--spread))] [translate:0_0]" />
</div>

        </div>

        {children}

        {/* Inner highlight overlay */}
        <div
          className={cn(
            "insert-0 absolute size-full",
            "rounded-2xl px-4 py-1.5 text-sm font-medium shadow-[inset_0_-8px_10px_#ffffff1f]",
            "transition-all duration-300 ease-in-out transform-gpu",
            "group-hover:shadow-[inset_0_-6px_10px_#ffffff3f]",
            "group-active:shadow-[inset_0_-10px_10px_#ffffff3f]",
          )}
        />

        {/* Backdrop for shimmer blend */}
        <div
          className={cn(
            "absolute -z-20 [background:var(--bg)] [border-radius:var(--radius)] [inset:var(--cut)] backdrop-blur-md",
          )}
        />
      </button>
    );
  },
);

ShimmerButton.displayName = "ShimmerButton";
