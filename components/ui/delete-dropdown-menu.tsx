"use client"

import { useState } from "react"
import { Trash2Icon, EllipsisVertical } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { toast } from "sonner"

interface DropdownMenuDialogProps {
    fileId: string
    onDeleteSuccess?: () => void // optional callback to refresh UI after deletion
}

export function DropdownMenuDialog({ fileId, onDeleteSuccess }: DropdownMenuDialogProps) {
    const [showDeleteDialog, setShowDeleteDialog] = useState(false)
    const [isDeleting, setIsDeleting] = useState(false)
    const handleDelete = async () => {
        try {
            setIsDeleting(true)

            const res = await fetch(`/api/deleteCsv/${fileId}`, { method: "DELETE" })
            let data = null
            try {
                data = await res.json()
            } catch {
                console.warn("Response was not valid JSON")
            }

            if (!res.ok) {
                throw new Error(data?.error || "Failed to delete file")
            }

            toast.success("File deleted successfully")
            if (onDeleteSuccess) onDeleteSuccess()
            setShowDeleteDialog(false)
        } catch (err: any) {
            console.error("Delete error:", err)
            toast.error(err.message || "An unexpected error occurred")
        } finally {
            setIsDeleting(false)
        }
    }

    return (
        <>
            {/* Dropdown Menu */}
            <DropdownMenu modal={false}>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" aria-label="Open menu" size="sm">
                        <EllipsisVertical />
                    </Button>
                </DropdownMenuTrigger>

                <DropdownMenuContent className="w-40" align="end">
                    <DropdownMenuItem
                        onSelect={() => setShowDeleteDialog(true)}
                        className="text-red-600 focus:bg-[#9C3F42] cursor-pointer"
                    >
                        <Trash2Icon className="mr-2 h-4 w-4" />
                        Delete
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>

            {/* Confirmation Dialog */}
            <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Confirm Deletion</DialogTitle>
                        <DialogDescription>
                            Are you sure you want to delete this file? This action cannot be undone.
                        </DialogDescription>
                    </DialogHeader>

                    <DialogFooter>
                        <DialogClose asChild>
                            <Button variant="outline" disabled={isDeleting}>
                                Cancel
                            </Button>
                        </DialogClose>
                        <Button
                            variant="destructive"
                            onClick={handleDelete}
                            disabled={isDeleting}
                        >
                            {isDeleting ? "Deleting..." : "Delete"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    )
}
