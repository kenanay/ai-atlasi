#!/usr/bin/env node

/**
 * AI Atlası Otomatik Başlatma Script'i (Node.js)
 * Platform bağımsız, port yönetimi ve otomatik açılma
 */

const { spawn, exec } = require('child_process');
const readline = require('readline');
const os = require('os');
const net = require('net');
const path = require('path');
const fs = require('fs');

// Renkli çıktı
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

// Banner
function showBanner() {
  log('\n╔═══════════════════════════════════════════════════════╗', 'cyan');
  log('║                                                       ║', 'cyan');
  log('║              🚀 AI ATLASI 🚀                         ║', 'cyan');
  log('║      Yapay Zeka Öğrenme ve Deney Laboratuvarı       ║', 'cyan');
  log('║                                                       ║', 'cyan');
  log('╚═══════════════════════════════════════════════════════╝', 'cyan');
  console.log('');
}

// Port kontrolü
function checkPort(port) {
  return new Promise((resolve) => {
    const server = net.createServer();
    
    server.once('error', (err) => {
      if (err.code === 'EADDRINUSE') {
        resolve(false); // Port kulımda
      } else {
        resolve(true);
      }
    });
    
    server.once('listening', () => {
      server.close();
      resolve(true); // Port boş
    });
    
    server.listen(port);
  });
}

// Boş port bul
async function findAvailablePort(startPort, maxAttempts = 10) {
  for (let i = 0; i < maxAttempts; i++) {
    const port = startPort + i;
    const isAvailable = await checkPort(port);
    if (isAvailable) {
      return port;
    }
  }
  return null;
}

// Port kullanan süreci bul (sadece bilgi için)
function getPortProcess(port) {
  return new Promise((resolve) => {
    const isWindows = os.platform() === 'win32';
    const command = isWindows
      ? `netstat -ano | findstr :${port}`
      : `lsof -i :${port} -t`;
    
    exec(command, (error, stdout) => {
      if (error || !stdout) {
        resolve(null);
        return;
      }
      
      if (isWindows) {
        const lines = stdout.trim().split('\n');
        const pid = lines[0]?.trim().split(/\s+/).pop();
        resolve(pid ? `PID ${pid}` : null);
      } else {
        const pid = stdout.trim();
        resolve(pid ? `PID ${pid}` : null);
      }
    });
  });
}

// Kullanıcıdan input al
function askQuestion(query) {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  
  return new Promise((resolve) => {
    rl.question(query, (answer) => {
      rl.close();
      resolve(answer.trim());
    });
  });
}

// Tarayıcıyı aç (cache bypass ile)
function openBrowser(url) {
  const isWindows = os.platform() === 'win32';
  const isMac = os.platform() === 'darwin';
  const isLinux = os.platform() === 'linux';
  
  // Timestamp ekleyerek cache bypass
  const cacheBustUrl = `${url}?_ts=${Date.now()}`;
  
  let command;
  if (isWindows) {
    // Chrome için cache bypass
    command = `start chrome --disable-cache "${cacheBustUrl}" || start "${cacheBustUrl}"`;
  } else if (isMac) {
    // macOS için önce Chrome dene, yoksa default browser
    command = `open -a "Google Chrome" --args --disable-cache "${cacheBustUrl}" 2>/dev/null || open "${cacheBustUrl}"`;
  } else if (isLinux) {
    // Linux için Chrome dene
    command = `google-chrome --disable-cache "${cacheBustUrl}" 2>/dev/null || xdg-open "${cacheBustUrl}"`;
  }
  
  if (command) {
    setTimeout(() => {
      exec(command, (error) => {
        if (error) {
          log(`⚠️  Tarayıcı otomatik açılamadı. Manuel olarak açın: ${url}`, 'yellow');
        } else {
          log('🌐 Tarayıcı açıldı (cache temizlendi)', 'green');
        }
      });
    }, 2000);
  }
}

// Network IP'sini al
function getNetworkIP() {
  const interfaces = os.networkInterfaces();
  for (const name of Object.keys(interfaces)) {
    for (const iface of interfaces[name]) {
      if (iface.family === 'IPv4' && !iface.internal) {
        return iface.address;
      }
    }
  }
  return 'localhost';
}

// Node modüllerini kontrol et
function checkNodeModules() {
  const nodeModulesPath = path.join(process.cwd(), 'node_modules');
  return fs.existsSync(nodeModulesPath);
}

// Bağımlılıkları yükle
function installDependencies() {
  return new Promise((resolve, reject) => {
    log('📦 Bağımlılıklar yükleniyor...', 'yellow');
    
    const npm = spawn('npm', ['install'], {
      stdio: 'inherit',
      shell: true,
    });
    
    npm.on('close', (code) => {
      if (code === 0) {
        log('✓ Bağımlılıklar yüklendi\n', 'green');
        resolve();
      } else {
        reject(new Error('Bağımlılıklar yüklenemedi'));
      }
    });
  });
}

// Ana fonksiyon
async function main() {
  showBanner();
  
  const args = process.argv.slice(2);
  let port = parseInt(args[0]) || 3000;
  
  log('🚀 AI Atlası başlatılıyor...', 'blue');
  console.log('');
  
  // Node.js kontrolü (zaten çalışıyor ama versiyon göster)
  log(`✓ Node.js ${process.version} kullanılıyor`, 'green');
  
  // npm kontrolü
  try {
    await new Promise((resolve, reject) => {
      exec('npm -v', (error, stdout) => {
        if (error) reject(error);
        else {
          log(`✓ npm ${stdout.trim()} kullanılıyor`, 'green');
          resolve();
        }
      });
    });
  } catch {
    log('✗ npm bulunamadı!', 'red');
    process.exit(1);
  }
  
  console.log('');
  
  // Bağımlılık kontrolü
  if (!checkNodeModules()) {
    log('⚠️  node_modules bulunamadı', 'yellow');
    
    // Auto mode için otomatik yükle
    if (args.includes('--auto') || args.includes('-y')) {
      try {
        await installDependencies();
      } catch {
        log(`✗ Hata: ${error.message}`, 'red');
        process.exit(1);
      }
    } else {
      const answer = await askQuestion('Bağımlılıkları yüklemek ister misiniz? (Y/n): ');
      
      if (answer.toLowerCase() !== 'n') {
        try {
          await installDependencies();
        } catch {
          log(`✗ Hata: ${error.message}`, 'red');
          process.exit(1);
        }
      } else {
        log('İptal edildi.', 'yellow');
        process.exit(0);
      }
    }
  }
  
  // Port kontrolü
  const isPortAvailable = await checkPort(port);
  
  if (!isPortAvailable) {
    log(`⚠️  Port ${port} zaten kullanımda!`, 'yellow');
    
    const processInfo = await getPortProcess(port);
    if (processInfo) {
      log(`   Kullanan: ${processInfo}`, 'yellow');
    }
    
    console.log('');
    log('Ne yapmak istersiniz?', 'cyan');
    console.log('  1) Alternatif port kullan (otomatik bul)');
    console.log('  2) Manuel port gir');
    console.log('  3) İptal');
    console.log('');
    
    const choice = await askQuestion('Seçiminiz (1-3): ');
    
    switch (choice) {
      case '1':
        const newPort = await findAvailablePort(port);
        if (newPort) {
          port = newPort;
          log(`✓ Port ${port} kullanılacak`, 'green');
        } else {
          log('✗ Boş port bulunamadı!', 'red');
          process.exit(1);
        }
        break;
      
      case '2':
        const manualPort = await askQuestion('Port numarası: ');
        const portNum = parseInt(manualPort);
        if (isNaN(portNum) || portNum < 1024 || portNum > 65535) {
          log('✗ Geçersiz port numarası!', 'red');
          process.exit(1);
        }
        port = portNum;
        break;
      
      case '3':
        log('İptal edildi.', 'yellow');
        process.exit(0);
        break;
      
      default:
        log('✗ Geçersiz seçim!', 'red');
        process.exit(1);
    }
    
    console.log('');
  }
  
  // .next temizlik (cache bypass için)
  const nextDir = path.join(process.cwd(), '.next');
  if (fs.existsSync(nextDir)) {
    // Auto mode için her zaman temizle (cache problemi önleme)
    if (args.includes('--auto') || args.includes('-y')) {
      log('🧹 .next dizini temizleniyor (cache temizliği)...', 'yellow');
      fs.rmSync(nextDir, { recursive: true, force: true });
      log('✓ Cache temizlendi', 'green');
    } else {
      const cleanBuild = await askQuestion('Temiz build yapmak ister misiniz? (y/N): ');
      if (cleanBuild.toLowerCase() === 'y') {
        log('🧹 .next dizini temizleniyor...', 'yellow');
        fs.rmSync(nextDir, { recursive: true, force: true });
        log('✓ Temizlendi', 'green');
      }
    }
    console.log('');
  }
  
  // Sunucu başlat
  log('═══════════════════════════════════════════════════════', 'magenta');
  log('🚀 Geliştirme sunucusu başlatılıyor...', 'green');
  log('═══════════════════════════════════════════════════════', 'magenta');
  console.log('');
  
  const networkIP = getNetworkIP();
  log('📍 Sunucu Adresleri:', 'cyan');
  log(`   ➜ Local:   http://localhost:${port}`, 'green');
  log(`   ➜ Network: http://${networkIP}:${port}`, 'green');
  console.log('');
  
  log('💡 İpuçları:', 'yellow');
  console.log('   • Tarayıcınızda otomatik açılacak');
  console.log('   • Durdurmak için: Ctrl+C');
  console.log('   • Kod değişiklikleri otomatik yüklenir (hot reload)');
  console.log('');
  
  log('═══════════════════════════════════════════════════════', 'magenta');
  console.log('');
  
  // Tarayıcıyı aç
  openBrowser(`http://localhost:${port}`);
  
  // Next.js dev sunucusunu başlat
  const devProcess = spawn('npm', ['run', 'dev'], {
    stdio: 'inherit',
    shell: true,
    env: { ...process.env, PORT: port.toString() },
  });
  
  // Temizlik
  process.on('SIGINT', () => {
    console.log('');
    log('🛑 Sunucu durduruluyor...', 'yellow');
    devProcess.kill();
    log('✓ Güle güle!', 'green');
    process.exit(0);
  });
  
  devProcess.on('close', (code) => {
    if (code !== 0) {
      log(`\n✗ Sunucu hata ile kapandı (kod: ${code})`, 'red');
    }
    process.exit(code);
  });
}

// Script'i çalıştır
main().catch((error) => {
  log(`\n✗ Hata: ${error.message}`, 'red');
  process.exit(1);
});
