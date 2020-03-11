import React, { useState } from "react";
import { Layout, Menu, Breadcrumb } from "antd";
import {
  DesktopOutlined,
  PieChartOutlined,
  FileOutlined,
  EditOutlined,
  SnippetsOutlined,
  UserOutlined
} from "@ant-design/icons";
import "../static/AdminIndex.css";
import { Route } from "react-router-dom";
import AddArticle from "./AddArticle";
import ArticleList from "./ArticleList";
import { Link } from "react-router-dom";
import UserInfo from "./UserInfo";
import AdvertMng from "./AdvertMng";
const { Content, Footer, Sider } = Layout;
const { SubMenu } = Menu;
export default function AdminIndex(props) {
  let pathname = props.location.pathname;

  const [collapsed, setCollapsed] = useState(false);
  const onCollapse = collapsed => {
    setCollapsed(collapsed);
  };
  const handleClickArticle = e => {
    if (e.key === "/index/add") {
      props.history.push("/index/add");
    } else {
      props.history.push("/index/list");
    }
  };
  return (
    <Layout
      style={{
        minHeight: "100vh"
      }}
    >
      <Sider
        collapsible
        collapsed={collapsed}
        style={{
          position: "fixed",
          minHeight: "100vh",
          overflow: "auto",
          left: "0"
        }}
        onCollapse={onCollapse}
      >
        <div className="logo" />
        <Menu theme="dark" defaultOpenKeys={['articleControl']} defaultSelectedKeys={[pathname]} mode="inline">
          <Menu.Item key="/index/">
            <Link to="/index/">
              <PieChartOutlined />
              <span>工作台</span>
            </Link>
          </Menu.Item>
          <Menu.Item key="/index/userInfo">
            <Link to="/index/userInfo">
              <UserOutlined />
              <span>我的信息</span>
            </Link>
          </Menu.Item>
          <SubMenu
            key="articleControl"
            onClick={handleClickArticle}
            title={
              <span>
                <DesktopOutlined />
                <span>文章管理</span>
              </span>
            }
          >
            <Menu.Item key="/index/add">
              <EditOutlined />
              <span>添加文章</span>
            </Menu.Item>
            <Menu.Item key="/index/list">
              <SnippetsOutlined />
              文章列表
            </Menu.Item>
          </SubMenu>
          <Menu.Item key="/index/advert">
            <Link to="/index/advert">
              <UserOutlined />
              <span>广告管理</span>
            </Link>
          </Menu.Item>
          <Menu.Item key="9">
            <FileOutlined />
            <span>留言管理</span>
          </Menu.Item>
        </Menu>
      </Sider>
      <Layout className="site-layout" style={{ marginLeft: 200 }}>
        <Content style={{ margin: "0 16px" }}>
          <Breadcrumb style={{ margin: "16px 0" }}>
            <Breadcrumb.Item>后台管理系统</Breadcrumb.Item>
            <Breadcrumb.Item>工作台</Breadcrumb.Item>
          </Breadcrumb>
          <div
            className="site-layout-background"
            style={{ padding: 24, minHeight: 360 }}
          >
            <div>
              <Route path="/index/add/" exact component={AddArticle}></Route>
              <Route path="/index/add/:id" exact component={AddArticle}></Route>
              <Route path="/index/list/" exact component={ArticleList}></Route>
              <Route path="/index/userInfo" exact component={UserInfo}></Route>
              <Route path="/index/advert" exact component={AdvertMng}></Route>
              <Route path="/index/" exact component={ArticleList}></Route>
            </div>
          </div>
        </Content>
        <Footer style={{ textAlign: "center" }}>Newway</Footer>
      </Layout>
    </Layout>
  );
}
