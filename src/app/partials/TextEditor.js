import React, { useState, useEffect } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import "../style/text-editor.css";

function TextEditor(props) {

  let initText = props.val ? props.val : "";

  const [convertedText, setConvertedText] = useState(initText);
  useEffect(() => {
    props.onTextEditorUpdate(convertedText);
  }, [convertedText]);

  const modules = {
    toolbar: [
      [{ header: [1, 2, false] }],
      ["bold", "italic", "underline", "strike", "blockquote"],
      [
        { list: "ordered" },
        { list: "bullet" },
        { indent: "-1" },
        { indent: "+1" },
      ],
      ["link", "image"],
      ["clean"],
    ],
  };

  return (
    <div>
      <ReactQuill
        theme="snow"
        value={convertedText}
        onChange={setConvertedText}
        style={{ minHeight: "300px" }}
        modules={modules}
      />
    </div>
  );
}

export default TextEditor;
