import { exportRawSave, importSave } from "../systems/saveSystem";
import { gameStore } from "../store/gameStore";

export async function exportBackup(): Promise<void> {
  if (!parentalGate()) return;
  const raw = await exportRawSave();
  const blob = new Blob([JSON.stringify(raw ?? gameStore.getState().save, null, 2)], {
    type: "application/json"
  });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = `sophias-world-backup-${Date.now()}.json`;
  link.click();
  URL.revokeObjectURL(link.href);
  gameStore.getState().setStatusMessage("Backup salvo");
}

export async function importBackup(): Promise<void> {
  if (!parentalGate()) return;
  const input = document.createElement("input");
  input.type = "file";
  input.accept = "application/json";
  input.onchange = async () => {
    const file = input.files?.[0];
    if (!file) return;
    try {
      const parsed = JSON.parse(await file.text()) as unknown;
      const save = await importSave(parsed);
      gameStore.getState().setSave(save);
      gameStore.getState().setStatusMessage("Backup restaurado");
      window.location.reload();
    } catch {
      gameStore.getState().setStatusMessage("Backup inválido");
    }
  };
  input.click();
}

function parentalGate(): boolean {
  return window.prompt("Para adulto: quanto é 3 + 4?") === "7";
}
