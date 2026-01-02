import { Skeleton } from "@/components/ui/skeleton"

export default function Loading() {
    return (
        <div className="container mx-auto px-4 py-8">
            {/* Page Header Skeleton */}
            <div className="mb-12 text-center">
                <Skeleton className="h-10 w-48 mx-auto mb-4" />
                <Skeleton className="h-6 w-96 mx-auto" />
            </div>

            {/* Tabs Skeleton */}
            <div className="flex justify-center mb-8 gap-4">
                <Skeleton className="h-10 w-24 rounded-full" />
                <Skeleton className="h-10 w-24 rounded-full" />
                <Skeleton className="h-10 w-24 rounded-full" />
            </div>

            {/* Products Grid Skeleton */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {[...Array(6)].map((_, i) => (
                    <div key={i} className="h-full flex flex-col rounded-lg border border-gray-200 overflow-hidden bg-white">
                        {/* Image Section (h-48 match) */}
                        <div className="w-full h-48 bg-gray-100 relative">
                            <Skeleton className="absolute inset-0 w-full h-full rounded-none" />
                        </div>

                        {/* Content Section (p-4 match) */}
                        <div className="p-4 flex-grow flex flex-col space-y-3">
                            {/* Title */}
                            <Skeleton className="h-7 w-3/4 mb-1" />

                            {/* Description (multiline) */}
                            <div className="space-y-1 mb-2">
                                <Skeleton className="h-3 w-full" />
                                <Skeleton className="h-3 w-5/6" />
                            </div>

                            {/* Model Badge */}
                            <Skeleton className="h-6 w-20 rounded bg-blue-50/50 mt-2" />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}
