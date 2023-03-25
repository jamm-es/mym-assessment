import { useEffect, useState } from "react";

interface APODData {
  copyright:       string;
  date:            string;
  explanation:     string;
  hdurl:           string;
  media_type:      string;
  service_version: string;
  title:           string;
  url:             string;
}


function ImageViewer() {
  const [date, setDate] = useState(new Date());
  const [imageData, setImageData] = useState<APODData | null>(null);

  useEffect(() => {
    console.log(process.env);
    fetch('https://api.nasa.gov/planetary/apod?' + new URLSearchParams({
      date: date.toISOString().substring(0, 10),
      api_key: process.env.NASA_API_KEY!
    }))
      .then(res => {
        return res.status === 200 ? res.json() : null;
      })
      .then(data => setImageData(data));
  }, [date]);

  const prevDate = () => setDate(prev => {
    const d = new Date();
    d.setTime(prev.getTime() - 1000 * 60 * 60 * 24);
    return d;
  })

  const nextDate = () => setDate(prev => {
    const d = new Date();
    d.setTime(prev.getTime() + 1000 * 60 * 60 * 24);
    return d;
  })

  if(imageData === null) return <main className='image-viewer vw-100 vh-100 d-grid mh-100'>
    <div className='image-viewer-image d-flex justify-content-center align-items-center flex-column'>
      <h3>No data for {date.toISOString().substring(0, 10)}</h3>
      <button className='btn btn-outline-secondary' onClick={() => setDate(new Date())}>Return to present</button>
    </div>
  </main>;

  return <main className='image-viewer vw-100 vh-100 d-grid mh-100'>
    <div className='image-viewer-image p-3 d-flex justify-content-center align-items-center mh-100 mw-100 overflow-hidden'>
      <img src={imageData.url} className='d-block object-fit-contain'/>
    </div>
    <h4 className='image-viewer-title text-center'>{imageData.title}</h4>
    <div className='image-viewer-credits text-center d-flex align-items-end mb-3 mx-auto'>
      <div onClick={prevDate} style={{ cursor: 'pointer' }}>
        <i className='fa-solid fa-chevron-left mx-2'/>
      </div>
      <div className='flex-grow-1'>
        <p className='fst-italic mb-0'>{imageData.date}</p>
      </div>
      <div onClick={nextDate} style={{ cursor: 'pointer' }}>
        <i className='fa-solid fa-chevron-right mx-2'/>
      </div>
    </div>
  </main>
}

export default ImageViewer;