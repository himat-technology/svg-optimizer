/**
 * Byte-size and node-count statistics for SVG documents.
 */

/**
 * Accurate UTF-8 byte length (preferred over string.length).
 */
export function getByteSize(svg: string): number {
  if (typeof Blob !== "undefined") {
    return new Blob([svg]).size;
  }
  // Fallback for environments without Blob
  return new TextEncoder().encode(svg).length;
}

/**
 * Count element nodes in a Document or Element tree.
 */
export function countElementNodes(root: Document | Element): number {
  const walkerRoot =
    root.nodeType === Node.DOCUMENT_NODE
      ? (root as Document).documentElement
      : (root as Element);

  if (!walkerRoot) {
    return 0;
  }

  let count = 0;
  const walker = walkerRoot.ownerDocument!.createTreeWalker(
    walkerRoot,
    NodeFilter.SHOW_ELEMENT,
  );

  let current: Node | null = walkerRoot;
  while (current) {
    count += 1;
    current = walker.nextNode();
  }

  return count;
}

/**
 * Count element nodes from serialized SVG string.
 */
export function countNodesFromSvgString(svg: string): number {
  if (typeof DOMParser === "undefined") {
    return 0;
  }
  const doc = new DOMParser().parseFromString(svg, "image/svg+xml");
  if (doc.querySelector("parsererror")) {
    return 0;
  }
  return countElementNodes(doc);
}

export function calculateBandwidthSavedPercent(
  originalBytes: number,
  optimizedBytes: number,
): number {
  if (originalBytes <= 0) {
    return 0;
  }
  const saved = ((originalBytes - optimizedBytes) / originalBytes) * 100;
  return Math.max(0, Math.round(saved));
}

export function formatBytes(bytes: number): string {
  return `${bytes.toLocaleString("en-US")} B`;
}
