let status = { state: 'ready', detail: null };

export function setRuntimeStatus(state, detail = null) {
  status = { state, detail };
}

export function getRuntimeStatus() {
  return { ...status };
}
