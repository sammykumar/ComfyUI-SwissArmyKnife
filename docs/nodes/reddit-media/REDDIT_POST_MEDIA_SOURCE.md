# Reddit Post Media Source - Enhanced Implementation Guide

## Overview

The "Reddit Post" media source option in the **Gemini Util - Media Describe** node allows users to directly input Reddit post URLs to download and analyze media content. This feature has been enhanced with improved redgifs support and proper capitalization, now supporting both images and videos from Reddit posts, including content hosted on external platforms like redgifs.

## Features

### Supported Reddit Media Types

- **Direct Image Links**: i.redd.it hosted images (jpg, png, gif, webp)
- **Direct Video Links**: v.redd.it hosted videos (mp4, webm)
- **External Links**: Images and videos ending with common extensions
- **Reddit Galleries**: First media item from gallery posts
- **External Video Hosts**: Enhanced support for redgifs.com with API v2 integration and legacy gfycat.com support

### Recent Enhancements (Latest Update)

#### 1. Improved Redgifs Support

- **API Integration**: Now uses redgifs API v2 for proper video URL extraction
- **Quality Selection**: Automatically selects best available quality (HD > SD > poster)
- **Fallback Mechanisms**: Multiple fallback strategies for URL extraction
- **Legacy Support**: Handles old gfycat URLs that may redirect to redgifs

#### 2. Capitalization Fix

- Updated option from "Reddit post" to "Reddit Post" for UI consistency

#### 3. Enhanced Error Handling

- Better error messages for failed redgifs extraction
- Improved debugging information for troubleshooting

### Automatic Media Type Detection

The system automatically detects whether the Reddit post contains image or video content and can override the user's media_type selection if needed (with a warning).

## Usage

1. Set `media_source` to "Reddit Post"
2. Enter a Reddit post URL in the `reddit_url` field
3. Select the expected `media_type` (image or video)
4. Configure other Gemini processing options as normal

### Video Trimming Integration

The Reddit Post option fully supports video trimming through the existing `max_duration` parameter:

- **Automatic Trimming**: Videos downloaded from Reddit posts are trimmed from the beginning if `max_duration` > 0
- **FFmpeg Integration**: Uses the same `_trim_video()` method as other media sources
- **Absolute Path Handling**: Downloaded temporary files maintain proper absolute paths throughout the trimming process
- **Fallback Support**: If trimming fails, the original video is used with appropriate warnings

### Supported URL Formats

- Full Reddit URLs: `https://www.reddit.com/r/subreddit/comments/postid/title/`
- Shortened URLs: `reddit.com/r/subreddit/comments/postid/title/`
- URLs with or without trailing slashes
- Redgifs URLs: `https://redgifs.com/watch/gifname` or `https://www.redgifs.com/watch/gifname`

## Implementation Details

### Backend Processing (`nodes/nodes.py`)

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

New imports added to `nodes/nodes.py`:

- `hashlib`: For content hashing
- `html.unescape`: For decoding HTML entities in URLs
- `mimetypes`: For content type detection
- `requests`: For HTTP downloads (already in dependencies)
- `urllib.parse`: For URL manipulation

### Temporary File Management

- Media files are downloaded to ComfyUI's temp directory (respects `--base-directory` and `--temp-directory` flags)
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
