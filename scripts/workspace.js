function initWorkspaceShell() {
    const api = window.WorkspacePlatforms;
    const frame = document.querySelector('#editorViewport');
    const navItems = Array.from(document.querySelectorAll('[data-platform-id]'));
    const sidebar = document.querySelector('#workspaceSidebar');
    const toggleBtn = document.querySelector('#sidebarToggleBtn');
    const closeBtn = document.querySelector('#sidebarCloseBtn');
    const overlay = document.querySelector('#sidebarOverlay');

    const openSidebar = () => {
        if (!sidebar || !overlay) return;
        sidebar.classList.add('is-open');
        overlay.classList.add('is-visible');
        document.body.style.overflow = 'hidden';
    };

    const closeSidebar = () => {
        if (!sidebar || !overlay) return;
        sidebar.classList.remove('is-open');
        overlay.classList.remove('is-visible');
        document.body.style.overflow = '';
    };

    if (toggleBtn) {
        toggleBtn.addEventListener('click', openSidebar);
    }

    if (closeBtn) {
        closeBtn.addEventListener('click', closeSidebar);
    }

    if (overlay) {
        overlay.addEventListener('click', closeSidebar);
    }

    if (!api || !frame || !navItems.length) {
        return;
    }

    const setActivePlatform = (platformId) => {
        const platform = api.getPlatformById(platformId);
        frame.src = platform.page;

        navItems.forEach((item) => {
            const isActive = item.dataset.platformId === platform.id;
            item.classList.toggle('is-active', isActive);
            item.setAttribute('aria-pressed', isActive ? 'true' : 'false');
        });

        closeSidebar();
    };

    navItems.forEach((item) => {
        item.addEventListener('click', () => {
            setActivePlatform(item.dataset.platformId || api.getDefaultPlatformId());
        });
    });

    setActivePlatform(api.getDefaultPlatformId());
}

initWorkspaceShell();
