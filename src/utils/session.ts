// export type AuthKeys = string[];

// const defaultKeys: AuthKeys = ["access_token", "token", "auth", "session"];

// export function hasAuth(keys: AuthKeys = defaultKeys): boolean {
//   try {
//     if (typeof document !== "undefined" && document.cookie) {
//       const c = document.cookie;
//       if (keys.some(k => new RegExp(`(?:^|;\\s*)${k}=`).test(c))) return true;
//     }
//     if (typeof localStorage !== "undefined") {
//       if (keys.some(k => localStorage.getItem(k))) return true;
//     }
//   } catch {}
//   return false;
// }

// export function bookingPath(opts?: {
//   whenLogged?: string;
//   whenGuest?: string;
//   keys?: AuthKeys;
// }) {
//   const logged = hasAuth(opts?.keys);
//   return logged ? (opts?.whenLogged ?? "/tuno") : (opts?.whenGuest ?? "/login");
// }

// export function goToBooking(
//   navigate: (to: string) => void,
//   opts?: { whenLogged?: string; whenGuest?: string; keys?: AuthKeys }
// ) {
//   navigate(bookingPath(opts));
// }
