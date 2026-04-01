document.addEventListener("DOMContentLoaded", () => {
    
  // === 生成动态面包屑导航 ===
  const initBreadcrumbs = () => {
    const breadcrumbs = document.getElementById('breadcrumbs');
    if (!breadcrumbs) return;

    const paths = decodeURI(window.location.pathname).split('/').filter(Boolean);
    let currentUrl = '/';
    let html = `<li class="breadcrumb-item"><a href="/"><i class="fa-solid fa-house"></i> Home</a></li>`;

    paths.forEach((path, index) => {
      currentUrl += path + '/';
      if (index === paths.length - 1) {
        html += `<li class="breadcrumb-item active" style="color: var(--primary-color); text-shadow: var(--text-glow-primary);">${path}</li>`;
      } else {
        html += `<li class="breadcrumb-item"><a href="${currentUrl}">${path}</a></li>`;
      }
    });
    breadcrumbs.innerHTML = html;
  };

  // === 智能文件列表处理 (注入现代图标 & GLightbox 标签) ===
  const initList = () => {
    const rows = document.querySelectorAll('#list tbody tr');
    
    rows.forEach(row => {
      const link = row.querySelector('a');
      if (!link) return;

      const fileName = link.textContent.trim();
      const isDir = fileName.endsWith('/');
      let iconClass = 'fa-solid fa-file';

      if (isDir) {
        iconClass = 'fa-solid fa-folder-open';
      } else {
        const ext = fileName.split('.').pop().toLowerCase();
        const iconMap = {
          'pdf': 'fa-file-pdf',
          'zip': 'fa-file-zipper', 'rar': 'fa-file-zipper', '7z': 'fa-file-zipper', 'tar': 'fa-file-zipper', 'gz': 'fa-file-zipper',
          'mp4': 'fa-film', 'mkv': 'fa-film', 'avi': 'fa-film', 'webm': 'fa-film',
          'mp3': 'fa-music', 'flac': 'fa-music', 'wav': 'fa-music',
          'jpg': 'fa-image', 'jpeg': 'fa-image', 'png': 'fa-image', 'gif': 'fa-image', 'svg': 'fa-image', 'webp': 'fa-image',
          'js': 'fa-file-code', 'css': 'fa-file-code', 'html': 'fa-file-code', 'json': 'fa-file-code', 'py': 'fa-file-code',
          'txt': 'fa-file-lines', 'md': 'fa-file-lines', 'log': 'fa-file-lines', 'conf': 'fa-file-lines'
        };
        if (iconMap[ext]) iconClass = `fa-solid ${iconMap[ext]}`;
      }

      link.innerHTML = `<i class="${iconClass}" style="margin-right: 10px; opacity: 0.8;"></i>${fileName}`;

      // 给图片贴上 data-glightbox 标签
      const imgExts = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'];
      if (!isDir && imgExts.includes(fileName.split('.').pop().toLowerCase())) {
        link.setAttribute('data-glightbox', `title: ${fileName}`);
      }
    });
  };

// === 跟随系统自动切换 + 手动覆盖记忆 ===
  const initThemeToggle = () => {
    const toggleBtn = document.getElementById('theme-toggle');
    const themeIcon = document.getElementById('theme-icon');
    
    if (!toggleBtn || !themeIcon) return;

    // 1. 初始化图标状态
    const isCurrentlyLight = document.documentElement.getAttribute('data-theme') === 'light';
    if (isCurrentlyLight) {
      themeIcon.classList.replace('fa-moon', 'fa-sun');
    }

    // 2. 监听用户的手动点击事件
    toggleBtn.addEventListener('click', () => {
      const isLight = document.documentElement.getAttribute('data-theme') === 'light';
      
      if (isLight) {
        // 切换到夜晚，并强制记忆
        document.documentElement.removeAttribute('data-theme');
        localStorage.setItem('theme', 'dark');
        themeIcon.classList.replace('fa-sun', 'fa-moon');
      } else {
        // 切换到白天，并强制记忆
        document.documentElement.setAttribute('data-theme', 'light');
        localStorage.setItem('theme', 'light');
        themeIcon.classList.replace('fa-moon', 'fa-sun');
      }
    });

    // 3. 监听操作系统/浏览器的深浅色模式实时变化
    const mediaQuery = window.matchMedia('(prefers-color-scheme: light)');
    mediaQuery.addEventListener('change', (e) => {
      if (!localStorage.getItem('theme')) {
        if (e.matches) {
          document.documentElement.setAttribute('data-theme', 'light');
          themeIcon.classList.replace('fa-moon', 'fa-sun');
        } else {
          document.documentElement.removeAttribute('data-theme');
          themeIcon.classList.replace('fa-sun', 'fa-moon');
        }
      }
    });
  };

  // ==========================================
  // === 统一执行区 ===
  // ==========================================
  
  initBreadcrumbs();
  initList();
  initThemeToggle();

  if (typeof GLightbox !== 'undefined') {
    const lightbox = GLightbox({
        selector: '[data-glightbox]',
        touchNavigation: true,
        loop: true,
        zoomable: true,
        openEffect: 'zoom',
        closeEffect: 'fade'
    });

    lightbox.on('open', () => {
        if (document.activeElement) {
            document.activeElement.blur();
        }
    });
  }

});