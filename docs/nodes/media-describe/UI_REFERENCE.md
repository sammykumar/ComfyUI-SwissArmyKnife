# MediaDescribe Node - Updated UI Reference

## Node Inputs

### Required Inputs

- **media_source**: Upload Media | Randomize Media from Path | Reddit Post | Randomize from Subreddit
- **media_type**: image | video
- **seed**: Integer (for randomization)

### Optional Inputs

#### Configuration

- **gemini_options**: Configuration from Gemini Util - Options node

#### Media Sources

- **media_path**: Directory path for random selection
- **uploaded_image_file**: Path to uploaded image
- **uploaded_video_file**: Path to uploaded video
- **frame_rate**: Video frame rate (1.0-60.0)
- **max_duration**: Max video duration in seconds
- **reddit_url**: Reddit post URL
- **subreddit_url**: Subreddit URL or name

#### **NEW: Paragraph Overrides** ⭐

- **override_subject**: 📝 Custom subject paragraph (multiline text)
- **override_cinematic_aesthetic**: 🎬 Custom cinematic aesthetic paragraph (multiline text)
- **override_stylization_tone**: 🎨 Custom stylization & tone paragraph (multiline text)
- **override_clothing**: 👔 Custom clothing paragraph (multiline text)
- **override_scene**: 🏞️ Custom scene paragraph (multiline text, video only)
- **override_movement**: 💃 Custom movement paragraph (multiline text, video only)

## Node Outputs

### Existing Outputs (Unchanged)

1. **description** (STRING) - Full combined description
2. **media_info** (STRING) - Media information
3. **gemini_status** (STRING) - Gemini API status
4. **processed_media_path** (STRING) - Path to processed media
5. **final_string** (STRING) - Description with prefix
6. **height** (INT) - Media height
7. **width** (INT) - Media width
8. **all_media_describe_data** (STRING) - Aggregated JSON data

### **NEW: Individual Paragraph Outputs** ⭐

9. **subject** (STRING) - Subject paragraph
10. **cinematic_aesthetic** (STRING) - Cinematic aesthetic paragraph
11. **stylization_tone** (STRING) - Stylization & tone paragraph
12. **clothing** (STRING) - Clothing paragraph
13. **scene** (STRING) - Scene paragraph (video only)
14. **movement** (STRING) - Movement paragraph (video only)

## Visual Layout Example

```
┌─────────────────────────────────────────────────────────────┐
│  MediaDescribe (Gemini Util - Media Describe)               │
├─────────────────────────────────────────────────────────────┤
│  Required:                                                   │
│  ├─ media_source: [Upload Media ▼]                         │
│  ├─ media_type: [image ▼]                                  │
│  └─ seed: 0                                                 │
├─────────────────────────────────────────────────────────────┤
│  Optional:                                                   │
│  ├─ gemini_options: ○ (connect to Gemini Util - Options)   │
│  ├─ media_path: ""                                          │
│  ├─ uploaded_image_file: ""                                 │
│  ├─ uploaded_video_file: ""                                 │
│  ├─ frame_rate: 30.0                                        │
│  ├─ max_duration: 5.0                                       │
│  ├─ reddit_url: ""                                          │
│  └─ subreddit_url: ""                                       │
├─────────────────────────────────────────────────────────────┤
│  ⭐ NEW: Paragraph Overrides                                │
│  ├─ override_subject: ┌─────────────────────────────┐     │
│  │                     │                             │     │
│  │                     │ (multiline text input)     │     │
│  │                     │                             │     │
│  │                     └─────────────────────────────┘     │
│  ├─ override_cinematic_aesthetic: ┌───────────────┐       │
│  │                                 │               │       │
│  │                                 │ (multiline)  │       │
│  │                                 └───────────────┘       │
│  ├─ override_stylization_tone: (multiline)                │
│  ├─ override_clothing: (multiline)                        │
│  ├─ override_scene: (multiline, video only)               │
│  └─ override_movement: (multiline, video only)            │
└─────────────────────────────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────────┐
│  Outputs:                                                    │
│  ○─ description (STRING)                                    │
│  ○─ media_info (STRING)                                     │
│  ○─ gemini_status (STRING)                                  │
│  ○─ processed_media_path (STRING)                           │
│  ○─ final_string (STRING)                                   │
│  ○─ height (INT)                                            │
│  ○─ width (INT)                                             │
│  ○─ all_media_describe_data (STRING)                        │
│  ⭐ NEW Individual Paragraphs:                              │
│  ○─ subject (STRING)                                        │
│  ○─ cinematic_aesthetic (STRING)                            │
│  ○─ stylization_tone (STRING)                               │
│  ○─ clothing (STRING)                                       │
│  ○─ scene (STRING, video only)                              │
│  ○─ movement (STRING, video only)                           │
└─────────────────────────────────────────────────────────────┘
```

## Example Workflow Connections

### Basic Usage (No Overrides)

```
[Gemini Util - Options] ──(gemini_options)──→ [MediaDescribe]
                                                      │
                                                      ├─(description)─→ [Display Text]
                                                      └─(final_string)─→ [Next Node]
```

### With Paragraph Overrides

```
[Custom Text Input] ──→ override_subject ──┐
[Custom Text Input] ──→ override_clothing ─┤
                                            ├──→ [MediaDescribe]
[Gemini Util - Options] ──(gemini_options)─┘          │
                                                       ├─(description)─→ [Uses custom + Gemini]
                                                       └─(subject)────→ [Shows custom text]
```

### Using Individual Outputs

```
                               ┌─(subject)──────────┐
                               ├─(cinematic_aesth)─┤
[MediaDescribe] ──┤            ├─(stylization)─────┼──→ [Individual Processing]
                               ├─(clothing)────────┤
                               └─(description)─────┘
```

### Feedback Loop Workflow

```
[MediaDescribe] ─┬─(subject)──────────┐
                 ├─(cinematic_aesth)──┼──→ [Review/Edit UI]
                 └─(clothing)─────────┘            │
                                                    ▼
                 ┌──────────────────────────────────┘
                 ▼
[MediaDescribe] (with overrides from edited values)
```

## Common Use Patterns

### Pattern 1: Subject Override Only

```python
# Set only subject override, let Gemini handle rest
override_subject = "A woman with sleek ponytail, hands on hips, gazing confidently."
override_cinematic_aesthetic = ""  # Empty = use Gemini
override_stylization_tone = ""     # Empty = use Gemini
override_clothing = ""              # Empty = use Gemini
```

### Pattern 2: Style Template

```python
# Use consistent cinematic style across batches
override_subject = ""  # Let Gemini analyze
override_cinematic_aesthetic = "Warm golden hour light, 85mm lens, f/2.8 shallow DOF"
override_stylization_tone = "Cinematic realism with dreamy, nostalgic mood"
override_clothing = ""  # Let Gemini describe
```

### Pattern 3: Complete Custom

```python
# Full control - use custom text only
override_subject = "Custom subject description"
override_cinematic_aesthetic = "Custom lighting and camera setup"
override_stylization_tone = "Custom mood and style"
override_clothing = "Custom clothing description"
# Result: Gemini still runs but output is completely replaced
```

## Tips & Best Practices

1. **Leave fields empty** if you want Gemini to generate that paragraph
2. **Individual outputs** can be connected to text widgets for review
3. **Override fields** accept any text - no validation (be specific!)
4. **Video paragraphs** (scene, movement) only apply to videos
5. **Caching still works** - overrides applied after cache lookup
6. **Mix and match** - some custom, some AI for best results

---

**Reference Date**: October 7, 2025  
**Node Version**: With Paragraph Override Feature  
**UI Type**: ComfyUI Custom Node
