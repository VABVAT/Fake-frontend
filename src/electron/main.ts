import { app, BrowserWindow, screen , Menu, MenuItem} from "electron";
import path from "path";
import { isDev } from "./util.js";
import { ipcMain } from "electron";
import { getPreloadPath } from "./pathResolver.js";
import captureScreenShot from "./captureScreenShot.js";
import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";
dotenv.config();

let mainWindow: BrowserWindow | null = null;
let miniWindow: BrowserWindow | null = null;
let loadingWindow: BrowserWindow | null = null;
let loadingState = false;

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
    skipTaskbar: true,
  });

  miniWindow.loadFile(path.join(app.getAppPath(), "public/minWin.html"));
  const { width, height } = screen.getPrimaryDisplay().workAreaSize;
  miniWindow.setBounds({ x: width - 80, y: 10, width: 80, height: 80 });
  miniWindow.setContentProtection(true);

  const contextMenu = new Menu();
  contextMenu.append(
    new MenuItem({
      label: "Close App",
      click: () => {
        app.quit();
      },
    })
  );

  miniWindow.webContents.on("context-menu", () => {
    contextMenu.popup();
  });
}

function createLoadingWindow() {
  const { width, height } = screen.getPrimaryDisplay().workAreaSize;
  loadingWindow = new BrowserWindow({
    frame: false,
    transparent: true,
    alwaysOnTop: true,
    resizable: false,
    movable: false,
    skipTaskbar: true,
    webPreferences: {
      preload: path.join(app.getAppPath(), "dist-electron/preload.cjs"),
    },
  });

  loadingWindow.loadFile(path.join(app.getAppPath(), "public/loading.html"));
  loadingWindow.setBounds({ height: height, width: width-20 ,x : 0,y : 40});
  loadingWindow.setContentProtection(true);
}

function createMainWindow() {
  mainWindow = new BrowserWindow({
    width: 400,
    height: 600,
    transparent: true,
    alwaysOnTop: true,
    frame: false,
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false,
      preload: getPreloadPath(),
    },
    skipTaskbar: true,
  });

  //for building
  mainWindow.loadFile(path.join(app.getAppPath(), "/dist-react/index.html"));
  if (miniWindow) {
    const offsetX = -400;
    const offsetY = 70;
    const { x, y } = miniWindow.getBounds();
    mainWindow.setBounds({ x: x + offsetX, y: y + offsetY });
  }
  mainWindow.setContentProtection(true);
}

ipcMain.handle("minButtonClicked", () => {
  if (!loadingState) {
    if (mainWindow && miniWindow) {
      if (mainWindow.isVisible()) {
        mainWindow.hide();
      } else {
        const offsetX = -400;
        const offsetY = 70;
        const { x, y } = miniWindow.getBounds();
        mainWindow.setBounds({ x: x + offsetX, y: y + offsetY });
        mainWindow.show();
        mainWindow.setContentProtection(true);
      }
    } else {
      createMainWindow();
    }
  }
});

ipcMain.handle("send-request", async (_event, type : string) => {
  try {
    const imgBase64 = await captureScreenShot();
    const API_KEY = process.env.API_KEY || "";
    const VERIFY_ENDPOINT = process.env.VERIFY_NEWS || "";
    const genAI = new GoogleGenerativeAI(API_KEY);

    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const prompt = `You are given an image that may contain different kinds of content (e.g., email, news article, invoice, or general text).  
Your task is to extract only the content of type = ${type} and return it strictly in the following JSON format:

RequestDto {
    "info_type": string,       // Type of information extracted (e.g., "invoice", "id_card", "news_article", "business_card", etc.)
    "headline": string,        // A short descriptive headline for the extracted content
    "information": string,     // Detailed information extracted from the image
    "meta_data": string        // Any additional metadata such as date, location, reference number, etc.
}}

⚠️ Rules:
- Extract and return only the requested type: "<requested_type>".
- If the requested type is not present in the image, return all fields as empty strings "".
- Do not include anything outside the JSON object.
- Do not invent data that is not visible in the image.

`;
    const imagePart = {
      inlineData: {
        mimeType: "image/jpeg",
        data: imgBase64,
      },
    };

    const result = await model.generateContent([prompt, imagePart]);
    let response = result.response.text();
    response = response.replace(/```json|```/g, "").trim();
    const jsonRespose = JSON.parse(response);
    // const wrapped = { contents: jsonRespose };
    const wrappedJson = JSON.stringify(jsonRespose);

    const Response = await fetch(VERIFY_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: wrappedJson,
    });
    
    const data = await Response.json();
    const finalResult = JSON.stringify(data, null, 2);
    
    return finalResult;
  } catch (err) {
    console.error("Error capturing screenshot:", err);
    throw err;
  }
});

ipcMain.handle("start-loading", () => {
  if (mainWindow) {
    mainWindow.hide();
    createLoadingWindow();
    loadingState = true;
  }
});

ipcMain.handle("stop-loading", () => {
  if (loadingWindow && mainWindow && miniWindow) {
    loadingWindow.close();
    loadingWindow = null;
    loadingState = false;
    const offsetX = -400;
    const offsetY = 70;
    const { x, y } = miniWindow.getBounds();
    mainWindow.setBounds({ x: x + offsetX, y: y + offsetY });
    mainWindow.show();
    mainWindow.setContentProtection(true);
  }
});
