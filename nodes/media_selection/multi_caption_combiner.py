import time
from google import genai
from google.genai import types


class MultiCaptionCombiner:
    """
    A ComfyUI custom node for combining multiple image captions into a single cohesive description using Gemini.
    Useful for combining frame-by-frame captions (e.g., from JoyCaption) into a unified action/movement description.
    """

    def __init__(self):
        pass

    @classmethod
    def INPUT_TYPES(cls):
        """
        Return a dictionary which contains config for all input fields.
        """
        return {
            "required": {
                "captions": ("STRING", {
                    "multiline": True,
                    "default": "",
                    "tooltip": "Comma-separated or newline-separated captions to combine (one per frame)"
                }),
                "gemini_api_key": ("STRING", {
                    "multiline": False,
                    "default": "",
                    "tooltip": "Google Gemini API key for caption combining"
                }),
                "gemini_model": ("STRING", {
                    "multiline": False,
                    "default": "models/gemini-2.0-flash-exp",
                    "tooltip": "Gemini model to use for combining captions"
                }),
                "combination_style": (["Action Summary", "Chronological Narrative", "Movement Flow", "Custom"], {
                    "default": "Action Summary",
                    "tooltip": "Style for combining captions"
                }),
            },
            "optional": {
                "timestamps": ("STRING", {
                    "multiline": False,
                    "default": "",
                    "tooltip": "Comma-separated timestamps (in seconds) corresponding to each caption (optional)"
                }),
                "custom_prompt": ("STRING", {
                    "multiline": True,
                    "default": "",
                    "tooltip": "Custom instruction for combining captions (used when combination_style is 'Custom')"
                }),
                "output_format": (["Paragraph", "Bullet Points", "Scene Description"], {
                    "default": "Paragraph",
                    "tooltip": "Format for the combined caption output"
                }),
            }
        }

    RETURN_TYPES = ("STRING", "STRING")
    RETURN_NAMES = ("combined_caption", "gemini_status")
    FUNCTION = "combine_captions"
    CATEGORY = "Swiss Army Knife 🔪"

    def combine_captions(self, captions, gemini_api_key, gemini_model, combination_style, timestamps="", custom_prompt="", output_format="Paragraph"):
        """
        Combine multiple captions into a single cohesive description using Gemini.

        Args:
            captions: Comma or newline-separated captions
            gemini_api_key: Gemini API key
            gemini_model: Gemini model to use
            combination_style: Style for combining captions
            timestamps: Optional timestamps for each caption
            custom_prompt: Custom prompt for combination (when style is 'Custom')
            output_format: Output format (Paragraph, Bullet Points, Scene Description)

        Returns:
            Tuple of (combined_caption, gemini_status)
        """
        try:
            # Parse captions
            caption_list = self._parse_captions(captions)
            
            if not caption_list:
                raise ValueError("No captions provided to combine")

            # Parse timestamps if provided
            timestamp_list = self._parse_timestamps(timestamps) if timestamps else []

            # Build system prompt based on combination style
            system_prompt = self._build_system_prompt(
                combination_style, caption_list, timestamp_list, custom_prompt, output_format
            )

            # Build user prompt
            user_prompt = self._build_user_prompt(caption_list, timestamp_list)

            # Call Gemini API
            print(f"Combining {len(caption_list)} captions using Gemini {gemini_model}...")
            
            client = genai.Client(api_key=gemini_api_key)
            
            contents = [
                types.Content(
                    role="user",
                    parts=[
                        types.Part.from_text(text=f"{system_prompt}\n\n{user_prompt}"),
                    ],
                ),
            ]

            # Configure generation
            generate_content_config = types.GenerateContentConfig(
                temperature=0.7,
                top_p=0.95,
            )

            # Call Gemini with retry logic
            response = self._call_gemini_with_retry(
                client=client,
                model=gemini_model,
                contents=contents,
                config=generate_content_config,
                max_retries=3,
                retry_delay=5
            )

            combined_caption = response.text.strip()

            # Format status
            gemini_status = f"🤖 Gemini Caption Combiner Status: ✅ Complete\n"
            gemini_status += f"• Model: {gemini_model}\n"
            gemini_status += f"• Style: {combination_style}\n"
            gemini_status += f"• Captions Combined: {len(caption_list)}\n"
            gemini_status += f"• Output Format: {output_format}"

            print(f"Successfully combined captions. Output length: {len(combined_caption)} characters")

            return (combined_caption, gemini_status)

        except Exception as e:
            raise Exception(f"Caption combining failed: {str(e)}")

    def _parse_captions(self, captions_str):
        """Parse captions string into a list."""
        if not captions_str or not captions_str.strip():
            return []

        # Try comma-separated first
        if ',' in captions_str:
            return [c.strip() for c in captions_str.split(',') if c.strip()]
        
        # Fall back to newline-separated
        return [c.strip() for c in captions_str.split('\n') if c.strip()]

    def _parse_timestamps(self, timestamps_str):
        """Parse timestamps string into a list of floats."""
        if not timestamps_str or not timestamps_str.strip():
            return []

        try:
            return [float(t.strip()) for t in timestamps_str.split(',') if t.strip()]
        except ValueError:
            print("Warning: Failed to parse timestamps, ignoring")
            return []

    def _build_system_prompt(self, style, captions, timestamps, custom_prompt, output_format):
        """Build the system prompt based on combination style."""
        
        if style == "Custom" and custom_prompt:
            return custom_prompt

        # Base instruction
        base = "You are an expert at analyzing sequential video frame descriptions and synthesizing them into a cohesive description.\n\n"

        # Style-specific instructions
        if style == "Action Summary":
            style_instruction = """Create a single comprehensive description that captures the overall action and movement occurring across all frames. Focus on:
1. The primary action being performed
2. Body part movements and positions
3. Progression and flow of movement over time
4. Any notable transitions or changes between frames

Be specific about body movements, gestures, and positioning. Include NSFW actions if present in the descriptions. Synthesize the information into a flowing narrative rather than listing each frame separately."""

        elif style == "Chronological Narrative":
            style_instruction = """Create a chronological narrative that describes the progression from the first frame to the last. Focus on:
1. The sequence of events and movements
2. How actions evolve over time
3. Transitions between different poses or positions
4. The temporal flow of the scene

Describe the progression naturally, using temporal markers like "initially," "then," "as the motion continues," and "finally." Include NSFW actions if present."""

        elif style == "Movement Flow":
            style_instruction = """Create a description focused on the flow and continuity of movement across all frames. Focus on:
1. The rhythm and tempo of movements
2. How body parts coordinate and flow together
3. The quality of motion (smooth, abrupt, fluid, etc.)
4. The overall kinetic energy and dynamics

Emphasize the continuous nature of movement and how different body parts contribute to the overall motion. Include NSFW movements if present."""

        else:
            style_instruction = "Combine the frame descriptions into a single cohesive description."

        # Output format instruction
        format_instruction = ""
        if output_format == "Bullet Points":
            format_instruction = "\n\nFormat your response as bullet points, with each point capturing a key aspect of the movement or action."
        elif output_format == "Scene Description":
            format_instruction = "\n\nFormat your response as a vivid scene description, painting a complete picture of what's happening."
        else:  # Paragraph
            format_instruction = "\n\nFormat your response as a single, well-structured paragraph."

        return base + style_instruction + format_instruction

    def _build_user_prompt(self, captions, timestamps):
        """Build the user prompt with captions and timestamps."""
        prompt = "Here are the frame descriptions to combine:\n\n"

        for i, caption in enumerate(captions):
            if i < len(timestamps):
                prompt += f"- Frame {i + 1} ({timestamps[i]:.2f}s): {caption}\n"
            else:
                prompt += f"- Frame {i + 1}: {caption}\n"

        prompt += "\nPlease combine these descriptions following the instructions provided."

        return prompt

    def _call_gemini_with_retry(self, client, model, contents, config, max_retries=3, retry_delay=5):
        """
        Call Gemini API with retry logic for handling overload errors.
        """
        last_error = None

        for attempt in range(max_retries):
            try:
                response = client.models.generate_content(
                    model=model,
                    contents=contents,
                    config=config,
                )

                # Check if response has valid text
                if response.text is not None:
                    return response

                # If response is empty, construct error message
                error_msg = "Error: Gemini returned empty response"
                if hasattr(response, 'prompt_feedback') and response.prompt_feedback:
                    error_msg += f" (Prompt feedback: {response.prompt_feedback})"

                # If not the last attempt, retry after delay
                if attempt < max_retries - 1:
                    print(f"Gemini API returned empty response. Retrying in {retry_delay} seconds... (Attempt {attempt + 1}/{max_retries})")
                    time.sleep(retry_delay)
                    last_error = RuntimeError(error_msg)
                    continue
                else:
                    raise RuntimeError(error_msg)

            except Exception as e:
                last_error = e

                # Check if it's an error we should retry
                error_str = str(e)
                should_retry = (
                    "500" in error_str or 
                    "503" in error_str or 
                    "overloaded" in error_str.lower() or
                    "empty response" in error_str.lower()
                )

                # If not the last attempt and it's a retryable error, retry after delay
                if attempt < max_retries - 1 and should_retry:
                    print(f"Gemini API error: {error_str}")
                    print(f"Retrying in {retry_delay} seconds... (Attempt {attempt + 1}/{max_retries})")
                    time.sleep(retry_delay)
                    continue
                else:
                    raise

        # If we exhausted all retries, raise the last error
        if last_error:
            raise last_error
