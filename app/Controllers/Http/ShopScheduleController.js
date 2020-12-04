"use strict";
const Shop = use("App/Models/Shop");
const ShopSchedule = use("App/Models/ShopSchedule");
const daily = {
  sunday: 0,
  monday: 1,
  tuesday: 2,
  wednesday: 3,
  thursday: 4,
  friday: 5,
  saturday: 6
}
/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */

/** @typedef {import('@adonisjs/framework/src/View')} View */

/**
 * Resourceful controller for interacting with schedules
 */
class ShopScheduleController {

  /**
   * Show a list of all schedules.
   * GET schedules
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async index({params, request, response}) {
    const payload = request.all();
    const page = parseInt(payload.page) || 1;
    const limit = parseInt(payload.limit) || 5;
    const members = await Shop.query()
      .where('id', params.shops_id)
      .orWhere('shop_slug', params.shops_id)
      .whereHas('schedules')
      .with('schedules', (builder) => {
        builder.orderBy('meet_on')
      })
      .forPage(page, limit)
      .fetch();
    return response.status(200).json(members.toJSON());
  }

  /**
   * Create/save a new ShopSchedule.
   * POST schedules
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async store({params, request, response}) {
    try {
      const shop = await Shop.query()
        .where('id', params.shops_id)
        .orWhere('shop_slug', params.shops_id)
        .first();

      if (!shop) {
        return response.status(404).json({
          message: "Data not found"
        })
      }

      const payload = request.all();
      for (let p in payload) {
        const member = await ShopSchedule.query()
          .where('shop_id', shop.id)
          .where('meet_on',payload[p].value)
          .first();
        member.shop_id = shop.id;
        member.meet_on = payload[p].value;
        member.meet_status = payload[p].status;
        member.meet_schedules = JSON.stringify(payload[p].schedule);
        await member.save();
      }

      return response.status(200).json({
        message: "Data successfully created",
      });
    } catch (error) {
      return response.status(500).json({
        message: "Internal server error",
        error: error
      });
    }
  }

  /**
   * Delete a ShopSchedule with id.
   * DELETE schedules/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async destroy({params, request, response}) {
    try {
      const shop = await Shop.query()
        .where('id', params.shops_id)
        .orWhere('shop_slug', params.shops_id)
        .first();

      if (!shop) {
        return response.status(404).json({
          message: "Data not found"
        })
      }
      const valueOfDaily = daily.indexOf(params.id);
      console.log(valueOfDaily)
      // const member = await ShopSchedule.query()
      //   .where('shop_id', shop.id)
      //   .where('meet_on')
      // await member.delete();
      // return response.status(200).json({
      //   message: "Data successfully deleted",
      // });
    } catch (e) {
      return response.status(500).json({
        message: "Internal server error",
      });
    }
  }
}

module.exports = ShopScheduleController;
