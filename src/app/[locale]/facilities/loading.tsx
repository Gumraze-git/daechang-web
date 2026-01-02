import { Skeleton } from "@/components/ui/skeleton"

export default function Loading() {
    return (
        <div className="container mx-auto px-4 py-12">
            {/* Page Header Skeleton */}
            <div className="text-center mb-16 space-y-4">
                <Skeleton className="h-10 w-48 mx-auto" />
                <Skeleton className="h-6 w-96 mx-auto" />
            </div>

            {/* Facilities Grid Skeleton */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
                {[...Array(4)].map((_, i) => (
                    <div key={i} className="rounded-2xl border border-gray-100 overflow-hidden">
                        {/* Image */}
                        <Skeleton className="w-full h-64 md:h-72 lg:h-80" />

                        {/* Content */}
                        <div className="p-8 space-y-4">
                            <div className="flex justify-between items-start">
                                <div className="space-y-2 flex-1">
                                    <Skeleton className="h-4 w-24" />
                                    <Skeleton className="h-8 w-48" />
                                </div>
                                <Skeleton className="h-8 w-20 rounded-full" />
                            </div>

                            <div className="pt-4 space-y-2">
                                <Skeleton className="h-4 w-full" />
                                <Skeleton className="h-4 w-2/3" />
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}
