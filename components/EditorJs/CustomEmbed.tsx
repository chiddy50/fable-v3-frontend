
class CustomEmbed {
    /**
     * The constructor of the Embed block.
     * @param {object} data - Previously saved data.
     * @param {object} api - Editor.js API.
     */
    constructor({ data, api }) {
        this.api = api;
        this.data = data || {};
        this.wrapper = null;
    }

    /**
     * Render method to create the input field and iframe.
     * @returns {HTMLElement} - The HTML element to display.
     */
    render() {
        // Create a container for the block
        this.wrapper = document.createElement('div');
        this.wrapper.classList.add('custom-embed');

        // Create the input field for video URL
        const input = document.createElement('input');
        input.type = 'url';
        input.placeholder = 'Enter a YouTube URL';
        input.value = this.data.url || '';
        input.classList.add('custom-embed__input');

        // Event listener to update the iframe when a URL is entered
        input.addEventListener('change', (event) => {
            const url = event.target.value;
            this.data.url = url;
            this._updateVideoEmbed(url);
        });

        // Create the iframe container for the video preview
        this.iframe = document.createElement('iframe');
        this.iframe.classList.add('custom-embed__iframe');
        this.iframe.setAttribute('allowfullscreen', 'true');

        // If there is an existing URL in the data, update the iframe
        if (this.data.url) {
            this._updateVideoEmbed(this.data.url);
        }

        // Append input and iframe to the wrapper
        this.wrapper.appendChild(input);
        this.wrapper.appendChild(this.iframe);

        return this.wrapper;
    }

    /**
     * Save the block's content.
     * @param {HTMLElement} blockContent - The HTML content of the block.
     * @returns {object} - The saved data.
     */
    save(blockContent) {
        const input = blockContent.querySelector('input');
        return {
            url: input.value,
        };
    }

    /**
     * Update the iframe to display the video preview.
     * @param {string} url - The video URL.
     */
    _updateVideoEmbed(url) {
        if (!url) {
            this.iframe.src = '';
            return;
        }

        // Parse the URL to determine if it is a YouTube link or other link
        let embedUrl;

        if (url.includes('youtube.com') || url.includes('youtu.be')) {
            const videoId = this._extractYouTubeVideoId(url);
            embedUrl = `https://www.youtube.com/embed/${videoId}`;
        } else {
            embedUrl = url; // Allow other video links directly as embeds
        }

        this.iframe.src = embedUrl;
    }

    /**
     * Extract YouTube video ID from a URL.
     * @param {string} url - The YouTube URL.
     * @returns {string} - The extracted YouTube video ID.
     */
    _extractYouTubeVideoId(url) {
        const regExp = /(?:https?:\/\/)?(?:www\.|m\.)?(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
        const match = url.match(regExp);
        return match ? match[1] : null;
    }

    /**
     * Get the toolbox settings for Editor.js.
     */
    static get toolbox() {
        return {
            title: 'Youtube',
            icon: `<i class='bx bxl-youtube text-2xl'></i>`
            // icon: '<svg width="20" height="20" viewBox="0 0 24 24"><path fill="none" stroke="#000" stroke-width="2" d="M12 20v-2m-3 2v-2m6 2v-2m-9-5h18M3 7h18M3 12h18m-2-7v14c0 1-1 2-2 2H5c-1 0-2-1-2-2V5c0-1 1-2 2-2h12c1 0 2 1 2 2z"/></svg>'
        };
    }
}

/**
 * Custom styles for the block.
 */

// .custom-embed {
//     padding: 16px;
//     border: 1px solid #e5e5e5;
//     border-radius: 8px;
//     background-color: #f9f9f9;
// }
const styles = `
    .custom-embed {
  
    }
  
    .custom-embed__input {
      width: 100%;
      padding: 8px 12px;
      font-size: 16px;
      border: 1px solid #ccc;
      border-radius: 4px;
      margin-bottom: 12px;
    }
  
    .custom-embed__iframe {
      width: 100%;
      height: 315px;
      border: none;
      border-radius: 8px;
    }
  
    @media (max-width: 768px) {
      .custom-embed__iframe {
        height: 200px;
      }
    }
  
    @media (max-width: 480px) {
      .custom-embed__iframe {
        height: 150px;
      }
    }
`;

// Add styles to the page
const styleSheet = document.createElement('style');
styleSheet.type = 'text/css';
styleSheet.innerText = styles;
document.head.appendChild(styleSheet);

export default CustomEmbed;
