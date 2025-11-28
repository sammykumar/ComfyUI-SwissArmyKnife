# Reddit Media Node Documentation

Extract and process media from Reddit posts and RedGifs links for use in ComfyUI workflows.

## 📄 Documentation

- **[REDDIT_MEDIA.md](REDDIT_MEDIA.md)** - Complete consolidated documentation
### Core Implementation

- **[REDDIT_POST_MEDIA_SOURCE.md](REDDIT_POST_MEDIA_SOURCE.md)** - Main Reddit post media extraction implementation

### UI & Widgets

- **[REDDIT_URL_WIDGET_PERSISTENCE_BUG_FIX.md](REDDIT_URL_WIDGET_PERSISTENCE_BUG_FIX.md)** - URL widget state persistence fixes
- **[REDDIT_URL_WIDGET_VISIBILITY_FIX.md](REDDIT_URL_WIDGET_VISIBILITY_FIX.md)** - Widget visibility and display fixes

### Integration & Fixes

- **[REDGIFS_EXTRACTION_FIX.md](REDGIFS_EXTRACTION_FIX.md)** - RedGifs media extraction fixes
- **[VIDEO_TRIMMING_REDGIFS_FIX.md](VIDEO_TRIMMING_REDGIFS_FIX.md)** - Video trimming for RedGifs content
- **[JAVASCRIPT_REDDIT_POST_FIX.md](JAVASCRIPT_REDDIT_POST_FIX.md)** - JavaScript widget fixes

## 🎯 Quick Reference

### Node Purpose

Extract media from:

- Reddit post URLs
- Direct image/video links
- RedGifs embedded content
- Gallery posts
- Video posts with audio

### Key Features

- **URL Parsing**: Automatic detection of Reddit and RedGifs URLs
- **Media Extraction**: Download images and videos
- **Video Trimming**: Trim extracted videos to desired length
- **Widget Persistence**: Save and restore URL inputs
- **Error Handling**: Robust error handling for API failures

## 🔧 Technical Details

### Files

- **Python Backend**: `nodes/reddit_media.py`
- **JavaScript Widget**: `web/js/reddit_widgets.js`

### Supported URLs

- `https://reddit.com/r/subreddit/comments/...`
- `https://www.reddit.com/...`
- `https://old.reddit.com/...`
- `https://redgifs.com/watch/...`
- Direct image/video URLs from Reddit CDN

### Media Processing

1. Parse Reddit URL
2. Extract media URLs (images/videos)
3. Download media to ComfyUI input folder
4. Apply trimming/processing if configured
5. Return processed media paths

## 🐛 Common Issues

1. **RedGifs Extraction Fails**: Check RedGifs API changes
2. **Widget Not Saving**: Clear browser cache and refresh
3. **Video Download Fails**: Verify Reddit API access
4. **Audio Missing**: Some Reddit videos don't include audio

## 📚 Related Documentation

- [Video Metadata](../video-metadata/) - For extracting video information
- [Features](../../features/) - For text extraction and processing

---

**Node Type**: Media Source
**Category**: Input/External
**Status**: Stable
