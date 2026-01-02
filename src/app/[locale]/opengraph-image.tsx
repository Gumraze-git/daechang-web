
import { ImageResponse } from 'next/og'

// Route segment config
export const runtime = 'edge'

// Image metadata
export const alt = 'Daechang Machinery Industry'
export const size = {
    width: 1200,
    height: 630,
}

export const contentType = 'image/png'

// Image generation
export default async function Image() {
    // Font loading (optional, skipping for now to rely on system fonts or default)

    // Using absolute URL for the logo. In Vercel/Next.js edge runtime, we might need a full URL.
    // For simplicity and reliability, can we use an externally hosted image or base64?
    // Or fetch from the deployment URL.
    // Let's try to fetch the logo from the public URL.

    // const logoSrc = await fetch(new URL('../../../public/logo.png', import.meta.url)).then(
    //   (res) => res.arrayBuffer()
    // )
    // The above file system access might be tricky in edge.

    // A safer bet for `opengraph-image.tsx` if we want to use local assets is to just use JSX and simple shapes if possible, 
    // or use the `fs` if not edge, but usually OG is edge.
    // Let's try to assume we can fetch the image from the site URL if defined, or hardcode a simple text based backup if image load fails, 
    // BUT the user specifically wants the logo not cropped.

    // Actually, Next.js allows importing images directly in some versions for ImageResponse?
    // Let's try fetching the image. Since I don't have a guaranteed absolute URL for localhost/production easily without env vars,
    // I will try to use the `deployment` url or a placeholder.
    // Wait, I can try to read the file if I use Node runtime instead of Edge.

    const logoUrl = process.env.NEXT_PUBLIC_APP_URL
        ? `${process.env.NEXT_PUBLIC_APP_URL}/logo_simple.png`
        : 'https://daechang-web.vercel.app/logo_simple.png'; // Fallback to production or known URL if local variable missing

    return new ImageResponse(
        (
            // ImageResponse JSX element
            <div
                style={{
                    background: 'white',
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexDirection: 'column',
                }}
            >
                <div
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: '800px', // Restrict width to ensure padding
                        height: '400px',
                    }}
                >
                    {/* Using img tag with absolute src */}
                    <img
                        src={logoUrl}
                        alt="Daechang Logo"
                        style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'contain', // Critical for preventing cropping
                        }}
                    />
                </div>
            </div>
        ),
        // ImageResponse options
        {
            ...size,
        }
    )
}
