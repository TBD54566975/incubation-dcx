/**
 * Activates various polyfills to enable Web5 features in Web environments.
 *
 * @param {object} [options={}] - Configuration options to control the activation of polyfills.
 * @param {boolean} [options.serviceWorker=true] - Option to avoid installation of the Service Worker. Defaults to true, installing the Service Worker.
 * @param {boolean} [options.injectStyles=true] - Option to skip injection of styles for UI related UX polyfills. Defaults to true, injecting styles.
 * @param {boolean} [options.links=true] - Option to skip activation of DRL link features. Defaults to true, activating link features.
 * @param {function} [options.onCacheCheck] - Callback function to handle cache check events, allowing fine-grained control over what DRL request to cache, and for how long.
 * @param {object} [options.onCacheCheck.event] - The event object passed to the callback.
 * @param {object} [options.onCacheCheck.route] - The route object passed to the callback.
 * @returns {object} [options.onCacheCheck.return] - The return object from the callback.
 * @returns {number} [options.onCacheCheck.return.ttl] - Time-to-live for the cached DRL response, in milliseconds.
 *
 * @returns {void}
 *
 * @example
 * // Activate all polyfills with default options, and cache every DRL for 1 minute
 * activatePolyfills({
 *   onCacheCheck(event, route){
 *     return {
 *       ttl: 60_000
 *     }
 *   }
 * });
 *
 * @example
 * // Activate polyfills, but without Service Worker activation
 * activatePolyfills({ serviceWorker: false });
*/
export declare function activatePolyfills(options?: any): void;
//# sourceMappingURL=web-features.d.ts.map