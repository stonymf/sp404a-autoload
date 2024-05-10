const fs = require('fs');
const { AudioWAV } = require('@uttori/audio-wave');

function readWavHeader(filePath) {
  try {
    const data = fs.readFileSync(filePath);
    const wav = AudioWAV.fromFile(data);
    if (wav && wav.chunks) {
      console.log('Chunks found:', wav.chunks.map(chunk => chunk.type).join(', '));
      const fmtChunk = wav.chunks.find(chunk => chunk.type === 'format');
      if (fmtChunk) {
        console.log('Format Chunk:', fmtChunk);
        console.log('Format:', fmtChunk.format);
        console.log('Channels:', fmtChunk.channels);
        console.log('Sample Rate:', fmtChunk.sampleRate);
        console.log('Byte Rate:', fmtChunk.byteRate);
        console.log('Block Align:', fmtChunk.blockAlign);
        console.log('Bits Per Sample:', fmtChunk.bitsPerSample);
      } else {
        console.log('Format chunk not found.');
      }
      const rolandChunk = wav.chunks.find(chunk => chunk.type === 'roland');
      if (rolandChunk) {
        console.log('Roland Chunk:', rolandChunk);
        // Assuming the sampleIndex is at a specific byte offset within the roland chunk
        // You will need to adjust the offset based on the actual structure of the roland chunk // Example: reading the first byte as sample index
      } else {
        console.log('Roland chunk not found.');
      }
    } else {
      console.log('Failed to parse WAV file or no chunks found.');
    }
  } catch (error) {
    console.error('Error reading WAV file:', error);
  }
}

const filePath = '/Users/anthony/Desktop/newsamples/F0000009.WAV';
readWavHeader(filePath);
