import { createId } from "@paralleldrive/cuid2";
import { HTTPException } from "hono/http-exception";
import type { GenerateInput } from "../schemas";
import { Octokit } from "@octokit/rest";

export async function generateBuild(input: GenerateInput, ghToken: string) {
  const octokit = new Octokit({ auth: ghToken });

  const id = createId();
  const date = new Date().toISOString().slice(0, 10).replace(/-/g, "");

  try {
    await octokit.actions.createWorkflowDispatch({
      owner: "xell-worker",
      repo: "xell-builder",
      ref: "main",
      workflow_id: "build.yml",
      inputs: {
        id,
        date,
        ...input,
      },
    });
  } catch (error: unknown) {
    const err = error as { status?: number; message?: string };
    throw new HTTPException(418, {
      message: err.message || "Failed to dispatch workflow",
    });
  }

  return { id, date };
}
