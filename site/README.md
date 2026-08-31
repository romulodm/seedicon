# seedicon site

Marketing page + live playground for the [`seedicon`](../) package.

It lives in this repository but is **never published to npm**: the root
`package.json` has `"files": ["dist"]`, so only the built package ends up
in the tarball. Nothing in `site/` ships to anyone installing the package.

## Running it

```
cd site
npm install
npm run dev
```

`npm install` resolves `seedicon` from `file:..`, i.e. the package sitting
in this same repository, so the playground always demos the code you have
checked out rather than whatever is on npm. The `prebuild` script builds
the parent package before `next build` runs, which is what makes this work
on Vercel too.

> Once `seedicon` is published you can switch the dependency to a real
> version (`"seedicon": "^0.1.0"`) and delete the `prebuild` script — the
> site would then demo the published artifact instead of the working tree.
> Both are defensible; `file:..` was chosen so the site can never drift
> from the source.

## Deploying to Vercel

Import the repository and set **Root Directory** to `site`. Everything
else is default. No environment variables: the download count, star count
and latest version come from public, unauthenticated endpoints
(`api.npmjs.org`, `registry.npmjs.org`, `api.github.com`) and are cached
for an hour by `export const revalidate = 3600`. If any of them fails or
rate-limits, that stat renders as `—` and the page still builds.
