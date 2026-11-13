import { setupWorker } from "msw/browser";
import { handlers } from "./handlers";
import { MOCK_ACCOUNTS, MOCK_PASSWORD } from "./mockAuth";

export const worker = setupWorker(...handlers);

export async function startMocks() {
  await worker.start({ onUnhandledRequest: "bypass", quiet: true });
  console.info(`[mocks] Fake API is on. Demo logins use the password "${MOCK_PASSWORD}":`);
  console.table(MOCK_ACCOUNTS);
}