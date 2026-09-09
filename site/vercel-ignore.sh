# Ignored Build Step on Vercel: exit 0 skips the build, exit 1 (or higher) triggers the build.

# ---- PAUSE ----
# While this line is active, no push will trigger a build.
# Comment it out to re-enable the path-based filter below.
exit 0

# ---- PATH FILTER ----
# Build only when site/, src/, or the configuration files change.
# VERCEL_GIT_PREVIOUS_SHA points to the last successful deployment of the branch;
# falls back to HEAD^ when the variable does not exist (first deployment, manual deployment).
# If the SHA is outside the shallow clone (--depth=10), git exits with code 128 and the build runs.
git diff --quiet "${VERCEL_GIT_PREVIOUS_SHA:-HEAD^}" HEAD -- \
  :/site :/src :/package.json :/pnpm-lock.yaml :/tsup.config.ts :/vercel.json