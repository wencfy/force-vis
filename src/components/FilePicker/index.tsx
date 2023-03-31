import React, {useState} from "react";
import {Button, Upload, UploadFile} from "antd";

const FilePicker: React.FC<{
  value?: Object
  onChange?: (value: Object) => void
}> = function ({value, onChange}) {
  const [jsonObj, setJsonObj] = useState(value);

  const beforeUpload = (file: UploadFile) => {
    return false;
  }

  const onFileChange = ({fileList}: {fileList: UploadFile[]}) => {
    const file = fileList[0]?.originFileObj;
    if (file) {
      const isJson = file.type === 'application/json';
      if (isJson) {
        readJson(file as unknown as File).then(res => {
          setJsonObj(res);
          onChange?.(res);
        });
      }
    } else {
      onChange?.({});
    }
  }

  const readJson = async (file: File) => {
    return new Promise<Object>((res, rej) => {
      const reader = new FileReader();
      reader.readAsText(file, 'UTF-8');
      reader.onload = (evt) => {
        const fileString = evt.target?.result;
        res(JSON.parse((fileString ?? '').toString()));
      }
    });
  }

  return (
    <Upload
      beforeUpload={beforeUpload}
      onChange={onFileChange}
      maxCount={1}
    >
      <Button>click</Button>
    </Upload>
  )
}

export default FilePicker;