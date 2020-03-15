import { Input, Modal, Button, Upload, message, Row, Col } from "antd";
import React, { useState } from "react";
import { getBaseUrl } from "../api/request";

export default function(props) {
  const [imgUrl, setImgUrl] = useState("");
  const imgUrlHandler = function(e) {
    setImgUrl(e.target.value);
  };
  const upload = function() {};
  const baseUrl = getBaseUrl();
  const handleFile = info => {
    if (info.file.status === "uploading") {
      return;
    }
    if (info.file.status === "done") {
      const url = new URL(baseUrl);
      const tempUrl = url.origin + info.file.response.url;
      setImgUrl(tempUrl);
    }
  };
  const beforeUpload = function(file) {
    const isJpgOrPng = file.type === "image/jpeg" || file.type === "image/png";
    if (!isJpgOrPng) {
      message.error("You can only upload JPG/PNG file!");
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error("Image must smaller than 2MB!");
    }
    return isJpgOrPng && isLt2M;
  };
  const handleOk = () => {
    props.onOk(imgUrl);
  };
  return (
    <Modal
      cancelText="取消"
      okText="确认"
      title="上传图片"
      visible={props.visible}
      onOk={handleOk}
      onCancel={props.onCancel}
    >
      <Row>
        <Col
          span={4}
          style={{
            display: "inline-flex",
            alignItems: "center",
            paddingRight: "5px",
            justifyContent: "flex-end"
          }}
        >
          <span>图片地址</span>
        </Col>
        <Col span={16}>
          <Input value={imgUrl} onChange={imgUrlHandler}></Input>
        </Col>
        <Col span={4}>
          <Upload
            name="file"
            showUploadList={false}
            action={baseUrl + "upload"}
            onChange={handleFile}
            beforeUpload={beforeUpload}
          >
            <Button onClick={upload}>本地上传</Button>
          </Upload>
        </Col>
      </Row>
    </Modal>
  );
}
