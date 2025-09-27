const express = require('express');
const ytdl = require('@distube/ytdl-core');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3001;

// Enable CORS for all routes with specific headers for audio streaming
app.use(cors({
  origin: ['http://localhost:3000', 'http://127.0.0.1:3000', 'http://localhost:5173', 'http://127.0.0.1:5173'],
  credentials: true,
  exposedHeaders: ['Content-Range', 'Accept-Ranges', 'Content-Length']
}));
app.use(express.json());

// Extract video ID from YouTube URL
function getVideoId(url) {
  const regex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
  const match = url.match(regex);
  return match ? match[1] : null;
}

// Get video info endpoint
app.get('/info/:videoId', async (req, res) => {
  try {
    const { videoId } = req.params;
    
    if (!ytdl.validateID(videoId)) {
      return res.status(400).json({ error: 'Invalid YouTube video ID' });
    }

    const info = await ytdl.getInfo(videoId);
    const videoDetails = {
      title: info.videoDetails.title,
      author: info.videoDetails.author.name,
      lengthSeconds: info.videoDetails.lengthSeconds,
      thumbnail: info.videoDetails.thumbnails[0]?.url
    };

    res.json(videoDetails);
  } catch (error) {
    console.error('Error getting video info:', error);
    res.status(500).json({ error: 'Failed to get video information' });
  }
});

// Stream audio endpoint with range support
app.get('/stream/:videoId', async (req, res) => {
  try {
    const { videoId } = req.params;
    console.log(`🎵 Streaming request for video ID: ${videoId}`);
    console.log(`📡 Request headers:`, req.headers);
    
    if (!ytdl.validateID(videoId)) {
      console.log(`❌ Invalid video ID: ${videoId}`);
      return res.status(400).json({ error: 'Invalid YouTube video ID' });
    }

    const info = await ytdl.getInfo(videoId);
    const audioFormats = ytdl.filterFormats(info.formats, 'audioonly');
    
    console.log(`📊 Found ${audioFormats.length} audio formats`);
    
    if (audioFormats.length === 0) {
      console.log(`❌ No audio formats available for video: ${videoId}`);
      return res.status(404).json({ error: 'No audio format available' });
    }

    // Prefer MP4/AAC format for better browser compatibility
    let format = audioFormats.find(f => f.mimeType && f.mimeType.includes('mp4'));
    if (!format) {
      // Fallback to any available format
      format = audioFormats[0];
    }
    console.log(`🎧 Selected format:`, {
      itag: format.itag,
      mimeType: format.mimeType,
      contentLength: format.contentLength,
      audioQuality: format.audioQuality
    });
    const range = req.headers.range;

    if (range) {
      // Handle range requests for seeking support
      const parts = range.replace(/bytes=/, "").split("-");
      const start = parseInt(parts[0], 10);
      const end = parts[1] ? parseInt(parts[1], 10) : undefined;

      const stream = ytdl(videoId, {
        format: format,
        range: { start, end }
      });

      const contentType = format.mimeType || 'audio/mp4';
      res.writeHead(206, {
        'Content-Range': `bytes ${start}-${end || ''}/${format.contentLength || '*'}`,
        'Accept-Ranges': 'bytes',
        'Content-Length': end ? end - start + 1 : format.contentLength - start,
        'Content-Type': contentType,
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Range',
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      });

      stream.on('error', (streamError) => {
        console.error('❌ Stream error (range):', streamError);
        if (!res.headersSent) {
          res.status(500).json({ error: 'Stream failed' });
        }
      });
      
      stream.pipe(res);
    } else {
      // Regular streaming without range
      const stream = ytdl(videoId, {
        format: format,
        quality: 'highestaudio'
      });

      const contentType = format.mimeType || 'audio/mp4';
      res.writeHead(200, {
        'Content-Type': contentType,
        'Accept-Ranges': 'bytes',
        'Content-Length': format.contentLength,
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Range',
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      });

      stream.on('error', (streamError) => {
        console.error('❌ Stream error (regular):', streamError);
        if (!res.headersSent) {
          res.status(500).json({ error: 'Stream failed' });
        }
      });
      
      stream.pipe(res);
    }

    console.log(`Streaming audio for video: ${info.videoDetails.title}`);
  } catch (error) {
    console.error('Error streaming audio:', error);
    res.status(500).json({ error: 'Failed to stream audio' });
  }
});

// Stream audio by URL endpoint
app.post('/stream-url', async (req, res) => {
  try {
    const { url } = req.body;
    
    if (!url) {
      return res.status(400).json({ error: 'YouTube URL is required' });
    }

    const videoId = getVideoId(url);
    if (!videoId) {
      return res.status(400).json({ error: 'Invalid YouTube URL' });
    }

    // Redirect to the stream endpoint
    res.json({ 
      streamUrl: `http://localhost:${PORT}/stream/${videoId}`,
      videoId: videoId
    });
  } catch (error) {
    console.error('Error processing URL:', error);
    res.status(500).json({ error: 'Failed to process YouTube URL' });
  }
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'OK', service: 'YouTube Audio Streaming Service' });
});

app.listen(PORT, () => {
  console.log(`🎵 YouTube Audio Streaming Service running on port ${PORT}`);
  console.log(`🔗 Health check: http://localhost:${PORT}/health`);
});

// Handle graceful shutdown
process.on('SIGINT', () => {
  console.log('\n🛑 Shutting down YouTube Audio Streaming Service...');
  process.exit(0);
});