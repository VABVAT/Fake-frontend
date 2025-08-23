import { app, BrowserWindow, screen } from "electron";
import path from "path";
import { isDev } from "./util.js";
import { ipcMain } from "electron";
import { getPreloadPath } from "./pathResolver.js";
import captureScreenShot from "./captureScreenShot.js";
import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";
import { wrap } from "module";
dotenv.config();


let mainWindow: BrowserWindow | null = null;
let miniWindow: BrowserWindow | null = null;


app.on("ready", createMiniWindow);

function createMiniWindow() {
  miniWindow = new BrowserWindow({
    width: 80,
    height: 80,
    frame: false,
    transparent: true,
    alwaysOnTop: true,
    resizable: false,
    movable: true,
    webPreferences: {
      preload: path.join(app.getAppPath(), "dist-electron/preload.cjs"),
    },
  });


  miniWindow.loadFile(path.join(app.getAppPath(), "public/minWin.html"));
  const { width, height } = screen.getPrimaryDisplay().workAreaSize;
  miniWindow.setBounds({ x: width-80, y: 10, width: 80, height: 80 });
  miniWindow.setContentProtection(true);
}

function createMainWindow() {
  mainWindow = new BrowserWindow({

    width: 800,
    height: 600,
    transparent: true,
    frame: false,
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false,
      preload: getPreloadPath(),
    },
  });

  if (isDev()) {
    mainWindow.loadURL("http://localhost:5173/");
  } else {
    mainWindow.loadFile(path.join(app.getAppPath(), "/dist-react/index.html"));
  }
  if(miniWindow){
    const offsetX = -850;
    const offsetY = 90;
    const {x , y} = miniWindow.getBounds();
    mainWindow.setBounds({x : x + offsetX, y : y + offsetY});
  }
  mainWindow.setContentProtection(true);
  mainWindow.webContents.openDevTools();
}

ipcMain.handle("minButtonClicked", () => {
  if (mainWindow && miniWindow) {
    if(mainWindow.isVisible()){
      mainWindow.hide();
    }
    else{
      const offsetX = -850;
      const offsetY = 90;
      const {x, y} = miniWindow.getBounds();
      mainWindow.setBounds({x : x + offsetX, y : y + offsetY});
      mainWindow.show();
      mainWindow.setContentProtection(true);
    }
  }
  else{
    createMainWindow();
  }
});

ipcMain.handle("send-request", async ()=>{
  try{
    const imgBase64 = await captureScreenShot();
    const API_KEY =  process.env.API_KEY || "" ;
    const genAI = new GoogleGenerativeAI(API_KEY);

    const model = genAI.getGenerativeModel({model : "gemini-2.5-flash"});

    const prompt = `You are an AI that extracts structured information from an image.I have provided you with a base64 encoded image.Your task is to analyze the image and respond ONLY in valid JSON.  If there are multiple distinct contents on the page (for example, multiple articles,sections, or items), return a JSON array of objects. Each object must strictly follow the RequestDto format:

RequestDto {
    "info_type": string,       // Type of information extracted (e.g., "invoice", "id_card", "news_article", "business_card", etc.)
    "headline": string,        // A short descriptive headline for the extracted content
    "information": string,     // Detailed information extracted from the image
    "meta_data": string        // Any additional metadata such as date, location, reference number, etc.
}

⚠️ Rules:
- Always return an array (even if only one object is found).
- Do not include explanations, comments, or extra text outside the JSON.
- Ensure the JSON is syntactically valid.
`;
    const imagePart = {
      inlineData: {
        mimeType: "image/jpeg",
        data: imgBase64,
      },
    };

    const result = await model.generateContent([prompt, imagePart]);
    let response = await result.response.text();
    response = response.replace(/```json|```/g, "").trim();
    const jsonRespose = JSON.parse(response);
    const wrapped = { contents: jsonRespose };
    const wrappedJson = JSON.stringify(wrapped, null, 2);

    return wrappedJson;
  }
  catch(err){
    console.error("Error capturing screenshot:", err);
    throw err;
  }
})
