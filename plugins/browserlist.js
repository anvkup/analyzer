import browserslist from 'browserslist';

export default () => {
    const SUPPORTED_BUILD_TARGETS = ['es', 'chrome', 'edge', 'firefox', 'ios', 'node', 'safari'];

    const supported = (browserName) => {
        if (SUPPORTED_BUILD_TARGETS.some((targetName) => browserName.startsWith(targetName + ' '))) {
            browserName.replace(' ', '');
        }
    };

    return browserslist().map(supported).filter(Boolean);
};
