/** Événements soumis depuis ce navigateur, affichés dans l'agenda en attente de validation. */
export const MY_EVENTS_KEY = "gabonmice-my-events";

export type SubmittedEvent = {
  id: string;
  title: string;
  theme: string;
  target: string;
  city: string;
  startDate: string;
  endDate: string;
  attendees: string;
  publish: boolean;
};

export function readMyEvents(): SubmittedEvent[] {
  try {
    const parsed = JSON.parse(window.localStorage.getItem(MY_EVENTS_KEY) ?? "[]");
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function saveMyEvent(event: SubmittedEvent) {
  try {
    window.localStorage.setItem(MY_EVENTS_KEY, JSON.stringify([...readMyEvents(), event]));
  } catch {
    // stockage local indisponible : sans conséquence
  }
}
