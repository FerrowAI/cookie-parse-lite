# cookie-parse-lite
![CI](https://github.com/FerrowAI/cookie-parse-lite/actions/workflows/ci.yml/badge.svg)

HTTP cookie parsing and serialization with Set-Cookie attribute support and SameSite validation.

## Quick Start

```typescript
import { parse, serialize } from "cookie-parse-lite";

const cookies = parse("sessionId=abc123; theme=dark");

const setHeader = serialize("token", "xyz", {
  httpOnly: true,
  secure: true,
  sameSite: "Strict",
});
```

## API

### `parse(cookieHeader: string): Map<string, string>`

Parse a Cookie request header into a name→value map.

### `serialize(name: string, value: string, attributes?: CookieAttributes): string`

Create a Set-Cookie header string. Enforces SameSite=None requires Secure flag.

### `parseSetCookie(header: string): ParsedCookie`

Parse a Set-Cookie response header into structured form with name, value, and attributes.

### Attributes

```typescript
interface CookieAttributes {
  maxAge?: number                   // Seconds
  expires?: Date                    // Absolute expiry
  domain?: string                   // Domain restriction
  path?: string                     // Path restriction
  secure?: boolean                  // HTTPS only
  httpOnly?: boolean                // No JS access
  sameSite?: "Strict" | "Lax" | "None"
}
```

## Limits

- No domain/path matching (scope checking is app responsibility)
- Attribute parsing case-insensitive (per spec)
- SameSite=None+Secure validation at serialize time only

---

Part of the [ferrow-toolkit](https://github.com/FerrowAI/ferrow-toolkit) collection · Sponsored by [Ferrow](https://ferrow.ai)
