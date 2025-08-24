import electron from 'electron';
import { send } from 'vite';

electron.contextBridge.exposeInMainWorld('electronAPI', {
    ping: async () => {
        return await electron.ipcRenderer.invoke('ping');
    },
    minButtonClicked: async () => {
        return await electron.ipcRenderer.invoke('minButtonClicked');
    },
    sendRequest: async (type : string)=> {
        return await electron.ipcRenderer.invoke('send-request', type);
    },
    startLoading: async () => {
        electron.ipcRenderer.invoke('start-loading');
    },
    stopLoading: async () => {
        electron.ipcRenderer.invoke('stop-loading');
    }
});