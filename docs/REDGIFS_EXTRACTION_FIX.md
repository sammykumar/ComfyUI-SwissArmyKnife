# Redgifs URL Extraction Fix

## Issue Description

When processing Reddit posts that contain redgifs videos, the system was failing with the error:

```
ValueError: Failed to extract video URL from https://www.redgifs.com/watch/scientifictriviallizard
```

## Root Cause Analysis

The original redgifs extraction logic had several issues:

1. **API Changes**: Redgifs API v2 may require authentication or have rate limiting
2. **URL Structure**: Direct URL construction patterns were outdated
3. **Error Handling**: System would fail completely instead of trying fallbacks
4. **Content Detection**: Not properly detecting when HTML was returned instead of video

## Enhanced Solution

### Multi-Strategy Approach

The new `_extract_redgifs_url()` method implements three strategies in order:

#### Strategy 1: HTML Scraping

- Downloads the redgifs page HTML
- Uses regex patterns to find video URLs in the page source
- Tests each found URL to verify it's accessible
- Looks for patterns like:
    - `"(https://files\.redgifs\.com/[^"]*\.mp4[^"]*)"`
    - `"videoUrl":"([^"]*)"`
    - Various other video URL patterns

#### Strategy 2: Direct URL Construction

- Tries common redgifs URL patterns:
    - `https://files.redgifs.com/{gif_id}.mp4`
    - `https://thumbs.redgifs.com/{gif_id}.mp4`
    - `https://thumbs2.redgifs.com/{gif_id}.mp4`
    - `https://files.redgifs.com/{gif_id}-mobile.mp4`

#### Strategy 3: API Fallback

- Attempts to use redgifs API v2 (may be rate limited)
- Tries to extract video URLs from API response

### Improved Error Handling

1. **Graceful Fallbacks**: Instead of failing completely, tries original URL as fallback
2. **Content Validation**: Checks if downloaded content is actually media vs HTML
3. **Debug Logging**: Extensive logging to help diagnose issues
4. **Size Validation**: Warns if content is suspiciously small

### Content Type Detection

- Validates downloaded content is actually media, not HTML
- Raises specific error if HTML is returned (indicates URL extraction failed)
- Checks content size to detect potential issues

## Code Changes

### Enhanced URL Extraction (`_extract_redgifs_url`)

```python
def _extract_redgifs_url(self, redgifs_url):
    # Multi-strategy approach with extensive debugging
    # Strategy 1: HTML scraping with regex patterns
    # Strategy 2: Direct URL construction
    # Strategy 3: API fallback
    # Returns (video_url, media_type) or (None, None)
```

### Improved Download Logic

```python
# Special handling for redgifs URLs
if 'redgifs.com' in media_url and not media_url.endswith(('.mp4', '.webm', '.mov')):
    extracted_url, extracted_type = self._extract_redgifs_url(media_url)
    if extracted_url:
        media_url = extracted_url
        media_type = extracted_type

# Content validation after download
if content_type.startswith('text/html') and 'redgifs.com' in media_url:
    raise ValueError(f"Redgifs URL returned webpage instead of video: {media_url}")
```

### Fallback Handling

```python
# Instead of failing immediately
if not media_url:
    print(f"Warning: Could not extract direct video URL from {url}, trying original URL as fallback")
    media_url = url
    media_type = 'video'
```

## Expected Behavior

### Successful Case

1. User provides Reddit post with redgifs video
2. System extracts gif ID from redgifs URL
3. Uses HTML scraping to find direct video URL
4. Downloads video successfully
5. Processes with video trimming if enabled

### Debug Output

```
[DEBUG] Attempting to extract video URL from: https://www.redgifs.com/watch/scientifictriviallizard
[DEBUG] Extracted gif_id: scientifictriviallizard
[DEBUG] Strategy 1: Scraping page for video URLs
[DEBUG] Found potential video URL: https://files.redgifs.com/ScientificTrivialLizard.mp4
[DEBUG] Successfully found working video URL: https://files.redgifs.com/ScientificTrivialLizard.mp4
```

### Fallback Case

If direct extraction fails:

```
Warning: Could not extract direct video URL from https://www.redgifs.com/watch/scientifictriviallizard, trying original URL as fallback
```

## Testing

To test the fix:

1. Find a Reddit post with a redgifs video
2. Use the Reddit Post media source option
3. Enter the Reddit post URL
4. Verify it processes without the "Failed to extract video URL" error
5. Check console logs for debug information about URL extraction

## Known Limitations

- **Rate Limiting**: Heavy usage might trigger redgifs rate limiting
- **URL Changes**: Redgifs may change their URL structure over time
- **Authentication**: Some content might require authentication in the future
- **Content Restrictions**: Some redgifs content might be region-restricted

## Related Files

- `utils/nodes.py` - Main implementation
- `docs/REDDIT_POST_MEDIA_SOURCE.md` - Overall Reddit Post documentation
- `docs/JAVASCRIPT_REDDIT_POST_FIX.md` - JavaScript widget fix
