const dayjs = require("dayjs");

module.exports = app => {
  class HomeController extends app.Controller {
    async index() {
      await this.ctx.render("HomePage.jsx", {
        title: "简易留言板",
        description: "基于 React, Beidou 等技术的 JS 全栈开发项目模板"
      });
    }

    async getAllComments() {
      const { ctx } = this;
      try {
        const comments = await ctx.service.messageBoard.findAll();
        ctx.status = 200;
        if (comments) {
          const data = comments.map(item => ({
            id: item.id,
            name: item.name || "匿名",
            message: item.message,
            createAt: item.created_at ? dayjs(item.created_at).format("YYYY年MM月DD日 hh时mm分ss秒") : "未知"
          }));
          ctx.body = {
            code: 200,
            msg: "Success",
            data
          };
        } else {
          ctx.body = {
            code: 500,
            msg: "Failed"
          };
        }
      } catch (e) {
        console.log("HomeController.getAllComments Error:", e);
        ctx.status = 200;
        ctx.body = {
          code: 500,
          msg: "An unexpected error has occurred."
        };
      }
    }

    async create() {
      const { ctx } = this;
      const { name = "", message = "" } = ctx.request.body;
      if (name.length > 20 || message.length > 255) {
        ctx.body = {
          code: 500,
          msg: "Parameter check error."
        };
        return;
      }

      try {
        const success = await ctx.service.messageBoard.create({ name, message });
        ctx.status = 200;
        if (success) {
          ctx.body = {
            code: 200,
            msg: "Success"
          };
        } else {
          ctx.body = {
            code: 500,
            msg: "Failed"
          };
        }
      } catch (e) {
        console.log("HomeController.getAllComments create:", e);
        ctx.status = 200;
        ctx.body = {
          code: 500,
          msg: "An unexpected error has occurred."
        };
      }
    }
  }

  return HomeController;
};
