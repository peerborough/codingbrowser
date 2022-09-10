export function replaceText(from, to) {
  if (typeof from !== 'string' || typeof to !== 'string') return;
  const search = escapeSingleQuotationByConcat(from);
  if (!search) return;

  const xpath = `//*[contains(text(),${search})]`;
  const result = document.evaluate(
    xpath,
    document,
    null,
    XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE,
    null
  );

  for (let i = 0; i < result.snapshotLength; i++) {
    const node = result.snapshotItem(i);
    if (!node || node.nodeName === 'SCRIPT') continue;

    node.textContent = node.textContent.replaceAll(from, to);
  }
}

export function findElementByText(text) {
  if (typeof text !== 'string') return;
  const escapedText = escapeSingleQuotationByConcat(text);
  if (!escapedText) return;

  const xpath = `//*[normalize-space(text())=${escapedText}]`;
  const result = document.evaluate(
    xpath,
    document,
    null,
    XPathResult.FIRST_ORDERED_NODE_TYPE,
    null
  );

  return result?.singleNodeValue || null;
}

export function findElementsByTextAll(text) {
  if (typeof text !== 'string') return;
  const escapedText = escapeSingleQuotationByConcat(text);
  if (!escapedText) return;

  const xpath = `//*[normalize-space(text())=${escapedText}]`;
  const result = document.evaluate(
    xpath,
    document,
    null,
    XPathResult.ORDERED_NODE_SNAPSHOT_TYPE,
    null
  );

  const returnValue = [];
  for (let i = 0; i < result.snapshotLength; i++) {
    const node = result.snapshotItem(i);
    returnValue.push(node);
  }

  return returnValue;
}

function escapeSingleQuotationByConcat(str) {
  if (!str) return null;

  const sentences = str.split(/(')/g);
  const args = sentences
    .filter((sentence) => sentence.length > 0)
    .map((sentence) => (sentence === "'" ? `"${sentence}"` : `'${sentence}'`));

  if (args.length === 0) return null;
  else if (args.length === 1) return `"${str}"`;
  else return `concat(${args.join()})`;
}
