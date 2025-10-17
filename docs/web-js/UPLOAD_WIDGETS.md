# Media Selection Upload Widgets

## Overview

The MediaSelection node now features interactive upload widgets that provide a user-friendly way to upload images and videos directly through the ComfyUI interface when using "Upload Media" mode.

## Features

### Dynamic Upload Buttons

- **📁 Choose Image**: Appears when `media_type` is set to "image"
- **📹 Choose Video**: Appears when `media_type` is set to "video"
- **Smart Visibility**: Only the relevant upload button is shown based on media type selection

### ComfyUI Integration

- Uses ComfyUI's built-in upload system (`api.uploadImage()` and upload endpoints)
- Proper file handling and storage in ComfyUI's input directory
- Seamless integration with existing ComfyUI workflow system

### User Experience

- **Click-to-upload**: Simple button interface that opens file browser
- **Visual Feedback**: Button text updates to show selected filename
- **File Type Filtering**: File browser only shows relevant file types (images or videos)
- **Error Handling**: Clear feedback if upload fails

## Implementation Details

### Upload Process

1. **File Selection**: User clicks upload button → file browser opens
2. **File Upload**: Selected file is uploaded using ComfyUI's upload API
3. **Path Storage**: Uploaded file path is stored in the appropriate widget
4. **UI Update**: Button text updates to show selected filename
5. **Node Refresh**: Node is marked as changed to trigger workflow updates

### File Handling

#### Images

- Uses `api.uploadImage(file)` for proper image handling
- Supports all standard image formats (PNG, JPG, WebP, etc.)
- Stored in ComfyUI's input directory

#### Videos

- Uses general upload endpoint (`/upload/image`) with video files
- Supports common video formats (MP4, AVI, MOV, etc.)
- Proper MIME type handling for video files

### Widget State Management

The upload widgets work by converting the original text input widgets into interactive buttons:

```javascript
// Convert text widget to upload button
originalUploadedImageWidget.type = 'button';
originalUploadedImageWidget.value = '📁 Choose Image';
originalUploadedImageWidget.callback = uploadHandler;
```

### Backend Integration

The uploaded file paths are stored in the hidden text widgets that the Python backend expects:

- `uploaded_image_file`: Contains the path to uploaded image
- `uploaded_video_file`: Contains the path to uploaded video

## Usage Guide

### For Image Upload

1. Set `media_source` to "Upload Media"
2. Set `media_type` to "image"
3. Click the "📁 Choose Image" button
4. Select an image file from your computer
5. Button updates to show "📁 [filename]"
6. File is ready for processing

### For Video Upload

1. Set `media_source` to "Upload Media"
2. Set `media_type` to "video"
3. Click the "📹 Choose Video" button
4. Select a video file from your computer
5. Button updates to show "📹 [filename]"
6. File is ready for processing

### Dynamic Switching

You can switch between image and video upload by changing the `media_type` dropdown:

- **Image → Video**: Image upload button becomes hidden, video upload button appears
- **Video → Image**: Video upload button becomes hidden, image upload button appears

## Technical Implementation

### JavaScript Widget Code

The upload functionality is implemented in the MediaSelection node's JavaScript widget code:

```javascript
// Show image upload widget
if (mediaType === 'image') {
    originalUploadedImageWidget.type = 'button';
    originalUploadedImageWidget.value = '📁 Choose Image';
    originalUploadedImageWidget.callback = () => {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'image/*';
        input.onchange = async (e) => {
            const file = e.target.files[0];
            if (file) {
                const uploadResponse = await api.uploadImage(file);
                originalUploadedImageWidget.value = `📁 ${file.name}`;
                // Store path in hidden widget for backend
                hiddenImageWidget.value = uploadResponse.name;
            }
        };
        input.click();
    };
}
```

### Error Handling

- **Upload Failures**: Button shows "Upload Failed" if upload encounters errors
- **File Size Limits**: Respects ComfyUI's maximum upload size settings
- **Network Issues**: Handles connection errors gracefully
- **Invalid Files**: File type validation prevents unsupported formats

## Browser Cache Note

**Important**: After deploying this JavaScript update, users may need to:

- Hard refresh the browser (Ctrl+F5 / Cmd+Shift+R)
- Clear browser cache
- Restart ComfyUI server to ensure new JavaScript is loaded

## Testing

### Manual Testing Steps

1. **Upload Image Test**:
    - Set media_source to "Upload Media" and media_type to "image"
    - Verify "📁 Choose Image" button appears
    - Click button and select an image file
    - Verify button updates with filename
    - Execute workflow to confirm file processing

2. **Upload Video Test**:
    - Set media_source to "Upload Media" and media_type to "video"
    - Verify "📹 Choose Video" button appears
    - Click button and select a video file
    - Verify button updates with filename
    - Execute workflow to confirm file processing

3. **Dynamic Switching Test**:
    - Start with image upload, then switch to video upload
    - Verify only appropriate upload button is visible
    - Test switching back to image upload

### Debug Console

Enable debug mode to see detailed console output:

```
[MediaSelection] Showing image upload widget
[MediaSelection] Image file selected: example.jpg
[MediaSelection] Image uploaded: {name: "example.jpg", ...}
```

## Related Files

- `web/js/swiss-army-knife.js` - JavaScript widget implementation
- `nodes/media_selection/media_selection.py` - Python backend node
- `docs/nodes/media-selection/MEDIA_SELECTION.md` - Complete node documentation

---

**Category**: UI Enhancement
**Status**: Implemented
**Version**: 2.5.6+
