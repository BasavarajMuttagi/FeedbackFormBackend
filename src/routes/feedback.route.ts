import express from "express";
import {
  createForm,
  getAllForms,
  getForm,
  submitResponse,
  getFormResponses,
  getAllFormsOverview,
  incrementViewCount,
} from "../controllers/feedback.controller";

const FeedbackRouter = express.Router();

FeedbackRouter.get("/forms", getAllForms);
FeedbackRouter.get("/forms/overview", getAllFormsOverview);
FeedbackRouter.post("/forms/create", createForm);
FeedbackRouter.get("/forms/:id", getForm);
FeedbackRouter.post("/forms/:id/responses", submitResponse);
FeedbackRouter.get("/forms/:id/responses", getFormResponses);
FeedbackRouter.get("/forms/increment-view/:id", incrementViewCount);
export default FeedbackRouter;
