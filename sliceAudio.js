const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');
const process = require('process');

function processAudio(filePath) {
    const dirName = path.join(path.dirname(filePath), path.basename(filePath, path.extname(filePath)));

    if (!fs.existsSync(dirName)) {
        fs.mkdirSync(dirName);
    }

    // Command to detect silence and get timestamps
    const command = `ffmpeg -i "${filePath}" -af silencedetect=noise=-30dB:d=0.5 -f null - 2>&1 | grep "silence_start" | awk '{print $5}'`;

    exec(command, (error, stdout, stderr) => {
        if (error) {
            console.error(`exec error: ${error}`);
            return;
        }

        const silenceStarts = stdout.trim().split('\n').map(parseFloat);
        let lastEnd = 0;
        const buffer = 0.1; // 100 milliseconds buffer

        silenceStarts.forEach((silenceStart, index) => {
            const start = Math.max(0, lastEnd - buffer); // Ensure start is not negative
            const end = Math.max(0, silenceStart + buffer); // Add buffer to the end of the sound segment
            const outputFile = path.join(dirName, `slice_${index}.wav`);
            const ffmpegSliceCommand = `ffmpeg -i "${filePath}" -ss ${start} -to ${end} -c copy "${outputFile}"`;
            exec(ffmpegSliceCommand, (error) => {
                if (error) {
                    console.error(`exec error: ${error}`);
                }
            });
            lastEnd = silenceStart; // Update lastEnd to the start of the current silence
        });

        // Handle the last segment after the final silence
        const finalStart = lastEnd - buffer;
        const outputFile = path.join(dirName, `slice_${silenceStarts.length}.wav`);
        const ffmpegSliceCommand = `ffmpeg -i "${filePath}" -ss ${finalStart} -c copy "${outputFile}"`;
        exec(ffmpegSliceCommand, (error) => {
            if (error) {
                console.error(`exec error: ${error}`);
            }
        });
    });
}

const filePath = process.argv[2];
processAudio(filePath);