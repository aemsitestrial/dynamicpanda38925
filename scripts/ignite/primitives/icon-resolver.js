/**
 * ICON RESOLVER - FontAwesome Icon Registry for Lit Components
 *
 * Purpose: Provide tree-shakable FontAwesome icon integration for web components
 *
 * What it does:
 * - Maintains a registry of FontAwesome icons registered by consumers
 * - Consumers import only the icons they need (avoids bundling entire FA library)
 * - registerIcons(): Consumers call this with their icon set
 * - resolveIcon(): Components call this to get Lit SVG templates
 * - Converts FontAwesome IconDefinition → Lit svg template literal
 * - Warns if icon not registered (helps catch missing icons during dev)
 *
 * Used by: Web components (xe-icon, xe-button, etc.)
 * Used by consumers: App entry point (register icons before component usage)
 */
import { svg, nothing } from 'lit';
/**
 * Icon registry - consumers register icons they want to use
 */
const iconRegistry = {};
/**
 * Register icons for use in components
 * Consumers call this to provide only the icons they need
 *
 * @param icons - Object mapping icon names to FontAwesome icon definitions
 *
 * @example
 * ```typescript
 * import { registerIcons } from '@ignite/web/utils/icon-resolver';
 * import { faHeart, faUser } from '@fortawesome/pro-solid-svg-icons';
 *
 * // Consumer decides which icons to bundle
 * registerIcons({ faHeart, faUser });
 * ```
 */
export function registerIcons(icons) {
    Object.assign(iconRegistry, icons);
}
/**
 * Resolves a Font Awesome icon name to a Lit SVG template
 * Icon must be registered first via registerIcons()
 *
 * @param iconName - The Font Awesome icon name (e.g., 'faHeart', 'faUser')
 * @returns A Lit SVG template or nothing if icon not found
 *
 * @example
 * ```typescript
 * import { resolveIcon } from '../../utils/icon-resolver';
 *
 * render() {
 *   return html`
 *     <span class="icon">${resolveIcon('faHeart')}</span>
 *   `;
 * }
 * ```
 */
/** Clears all registered icons. Use in test teardown only. */
export function _clearRegistryForTesting() {
    Object.keys(iconRegistry).forEach(k => delete iconRegistry[k]);
}
export function resolveIcon(iconName) {
    const iconDef = iconRegistry[iconName];
    if (!iconDef || !iconDef.icon || !Array.isArray(iconDef.icon)) {
        console.warn(`Icon "${iconName}" not found. Did you forget to register it with registerIcons()?`);
        return nothing;
    }
    const [width, height, , , paths] = iconDef.icon;
    const pathData = Array.isArray(paths) ? paths : [paths];
    return svg `
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 ${width} ${height}"
      fill="currentColor"
      aria-hidden="true"
    >
      ${pathData.map(path => svg `<path d="${path}" />`)}
    </svg>
  `;
}
