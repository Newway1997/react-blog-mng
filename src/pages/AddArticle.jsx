import React, { useState, useEffect } from "react";
import { Button, Row, Col, Input, Select, DatePicker, message } from "antd";
import "../static/AddArticle.css";
import marked from "marked";
import hljs from "highlight.js";
import moment from "moment";
import * as articleApi from "../api/articleApi";
import ImageModal from "../components/ImageModal";
import { FileImageOutlined } from "@ant-design/icons";
const { Option } = Select;
const { TextArea } = Input;

const renderer = new marked.Renderer();
marked.setOptions({
  renderer: renderer,
  gfm: true,
  pedantic: false,
  sanitize: false,
  tables: true,
  breaks: false,
  smartLists: true,
  highlight: function(code) {
    return hljs.highlightAuto(code).value;
  }
});

export default function AddArticle(props) {
  const [articleId, setArticleId] = useState(0); // 文章的ID，如果是0说明是新增加，如果不是0，说明是修改
  const [articleTitle, setArticleTitle] = useState(""); //文章标题
  const [articleContent, setArticleContent] = useState(""); //markdown的编辑内容
  const [markdownContent, setMarkdownContent] = useState("预览内容"); //html内容
  const [introduce, setIntroduce] = useState(); //简介的markdown内容
  const [introducehtml, setIntroducehtml] = useState("等待编辑"); //简介的html内容
  const [showDate, setShowDate] = useState(moment()); //发布日期
  const [typeInfo, setTypeInfo] = useState([]); // 文章类别信息
  const [selectedType, setSelectType] = useState(); //选择的文章类别
  const [orderIndex, setOrderIndex] = useState(1);
  const getArticleById = id => {
    articleApi.getArticleById(id).then(res => {
      const articleInfo = res.data.data[0];
      setArticleId(articleInfo.id);
      setArticleTitle(articleInfo.title);
      setArticleContent(articleInfo.article_content);
      //marked太耗cpu，会阻塞侧边栏菜单选择切换动画，暂时setTimeout解决
      setTimeout(() => {
        let html = marked(articleInfo.article_content || "");
        setMarkdownContent(html);
        setIntroduce(articleInfo.introduce);
        let tempInt = marked(articleInfo.introduce || "");
        setIntroducehtml(tempInt);
      }, 300);
      setShowDate(moment(articleInfo.addTime));
      setSelectType(articleInfo.typeId);
      setOrderIndex(articleInfo.orderIndex);
    });
  };
  const changeContent = e => {
    setArticleContent(e.target.value);
    const html = marked(e.target.value || "");
    setMarkdownContent(html);
  };
  const changeIntroduce = e => {
    setIntroduce(e.target.value);
    const html = marked(e.target.value || "");
    setIntroducehtml(html);
  };
  const changeTitle = e => {
    setArticleTitle(e.target.value);
  };
  const getTypeInfo = () => {
    articleApi.getTypeInfo().then(res => {
      if (res.data.data === "没有登录") {
        localStorage.removeItem("openId");
        props.history.push("/");
      } else {
        setTypeInfo(res.data.data);
      }
    });
  };

  useEffect(() => {
    getTypeInfo();
    let tmpId = props.match.params.id;
    if (tmpId) {
      getArticleById(tmpId);
    } else {
      getLocalData();
    }
  }, [props.match.params.id]);
  const selectTypeHandler = value => {
    setSelectType(value);
  };
  const dateChangeHander = date => {
    setShowDate(date);
  };
  const localSave = () => {
    let dataProps = {};
    dataProps.selectedType = selectedType;
    dataProps.articleTitle = articleTitle;
    dataProps.articleContent = articleContent;
    dataProps.introduce = introduce;
    dataProps.showDate = showDate.unix();
    dataProps.orderIndex = orderIndex;
    let localData = JSON.stringify(dataProps);
    localStorage.setItem("localData", localData);
    message.success("暂存成功");
  };
  const getLocalData = () => {
    let localData = localStorage.getItem("localData");
    if (localData) {
      let dataProps = JSON.parse(localData);
      setArticleTitle(dataProps.articleTitle);
      setArticleContent(dataProps.articleContent);
      let html = marked(dataProps.articleContent || "");
      setMarkdownContent(html);
      setIntroduce(dataProps.introduce);
      let tempInt = marked(dataProps.introduce || "");
      setIntroducehtml(tempInt);
      setShowDate(moment(dataProps.showDate * 1000));
      setSelectType(dataProps.selectedType);
      setOrderIndex(dataProps.orderIndex);
    }
  };
  const saveArticle = () => {
    if (!selectedType) {
      message.error("文章类型不能为空");
      return false;
    } else if (!articleTitle) {
      message.error("文章名称不能为空");
      return false;
    } else if (!articleContent) {
      message.error("文章内容不能为空");
      return false;
    } else if (!introduce) {
      message.error("文章简介不能为空");
      return false;
    } else if (!showDate) {
      message.error("发布日期不能为空");
      return false;
    }
    let dataProps = {};
    dataProps.type_id = selectedType;
    dataProps.title = articleTitle;
    dataProps.article_content = articleContent;
    dataProps.introduce = introduce;
    dataProps.orderIndex = orderIndex;
    let date = showDate;
    if (date) {
      const nowDate = new Date();
      //设置时间
      date.hour(nowDate.getHours());
      date.minute(nowDate.getMinutes());
      date.second(nowDate.getSeconds());
    }
    dataProps.addTime = date.utc(8).unix();
    if (articleId === 0) {
      dataProps.view_count = 0;
      articleApi.addArticle(dataProps).then(res => {
        setArticleId(res.data.insertId);
        if (res.data.isSuccess) {
          message.success("保存成功");
        } else {
          message.error("保存失败");
        }
      });
    } else {
      dataProps.id = articleId;
      articleApi.updateArticle(dataProps).then(res => {
        if (res.data.isSuccess) {
          message.success("修改成功");
        } else {
          message.error("修改失败");
        }
      });
    }
  };
  const selectOrderIndexHandler = value => {
    setOrderIndex(value);
  };
  const [visible, setVisible] = useState(false);
  const handleToolBar = () => {
    setVisible(true);
  };
  const handleCancel = () => {
    setVisible(false);
  };
  const handleOk = imgUrl => {
    const newArticleContent = articleContent + `![image](${imgUrl})`;
    setArticleContent(newArticleContent);
    setMarkdownContent(marked(newArticleContent || ""));
    setVisible(false);
  };
  return (
    <div>
      <Row gutter={5}>
        <Col span={18}>
          <Row gutter={10} style={{ marginBottom: "10px" }}>
            <Col span={12}>
              <Input
                placeholder="博客标题"
                size="large"
                onChange={changeTitle}
                value={articleTitle}
              ></Input>
            </Col>
            <Col span={4}>
              <Select
                placeholder="请选择类型"
                onChange={selectTypeHandler}
                value={selectedType}
                size="large"
                style={{ minWidth: "130px" }}
              >
                {typeInfo.map(item => {
                  return (
                    <Option key={item.id} value={item.id}>
                      {item.typeName}
                    </Option>
                  );
                })}
              </Select>
            </Col>
            <Col span={4}>
              <Select
                placeholder="请设置优先级"
                value={orderIndex}
                onChange={selectOrderIndexHandler}
                size="large"
                style={{ minWidth: "130px" }}
              >
                <Option key={0} value={0}>
                  置顶
                </Option>
                <Option key={1} value={1}>
                  普通
                </Option>
                })}
              </Select>
            </Col>
            <Col span={4}>
              <div className="date-select">
                <DatePicker
                  onChange={dateChangeHander}
                  placeholder="发布日期"
                  size="large"
                  value={!showDate ? undefined : moment(showDate)}
                ></DatePicker>
              </div>
            </Col>
          </Row>
          <Row className="toolbar">
            <Col span={1}>
              <span>
                <FileImageOutlined
                  style={{ fontSize: "20px" }}
                  onClick={handleToolBar}
                />
              </span>
            </Col>
          </Row>
          <Row>
            <Col span={12}>
              <TextArea
                className="markdown-content"
                rows={30}
                placeholder="文章内容"
                value={articleContent}
                onChange={changeContent}
              ></TextArea>
            </Col>
            <Col span={12}>
              <div
                className="show-html"
                style={{ marginLeft: "5px" }}
                dangerouslySetInnerHTML={{ __html: markdownContent }}
              ></div>
            </Col>
          </Row>
        </Col>
        <Col span={6}>
          <Row>
            <Col span={24}>
              <Button size="large" onClick={localSave}>
                暂存文章
              </Button>
              <Button
                type="primary"
                size="large"
                style={{ marginLeft: "5px" }}
                onClick={saveArticle}
              >
                {articleId === 0 ? "发布文章" : "修改文章"}
              </Button>
            </Col>
            <Col span={24} style={{ marginTop: "10px" }}>
              <TextArea
                row={4}
                placeholder="文章简介"
                onChange={changeIntroduce}
                value={introduce}
              ></TextArea>
              <div
                style={{ marginTop: "10px" }}
                className="introduce-html"
                dangerouslySetInnerHTML={{ __html: introducehtml }}
              ></div>
            </Col>
          </Row>
        </Col>
      </Row>
      <ImageModal
        visible={visible}
        onCancel={handleCancel}
        onOk={handleOk}
      ></ImageModal>
    </div>
  );
}
