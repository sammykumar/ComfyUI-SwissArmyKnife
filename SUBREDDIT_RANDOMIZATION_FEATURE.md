# Subreddit Randomization Feature

## Overview

Added a new "Randomize from Subreddit" option to the MediaDescribe node that allows users to randomly select a media post from any subreddit.

## Changes Made

### 1. New Method: `_get_random_subreddit_post()`

**Location:** `nodes/media_describe/mediia_describe.py` (lines ~278-370)

This method:

- Takes a subreddit URL or name (flexible formats: `r/pics`, `https://www.reddit.com/r/pics/`, or just `pics`)
- Takes a media_type parameter to filter for either images or videos
- Fetches up to 100 hot posts from the subreddit using Reddit's JSON API
- Filters posts to only include those matching the specified media type (image or video)
- Uses the seed parameter for reproducible random selection
- Returns a random post URL from the filtered media posts

**Media type filtering:**

- **Images:** `.jpg`, `.jpeg`, `.png`, `.gif`, `.webp`, `i.redd.it`, Reddit gallery images
- **Videos:** `.mp4`, `.webm`, `.mov`, `v.redd.it`, `redgifs.com`, `gfycat.com`, Reddit gallery videos/animations

### 2. Updated INPUT_TYPES

**Changes:**

- Added "Randomize from Subreddit" to `media_source` options
- Updated tooltip to reflect the new option
- Added new `subreddit_url` parameter to optional inputs
- Updated `seed` tooltip to mention it works with both path and subreddit randomization

### 3. Updated `describe_media()` Function

**Changes:**

- Added `subreddit_url` parameter to function signature
- Updated docstring to document the new parameter and option
- Added `elif` branch to handle "Randomize from Subreddit" mode:
    - Validates subreddit_url is provided
    - Calls `_get_random_subreddit_post()` to get a random post
    - Downloads media from the selected post using existing `_download_reddit_media()` method
    - Creates detailed media_info_text with subreddit name and post details
    - Handles automatic duration limiting for large videos

### 4. Added Imports

**New imports:**

- `random` - for seed-based random selection
- `re` - for regex pattern matching (already used elsewhere in the code)

## Usage

1. **Select Media Source:** Choose "Randomize from Subreddit" from the dropdown
2. **Enter Subreddit:** Provide subreddit in any of these formats:
    - `r/pics`
    - `https://www.reddit.com/r/pics/`
    - `pics`
3. **Set Seed:** Change the seed value to get different random posts
4. **Media Type:** Select whether you want images or videos (only posts of that type will be considered)
5. **Run:** The node will:
    - Fetch hot posts from the subreddit
    - Filter for posts matching your selected media type (image or video)
    - Randomly select one based on the seed
    - Download and process it with Gemini

## Features

- **Media Type Filtering:** Only selects posts matching your chosen media type (image or video)
- **Reproducible Selection:** Same seed + same media type = same post (until subreddit content changes)
- **Smart Filtering:** Distinguishes between images and videos, including external hosts
- **Flexible Input:** Accepts multiple subreddit URL formats
- **Error Handling:** Clear error messages if no posts of the requested type are found
- **Auto-limiting:** Large videos are automatically trimmed to prevent API errors
- **Detailed Info:** Shows subreddit name, post title, and file details

## Error Messages

- `"Subreddit URL is required when media_source is 'Randomize from Subreddit'"` - No subreddit provided
- `"No posts found in r/{subreddit_name}"` - Subreddit is empty or private
- `"No {media_type} posts found in r/{subreddit_name}. Try a different subreddit or media type."` - No posts matching the selected media type in top 100 hot posts
- `"Failed to fetch subreddit posts: Network error"` - Connection issues
- `"Failed to parse subreddit data: Invalid format"` - Reddit API response changed or subreddit doesn't exist

## Technical Details

- Uses Reddit's JSON API (no authentication required for public subreddits)
- Fetches up to 100 hot posts to ensure good variety
- Filters posts client-side for the specified media type (image or video)
- Intelligently detects media type from URLs, file extensions, and Reddit metadata
- Reuses existing `_download_reddit_media()` method for actual download
- Maintains same output format as other media sources
- Seed affects only the random selection, not the API call
- If you select "video" media type, only video posts will be selected (and vice versa for images)

## Example Subreddits

Good subreddits to try:

- `r/pics` - General images
- `r/gifs` - Animated content
- `r/videos` - Video content
- `r/art` - Artwork
- `r/funny` - Memes and humor
- `r/earthporn` - Landscape photography
