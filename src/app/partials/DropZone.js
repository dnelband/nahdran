import React, { useCallback, useEffect, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import axios from 'axios';

function MyDropzone(props) {
  const reader = new FileReader();

  const onDrop = useCallback(acceptedFiles => {
    // Do something with the files
    setFile(acceptedFiles[0]);
    reader.readAsDataURL(acceptedFiles[0]);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });
  const [file, setFile] = useState();
  const [fileData, setFileData] = useState();
  const [progress, setProgress] = useState(0);
  const [showImg, setShowImg] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);

  reader.addEventListener(
    'load',
    function () {
      // convert image file to base64 string
      setFileData(reader.result);
      setShowImg(true);
    },
    false
  );

  const uploadFile = () => {
    const formData = new FormData();
    formData.append('file', file); // appending file
    axios
      .post('/upload', formData, {
        onUploadProgress: ProgressEvent => {
          let progress = Math.round(
            (ProgressEvent.loaded / ProgressEvent.total) * 100
          );
          setProgress(progress);
        },
      })
      .then(res => {
        props.onFinishUpload(res.data);
        setUploadSuccess(true);
      })
      .catch(err => console.log(err));
  };

  let itemDisplay, uploadButtonDisplay;
  if (file) {
    if (file.type.indexOf('image') > -1)
      itemDisplay = <img width="100%" src={fileData} />;
    else if (file.type.indexOf('video') > -1) {
      itemDisplay = (
        <video src={fileData} width="320" height="240" controls>
          <source src={fileData} type={file.type}></source>
        </video>
      );
    }
    if (uploadSuccess === false) {
      uploadButtonDisplay = <button onClick={uploadFile}>Upload img</button>;
    } else {
      uploadButtonDisplay = <i class="check icon"></i>;
    }
  }

  let textDisplay;
  if (showImg === false) {
    textDisplay = (
      <p>Drag 'n' drop some files here, or click to select files</p>
    );
  } else {
    textDisplay = '';
  }
  return (
    <div className="ui segment">
      <div className="dropzone-container" {...getRootProps()}>
        <input {...getInputProps()} />
        {isDragActive ? <p>Drop the files here ...</p> : textDisplay}
        {itemDisplay}
      </div>
      {uploadButtonDisplay}
    </div>
  );
}

export default MyDropzone;
