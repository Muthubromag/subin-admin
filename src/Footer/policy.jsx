import { Modal, notification } from "antd";
import axios from "axios";
import React, { useEffect, useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { isEmpty } from "lodash";

function PolicyTerms({ data, type }) {
  const [content, setContent] = useState("");
  useEffect(() => {
    let val = data?.filter((td) => td?.type === type)?.[0];
    setContent(val?.content);
  }, []);
  const handleEditorChange = (value) => {
    setContent(value);
  };

  const handleSubmit = async () => {
    try {
      await axios.post(`${process.env.REACT_APP_URL}/whoweare`, {
        content: content,
        type: type,
      });
      notification.success({
        message: "Terms and condition created successfully",
      });
    } catch (err) {
      notification.error({ message: "Something went wrong" });
    }
  };

  return (
    <div className="policy_editor">
      <h1>Terms and condition</h1>
      <div>
        <ReactQuill
          theme="snow"
          value={content}
          onChange={handleEditorChange}
          modules={{
            toolbar: [
              [{ header: [1, 2, 3, 4, 5, 6, false] }],
              ["bold", "italic", "underline", "strike", "blockquote"],
              [{ list: "ordered" }, { list: "bullet" }],
              ["link", "image"],
              [{ size: ["small", false, "large", "huge"] }],
              ["clean"],
              [{ align: [] }],
            ],
          }}
          style={{
            color: "white",
            // maxHeight: "300px",

            marginBottom: "20px",
            overflow: "hidden",
          }}
        />
      </div>
      <div>
        <button
          type="button"
          onClick={handleSubmit}
          className="!bg-green-500 w-[100%] py-1 text-white font-bold mb-5"
        >
          Submit
        </button>
      </div>
    </div>
  );
}

export default PolicyTerms;
