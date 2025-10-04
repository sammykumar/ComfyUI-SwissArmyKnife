<template>
    <div class="video-comparison-widget">
        <div class="video-grid" :class="`grid-${activeVideos.length}`">
            <div
                v-for="(video, index) in videoSlots"
                :key="video.key"
                class="video-panel"
                :class="{ active: video.src }"
            >
                <div class="video-header">
                    <span class="video-label">{{ video.label }}</span>
                    <span v-if="video.src" class="video-status">✓ Loaded</span>
                    <span v-else class="video-status pending">Waiting...</span>
                </div>
                <div class="video-container">
                    <VideoPlayer
                        v-if="video.src"
                        :ref="(el) => setPlayerRef(index, el)"
                        :src="video.src"
                        :options="playerOptions"
                        @ready="onPlayerReady(index)"
                        @timeupdate="onTimeUpdate(index, $event)"
                        @play="onPlay(index)"
                        @pause="onPause(index)"
                    />
                    <div v-else class="video-placeholder">
                        <i class="pi pi-video"></i>
                        <p>{{ t('videoComparison.waitingForVideo') }}</p>
                    </div>
                </div>
            </div>
        </div>

        <div class="controls-panel">
            <div class="playback-controls">
                <Button
                    :icon="isPlaying ? 'pi pi-pause' : 'pi pi-play'"
                    :label="
                        isPlaying
                            ? t('videoComparison.pauseAll')
                            : t('videoComparison.playAll')
                    "
                    @click="togglePlayAll"
                    :disabled="activeVideos.length === 0"
                    size="small"
                />
                <Button
                    icon="pi pi-sync"
                    :label="t('videoComparison.sync')"
                    @click="syncAllVideos"
                    :disabled="activeVideos.length < 2"
                    size="small"
                    severity="secondary"
                />
                <Button
                    :icon="isMuted ? 'pi pi-volume-off' : 'pi pi-volume-up'"
                    :label="
                        isMuted
                            ? t('videoComparison.unmute')
                            : t('videoComparison.mute')
                    "
                    @click="toggleMuteAll"
                    :disabled="activeVideos.length === 0"
                    size="small"
                    severity="secondary"
                />
            </div>

            <div class="timeline-controls">
                <span class="time-display">{{ formatTime(currentTime) }}</span>
                <Slider
                    v-model="currentTime"
                    :min="0"
                    :max="duration"
                    :step="0.1"
                    @update:modelValue="onSeek"
                    :disabled="activeVideos.length === 0"
                    class="timeline-slider"
                />
                <span class="time-display">{{ formatTime(duration) }}</span>
            </div>

            <div class="info-panel">
                <span class="video-count"
                    >{{ activeVideos.length }} / {{ videoSlots.length }}
                    {{ t('videoComparison.videosLoaded') }}</span
                >
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, onBeforeUnmount, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { VideoPlayer } from '@videojs-player/vue';
import Button from 'primevue/button';
import Slider from 'primevue/slider';
import type { ComponentWidget } from '@/types/comfyui';
import type { VideoJsPlayer } from 'video.js';
import 'video.js/dist/video-js.css';

// i18n support
const { t } = useI18n();

// Props
const props = defineProps<{
    widget: ComponentWidget;
    referenceVideo?: string;
    baseVideo?: string;
    upscaledVideo?: string;
}>();

// Player references
const players = ref<(VideoJsPlayer | null)[]>([null, null, null]);
const playerRefs = ref<any[]>([]);

// State
const isPlaying = ref(false);
const isMuted = ref(false);
const currentTime = ref(0);
const duration = ref(0);
const isSeeking = ref(false);

// Video.js player options
const playerOptions = {
    controls: true,
    responsive: true,
    fluid: true,
    aspectRatio: '9:16',
    playbackRates: [0.5, 1, 1.5, 2],
    controlBar: {
        pictureInPictureToggle: false,
    },
};

// Video slots configuration
const videoSlots = computed(() => [
    {
        key: 'reference',
        label: t('videoComparison.referenceVideo'),
        src: props.referenceVideo,
    },
    {
        key: 'base',
        label: t('videoComparison.baseVideo'),
        src: props.baseVideo,
    },
    {
        key: 'upscaled',
        label: t('videoComparison.upscaledVideo'),
        src: props.upscaledVideo,
    },
]);

// Active videos (those that have a source)
const activeVideos = computed(() => videoSlots.value.filter((v) => v.src));

// Set player ref
function setPlayerRef(index: number, el: any) {
    if (el) {
        playerRefs.value[index] = el;
    }
}

// Player ready handler
function onPlayerReady(index: number) {
    const playerRef = playerRefs.value[index];
    if (playerRef && playerRef.player) {
        players.value[index] = playerRef.player;

        // Update duration from the first loaded video
        if (duration.value === 0) {
            duration.value = playerRef.player.duration() || 0;
        }

        console.log(`Video player ${index} ready`, {
            duration: playerRef.player.duration(),
        });
    }
}

// Time update handler
function onTimeUpdate(index: number, _event: any) {
    if (!isSeeking.value && players.value[index]) {
        const player = players.value[index];
        if (player) {
            currentTime.value = player.currentTime();

            // Update duration if it wasn't set or changed
            const newDuration = player.duration();
            if (newDuration && newDuration !== duration.value) {
                duration.value = newDuration;
            }
        }
    }
}

// Play handler
function onPlay(_index: number) {
    isPlaying.value = true;
}

// Pause handler
function onPause(_index: number) {
    // Check if all videos are paused
    const allPaused = players.value
        .filter((p) => p !== null)
        .every((p) => p!.paused());

    if (allPaused) {
        isPlaying.value = false;
    }
}

// Toggle play/pause all videos
function togglePlayAll() {
    const activePlayers = players.value.filter((p) => p !== null);

    if (isPlaying.value) {
        activePlayers.forEach((player) => player!.pause());
        isPlaying.value = false;
    } else {
        activePlayers.forEach((player) => player!.play());
        isPlaying.value = true;
    }
}

// Sync all videos to the same time
function syncAllVideos() {
    const activePlayers = players.value.filter((p) => p !== null);
    if (activePlayers.length < 2) return;

    // Use the first player's time as reference
    const referenceTime = activePlayers[0]!.currentTime();

    activePlayers.forEach((player, index) => {
        if (index > 0) {
            player!.currentTime(referenceTime);
        }
    });

    currentTime.value = referenceTime;

    console.log('Videos synced to time:', referenceTime);
}

// Toggle mute all videos
function toggleMuteAll() {
    const activePlayers = players.value.filter((p) => p !== null);
    isMuted.value = !isMuted.value;

    activePlayers.forEach((player) => {
        player!.muted(isMuted.value);
    });
}

// Seek all videos to a specific time
function onSeek(value: number | number[]) {
    const seekTime = Array.isArray(value) ? (value[0] ?? 0) : value;
    isSeeking.value = true;
    const activePlayers = players.value.filter((p) => p !== null);

    activePlayers.forEach((player) => {
        player!.currentTime(seekTime);
    });

    // Small delay to prevent jitter
    setTimeout(() => {
        isSeeking.value = false;
    }, 100);
}

// Format time in MM:SS format
function formatTime(seconds: number): string {
    if (!isFinite(seconds) || seconds < 0) return '00:00';

    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

// Watch for video source changes
watch(
    () => [props.referenceVideo, props.baseVideo, props.upscaledVideo],
    () => {
        console.log('Video sources updated:', {
            reference: props.referenceVideo,
            base: props.baseVideo,
            upscaled: props.upscaledVideo,
        });
    },
);

// Cleanup on unmount
onBeforeUnmount(() => {
    players.value.forEach((player) => {
        if (player) {
            player.dispose();
        }
    });
});
</script>

<style scoped>
.video-comparison-widget {
    display: flex;
    flex-direction: column;
    gap: 16px;
    padding: 16px;
    background-color: var(--surface-ground, #1e1e1e);
    border-radius: 8px;
    font-family: var(--font-family, 'Inter', sans-serif);
}

.video-grid {
    display: grid;
    gap: 16px;
    width: 100%;
}

.video-grid.grid-1 {
    grid-template-columns: 1fr;
}

.video-grid.grid-2 {
    grid-template-columns: repeat(2, 1fr);
}

.video-grid.grid-3 {
    grid-template-columns: repeat(3, 1fr);
}

.video-panel {
    display: flex;
    flex-direction: column;
    gap: 8px;
    background-color: var(--surface-card, #2a2a2a);
    border-radius: 6px;
    padding: 12px;
    transition: opacity 0.3s ease;
}

.video-panel:not(.active) {
    opacity: 0.6;
}

.video-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-bottom: 8px;
    border-bottom: 1px solid var(--surface-border, #3a3a3a);
}

.video-label {
    font-weight: 600;
    font-size: 14px;
    color: var(--text-color, #e0e0e0);
}

.video-status {
    font-size: 12px;
    color: var(--green-500, #4caf50);
}

.video-status.pending {
    color: var(--yellow-500, #ffc107);
}

.video-container {
    position: relative;
    width: 100%;
    aspect-ratio: 9 / 16;
    background-color: #000;
    border-radius: 4px;
    overflow: hidden;
}

.video-placeholder {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100%;
    color: var(--text-color-secondary, #9e9e9e);
}

.video-placeholder i {
    font-size: 48px;
    margin-bottom: 12px;
    opacity: 0.5;
}

.video-placeholder p {
    margin: 0;
    font-size: 14px;
}

.controls-panel {
    display: flex;
    flex-direction: column;
    gap: 12px;
    padding: 16px;
    background-color: var(--surface-card, #2a2a2a);
    border-radius: 6px;
}

.playback-controls {
    display: flex;
    gap: 8px;
    flex-wrap: wrap;
}

.timeline-controls {
    display: flex;
    align-items: center;
    gap: 12px;
}

.time-display {
    font-family: 'Courier New', monospace;
    font-size: 14px;
    color: var(--text-color, #e0e0e0);
    min-width: 50px;
    text-align: center;
}

.timeline-slider {
    flex: 1;
}

.info-panel {
    display: flex;
    justify-content: center;
    padding-top: 8px;
    border-top: 1px solid var(--surface-border, #3a3a3a);
}

.video-count {
    font-size: 13px;
    color: var(--text-color-secondary, #9e9e9e);
}

/* Responsive design */
@media (max-width: 1024px) {
    .video-grid.grid-3 {
        grid-template-columns: repeat(2, 1fr);
    }
}

@media (max-width: 640px) {
    .video-grid.grid-2,
    .video-grid.grid-3 {
        grid-template-columns: 1fr;
    }

    .playback-controls {
        flex-direction: column;
    }
}
</style>
