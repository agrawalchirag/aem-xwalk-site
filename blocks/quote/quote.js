import { getPlaceholder } from '../../scripts/placeholders.js';

/**
 * Fetches taxonomy data
 * @returns {Promise<object>} Taxonomy data with tag mappings
 */
async function fetchTaxonomy() {
  try {
    const response = await fetch('/taxonomy.json');
    if (!response.ok) return null;
    const json = await response.json();
    console.log('Fetched taxonomy.json', json);

    // Handle multi-sheet format
    if (json[':type'] === 'multi-sheet') {
      // Try to get the current language sheet, fallback to 'default' or 'en'
      const lang = document.documentElement.lang || 'en';
      return json[lang] || json.default || json.en;
    }

    // Handle single-sheet format (backward compatibility)
    return json;
  } catch (error) {
    return null;
  }
}

/**
 * Gets the translated tag title from taxonomy
 * @param {string} tagValue The tag value (e.g., "quote:motivational")
 * @param {object} taxonomy The taxonomy sheet data
 * @returns {string} The translated tag title
 */
function getTagTitle(tagValue, taxonomy) {
  console.log('Getting tag title for', tagValue, taxonomy);
  if (!taxonomy || !taxonomy.data || !tagValue) return '';
  const tagData = taxonomy.data.find((item) => item.tag === tagValue);
  return tagData ? tagData.title : '';
}

export default async function decorate(block) {
  const [quoteWrapper, authorWrapper, tagWrapper, showAsHeadingWrapper, headingTypeWrapper] = block.children;

  if (!quoteWrapper) return;

  // Get field values
  const tagValue = tagWrapper?.textContent?.trim();
  const showAsHeading = showAsHeadingWrapper?.textContent?.trim() === 'true';
  const headingType = headingTypeWrapper?.textContent?.trim() || 'h5';

  if (showAsHeading) {
    // Render as heading
    const heading = document.createElement(headingType);
    heading.textContent = quoteWrapper.textContent.trim();
    quoteWrapper.replaceChildren(heading);
  } else {
    // Render as blockquote
    const blockquote = document.createElement('blockquote');
    blockquote.textContent = quoteWrapper.textContent.trim();
    quoteWrapper.replaceChildren(blockquote);
  }

  // Handle author if present
  if (authorWrapper) {
    const author = document.createElement('p');
    author.className = 'quote-author';
    author.textContent = authorWrapper.textContent.trim();
    authorWrapper.replaceChildren(author);
  }

  // Remove field value wrappers
  tagWrapper?.remove();
  showAsHeadingWrapper?.remove();
  headingTypeWrapper?.remove();

  // Fetch tag from taxonomy and render translated tag
  if (tagValue) {
    const taxonomy = await fetchTaxonomy();
    if (taxonomy) {
      const tagTitle = getTagTitle(tagValue, taxonomy);

      if (tagTitle) {
        const tagElement = document.createElement('span');
        tagElement.className = 'quote-tag';
        tagElement.textContent = tagTitle;
        block.appendChild(tagElement);
      }
    }
  }

  // Add "Quote of the day" suffix from placeholders
  const quoteOfTheDayText = await getPlaceholder('quote-of-the-day');
  if (quoteOfTheDayText) {
    const suffix = document.createElement('p');
    suffix.className = 'quote-suffix';
    suffix.textContent = quoteOfTheDayText;
    block.appendChild(suffix);
  }
}
