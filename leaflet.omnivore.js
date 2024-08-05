import "./polyfills";
import * as L from "leaflet";
import { readFileDataAsArrayBuffer, readFileDataAsText } from "./leaflet.omnivore.utils";
import {
  csvParse, geojsonParse,
  gpxParse,
  kmlParse,
  kmzParse,
  polylineParse,
  shpParse,
  topojsonParse,
  wktParse,
} from "./leaflet.omnivore.parsers";

/**
 * Load a [GeoJSON](http://geojson.org/) document into a layer and return the layer.
 *
 * @param {string} blobUrl
 * @param {object} options
 * @param {object} customLayer
 * @returns {Promise<Object>}
 */
export async function geojsonLoad(blobUrl, options, customLayer) {
  let layer = customLayer || L.geoJson(null, { ...options.layerOptions });

  const data = await readFileDataAsText(blobUrl);

  const parsedData = geojsonParse(data);

  try {
    layer.addData(parsedData);
    return layer;
  } catch (err) {
    throw Error("GeoJSON not valid");
  }
}

/**
 * Load a [TopoJSON](https://github.com/mbostock/topojson) document into a layer and return the layer.
 *
 * @param {string} blobUrl
 * @param {object} options
 * @param {object} customLayer
 * @returns {Promise<Object>}
 */
export async function topojsonLoad(blobUrl, options, customLayer) {
  let layer = customLayer || L.geoJson(null, { ...options.layerOptions });

  const data = await readFileDataAsText(blobUrl);

  const parsedData = topojsonParse(data, options.parserOptions);

  try {
    layer.addData(parsedData);
    return layer;
  } catch (err) {
    throw Error("topoJSON not valid");
  }
}

/**
 * Load a CSV document into a layer and return the layer.
 *
 * @param {string} blobUrl
 * @param {object} options
 * @param {object} customLayer
 * @returns {Promise<Object>}
 */
export async function csvLoad(blobUrl, options, customLayer) {
  let layer = customLayer || L.geoJson(null, { ...options.layerOptions });

  const data = await readFileDataAsText(blobUrl);

  const parsedData = csvParse(data, options.parserOptions);

  try {
    layer.addData(parsedData);
    return layer;
  } catch (err) {
    throw Error("Spatial data in CSV not valid");
  }
}

/**
 * Load a GPX document into a layer and return the layer.
 *
 * @param {string} blobUrl
 * @param {object} options
 * @param {object} customLayer
 * @returns {Promise<Object>}
 */
export async function gpxLoad(blobUrl, options, customLayer) {
  let layer = customLayer || L.geoJson(null, { ...options.layerOptions });

  const data = await readFileDataAsText(blobUrl);

  const parsedData = gpxParse(data, options.parserOptions);

  try {
    layer.addData(parsedData);
    return layer;
  } catch (err) {
    throw Error("GPX not valid");
  }
}

/**
 * Load a [KML](https://developers.google.com/kml/documentation/) document into a layer and return the layer.
 *
 * @param {string} blobUrl
 * @param {object} options
 * @param {object} customLayer
 * @returns {Promise<Object>}
 */
export async function kmlLoad(blobUrl, options, customLayer) {
  let layer = customLayer || L.geoJson(null, { ...options.layerOptions });

  const data = await readFileDataAsText(blobUrl);

  const parsedData = kmlParse(data, options.parserOptions);

  try {
    layer.addData(parsedData);
    return layer;
  } catch (err) {
    throw Error("KML not valid");
  }
}

export async function kmzLoad(blobUrl, options, customLayer) {
  let layer = customLayer || L.geoJson(null, { ...options.layerOptions });

  const data = await readFileDataAsArrayBuffer(blobUrl);

  const parsedData = await kmzParse(data, options.parserOptions);

  try {
    layer.addData(parsedData);
    return layer;
  } catch (err) {
    throw Error("KMZ not valid");
  }
}

/**
 * Load a WKT (Well Known Text) string into a layer and return the layer
 *
 * @param {string} blobUrl
 * @param {object} options
 * @param {object} customLayer
 * @returns {Promise<Object>}
 */
export async function wktLoad(blobUrl, options, customLayer) {
  let layer = customLayer || L.geoJson(null, { ...options.layerOptions });

  const data = await readFileDataAsText(blobUrl);

  const parsedData = wktParse(data, options.parserOptions);

  try {
    layer.addData(parsedData);
    return layer;
  } catch (err) {
    throw Error("WKT not valid");
  }
}

/**
 * Load a polyline string into a layer and return the layer
 *
 * @param {string} blobUrl
 * @param {object} options
 * @param {object} customLayer
 * @returns {Object}
 */
export async function polylineLoad(blobUrl, options, customLayer) {
  let layer = customLayer || L.geoJson(null, { ...options.layerOptions });

  const data = await readFileDataAsText(blobUrl);

  const parsedData = polylineParse(data, options.parserOptions);

  try {
    layer.addData(parsedData);
    return layer;
  } catch (err) {
    throw Error("Polyline not valid");
  }
}

/**
 * Reads the zipped shapefile and return the layer
 *
 * @param {string} blobUrl
 * @param {object} options
 * @param {object} customLayer
 * @returns {Object}
 */
export async function shapefileLoad(blobUrl, options, customLayer) {
  let layer = customLayer || L.geoJson(null, { ...options.layerOptions });

  const data = await readFileDataAsArrayBuffer(blobUrl);

  const parsedData = await shpParse(data);

  try {
    layer.addData(parsedData);
    return layer;
  } catch (err) {
    throw Error("Shapefile not Valid");
  }
}
