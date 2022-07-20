import express from "express";
import * as eventController from "../controllers/eventController.js";
import * as authController from "../controllers/authController.js";
import userRouter from "./userRouter.js";
const router = express.Router();

//This defines a nested route which redirects to user router
router.use("/:eventId/users", userRouter);

router.route("/").get(authController.protect, eventController.getAllEvents);

router.route("/create").post(eventController.createEvent);

router
  .route("/update")
  .patch(authController.protect, eventController.updateEvent);

router
  .route("/delete")
  .delete(authController.protect, eventController.deleteEvent);

//Testing power of indexes in this route
router
  .route("/startDate/:date")
  .get(
    authController.protect,
    eventController.queryByStartDate,
    eventController.getAllEvents
  );

router.route("/distances/:latlon/unit/:unit").get(eventController.getDistance);
router.route("/:id/participants").get(eventController.getParticipantNames);
router.route("/:id").get(authController.protect, eventController.getEvent);

export default router;
