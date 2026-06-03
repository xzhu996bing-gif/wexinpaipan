(function (root, factory) {
    const api = factory();

    if (typeof module === 'object' && module.exports) {
        module.exports = api;
    }

    if (root) {
        root.EditorNavigation = api;
    }
})(typeof globalThis !== 'undefined' ? globalThis : this, () => {
    function getFileName(value) {
        return decodeURIComponent(String(value || ''))
            .replace(/\\/g, '/')
            .split('/')
            .pop()
            .toLowerCase();
    }

    function isEditorReferrer(referrer, editorPage) {
        if (!referrer) {
            return false;
        }

        try {
            const url = new URL(referrer, 'file:///');
            return getFileName(url.pathname) === getFileName(editorPage);
        } catch (error) {
            return getFileName(referrer) === getFileName(editorPage);
        }
    }

    function resolveEditorNavigationTarget({ editorPage, referrer }) {
        if (isEditorReferrer(referrer, editorPage)) {
            return {
                type: 'location',
                target: referrer
            };
        }

        return {
            type: 'location',
            target: editorPage
        };
    }

    return {
        isEditorReferrer,
        resolveEditorNavigationTarget
    };
});
