const { app, BrowserWindow, Menu, ipcMain, dialog } = require('electron');
const path = require('path');
const fs = require('fs');

let mainWindow = null;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1280,
    height: 800,
    minWidth: 1024,
    minHeight: 600,
    icon: path.join(__dirname, 'assets', 'icon.png'),
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js')
    },
    backgroundColor: '#0f0f1a',
    show: false
  });

  // Tampilkan window setelah siap
  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
  });

  // Load file index.html dari folder src
  mainWindow.loadFile(path.join(__dirname, 'src', 'index.html'));

  // ===== MENU BAR =====
  const menuTemplate = [
    {
      label: 'HR Pro',
      submenu: [
        {
          label: 'Tentang HR Pro',
          click: () => {
            dialog.showMessageBox(mainWindow, {
              type: 'info',
              title: 'Tentang HR Pro',
              message: 'HR Pro - Aplikasi Manajemen Karyawan & Izin',
              detail: `Versi: 2.0.0\n\n© 2026 Hatori Group\n\nAplikasi ini menggunakan:\n- Electron\n- Supabase Database\n- Chart.js\n- Font Awesome`,
              buttons: ['OK']
            });
          }
        },
        { type: 'separator' },
        {
          label: 'Keluar',
          accelerator: 'CmdOrCtrl+Q',
          click: () => app.quit()
        }
      ]
    },
    {
      label: 'File',
      submenu: [
        {
          label: 'Refresh',
          accelerator: 'CmdOrCtrl+R',
          click: () => mainWindow.reload()
        },
        {
          label: 'Developer Tools',
          accelerator: 'CmdOrCtrl+Shift+I',
          click: () => mainWindow.webContents.openDevTools()
        }
      ]
    },
    {
      label: 'View',
      submenu: [
        {
          label: 'Full Screen',
          accelerator: 'F11',
          click: () => mainWindow.setFullScreen(!mainWindow.isFullScreen())
        },
        {
          label: 'Zoom In',
          accelerator: 'CmdOrCtrl+=',
          click: () => mainWindow.webContents.setZoomLevel(mainWindow.webContents.getZoomLevel() + 0.5)
        },
        {
          label: 'Zoom Out',
          accelerator: 'CmdOrCtrl+-',
          click: () => mainWindow.webContents.setZoomLevel(mainWindow.webContents.getZoomLevel() - 0.5)
        },
        {
          label: 'Reset Zoom',
          accelerator: 'CmdOrCtrl+0',
          click: () => mainWindow.webContents.setZoomLevel(0)
        }
      ]
    }
  ];

  const menu = Menu.buildFromTemplate(menuTemplate);
  Menu.setApplicationMenu(menu);

  // ===== HANDLE WINDOW CLOSE =====
  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  mainWindow.on('close', (e) => {
    if (mainWindow) {
      const choice = dialog.showMessageBoxSync(mainWindow, {
        type: 'question',
        buttons: ['Ya, Keluar', 'Batal'],
        defaultId: 1,
        title: 'Konfirmasi Keluar',
        message: 'Apakah Anda yakin ingin keluar dari HR Pro?'
      });
      if (choice === 1) {
        e.preventDefault();
      }
    }
  });
}

// ===== APP EVENTS =====
app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// ===== LOG UNTUK DEBUG =====
console.log('🚀 HR Pro Desktop starting...');
console.log(`📁 App path: ${app.getAppPath()}`);
console.log(`📁 User data: ${app.getPath('userData')}`);