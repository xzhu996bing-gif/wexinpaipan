(function (root, factory) {
    const api = factory();

    if (typeof module === 'object' && module.exports) {
        module.exports = api;
    }

    if (root) {
        root.WorkspacePlatforms = api;
    }
})(typeof globalThis !== 'undefined' ? globalThis : this, () => {
    const WORKSPACE_PLATFORMS = [
        {
            id: 'wechat',
            label: '微信编辑器',
            page: 'Markdown编辑器_蓝色主题 - Copy.html'
        },
        {
            id: 'xiaohongshu',
            label: '小红书编辑器',
            page: 'xiaohongshu-placeholder.html'
        }
    ];

    function getDefaultPlatformId() {
        return WORKSPACE_PLATFORMS[0].id;
    }

    function getPlatformById(id) {
        return WORKSPACE_PLATFORMS.find((item) => item.id === id) || WORKSPACE_PLATFORMS[0];
    }

    return {
        WORKSPACE_PLATFORMS,
        getDefaultPlatformId,
        getPlatformById
    };
});
