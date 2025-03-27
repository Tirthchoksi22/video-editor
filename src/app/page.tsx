"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { Button, Paper, Text, NumberInput, Group, Slider, ActionIcon, Stack } from '@mantine/core';
import { IconPlayerSkipBack, IconPlayerPlay, IconPlayerPause, IconPlayerSkipForward, IconHome, IconVideo, IconSettings, IconRadio } from '@tabler/icons-react';

export default function Home() {
  const [preview, setPreview] = useState<string | null>(null);
  const [mediaType, setMediaType] = useState<'image' | 'video' | null>(null);
  const [dimensions, setDimensions] = useState({ width: 640, height: 360 });
  const [timing, setTiming] = useState({ start: 0, end: 10 });
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(60);
  const [isComplete, setIsComplete] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isPlaying) {
      timer = setInterval(() => {
        setCurrentTime(prev => {
          if (prev >= timing.end) {
            setIsPlaying(false);
            setIsComplete(true);
            return timing.end;
          }
          return prev + 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isPlaying, timing.end]);

  const handleFileUpload = (file: File) => {
    const fileType = file.type.split('/')[0];
    if (fileType !== 'image' && fileType !== 'video') {
      alert('Please upload only images or videos');
      return;
    }

    setMediaType(fileType as 'image' | 'video');
    const fileUrl = URL.createObjectURL(file);
    setPreview(fileUrl);
    setIsComplete(false);
    
    // Set default 5s duration for images
    if (fileType === 'image') {
      setTiming({ start: 0, end: 5 });
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}.0`;
  };

  const handlePlay = () => {
    if (!preview) return; // Don't play if no media
    
    if (isComplete) {
      setIsComplete(false);
      setCurrentTime(timing.start);
    }
    
    setIsPlaying(!isPlaying);
    if (!isPlaying) {
      if (mediaType === 'video' && videoRef.current) {
        videoRef.current.currentTime = currentTime;
        videoRef.current.play();
      }
    } else {
      if (mediaType === 'video' && videoRef.current) {
        videoRef.current.pause();
      }
    }
  };

  return (
    <>
      <div className="grid grid-cols-6 h-full"> 
        <div className="col-span-1">
          <Paper shadow="xs" p="xl" h="95%">
            <div className="flex flex-col items-center justify-center">
              <Text size="xl" mb="md">Tirth&apos;s Video Editor</Text>
              <Stack gap="md" w="100%">
                <Button
                  variant="light"
                  fullWidth
                  leftSection={<IconHome size={18} />}
                  onClick={() => {}}
                >
                  Home
                </Button>
                <Button
                  variant="light" 
                  fullWidth
                  leftSection={<IconVideo size={18} />}
                  onClick={() => {}}
                >
                  Video
                </Button>
                <Button
                  variant="light"
                  fullWidth
                  leftSection={<IconRadio size={18} />}
                  onClick={() => {}}
                >
                  Audio
                </Button>
                <Button
                  variant="light"
                  fullWidth
                  leftSection={<IconSettings size={18} />}
                  onClick={() => {}}
                >
                  Settings
                </Button>
              </Stack>
            </div>
          </Paper>
        </div>
        <div className="col-span-1">
          <Paper shadow="xs" p="xl" h="95%">
            <div className="flex flex-col items-center justify-center">
              <Text size="sm" mb="md">Upload Media</Text>
              <div 
                className="border-2 border-dashed border-gray-300 rounded-lg p-6 cursor-pointer hover:border-gray-400 transition-colors"
                onClick={() => {
                  const fileInput = document.querySelector<HTMLInputElement>('#fileInput');
                  if (fileInput) fileInput.click();
                }}
                onDrop={(e: React.DragEvent) => {
                  e.preventDefault();
                  const files = e.dataTransfer.files;
                  if (files.length) {
                    handleFileUpload(files[0]);
                  }
                }}
                onDragOver={(e: React.DragEvent) => e.preventDefault()}
              >
                <input
                  type="file"
                  id="fileInput"
                  className="hidden"
                  accept="image/*,video/*"
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    if (e.target.files?.length) {
                      handleFileUpload(e.target.files[0]);
                    }
                  }}
                />
                <div className="text-center">
                  <Text size="sm" c="dimmed">Drag and drop or click to upload</Text>
                  <Text size="xs" c="dimmed">Supports images and videos</Text>
                </div>
                
              </div>
              <div className="mt-5">
              <Text mb="lg">Adjustments</Text>
              </div>
              <NumberInput
                label="Width"
                value={dimensions.width}
                onChange={(val) => setDimensions(prev => ({ ...prev, width: Number(val) }))}
                min={100}
                max={1920}
                mb="xs"
              />
              
              <NumberInput
                label="Height"
                value={dimensions.height}
                onChange={(val) => setDimensions(prev => ({ ...prev, height: Number(val) }))}
                min={100}
                max={1080}
                mb="lg"
              />

              <NumberInput
                label="Start Time (s)"
                value={timing.start}
                onChange={(val) => setTiming(prev => ({ ...prev, start: Number(val) }))}
                min={0}
                mb="xs"
              />

              <NumberInput
                label="End Time (s)"
                value={timing.end}
                onChange={(val) => setTiming(prev => ({ ...prev, end: Number(val) }))}
                min={timing.start + 1}
                mb="md"
              />

              <Group>
                <Button 
                  onClick={handlePlay}
                >
                  {isPlaying ? 'Stop' : 'Play'}
                </Button>
                <Text>Time: {currentTime}s</Text>
              </Group>
            </div>
          </Paper>
        </div>
        <div className="col-span-4 p-4">
          <div className="flex flex-col items-center justify-center">
            <Text size="xl" mb="md">Welcome to the Video Editor</Text>
          </div>
          <Paper shadow="xs" p="2xl" m="xl">
            <div className="w-full h-[500px] bg-black rounded-lg flex items-center justify-center">
              {preview && !isComplete && currentTime >= timing.start && currentTime <= timing.end ? (
                mediaType === 'image' ? (
                  <Image
                    src={preview} 
                    alt="Preview" 
                    style={{
                      width: dimensions.width,
                      height: dimensions.height,
                      objectFit: 'contain'
                    }}
                  />
                ) : (
                  <video 
                    ref={videoRef}
                    src={preview} 
                    style={{
                      width: dimensions.width,
                      height: dimensions.height,
                      objectFit: 'contain'
                    }}
                    onLoadedMetadata={(e) => {
                      const video = e.currentTarget;
                      setDuration(Math.floor(video.duration));
                    }}
                    onTimeUpdate={(e) => {
                      const video = e.currentTarget;
                      setCurrentTime(Math.floor(video.currentTime));
                      if (video.currentTime >= timing.end) {
                        video.pause();
                        setIsPlaying(false);
                        setIsComplete(true);
                      }
                    }}
                  />
                )
              ) : (
                <Text c="dimmed">
                  {preview ? 'Playback complete' : 'Upload media to preview it here'}
                </Text>
              )}
            </div>
          </Paper>
        </div>
      </div>
      <div className="mt-4 px-4">
        <div className="flex items-center gap-4">
          <Group>
            <ActionIcon 
              variant="subtle" 
              onClick={() => setCurrentTime(timing.start)}
              disabled={!preview}
            >
              <IconPlayerSkipBack size={18} />
            </ActionIcon>
            <ActionIcon 
              variant="subtle" 
              onClick={handlePlay}
              disabled={!preview}
            >
              {isPlaying ? 
                <IconPlayerPause size={20} /> : 
                <IconPlayerPlay size={20} />
              }
            </ActionIcon>
            <ActionIcon 
              variant="subtle" 
              onClick={() => setCurrentTime(timing.end)}
              disabled={!preview}
            >
              <IconPlayerSkipForward size={20} />
            </ActionIcon>
          </Group>

          <Text size="sm" className="min-w-[100px]">
            {formatTime(currentTime)} / {formatTime(duration)}
          </Text>

          <div className="flex-1">
            <Slider
              value={currentTime}
              onChange={(value) => {
                setCurrentTime(value);
                if (mediaType === 'video' && videoRef.current) {
                  videoRef.current.currentTime = value;
                }
              }}
              max={duration}
              min={0}
              label={formatTime}
              size="sm"
              disabled={!preview}
              marks={[
                { value: timing.start, label: 'Start' },
                { value: timing.end, label: 'End' },
              ]}
            />
            <div className="mt-2 flex justify-between text-xs text-gray-500 px-4">
              <span>0s</span>
              {Array.from({ length: Math.min(4, Math.ceil(duration / 20)) }, (_, i) => (i + 1) * 20).map((seconds) => (
                <span key={seconds}>{seconds}s</span>
              ))}
              {duration > 80 && <span>{Math.floor(duration / 60)}m</span>}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
