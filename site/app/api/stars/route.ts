import { getPackageStats } from "@/lib/stats"

/**
 * The stargazer count, for the navbar.
 *
 * The navbar is a client component (it tracks scroll direction), and it is
 * rendered from the playground page, which is a client component too — so it
 * cannot await `getPackageStats` the way the landing page does. This route is
 * how it gets the number: one server-side hop that reuses the same cached
 * fetches, so the GitHub API is still hit once an hour rather than once per
 * visitor, and the token-free rate limit is never in play.
 */

export const revalidate = 3600

export async function GET() {
    const { stars } = await getPackageStats()

    return Response.json(
        { stars },
        {
            // Fails soft upstream already (stars is null when GitHub didn't
            // answer); caching at the edge keeps a null from being retried on
            // every request during an outage.
            headers: {
                "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
            },
        },
    )
}
