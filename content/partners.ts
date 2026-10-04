/*
  Partnere vises på forsiden KUN når avtalen faktisk er bekreftet.
  Logoen legges i public/partners/. Står listen tom, vises ikke seksjonen.

  Eksempel:
  { name: "Leverandør AS", logo: "/partners/leverandor.svg", url: "https://leverandor.no" },
*/
export type Partner = { name: string; logo: string; url?: string };

export const partners: Partner[] = [];
