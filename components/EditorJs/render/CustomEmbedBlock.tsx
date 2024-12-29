/**
 * Renders custom embed data as HTML.
 * 
 * @param {Object} embedData - The embed data to render.
 * @param {string} embedData.id - The unique ID of the embed block.
 * @param {string} embedData.type - The type of embed (e.g., 'Youtube').
 * @param {Object} embedData.data - The data associated with the embed.
 * @param {string} embedData.data.url - The URL of the video to embed.
 * @returns {string} - The generated HTML for the embed.
 */

const CustomEmbedBlock = ({ data }) => {

    if (!data.url) {
      console.error('Invalid embed data:', data);
      return <div></div>;
    }
  
    const { url } = data;
    let embedUrl;
  
    // Check if it's a YouTube link and convert it to an embeddable URL
    if (url.includes('youtube.com') || url.includes('youtu.be')) {
      const videoId = extractYouTubeVideoId(url);
      embedUrl = `https://www.youtube.com/embed/${videoId}`;
    } else {
      // Use the URL directly for other video sources
      embedUrl = url;
    }
    console.log({embedUrl});
    
  
    // Return the HTML string to embed the video as an iframe
    return <div className="custom-embed my-7">
    <iframe 
      className="custom-embed__iframe" 
      src={embedUrl} 
      frameBorder="0" 
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
      allowFullScreen
    ></iframe>
  </div>
}
  
/**
 * Extracts the YouTube video ID from a URL.
 * 
 * @param {string} url - The YouTube URL.
 * @returns {string|null} - The extracted YouTube video ID, or null if not found.
 */
function extractYouTubeVideoId(url: string) {
    const regExp = /(?:https?:\/\/)?(?:www\.|m\.)?(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
    const match = url.match(regExp);
    return match ? match[1] : null;
}


export default CustomEmbedBlock;