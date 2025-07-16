import axios from 'axios';

export default async function handler(req, res) {
  const { page = 1, search = '' } = req.query;
  const VIDEOS_PER_PAGE = 12;
  
  const folderIds = [
    '1-07ETGDHROV1VRp1nk8NU2p_U1Kudc2b',
    // Folder IDs lainnya
  ];

  try {
    const allVideos = [];
    
    for (const folderId of folderIds) {
      const query = `'${folderId}' in parents and 
        (mimeType contains 'video/' or 
         mimeType = 'application/vnd.google-apps.video') and 
        trashed = false`;
      
      const { data } = await axios.get(
        `https://www.googleapis.com/drive/v3/files?q=${encodeURIComponent(query)}`, {
          params: {
            fields: 'files(id,name,thumbnailLink,videoMediaMetadata)',
            key: process.env.GOOGLE_DRIVE_API_KEY || 'AIzaSyDEM3_JMht5ScNbrFVacXlxYJRaTALvuxA'
          }
        });
      
      if (data.files) {
        allVideos.push(...data.files);
      }
    }

    // Filter dan sort
    const filteredVideos = search 
      ? allVideos.filter(v => v.name.toLowerCase().includes(search.toLowerCase()))
      : allVideos;
    
    filteredVideos.sort((a, b) => a.name.localeCompare(b.name));

    // Pagination
    const startIdx = (page - 1) * VIDEOS_PER_PAGE;
    const videos = filteredVideos.slice(startIdx, startIdx + VIDEOS_PER_PAGE);
    
    res.status(200).json({
      videos,
      hasMore: startIdx + VIDEOS_PER_PAGE < filteredVideos.length,
      total: filteredVideos.length
    });
    
  } catch (error) {
    console.error('Error fetching videos:', error);
    res.status(500).json({ error: 'Failed to fetch videos' });
  }
}