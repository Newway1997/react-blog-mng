import React, { useState, useEffect } from "react";
import { List, Row, Col, Modal, message, Button } from "antd";
import "../static/ArticleList.css";
import * as articleApi from "../api/articleApi";
const { confirm } = Modal;

export default function ArticleList(props) {
  const [list, setList] = useState([]);
  const getList = () => {
    articleApi.getArticleList().then(res => {
      setList(res.data.data);
    });
  };
  useEffect(() => {
    getList();
  }, []);
  const delArticle = id => {
    confirm({
      title: "确认是否删除",
      content: "如果你点击OK，文章将永远被删除，无法恢复",
      cancelText: "取消",
      okText: "确认",
      onOk() {
        articleApi.deleteArticle(id).then(res => {
          message.success("文章删除");
          getList();
        });
      },
      onCancel() {
        message.success("取消");
      }
    });
  };
  const updateArticle = id => {
    props.history.push("/index/add/" + id);
  };
  return (
    <div>
      <List
        header={
          <Row className="list-div">
            <Col span={8}>
              <b>标题</b>
            </Col>
            <Col span={4}>
              <b>类别</b>
            </Col>
            <Col span={4}>
              <b>发布时间</b>
            </Col>
            <Col span={4}>
              <b>浏览量</b>
            </Col>
            <Col span={4}>
              <b>操作</b>
            </Col>
          </Row>
        }
        bordered
        dataSource={list}
        renderItem={item => (
          <List.Item>
            <Row className="list-div">
              <Col span={8}>{item.title}</Col>
              <Col span={4}>{item.typeName}</Col>
              <Col span={4}>{item.addTime}</Col>
              <Col span={4}>{item.view_count}</Col>
              <Col span={4}>
                <Button
                  type="primary"
                  style={{ marginRight: "5px" }}
                  onClick={() => {
                    updateArticle(item.id);
                  }}
                >
                  修改
                </Button>
                <Button
                  type="danger"
                  onClick={() => {
                    delArticle(item.id);
                  }}
                >
                  删除
                </Button>
              </Col>
            </Row>
          </List.Item>
        )}
      />
    </div>
  );
}
