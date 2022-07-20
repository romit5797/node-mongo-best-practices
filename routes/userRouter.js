import express from "express";
import * as userController from "../controllers/userController.js";
import * as authController from "../controllers/authController.js";

//Enabling merge params to get the paramters in a nested route
const router = express.Router({
  mergeParams: true,
});
router
  .route("/")
  .get(authController.protect, userController.getAllUsers)
  .post(authController.createUser);
router.route("/login").post(authController.loginUser);
router
  .route("/updatePassword")
  .patch(authController.protect, authController.updatePassword);
router
  .route("/updateMe")
  .patch(authController.protect, userController.updateMe);
router
  .route("/deleteMe")
  .delete(authController.protect, userController.deleteMe);
//Dynamic route for testing advanced filtering & other features
router
  .route("/dynamic")
  .get(authController.protect, userController.dynamicQuery);
//Mongo aggregate pipeline
router
  .route("/aggregate")
  .get(authController.protect, userController.aggregateQuery);
router
  .route("/getMe")
  .get(authController.protect, userController.setUserID, userController.getMe);
router
  .route("/participants")
  .get(authController.protect,userController.setEventId, userController.getParticipantNames);
router
  .route("/:id")
  .get(
    authController.protect,
    authController.restrictTo("admin", "leads"),
    userController.getUser
  );

export default router;
