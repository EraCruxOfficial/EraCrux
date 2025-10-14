"use client"

import React from "react"
import { toPng, toJpeg, toSvg } from "html-to-image"
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Download, ChevronDown } from "lucide-react"

interface DownloadChartButtonProps {
    targetRef: React.RefObject<HTMLElement | null>  // ✅ fixed
    filename?: string
}

export function DownloadChartButton({
    targetRef,
    filename = "chart",
}: DownloadChartButtonProps) {
    const [open, setOpen] = React.useState(false)
    const [format, setFormat] = React.useState<"png" | "jpeg" | "svg">("png")

    const handleDownload = async (fmt?: "png" | "jpeg" | "svg") => {
        const selectedFormat = fmt || format
        if (!targetRef.current) return
        try {
            let dataUrl: string
            if (selectedFormat === "png") {
                dataUrl = await toPng(targetRef.current, { cacheBust: true, quality: 1, skipFonts: true, })
            } else if (selectedFormat === "jpeg") {
                dataUrl = await toJpeg(targetRef.current, { cacheBust: true, quality: 1, skipFonts: true, })
            } else {
                dataUrl = await toSvg(targetRef.current, { cacheBust: true, skipFonts: true, })
            }

            const link = document.createElement("a")
            link.download = `${filename.replace(/\s+/g, "_")}.${selectedFormat}`
            link.href = dataUrl
            link.click()
            setOpen(false)
        } catch (err) {
            console.error("Chart download failed:", err)
        }
    }

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button variant="outline" size="sm" className="flex items-center gap-2">
                    <Download className="w-4 h-4" />
                    {/* Download */}
                    <ChevronDown className="w-3 h-3 opacity-60" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-36 p-2">
                <div className="space-y-1">
                    {["png", "jpeg", "svg"].map((fmt) => (
                        <Button
                            key={fmt}
                            variant="ghost"
                            size="sm"
                            className="w-full justify-start text-sm capitalize"
                            onClick={() => handleDownload(fmt as "png" | "jpeg" | "svg")}
                        >
                            {fmt.toUpperCase()}
                        </Button>
                    ))}
                </div>
            </PopoverContent>
        </Popover>
    )
}
