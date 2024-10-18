import { Router } from "express";
import {
  createRule,
  combineRules,
  evaluateRule,
  getAllRuleNames,
  getRuleByName,
} from "../controllers/rules.controller";

const router = Router();

router.post("/create", createRule);
router.post("/combine", combineRules);
router.post("/evaluate", evaluateRule);
router.get("/names", getAllRuleNames);
router.get("/:ruleName", getRuleByName);

export default router;
