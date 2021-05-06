import React, {useCallback, useState} from 'react'
import {useDropzone} from 'react-dropzone'
import axios from 'axios';

function MyDropzone(props) {

  const reader = new FileReader();

  const onDrop = useCallback(acceptedFiles => {
    // Do something with the files
    setFile(acceptedFiles[0])
    reader.readAsDataURL(acceptedFiles[0]);
  }, [])

  const {getRootProps, getInputProps, isDragActive} = useDropzone({onDrop})
  const [ file, setFile ] = useState();
  const [ imgPath, setImgPath ] = useState();
  const [ progress, setProgress ] = useState(0);

  reader.addEventListener("load", function () {
    // convert image file to base64 string
    setImgPath(reader.result)
  }, false);


  const uploadFile = () => {
    const formData = new FormData();
    formData.append('file', file); // appending file
    axios.post('/upload', formData, {
        onUploadProgress: (ProgressEvent) => {
            let progress = Math.round(
            ProgressEvent.loaded / ProgressEvent.total * 100);
            setProgress(progress);
        }
    }).then(res => {
        props.onFinishUpload(res.data.path)
    }).catch(err => console.log(err))
  }

  let uploadButtonDisplay;
  if (file) uploadButtonDisplay = <button onClick={uploadFile}>Upload img</button>

  return (
    <React.Fragment>
      <div className="dropzone-container" {...getRootProps()}>
        <input {...getInputProps()} />
        {
          isDragActive ?
          <p>Drop the files here ...</p> :
          <p>Drag 'n' drop some files here, or click to select files</p>
        }
        <img width="100%" src={imgPath}/>
      </div>
      {uploadButtonDisplay}
    </React.Fragment>
  )
}

export default MyDropzone;