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
  if (!taxonomy || !taxonomy.data || !tagValue) return '';
  const tagData = taxonomy.data.find((item) => item.tag === tagValue);
  return tagData ? tagData.title : '';
}

export default async function decorate(block) {
  const [quoteWrapper, authorWrapper] = block.children;

  if (!quoteWrapper) return;

  // Check if quote should be rendered as heading
  const showAsHeading = block.classList.contains('show-as-heading');
  const headingTypes = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'];

  // Find selected heading type from classes, default to h5
  let headingType = 'h5';
  headingTypes.forEach((type) => {
    if (block.classList.contains(type)) {
      headingType = type;
    }
  });

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

  // Fetch tag from block classes and render translated tag
  const taxonomy = await fetchTaxonomy();
  const tagClasses = [...block.classList].filter((cls) => cls.startsWith('tag-'));
  if (tagClasses.length > 0 && taxonomy) {
    // Convert class like "tag-quote-motivational" to "quote:motivational"
    const tagClass = tagClasses[0];
    const tagValue = tagClass.replace('tag-', '').replace(/-/g, ':');
    const tagTitle = getTagTitle(tagValue, taxonomy);

    if (tagTitle) {
      const tagElement = document.createElement('span');
      tagElement.className = 'quote-tag';
      tagElement.textContent = tagTitle;
      block.appendChild(tagElement);
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
