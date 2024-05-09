# Super Pads / スーパーパッド

Super Pads helps manage samples on a SP-404SX.

![Super Pads](https://raw.githubusercontent.com/MatthewCallis/super-pads/master/example.png)

## Latest Version: v1.2.1 (2021-07-31)

- Update to Electron 13 and rebuild.
- Fix issues with overwriting samples made on device, this requires reading from the card every time unfortunately.
- Added Waveform Preview, not great but will be better in the future
- Added Audio preview of pads with Play ▶️ & Pause ⏸ buttons

This is the last version with this UI. The next version will have all the pad banks available at once. Check the [releases page](https://github.com/MatthewCallis/super-pads/releases) for the latest version.

## How to Use

1. Open the app
1. Select your SD Card root directory by clicking `Pick Folder`
1. Select the bank with the drop down and click on the pad you want to edit
1. Adjust parameters for existing pads, remove pads, or add pads with pick files / drag & drop files to be converted to Wave with [FFmpeg](https://ffmpeg.org/) behind the scenes.
1. Click `Write SD Card` to save your changed and convert files.
1. If any error comes up you will see it above the pad matrix, click it to dismiss.
1. If you think something should be working but it not, please [file an issue](https://github.com/MatthewCallis/super-pads/issues) or [tweet at me](https://twitter.com/superfamicom/status/1343989480160522240).

### Video Tutorials

Some super kind folks have made videos showing how to use Super Pads:

- [Super Pads: a New Program for Loading Sounds Onto Your SP-404SX](https://www.youtube.com/watch?v=DIjpT0F07uU)
- [Short Super Pads Tutorial by lilblizzard97](https://www.tiktok.com/@lilblizzard97/video/6933257457384819973) / [Mirror](https://streamable.com/k0yun0)

## Tempo Mode

`Tempo Mode` is another name for the `Time Modify` / `Time Adjust` settings when adjusting the BPM, where turning the knob all the way to the left is Off `oFF`, so the sample will play at its original length.

Turning the knob all the way to the right is Pattern `Ptn` and will set the sample to play at the tempo of the pattern. The BPM can be between `40` and `200`, and `User` will use the custom value.

The BPM can only be adjusted to any value from 0.5 to ~1.3 times the original BPM on the machine.

See page 30 of the manual.

## macOS Tips

To disable and remove the dot files from your SD Cards and free up some space, run these commands in your Terminal of choice where `<FS NAME>` is your SD Card, by default on the name of card that came with the SP-404SX is `SP-404SX`, so you would access it like `/Volumes/SP-404SX/`:

```sh
# Prevent the OS from using DS files on USB drives
sudo defaults write com.apple.desktopservices DSDontWriteUSBStores -bool true

# Disable Spotlifht from index this drive
sudo mdutil -i off /Volumes/<FS NAME>

# Remove existing cruft
cd /Volumes/<FS NAME>
sudo rm -rf .{DS_Store,fseventsd,Spotlight-V*,Trashes}

# If this has been used on a Windows OS, you can remove the `System Volume Information` as well
sudo rm -rf System\ Volume\ Information/
```

## Notes

Super Pads makes use of two libraries I wrote to play with my own SP-404SX, [uttori-audio-padinfo](https://github.com/uttori/uttori-audio-padinfo) for parsing and writing the `PAD_INFO.BIN` file and [uttori-audio-wave](https://github.com/uttori/uttori-audio-wave) for adding the `RLND` header to the Wave files out of FFmpeg, and an Electron wrapper to make it easier to use.

_Note:_ I do not have an OG SP-404 or SP-404A but this could easily support those if someone is willing to help debug issues.

If you would like to suggest something or have found an issue please file a bug or message me on Twitter [@superfamicom](https://twitter.com/superfamicom).

If you would like to support development, listen to my songs, follow me, or playlist my songs 😏

- [Spotify](https://open.spotify.com/artist/0FYTwSXr4Q7Ujml4wW7Y97)
- [SoundCloud](https://soundcloud.com/superfamicom)
- [Bandcamp](https://matthewcallis.bandcamp.com/)
- [Audius](https://audius.co/superfamicom)

## Roadmap

Features I have planned to work on as time permits, roughly in order:

- Investigate alternatives to Electron like [Tauri](https://github.com/tauri-apps/tauri).
- Copy & Paste between pads to move one pad to another or copy one pad to another.
- Saved Sets for easier and fast switching of arrangements.
- Preview Sounds
- Automatic Updates

## Change Log

## [1.2.0](https://github.com/MatthewCallis/super-pads) - 2020-04-04

- 🧰 Update to Electron 12 and rebuild.
- 🧰 More fixes for importing some even weirder WAV files.

## [1.1.1](https://github.com/MatthewCallis/super-pads) - 2020-01-02

- 🧰 Forgot to bump the version number in the previous release 🙃

## [1.1.0](https://github.com/MatthewCallis/super-pads) - 2020-01-01

- 🧰 Fix issue with some errant WAV files preventing SD cards from being read.

## [1.0.0](https://github.com/MatthewCallis/super-pads) - 2020-12-28

- 🧰 Released

## Contributors

- [Matthew Callis](https://github.com/MatthewCallis)

## Thanks

- [Paul Battley](https://github.com/threedaymonk) - His [Roland SP-404SX sample file format](https://gist.github.com/threedaymonk/701ca30e5d363caa288986ad972ab3e0) was a huge help.
- [Colin Espinas](https://codepen.io/Call_in/pen/pMYGbZ) - Weather App Design was the original basis for the app layout and made me think of making the app.
- [Himalaya Singh](https://codepen.io/himalayasingh/pen/EdVzNL) - The beautiful switches you see in the app.
- [Envato Tuts+](https://codepen.io/tutsplus/details/WROvdG) -The simple and effective tooltips.
- [David A.](https://codepen.io/meodai/pen/jVpwbP) - The trippy perin loading screen.
- [alphardex](https://codepen.io/alphardex) - The rainbow drop area background.

![Super Pads Loading Screen](https://raw.githubusercontent.com/MatthewCallis/super-pads/master/loading.png)

## License

- [MIT](LICENSE)
