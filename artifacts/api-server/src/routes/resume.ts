import { timingSafeEqual } from "node:crypto";
import { Router, type IRouter } from "express";
import {
  VerifyResumePrintAccessBody,
  VerifyResumePrintAccessResponse,
} from "@workspace/api-zod";

const router: IRouter = Router();

router.post("/resume/print-access", (req, res): void => {
  const parsed = VerifyResumePrintAccessBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "A password is required." });
    return;
  }

  const expectedPassword = process.env["RESUME_PRINT_PASSWORD"];
  if (!expectedPassword) {
    req.log.error("Résumé print password is not configured");
    res.status(503).json({ error: "Print access is not configured." });
    return;
  }

  const submitted = Buffer.from(parsed.data.password, "utf8");
  const expected = Buffer.from(expectedPassword, "utf8");
  const isMatch =
    submitted.length === expected.length && timingSafeEqual(submitted, expected);

  if (!isMatch) {
    res.status(401).json({ error: "Password not accepted." });
    return;
  }

  res.json(VerifyResumePrintAccessResponse.parse({ authorized: true }));
});

export default router;
