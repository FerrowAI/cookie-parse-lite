export interface CookieAttributes {
  maxAge?: number;
  expires?: Date;
  domain?: string;
  path?: string;
  secure?: boolean;
  httpOnly?: boolean;
  sameSite?: "Strict" | "Lax" | "None";
}

export interface ParsedCookie {
  name: string;
  value: string;
  attributes: CookieAttributes;
}

export function parse(cookieHeader: string): Map<string, string> {
  const cookies = new Map<string, string>();
  const parts = cookieHeader.split(";");

  for (let i = 0; i < parts.length; i++) {
    const part = parts[i].trim();
    if (!part) continue;

    const eqIndex = part.indexOf("=");
    if (eqIndex === -1) continue;

    const name = part.substring(0, eqIndex).trim();
    const value = part.substring(eqIndex + 1).trim();

    cookies.set(name, value);
  }

  return cookies;
}

export function serialize(
  name: string,
  value: string,
  attributes?: CookieAttributes
): string {
  let cookie = `${name}=${value}`;

  if (attributes) {
    if (attributes.maxAge !== undefined) {
      cookie += `; Max-Age=${attributes.maxAge}`;
    }
    if (attributes.expires) {
      cookie += `; Expires=${attributes.expires.toUTCString()}`;
    }
    if (attributes.domain) {
      cookie += `; Domain=${attributes.domain}`;
    }
    if (attributes.path) {
      cookie += `; Path=${attributes.path}`;
    }
    if (attributes.secure) {
      cookie += "; Secure";
    }
    if (attributes.httpOnly) {
      cookie += "; HttpOnly";
    }
    if (attributes.sameSite) {
      if (attributes.sameSite === "None" && !attributes.secure) {
        throw new Error("SameSite=None requires Secure flag");
      }
      cookie += `; SameSite=${attributes.sameSite}`;
    }
  }

  return cookie;
}

export function parseSetCookie(header: string): ParsedCookie {
  const parts = header.split(";");
  const [nameValue, ...attrParts] = parts;

  const eqIndex = nameValue.indexOf("=");
  const name = nameValue.substring(0, eqIndex).trim();
  const value = nameValue.substring(eqIndex + 1).trim();

  const attributes: CookieAttributes = {};

  for (const attr of attrParts) {
    const trimmed = attr.trim();
    const lowerAttr = trimmed.toLowerCase();

    if (lowerAttr.startsWith("max-age=")) {
      attributes.maxAge = parseInt(trimmed.substring(8), 10);
    } else if (lowerAttr.startsWith("expires=")) {
      const dateStr = trimmed.substring(8);
      attributes.expires = new Date(dateStr);
    } else if (lowerAttr.startsWith("domain=")) {
      attributes.domain = trimmed.substring(7);
    } else if (lowerAttr.startsWith("path=")) {
      attributes.path = trimmed.substring(5);
    } else if (lowerAttr === "secure") {
      attributes.secure = true;
    } else if (lowerAttr === "httponly") {
      attributes.httpOnly = true;
    } else if (lowerAttr.startsWith("samesite=")) {
      const value = trimmed.substring(9);
      if (value.toLowerCase() === "none") {
        attributes.sameSite = "None";
      } else if (value.toLowerCase() === "lax") {
        attributes.sameSite = "Lax";
      } else if (value.toLowerCase() === "strict") {
        attributes.sameSite = "Strict";
      }
    }
  }

  return { name, value, attributes };
}

export default { parse, serialize, parseSetCookie };
