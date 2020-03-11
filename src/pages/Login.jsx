import React, { useState } from "react";
import { Card, Input, Button, Spin, message } from "antd";
import "../static/Login.css";
import * as articleApi from "../api/articleApi";

function Login(props) {
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [inloading, setInloading] = useState(false);
  const checkLogin = () => {
    if (!userName) {
      message.error("用户名不能为空");
      return false;
    }
    if (!password) {
      message.error("密码不能为空");
      return false;
    }
    setInloading(true);
    articleApi.checkLogin(userName, password).then(res => {
      if (res.data.data === "登陆成功") {
        message.success("登陆成功");
        localStorage.setItem("openId", res.data.openId);
        props.history.push("/index");
      } else {
        message.error("用户名或密码错误");
      }
      setInloading(false);
    });
  };
  return (
    <div className="login-div">
      <Spin tip="Loading..." spinning={inloading}>
        <Card title="Blog System" bordered={true} style={{ width: 400 }}>
          <Input
            id="userName"
            size="large"
            placeholder="Enter your username"
            onChange={e => {
              setUserName(e.target.value);
            }}
          ></Input>
          <br />
          <br />
          <Input
            id="password"
            size="large"
            placeholder="Enter your password"
            type="password"
            onChange={e => {
              setPassword(e.target.value);
            }}
          ></Input>
          <br />
          <br />
          <Button type="primary" size="large" block onClick={checkLogin}>
            Login
          </Button>
        </Card>
      </Spin>
    </div>
  );
}
export default Login;
