const fs = require('fs');
const path = require('path');
const { AudioPadInfo } = require('@uttori/audio-padinfo');
const { AudioWAV } = require('@uttori/audio-wave');
const ffmpeg = require('fluent-ffmpeg');
const ffmpegPath = require('ffmpeg-static-electron').path;

ffmpeg.setFfmpegPath(ffmpegPath.replace('app.asar', 'app.asar.unpacked'));

// const directory = '/Users/anthony/Library/CloudStorage/Dropbox/~samples/404';
const directory = process.argv[2] || '/Users/anthony/Library/CloudStorage/Dropbox/~samples/404';
const totalPads = 120; // Total number of pads

function getRandomFiles(dir, count) {
    const files = fs.readdirSync(dir).filter(file => path.extname(file).match(/.mp3|.wav|.aac/));
    const selected = [];
    while (selected.length < count && files.length > 0) {
        const index = Math.floor(Math.random() * files.length);
        selected.push(files.splice(index, 1)[0]);
    }
    return selected.map(file => path.join(dir, file));
}

function initializePads() {
    let pads = {};
    for (let i = 1; i <= totalPads; i++) {
        const bankIndex = Math.floor((i - 1) / 12);
        const padIndex = ((i - 1) % 12) + 1;
        const bankLetter = String.fromCharCode(65 + bankIndex);
        const padNumber = `${bankLetter}${padIndex.toString().padStart(7, '0')}`;
        pads[padNumber] = {
            label: padNumber,
            filename: '',
            originalSampleStart: 512,
            originalSampleEnd: 512,
            userSampleStart: 512,
            userSampleEnd: 512,
            volume: 127,
            lofi: false,
            loop: false,
            gate: true,
            reverse: false,
            format: 'WAVE',
            channels: 2,
            tempoMode: 'Off',
            originalTempo: 120,
            userTempo: 120,
            avaliable: true
        };
    }
    return pads;
}

async function convertAndAssignFiles(files, outputDir) {
    let pads = initializePads();
    for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const padNumber = Object.keys(pads)[i];
        const outputFile = path.join(outputDir, `${padNumber}.wav`);

        const match = padNumber.match(/^([A-Z])(\d+)$/);
        if (!match) {
            throw new Error('Invalid pad number format');
        }
        const bankLetter = match[1];
        const padNum = parseInt(match[2], 10);

        const bankIndex = bankLetter.charCodeAt(0) - 'A'.charCodeAt(0);
        const sampleIndex = bankIndex * 12 + (padNum - 1);
        const sampleLabel = `${bankLetter}${padNum}`;

        await new Promise((resolve, reject) => {
            ffmpeg(file)
                .audioChannels(2)
                .audioFrequency(44100)
                .format('wav')
                .on('error', (err) => {
                    console.error('Error during conversion:', err);
                    reject(err);
                })
                .on('end', () => {
                    let data = fs.readFileSync(outputFile);
                    let wav = AudioWAV.fromFile(data);

                    const oldFormat = wav.chunks.find(chunk => chunk.type === 'format');
                    const newFormat = AudioWAV.encodeFMT({
                        ...oldFormat.value,
                        extraParamSize: 0
                    });

                    const rlnd = AudioWAV.encodeRLND({
                        device: 'roifspsx',
                        sampleIndex: sampleIndex,
                        sampleLabel: sampleLabel
                    });

                    wav.chunks = [
                        { type: 'header', chunk: wav.chunks[0].chunk },
                        { type: 'format', chunk: newFormat },
                        { type: 'roland', chunk: rlnd },
                        ...wav.chunks.filter(chunk => !['header', 'format', 'roland'].includes(chunk.type))
                    ];

                    const size = wav.chunks.reduce((total, chunk) => {
                        if (['format', 'roland', 'data'].includes(chunk.type)) {
                            total += chunk.chunk.length;
                        }
                        return total;
                    }, 4);

                    const header = AudioWAV.encodeHeader({ size });
                    const parts = wav.chunks.reduce((arr, chunk) => {
                        if (['format', 'roland', 'data'].includes(chunk.type)) {
                            arr.push(Buffer.from(chunk.chunk));
                        }
                        return arr;
                    }, [header]);
                    const output = Buffer.concat(parts);

                    fs.writeFileSync(outputFile, output);

                    pads[padNumber].filename = outputFile;
                    pads[padNumber].size = output.length;
                    pads[padNumber].originalSampleStart = 512;
                    pads[padNumber].originalSampleEnd = size + 8;
                    pads[padNumber].userSampleStart = 512;
                    pads[padNumber].userSampleEnd = size + 8;
                    pads[padNumber].available = false;

                    console.log(`Header Size: ${header.length}`);
                    console.log(`Format Chunk Size: ${newFormat.length}`);
                    console.log(`Roland Chunk Size: ${rlnd.length}`);
                    console.log(`Data Chunk Size: ${wav.chunks.find(chunk => chunk.type === 'data').chunk.length}`);

                    resolve();
                })
                .save(outputFile);
        });
    }

    const parts = Object.values(pads).map(pad => AudioPadInfo.encodePad(pad));
    const padInfoData = Buffer.concat(parts);
    fs.writeFileSync(path.join(outputDir, 'PAD_INFO.BIN'), padInfoData);
}

async function main() {
    const files = getRandomFiles(directory, 120);
    await convertAndAssignFiles(files, '/Volumes/SP-404SX/ROLAND/SP-404SX/SMPL');
}

main().catch(console.error);
