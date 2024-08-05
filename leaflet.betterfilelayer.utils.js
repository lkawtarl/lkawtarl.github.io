import JSZip from "jszip";

/**
 * Returns the file's extension without dot
 *
 * @param {string} fileName
 * @returns {string}
 */
export function getFileExtension(fileName) {
  return fileName.toLowerCase().split('.').at(-1);
}

/**
 * Returns the filename without extension
 *
 * @param {string} fileName
 * @returns {string}
 */
export function getFileBaseName(fileName) {
  return fileName.toLowerCase().split('.').at(0);
}

/**
 * Converts the value in bytes to kilobytes
 *
 * @param {int} size
 * @returns {string}
 */
export function bytesToKilobytes(size) {
  return (size / 1024).toFixed(4);
}

/**
 * Group the shapefile components (shp, dbf, prj...) by filename and returns an object where the
 * keys are the filename and the value is a list with the shapefile components associated
 *
 * @param {FileList} files
 * @returns {Object}
 */
export function extractShpComponents(files) {
  let shpComponents = {};
  const shpComponentsExtensions = ["shp", "shx", "dbf", "prj"];

  for (const file of files) {
    if (shpComponentsExtensions.includes(getFileExtension(file.name))) {
      if (!Object.hasOwnProperty.call(shpComponents, getFileBaseName(file.name))) {
        shpComponents[getFileBaseName(file.name)] = [];
      }
      shpComponents[getFileBaseName(file.name)].push(file);
    }
  }

  return shpComponents;
}

/**
 * Gets the object returned from extractShpComponents function and create a list of
 * in-memory zipped shapefiles from every key.
 * In summary: Gets the shapefile components (.shp, .dbf, .prj ...) grouped by name and zip compress
 * @param {Object} shapes
 * @returns {Array}
 */
export async function zipShpComponents(shapes) {
  const zips = [];

  for (const shapeName in shapes) {
    const zip = new JSZip();

    for (const component of shapes[shapeName]) {
      zip.file(component.name, component.arrayBuffer());
    }

    const blob = await zip.generateAsync({ type: "blob" });

    const shpZip = new File([blob], `${shapeName}.zip`, { type: "application/zip" });

    zips.push(shpZip);
  }

  return zips;
}

/**
 * Filters all files that are part of a shapefile's components (shp, dbf, prj...)
 *
 * @param {FileList} files
 * @returns {Array}
 */
export function filterShpComponents(files) {
  const filteredFiles = [];
  const shpComponentsExtensions = ["shp", "shx", "dbf", "prj"];

  for (let i = 0; i <= files.length - 1; i++) {
    if (!shpComponentsExtensions.includes(getFileExtension(files[i].name))) {
      filteredFiles.push(files[i]);
    }
  }

  return filteredFiles;
}

/**
 * Transform the simple style spec from feature props to Leaflet Path styles options
 *
 * @param {Object} feature
 * @returns {Object} Leaflet path styling options
 */
export function simpleStyleToLeafletStyle(feature) {
  // https://github.com/mapbox/simplestyle-spec
  const simpleStyleSpec = {
    stroke: "color", // the color of a line as part of a polygon, polyline, or multigeometry
    "stroke-opacity": "opacity", // the opacity of the line component of a polygon, polyline, or multigeometry
    "stroke-width": "weight", // the width of the line component of a polygon, polyline, or multigeometry
    fill: "fillColor",
    "fill-opacity": "fillOpacity",
  };

  let leafletPathStyle = {};

  for (const prop in feature.properties) {
    const style = simpleStyleSpec[prop] || null;

    if (style) {
      leafletPathStyle[style] = feature.properties[prop];
    }
  }

  return leafletPathStyle;
}

/**
 * Filters a property based on a blacklist of property names considered not required info to
 * be displayed
 *
 * @param {String} prop Property name
 * @returns {Boolean} Returns true if property is in blacklist and need to be sanitized
 */
export function filterProperty(prop) {
  const blackList = [
    "marker-size",
    "marker-symbol",
    "marker-color",
    "stroke",
    "stroke-opacity",
    "stroke-width",
    "fill",
    "fill-opacity",
    "styleHash",
    "styleUrl",
    "styleMapHash",
    "stroke-dasharray",
  ];

  return blackList.includes(prop);
}
