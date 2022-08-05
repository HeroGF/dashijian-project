// 获取 表格数据
const initArtCateList = () => {
  $.ajax({
    type: "GET",
    url: "/my/article/cates",
    data: null,
    success: (res) => {
      const { status, message, data } = res;
      if (status !== 0) return layer.msg(message);
      // 调用 template
      const htmlStr = template("tpl-table", data);
      //   $("tbody").empty().html(htmlStr);
      $("#tb").html(htmlStr);
    },
  });
};

initArtCateList();

const form = layui.form;

let layerAdd = null;

$("#addCateBtn").click(function () {
  layerAdd = layer.open({
    type: 1,
    area: ["500px", "250px"],
    title: "添加文章分类",
    content: $("#dialog-add").html(),
  });
});

$("body").on("submit", "#form-add", function (e) {
  e.preventDefault();
  $.ajax({
    type: "POST",
    url: "/my/article/addcates",
    data: $(this).serialize(),
    success: (res) => {
      if (res.status !== 0) return layer.msg("新增分类失败！");
      initArtCateList();
      layer.msg("新增分类成功！");
      layer.close(layerAdd);
    },
  });
});

// 通过代理方式，为 btn-edit 按钮绑定点击事件
let layerEdit = null;
$("#tb").on("click", ".btn-edit", function () {
  // 弹出修改文章分类的弹窗
  layerEdit = layer.open({
    type: 1,
    area: ["500px", "250px"],
    title: "修改文章分类",
    content: $("#dialog-edit").html(),
  });
  let id = $(this).attr("data-id");
  $.ajax({
    type: "GET",
    url: "/my/article/cates/" + id,
    data: null,
    success: (res) => {
      const { status, success, data } = res;
      if (status !== 0) return layer.msg(message);
      form.val("formEdit", data);
    },
  });
});

$("body").on("submit", "#form-edit", function (e) {
  e.preventDefault();
  $.ajax({
    type: "POST",
    url: "/my/article/updatecate",
    data: form.val("formEdit"),
    success: (res) => {
      const { status, message } = res;
      layer.msg(message);
      if (status !== 0) return;
      initArtCateList();
      layer.close(layerEdit);
    },
  });
});

$("#tb").on("click", ".btn-delete", function () {
  const id = $(this).attr("data-id");
  // 提示用户是否删除
  layer.confirm("确定删除吗？", { icon: 3, title: "提示" }, function (index) {
    $.ajax({
      method: "GET",
      url: "/my/article/deletecate/" + id,
      data: null,
      success: function (res) {
        const { message } = res;
        if (res.status !== 0) {
          return layer.msg(message);
        }
        layer.msg(message);
        layer.close(index);
        initArtCateList();
      },
    });
  });
});
