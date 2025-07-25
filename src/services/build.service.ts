import { createId } from "@paralleldrive/cuid2";
import { HTTPException } from "hono/http-exception";
import type { GenerateInput, UploadInput } from "../schemas";
import octokit from "../utils/gh";
import { fileStorage, uploadKeys } from "../utils/storage";

export async function generateBuild(input: GenerateInput) {
  const id = createId();
  const key = createId();

  try {
    await octokit.actions.createWorkflowDispatch({
      owner: "barrenechea",
      repo: "xell-reloaded",
      ref: "master",
      workflow_id: "custom-build.yml",
      inputs: {
        id,
        key,
        ...input,
      },
    });
  } catch (error: unknown) {
    const err = error as { status?: number; message?: string };
    throw new HTTPException(418, {
      message: err.message || "Failed to dispatch workflow",
    });
  }

  uploadKeys.save({ id, key });
  return { id };
}

export async function uploadFile(data: UploadInput) {
  const { id, key, file, filename, error } = data;

  const uploadKey = await uploadKeys.find(id);
  if (!uploadKey || uploadKey.key !== key) {
    throw new HTTPException(403, { message: "Invalid id or key" });
  }

  await fileStorage.save({ id, file, filename, error });
  return { message: "Payload uploaded" };
}

export async function downloadFile(id: string) {
  const uploadKey = await uploadKeys.find(id);
  if (!uploadKey) {
    throw new HTTPException(404, { message: "Invalid id" });
  }

  const storedFile = await fileStorage.find(id);
  if (!storedFile) {
    throw new HTTPException(404, { message: "File not processed yet" });
  }
  if (storedFile.error) {
    throw new HTTPException(500, { message: storedFile.error });
  }

  await uploadKeys.delete(id);
  await fileStorage.delete(id);

  return { file: storedFile.file, filename: storedFile.filename };
}
