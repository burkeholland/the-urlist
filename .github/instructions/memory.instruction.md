---
applyTo: '**'
---

# Memory: Next.js Link legacyBehavior

- The `legacyBehavior` prop for Next.js `Link` is deprecated and should not be used.
- Always use the new Link pattern: do not wrap Link children in `<a>`, and do not use `legacyBehavior` or `passHref`.
- For shadcn/ui, use `asChild` to wrap Link in components like NavigationMenuLink or Button.
- Refactor any code using `legacyBehavior` to the new pattern immediately.
