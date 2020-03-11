import React, { useState, useEffect } from "react";
import * as advertApi from "../api/advertApi";
import { getBaseUrl } from "../api/request";
import { List, Upload, message, Button } from "antd";
import { LoadingOutlined, PlusOutlined } from "@ant-design/icons";
import "../static/AdvertMng.css";
export default function AdvertMng() {
  const [advertList, setAdvertList] = useState([]);
  const [imageUrl, setImageUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const baseUrl = getBaseUrl();
  useEffect(() => {
    advertApi.getAdverts().then(res => {
      const data = res.data.data;
      setAdvertList(data);
    });
  }, []);
  const handleFile = info => {
    if (info.file.status === "uploading") {
      setLoading(true);
      return;
    }
    if (info.file.status === "done") {
      setLoading(false);
      const url = new URL(baseUrl);

      const tempUrl = url.origin + info.file.response.url;
      setImageUrl(tempUrl);
      const data = {};
      data.advert = tempUrl;
      advertApi.addAdvert(data).then(res => {
        if (res.data.success) {
          message.success("上传成功");
          advertApi.getAdverts().then(res => {
            const data = res.data.data;
            setAdvertList(data);
            setImageUrl("");
          });
        } else {
          message.success("上传失败");
        }
      });
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
  const deleteAdvert = id => {
    advertApi.deleteAdvert(id).then(res => {
      if (res.data.success) {
        message.success("删除成功");
        advertApi.getAdverts().then(res => {
          const data = res.data.data;
          setAdvertList(data);
        });
      } else {
        message.success("删除失败");
      }
    });
  };
  return (
    <div>
      <Upload
        name="avatar"
        listType="picture-card"
        className="avatar-uploader"
        showUploadList={false}
        action={baseUrl + "upload"}
        onChange={handleFile}
        beforeUpload={beforeUpload}
      >
        {imageUrl ? (
          <img src={imageUrl} alt="avatar" style={{ width: "100%" }} />
        ) : (
          <div>
            {loading ? <LoadingOutlined /> : <PlusOutlined />}
            <div className="ant-upload-text">Upload</div>
          </div>
        )}
      </Upload>
      <List
        dataSource={advertList}
        renderItem={item => (
          <List.Item className="advert-item">
            <img className="advert-img" src={item.advert}></img>
            <Button
              type="danger"
              onClick={() => {
                deleteAdvert(item.id);
              }}
            >
              删除
            </Button>
          </List.Item>
        )}
      ></List>
    </div>
  );
}
