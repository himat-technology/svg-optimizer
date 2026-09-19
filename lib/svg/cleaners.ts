/**
 * SVG cleaning passes — correctness over aggression.
 */

/** Editor / tool namespace prefixes that are safe to strip when removeMetadata is on. */
const EDITOR_NAMESPACE_PREFIXES = [
  "inkscape",
  "sodipodi",
  "sketch",
  "serif",
  "xmlns:inkscape",
  "xmlns:sodipodi",
  "xmlns:sketch",
  "xmlns:serif",
  "xmlns:i",
  "xmlns:graph",
  "xmlns:c",
];

const EDITOR_NAMESPACE_URIS = new Set([
  "http://www.inkscape.org/namespaces/inkscape",
  "http://sodipodi.sourceforge.net/DTD/sodipodi-0.dtd",
  "http://www.bohemiancoding.com/sketch/ns",
  "http://www.serif.com/",
  "http://ns.adobe.com/AdobeIllustrator/10.0/",
  "http://ns.adobe.com/Graphs/1.0/",
  "http://ns.adobe.com/SaveForWeb/1.0/",
  "http://ns.adobe.com/Variables/1.0/",
  "http://ns.adobe.com/Schemas/1.0/",
  "http://ns.adobe.com/AdobeSVGViewerExtensions/3.0/",
  "http://ns.adobe.com/Flows/1.0/",
  "http://ns.adobe.com/ImageReplacement/1.0/",
  "http://ns.adobe.com/GenericCustomNamespace/1.0/",
  "http://ns.adobe.com/XInclude/1.0/",
  "http://ns.adobe.com/Extensibility/1.0/",
]);

/** Attributes that are often redundant defaults — only remove when clearly safe. */
const DEFAULT_ATTRIBUTE_VALUES: Record<string, Set<string>> = {
  fill: new Set(["#000", "#000000", "black"]),
  "fill-rule": new Set(["nonzero"]),
  "stroke-linecap": new Set(["butt"]),
  "stroke-linejoin": new Set(["miter"]),
  "stroke-miterlimit": new Set(["4"]),
  "stroke-opacity": new Set(["1"]),
  "fill-opacity": new Set(["1"]),
  opacity: new Set(["1"]),
  display: new Set(["inline"]),
  visibility: new Set(["visible"]),
  overflow: new Set(["visible"]),
  "font-style": new Set(["normal"]),
  "font-weight": new Set(["normal", "400"]),
  "text-decoration": new Set(["none"]),
  "xml:space": new Set(["preserve"]),
};

const REQUIRED_NAMESPACES = new Set([
  "http://www.w3.org/2000/svg",
  "http://www.w3.org/1999/xlink",
  "http://www.w3.org/XML/1998/namespace",
]);

/**
 * Collect IDs that are referenced anywhere in the document so we never
 * remove definitions or attributes that are still in use.
 */
export function collectReferencedIds(document: Document): Set<string> {
  const referenced = new Set<string>();
  const root = document.documentElement;
  if (!root) {
    return referenced;
  }

  const urlRef = /url\(\s*['"]?#([^'")\s]+)['"]?\s*\)/gi;
  const cssIdRef = /#([A-Za-z_][\w:.-]*)/g;

  const considerValue = (value: string) => {
    let match: RegExpExecArray | null;
    urlRef.lastIndex = 0;
    while ((match = urlRef.exec(value)) !== null) {
      referenced.add(match[1]);
    }

    // href / xlink:href fragment refs
    if (value.startsWith("#") && value.length > 1) {
      referenced.add(value.slice(1));
    }
  };

  const all = [root, ...Array.from(root.querySelectorAll("*"))];
  for (const el of all) {
    for (const attr of Array.from(el.attributes)) {
      considerValue(attr.value);

      // style attribute may contain url(#id) and #id selectors
      if (attr.name === "style") {
        let m: RegExpExecArray | null;
        cssIdRef.lastIndex = 0;
        while ((m = cssIdRef.exec(attr.value)) !== null) {
          referenced.add(m[1]);
        }
      }
    }

    // Inline <style> text content
    if (el.localName.toLowerCase() === "style" && el.textContent) {
      let m: RegExpExecArray | null;
      urlRef.lastIndex = 0;
      while ((m = urlRef.exec(el.textContent)) !== null) {
        referenced.add(m[1]);
      }
      cssIdRef.lastIndex = 0;
      while ((m = cssIdRef.exec(el.textContent)) !== null) {
        referenced.add(m[1]);
      }
    }
  }

  return referenced;
}

/**
 * Strip XML/HTML comment nodes.
 */
export function stripComments(document: Document): void {
  const root = document.documentElement;
  if (!root) {
    return;
  }

  const comments: Comment[] = [];
  const walker = document.createTreeWalker(document, NodeFilter.SHOW_COMMENT);
  let node = walker.nextNode();
  while (node) {
    comments.push(node as Comment);
    node = walker.nextNode();
  }

  for (const comment of comments) {
    comment.parentNode?.removeChild(comment);
  }
}

/**
 * Remove editor metadata, unused editor namespaces, and <metadata> blocks.
 * Preserves required SVG / XLink namespaces and any IDs that are referenced.
 */
export function removeMetadata(document: Document): void {
  const root = document.documentElement;
  if (!root) {
    return;
  }

  const referencedIds = collectReferencedIds(document);

  // Walk by localName / namespace — avoid CSS namespace selectors (not portable)
  const toRemove: Element[] = [];
  const allElements = [root, ...Array.from(root.querySelectorAll("*"))];

  for (const el of allElements) {
    if (el === root) {
      continue;
    }

    const local = el.localName.toLowerCase();
    const ns = el.namespaceURI || "";

    if (
      local === "metadata" ||
      local === "namedview" ||
      local === "rdf" ||
      EDITOR_NAMESPACE_URIS.has(ns)
    ) {
      const id = el.getAttribute("id");
      if (id && referencedIds.has(id)) {
        continue;
      }
      toRemove.push(el);
    }
  }

  for (const el of toRemove) {
    el.parentNode?.removeChild(el);
  }

  // Remove editor attributes and xmlns declarations from remaining elements
  const remaining = [root, ...Array.from(root.querySelectorAll("*"))];
  for (const el of remaining) {
    const attrs = Array.from(el.attributes);
    for (const attr of attrs) {
      const name = attr.name.toLowerCase();
      const value = attr.value;

      // Drop editor xmlns:* declarations
      if (name.startsWith("xmlns:")) {
        const prefix = name.slice(6);
        if (
          EDITOR_NAMESPACE_PREFIXES.some(
            (p) => p === prefix || p === `xmlns:${prefix}`,
          ) ||
          EDITOR_NAMESPACE_URIS.has(value)
        ) {
          // Never remove required namespaces
          if (!REQUIRED_NAMESPACES.has(value)) {
            el.removeAttribute(attr.name);
          }
          continue;
        }
      }

      // Drop prefixed editor attributes (inkscape:*, sodipodi:*, sketch:*)
      const colon = name.indexOf(":");
      if (colon > 0) {
        const prefix = name.slice(0, colon);
        if (
          prefix === "inkscape" ||
          prefix === "sodipodi" ||
          prefix === "sketch" ||
          prefix === "serif" ||
          prefix === "i" ||
          prefix === "graph" ||
          prefix === "c"
        ) {
          el.removeAttribute(attr.name);
        }
      }

      // Common Illustrator / Sketch data attributes
      if (
        name.startsWith("data-name") ||
        name === "enable-background" ||
        name === "data-sketch-name" ||
        name === "data-figma-id"
      ) {
        el.removeAttribute(attr.name);
      }
    }

    // Remove version attribute on root (informational only)
    if (el === root && el.hasAttribute("version")) {
      el.removeAttribute("version");
    }
  }
}

/**
 * Remove empty <g> elements, including those that become empty after cleanup.
 * Never remove groups that have referenced IDs.
 */
export function removeEmptyGroups(document: Document): void {
  const referencedIds = collectReferencedIds(document);
  let changed = true;

  while (changed) {
    changed = false;
    const groups = Array.from(
      document.documentElement?.querySelectorAll("g") ?? [],
    );

    for (const group of groups) {
      const id = group.getAttribute("id");
      if (id && referencedIds.has(id)) {
        continue;
      }

      // Consider empty if no element children and no meaningful text
      const hasElementChild = Array.from(group.childNodes).some(
        (n) => n.nodeType === Node.ELEMENT_NODE,
      );
      const text = group.textContent?.trim() ?? "";

      if (!hasElementChild && text === "") {
        // Preserve groups that only exist for attributes affecting descendants —
        // but with no children, attributes are irrelevant. Safe to remove.
        group.parentNode?.removeChild(group);
        changed = true;
      }
    }
  }
}

/**
 * Remove clearly redundant default attributes when safe.
 * Never removes id, class, href, viewBox, xmlns, or referenced attributes.
 */
export function cleanUnusedAttributes(document: Document): void {
  const referencedIds = collectReferencedIds(document);
  const root = document.documentElement;
  if (!root) {
    return;
  }

  const elements = [root, ...Array.from(root.querySelectorAll("*"))];

  for (const el of elements) {
    const attrs = Array.from(el.attributes);
    for (const attr of attrs) {
      const name = attr.name;
      const lower = name.toLowerCase();
      const value = attr.value.trim();

      // Never touch identity / linking / layout-critical attrs
      if (
        lower === "id" ||
        lower === "class" ||
        lower === "viewbox" ||
        lower === "xmlns" ||
        lower.startsWith("xmlns:") ||
        lower === "href" ||
        lower === "xlink:href" ||
        lower === "d" ||
        lower === "points" ||
        lower === "transform" ||
        lower === "style" ||
        lower === "clip-path" ||
        lower === "mask" ||
        lower === "filter" ||
        lower === "fill" && value.startsWith("url(") ||
        lower === "stroke" && value.startsWith("url(")
      ) {
        continue;
      }

      // Don't remove id if referenced (already skipped id above)

      // Empty attributes that aren't meaningful
      if (value === "" && lower !== "d") {
        // Empty class/id already skipped; empty data-* etc.
        if (lower.startsWith("data-")) {
          el.removeAttribute(name);
          continue;
        }
      }

      const defaults = DEFAULT_ATTRIBUTE_VALUES[lower];
      if (defaults && defaults.has(value.toLowerCase())) {
        // fill="black" is only a true default when no parent fill inheritance
        // matters differently — SVG default fill is black, so removing is OK
        // for shape elements. Skip on <svg> root to avoid surprises.
        if (el === root && (lower === "fill" || lower === "stroke")) {
          continue;
        }
        el.removeAttribute(name);
        continue;
      }

      // stroke="none" with no stroke-width is redundant for many shapes,
      // but stroke="none" can be intentional to override inheritance — leave it.

      // Remove unused inkscape-style labels already handled in metadata pass
      void referencedIds;
    }
  }
}

/**
 * Sanitize SVG for safe preview: strip scripts, event handlers, and
 * foreignObject content that could execute.
 */
export function sanitizeForPreview(document: Document): void {
  const root = document.documentElement;
  if (!root) {
    return;
  }

  const kill = Array.from(
    root.querySelectorAll("script, foreignObject, foreignobject, iframe, embed, object"),
  );
  for (const el of kill) {
    el.parentNode?.removeChild(el);
  }

  const all = [root, ...Array.from(root.querySelectorAll("*"))];
  for (const el of all) {
    for (const attr of Array.from(el.attributes)) {
      const name = attr.name.toLowerCase();
      const value = attr.value.trim().toLowerCase();

      if (name.startsWith("on")) {
        el.removeAttribute(attr.name);
        continue;
      }

      if (
        (name === "href" || name === "xlink:href" || name === "src") &&
        (value.startsWith("javascript:") ||
          value.startsWith("data:text/html") ||
          value.startsWith("vbscript:"))
      ) {
        el.removeAttribute(attr.name);
      }
    }
  }
}
