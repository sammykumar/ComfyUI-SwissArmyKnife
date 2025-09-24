# Multiple LoRA Support Implementation

## Overview

Enhanced the LoRAInfoExtractor to support multiple LoRAs from the "WanVideo Lora Select Multi" node, processing all active LoRAs in the WANVIDLORA list structure.

## Key Features

### 1. Multiple LoRA Processing

- **Processes All LoRAs**: Iterates through the entire WANVIDLORA list
- **Skips Empty Slots**: Automatically ignores LoRAs with `path: 'none'` or empty paths
- **Individual CivitAI Lookup**: Attempts CivitAI API call for each valid LoRA
- **Combined Output**: Returns all LoRA names joined with " + " separator

### 2. Enhanced Output Format

#### Combined Names

```
"NSFW-22-L-e8 + Wan2.2 T2v X4ndra 000003000 High Noise"
```

#### Detailed Info (Bullet Points)

```
• Local: NSFW-22-L-e8 (strength: 1.0)
• Local: Wan2.2 T2v X4ndra 000003000 High Noise (strength: 1.0)
```

### 3. Strength Information

Each LoRA's strength is included in the detailed info:

- `strength: 1.0` for full strength
- `strength: 0.8` for 80% strength
- `strength: 1.5` for 150% strength (if supported)

## Implementation Details

### Core Method Structure

```python
def extract_lora_info(self, lora, civitai_api_key="", fallback_name="", use_civitai_api=True):
    # Initialize service once for efficiency
    civitai_service = CivitAIService(api_key=effective_api_key) if use_civitai_api else None

    # Handle multiple LoRAs
    if isinstance(lora, list):
        return self._process_multiple_loras(lora, civitai_service, use_civitai_api, fallback_name)

    # Fallback for single LoRA compatibility
    else:
        return self._process_single_lora(lora, civitai_service, use_civitai_api, fallback_name)
```

### Multiple LoRA Processing Logic

```python
def _process_multiple_loras(self, lora_list, civitai_service, use_civitai_api, fallback_name):
    for i, lora_dict in enumerate(lora_list):
        # Skip empty slots
        if not lora_dict.get('path') or lora_dict['path'].lower() == 'none':
            continue

        # Try CivitAI lookup for each LoRA
        civitai_data = civitai_service.get_model_info_by_hash(file_path) if civitai_service else None

        # Use CivitAI data if found, otherwise use local name
        if civitai_data:
            final_name = civitai_data["civitai_name"]
            final_info = f"CivitAI: {final_name} ({version}) by {creator}"
        else:
            final_name = self._clean_name(lora_dict['name'])
            final_info = f"Local: {final_name} (strength: {lora_dict['strength']})"

    # Combine all results
    combined_names = " + ".join(lora_names)
    combined_info = "\n".join([f"• {info}" for info in lora_infos])
```

## Usage Examples

### Example 1: WanVideo Lora Select Multi Node

**Input Structure:**

```python
lora_list = [
    {
        'path': '/workspace/ComfyUI/models/loras/NSFW-22-L-e8.safetensors',
        'strength': 1.0000,
        'name': 'NSFW-22-L-e8'
    },
    {
        'path': '/workspace/ComfyUI/models/loras/Wan2.2_t2v_X4ndra_000003000_high_noise.safetensors',
        'strength': 1.0000,
        'name': 'Wan2.2_t2v_X4ndra_000003000_high_noise'
    },
    {
        'path': 'none',  # Empty slot - will be skipped
        'strength': 1.0000,
        'name': 'none'
    }
]
```

**Output:**

- **Names**: `"Nsfw-22-l-e8 + Wan2.2 T2v X4ndra 000003000 High Noise"`
- **Info**:
    ```
    • Local: Nsfw-22-l-e8 (strength: 1.0)
    • Local: Wan2.2 T2v X4ndra 000003000 High Noise (strength: 1.0)
    ```

### Example 2: Mixed Strengths

**Input:**

```python
lora_list = [
    {'path': '/path/strong.safetensors', 'name': 'Strong_LoRA', 'strength': 1.5},
    {'path': '/path/weak.safetensors', 'name': 'Weak_LoRA', 'strength': 0.3}
]
```

**Output:**

- **Names**: `"Strong Lora + Weak Lora"`
- **Info**:
    ```
    • Local: Strong Lora (strength: 1.5)
    • Local: Weak Lora (strength: 0.3)
    ```

### Example 3: With CivitAI Data

**Output with CivitAI integration:**

- **Names**: `"Character Portrait LoRA + Anime Style Enhancement"`
- **Info**:
    ```
    • CivitAI: Character Portrait LoRA (v2.1) by ArtistName
    • CivitAI: Anime Style Enhancement (v1.5) by StudioName
    ```

## Edge Cases Handled

### 1. Empty LoRA List

- **Input**: `[]`
- **Output**: Uses fallback_name
- **Example**: `"Empty Fallback" -> "Fallback: Empty Fallback"`

### 2. All Empty Slots

- **Input**: All LoRAs have `path: 'none'`
- **Output**: Uses fallback_name
- **Example**: `"No Valid LoRAs" -> "Fallback: No Valid LoRAs"`

### 3. Single LoRA in List

- **Input**: List with one valid LoRA
- **Output**: Works normally, just one name and one bullet point

### 4. Mixed Valid/Invalid

- **Input**: Some LoRAs have valid paths, others have 'none'
- **Output**: Only processes valid LoRAs, skips invalid ones

## Debug Output

The enhanced debug logging shows detailed processing:

```
[DEBUG] Processing WANVIDLORA list with 4 LoRAs
[DEBUG] Processing LoRA 1/4: <class 'dict'>
[DEBUG] LoRA 1 details: path='/workspace/ComfyUI/models/loras/NSFW-22-L-e8.safetensors', name='NSFW-22-L-e8', strength=1.0
[DEBUG] Attempting CivitAI lookup for: NSFW-22-L-e8.safetensors
[DEBUG] ❌ No CivitAI data found for LoRA 1
[DEBUG] LoRA 1 final result: 'Nsfw-22-l-e8' -> 'Local: Nsfw-22-l-e8 (strength: 1.0)'
[DEBUG] Processing LoRA 2/4: <class 'dict'>
[DEBUG] Skipping LoRA 3: no valid path
[DEBUG] Skipping LoRA 4: no valid path
[DEBUG] ✅ Successfully processed 2 LoRAs
```

## Benefits

1. **Comprehensive Coverage**: Processes all active LoRAs from multi-LoRA nodes
2. **Efficient API Usage**: Single service instance for all CivitAI lookups
3. **Clear Output Format**: Easy to read combined names and detailed info
4. **Strength Awareness**: Shows individual LoRA strengths for fine-tuning
5. **Robust Error Handling**: Gracefully handles empty slots and missing data
6. **Backward Compatible**: Still works with single LoRA inputs

## Performance

- **Optimized**: Creates CivitAI service once, reuses for all LoRAs
- **Smart Skipping**: Avoids processing empty LoRA slots
- **Detailed Logging**: Comprehensive debug output for troubleshooting

## Related Files

- `utils/nodes.py`: Enhanced LoRAInfoExtractor with multiple LoRA support
- `utils/civitai_service.py`: CivitAI API integration service
- `docs/CIVITAI_API_KEY_WIDGET.md`: API key widget documentation

## Date

September 24, 2025
