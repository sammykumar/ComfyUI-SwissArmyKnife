# ComfyUI-SwissArmyKnife - Playwright Tests

This directory contains Playwright-based browser automation tests for the ComfyUI-SwissArmyKnife ComfyUI extension.

## Test Suite Overview

### Tests Included

1. **`test_state_management.js`** - Comprehensive state management testing

    - Tests widget visibility when switching between image/video modes
    - Verifies only appropriate upload buttons are shown
    - Tests transitions between Upload Media and Randomize Media modes
    - 6 comprehensive test scenarios

2. **`test_media_path_fix.js`** - Media path preservation testing

    - Tests that media_path values are preserved during widget recreation
    - Verifies the fix for the "Media path is required" error
    - Tests widget state transitions

3. **`quick_test.js`** - Quick validation test
    - Simplified test for rapid verification
    - Tests basic image → video → image transitions
    - Faster execution for quick checks

## Setup

### Install Dependencies

```bash
cd web/tests
npm install
```

### Install Browser

```bash
npm run install-browser
```

## Running Tests

### Run All Tests

```bash
npm test
# or
npm run test:all
```

### Run Individual Tests

```bash
# State management tests
npm run test:state

# Media path preservation tests
npm run test:media-path

# Quick validation test
npm run test:quick
```

### Headless Mode

```bash
npm run test:headless
```

## Test Requirements

-   **ComfyUI Instance**: Tests connect to `https://comfyui.devlabhq.com/`
-   **Workflow File**: Requires `video-describe.json` workflow to be available (legacy workflow — pending update)
-   **Node Type**: Legacy tests targeted the now-removed `GeminiUtilMediaDescribe` node
-   **Browser**: Chromium (installed automatically via Playwright)

## Test Structure

Each test follows this pattern:

1. **Setup**: Launch browser and navigate to ComfyUI
2. **Workflow Loading**: Open the video-describe workflow
3. **Node Interaction**: Find and interact with the Gemini node
4. **State Testing**: Perform various state transitions
5. **Validation**: Check widget visibility and values
6. **Cleanup**: Close browser

## Understanding Test Output

### Success Indicators

-   ✅ **PASSED** - Individual test case passed
-   🎉 **ALL TESTS PASSED** - Complete test suite success

### Debug Information

-   📝 **ComfyUI Console** - State change logs from the extension
-   📊 **Test Results Summary** - Overall pass/fail statistics
-   🔍 **Widget State Info** - Current widget configuration details

## Troubleshooting

### Common Issues

1. **"Target page has been closed"**

    - Ensure running in headless mode on servers without X11
    - Check that ComfyUI is accessible at the test URL

2. **"No tests ran"**

    - Verify the legacy workflow file exists in ComfyUI
    - Update tests or workflows to target the LM Studio structured describe nodes (the GeminiUtilMediaDescribe node is no longer available)

3. **Widget state tests failing**
    - Clear browser cache and restart ComfyUI
    - Verify the latest JavaScript widgets are loaded

### Test Timeouts

-   Navigation: 60 seconds
-   Widget interactions: 1-2 seconds
-   State transitions: 1-1.5 seconds
-   Complete test suite: ~2-3 minutes

## Development

### Adding New Tests

1. Create new test file in this directory
2. Follow the existing class structure pattern
3. Add npm script to `package.json`
4. Update this README

### Test Data

Tests use these standard values:

-   **Test paths**: `/test/media/path`, `/reference-vids/jg-reels`
-   **Media types**: `image`, `video`
-   **Media sources**: `Upload Media`, `Randomize Media from Path`

### Console Logging

Tests listen for console messages with `[STATE]` prefix to track widget operations during state transitions.
