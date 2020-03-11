import React from "react";
import {
  Avatar,
  Divider,
  Button,
  Modal,
  Input,
  Select,
  message,
  Upload
} from "antd";
import { useEffect, useState } from "react";
import "../static/UserInfo.css";
import * as Icons from "@ant-design/icons";
import * as userApi from "../api/userApi";
import icons from "../tools/icons";
import {
  LoadingOutlined,
  PlusOutlined,
  RightOutlined
} from "@ant-design/icons";
import { getBaseUrl } from "../api/request";
export default function UserInfo() {
  const [user, setUser] = useState({});
  const [visible, setVisible] = useState(false);
  const [account, setAccount] = useState("");
  const [description, setDescription] = useState("");
  const [icon, setIcon] = useState("");
  const [iconId, setIconId] = useState();
  const [iconControl, setIconControl] = useState(0);
  const [loading, setLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState("");
  const [introduction, setIntroduction] = useState("");
  const baseUrl = getBaseUrl();
  useEffect(() => {
    userApi.getUserInfo().then(res => {
      setUser(res.data.data);
      setIntroduction(res.data.data.introduction);
    });
  }, []);
  const handleOk = () => {
    if (!account) {
      message.error("账号地址不能为空");
      return;
    }
    if (!icon) {
      message.error("图标不能为空");
      return;
    }

    const data = {
      account,
      icon,
      userId: user.id,
      description
    };
    //添加
    if (iconControl === 0) {
      userApi.addAccount(data).then(res => {
        if (res.data.success) {
          message.success("添加成功");
          userApi.getUserInfo().then(res => {
            setUser(res.data.data);
            setIntroduction(res.data.data.introduction);
          });
        } else {
          message.error("添加失败");
        }
      });
    } else {
      data.id = iconId;
      userApi.updateAccount(data).then(res => {
        if (res.data.success) {
          message.success("更新成功");
          userApi.getUserInfo().then(res => {
            setUser(res.data.data);
            setIntroduction(res.data.data.introduction);
          });
        } else {
          message.error("更新失败");
        }
      });
    }

    setVisible(false);
  };
  const handleCancel = () => {
    setVisible(false);
  };
  const deleteAccount = () => {
    userApi.deleteAccount(iconId).then(res => {
      setVisible(false);
      if (res.data.success) {
        message.success("删除成功");
        userApi.getUserInfo().then(res => {
          setUser(res.data.data);
        });
      } else {
        message.error("删除失败");
      }
    });
  };
  const showModal = (e, item) => {
    if (item) {
      setAccount(item.account);
      setIcon(item.icon);
      setDescription(item.description);
      setIconControl(1);
      setIconId(item.id);
    } else {
      setIconControl(0);
    }
    setVisible(true);
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
  const handleFile = info => {
    if (info.file.status === "uploading") {
      setLoading(true);
      return;
    }
    if (info.file.status === "done") {
      setLoading(false);
      const url = new URL(baseUrl);
      setImageUrl(url.origin + info.file.response.url);
    }
  };
  const handleAvatarChange = () => {
    userApi.updateUser({ avatar: imageUrl }).then(res => {
      if (res.data.success) {
        userApi.getUserInfo().then(res => {
          setUser(res.data.data);
        });
        setImageUrl("");
        message.success("保存成功");
      } else {
        message.warn("保存失败");
      }
    });
  };

  const handleIntroChange = value => {
    userApi.updateUser({ introduction }).then(res => {
      if (res.data.success) {
        userApi.getUserInfo().then(res => {
          setUser(res.data.data);
        });
        setImageUrl("");
        message.success("保存成功");
      } else {
        message.warn("保存失败");
      }
    });
  };
  return (
    <div className="author-div comm-box">
      <div>
        <Divider>头像</Divider>
        <Upload
          name="avatar"
          className="avatar-uploader"
          showUploadList={false}
          action={baseUrl + "upload"}
          onChange={handleFile}
          beforeUpload={beforeUpload}
        >
          {loading && <LoadingOutlined />}
          <Avatar className="avatar" size={100} src={user.avatar}></Avatar>
          {!imageUrl && (
            <div className="confirm-replace">
              <Button>更换头像</Button>
            </div>
          )}
        </Upload>
        {imageUrl && (
          <>
            <RightOutlined />
            <RightOutlined />
            <RightOutlined />
            <Avatar
              className="history-avatar"
              size={100}
              src={imageUrl}
            ></Avatar>
            <div className="confirm-replace">
              <Button onClick={handleAvatarChange}>确认替换</Button>
            </div>
          </>
        )}
      </div>
      <div className="author-introduction">
        <Input
        className="intro"
          value={introduction}
          onChange={e => {
            setIntroduction(e.target.value);
          }}
          onBlur={handleIntroChange}
        ></Input>
        <Divider>社交账号</Divider>
        {user.account &&
          user.account.map(item => {
            const Icon = Icons[item.icon];
            return (
              // <a key={item.id} target="_blank" href={item.account}>
              <Avatar
                key={item.id}
                onClick={e => {
                  showModal(e, item);
                }}
                size={28}
                icon={<Icon />}
                className="account"
              />
            );
          })}
        <Button
          className="add-btn"
          onClick={showModal}
          icon={<Icons.PlusOutlined />}
          type="primary"
          shape="circle"
        ></Button>
      </div>
      <Modal
        title={iconControl === 0 ? "添加账号" : "更新账号"}
        visible={visible}
        onOk={handleOk}
        onCancel={handleCancel}
        cancelText="取消"
        okText={iconControl === 0 ? "添加" : "更新"}
        footer={[
          iconControl === 1 ? (
            <Button key="1" type="danger" onClick={deleteAccount}>
              删除
            </Button>
          ) : (
            <Button key="1" onClick={handleCancel}>
              取消
            </Button>
          ),
          <Button key="3" type="primary" onClick={handleOk}>
            {iconControl === 0 ? "添加" : "更新"}
          </Button>
        ]}
      >
        <div style={{ marginBottom: 16 }}>
          <Input
            placeholder="账号地址"
            value={account}
            onChange={e => {
              setAccount(e.target.value);
            }}
          ></Input>
        </div>
        <div style={{ marginBottom: 16 }}>
          <Select
            showSearch
            style={{ width: "100%" }}
            placeholder="账号图标"
            onChange={value => {
              setIcon(value);
            }}
            value={icon}
            filterOption={(input, option) => {
              return (
                option.value.toLowerCase().indexOf(input.toLowerCase()) >= 0
              );
            }}
          >
            {icons.map((item, index) => {
              let TempIcon = Icons[item];
              return (
                <Select.Option key={index} value={item}>
                  {TempIcon && <TempIcon />} {item}
                </Select.Option>
              );
            })}
          </Select>
        </div>
        <div style={{ marginBottom: 16 }}>
          <Input
            placeholder="账号描述"
            value={description}
            onChange={e => {
              setDescription(e.target.value);
            }}
          ></Input>
        </div>
      </Modal>
    </div>
  );
}
