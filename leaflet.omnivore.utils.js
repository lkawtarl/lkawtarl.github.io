/**
 * Download a blob object by its url and read it as a text
 *
 * @param {string} blobUrl
 * @returns {Promise}
 */
export function readFileDataAsText(blobUrl) {
  return fetch(blobUrl)
    .then((response) => response.blob())
    .then((blob) => blob.text())
    .catch((err) => null);
}

/**
 * Download a blob object by its url and read it as an array buffer
 *
 * @param {string} blobUrl
 * @returns {Promise}
 */
export function readFileDataAsArrayBuffer(blobUrl) {
  return fetch(blobUrl)
    .then((response) => response.blob())
    .then((blob) => blob.arrayBuffer())
    .catch((err) => null);
}

/**
 * Parse a XML string like to XML
 *
 * @param {string} str
 * @returns {XMLDocument}
 */
export function parseXML(str) {
  if (typeof str === 'string') {
    return (new DOMParser()).parseFromString(str, 'text/xml');
  }
  return str;
}
