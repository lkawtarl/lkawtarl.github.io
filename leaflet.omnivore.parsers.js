import { csv2geojson } from "csv2geojson";
import { parse as wktParser } from "wellknown";
import { decode as polylineParser } from "@mapbox/polyline";
import { feature as topojsonParser } from "topojson-client";
import { kml as kmlParser, gpx as gpxParser } from "@mapbox/togeojson";
import shp from "shpjs";
import JSZip from "jszip";
import { parseXML } from "./leaflet.omnivore.utils";

export function geojsonParse(data) {
  const geojson = JSON.parse(data);

  if (!geojson) {
    return null;
  }

  return geojson;
}

export function topojsonParse(data, options) {
  let o = typeof data === 'string'
    ? JSON.parse(data) : data;

  for (let i in o.objects) {
    let ft = topojsonParser(o, o.objects[i]);

    if (ft.features) {
      return ft.features;
    }

    return ft;
  }
}

export function csvParse(csv, options) {
  options = options || {};

  let features;

  const afterParse = (err, geojson) => {
    if (!err) {
      features = geojson;
      return;
    }

    features = null;
  };

  csv2geojson(csv, options, afterParse);

  return features;
}

export function gpxParse(gpx, options, layer) {
  let xml = parseXML(gpx);

  if (!xml) {
    return null;
  }

  return gpxParser(xml);
}

export function kmlParse(rawData, options) {
  let xml = parseXML(rawData);

  if (!xml) {
    return null;
  }

  return kmlParser(xml);
}

export async function kmzParse(rawData, options) {
  const { files } = await JSZip.loadAsync(rawData);

  let kmlFile;

  for (const file in files) {
    if (file.endsWith(".kml")) {
      kmlFile = files[file];
    }
  }

  const xml = await kmlFile.async("text");

  return kmlParse(xml);
}

export function polylineParse(txt, options) {
  options = options || {};

  let coords = polylineParser(txt, options.precision);

  let geojson = {
    type: 'LineString',
    coordinates: [],
  };

  if (!coords.length) {
    return null;
  }

  for (let i = 0; i < coords.length; i++) {
    // polyline returns coords in lat, lng order, so flip for geojson
    geojson.coordinates[i] = [coords[i][1], coords[i][0]];
  }

  return geojson;
}

export function wktParse(wkt, options, layer) {
  const parseData = wktParser(wkt);

  if (!parseData) {
    return null;
  }

  return parseData;
}

export async function shpParse(buf) {
  const parsedData = await shp(buf);

  if (!parsedData) {
    return null;
  }

  return parsedData;
}
