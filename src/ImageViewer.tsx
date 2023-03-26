import { useEffect, useState } from "react";

//  describes data returned by nasa astronomy picture of the day API
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

  // fetches current APOD when date changes
  useEffect(() => {
    fetch('https://api.nasa.gov/planetary/apod?' + new URLSearchParams({
      date: date.toISOString().substring(0, 10),
      api_key: process.env.REACT_APP_NASA_API_KEY!
    }))
      .then(res => {
        return res.status === 200 ? res.json() : null;
      })
      .then(data => setImageData(data));
  }, [date]);

  // goes to previous date, used by back button
  const prevDate = () => setDate(prev => {
    const d = new Date();
    d.setTime(prev.getTime() - 1000 * 60 * 60 * 24);
    return d;
  })

  // goes to next date, used by next button
  const nextDate = () => setDate(prev => {
    const d = new Date();
    d.setTime(prev.getTime() + 1000 * 60 * 60 * 24);
    return d;
  })

  // fallback if imageData is invalid
  if(imageData === null) return <main className='image-viewer vw-100 vh-100 d-grid mh-100'>
    <div className='image-viewer-image d-flex justify-content-center align-items-center flex-column'>
      <h3>No data for {date.toISOString().substring(0, 10)}</h3>
      <button className='btn btn-outline-secondary' onClick={() => setDate(new Date())}>Return to present</button>
    </div>
  </main>;

  return <main className='image-viewer vw-100 vh-100 d-grid mh-100'>
    <div className='image-viewer-image p-3 d-flex justify-content-center align-items-center mh-100 mw-100 overflow-hidden'>
      {imageData.media_type === 'video'
        ? <iframe className='w-100 h-100' src={imageData.url}/>
        : <img src={imageData.url} className='d-block object-fit-contain'/>}
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