//first line
const {
  User,
  Spot,
  SpotImage,
  Review,
  ReviewImage,
  Booking,
  sequelize,
} = require("../../db/models");
const { requireAuth } = require("../../utils/auth.js");
const { reformatTimes } = require("../../utils/date-time");
const { getPreviewImageURL } = require("../../utils/previewImage");

const express = require("express");

const { Op } = require("sequelize");

const { check } = require("express-validator");
const { handleValidationErrors } = require("../../utils/validation");

const router = express.Router();

//! Validate spot creation array to reference below for data validation
const validateSpotCreation = [
  check("address")
    .exists({ checkFalsy: true })
    // .isEmpty({ checkFalsy : true})
    .withMessage("Street address is required"),
  check("city")
    .exists({ checkFalsy: true })
    // .isEmpty()
    .withMessage("City is required"),
  check("state")
    .exists({ checkFalsy: true })
    // .isEmpty()
    .withMessage("State is required"),
  check("country")
    .exists({ checkFalsy: true })
    // .isEmpty()
    .withMessage("Country is required"),
  check("lat")
    .exists({ checkFalsy: true })
    // .isEmpty()
    .isDecimal()
    .isFloat({ min: -90, max: 90 })
    .withMessage("Latitude is not valid"),
  check("lng")
    .exists({ checkFalsy: true })
    // .isEmpty()
    .isDecimal()
    .isFloat({ min: -180, max: 180 })
    .withMessage("Longitude is not valid"),
  check("name")
    .exists({ checkFalsy: true })
    // .isEmpty()
    .isLength({ min: 1, max: 49 })
    .withMessage("Name must be less than 50 characters"),
  check("description")
    .exists({ checkFalsy: true })
    // .isEmpty()
    .withMessage("Description is required"),
  check("price")
    .exists({ checkFalsy: true })
    // .isEmpty()
    .isInt({ min: 1 })
    .withMessage("Price per day is required"),
  handleValidationErrors,
];

const validateReviewCreation = [
  check("review")
    .exists({ checkFalsy: true })
    // .isEmpty()
    .withMessage("Review text is required"),
  check("stars")
    .exists({ checkFalsy: true })
    // .isEmpty()
    .isInt({ min: 1, max: 5 })
    .withMessage("Stars must be an integer from 1 to 5"),
  handleValidationErrors,
];

//! query parameter validations
const validateQueryParam = [
  check("page")
    // .exists({checkFalsy: true})
    .optional()
    .isInt({ min: 1 })
    .withMessage("Page must be greater than or equal to 1"),
  check("size")
    // .exists({checkFalsy: true})
    .optional()
    .isInt({ min: 1 })
    .withMessage("Size must be greater than or equal to 1"),
  check("maxLat")
    .optional()
    .isDecimal()
    .isFloat({ min: -90, max: 90 })
    .withMessage("Maximum latitude is invalid"),
  check("minLat")
    .optional()
    .isDecimal()
    .isFloat({ min: -90, max: 90 })
    .withMessage("Minimum latitude is invalid"),
  check("minLng")
    .optional()
    .isDecimal()
    .isFloat({ min: -180, max: 180 })
    .withMessage("Minimum longitude is invalid"),
  check("maxLng")
    .optional()
    .isDecimal()
    .isFloat({ min: -180, max: 180 })
    .withMessage("Maximum longitude is invalid"),
  check("minPrice")
    .optional()
    .isFloat({ min: 0 })
    .withMessage("Minimum price must be greater than or equal to 0"),
  check("maxPrice")
    .optional()
    .isFloat({ min: 0 })
    .withMessage("Maximum price must be greater than or equal to 0"),
  handleValidationErrors,
];

// const router = require('express').Router();
//! Get spots of current user
// TODO:
router.get("/current", requireAuth, async (req, res) => {
  const { user } = req;
  //console.log("User Id?: ",user.id);
  const ownerId = user.id;
  const where = {};
  where.ownerId = ownerId;
  const Spots = await Spot.findAll({
    where,
    include: [
      {
        //avgRating
        model: Review,
        attributes: [],
      },
      // { model: SpotImage,
      //     as: 'previewImage',
      //     where: {preview: true},
      //     attributes: ['url'],}
    ],

    attributes: [
      "id",
      "ownerId",
      "address",
      "city",
      "state",
      "country",
      "lat",
      "lng",
      "name",
      "description",
      "price",
      "createdAt",
      "updatedAt",
      [sequelize.fn("AVG", sequelize.col("Reviews.stars")), "avgRating"],
    ],
    // group:['Spot.id', 'previewImage.url'],
    group: ["Spot.id"],
    raw: true,
  });

  // console.log(Spots, "line 618")
  for (let i = 0; i < Spots.length; i++) {
    const spot = Spots[i];
    // console.log("previewImage at 164 spots.js: ", getPreviewImageURL(spot.id))
    // console.log( typeof getPreviewImageURL(spot.id))
    spot.previewImage = await getPreviewImageURL(spot.id);
    // spot["previewImage"] = spot["previewImage.url"];
    delete spot["previewImage.url"];
  }
  //if it works, it works

  for (let i = 0; i < Spots.length; i++) {
    const spot = Spots[i];
    const timestampArr = [spot.createdAt, spot.updatedAt];
    let newTimestamps = reformatTimes(timestampArr, "getAllSpots");
    spot.createdAt = newTimestamps[0];
    spot.updatedAt = newTimestamps[1];
  }

  return res.json({ Spots });
});

//! Add an Image to a Spot based on the Spot's Id
// TODO :
router.post("/:spotId/images", requireAuth, async (req, res, next) => {
  // * isolate needed info
  const { url, preview } = req.body; //isolate info for new spot image to be created
  const spotId = req.params.spotId; //spot id to pass in with image details
  // console.log(`#####spotId:  ${spotId}`);
  // * setting up new spot image
  const spotWithNewImage = await Spot.findByPk(req.params.spotId); //find spot that needs the new image

  if (!spotWithNewImage) {
    //if we can't find the spot that needs the new image, then return err
    const err = new Error("Spot couldn't be found");
    err.status = 404;
    return next(err);
  }

  // * confirm if current user is owner of spot
  const { user } = req; //
  const userId = user.id;
  const ownerId = spotWithNewImage.ownerId;
  if (userId !== ownerId) {
    const err = new Error("Forbidden");
    // err.title = 'Forbidden';
    // err.errors = { message: 'Forbidden' };
    err.status = 403;
    return next(err);
  }

  const newSpotImage = await SpotImage.create({ spotId, url, preview });

  return res.json({
    id: newSpotImage.id,
    url: newSpotImage.url,
    preview: newSpotImage.preview,
  });
});

//!!!!!!!!!!!!!!!!!!!!!!!!!! Reviews CRUD by Spot Id
//! Create Review for Spot by spotId
// TODO:
router.post(
  "/:spotId/reviews",
  requireAuth,
  validateReviewCreation,
  async (req, res, next) => {
    const { user } = req;
    const userId = user.id;

    const { review, stars } = req.body;

    const desiredSpot = await Spot.findByPk(req.params.spotId);
    if (!desiredSpot) {
      const err = new Error("Spot couldn't be found");
      err.status = 404;
      return next(err);
    }

    const reviewsForSpotWithUser = await Review.findAll({
      where: { userId: userId, spotId: req.params.spotId },
    });

    if (reviewsForSpotWithUser.length >= 1) {
      const err = new Error("User already has a review for this spot");
      err.status = 500;
      return next(err);
    }

    const newReview = await Review.create({
      spotId: Number(req.params.spotId),
      userId: userId,
      review: review,
      stars: stars,
    });

    const finalNewReview = newReview.dataValues;
    // for (let i = 0; i < Spots.length; i++) {
    // const spot = Spots[i];
    const timestampArr = [finalNewReview.createdAt, finalNewReview.updatedAt];
    let newTimestamps = reformatTimes(timestampArr, "createNewReview");
    finalNewReview.createdAt = newTimestamps[0];
    finalNewReview.updatedAt = newTimestamps[1];
    //}

    return res.status(201).json(finalNewReview);
  }
);

//! Get Reviews for spot by spotId
// TODO:
router.get("/:spotId/reviews", async (req, res, next) => {
  const { spotId } = req.params.spotId;
  const where = {};
  where.spotId = req.params.spotId;
  const desiredSpot = await Spot.findByPk(req.params.spotId);
  if (!desiredSpot) {
    const err = new Error("Spot couldn't be found");
    err.status = 404;
    return next(err);
  }
  const Reviews = await Review.findAll({
    where,
    include: [
      {
        model: User,
        attributes: ["id", "firstName", "lastName"],
      },
      {
        model: ReviewImage,
        attributes: ["id", "url"],
      },
    ],
  });

  for (let i = 0; i < Reviews.length; i++) {
    const review = Reviews[i];
    const timestampArr = [
      review.dataValues.createdAt,
      review.dataValues.updatedAt,
    ];
    let newTimestamps = reformatTimes(timestampArr, "getCurrentReviews");
    review.dataValues.createdAt = newTimestamps[0];
    review.dataValues.updatedAt = newTimestamps[1];
  }

  Reviews.reverse();

  return res.json({ Reviews });
});

//!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! Bookings CRUD based on spotId

//! Verify Dates for bookings
const verifyDates = (newStart, newEnd, existingStart, existingEnd) => {
  if (newStart >= existingStart && newEnd <= existingEnd) {
    return false;
  }

  if (existingStart <= newStart && newStart <= existingEnd) {
    return false;
  }

  if (existingStart <= newEnd && newEnd <= existingEnd) {
    return false;
  }

  if (newStart <= existingStart && existingEnd <= newEnd) return false;

  if (
    newStart === existingStart ||
    newEnd === existingEnd ||
    newEnd === existingStart ||
    newStart === existingEnd
  ) {
    return false;
  }
  return true;
};

//!Create Booking based on spotId
//TODO: Passing in Dev
router.post("/:spotId/bookings", requireAuth, async (req, res, next) => {
  const where = {};
  where.spotId = req.params.spotId;
  const bookedSpotId = Number(req.params.spotId);
  const desiredSpot = await Spot.findByPk(req.params.spotId);
  if (!desiredSpot) {
    const err = new Error("Spot couldn't be found");
    err.status = 404;
    return next(err);
  }

  const conflictingErr = () => {
    const err = new Error(
      "Sorry, this spot is already booked for the specified dates"
    );
    err.errors = {
      startDate: "Start date conflicts with an existing booking",
      endDate: "End date conflicts with an existing booking",
    };
    err.status = 403;
    return next(err);
  };

  const { user } = req;
  const currentUserId = user.id;
  const spotOwnerId = desiredSpot.ownerId;
  const bookingStartDate = req.body.startDate;
  const parsedStartDate = Date.parse(bookingStartDate);
  const bookingEndDate = req.body.endDate;
  const parsedEndDate = Date.parse(bookingEndDate);
  // console.log(`spotOwnerId: ${spotOwnerId}, currentUserId : ${currentUserId}`);
  if (currentUserId === spotOwnerId) {
    // console.log("I am the owner!!!")
    const err = new Error("Forbidden");
    // err.title = 'Forbidden';
    // err.errors = { message: 'Forbidden' };
    err.status = 403;
    return next(err);
  } //! Ensure that person making booking is not owner
  // console.log("I am the guest!!!");
  //!now check that the body is valid
  //end date has to be greater than start after parsed
  //* get startDate

  const timeDifference = parsedEndDate - parsedStartDate; //if less than or = to 0, means startDate is before or the same as end date; pos = end date after start, valid
  if (timeDifference <= 0) {
    const err = new Error("Bad Request");
    err.errors = { endDate: "endDate cannot be on or before startDate" };
    err.status = 400;
    return next(err);
  } //great, the body is valid, what about those dates though, do they interfere with an already booked time?

  const parsedCurrDate = Date.now();
  const timeDiffCurr = parsedStartDate - parsedCurrDate;
  if (timeDiffCurr < 0) {
    const err = new Error("Bad Request");
    err.errors = { message: "Cannot book past dates" };
    err.status = 400;
    return next(err);
  }

  where.spotId = bookedSpotId;
  const existingBookingDates = await Booking.findAll({
    where,
    attributes: ["startDate", "endDate"],
  });
  console.log(existingBookingDates);
  for (let i = 0; i < existingBookingDates.length; i++) {
    const datePairObj = existingBookingDates[i];

    retrievedStart = datePairObj.dataValues.startDate;
    parsedRetrievedStart = Date.parse(retrievedStart);
    retrievedEnd = datePairObj.dataValues.endDate;
    parsedRetrievedEnd = Date.parse(retrievedEnd);

    //!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!Calling verifyDates

    const verifiedDate = verifyDates(
      parsedStartDate,
      parsedEndDate,
      parsedRetrievedStart,
      parsedRetrievedEnd
    );

    if (verifiedDate === false) return conflictingErr();
  }
  const spotId = bookedSpotId;
  const userId = currentUserId;
  const startDate = bookingStartDate;
  const endDate = bookingEndDate;

  const newBooking = await Booking.create({
    spotId,
    userId,
    startDate,
    endDate,
  });

  const timestampArr = [
    newBooking.dataValues.createdAt,
    newBooking.dataValues.updatedAt,
    newBooking.dataValues.startDate,
    newBooking.dataValues.endDate,
  ];
  let newTimestamps = reformatTimes(timestampArr, "getCurrentBookings");
  newBooking.dataValues.createdAt = newTimestamps[0];
  newBooking.dataValues.updatedAt = newTimestamps[1];
  // console.log(newTimestamps);
  // console.log(" new time stamp array above")
  newBooking.dataValues.startDate = newTimestamps[2].slice(0, 10);
  newBooking.dataValues.endDate = newTimestamps[3].slice(0, 10);

  return res.json(newBooking);
});

//!Get Bookings based on spotId
// TODO:
router.get("/:spotId/bookings", requireAuth, async (req, res, next) => {
  const where = {};
  where.spotId = req.params.spotId;
  const desiredSpot = await Spot.findByPk(req.params.spotId);
  if (!desiredSpot) {
    const err = new Error("Spot couldn't be found");
    err.status = 404;
    return next(err);
  }

  let isOwner;

  const { user } = req;
  const currentUserId = user.id;
  const spotOwnerId = desiredSpot.ownerId;
  // console.log(`spotOwnerId: ${spotOwnerId}, currentUserId : ${currentUserId}`);
  if (currentUserId !== spotOwnerId) {
    console.log("I am the guest!!!");
    isOwner = false;
    const Bookings = await Booking.findAll({
      where,
      attributes: ["spotId", "startDate", "endDate"],
    });

    for (let i = 0; i < Bookings.length; i++) {
      const booking = Bookings[i];

      if (isOwner === false) {
        console.log("This is the start of the console.logs");
        console.log(booking);
        console.log(booking.dataValues);
        console.log(booking.dataValues.startDate);
        console.log(booking.dataValues.endDate);
        const timestampArr = [
          booking.dataValues.startDate,
          booking.dataValues.endDate,
        ];
        console.log(timestampArr);

        let newTimestamps = reformatTimes(timestampArr, "getCurrentBookings");
        console.log(newTimestamps);

        booking.dataValues.startDate = newTimestamps[0].slice(0, 10);
        booking.dataValues.endDate = newTimestamps[1].slice(0, 10);
      }
    }

    return res.json({ Bookings });
  } else if (currentUserId === spotOwnerId) {
    //
    // console.log("I am the owner!!!")/
    isOwner = true;
    const Bookings = await Booking.findAll({
      where,
      include: [
        {
          model: User,
          attributes: ["id", "firstName", "lastName"],
        },
      ],
    });

    for (let i = 0; i < Bookings.length; i++) {
      const booking = Bookings[i];
      // console.log("booking", booking)
      if (isOwner) {
        const timestampArr = [
          booking.dataValues.createdAt,
          booking.dataValues.updatedAt,
          booking.dataValues.startDate,
          booking.dataValues.endDate,
        ];
        let newTimestamps = reformatTimes(timestampArr, "getCurrentBookings");
        booking.dataValues.createdAt = newTimestamps[0];
        booking.dataValues.updatedAt = newTimestamps[1];
        // console.log(newTimestamps);
        // console.log(" new time stamp array above")
        booking.dataValues.startDate = newTimestamps[2].slice(0, 10);
        booking.dataValues.endDate = newTimestamps[3].slice(0, 10);
      }
    }

    return res.json({ Bookings });
  }
});

//!!!!!!!!!!!!!!!!!!!!!!!! Spots CRUD by spotId

//!Get Spot based on spotId
router.get("/:spotId", async (req, res, next) => {
  const desiredSpotBeta = await Spot.findByPk(req.params.spotId);

  if (!desiredSpotBeta) {
    const err = new Error("Spot couldn't be found");
    err.status = 404;
    return next(err);
  }

  const desiredSpot = await Spot.findAll({
    where: { id: req.params.spotId },

    include: [
      { model: User, as: "Owner", attributes: ["id", "firstName", "lastName"] },
      { model: SpotImage, attributes: ["id", "url", "preview"] },
    ],
    attributes: [
      "id",
      "ownerId",
      "address",
      "city",
      "state",
      "country",
      "lat",
      "lng",
      "name",
      "description",
      "price",
      "createdAt",
      "updatedAt",
    ],
    group: ["Spot.id", "Owner.id", "SpotImages.id"], //!!!!!! missing from clause
  });

  const aggregates = {};
  aggregates.numReviews = await Review.findAll({
    where: {
      spotId: req.params.spotId,
    },
    attributes: [
      [sequelize.fn("COUNT", sequelize.col("Review.id")), "numReviews"],
    ],
  });
  const numReviews = aggregates.numReviews[0].dataValues.numReviews;

  aggregates.avgStarRating = await Review.findAll({
    where: {
      spotId: req.params.spotId,
    },
    attributes: [
      [sequelize.fn("AVG", sequelize.col("Review.stars")), "avgStarRating"],
    ],
  });
  const avgStarRating = aggregates.avgStarRating[0].dataValues.avgStarRating;

  desiredSpot[0].dataValues.numReviews = numReviews;
  desiredSpot[0].dataValues.avgStarRating = avgStarRating;

  const desiredSpotSequel = desiredSpot[0].dataValues;

  // for (let i = 0; i < Spots.length; i++) {
  // const spot = Spots[i];
  const timestampArr = [
    desiredSpotSequel.createdAt,
    desiredSpotSequel.updatedAt,
  ];
  let newTimestamps = reformatTimes(timestampArr, "getAllSpots");
  console.log(newTimestamps[0]);
  // delete desiredSpotSequel["createdAt"];
  // console.log("I should be deleted  ",desiredSpotSequel.createdAt);
  desiredSpotSequel.createdAt = newTimestamps[0];
  desiredSpotSequel.updatedAt = newTimestamps[1];
  //}

  return res.json(desiredSpotSequel);
});

//! Edit a Spot
// TODO :
router.put(
  "/:spotId",
  requireAuth,
  validateSpotCreation,
  async (req, res, next) => {
    // * isolate needed info
    const {
      address,
      city,
      state,
      country,
      lat,
      lng,
      name,
      description,
      price,
    } = req.body;
    //isolate info for new spot data to update with
    const spotId = req.params.spotId; //spot id to identify which spot to update;
    // * finding spot to update in db
    const spotToUpdate = await Spot.findByPk(req.params.spotId);

    if (!spotToUpdate) {
      //if we can't find the spot that needs the update, then return err
      const err = new Error("Spot couldn't be found");
      err.status = 404;
      return next(err);
    }

    // * Proper Auth! confirm if current user is owner of spot/Proper Auth!
    const { user } = req; //
    const userId = user.id;
    const ownerId = spotToUpdate.ownerId;
    if (userId !== ownerId) {
      const err = new Error("Forbidden");
      // err.title = 'Forbidden';
      // err.errors = { message: 'Forbidden' };
      err.status = 403;
      return next(err);
    }

    //* update spot
    await spotToUpdate.update({
      id: spotId,
      ownerId: ownerId,
      address: address,
      city: city,
      state: state,
      country: country,
      lat: lat,
      lng: lng,
      name: name,
      description: description,
      price: price,
    });

    updatedSpot = spotToUpdate.dataValues;

    const timestampArr = [updatedSpot.createdAt, updatedSpot.updatedAt];
    let newTimestamps = reformatTimes(timestampArr, "getAllSpots");
    updatedSpot.createdAt = newTimestamps[0];
    updatedSpot.updatedAt = newTimestamps[1];

    return res.json(updatedSpot);
  }
);

//! Delete a Spot
// TODO :
router.delete("/:spotId", requireAuth, async (req, res, next) => {
  const spotId = req.params.spotId; //spot id to identify which spot to delete/destroy
  // * finding spot to delete
  const spotToDelete = await Spot.findByPk(req.params.spotId);

  if (!spotToDelete) {
    //if we can't find the spot to delete, then return err
    const err = new Error("Spot couldn't be found");
    err.status = 404;
    return next(err);
  }

  // * Proper Auth! confirm if current user is owner of spot/Proper Auth!
  const { user } = req; //
  const userId = user.id;
  const ownerId = spotToDelete.ownerId;
  if (userId !== ownerId) {
    const err = new Error("Forbidden");
    // err.title = 'Forbidden';
    // err.errors = { message: 'Forbidden' };
    err.status = 403;
    return next(err);
  }

  //* delete spot
  await spotToDelete.destroy();

  return res.json({
    message: "Successfully deleted",
  });
});

//!!!!!!!!!!!!!!!!!!!!!!!!!!!! Universal Spots

//! Get all spots
router.get("/", validateQueryParam, async (req, res) => {
  let { page, size, minLat, maxLat, minLng, maxLng, minPrice, maxPrice } =
    req.query;

  let pageExists;
  let sizeExists;

  if (req.query.page) {
    console.log("page found");
    pageExists = true;
  } else {
    console.log("page not found");
    pageExists = false;
  }

  if (req.query.size) {
    console.log("size found");
    sizeExists = true;
  } else {
    console.log("size not found");
    sizeExists = false;
  }

  //! no params version
  if (!sizeExists && !pageExists) {
    const Spots = await Spot.findAll({
      include: [
        {
          //avgRating
          model: Review,
          attributes: [],
        },
        // { model: SpotImage,
        //     as: 'previewImage',
        //     where: {preview: true},
        //     attributes: ['url'],}
      ],

      attributes: [
        "id",
        "ownerId",
        "address",
        "city",
        "state",
        "country",
        "lat",
        "lng",
        "name",
        "description",
        "price",
        "createdAt",
        "updatedAt",
        [sequelize.fn("AVG", sequelize.col("Reviews.stars")), "avgRating"],
      ],
      // group:['Spot.id', 'previewImage.url'],
      group: ["Spot.id"],
      raw: true,
    });

    // console.log(spots, "line 618")
    for (let i = 0; i < Spots.length; i++) {
      const spot = Spots[i];
      spot.previewImage = await getPreviewImageURL(spot.id);
      // spot["previewImage"] = spot["previewImage.url"];
      delete spot["previewImage.url"];
    }
    //if it works, it works

    for (let i = 0; i < Spots.length; i++) {
      const spot = Spots[i];
      spot.avgRating = Math.round(spot.avgRating * 100) / 100;
    }

    //! reformat times
    for (let i = 0; i < Spots.length; i++) {
      const spot = Spots[i];
      const timestampArr = [spot.createdAt, spot.updatedAt];
      let newTimestamps = reformatTimes(timestampArr, "getAllSpots");
      spot.createdAt = newTimestamps[0];
      spot.updatedAt = newTimestamps[1];
      // [spot.createdAt, spot.updateAt] = newTimestamps;
    }

    return res.json({ Spots });
  } else {
    //!!!!!!!!!!!!!!!!!!!!end of no params

    const query = {};
    page = page ? Number(page) : 1;
    size = size ? Number(size) : 20;

    if (page > 10) page = 1;
    if (size > 20) size = 20;

    page = Number(page);
    size = Number(size);

    query.limit = size;
    query.offset = size * (page - 1);

    const where = {};
    //set up latitude reqs
    if (minLat || maxLat) {
      if (!minLat) minLat = -90;
      if (!maxLat) maxLat = 90;
      where.lat = { [Op.between]: [minLat, maxLat] };
    }

    //set up longitude reqs
    if (minLng || maxLng) {
      if (minLng === undefined) minLng = -180;
      if (maxLng === undefined) maxLng = 180;
      where.lng = { [Op.between]: [minLng, maxLng] };
      //console.log(where.lng);
    }

    //set up price reqs
    if (minPrice || maxPrice) {
      if (!minPrice) minPrice = 0;
      if (!maxPrice) maxPrice = Number.MAX_VALUE;
      where.price = { [Op.between]: [minPrice, maxPrice] };
    }

    // * 1- create array of Spot Objects --Done
    const Spots = await Spot.findAll({
      where,
      ...query,
      // include: [
      //     {//avgRating
      //         model: Review,
      //         attributes: []
      //     },
      //     { model: SpotImage,
      //         as: 'previewImage',
      //         where: {preview: true},
      //         attributes: ['url'],}
      // ],

      attributes: [
        "id",
        "ownerId",
        "address",
        "city",
        "state",
        "country",
        "lat",
        "lng",
        "name",
        "description",
        "price",
        "createdAt",
        "updatedAt",
        // [sequelize.fn("AVG", sequelize.col("Reviews.stars")),'avgRating']
      ],
      // group:['Spot.id'],
      raw: true,
    });

    //add averages
    for (let i = 0; i < Spots.length; i++) {
      const spot = Spots[i];

      // const numOfReviewsObj = await Review.findAll({
      //     where: {
      //         spotId: req.params.spotId
      //     },
      //     attributes: [[sequelize.fn("COUNT", sequelize.col("Review.id")), 'numReviews']]
      // })

      // const numOfReviewInt = numOfReviewsObj[0].dataValues.numReviews;

      avgRating = await Review.findAll({
        where: {
          spotId: spot.id,
        },
        attributes: [
          [sequelize.fn("AVG", sequelize.col("Review.stars")), "avgStarRating"],
        ],
      });
      const avgRatingNum = avgRating[0].dataValues.avgStarRating;

      // const Reviews = await Review.findAll()

      // avgRatingAnswer =

      spot.avgRating = Math.round(avgRatingNum * 100) / 100;
    }

    // console.log(spots, "line 618")
    for (let i = 0; i < Spots.length; i++) {
      const spot = Spots[i];
      spot.previewImage = await getPreviewImageURL(spot.id);
      // spot["previewImage"] = spot["previewImage.url"];
      delete spot["previewImage.url"];
    }
    //if it works, it works

    //! reformat times
    for (let i = 0; i < Spots.length; i++) {
      const spot = Spots[i];
      const timestampArr = [spot.createdAt, spot.updatedAt];
      let newTimestamps = reformatTimes(timestampArr, "getAllSpots");
      spot.createdAt = newTimestamps[0];
      spot.updatedAt = newTimestamps[1];
      // [spot.createdAt, spot.updateAt] = newTimestamps;
    }

    return res.json({ Spots, page, size });
  }
  // if (req.query) {
  //     // console.log("req.query.page: ", req.query.page)
  //     // console.log("req.query.size: ", req.query.size)
  //     if(!pageExists && !sizeExists){
  //         console.log("No page or size")
  //         return res.json({Spots});
  //     }
  //     if(!pageExists) {
  //         console.log("No page only")
  //         return res.json({Spots, size});
  //     }
  //     if(!sizeExists) {
  //         console.log("No size only")
  //         return res.json({Spots, page});
  //     }
  //     return res.json({Spots, page, size});
  // } else {
  // }
});

//! add spot
router.post("/", requireAuth, validateSpotCreation, async (req, res, next) => {
  const { address, city, state, country, lat, lng, name, description, price } =
    req.body;
  const { user } = req;
  // console.log("User Id?!!!!!!!!!: ",user.id);
  const ownerId = user.id;
  const spot = await Spot.create({
    ownerId,
    address,
    city,
    state,
    country,
    lat,
    lng,
    name,
    description,
    price,
  });
  console.log("spot here", spot);
  const newSpot = {
    id: spot.id,
    ownerId: ownerId,
    address: spot.address,
    city: spot.city,
    state: spot.state,
    country: spot.country,
    lat: spot.lat,
    lng: spot.lng,
    name: spot.name,
    description: spot.description,
    price: spot.price,
    createdAt: spot.createdAt,
    updatedAt: spot.updatedAt,
  };

  //! reformat times
  // for (let i = 0; i < newSpot.length; i++) {
  const timestampArr = [newSpot.createdAt, newSpot.updatedAt];
  let newTimestamps = reformatTimes(timestampArr, "createASpot");
  newSpot.createdAt = newTimestamps[0];
  newSpot.updatedAt = newTimestamps[1];
  // }

  //   if (!res.ok) res.status(400).json(spot);

  return res.status(201).json(newSpot);
});

//last line
module.exports = router;
