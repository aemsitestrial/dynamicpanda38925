import { nothing } from 'lit';
const svgRegistry = new Map();
export function registerSvgs(svgs) {
    Object.entries(svgs).forEach(([name, tpl]) => svgRegistry.set(name, tpl));
}
export function resolveSvg(name) {
    if (!svgRegistry.has(name)) {
        console.warn(`SVG "${name}" not registered. Call registerSvgs() first.`);
        return nothing;
    }
    return svgRegistry.get(name);
}
export function _clearRegistryForTesting() {
    svgRegistry.clear();
}
