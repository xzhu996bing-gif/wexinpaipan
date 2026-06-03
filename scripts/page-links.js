(function (root, factory) {
    const api = factory();

    if (typeof module === 'object' && module.exports) {
        module.exports = api;
    }

    if (root) {
        root.PageLinks = api;
    }
})(typeof globalThis !== 'undefined' ? globalThis : this, () => {
    function resolvePageLink({ configuredPath, fallbackPath }) {
        const value = String(configuredPath || '').trim();
        return value || fallbackPath;
    }

    return {
        resolvePageLink
    };
});
