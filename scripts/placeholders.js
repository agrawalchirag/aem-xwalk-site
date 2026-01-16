/*
 * Placeholders utility for fetching localized text
 */

const CAMEL_CASE_REGEX = /([a-z0-9])([A-Z])/g;
const CAMEL_CASE_REPLACEMENT = '$1-$2';

/**
 * Converts camelCase string to kebab-case
 * @param {string} str
 * @returns {string}
 */
function toKebabCase(str) {
  return str.replace(CAMEL_CASE_REGEX, CAMEL_CASE_REPLACEMENT).toLowerCase();
}

/**
 * Converts kebab-case/snake_case to camelCase
 * @param {string} str
 * @returns {string}
 */
function toCamelCase(str) {
  return str.replace(/[-_]([a-z])/g, (match, p1) => p1.toUpperCase());
}

/**
 * Fetches placeholders from placeholders.json
 * @param {string} [prefix] Location prefix for placeholders file
 * @returns {Promise<object>} Placeholders object with camelCase keys
 */
export async function fetchPlaceholders(prefix = 'default') {
  window.placeholders = window.placeholders || {};
  
  if (!window.placeholders[prefix]) {
    window.placeholders[prefix] = new Promise((resolve) => {
      const placeholdersPath = prefix === 'default' ? '/placeholders.json' : `${prefix}/placeholders.json`;
      
      fetch(placeholdersPath)
        .then((resp) => {
          if (resp.ok) {
            return resp.json();
          }
          return { data: [] };
        })
        .then((json) => {
          const placeholders = {};
          (json.data || [])
            .filter((placeholder) => placeholder.Key)
            .forEach((placeholder) => {
              placeholders[toCamelCase(placeholder.Key)] = placeholder.Text;
            });
          window.placeholders[prefix] = placeholders;
          resolve(placeholders);
        })
        .catch(() => {
          // Error loading placeholders
          window.placeholders[prefix] = {};
          resolve({});
        });
    });
  }
  
  return window.placeholders[prefix];
}

/**
 * Gets a single placeholder value
 * @param {string} key Placeholder key (camelCase or kebab-case)
 * @param {string} [prefix] Location prefix
 * @returns {Promise<string>} Placeholder text
 */
export async function getPlaceholder(key, prefix = 'default') {
  const placeholders = await fetchPlaceholders(prefix);
  const camelKey = toCamelCase(key);
  return placeholders[camelKey] || '';
}
