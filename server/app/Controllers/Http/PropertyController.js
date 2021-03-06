"use strict";

const Helpers = use("Helpers");
const Property = use("App/Models/Property");

/**
 * Resourceful controller for interacting with properties
 */
class PropertyController {
  /**
   * Create/save a new property.
   * POST properties
   */
  async store({ request, auth }) {
    const { id } = auth.user;
    const { title, address, latitude, longitude, price } = request.all();

    const newProperty = await Property.create({
      user_id: id,
      title,
      address,
      latitude,
      longitude,
      price,
    });

    return newProperty;
  }

  /**
   * Show a list of all properties.
   * GET properties
   */
  async index({ request }) {
    const { latitude, longitude } = request.all();

    const properties = Property.query()
      .with("images")
      .nearBy(latitude, longitude, 10)
      .fetch();

    return properties;
  }

  /**
   * Display a single property.
   * GET properties/:id
   */
  async show({ params }) {
    const property = await Property.findOrFail(params.id);

    await property.load("images");

    return property;
  }

  /**
   * Update property details.
   * PUT or PATCH properties/:id
   */
  async update({ params, request, response }) {
    const property = await Property.findOrFail(params.id);

    const data = request.only([
      "title",
      "address",
      "latitude",
      "longitude",
      "price",
    ]);

    property.merge(data);

    await property.save();

    return property;
  }

  /**
   * Delete a property with id.
   * DELETE properties/:id
   */
  async destroy({ params, auth, response }) {
    const property = await Property.findOrFail(params.id);

    if (property.user_id !== auth.user.id) {
      return response.status(401).send({ error: "Not authorized" });
    }

    await property.delete();
  }
}

module.exports = PropertyController;
