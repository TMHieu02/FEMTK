import React, { useState } from 'react';
import AvatarEditor from 'react-avatar-editor';
import { useDropzone } from 'react-dropzone';
import axios from 'axios';
import drag_drop from '../../assets/Images/drag_drop.jpg';
import sha1 from 'js-sha1';
import axiosClient from '../../api/axiosClient';
import UserAPI from '../../api/UserAPI';
import cogoToast from 'cogo-toast';

function MyEditor() {
  const [image, setImage] = useState(drag_drop);
  const [editor, setEditor] = useState(null);

  const { getRootProps, getInputProps } = useDropzone({
    onDrop: (dropped) => {
      setImage(dropped[0]);
    },
    noClick: false,
    noKeyboard: true,
  });

  const handleSave = async () => {
    if (editor) {
      const canvas = editor.getImageScaledToCanvas();
      canvas.toBlob(async (blob) => {
        const formData = new FormData();
        formData.append('file', blob, 'avatar.jpg');
        const response = await axiosClient.post('/files/cloud/upload', formData, {
          headers: {
            'Content-Type': `multipart/form-data; boundary=${formData._boundary}`,
            'Accept': '*/*',
          },
        });
        const res = await UserAPI.updateAvatar(response.data.data);
        if (!res.error)
          cogoToast.success('Successfully update avatar', {
            position: 'bottom-right',
            hideAfter: 3,
            onClick: () => console.log('Clicked'),
          });
      });
    }
  };

  const setEditorRef = (editor) => {
    setEditor(editor);
  };

  return (
    <>
      <p className="d-flex justify-content-center" style={{ fontSize: '20px' }}>
        Kéo thả hoặc chọn ảnh
      </p>
      <div className="d-flex justify-content-center align-items-center">
        <br />
        <div {...getRootProps()} style={{ width: '200px', height: '200px' }}>
          <AvatarEditor ref={setEditorRef} width={150} height={150} image={image} border={10} />
          <input {...getInputProps()} />
        </div>
      </div>
      <div className="d-flex justify-content-center">
        <button type="button" className="btn btn-primary" onClick={handleSave}>
          Save
        </button>
      </div>
    </>
  );
}

export default MyEditor;
