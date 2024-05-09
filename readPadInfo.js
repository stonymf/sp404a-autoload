const fs = require('fs');
const path = require('path');
const { AudioPadInfo } = require('@uttori/audio-padinfo');

const padInfoPath = "/Users/anthony/Desktop/newsamples/PAD_INFO.BIN";
const outputPath = "/Users/anthony/Desktop/newsamples/PADS.txt";

// Function to read and parse PAD_INFO.BIN using AudioPadInfo.fromFile
function readPadInfo(filePath) {
  try {
    const fileBuffer = fs.readFileSync(filePath);
    const padInfo = AudioPadInfo.fromFile(fileBuffer);
    if (padInfo && padInfo.pads) {
      return padInfo.pads;
    } else {
      console.error('No pads found or failed to parse pads.');
      return null;
    }
  } catch (error) {
    console.error('Failed to read or parse PAD_INFO.BIN:', error);
    return null;
  }
}

// Function to write pad data to a text file
function writePadsToFile(pads, filePath) {
  const padData = pads.map(pad => JSON.stringify(pad, null, 2)).join('\n');
  fs.writeFileSync(filePath, padData);
}

// Usage
const pads = readPadInfo(padInfoPath);
if (pads) {
  console.log('PAD Info:', pads);
  writePadsToFile(pads, outputPath);
  console.log(`PAD info written to ${outputPath}`);
} else {
  console.log('No PAD info could be read.');
}