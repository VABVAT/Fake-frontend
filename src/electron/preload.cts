import electron from 'electron';
import { send } from 'vite';

electron.contextBridge.exposeInMainWorld('electronAPI', {
    ping: async () => {
        return await electron.ipcRenderer.invoke('ping');
    },
    minButtonClicked: async () => {
        return await electron.ipcRenderer.invoke('minButtonClicked');
    },
    sendRequest: async ()=> {
        return await electron.ipcRenderer.invoke('send-request');
    }
});