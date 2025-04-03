import Vapi from "@vapi-ai/web";

const token = process.env.NEXT_PUBLIC_VAPI_WEB_TOKEN;
if (!token) throw new Error("VAPI token missing");

export const vapi = new Vapi(token);

// Add health check
export async function checkVapiHealth() {
  try {
    await vapi.start({ assistant: "test" });
    vapi.stop();
    return true;
  } catch {
    return false;
  }
}
