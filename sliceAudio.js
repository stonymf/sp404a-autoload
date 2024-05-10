const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');
const process = require('process');

function processAudio(filePath) {
    const dirName = path.join(path.dirname(filePath), path.basename(filePath, path.extname(filePath)));

    if (!fs.existsSync(dirName)) {
        fs.mkdirSync(dirName);
    }

    // Command to detect silence and get timestamps for both starts and ends
    const command = `ffmpeg -i "${filePath}" -af silencedetect=noise=-30dB:d=0.5 -f null - 2>&1 | grep "silence_" | awk '{print $1 " " $5}'`;

    exec(command, (error, stdout, stderr) => {
        if (error) {
            console.error(`exec error: ${error}`);
            return;
        }

        const results = stdout.trim().split('\n');
        const silenceStarts = [];
        const silenceEnds = [];

        results.forEach(result => {
            const parts = result.split(' ');
            if (parts[0] === 'silence_start:') {
                silenceStarts.push(parseFloat(parts[1]));
            } else if (parts[0] === 'silence_end:') {
                silenceEnds.push(parseFloat(parts[1]));
            }
        });

        let slices = [];
        let lastEnd = 0;

        // Handle case where file starts with sound
        if (silenceStarts[0] > 0) {
            slices.push({ start: 0, end: silenceStarts[0] });
        }

        // Process silence starts and ends to determine slice boundaries
        for (let i = 0; i < silenceEnds.length; i++) {
            const start = silenceEnds[i];
            const end = silenceStarts[i + 1] || undefined; // undefined will take till the end of the file
            if (end) {
                slices.push({ start: start, end: end });
            }
        }

        // Create slices based on calculated times
        slices.forEach((slice, index) => {
            const outputFile = path.join(dirName, `slice_${index}.wav`);
            const ffmpegSliceCommand = `ffmpeg -i "${filePath}" -ss ${slice.start} -to ${slice.end} -c copy "${outputFile}"`;
            exec(ffmpegSliceCommand, (error) => {
                if (error) {
                    console.error(`exec error: ${error}`);
                }
            });
        });
    });
}

const filePath = process.argv[2];
processAudio(filePath);