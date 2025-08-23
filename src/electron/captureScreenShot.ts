import { desktopCapturer, screen } from "electron";

export default async function captureScreenShot(){
    const primaryDisplay = screen.getPrimaryDisplay();
    const { width, height } = primaryDisplay.size;

    const options: Electron.SourcesOptions = {
        types : ["screen"],
        thumbnailSize: { width, height },
    };

    const sources = await desktopCapturer.getSources(options);
    const primarySource = sources[0];

    if (!primarySource) {
        throw new Error("No primary display source found.");
    }

    const imageBuffer = primarySource.thumbnail.toPNG();
    return imageBuffer.toString("base64")
}