import { Skeleton } from "@/components/ui/skeleton"

export default function Loading() {
    return (
        <div className="container mx-auto py-8">
            {/* Header & Controls Skeleton */}
            <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
                <Skeleton className="h-10 w-48" />
                <div className="flex gap-2">
                    <Skeleton className="h-9 w-9 rounded-md" />
                    <Skeleton className="h-9 w-9 rounded-md" />
                </div>
            </div>

            {/* Tabs Skeleton */}
            <div className="flex justify-center mb-8 gap-2 overflow-x-auto py-2">
                <Skeleton className="h-10 w-16 rounded-full flex-shrink-0" />
                <Skeleton className="h-10 w-24 rounded-full flex-shrink-0" />
                <Skeleton className="h-10 w-24 rounded-full flex-shrink-0" />
                <Skeleton className="h-10 w-24 rounded-full flex-shrink-0" />
            </div>

            {/* Grid Skeleton (Matching default Grid view) */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {[...Array(8)].map((_, i) => (
                    <div key={i} className="flex flex-col h-full overflow-hidden rounded-xl border border-gray-200 bg-white">
                        {/* Image placeholder - Aspect Video match */}
                        <div className="w-full aspect-video relative">
                            <Skeleton className="absolute inset-0 w-full h-full rounded-none" />
                        </div>

                        {/* Content */}
                        <div className="p-6 flex-1 flex flex-col space-y-4">
                            <div className="flex justify-between items-start">
                                <Skeleton className="h-3 w-24 bg-gray-200" />
                                <Skeleton className="h-5 w-16 rounded-md bg-gray-200" />
                            </div>

                            <div className="space-y-2">
                                <Skeleton className="h-6 w-full" />
                                <Skeleton className="h-6 w-2/3" />
                            </div>

                            <div className="pt-2 mt-auto">
                                <div className="flex items-center gap-1">
                                    <Skeleton className="h-4 w-16" />
                                    <Skeleton className="h-4 w-4" />
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Pagination Skeleton */}
            <div className="flex justify-center items-center gap-4">
                <Skeleton className="h-10 w-10" />
                <Skeleton className="h-5 w-20" />
                <Skeleton className="h-10 w-10" />
            </div>
        </div>
    )
}
