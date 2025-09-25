# Reddit Post Media Source Implementation

## Overview

The Media Describe node now supports downloading media directly from Reddit posts as a third media source option alongside "Upload Media" and "Randomize Media from Path".

## Features

### Supported Reddit Media Types

- **Direct Image Links**: i.redd.it hosted images (jpg, png, gif, webp)
- **Direct Video Links**: v.redd.it hosted videos (mp4, webm)
- **External Links**: Images and videos ending with common extensions
- **Reddit Galleries**: First media item from gallery posts
- **External Video Hosts**: Basic support for redgifs.com and gfycat.com URLs

### Automatic Media Type Detection

The system automatically detects whether the Reddit post contains image or video content and can override the user's media_type selection if needed (with a warning).

## Usage

1. Set `media_source` to "Reddit post"
2. Enter a Reddit post URL in the `reddit_url` field
3. Select the expected `media_type` (image or video)
4. Configure other Gemini processing options as normal

### Supported URL Formats

- Full Reddit URLs: `https://www.reddit.com/r/subreddit/comments/postid/title/`
- Shortened URLs: `reddit.com/r/subreddit/comments/postid/title/`
- URLs with or without trailing slashes

## Implementation Details

### Backend Processing (`utils/nodes.py`)

#### New Method: `_download_reddit_media(self, reddit_url)`

- **Input**: Reddit post URL string
- **Output**: Tuple of (temp_file_path, media_type, media_info_dict)
- **Process**:
    1. Validates and normalizes the Reddit URL
    2. Converts to Reddit JSON API endpoint (.json suffix)
    3. Downloads post metadata using requests with browser-like headers
    4. Extracts media URLs from various Reddit data structures
    5. Downloads the media file to temporary storage
    6. Returns file path and metadata for processing

#### Updated `INPUT_TYPES`

- Added "Reddit post" to `media_source` options
- Added `reddit_url` parameter as optional STRING input

#### Updated `describe_media` Method

- Added `reddit_url` parameter to method signature
- Added Reddit post handling logic between randomization and upload sections
- Includes automatic media type detection and user warning for mismatches

### Frontend Widget (`web/js/swiss-army-knife.js`)

#### Updated Widget Management

- Added `reddit_url` to `hideOptionalInputWidgets` list
- Extended `updateMediaWidgets` function to handle "Reddit post" mode
- Shows/hides `reddit_url` widget based on selected media source
- Hides other irrelevant widgets (seed, media_path, upload widgets) in Reddit mode

#### Widget Behavior

- **Reddit Post Mode**: Shows only `reddit_url` text input
- **Other Modes**: Hides `reddit_url` widget appropriately
- Maintains existing behavior for upload and randomization modes

## Error Handling

### Network Errors

- Request timeouts (30s for JSON, 60s for media)
- HTTP status code validation
- Connection failures

### Content Validation

- Invalid Reddit URLs
- Posts without downloadable media
- Unsupported media formats
- JSON parsing failures

### File Processing

- Temporary file creation
- Content type detection
- File extension fallbacks

## Technical Considerations

### Dependencies

New imports added to `utils/nodes.py`:

- `hashlib`: For content hashing
- `html.unescape`: For decoding HTML entities in URLs
- `mimetypes`: For content type detection
- `requests`: For HTTP downloads (already in dependencies)
- `urllib.parse`: For URL manipulation

### Temporary File Management

- Media files are downloaded to temporary files using `tempfile.NamedTemporaryFile`
- Files are not automatically deleted (delete=False) to allow processing
- Temporary files should be cleaned up by the system or calling code

### Rate Limiting and Ethics

- Uses browser-like User-Agent headers to avoid blocking
- Single request per execution (no scraping)
- Respects Reddit's robots.txt and terms of service
- Only downloads public content that's already accessible

## Limitations

### Current Limitations

1. **Gallery Posts**: Only downloads the first media item from multi-image galleries
2. **Video Quality**: Uses Reddit's fallback video URL (may not be highest quality)
3. **External Hosts**: Limited support for external video hosting services
4. **Audio**: Reddit video audio tracks are not explicitly handled
5. **Live Posts**: No support for Reddit live streams

### Known Issues

1. Some Reddit videos may have separate audio tracks that aren't downloaded
2. Very large media files may timeout during download
3. Private or deleted posts will fail with appropriate error messages
4. Some external links may require additional processing

## Future Enhancements

### Potential Improvements

1. **Enhanced Gallery Support**: Download all images from gallery posts
2. **Video Quality Options**: Allow user to select video quality preference
3. **Audio Track Handling**: Proper handling of separate audio streams
4. **Caching**: Cache downloaded media to avoid re-downloading
5. **Batch Processing**: Support for multiple Reddit URLs
6. **Metadata Extraction**: Extract Reddit post metadata (author, upvotes, comments)

### External Dependencies

Consider adding support for:

- `yt-dlp` for advanced video downloading
- `praw` (Python Reddit API Wrapper) for authenticated requests
- Media validation libraries for content verification

## Testing

### Test Cases

1. **Direct Image Links**: i.redd.it images
2. **Direct Video Links**: v.redd.it videos
3. **Gallery Posts**: Multi-image galleries
4. **External Links**: imgur, gfycat, redgifs
5. **Error Cases**: Invalid URLs, deleted posts, network failures
6. **Edge Cases**: URLs with parameters, mobile URLs, shortened links

### Manual Testing Procedure

1. Test with the provided example URL: `https://www.reddit.com/r/bellydistension/comments/1n6neuw/nothing_prettier_than_rearranging_my_insides/`
2. Verify different URL formats work
3. Test error handling with invalid URLs
4. Confirm media type detection works
5. Validate processing with different Gemini options

## Security Considerations

### Input Validation

- URL format validation
- Reddit domain verification
- Content type validation
- File size limits (implicit via timeout)

### Network Security

- Uses HTTPS for all requests
- Validates response status codes
- Handles network timeouts appropriately
- No execution of downloaded content

### Privacy

- No user authentication required
- No personal data collection
- Only accesses public Reddit content
- Temporary files are used for processing
