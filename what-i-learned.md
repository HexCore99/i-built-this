# What I Learned

### Partial Pre-Rendering

    - partially pre-renders pages at build time. The components inside <Suspense> boundaries will be pre-renderre.
    my

### drizzle ORM + NEON db

### How Clerk Middleware and proxy.ts work

1. Next.js automatically recognizes the root `proxy.ts` file.
2. For every incoming request, Next checks the `matcher` patterns exported from that file.
3. If the URL matches—for example, `/api/products` matches the API pattern—Next runs the default export from `proxy.ts` before the page or API route.
4. In this project, the default export is `clerkMiddleware(...)`. Clerk reads and verifies the session cookies, then provides the `auth()` helper.
5. Clerk runs the callback passed to `clerkMiddleware`. The callback can inspect values such as `userId` and `orgId`, then allow, redirect, or block the request.
6. Returning `NextResponse.next()` allows the request to continue to its page or API route.
