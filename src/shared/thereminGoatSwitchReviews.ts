export type ExternalSwitchReview = {
  name: string;
  manufacturer: string;
  type: string;
  reviewedAt: string;
  reviewUrl: string;
  /** Present only when the repository scorecard filename/title differs from the composite-sheet name. */
  scorecardName?: string;
};

/**
 * Metadata-only directory derived from ThereminGoat's public Composite Overall
 * Total Score Sheet (snapshot read 2026-09-30). Atlas intentionally does not
 * reproduce the reviewer's score/rank columns here. Re-scored duplicate names
 * are collapsed to the newest dated entry. Non-exact scorecard-title matches are
 * explicit via scorecardName and validated against a reviewed alias allowlist.
 */
export const THEREMINGOAT_SWITCH_SOURCE = "https://github.com/ThereminGoat/switch-scores/blob/master/1-Composite%20Overall%20Total%20Score%20Sheet.csv";
export const THEREMINGOAT_SWITCH_REVIEW_COUNT = 467;
export const thereminGoatSwitchReviews: ExternalSwitchReview[] = [
  {
    "name": "'Aura' Frost Panda",
    "reviewedAt": "6/6/2021",
    "manufacturer": "Tecsee",
    "type": "Tactile",
    "reviewUrl": "https://github.com/ThereminGoat/switch-scores/blob/master/Aura%20Frost%20Panda.pdf",
    "scorecardName": "Aura Frost Panda"
  },
  {
    "name": "43 Studio Jing",
    "reviewedAt": "4/7/2024",
    "manufacturer": "Durock/JWK",
    "type": "Linear",
    "reviewUrl": "https://github.com/ThereminGoat/switch-scores/blob/master/43%20Studio%20Jing.pdf"
  },
  {
    "name": "8008 Ink",
    "reviewedAt": "5/22/2022",
    "manufacturer": "Gateron",
    "type": "Linear",
    "reviewUrl": "https://github.com/ThereminGoat/switch-scores/blob/master/8008%20Ink.pdf"
  },
  {
    "name": "AEBoards Naevy EC",
    "reviewedAt": "3/9/2025",
    "manufacturer": "Tecsee",
    "type": "Tactile",
    "reviewUrl": "https://github.com/ThereminGoat/switch-scores/blob/master/AEBoards%20Naevy%20EC.pdf"
  },
  {
    "name": "Aflion Black and Orange",
    "reviewedAt": "4/17/2022",
    "manufacturer": "Aflion",
    "type": "Tactile",
    "reviewUrl": "https://github.com/ThereminGoat/switch-scores/blob/master/Aflion%20Black%20and%20Orange.pdf"
  },
  {
    "name": "Aflion Thunder Shadow",
    "reviewedAt": "3/17/2024",
    "manufacturer": "Aflion",
    "type": "Tactile",
    "reviewUrl": "https://github.com/ThereminGoat/switch-scores/blob/master/Aflion%20Thunder%20Shadow.pdf"
  },
  {
    "name": "Aiguox Dark Sakura Glass",
    "reviewedAt": "1/5/2025",
    "manufacturer": "KTT",
    "type": "Silent Linear",
    "reviewUrl": "https://github.com/ThereminGoat/switch-scores/blob/master/Aiguox%20Dark%20Sakura%20Glass.pdf"
  },
  {
    "name": "Ajazz x Huano Banana",
    "reviewedAt": "9/19/2021",
    "manufacturer": "Huano",
    "type": "Tactile",
    "reviewUrl": "https://github.com/ThereminGoat/switch-scores/blob/master/Ajazz%20x%20Huano%20Banana.pdf"
  },
  {
    "name": "Ajazz x Huano Kiwi",
    "reviewedAt": "10/10/2021",
    "manufacturer": "Huano",
    "type": "Tactile",
    "reviewUrl": "https://github.com/ThereminGoat/switch-scores/blob/master/Ajazz%20x%20Huano%20Kiwi.pdf"
  },
  {
    "name": "Ajazz x Huano Peach",
    "reviewedAt": "9/26/2021",
    "manufacturer": "Huano",
    "type": "Linear",
    "reviewUrl": "https://github.com/ThereminGoat/switch-scores/blob/master/Ajazz%20x%20Huano%20Peach.pdf"
  },
  {
    "name": "Akko Bittersweet",
    "reviewedAt": "11/30/2025",
    "manufacturer": "Outemu",
    "type": "Tactile",
    "reviewUrl": "https://github.com/ThereminGoat/switch-scores/blob/master/Akko%20Bittersweet.pdf"
  },
  {
    "name": "Akko Cilantro",
    "reviewedAt": "5/18/2025",
    "manufacturer": "HMX",
    "type": "Tactile",
    "reviewUrl": "https://github.com/ThereminGoat/switch-scores/blob/master/Akko%20Cilantro.pdf"
  },
  {
    "name": "Akko Creamy Cyan",
    "reviewedAt": "4/6/2025",
    "manufacturer": "Outemu",
    "type": "Clicky",
    "reviewUrl": "https://github.com/ThereminGoat/switch-scores/blob/master/Akko%20Creamy%20Cyan.pdf"
  },
  {
    "name": "Akko Creamy Yellow U1",
    "reviewedAt": "8/16/2026",
    "manufacturer": "Huano",
    "type": "Linear",
    "reviewUrl": "https://github.com/ThereminGoat/switch-scores/blob/master/Akko%20Creamy%20Yellow%20U1.pdf"
  },
  {
    "name": "Akko CS Jelly White",
    "reviewedAt": "11/21/2021",
    "manufacturer": "KTT",
    "type": "Linear",
    "reviewUrl": "https://github.com/ThereminGoat/switch-scores/blob/master/Akko%20CS%20Jelly%20White.pdf"
  },
  {
    "name": "Akko CS Ocean Blue",
    "reviewedAt": "3/21/2021",
    "manufacturer": "KTT",
    "type": "Tactile",
    "reviewUrl": "https://github.com/ThereminGoat/switch-scores/blob/master/Akko%20CS%20Ocean%20Blue.pdf"
  },
  {
    "name": "Akko CS Rose Red",
    "reviewedAt": "3/21/2021",
    "manufacturer": "KTT",
    "type": "Linear",
    "reviewUrl": "https://github.com/ThereminGoat/switch-scores/blob/master/Akko%20CS%20Rose%20Red.pdf"
  },
  {
    "name": "Akko CS Sponge",
    "reviewedAt": "11/21/2021",
    "manufacturer": "KTT",
    "type": "Tactile",
    "reviewUrl": "https://github.com/ThereminGoat/switch-scores/blob/master/Akko%20CS%20Sponge.pdf"
  },
  {
    "name": "Akko CS Starfish",
    "reviewedAt": "11/21/2021",
    "manufacturer": "KTT",
    "type": "Linear",
    "reviewUrl": "https://github.com/ThereminGoat/switch-scores/blob/master/Akko%20CS%20Starfish.pdf"
  },
  {
    "name": "Akko Dracula",
    "reviewedAt": "12/1/2024",
    "manufacturer": "Outemu",
    "type": "Linear",
    "reviewUrl": "https://github.com/ThereminGoat/switch-scores/blob/master/Akko%20Dracula.pdf"
  },
  {
    "name": "Akko Flash Magnetic",
    "reviewedAt": "8/9/2026",
    "manufacturer": "Outemu",
    "type": "Linear",
    "reviewUrl": "https://github.com/ThereminGoat/switch-scores/blob/master/Akko%20Flash%20Magnetic.pdf"
  },
  {
    "name": "Akko Mirror",
    "reviewedAt": "11/24/2024",
    "manufacturer": "HMX",
    "type": "Linear",
    "reviewUrl": "https://github.com/ThereminGoat/switch-scores/blob/master/Akko%20Mirror.pdf"
  },
  {
    "name": "Akko Pink",
    "reviewedAt": "1/16/2022",
    "manufacturer": "Huano",
    "type": "Linear",
    "reviewUrl": "https://github.com/ThereminGoat/switch-scores/blob/master/Akko%20Pink.pdf"
  },
  {
    "name": "Akko V3 Cream Blue",
    "reviewedAt": "11/20/2022",
    "manufacturer": "KTT",
    "type": "Tactile",
    "reviewUrl": "https://github.com/ThereminGoat/switch-scores/blob/master/Akko%20V3%20Cream%20Blue.pdf"
  },
  {
    "name": "Akko V3 Cream Yellow",
    "reviewedAt": "11/20/2022",
    "manufacturer": "KTT",
    "type": "Linear",
    "reviewUrl": "https://github.com/ThereminGoat/switch-scores/blob/master/Akko%20V3%20Cream%20Yelow.pdf",
    "scorecardName": "Akko V3 Cream Yelow"
  },
  {
    "name": "Aliaz (80g)",
    "reviewedAt": "9/12/2021",
    "manufacturer": "Gateron",
    "type": "Silent Tactile",
    "reviewUrl": "https://github.com/ThereminGoat/switch-scores/blob/master/Aliaz%20(80g).pdf"
  },
  {
    "name": "Alpaca V2",
    "reviewedAt": "12/6/2020",
    "manufacturer": "Durock/JWK",
    "type": "Linear",
    "reviewUrl": "https://github.com/ThereminGoat/switch-scores/blob/master/Alpaca%20V2.pdf"
  },
  {
    "name": "Amethyst",
    "reviewedAt": "8/9/2021",
    "manufacturer": "Tecsee",
    "type": "Tactile",
    "reviewUrl": "https://github.com/ThereminGoat/switch-scores/blob/master/Amethyst.pdf"
  },
  {
    "name": "Anubis",
    "reviewedAt": "8/1/2021",
    "manufacturer": "Durock/JWK",
    "type": "Tactile",
    "reviewUrl": "https://github.com/ThereminGoat/switch-scores/blob/master/Anubis.pdf"
  },
  {
    "name": "Attack Shark Blue Jelly",
    "reviewedAt": "1/19/2025",
    "manufacturer": "Unknown",
    "type": "Tactile",
    "reviewUrl": "https://github.com/ThereminGoat/switch-scores/blob/master/Attack%20Shark%20Blue%20Jelly.pdf"
  },
  {
    "name": "Attack Shark Green Jelly",
    "reviewedAt": "1/19/2025",
    "manufacturer": "Unknown",
    "type": "Linear",
    "reviewUrl": "https://github.com/ThereminGoat/switch-scores/blob/master/Attack%20Shark%20Green%20Jelly.pdf"
  },
  {
    "name": "AULA Blue",
    "reviewedAt": "5/4/2025",
    "manufacturer": "SOAI",
    "type": "Clicky",
    "reviewUrl": "https://github.com/ThereminGoat/switch-scores/blob/master/AULA%20Blue.pdf"
  },
  {
    "name": "Auralite",
    "reviewedAt": "8/29/2021",
    "manufacturer": "Tecsee",
    "type": "Linear",
    "reviewUrl": "https://github.com/ThereminGoat/switch-scores/blob/master/Auralite.pdf"
  },
  {
    "name": "B.Stone Dark Eyes",
    "reviewedAt": "4/7/2024",
    "manufacturer": "Unknown",
    "type": "Tactile",
    "reviewUrl": "https://github.com/ThereminGoat/switch-scores/blob/master/B.%20Stone%20Dark%20Eyes.pdf",
    "scorecardName": "B. Stone Dark Eyes"
  },
  {
    "name": "Ball Bearing Blue",
    "reviewedAt": "3/24/2024",
    "manufacturer": "Unknown",
    "type": "Linear",
    "reviewUrl": "https://github.com/ThereminGoat/switch-scores/blob/master/Ball%20Bearing%20Blue.pdf"
  },
  {
    "name": "Betty",
    "reviewedAt": "11/6/2022",
    "manufacturer": "Haimu",
    "type": "Tactile",
    "reviewUrl": "https://github.com/ThereminGoat/switch-scores/blob/master/Betty.pdf"
  },
  {
    "name": "Blueberry Swirl",
    "reviewedAt": "6/4/2023",
    "manufacturer": "KTT",
    "type": "Linear",
    "reviewUrl": "https://github.com/ThereminGoat/switch-scores/blob/master/Blueberry%20Swirl.pdf"
  },
  {
    "name": "Bobagum (62g)",
    "reviewedAt": "1/16/2022",
    "manufacturer": "Outemu",
    "type": "Silent Linear",
    "reviewUrl": "https://github.com/ThereminGoat/switch-scores/blob/master/Bobagum%20(62g).pdf"
  },
  {
    "name": "BSUN Agarwood",
    "reviewedAt": "2/9/2025",
    "manufacturer": "BSUN",
    "type": "Linear",
    "reviewUrl": "https://github.com/ThereminGoat/switch-scores/blob/master/BSUN%20Agarwood.pdf"
  },
  {
    "name": "BSUN Avocado Panda V2",
    "reviewedAt": "2/5/2023",
    "manufacturer": "BSUN",
    "type": "Tactile",
    "reviewUrl": "https://github.com/ThereminGoat/switch-scores/blob/master/BSUN%20Avocado%20Panda%20V2.pdf"
  },
  {
    "name": "BSUN Banana Tactile",
    "reviewedAt": "12/31/2023",
    "manufacturer": "BSUN",
    "type": "Tactile",
    "reviewUrl": "https://github.com/ThereminGoat/switch-scores/blob/master/BSUN%20Banana%20Tactile.pdf"
  },
  {
    "name": "BSUN Bordeaux",
    "reviewedAt": "9/21/2025",
    "manufacturer": "BSUN",
    "type": "Tactile",
    "reviewUrl": "https://github.com/ThereminGoat/switch-scores/blob/master/BSUN%20Bordeaux.pdf"
  },
  {
    "name": "BSUN Golden Apple",
    "reviewedAt": "3/1/2026",
    "manufacturer": "BSUN",
    "type": "Tactile",
    "reviewUrl": "https://github.com/ThereminGoat/switch-scores/blob/master/BSUN%20Golden%20Apple.pdf"
  },
  {
    "name": "BSUN Milk Tea Siam V2",
    "reviewedAt": "12/15/2024",
    "manufacturer": "BSUN",
    "type": "Linear",
    "reviewUrl": "https://github.com/ThereminGoat/switch-scores/blob/master/BSUN%20Milk%20Tea%20Siam%20V2.pdf"
  },
  {
    "name": "BSUN Mozzarella",
    "reviewedAt": "6/28/2026",
    "manufacturer": "BSUN",
    "type": "Tactile",
    "reviewUrl": "https://github.com/ThereminGoat/switch-scores/blob/master/BSUN%20Mozzarella.pdf"
  },
  {
    "name": "BSUN Peach Mellow",
    "reviewedAt": "9/21/2025",
    "manufacturer": "BSUN",
    "type": "Tactile",
    "reviewUrl": "https://github.com/ThereminGoat/switch-scores/blob/master/BSUN%20Peach%20Mellow.pdf"
  },
  {
    "name": "BSUN Pikachu",
    "reviewedAt": "2/5/2023",
    "manufacturer": "BSUN",
    "type": "Linear",
    "reviewUrl": "https://github.com/ThereminGoat/switch-scores/blob/master/BSUN%20Pikachu.pdf"
  },
  {
    "name": "BSUN POM Linear",
    "reviewedAt": "2/23/2021",
    "manufacturer": "BSUN",
    "type": "Linear",
    "reviewUrl": "https://github.com/ThereminGoat/switch-scores/blob/master/BSUN%20POM%20Linear.pdf"
  },
  {
    "name": "BSUN Strawberry Cheesecake",
    "reviewedAt": "8/11/2024",
    "manufacturer": "BSUN",
    "type": "Tactile",
    "reviewUrl": "https://github.com/ThereminGoat/switch-scores/blob/master/BSUN%20Strawberry%20Cheesecake.pdf"
  },
  {
    "name": "C3 Kiwi",
    "reviewedAt": "8/1/2021",
    "manufacturer": "Durock/JWK",
    "type": "Tactile",
    "reviewUrl": "https://github.com/ThereminGoat/switch-scores/blob/master/Kiwi.pdf",
    "scorecardName": "Kiwi"
  },
  {
    "name": "C3 Macho",
    "reviewedAt": "9/12/2021",
    "manufacturer": "Durock/JWK",
    "type": "Linear",
    "reviewUrl": "https://github.com/ThereminGoat/switch-scores/blob/master/C3%20Macho.pdf"
  },
  {
    "name": "Caramel Chocolate (Lubed)",
    "reviewedAt": "12/31/2023",
    "manufacturer": "LICHICX",
    "type": "Linear",
    "reviewUrl": "https://github.com/ThereminGoat/switch-scores/blob/master/Caramel%20Chocolate%20(Lubed).pdf"
  },
  {
    "name": "Cherry Jailhouse Blue",
    "reviewedAt": "10/9/2022",
    "manufacturer": "Cherry",
    "type": "Tactile",
    "reviewUrl": "https://github.com/ThereminGoat/switch-scores/blob/master/Cherry%20Jailhouse%20Blue.pdf"
  },
  {
    "name": "Cherry MX 'New Nixie' (Black Clear-Top)",
    "reviewedAt": "12/4/2022",
    "manufacturer": "Cherry",
    "type": "Linear",
    "reviewUrl": "https://github.com/ThereminGoat/switch-scores/blob/master/Cherry%20MX%20'New%20Nixie'%20(Black%20Clear-Top).pdf"
  },
  {
    "name": "Cherry MX Brown (3 Pin)",
    "reviewedAt": "3/14/2021",
    "manufacturer": "Cherry",
    "type": "Tactile",
    "reviewUrl": "https://github.com/ThereminGoat/switch-scores/blob/master/Cherry%20MX%20Brown.pdf",
    "scorecardName": "Cherry MX Brown"
  },
  {
    "name": "Cherry MX Ergo Clear (3 Pin)",
    "reviewedAt": "5/7/2023",
    "manufacturer": "Cherry",
    "type": "Tactile",
    "reviewUrl": "https://github.com/ThereminGoat/switch-scores/blob/master/Cherry%20MX%20Ergo%20Clear.pdf",
    "scorecardName": "Cherry MX Ergo Clear"
  },
  {
    "name": "Cherry MX Falcon",
    "reviewedAt": "10/5/2025",
    "manufacturer": "Cherry",
    "type": "Tactile",
    "reviewUrl": "https://github.com/ThereminGoat/switch-scores/blob/master/Cherry%20MX%20Falcon.pdf"
  },
  {
    "name": "Cherry MX Firefinch",
    "reviewedAt": "1/4/2026",
    "manufacturer": "Cherry",
    "type": "Linear",
    "reviewUrl": "https://github.com/ThereminGoat/switch-scores/blob/master/Cherry%20MX%20Firefinch.pdf"
  },
  {
    "name": "Cherry MX Honey",
    "reviewedAt": "9/25/2025",
    "manufacturer": "Cherry",
    "type": "Silent Tactile",
    "reviewUrl": "https://github.com/ThereminGoat/switch-scores/blob/master/Cherry%20MX%20Honey.pdf"
  },
  {
    "name": "Cherry MX Lumina Brown",
    "reviewedAt": "7/19/2026",
    "manufacturer": "Cherry",
    "type": "Tactile",
    "reviewUrl": "https://github.com/ThereminGoat/switch-scores/blob/master/Cherry%20MX%20Lumina%20Brown.pdf"
  },
  {
    "name": "Cherry MX Northern Light",
    "reviewedAt": "4/17/2025",
    "manufacturer": "Cherry",
    "type": "Silent Linear",
    "reviewUrl": "https://github.com/ThereminGoat/switch-scores/blob/master/Cherry%20MX%20Northern%20Light.pdf"
  },
  {
    "name": "Cherry MX Orange",
    "reviewedAt": "7/21/2024",
    "manufacturer": "Cherry",
    "type": "Linear",
    "reviewUrl": "https://github.com/ThereminGoat/switch-scores/blob/master/Cherry%20MX%20Orange.pdf"
  },
  {
    "name": "Cherry MX Petal",
    "reviewedAt": "11/8/2025",
    "manufacturer": "Cherry",
    "type": "Tactile",
    "reviewUrl": "https://github.com/ThereminGoat/switch-scores/blob/master/Cherry%20MX%20Petal.pdf"
  },
  {
    "name": "Cherry MX Purple",
    "reviewedAt": "1/7/2024",
    "manufacturer": "Cherry",
    "type": "Tactile",
    "reviewUrl": "https://github.com/ThereminGoat/switch-scores/blob/master/Cherry%20MX%20Purple.pdf"
  },
  {
    "name": "Cherry MX2A RGB Black (3 Pin)",
    "reviewedAt": "8/27/2023",
    "manufacturer": "Cherry",
    "type": "Linear",
    "reviewUrl": "https://github.com/ThereminGoat/switch-scores/blob/master/Cherry%20MX2A%20RGB%20Black.pdf",
    "scorecardName": "Cherry MX2A RGB Black"
  },
  {
    "name": "Cherry MX2A RGB Blue (3 Pin)",
    "reviewedAt": "9/3/2023",
    "manufacturer": "Cherry",
    "type": "Clicky",
    "reviewUrl": "https://github.com/ThereminGoat/switch-scores/blob/master/Cherry%20MX2A%20RGB%20Blue.pdf",
    "scorecardName": "Cherry MX2A RGB Blue"
  },
  {
    "name": "Cherry Viola",
    "reviewedAt": "2/25/2024",
    "manufacturer": "Cherry",
    "type": "Linear",
    "reviewUrl": "https://github.com/ThereminGoat/switch-scores/blob/master/Cherry%20Viola.pdf"
  },
  {
    "name": "Chosfox Hanami Dango Green",
    "reviewedAt": "5/21/2023",
    "manufacturer": "Durock/JWK",
    "type": "Tactile",
    "reviewUrl": "https://github.com/ThereminGoat/switch-scores/blob/master/Chosfox%20Hanami%20Dango%20Green.pdf"
  },
  {
    "name": "Chosfox Hanami Dango Pink",
    "reviewedAt": "5/21/2023",
    "manufacturer": "Durock/JWK",
    "type": "Linear",
    "reviewUrl": "https://github.com/ThereminGoat/switch-scores/blob/master/Chosfox%20Hanami%20Dango%20Pink.pdf"
  },
  {
    "name": "Chosfox Summer Lime",
    "reviewedAt": "10/8/2023",
    "manufacturer": "Unknown",
    "type": "Silent Linear",
    "reviewUrl": "https://github.com/ThereminGoat/switch-scores/blob/master/Chosfox%20Summer%20Lime.pdf"
  },
  {
    "name": "CK x Haimu Pastel Thistle",
    "reviewedAt": "7/23/2023",
    "manufacturer": "Haimu",
    "type": "Tactile",
    "reviewUrl": "https://github.com/ThereminGoat/switch-scores/blob/master/CK%20x%20Haimu%20Pastel%20Thistle.pdf"
  },
  {
    "name": "Content Blue (Black Bottom)",
    "reviewedAt": "5/5/2024",
    "manufacturer": "KTT",
    "type": "Clicky",
    "reviewUrl": "https://github.com/ThereminGoat/switch-scores/blob/master/Content%20Blue%20(Black%20Bottom).pdf"
  },
  {
    "name": "Cookies n' Cream",
    "reviewedAt": "1/29/2024",
    "manufacturer": "KTT",
    "type": "Tactile",
    "reviewUrl": "https://github.com/ThereminGoat/switch-scores/blob/master/Cookies%20n'%20Cream.pdf"
  },
  {
    "name": "Cotton Candy",
    "reviewedAt": "3/6/2022",
    "manufacturer": "Durock/JWK",
    "type": "Tactile",
    "reviewUrl": "https://github.com/ThereminGoat/switch-scores/blob/master/Cotton%20Candy.pdf"
  },
  {
    "name": "Cow Orange",
    "reviewedAt": "10/10/2021",
    "manufacturer": "Tecsee",
    "type": "Linear",
    "reviewUrl": "https://github.com/ThereminGoat/switch-scores/blob/master/Cow%20Orange.pdf"
  },
  {
    "name": "Crane",
    "reviewedAt": "9/12/2021",
    "manufacturer": "Durock/JWK",
    "type": "Tactile",
    "reviewUrl": "https://github.com/ThereminGoat/switch-scores/blob/master/Crane.pdf"
  },
  {
    "name": "Cream Tactile",
    "reviewedAt": "10/31/2021",
    "manufacturer": "Kailh",
    "type": "Tactile",
    "reviewUrl": "https://github.com/ThereminGoat/switch-scores/blob/master/Novelkeys%20Cream%20Tactile.pdf",
    "scorecardName": "Novelkeys Cream Tactile"
  },
  {
    "name": "DareU Mahjong",
    "reviewedAt": "8/6/2023",
    "manufacturer": "Huano",
    "type": "Linear",
    "reviewUrl": "https://github.com/ThereminGoat/switch-scores/blob/master/DareU%20Mahjong.pdf"
  },
  {
    "name": "Designer Studio Graphite Gold",
    "reviewedAt": "6/26/2022",
    "manufacturer": "Durock/JWK",
    "type": "Linear",
    "reviewUrl": "https://github.com/ThereminGoat/switch-scores/blob/master/Designer%20Studio%20Graphite%20Gold.pdf"
  },
  {
    "name": "DesignerStudio White Jade",
    "reviewedAt": "6/19/2022",
    "manufacturer": "Durock/JWK",
    "type": "Tactile",
    "reviewUrl": "https://github.com/ThereminGoat/switch-scores/blob/master/DesignerStudio%20White%20Jade.pdf"
  },
  {
    "name": "Diamond Avalon",
    "reviewedAt": "10/1/2023",
    "manufacturer": "Unknown",
    "type": "Linear",
    "reviewUrl": "https://github.com/ThereminGoat/switch-scores/blob/master/Diamond%20Avalon.pdf"
  },
  {
    "name": "DK Creamery Cookie Dough",
    "reviewedAt": "11/19/2023",
    "manufacturer": "KTT",
    "type": "Silent Linear",
    "reviewUrl": "https://github.com/ThereminGoat/switch-scores/blob/master/DK%20Creamery%20Cookie%20Dough.pdf"
  },
  {
    "name": "Doom Linear",
    "reviewedAt": "5/25/2025",
    "manufacturer": "Meirun",
    "type": "Linear",
    "reviewUrl": "https://github.com/ThereminGoat/switch-scores/blob/master/Doom%20Linear.pdf"
  },
  {
    "name": "Durock Mocha Chocolate",
    "reviewedAt": "6/22/2025",
    "manufacturer": "Durock/JWK",
    "type": "Tactile",
    "reviewUrl": "https://github.com/ThereminGoat/switch-scores/blob/master/Durock%20Mocha%20Chocolate.pdf"
  },
  {
    "name": "Durock Mocha Silk",
    "reviewedAt": "6/22/2025",
    "manufacturer": "Durock/JWK",
    "type": "Linear",
    "reviewUrl": "https://github.com/ThereminGoat/switch-scores/blob/master/Durock%20Mocha%20Silk.pdf"
  },
  {
    "name": "Durock POM Linear (Sample)",
    "reviewedAt": "12/20/2020",
    "manufacturer": "Durock/JWK",
    "type": "Linear",
    "reviewUrl": "https://github.com/ThereminGoat/switch-scores/blob/master/Durock%20POM%20Linear%20(Sample).pdf"
  },
  {
    "name": "Durock Sea Glass",
    "reviewedAt": "9/3/2023",
    "manufacturer": "Durock/JWK",
    "type": "Linear",
    "reviewUrl": "https://github.com/ThereminGoat/switch-scores/blob/master/Durock%20Sea%20Glass.pdf"
  },
  {
    "name": "Durock Sunflower",
    "reviewedAt": "5/28/2021",
    "manufacturer": "Durock/JWK",
    "type": "Tactile",
    "reviewUrl": "https://github.com/ThereminGoat/switch-scores/blob/master/Durock%20Sunflower.pdf"
  },
  {
    "name": "EMT V2",
    "reviewedAt": "10/30/2022",
    "manufacturer": "Haimu",
    "type": "Linear",
    "reviewUrl": "https://github.com/ThereminGoat/switch-scores/blob/master/EMT%20V2.pdf"
  },
  {
    "name": "Ethereal Panda",
    "reviewedAt": "5/22/2022",
    "manufacturer": "Tecsee",
    "type": "Tactile",
    "reviewUrl": "https://github.com/ThereminGoat/switch-scores/blob/master/Ethereal%20Panda.pdf"
  },
  {
    "name": "Everfree Cedar",
    "reviewedAt": "9/22/2024",
    "manufacturer": "Gateron",
    "type": "Linear",
    "reviewUrl": "https://github.com/ThereminGoat/switch-scores/blob/master/Everfree%20Cedar.pdf"
  },
  {
    "name": "Everfree Fast Silver",
    "reviewedAt": "2/8/2026",
    "manufacturer": "Gateron",
    "type": "Linear",
    "reviewUrl": "https://github.com/ThereminGoat/switch-scores/blob/master/Everfree%20Fast%20Silver.pdf"
  },
  {
    "name": "Everfree Grayish Tactile",
    "reviewedAt": "4/28/2024",
    "manufacturer": "Gateron",
    "type": "Tactile",
    "reviewUrl": "https://github.com/ThereminGoat/switch-scores/blob/master/Everfree%20Grayish%20Tactile.pdf"
  },
  {
    "name": "Everglide Amber Orange V2 Pro!",
    "reviewedAt": "8/1/2021",
    "manufacturer": "Durock/JWK",
    "type": "Linear",
    "reviewUrl": "https://github.com/ThereminGoat/switch-scores/blob/master/Everglide%20Amber%20Orange%20V2%20Pro.pdf",
    "scorecardName": "Everglide Amber Orange V2 Pro"
  },
  {
    "name": "Everglide Coral Red V2 Pro!",
    "reviewedAt": "8/1/2021",
    "manufacturer": "Durock/JWK",
    "type": "Linear",
    "reviewUrl": "https://github.com/ThereminGoat/switch-scores/blob/master/Everglide%20Coral%20Red%20V2%20Pro.pdf",
    "scorecardName": "Everglide Coral Red V2 Pro"
  },
  {
    "name": "Everglide Jade Green V2",
    "reviewedAt": "8/1/2021",
    "manufacturer": "Durock/JWK",
    "type": "Tactile",
    "reviewUrl": "https://github.com/ThereminGoat/switch-scores/blob/master/Everglide%20Jade%20Green%20V2.pdf"
  },
  {
    "name": "Everglide Lightning Silver Light Green",
    "reviewedAt": "1/30/2022",
    "manufacturer": "Durock/JWK",
    "type": "Linear",
    "reviewUrl": "https://github.com/ThereminGoat/switch-scores/blob/master/Everglide%20Lightning%20Silver%20Light%20Green.pdf"
  },
  {
    "name": "Everglide Magneto UE",
    "reviewedAt": "7/20/2025",
    "manufacturer": "Grain Gold",
    "type": "Linear",
    "reviewUrl": "https://github.com/ThereminGoat/switch-scores/blob/master/Everglide%20Magneto%20UE.pdf"
  },
  {
    "name": "Everglide Sakura Pink V2",
    "reviewedAt": "8/1/2021",
    "manufacturer": "Durock/JWK",
    "type": "Linear",
    "reviewUrl": "https://github.com/ThereminGoat/switch-scores/blob/master/Everglide%20Sakura%20Pink%20V2.pdf"
  },
  {
    "name": "Everglide Sky Blue V2.5",
    "reviewedAt": "5/22/2022",
    "manufacturer": "Durock/JWK",
    "type": "Linear",
    "reviewUrl": "https://github.com/ThereminGoat/switch-scores/blob/master/Everglide%20Sky%20Blue%20V2.5.pdf"
  },
  {
    "name": "Everglide V3 'Water King' (60g)",
    "reviewedAt": "2/28/2020",
    "manufacturer": "Durock/JWK",
    "type": "Linear",
    "reviewUrl": "https://github.com/ThereminGoat/switch-scores/blob/master/Everglide%20V3%20'Water%20King'%20(60g).pdf"
  },
  {
    "name": "Feker Emerald Cabbage",
    "reviewedAt": "1/21/2024",
    "manufacturer": "Unknown",
    "type": "Linear",
    "reviewUrl": "https://github.com/ThereminGoat/switch-scores/blob/master/Feker%20Emerald%20Cabbage.pdf"
  },
  {
    "name": "Frost Panda",
    "reviewedAt": "6/6/2021",
    "manufacturer": "Tecsee",
    "type": "Linear",
    "reviewUrl": "https://github.com/ThereminGoat/switch-scores/blob/master/Frost%20Panda.pdf"
  },
  {
    "name": "G-Square Ram V2",
    "reviewedAt": "9/8/2024",
    "manufacturer": "Grain Gold",
    "type": "Tactile",
    "reviewUrl": "https://github.com/ThereminGoat/switch-scores/blob/master/G-Square%20Ram%20V2.pdf"
  },
  {
    "name": "Gamakay Jupiter",
    "reviewedAt": "1/28/2024",
    "manufacturer": "Outemu",
    "type": "Linear",
    "reviewUrl": "https://github.com/ThereminGoat/switch-scores/blob/master/Gamakay%20Jupiter.pdf"
  },
  {
    "name": "Gamakay Venus",
    "reviewedAt": "1/28/2024",
    "manufacturer": "Outemu",
    "type": "Tactile",
    "reviewUrl": "https://github.com/ThereminGoat/switch-scores/blob/master/Gamaky%20Venus.pdf",
    "scorecardName": "Gamaky Venus"
  },
  {
    "name": "Gateron Azure Dragon",
    "reviewedAt": "8/15/2021",
    "manufacturer": "Gateron",
    "type": "Tactile",
    "reviewUrl": "https://github.com/ThereminGoat/switch-scores/blob/master/Gateron%20Azure%20Dragon.pdf"
  },
  {
    "name": "Gateron Azure Dragon V2",
    "reviewedAt": "12/11/2022",
    "manufacturer": "Gateron",
    "type": "Tactile",
    "reviewUrl": "https://github.com/ThereminGoat/switch-scores/blob/master/Gateron%20Azure%20Dragon%20V2.pdf"
  },
  {
    "name": "Gateron Azure Dragon V4",
    "reviewedAt": "11/30/2025",
    "manufacturer": "Gateron",
    "type": "Tactile",
    "reviewUrl": "https://github.com/ThereminGoat/switch-scores/blob/master/Gateron%20Azure%20Dragon%20V4.pdf"
  },
  {
    "name": "Gateron Beer",
    "reviewedAt": "12/31/2023",
    "manufacturer": "Gateron",
    "type": "Tactile",
    "reviewUrl": "https://github.com/ThereminGoat/switch-scores/blob/master/Gateron%20Beer.pdf"
  },
  {
    "name": "Gateron Box Ink Black",
    "reviewedAt": "10/24/2021",
    "manufacturer": "Gateron",
    "type": "Linear",
    "reviewUrl": "https://github.com/ThereminGoat/switch-scores/blob/master/Gateron%20Box%20Ink%20Black.pdf"
  },
  {
    "name": "Gateron Box Ink Pink",
    "reviewedAt": "10/16/2021",
    "manufacturer": "Gateron",
    "type": "Linear",
    "reviewUrl": "https://github.com/ThereminGoat/switch-scores/blob/master/Gateron%20Box%20Ink%20Pink.pdf"
  },
  {
    "name": "Gateron Cap Brown",
    "reviewedAt": "4/11/2021",
    "manufacturer": "Gateron",
    "type": "Tactile",
    "reviewUrl": "https://github.com/ThereminGoat/switch-scores/blob/master/Gateron%20Cap%20Brown.pdf"
  },
  {
    "name": "Gateron CJ",
    "reviewedAt": "10/3/2021",
    "manufacturer": "Gateron",
    "type": "Linear",
    "reviewUrl": "https://github.com/ThereminGoat/switch-scores/blob/master/Gateron%20CJ.pdf"
  },
  {
    "name": "Gateron Cream Soda",
    "reviewedAt": "10/23/2022",
    "manufacturer": "Gateron",
    "type": "Linear",
    "reviewUrl": "https://github.com/ThereminGoat/switch-scores/blob/master/Gateron%20Cream%20Soda.pdf"
  },
  {
    "name": "Gateron Deepping",
    "reviewedAt": "5/26/2024",
    "manufacturer": "Gateron",
    "type": "Linear",
    "reviewUrl": "https://github.com/ThereminGoat/switch-scores/blob/master/Gateron%20Deepping.pdf"
  },
  {
    "name": "Gateron Dual-Rail Magnetic Orange",
    "reviewedAt": "6/9/2024",
    "manufacturer": "Gateron",
    "type": "Linear",
    "reviewUrl": "https://github.com/ThereminGoat/switch-scores/blob/master/Gateron%20Dual-Rail%20Magnetic%20Orange.pdf"
  },
  {
    "name": "Gateron Full POM Banana Smoothie",
    "reviewedAt": "2/8/2026",
    "manufacturer": "Gateron",
    "type": "Tactile",
    "reviewUrl": "https://github.com/ThereminGoat/switch-scores/blob/master/Gateron%20Full%20POM%20Banana%20Smoothie.pdf"
  },
  {
    "name": "Gateron G Pro 3.0 Yellow",
    "reviewedAt": "8/6/2023",
    "manufacturer": "Gateron",
    "type": "Linear",
    "reviewUrl": "https://github.com/ThereminGoat/switch-scores/blob/master/Gateron%20G%20Pro%203.0%20Yellow.pdf"
  },
  {
    "name": "Gateron Genty Silent HE",
    "reviewedAt": "5/4/2025",
    "manufacturer": "Gateron",
    "type": "Silent Linear",
    "reviewUrl": "https://github.com/ThereminGoat/switch-scores/blob/master/Gateron%20Genty%20Silent%20HE.pdf"
  },
  {
    "name": "Gateron Green Apple",
    "reviewedAt": "1/26/2025",
    "manufacturer": "Gateron",
    "type": "Tactile",
    "reviewUrl": "https://github.com/ThereminGoat/switch-scores/blob/master/Gateron%20Green%20Apple.pdf"
  },
  {
    "name": "Gateron Harmonic",
    "reviewedAt": "2/8/2026",
    "manufacturer": "Gateron",
    "type": "Clicky",
    "reviewUrl": "https://github.com/ThereminGoat/switch-scores/blob/master/Gateron%20Harmonic.pdf"
  },
  {
    "name": "Gateron Hippo",
    "reviewedAt": "4/4/2021",
    "manufacturer": "Gateron",
    "type": "Linear",
    "reviewUrl": "https://github.com/ThereminGoat/switch-scores/blob/master/Gateron%20Hippo.pdf"
  },
  {
    "name": "Gateron Icey Spring",
    "reviewedAt": "9/20/2026",
    "manufacturer": "Gateron",
    "type": "Linear",
    "reviewUrl": "https://github.com/ThereminGoat/switch-scores/blob/master/Gateron%20Icey%20Spring.pdf"
  },
  {
    "name": "Gateron Ink Blue V1",
    "reviewedAt": "8/15/2021",
    "manufacturer": "Gateron",
    "type": "Clicky",
    "reviewUrl": "https://github.com/ThereminGoat/switch-scores/blob/master/Gateron%20Ink%20Blue%20V1.pdf"
  },
  {
    "name": "Gateron Ink Yellow V2",
    "reviewedAt": "1/16/2022",
    "manufacturer": "Gateron",
    "type": "Linear",
    "reviewUrl": "https://github.com/ThereminGoat/switch-scores/blob/master/Gateron%20Ink%20Yellow%20V2.pdf"
  },
  {
    "name": "Gateron Kangaroo Inks",
    "reviewedAt": "11/21/2020",
    "manufacturer": "Gateron",
    "type": "Tactile",
    "reviewUrl": "https://github.com/ThereminGoat/switch-scores/blob/master/Gateron%20Kangaroo%20Ink.pdf",
    "scorecardName": "Gateron Kangaroo Ink"
  },
  {
    "name": "Gateron Keyfirst Cream",
    "reviewedAt": "9/12/2021",
    "manufacturer": "Gateron",
    "type": "Linear",
    "reviewUrl": "https://github.com/ThereminGoat/switch-scores/blob/master/Gateron%20Keyfirst%20Cream.pdf"
  },
  {
    "name": "Gateron Lanes",
    "reviewedAt": "9/14/2025",
    "manufacturer": "Gateron",
    "type": "Tactile",
    "reviewUrl": "https://github.com/ThereminGoat/switch-scores/blob/master/Gateron%20Lanes.pdf"
  },
  {
    "name": "Gateron Longjing Tea",
    "reviewedAt": "7/6/2025",
    "manufacturer": "Gateron",
    "type": "Tactile",
    "reviewUrl": "https://github.com/ThereminGoat/switch-scores/blob/master/Gateron%20Longjing%20Tea.pdf"
  },
  {
    "name": "Gateron Luciola",
    "reviewedAt": "6/4/2023",
    "manufacturer": "Gateron",
    "type": "Linear",
    "reviewUrl": "https://github.com/ThereminGoat/switch-scores/blob/master/Gateron%20Luciola.pdf"
  },
  {
    "name": "Gateron Lunar Probe",
    "reviewedAt": "2/25/2024",
    "manufacturer": "Gateron",
    "type": "Linear",
    "reviewUrl": "https://github.com/ThereminGoat/switch-scores/blob/master/Gateron%20Lunar%20Probe.pdf"
  },
  {
    "name": "Gateron Magnetic Green Dragon HE",
    "reviewedAt": "6/1/2025",
    "manufacturer": "Gateron",
    "type": "Linear",
    "reviewUrl": "https://github.com/ThereminGoat/switch-scores/blob/master/Gateron%20Magnetic%20Green%20Dragon%20HE.pdf"
  },
  {
    "name": "Gateron Magnetic Jade Delta Dark",
    "reviewedAt": "2/1/2026",
    "manufacturer": "Gateron",
    "type": "Linear",
    "reviewUrl": "https://github.com/ThereminGoat/switch-scores/blob/master/Gateron%20Magnetic%20Jade%20Delta%20Dark.pdf"
  },
  {
    "name": "Gateron Magnetic Jade Emerald",
    "reviewedAt": "10/11/2025",
    "manufacturer": "Gateron",
    "type": "Tactile",
    "reviewUrl": "https://github.com/ThereminGoat/switch-scores/blob/master/Gateron%20Magnetic%20Jade%20Emerald.pdf"
  },
  {
    "name": "Gateron Melodic",
    "reviewedAt": "2/4/2024",
    "manufacturer": "Gateron",
    "type": "Clicky",
    "reviewUrl": "https://github.com/ThereminGoat/switch-scores/blob/master/Gateron%20Melodic.pdf"
  },
  {
    "name": "Gateron Mini",
    "reviewedAt": "3/6/2022",
    "manufacturer": "Gateron",
    "type": "Linear",
    "reviewUrl": "https://github.com/ThereminGoat/switch-scores/blob/master/Gateron%20Mini.pdf"
  },
  {
    "name": "Gateron Mink",
    "reviewedAt": "4/3/2022",
    "manufacturer": "Gateron",
    "type": "Linear",
    "reviewUrl": "https://github.com/ThereminGoat/switch-scores/blob/master/Gateron%20Mink.pdf"
  },
  {
    "name": "Gateron Mochi",
    "reviewedAt": "11/7/2021",
    "manufacturer": "Gateron",
    "type": "Linear",
    "reviewUrl": "https://github.com/ThereminGoat/switch-scores/blob/master/Gateron%20Mochi.pdf"
  },
  {
    "name": "Gateron N1",
    "reviewedAt": "8/15/2021",
    "manufacturer": "Gateron",
    "type": "Linear",
    "reviewUrl": "https://github.com/ThereminGoat/switch-scores/blob/master/Gateron%20N1.pdf"
  },
  {
    "name": "Gateron Oil King",
    "reviewedAt": "1/23/2022",
    "manufacturer": "Gateron",
    "type": "Linear",
    "reviewUrl": "https://github.com/ThereminGoat/switch-scores/blob/master/Gateron%20Oil%20King.pdf"
  },
  {
    "name": "Gateron Oil King Silent Tactile",
    "reviewedAt": "6/21/2026",
    "manufacturer": "Gateron",
    "type": "Silent Tactile",
    "reviewUrl": "https://github.com/ThereminGoat/switch-scores/blob/master/Gateron%20Oil%20King%20Silent%20Tactile.pdf"
  },
  {
    "name": "Gateron Pro Ultra Glory Yellow",
    "reviewedAt": "9/29/2024",
    "manufacturer": "Gateron",
    "type": "Linear",
    "reviewUrl": "https://github.com/ThereminGoat/switch-scores/blob/master/Gateron%20Pro%20Ultra%20Glory%20Yellow.pdf"
  },
  {
    "name": "Gateron Pro Yellow",
    "reviewedAt": "5/28/2021",
    "manufacturer": "Gateron",
    "type": "Linear",
    "reviewUrl": "https://github.com/ThereminGoat/switch-scores/blob/master/Gateron%20Pro%20Yellow.pdf"
  },
  {
    "name": "Gateron Robin",
    "reviewedAt": "9/12/2021",
    "manufacturer": "Gateron",
    "type": "Linear",
    "reviewUrl": "https://github.com/ThereminGoat/switch-scores/blob/master/Gateron%20Robin.pdf"
  },
  {
    "name": "Gateron Root Beer Float",
    "reviewedAt": "4/16/2023",
    "manufacturer": "Gateron",
    "type": "Tactile",
    "reviewUrl": "https://github.com/ThereminGoat/switch-scores/blob/master/Gateron%20Root%20Beer%20Float.pdf"
  },
  {
    "name": "Gateron Slate Grey",
    "reviewedAt": "1/21/2021",
    "manufacturer": "Gateron",
    "type": "Linear",
    "reviewUrl": "https://github.com/ThereminGoat/switch-scores/blob/master/Gateron%20Slate%20Grey.pdf"
  },
  {
    "name": "Gateron SolDark",
    "reviewedAt": "12/5/2021",
    "manufacturer": "Gateron",
    "type": "Tactile",
    "reviewUrl": "https://github.com/ThereminGoat/switch-scores/blob/master/Gateron%20SolDark.pdf"
  },
  {
    "name": "Gateron Speed Silver Pro",
    "reviewedAt": "5/28/2021",
    "manufacturer": "Gateron",
    "type": "Linear",
    "reviewUrl": "https://github.com/ThereminGoat/switch-scores/blob/master/Gateron%20Speed%20Silver%20Pro.pdf"
  },
  {
    "name": "Gateron UHMknown",
    "reviewedAt": "4/30/2023",
    "manufacturer": "Gateron",
    "type": "Linear",
    "reviewUrl": "https://github.com/ThereminGoat/switch-scores/blob/master/Gateron%20UHMknown.pdf"
  },
  {
    "name": "Gateron Vermilion Bird",
    "reviewedAt": "8/15/2021",
    "manufacturer": "Gateron",
    "type": "Linear",
    "reviewUrl": "https://github.com/ThereminGoat/switch-scores/blob/master/Gateron%20Vermilion%20Bird.pdf"
  },
  {
    "name": "Gateron X V3",
    "reviewedAt": "6/28/2025",
    "manufacturer": "Gateron",
    "type": "Linear",
    "reviewUrl": "https://github.com/ThereminGoat/switch-scores/blob/master/Gateron%20X%20V3.pdf"
  },
  {
    "name": "Gateron X Yellow",
    "reviewedAt": "11/7/2021",
    "manufacturer": "Gateron",
    "type": "Linear",
    "reviewUrl": "https://github.com/ThereminGoat/switch-scores/blob/master/Gateron%20X%20Yellow.pdf"
  },
  {
    "name": "Gateron Yellow KS-8",
    "reviewedAt": "8/1/2021",
    "manufacturer": "Gateron",
    "type": "Linear",
    "reviewUrl": "https://github.com/ThereminGoat/switch-scores/blob/master/Gateron%20Yellow%20KS-8.pdf"
  },
  {
    "name": "Gazzew U4 Boba 68g (Sample)",
    "reviewedAt": "8/1/2021",
    "manufacturer": "Outemu",
    "type": "Silent Tactile",
    "reviewUrl": "https://github.com/ThereminGoat/switch-scores/blob/master/Gazzew%20U4%20Boba%2068g%20(Sample).pdf"
  },
  {
    "name": "Geon Lucifer HE",
    "reviewedAt": "5/4/2025",
    "manufacturer": "Grain Gold",
    "type": "Linear",
    "reviewUrl": "https://github.com/ThereminGoat/switch-scores/blob/master/Geon%20Lucifer%20HE.pdf"
  },
  {
    "name": "Geon Raptor MX",
    "reviewedAt": "4/7/2024",
    "manufacturer": "BSUN",
    "type": "Linear",
    "reviewUrl": "https://github.com/ThereminGoat/switch-scores/blob/master/Geon%20Raptor%20MX.pdf"
  },
  {
    "name": "Geon Raw HE",
    "reviewedAt": "12/15/2024",
    "manufacturer": "Grain Gold",
    "type": "Linear",
    "reviewUrl": "https://github.com/ThereminGoat/switch-scores/blob/master/Geon%20Raw%20HE.pdf"
  },
  {
    "name": "Glorious Lynx (Unlubed)",
    "reviewedAt": "8/29/2021",
    "manufacturer": "Tecsee",
    "type": "Linear",
    "reviewUrl": "https://github.com/ThereminGoat/switch-scores/blob/master/Glorious%20Lynx%20(Unlubed).pdf"
  },
  {
    "name": "Glorious Mako Ultralight",
    "reviewedAt": "10/20/2024",
    "manufacturer": "Outemu",
    "type": "Tactile",
    "reviewUrl": "https://github.com/ThereminGoat/switch-scores/blob/master/Glorious%20Mako%20Ultralight.pdf"
  },
  {
    "name": "Glorious Panda",
    "reviewedAt": "8/1/2021",
    "manufacturer": "Tecsee",
    "type": "Tactile",
    "reviewUrl": "https://github.com/ThereminGoat/switch-scores/blob/master/Glorious%20Panda.pdf"
  },
  {
    "name": "Glorious Panda Silent",
    "reviewedAt": "11/17/2024",
    "manufacturer": "Outemu",
    "type": "Silent Tactile",
    "reviewUrl": "https://github.com/ThereminGoat/switch-scores/blob/master/Glorious%20Panda%20Silent.pdf"
  },
  {
    "name": "Gravastar UFO Purple",
    "reviewedAt": "6/7/2026",
    "manufacturer": "Unknown",
    "type": "Linear",
    "reviewUrl": "https://github.com/ThereminGoat/switch-scores/blob/master/Gravastar%20UFO%20Purple.pdf"
  },
  {
    "name": "Greetech OG Brown",
    "reviewedAt": "12/7/2025",
    "manufacturer": "Greetech",
    "type": "Tactile",
    "reviewUrl": "https://github.com/ThereminGoat/switch-scores/blob/master/Greetech%20OG%20Brown%20(5%20Pin).pdf",
    "scorecardName": "Greetech OG Brown (5 Pin)"
  },
  {
    "name": "Greetech Razer Green",
    "reviewedAt": "1/16/2022",
    "manufacturer": "Greetech",
    "type": "Clicky",
    "reviewUrl": "https://github.com/ThereminGoat/switch-scores/blob/master/Greetech%20Razer%20Green.pdf"
  },
  {
    "name": "Greetech Razer Orange",
    "reviewedAt": "1/16/2022",
    "manufacturer": "Greetech",
    "type": "Tactile",
    "reviewUrl": "https://github.com/ThereminGoat/switch-scores/blob/master/Greetech%20Razer%20Orange.pdf"
  },
  {
    "name": "Greetech Razer Yellow",
    "reviewedAt": "1/16/2022",
    "manufacturer": "Greetech",
    "type": "Linear",
    "reviewUrl": "https://github.com/ThereminGoat/switch-scores/blob/master/Greetech%20Razer%20Yellow.pdf"
  },
  {
    "name": "Greetech Sunset",
    "reviewedAt": "4/14/2024",
    "manufacturer": "Greetech",
    "type": "Linear",
    "reviewUrl": "https://github.com/ThereminGoat/switch-scores/blob/master/Greetech%20Sunset.pdf"
  },
  {
    "name": "Haimu Frost Crystal",
    "reviewedAt": "7/26/2026",
    "manufacturer": "Haimu",
    "type": "Tactile",
    "reviewUrl": "https://github.com/ThereminGoat/switch-scores/blob/master/Haimu%20Frost%20Crystal.pdf"
  },
  {
    "name": "Haimu Gray Jade Tactile",
    "reviewedAt": "12/15/2024",
    "manufacturer": "Haimu",
    "type": "Tactile",
    "reviewUrl": "https://github.com/ThereminGoat/switch-scores/blob/master/Haimu%20Gray%20Jade%20Tactile.pdf"
  },
  {
    "name": "Haimu Heartbeat",
    "reviewedAt": "9/11/2022",
    "manufacturer": "Haimu",
    "type": "Silent Linear",
    "reviewUrl": "https://github.com/ThereminGoat/switch-scores/blob/master/Haimu%20Heartbeat.pdf"
  },
  {
    "name": "Haimu Orchid Mantis",
    "reviewedAt": "9/6/2026",
    "manufacturer": "Haimu",
    "type": "Silent Tactile",
    "reviewUrl": "https://github.com/ThereminGoat/switch-scores/blob/master/Haimu%20Orchid%20Mantis.pdf"
  },
  {
    "name": "Haimu Whisper",
    "reviewedAt": "9/11/2022",
    "manufacturer": "Haimu",
    "type": "Silent Tactile",
    "reviewUrl": "https://github.com/ThereminGoat/switch-scores/blob/master/Haimu%20Whisper.pdf"
  },
  {
    "name": "Haimu x Geon HG Silent Red",
    "reviewedAt": "6/4/2023",
    "manufacturer": "Haimu",
    "type": "Silent Linear",
    "reviewUrl": "https://github.com/ThereminGoat/switch-scores/blob/master/Haimu%20x%20Geon%20HG%20Silent%20Red.pdf"
  },
  {
    "name": "Harimau",
    "reviewedAt": "8/8/2021",
    "manufacturer": "Durock/JWK",
    "type": "Tactile",
    "reviewUrl": "https://github.com/ThereminGoat/switch-scores/blob/master/Harimau.pdf"
  },
  {
    "name": "Healio",
    "reviewedAt": "8/15/2021",
    "manufacturer": "Gateron",
    "type": "Silent Linear",
    "reviewUrl": "https://github.com/ThereminGoat/switch-scores/blob/master/Healio.pdf"
  },
  {
    "name": "Hexin Workshop Bamboo Green (60g)",
    "reviewedAt": "8/1/2021",
    "manufacturer": "Durock/JWK",
    "type": "Tactile",
    "reviewUrl": "https://github.com/ThereminGoat/switch-scores/blob/master/Hexin%20Bamboo%20Green%2060g.pdf",
    "scorecardName": "Hexin Bamboo Green 60g"
  },
  {
    "name": "HMX Anti",
    "reviewedAt": "11/22/2025",
    "manufacturer": "HMX",
    "type": "Linear",
    "reviewUrl": "https://github.com/ThereminGoat/switch-scores/blob/master/HMX%20Anti.pdf"
  },
  {
    "name": "HMX Black Cat",
    "reviewedAt": "2/22/2026",
    "manufacturer": "HMX",
    "type": "Tactile",
    "reviewUrl": "https://github.com/ThereminGoat/switch-scores/blob/master/HMX%20Black%20Cat.pdf"
  },
  {
    "name": "HMX Crisp",
    "reviewedAt": "4/12/2026",
    "manufacturer": "HMX",
    "type": "Linear",
    "reviewUrl": "https://github.com/ThereminGoat/switch-scores/blob/master/HMX%20Crisp.pdf"
  },
  {
    "name": "HMX Cthulhu (50-56g)",
    "reviewedAt": "9/27/2026",
    "manufacturer": "HMX",
    "type": "Linear",
    "reviewUrl": "https://github.com/ThereminGoat/switch-scores/blob/master/HMX%20Cthulhu%20(50-56g).pdf"
  },
  {
    "name": "HMX Egg Yolk",
    "reviewedAt": "7/12/2026",
    "manufacturer": "HMX",
    "type": "Linear",
    "reviewUrl": "https://github.com/ThereminGoat/switch-scores/blob/master/HMX%20Egg%20Yolk.pdf"
  },
  {
    "name": "HMX Firecracker",
    "reviewedAt": "11/2/2025",
    "manufacturer": "HMX",
    "type": "Tactile",
    "reviewUrl": "https://github.com/ThereminGoat/switch-scores/blob/master/HMX%20Firecracker.pdf"
  },
  {
    "name": "HMX Frog",
    "reviewedAt": "1/18/2026",
    "manufacturer": "HMX",
    "type": "Tactile",
    "reviewUrl": "https://github.com/ThereminGoat/switch-scores/blob/master/HMX%20Frog.pdf"
  },
  {
    "name": "HMX Hydra",
    "reviewedAt": "4/12/2026",
    "manufacturer": "HMX",
    "type": "Tactile",
    "reviewUrl": "https://github.com/ThereminGoat/switch-scores/blob/master/HMX%20Hydra.pdf"
  },
  {
    "name": "HMX Longjing S",
    "reviewedAt": "1/11/2026",
    "manufacturer": "HMX",
    "type": "Tactile",
    "reviewUrl": "https://github.com/ThereminGoat/switch-scores/blob/master/HMX%20Longjing%20S.pdf"
  },
  {
    "name": "HMX Snowfall",
    "reviewedAt": "1/11/2026",
    "manufacturer": "HMX",
    "type": "Tactile",
    "reviewUrl": "https://github.com/ThereminGoat/switch-scores/blob/master/HMX%20Snowfall.pdf"
  },
  {
    "name": "HMX Valerian",
    "reviewedAt": "4/5/2026",
    "manufacturer": "HMX",
    "type": "Tactile",
    "reviewUrl": "https://github.com/ThereminGoat/switch-scores/blob/master/HMX%20Valerian.pdf"
  },
  {
    "name": "HMX Volume 0-T",
    "reviewedAt": "12/20/2025",
    "manufacturer": "HMX",
    "type": "Silent Tactile",
    "reviewUrl": "https://github.com/ThereminGoat/switch-scores/blob/master/HMX%20Volume%200-T.pdf"
  },
  {
    "name": "HMX WJBY Su Color",
    "reviewedAt": "11/17/2024",
    "manufacturer": "HMX",
    "type": "Linear",
    "reviewUrl": "https://github.com/ThereminGoat/switch-scores/blob/master/HMX%20WJBY%20Su%20Color.pdf"
  },
  {
    "name": "HMX Yogurt S (37g)",
    "reviewedAt": "6/28/2026",
    "manufacturer": "HMX",
    "type": "Linear",
    "reviewUrl": "https://github.com/ThereminGoat/switch-scores/blob/master/HMX%20Yogurt%20S%20(37g).pdf"
  },
  {
    "name": "Hojicha Reserve",
    "reviewedAt": "9/15/2024",
    "manufacturer": "BSUN",
    "type": "Tactile",
    "reviewUrl": "https://github.com/ThereminGoat/switch-scores/blob/master/Hojicha%20Reserve.pdf"
  },
  {
    "name": "Holy Panda X",
    "reviewedAt": "3/1/2022",
    "manufacturer": "Gateron",
    "type": "Tactile",
    "reviewUrl": "https://github.com/ThereminGoat/switch-scores/blob/master/Holy%20Panda%20X.pdf"
  },
  {
    "name": "Honeycomb",
    "reviewedAt": "1/8/2023",
    "manufacturer": "Meirun",
    "type": "Linear",
    "reviewUrl": "https://github.com/ThereminGoat/switch-scores/blob/master/Honeycomb.pdf"
  },
  {
    "name": "Hoshizora",
    "reviewedAt": "5/22/2022",
    "manufacturer": "Durock/JWK",
    "type": "Linear",
    "reviewUrl": "https://github.com/ThereminGoat/switch-scores/blob/master/Hoshizora.pdf"
  },
  {
    "name": "HTMZ Pink",
    "reviewedAt": "6/8/2025",
    "manufacturer": "Yusya",
    "type": "Linear",
    "reviewUrl": "https://github.com/ThereminGoat/switch-scores/blob/master/HTMZ%20Pink.pdf"
  },
  {
    "name": "Huano Caramel Latte",
    "reviewedAt": "6/23/2024",
    "manufacturer": "Huano",
    "type": "Linear",
    "reviewUrl": "https://github.com/ThereminGoat/switch-scores/blob/master/Huano%20Caramel%20Latte.pdf"
  },
  {
    "name": "Huano Clicky White",
    "reviewedAt": "10/8/2023",
    "manufacturer": "Huano",
    "type": "Clicky",
    "reviewUrl": "https://github.com/ThereminGoat/switch-scores/blob/master/Huano%20Clicky%20White.pdf"
  },
  {
    "name": "Huano Earth Yellow",
    "reviewedAt": "2/5/2023",
    "manufacturer": "Huano",
    "type": "Linear",
    "reviewUrl": "https://github.com/ThereminGoat/switch-scores/blob/master/Huano%20Earth%20Yellow.pdf"
  },
  {
    "name": "Huano Fi",
    "reviewedAt": "7/2/2023",
    "manufacturer": "Huano",
    "type": "Linear",
    "reviewUrl": "https://github.com/ThereminGoat/switch-scores/blob/master/Huano%20Fi.pdf"
  },
  {
    "name": "Huano Grape Orange",
    "reviewedAt": "11/17/2024",
    "manufacturer": "Huano",
    "type": "Linear",
    "reviewUrl": "https://github.com/ThereminGoat/switch-scores/blob/master/Huano%20Grape%20Orange.pdf"
  },
  {
    "name": "Huano Kyubi Silent Linear",
    "reviewedAt": "10/13/2024",
    "manufacturer": "Huano",
    "type": "Silent Linear",
    "reviewUrl": "https://github.com/ThereminGoat/switch-scores/blob/master/Huano%20Kyubi%20Silent%20Linear.pdf"
  },
  {
    "name": "Huano Pineapple",
    "reviewedAt": "5/28/2023",
    "manufacturer": "Huano",
    "type": "Linear",
    "reviewUrl": "https://github.com/ThereminGoat/switch-scores/blob/master/Huano%20Pineapple.pdf"
  },
  {
    "name": "Huano Silver",
    "reviewedAt": "10/24/2021",
    "manufacturer": "Huano",
    "type": "Linear",
    "reviewUrl": "https://github.com/ThereminGoat/switch-scores/blob/master/Huano%20Silver.pdf"
  },
  {
    "name": "Husky",
    "reviewedAt": "5/30/2021",
    "manufacturer": "Tecsee",
    "type": "Linear",
    "reviewUrl": "https://github.com/ThereminGoat/switch-scores/blob/master/Husky.pdf"
  },
  {
    "name": "Hyte Fluffy Lavender",
    "reviewedAt": "8/3/2025",
    "manufacturer": "Unknown",
    "type": "Linear",
    "reviewUrl": "https://github.com/ThereminGoat/switch-scores/blob/master/Hyte%20Fluffy%20Lavender.pdf"
  },
  {
    "name": "Ice Kachang (Unlubed)",
    "reviewedAt": "11/5/2023",
    "manufacturer": "Aflion",
    "type": "Tactile",
    "reviewUrl": "https://github.com/ThereminGoat/switch-scores/blob/master/Ice%20Kachang%20(Unlubed).pdf"
  },
  {
    "name": "IDOBAO Elf Linear-C1",
    "reviewedAt": "6/25/2023",
    "manufacturer": "Kailh",
    "type": "Silent Linear",
    "reviewUrl": "https://github.com/ThereminGoat/switch-scores/blob/master/IDOBAO%20Elf%20Linear-C1.pdf"
  },
  {
    "name": "IDOBAO Elf Tactile-T1",
    "reviewedAt": "6/25/2023",
    "manufacturer": "Kailh",
    "type": "Silent Tactile",
    "reviewUrl": "https://github.com/ThereminGoat/switch-scores/blob/master/IDOBAO%20Elf%20Tactile-T1.pdf"
  },
  {
    "name": "Invokeys Black Sesame",
    "reviewedAt": "10/2/2022",
    "manufacturer": "Aflion",
    "type": "Linear",
    "reviewUrl": "https://github.com/ThereminGoat/switch-scores/blob/master/Invokeys%20Black%20Sesame.pdf"
  },
  {
    "name": "Invokeys Blueberry Chiffon",
    "reviewedAt": "8/21/2022",
    "manufacturer": "Aflion",
    "type": "Tactile",
    "reviewUrl": "https://github.com/ThereminGoat/switch-scores/blob/master/Invokeys%20Blueberry%20Chiffon.pdf"
  },
  {
    "name": "Invokeys Goji Reserve",
    "reviewedAt": "10/26/2025",
    "manufacturer": "BSUN",
    "type": "Tactile",
    "reviewUrl": "https://github.com/ThereminGoat/switch-scores/blob/master/Invokeys%20Goji%20Reserve.pdf"
  },
  {
    "name": "Invokeys Matcha Latte",
    "reviewedAt": "1/9/2022",
    "manufacturer": "Aflion",
    "type": "Linear",
    "reviewUrl": "https://github.com/ThereminGoat/switch-scores/blob/master/Invokeys%20Matcha%20Latte.pdf"
  },
  {
    "name": "Invokeys Purple Rice",
    "reviewedAt": "12/17/2023",
    "manufacturer": "BSUN",
    "type": "Linear",
    "reviewUrl": "https://github.com/ThereminGoat/switch-scores/blob/master/Invokeys%20Purple%20Rice.pdf"
  },
  {
    "name": "Invokeys x Alas Daydreamer",
    "reviewedAt": "11/26/2023",
    "manufacturer": "LICHICX",
    "type": "Silent Tactile",
    "reviewUrl": "https://github.com/ThereminGoat/switch-scores/blob/master/Invokeys%20x%20Alas%20Daydreamer.pdf"
  },
  {
    "name": "Jerrzi Blue",
    "reviewedAt": "12/15/2024",
    "manufacturer": "Jerrzi",
    "type": "Clicky",
    "reviewUrl": "https://github.com/ThereminGoat/switch-scores/blob/master/Jerrzi%20Blue.pdf"
  },
  {
    "name": "Jerrzi Blueberry Mousse",
    "reviewedAt": "2/2/2025",
    "manufacturer": "Jerrzi",
    "type": "Linear",
    "reviewUrl": "https://github.com/ThereminGoat/switch-scores/blob/master/Jerrzi%20Blueberry%20Mousse.pdf"
  },
  {
    "name": "Jerrzi Cute Yellow",
    "reviewedAt": "2/2/2025",
    "manufacturer": "Jerrzi",
    "type": "Silent Linear",
    "reviewUrl": "https://github.com/ThereminGoat/switch-scores/blob/master/Jerrzi%20Cute%20Yellow.pdf"
  },
  {
    "name": "Jerrzi Poseidon",
    "reviewedAt": "5/5/2024",
    "manufacturer": "Jerrzi",
    "type": "Linear",
    "reviewUrl": "https://github.com/ThereminGoat/switch-scores/blob/master/Jerrzi%20Poseidon.pdf"
  },
  {
    "name": "JKDK Crimson",
    "reviewedAt": "11/5/2023",
    "manufacturer": "LICHICX",
    "type": "Silent Tactile",
    "reviewUrl": "https://github.com/ThereminGoat/switch-scores/blob/master/JKDK%20Crimson.pdf"
  },
  {
    "name": "JKDK x XCJZ Hillstone",
    "reviewedAt": "9/24/2023",
    "manufacturer": "BSUN",
    "type": "Tactile",
    "reviewUrl": "https://github.com/ThereminGoat/switch-scores/blob/master/JKDK%20x%20XCJZ%20Hillstone.pdf"
  },
  {
    "name": "JWICK Ginger Milk",
    "reviewedAt": "8/14/2022",
    "manufacturer": "Durock/JWK",
    "type": "Linear",
    "reviewUrl": "https://github.com/ThereminGoat/switch-scores/blob/master/JWICK%20Ginger%20Milk.pdf"
  },
  {
    "name": "JWICK Semi Silent",
    "reviewedAt": "11/13/2022",
    "manufacturer": "Durock/JWK",
    "type": "Silent Linear",
    "reviewUrl": "https://github.com/ThereminGoat/switch-scores/blob/master/JWICK%20Semi%20Silent.pdf"
  },
  {
    "name": "JWICK Taro",
    "reviewedAt": "8/14/2022",
    "manufacturer": "Durock/JWK",
    "type": "Tactile",
    "reviewUrl": "https://github.com/ThereminGoat/switch-scores/blob/master/JWICK%20Taro.pdf"
  },
  {
    "name": "Kailh Autumn",
    "reviewedAt": "4/9/2023",
    "manufacturer": "Kailh",
    "type": "Clicky",
    "reviewUrl": "https://github.com/ThereminGoat/switch-scores/blob/master/Kailh%20Autumn.pdf"
  },
  {
    "name": "Kailh Box Dark Chocolate",
    "reviewedAt": "7/20/2025",
    "manufacturer": "Kailh",
    "type": "Linear",
    "reviewUrl": "https://github.com/ThereminGoat/switch-scores/blob/master/Kailh%20Box%20Dark%20Chocolate.pdf"
  },
  {
    "name": "Kailh Box Jade",
    "reviewedAt": "8/1/2021",
    "manufacturer": "Kailh",
    "type": "Clicky",
    "reviewUrl": "https://github.com/ThereminGoat/switch-scores/blob/master/Kailh%20Box%20Jade.pdf"
  },
  {
    "name": "Kailh Box Luna",
    "reviewedAt": "7/6/2025",
    "manufacturer": "Kailh",
    "type": "Linear",
    "reviewUrl": "https://github.com/ThereminGoat/switch-scores/blob/master/Kailh%20Box%20Luna.pdf"
  },
  {
    "name": "Kailh Box Mute Jade",
    "reviewedAt": "2/6/2022",
    "manufacturer": "Kailh",
    "type": "Clicky",
    "reviewUrl": "https://github.com/ThereminGoat/switch-scores/blob/master/Kailh%20Box%20Mute%20Jade.pdf"
  },
  {
    "name": "Kailh Box Navy",
    "reviewedAt": "8/1/2021",
    "manufacturer": "Kailh",
    "type": "Clicky",
    "reviewUrl": "https://github.com/ThereminGoat/switch-scores/blob/master/Kailh%20Box%20Navy.pdf"
  },
  {
    "name": "Kailh Box Quicksand Gold",
    "reviewedAt": "9/26/2021",
    "manufacturer": "Kailh",
    "type": "Tactile",
    "reviewUrl": "https://github.com/ThereminGoat/switch-scores/blob/master/Kailh%20Box%20Quicksand%20Gold.pdf"
  },
  {
    "name": "Kailh Box Rose Red",
    "reviewedAt": "9/26/2021",
    "manufacturer": "Kailh",
    "type": "Linear",
    "reviewUrl": "https://github.com/ThereminGoat/switch-scores/blob/master/Kailh%20Box%20Rose%20Red.pdf"
  },
  {
    "name": "Kailh Box Silent Brown",
    "reviewedAt": "8/15/2021",
    "manufacturer": "Kailh",
    "type": "Silent Tactile",
    "reviewUrl": "https://github.com/ThereminGoat/switch-scores/blob/master/Kailh%20Box%20Silent%20Brown.pdf"
  },
  {
    "name": "Kailh Box Silent Pink",
    "reviewedAt": "8/15/2021",
    "manufacturer": "Kailh",
    "type": "Silent Linear",
    "reviewUrl": "https://github.com/ThereminGoat/switch-scores/blob/master/Kailh%20Box%20Silent%20Pink.pdf"
  },
  {
    "name": "Kailh Box Sky Blue",
    "reviewedAt": "9/26/2021",
    "manufacturer": "Kailh",
    "type": "Clicky",
    "reviewUrl": "https://github.com/ThereminGoat/switch-scores/blob/master/Kailh%20Box%20Sky%20Blue.pdf"
  },
  {
    "name": "Kailh Box Speed Ultimate",
    "reviewedAt": "2/13/2022",
    "manufacturer": "Kailh",
    "type": "Linear",
    "reviewUrl": "https://github.com/ThereminGoat/switch-scores/blob/master/Kailh%20Box%20Speed%20Ultimate.pdf"
  },
  {
    "name": "Kailh Box Spring",
    "reviewedAt": "3/17/2024",
    "manufacturer": "Kailh",
    "type": "Linear",
    "reviewUrl": "https://github.com/ThereminGoat/switch-scores/blob/master/Kailh%20Box%20Spring.pdf"
  },
  {
    "name": "Kailh Calligraphy",
    "reviewedAt": "1/25/2026",
    "manufacturer": "Kailh",
    "type": "Linear",
    "reviewUrl": "https://github.com/ThereminGoat/switch-scores/blob/master/Kailh%20Calligraphy.pdf"
  },
  {
    "name": "Kailh Canary",
    "reviewedAt": "8/15/2021",
    "manufacturer": "Kailh",
    "type": "Tactile",
    "reviewUrl": "https://github.com/ThereminGoat/switch-scores/blob/master/Kailh%20Canary.pdf"
  },
  {
    "name": "Kailh Choc Autumn",
    "reviewedAt": "1/5/2025",
    "manufacturer": "Kailh",
    "type": "Clicky",
    "reviewUrl": "https://github.com/ThereminGoat/switch-scores/blob/master/Kailh%20Choc%20Autumn.pdf"
  },
  {
    "name": "Kailh Choc Summer",
    "reviewedAt": "1/5/2025",
    "manufacturer": "Kailh",
    "type": "Clicky",
    "reviewUrl": "https://github.com/ThereminGoat/switch-scores/blob/master/Kailh%20Choc%20Summer.pdf"
  },
  {
    "name": "Kailh Christmas Tree",
    "reviewedAt": "3/13/2022",
    "manufacturer": "Kailh",
    "type": "Linear",
    "reviewUrl": "https://github.com/ThereminGoat/switch-scores/blob/master/Kailh%20Christmas%20Tree.pdf"
  },
  {
    "name": "Kailh Deep Sea Silent Pro Whale",
    "reviewedAt": "9/3/2023",
    "manufacturer": "Kailh",
    "type": "Silent Tactile",
    "reviewUrl": "https://github.com/ThereminGoat/switch-scores/blob/master/Kailh%20Deep%20Sea%20Silent%20Pro%20Tactile%20Whale.pdf",
    "scorecardName": "Kailh Deep Sea Silent Pro Tactile Whale"
  },
  {
    "name": "Kailh Extreme Slippery",
    "reviewedAt": "3/23/2025",
    "manufacturer": "Kailh",
    "type": "Linear",
    "reviewUrl": "https://github.com/ThereminGoat/switch-scores/blob/master/Kailh%20Extreme%20Slippery.pdf"
  },
  {
    "name": "Kailh Midnight Pro Grey",
    "reviewedAt": "7/31/2022",
    "manufacturer": "Kailh",
    "type": "Silent Linear",
    "reviewUrl": "https://github.com/ThereminGoat/switch-scores/blob/master/Kailh%20Midnight%20Pro%20Grey.pdf"
  },
  {
    "name": "Kailh Midnight Pro Light Yellow",
    "reviewedAt": "7/31/2022",
    "manufacturer": "Kailh",
    "type": "Silent Tactile",
    "reviewUrl": "https://github.com/ThereminGoat/switch-scores/blob/master/Kailh%20Midnight%20Pro%20Light%20Yellow.pdf"
  },
  {
    "name": "Kailh Prestige Delighted",
    "reviewedAt": "8/11/2024",
    "manufacturer": "Kailh",
    "type": "Linear",
    "reviewUrl": "https://github.com/ThereminGoat/switch-scores/blob/master/Kailh%20Prestige%20Delighted.pdf"
  },
  {
    "name": "Kailh Pro Burgundy (Plate Mount)",
    "reviewedAt": "1/16/2022",
    "manufacturer": "Kailh",
    "type": "Linear",
    "reviewUrl": "https://github.com/ThereminGoat/switch-scores/blob/master/Kailh%20Pro%20Burgundy.pdf",
    "scorecardName": "Kailh Pro Burgundy"
  },
  {
    "name": "Kailh Pro Light Green (Plate Mount)",
    "reviewedAt": "1/16/2022",
    "manufacturer": "Kailh",
    "type": "Clicky",
    "reviewUrl": "https://github.com/ThereminGoat/switch-scores/blob/master/Kailh%20Pro%20Light%20Green.pdf",
    "scorecardName": "Kailh Pro Light Green"
  },
  {
    "name": "Kailh Pro Purple (Plate Mount)",
    "reviewedAt": "1/16/2022",
    "manufacturer": "Kailh",
    "type": "Tactile",
    "reviewUrl": "https://github.com/ThereminGoat/switch-scores/blob/master/Kailh%20Pro%20Purple.pdf",
    "scorecardName": "Kailh Pro Purple"
  },
  {
    "name": "Kailh x Melgeek Hornet HE",
    "reviewedAt": "12/22/2024",
    "manufacturer": "Kailh",
    "type": "Linear",
    "reviewUrl": "https://github.com/ThereminGoat/switch-scores/blob/master/Kailh%20x%20Melgeek%20Hornet%20HE.pdf"
  },
  {
    "name": "Kailh Xuan",
    "reviewedAt": "8/30/2026",
    "manufacturer": "Kailh",
    "type": "Tactile",
    "reviewUrl": "https://github.com/ThereminGoat/switch-scores/blob/master/Kailh%20Xuan.pdf"
  },
  {
    "name": "Keebz n Cables x HMX Ice Cendol",
    "reviewedAt": "3/2/2025",
    "manufacturer": "HMX",
    "type": "Linear",
    "reviewUrl": "https://github.com/ThereminGoat/switch-scores/blob/master/Keebz%20n%20Cables%20x%20HMX%20Ice%20Cendol.pdf"
  },
  {
    "name": "Keychron Phantom Brown",
    "reviewedAt": "3/20/2022",
    "manufacturer": "Gateron",
    "type": "Tactile",
    "reviewUrl": "https://github.com/ThereminGoat/switch-scores/blob/master/Keychron%20Phantom%20Brown.pdf"
  },
  {
    "name": "Keychron Silent Banana",
    "reviewedAt": "7/6/2025",
    "manufacturer": "Outemu",
    "type": "Silent Tactile",
    "reviewUrl": "https://github.com/ThereminGoat/switch-scores/blob/master/Keychron%20Silent%20Banana.pdf"
  },
  {
    "name": "Keychron Super Banana",
    "reviewedAt": "12/22/2024",
    "manufacturer": "Unknown",
    "type": "Tactile",
    "reviewUrl": "https://github.com/ThereminGoat/switch-scores/blob/master/Keychron%20Super%20Banana.pdf"
  },
  {
    "name": "Keychron x Gateron Aurora",
    "reviewedAt": "9/8/2024",
    "manufacturer": "Gateron",
    "type": "Linear",
    "reviewUrl": "https://github.com/ThereminGoat/switch-scores/blob/master/Keychron%20x%20Gateron%20Aurora.pdf"
  },
  {
    "name": "Keyfirst Bling Blue",
    "reviewedAt": "11/5/2023",
    "manufacturer": "Haimu",
    "type": "Linear",
    "reviewUrl": "https://github.com/ThereminGoat/switch-scores/blob/master/Keyfirst%20Bling%20Blue.pdf"
  },
  {
    "name": "Keygeek Athena",
    "reviewedAt": "7/13/2025",
    "manufacturer": "Keygeek",
    "type": "Linear",
    "reviewUrl": "https://github.com/ThereminGoat/switch-scores/blob/master/Keygeek%20Athena.pdf"
  },
  {
    "name": "Keygeek Cera X (48g)",
    "reviewedAt": "4/12/2026",
    "manufacturer": "Keygeek",
    "type": "Linear",
    "reviewUrl": "https://github.com/ThereminGoat/switch-scores/blob/master/Keygeek%20Cera%20X%20(48g).pdf"
  },
  {
    "name": "Keygeek Full Nylon",
    "reviewedAt": "4/26/2026",
    "manufacturer": "Keygeek",
    "type": "Linear",
    "reviewUrl": "https://github.com/ThereminGoat/switch-scores/blob/master/Keygeek%20Full%20Nylon.pdf"
  },
  {
    "name": "Keygeek Muse",
    "reviewedAt": "2/15/2026",
    "manufacturer": "Keygeek",
    "type": "Linear",
    "reviewUrl": "https://github.com/ThereminGoat/switch-scores/blob/master/Keygeek%20Muse.pdf"
  },
  {
    "name": "Keygeek Oat",
    "reviewedAt": "11/10/2024",
    "manufacturer": "Keygeek",
    "type": "Linear",
    "reviewUrl": "https://github.com/ThereminGoat/switch-scores/blob/master/Keygeek%20Oat.pdf"
  },
  {
    "name": "Keygeek Raspberry",
    "reviewedAt": "10/13/2024",
    "manufacturer": "Keygeek",
    "type": "Linear",
    "reviewUrl": "https://github.com/ThereminGoat/switch-scores/blob/master/Keygeek%20Raspberry.pdf"
  },
  {
    "name": "Keygeek Sunflower",
    "reviewedAt": "9/7/2025",
    "manufacturer": "Keygeek",
    "type": "Linear",
    "reviewUrl": "https://github.com/ThereminGoat/switch-scores/blob/master/Keygeek%20Sunflower.pdf"
  },
  {
    "name": "Keygeek VC",
    "reviewedAt": "8/17/2025",
    "manufacturer": "Keygeek",
    "type": "Linear",
    "reviewUrl": "https://github.com/ThereminGoat/switch-scores/blob/master/Keygeek%20VC.pdf"
  },
  {
    "name": "Keygeek Y2 (20mm/45g)",
    "reviewedAt": "8/24/2025",
    "manufacturer": "Keygeek",
    "type": "Linear",
    "reviewUrl": "https://github.com/ThereminGoat/switch-scores/blob/master/Keygeek%20Y2%20(20mm_45g).pdf",
    "scorecardName": "Keygeek Y2 (20mm_45g)"
  },
  {
    "name": "KFA Lubed Pink Robin",
    "reviewedAt": "9/11/2022",
    "manufacturer": "Aflion",
    "type": "Linear",
    "reviewUrl": "https://github.com/ThereminGoat/switch-scores/blob/master/KFA%20Lubed%20Pink%20Robin.pdf"
  },
  {
    "name": "Kinetic Labs Gecko",
    "reviewedAt": "9/18/2022",
    "manufacturer": "Gateron",
    "type": "Silent Linear",
    "reviewUrl": "https://github.com/ThereminGoat/switch-scores/blob/master/Kinetic%20Labs%20Gecko.pdf"
  },
  {
    "name": "Kinetic Labs Turtle",
    "reviewedAt": "2/23/2025",
    "manufacturer": "Haimu",
    "type": "Silent Tactile",
    "reviewUrl": "https://github.com/ThereminGoat/switch-scores/blob/master/Kinetic%20Labs%20Turtle.pdf"
  },
  {
    "name": "Kingfishers",
    "reviewedAt": "5/22/2022",
    "manufacturer": "Tecsee",
    "type": "Linear",
    "reviewUrl": "https://github.com/ThereminGoat/switch-scores/blob/master/Kingfishers.pdf"
  },
  {
    "name": "KK Lightwave",
    "reviewedAt": "8/15/2021",
    "manufacturer": "Tecsee",
    "type": "Linear",
    "reviewUrl": "https://github.com/ThereminGoat/switch-scores/blob/master/KK%20Lightwave%20V1.pdf",
    "scorecardName": "KK Lightwave V1"
  },
  {
    "name": "KNC Keys Chocolate Crinkle Cookies",
    "reviewedAt": "6/22/2025",
    "manufacturer": "Tecsee",
    "type": "Tactile",
    "reviewUrl": "https://github.com/ThereminGoat/switch-scores/blob/master/KNC%20Keys%20Chocolate%20Crinkle%20Cookies.pdf"
  },
  {
    "name": "Konpeitou",
    "reviewedAt": "7/25/2021",
    "manufacturer": "Durock/JWK",
    "type": "Linear",
    "reviewUrl": "https://github.com/ThereminGoat/switch-scores/blob/master/Konpeitou.pdf"
  },
  {
    "name": "KTT Blueberry Ice Cream",
    "reviewedAt": "3/22/2026",
    "manufacturer": "KTT",
    "type": "Tactile",
    "reviewUrl": "https://github.com/ThereminGoat/switch-scores/blob/master/KTT%20Blueberry%20Ice%20Cream.pdf"
  },
  {
    "name": "KTT Cabbage Tofu",
    "reviewedAt": "6/5/2022",
    "manufacturer": "KTT",
    "type": "Linear",
    "reviewUrl": "https://github.com/ThereminGoat/switch-scores/blob/master/KTT%20Cabbage%20Tofu.pdf"
  },
  {
    "name": "KTT Cloud Blue",
    "reviewedAt": "9/12/2021",
    "manufacturer": "KTT",
    "type": "Linear",
    "reviewUrl": "https://github.com/ThereminGoat/switch-scores/blob/master/KTT%20Cloud%20Blue.pdf"
  },
  {
    "name": "KTT Gold",
    "reviewedAt": "5/22/2022",
    "manufacturer": "KTT",
    "type": "Clicky",
    "reviewUrl": "https://github.com/ThereminGoat/switch-scores/blob/master/KTT%20Gold.pdf"
  },
  {
    "name": "KTT Kang White",
    "reviewedAt": "6/20/2021",
    "manufacturer": "KTT",
    "type": "Linear",
    "reviewUrl": "https://github.com/ThereminGoat/switch-scores/blob/master/KTT%20Kang%20White.pdf"
  },
  {
    "name": "KTT Lightning V2",
    "reviewedAt": "9/6/2026",
    "manufacturer": "KTT",
    "type": "Linear",
    "reviewUrl": "https://github.com/ThereminGoat/switch-scores/blob/master/KTT%20Lightning%20V2.pdf"
  },
  {
    "name": "KTT Mallo",
    "reviewedAt": "8/29/2021",
    "manufacturer": "KTT",
    "type": "Tactile",
    "reviewUrl": "https://github.com/ThereminGoat/switch-scores/blob/master/KTT%20Mallo.pdf"
  },
  {
    "name": "KTT Matcha",
    "reviewedAt": "3/21/2021",
    "manufacturer": "KTT",
    "type": "Tactile",
    "reviewUrl": "https://github.com/ThereminGoat/switch-scores/blob/master/KTT%20Matcha.pdf"
  },
  {
    "name": "KTT Peach",
    "reviewedAt": "6/20/2021",
    "manufacturer": "KTT",
    "type": "Linear",
    "reviewUrl": "https://github.com/ThereminGoat/switch-scores/blob/master/KTT%20Peach.pdf"
  },
  {
    "name": "KTT Purple Sauce",
    "reviewedAt": "6/11/2023",
    "manufacturer": "KTT",
    "type": "Clicky",
    "reviewUrl": "https://github.com/ThereminGoat/switch-scores/blob/master/KTT%20Purple%20Sauce.pdf"
  },
  {
    "name": "KTT Sea Salt",
    "reviewedAt": "9/12/2021",
    "manufacturer": "KTT",
    "type": "Linear",
    "reviewUrl": "https://github.com/ThereminGoat/switch-scores/blob/master/KTT%20Sea%20Salt.pdf"
  },
  {
    "name": "KTT Strawberry",
    "reviewedAt": "1/30/2021",
    "manufacturer": "KTT",
    "type": "Linear",
    "reviewUrl": "https://github.com/ThereminGoat/switch-scores/blob/master/KTT%20Strawberry.pdf"
  },
  {
    "name": "KTT Teresa",
    "reviewedAt": "3/30/2025",
    "manufacturer": "KTT",
    "type": "Linear",
    "reviewUrl": "https://github.com/ThereminGoat/switch-scores/blob/master/KTT%20Teresa.pdf"
  },
  {
    "name": "KTT Wind Phantom",
    "reviewedAt": "12/1/2024",
    "manufacturer": "KTT",
    "type": "Tactile",
    "reviewUrl": "https://github.com/ThereminGoat/switch-scores/blob/master/KTT%20Wind%20Phantom.pdf"
  },
  {
    "name": "KTT Wine Red Pro",
    "reviewedAt": "11/2/2025",
    "manufacturer": "KTT",
    "type": "Linear",
    "reviewUrl": "https://github.com/ThereminGoat/switch-scores/blob/master/KTT%20Wine%20Red%20Pro.pdf"
  },
  {
    "name": "KTT ZenCha",
    "reviewedAt": "3/22/2026",
    "manufacturer": "KTT",
    "type": "Silent Tactile",
    "reviewUrl": "https://github.com/ThereminGoat/switch-scores/blob/master/KTT%20ZenCha.pdf"
  },
  {
    "name": "Lavenders",
    "reviewedAt": "1/2/2020",
    "manufacturer": "Durock/JWK",
    "type": "Linear",
    "reviewUrl": "https://github.com/ThereminGoat/switch-scores/blob/master/Lavenders.pdf"
  },
  {
    "name": "LCET Blue and Purple",
    "reviewedAt": "4/9/2023",
    "manufacturer": "Unknown",
    "type": "Clicky",
    "reviewUrl": "https://github.com/ThereminGoat/switch-scores/blob/master/LCET%20Blue%20and%20Purple.pdf"
  },
  {
    "name": "LCET Christmas Star",
    "reviewedAt": "2/2/2025",
    "manufacturer": "Unknown",
    "type": "Linear",
    "reviewUrl": "https://github.com/ThereminGoat/switch-scores/blob/master/LCET%20Christmas%20Star.pdf"
  },
  {
    "name": "LCET Red (Black Bottom)",
    "reviewedAt": "5/21/2023",
    "manufacturer": "Unknown",
    "type": "Linear",
    "reviewUrl": "https://github.com/ThereminGoat/switch-scores/blob/master/LCET%20Red%20(Black%20Bottom).pdf"
  },
  {
    "name": "Lekker V2 45g Linear",
    "reviewedAt": "7/20/2025",
    "manufacturer": "Grain Gold",
    "type": "Linear",
    "reviewUrl": "https://github.com/ThereminGoat/switch-scores/blob/master/Lekker%20V2%2045g%20Linear.pdf"
  },
  {
    "name": "Leobog Ice Blue",
    "reviewedAt": "11/19/2023",
    "manufacturer": "SOAI",
    "type": "Clicky",
    "reviewUrl": "https://github.com/ThereminGoat/switch-scores/blob/master/Leobog%20Ice%20Blue.pdf"
  },
  {
    "name": "Leobog Interstellar",
    "reviewedAt": "3/16/2025",
    "manufacturer": "SOAI",
    "type": "Tactile",
    "reviewUrl": "https://github.com/ThereminGoat/switch-scores/blob/master/Leobog%20Interstellar.pdf"
  },
  {
    "name": "Leobog Nimbus",
    "reviewedAt": "10/21/2023",
    "manufacturer": "SOAI",
    "type": "Linear",
    "reviewUrl": "https://github.com/ThereminGoat/switch-scores/blob/master/Leobog%20Nimbus.pdf"
  },
  {
    "name": "Leobog Pig Synapse",
    "reviewedAt": "10/21/2023",
    "manufacturer": "SOAI",
    "type": "Tactile",
    "reviewUrl": "https://github.com/ThereminGoat/switch-scores/blob/master/Leobog%20Pig%20Synapse.pdf"
  },
  {
    "name": "Leobog Standard Brown",
    "reviewedAt": "1/14/2024",
    "manufacturer": "SOAI",
    "type": "Tactile",
    "reviewUrl": "https://github.com/ThereminGoat/switch-scores/blob/master/Leobog%20Standard%20Brown.pdf"
  },
  {
    "name": "Leobog Wing Chun Magnetic",
    "reviewedAt": "3/16/2025",
    "manufacturer": "SOAI",
    "type": "Linear",
    "reviewUrl": "https://github.com/ThereminGoat/switch-scores/blob/master/Leobog%20Wing%20Chun%20Magnetic.pdf"
  },
  {
    "name": "LICHICX Lucy",
    "reviewedAt": "10/21/2023",
    "manufacturer": "LICHICX",
    "type": "Silent Linear",
    "reviewUrl": "https://github.com/ThereminGoat/switch-scores/blob/master/LICHICX%20Lucy.pdf"
  },
  {
    "name": "LICHICX Raw Small Tactile",
    "reviewedAt": "1/14/2024",
    "manufacturer": "LICHICX",
    "type": "Silent Tactile",
    "reviewUrl": "https://github.com/ThereminGoat/switch-scores/blob/master/LICHICX%20Raw%20Small%20Tactile.pdf"
  },
  {
    "name": "LICHICX Yogurt",
    "reviewedAt": "11/17/2024",
    "manufacturer": "LICHICX",
    "type": "Silent Linear",
    "reviewUrl": "https://github.com/ThereminGoat/switch-scores/blob/master/LICHICX%20Yogurt.pdf"
  },
  {
    "name": "Long Hua Cardamom",
    "reviewedAt": "1/19/2025",
    "manufacturer": "Kailh",
    "type": "Linear",
    "reviewUrl": "https://github.com/ThereminGoat/switch-scores/blob/master/Long%20Hua%20Cardamom.pdf"
  },
  {
    "name": "Long Hua Platycodon Grandiflorum",
    "reviewedAt": "1/5/2025",
    "manufacturer": "Kailh",
    "type": "Tactile",
    "reviewUrl": "https://github.com/ThereminGoat/switch-scores/blob/master/Long%20Hua%20Platycodon%20Grandiflorum.pdf"
  },
  {
    "name": "Lubed Black Geon Switch",
    "reviewedAt": "8/7/2022",
    "manufacturer": "Tecsee",
    "type": "Linear",
    "reviewUrl": "https://github.com/ThereminGoat/switch-scores/blob/master/Lubed%20Black%20Geon%20Switch.pdf"
  },
  {
    "name": "Lumia Matcha (62g)",
    "reviewedAt": "3/20/2022",
    "manufacturer": "Unknown",
    "type": "Linear",
    "reviewUrl": "https://github.com/ThereminGoat/switch-scores/blob/master/Lumia%20Matcha%20(62g).pdf"
  },
  {
    "name": "Melgeek Plastic",
    "reviewedAt": "11/19/2023",
    "manufacturer": "Kailh",
    "type": "Linear",
    "reviewUrl": "https://github.com/ThereminGoat/switch-scores/blob/master/Melgeek%20Plastic.pdf"
  },
  {
    "name": "Mengmoda Holy Panda",
    "reviewedAt": "10/21/2023",
    "manufacturer": "SOAI",
    "type": "Tactile",
    "reviewUrl": "https://github.com/ThereminGoat/switch-scores/blob/master/Mengmoda%20Holy%20Panda.pdf"
  },
  {
    "name": "Mengmoda Honey",
    "reviewedAt": "6/5/2022",
    "manufacturer": "Aflion",
    "type": "Tactile",
    "reviewUrl": "https://github.com/ThereminGoat/switch-scores/blob/master/Mengmoda%20Honey.pdf"
  },
  {
    "name": "Mengmoda Ice Cream",
    "reviewedAt": "10/21/2023",
    "manufacturer": "SOAI",
    "type": "Linear",
    "reviewUrl": "https://github.com/ThereminGoat/switch-scores/blob/master/Mengmoda%20Ice%20Cream.pdf"
  },
  {
    "name": "Meow Claw V2",
    "reviewedAt": "9/12/2021",
    "manufacturer": "Huano",
    "type": "Linear",
    "reviewUrl": "https://github.com/ThereminGoat/switch-scores/blob/master/Meow%20Claw%20V2.pdf"
  },
  {
    "name": "Mitarashi Dango",
    "reviewedAt": "12/29/2024",
    "manufacturer": "Unknown",
    "type": "Linear",
    "reviewUrl": "https://github.com/ThereminGoat/switch-scores/blob/master/Mitarashi%20Dango.pdf"
  },
  {
    "name": "Mode Reflex",
    "reviewedAt": "5/22/2022",
    "manufacturer": "Durock/JWK",
    "type": "Linear",
    "reviewUrl": "https://github.com/ThereminGoat/switch-scores/blob/master/Mode%20Reflex.pdf"
  },
  {
    "name": "Mode Signal",
    "reviewedAt": "5/22/2022",
    "manufacturer": "Durock/JWK",
    "type": "Tactile",
    "reviewUrl": "https://github.com/ThereminGoat/switch-scores/blob/master/Mode%20Signal.pdf"
  },
  {
    "name": "MODE Tomorrow",
    "reviewedAt": "1/15/2023",
    "manufacturer": "Outemu",
    "type": "Tactile",
    "reviewUrl": "https://github.com/ThereminGoat/switch-scores/blob/master/MODE%20Tomorrow.pdf"
  },
  {
    "name": "Momoka Frog V3",
    "reviewedAt": "6/12/2021",
    "manufacturer": "Momoka",
    "type": "Linear",
    "reviewUrl": "https://github.com/ThereminGoat/switch-scores/blob/master/Momoka%20Frog%20V3.pdf"
  },
  {
    "name": "Momoka Shark",
    "reviewedAt": "6/12/2022",
    "manufacturer": "Momoka",
    "type": "Tactile",
    "reviewUrl": "https://github.com/ThereminGoat/switch-scores/blob/master/Momoka%20Shark.pdf"
  },
  {
    "name": "Monka V3 Cherry Powder",
    "reviewedAt": "6/25/2023",
    "manufacturer": "Haimu",
    "type": "Linear",
    "reviewUrl": "https://github.com/ThereminGoat/switch-scores/blob/master/Monka%20V3%20Cherry%20Powder.pdf"
  },
  {
    "name": "Moyu Black",
    "reviewedAt": "8/1/2021",
    "manufacturer": "Durock/JWK",
    "type": "Tactile",
    "reviewUrl": "https://github.com/ThereminGoat/switch-scores/blob/master/Moyu%20Black.pdf"
  },
  {
    "name": "Moyu Studio x XCJZ Snow Grape",
    "reviewedAt": "9/17/2023",
    "manufacturer": "Unknown",
    "type": "Linear",
    "reviewUrl": "https://github.com/ThereminGoat/switch-scores/blob/master/Moyu%20Studio%20x%20XCJZ%20Snow%20Grape.pdf"
  },
  {
    "name": "Musetsu",
    "reviewedAt": "5/22/2022",
    "manufacturer": "Durock/JWK",
    "type": "Tactile",
    "reviewUrl": "https://github.com/ThereminGoat/switch-scores/blob/master/Musetsu.pdf"
  },
  {
    "name": "MZ Studio U3",
    "reviewedAt": "8/17/2025",
    "manufacturer": "Jerrzi",
    "type": "Silent Linear",
    "reviewUrl": "https://github.com/ThereminGoat/switch-scores/blob/master/MZ%20Studio%20U3.pdf"
  },
  {
    "name": "Naevy V1",
    "reviewedAt": "8/15/2021",
    "manufacturer": "Tecsee",
    "type": "Tactile",
    "reviewUrl": "https://github.com/ThereminGoat/switch-scores/blob/master/Naevy%20V1.pdf"
  },
  {
    "name": "Naevy V1.5",
    "reviewedAt": "4/18/2021",
    "manufacturer": "Tecsee",
    "type": "Tactile",
    "reviewUrl": "https://github.com/ThereminGoat/switch-scores/blob/master/Naevy%20V1.5.pdf"
  },
  {
    "name": "Neapolitan Ice Creams",
    "reviewedAt": "5/2/2021",
    "manufacturer": "Tecsee",
    "type": "Tactile",
    "reviewUrl": "https://github.com/ThereminGoat/switch-scores/blob/master/Neapolitan%20Ice%20Creams.pdf"
  },
  {
    "name": "Nixie Black",
    "reviewedAt": "11/7/2020",
    "manufacturer": "Cherry",
    "type": "Linear",
    "reviewUrl": "https://github.com/ThereminGoat/switch-scores/blob/master/Nixie%20Black.pdf"
  },
  {
    "name": "NK Silk Mictlan",
    "reviewedAt": "3/5/2023",
    "manufacturer": "Durock/JWK",
    "type": "Linear",
    "reviewUrl": "https://github.com/ThereminGoat/switch-scores/blob/master/NK%20Silk%20Mictlan.pdf"
  },
  {
    "name": "NK x Kailh Chocolate",
    "reviewedAt": "6/20/2021",
    "manufacturer": "Kailh",
    "type": "Linear",
    "reviewUrl": "https://github.com/ThereminGoat/switch-scores/blob/master/Novelkeys%20x%20Kailh%20Chocolate.pdf",
    "scorecardName": "Novelkeys x Kailh Chocolate"
  },
  {
    "name": "NK x Kailh Speed Heavy Burnt Orange",
    "reviewedAt": "3/26/2023",
    "manufacturer": "Kailh",
    "type": "Tactile",
    "reviewUrl": "https://github.com/ThereminGoat/switch-scores/blob/master/Novelkeys%20x%20Kailh%20Speed%20Heavy%20Burnt%20Orange.pdf",
    "scorecardName": "Novelkeys x Kailh Speed Heavy Burnt Orange"
  },
  {
    "name": "NK x Kailh Speed Heavy Dark Yellow",
    "reviewedAt": "3/26/2023",
    "manufacturer": "Kailh",
    "type": "Linear",
    "reviewUrl": "https://github.com/ThereminGoat/switch-scores/blob/master/Novelkeys%20x%20Kailh%20Speed%20Heavy%20Dark%20Yellow.pdf",
    "scorecardName": "Novelkeys x Kailh Speed Heavy Dark Yellow"
  },
  {
    "name": "NK x Kailh Speed Heavy Pale Blue",
    "reviewedAt": "3/26/2023",
    "manufacturer": "Kailh",
    "type": "Clicky",
    "reviewUrl": "https://github.com/ThereminGoat/switch-scores/blob/master/Novelkeys%20x%20Kailh%20Speed%20Heavy%20Pale%20Blue.pdf",
    "scorecardName": "Novelkeys x Kailh Speed Heavy Pale Blue"
  },
  {
    "name": "Noppoo Brown",
    "reviewedAt": "5/4/2025",
    "manufacturer": "KTT",
    "type": "Tactile",
    "reviewUrl": "https://github.com/ThereminGoat/switch-scores/blob/master/Noppoo%20Brown.pdf"
  },
  {
    "name": "Novelia",
    "reviewedAt": "1/17/2021",
    "manufacturer": "Kailh",
    "type": "Tactile",
    "reviewUrl": "https://github.com/ThereminGoat/switch-scores/blob/master/Novelias.pdf",
    "scorecardName": "Novelias"
  },
  {
    "name": "Novelkeys Box Cream",
    "reviewedAt": "5/9/2021",
    "manufacturer": "Kailh",
    "type": "Linear",
    "reviewUrl": "https://github.com/ThereminGoat/switch-scores/blob/master/Novelkeys%20Box%20Creams.pdf",
    "scorecardName": "Novelkeys Box Creams"
  },
  {
    "name": "Novelkeys Classic Blue",
    "reviewedAt": "8/10/2025",
    "manufacturer": "Unknown",
    "type": "Linear",
    "reviewUrl": "https://github.com/ThereminGoat/switch-scores/blob/master/Novelkeys%20Classic%20Blue.pdf"
  },
  {
    "name": "Novelkeys Cream Arc",
    "reviewedAt": "5/29/2022",
    "manufacturer": "Kailh",
    "type": "Linear",
    "reviewUrl": "https://github.com/ThereminGoat/switch-scores/blob/master/Novelkeys%20Cream%20Arc.pdf"
  },
  {
    "name": "Novelkeys Cream Clickie",
    "reviewedAt": "1/12/2023",
    "manufacturer": "Kailh",
    "type": "Clicky",
    "reviewUrl": "https://github.com/ThereminGoat/switch-scores/blob/master/Novelkeys%20Cream%20Clickie.pdf"
  },
  {
    "name": "Novelkeys Cream+ (Copper Insert)",
    "reviewedAt": "1/1/2023",
    "manufacturer": "Kailh",
    "type": "Linear",
    "reviewUrl": "https://github.com/ThereminGoat/switch-scores/blob/master/Novelkeys%20Cream%2B%20(Copper%20Insert).pdf"
  },
  {
    "name": "Novelkeys Cream+ (No Insert)",
    "reviewedAt": "1/1/2023",
    "manufacturer": "Kailh",
    "type": "Linear",
    "reviewUrl": "https://github.com/ThereminGoat/switch-scores/blob/master/Novelkeys%20Cream%2B%20(No%20Insert).pdf"
  },
  {
    "name": "Novelkeys Cream+ (Titanium Insert)",
    "reviewedAt": "1/1/2023",
    "manufacturer": "Kailh",
    "type": "Linear",
    "reviewUrl": "https://github.com/ThereminGoat/switch-scores/blob/master/Novelkeys%20Cream%2B%20(Titanium%20Insert).pdf"
  },
  {
    "name": "Novelkeys Dream Cream",
    "reviewedAt": "10/16/2022",
    "manufacturer": "Kailh",
    "type": "Linear",
    "reviewUrl": "https://github.com/ThereminGoat/switch-scores/blob/master/Novelkeys%20Dream%20Cream.pdf"
  },
  {
    "name": "Novelkeys Launch Creams",
    "reviewedAt": "10/10/2021",
    "manufacturer": "Kailh",
    "type": "Linear",
    "reviewUrl": "https://github.com/ThereminGoat/switch-scores/blob/master/Novelkeys%20Launch%20Creams.pdf"
  },
  {
    "name": "NuPhy Lemon",
    "reviewedAt": "4/6/2025",
    "manufacturer": "Gateron",
    "type": "Tactile",
    "reviewUrl": "https://github.com/ThereminGoat/switch-scores/blob/master/NuPhy%20Lemon.pdf"
  },
  {
    "name": "OArmy Green",
    "reviewedAt": "10/9/2022",
    "manufacturer": "Greetech",
    "type": "Clicky",
    "reviewUrl": "https://github.com/ThereminGoat/switch-scores/blob/master/OArmy%20Green.pdf"
  },
  {
    "name": "Obsidian L",
    "reviewedAt": "12/18/2022",
    "manufacturer": "Durock/JWK",
    "type": "Linear",
    "reviewUrl": "https://github.com/ThereminGoat/switch-scores/blob/master/Obsidian%20L.pdf"
  },
  {
    "name": "Obsidian Pro",
    "reviewedAt": "2/20/2022",
    "manufacturer": "Durock/JWK",
    "type": "Linear",
    "reviewUrl": "https://github.com/ThereminGoat/switch-scores/blob/master/Obsidian%20Pro.pdf"
  },
  {
    "name": "Opblack",
    "reviewedAt": "2/13/2020",
    "manufacturer": "Durock/JWK",
    "type": "Linear",
    "reviewUrl": "https://github.com/ThereminGoat/switch-scores/blob/master/Opblack.pdf"
  },
  {
    "name": "Opgrey",
    "reviewedAt": "3/26/2023",
    "manufacturer": "Durock/JWK",
    "type": "Tactile",
    "reviewUrl": "https://github.com/ThereminGoat/switch-scores/blob/master/Opgrey.pdf"
  },
  {
    "name": "Original Aspiration (Release)",
    "reviewedAt": "2/3/2021",
    "manufacturer": "Durock/JWK",
    "type": "Linear",
    "reviewUrl": "https://github.com/ThereminGoat/switch-scores/blob/master/Original%20Aspiration%20(Release).pdf"
  },
  {
    "name": "Original Aspiration (Sample)",
    "reviewedAt": "9/18/2020",
    "manufacturer": "Durock/JWK",
    "type": "Linear",
    "reviewUrl": "https://github.com/ThereminGoat/switch-scores/blob/master/Original%20Aspiration%20(Sample).pdf"
  },
  {
    "name": "Outemu Clear",
    "reviewedAt": "3/26/2023",
    "manufacturer": "Outemu",
    "type": "Clicky",
    "reviewUrl": "https://github.com/ThereminGoat/switch-scores/blob/master/Outemu%20Clear.pdf"
  },
  {
    "name": "Outemu Dustproof Teal",
    "reviewedAt": "10/9/2022",
    "manufacturer": "Outemu",
    "type": "Clicky",
    "reviewUrl": "https://github.com/ThereminGoat/switch-scores/blob/master/Outemu%20Dustproof%20Teal.pdf"
  },
  {
    "name": "Outemu Silent Lemon V3",
    "reviewedAt": "9/8/2024",
    "manufacturer": "Outemu",
    "type": "Silent Tactile",
    "reviewUrl": "https://github.com/ThereminGoat/switch-scores/blob/master/Outemu%20Silent%20Lemon%20V3.pdf"
  },
  {
    "name": "Outemu Silent Peach",
    "reviewedAt": "3/20/2022",
    "manufacturer": "Outemu",
    "type": "Silent Linear",
    "reviewUrl": "https://github.com/ThereminGoat/switch-scores/blob/master/Outemu%20Silent%20Peach.pdf"
  },
  {
    "name": "Outemu Silent Peach V3",
    "reviewedAt": "9/8/2024",
    "manufacturer": "Outemu",
    "type": "Silent Linear",
    "reviewUrl": "https://github.com/ThereminGoat/switch-scores/blob/master/Outemu%20Silent%20Peach%20V3.pdf"
  },
  {
    "name": "Outemu x XCJZ Dopamine",
    "reviewedAt": "6/16/2024",
    "manufacturer": "Outemu",
    "type": "Silent Linear",
    "reviewUrl": "https://github.com/ThereminGoat/switch-scores/blob/master/Outemu%20x%20XCJZ%20Dopamine.pdf"
  },
  {
    "name": "Paigu Mocha Cheese",
    "reviewedAt": "6/16/2024",
    "manufacturer": "Unknown",
    "type": "Linear",
    "reviewUrl": "https://github.com/ThereminGoat/switch-scores/blob/master/Paigu%20Mocha%20Cheese.pdf"
  },
  {
    "name": "PantheonKeys x TTC PT Black",
    "reviewedAt": "3/29/2026",
    "manufacturer": "TTC",
    "type": "Linear",
    "reviewUrl": "https://github.com/ThereminGoat/switch-scores/blob/master/PantheonKeys%20x%20TTC%20PT%20Black.pdf"
  },
  {
    "name": "Pea Flower",
    "reviewedAt": "9/22/2024",
    "manufacturer": "BSUN",
    "type": "Clicky",
    "reviewUrl": "https://github.com/ThereminGoat/switch-scores/blob/master/Pea%20Flower.pdf"
  },
  {
    "name": "Penguins",
    "reviewedAt": "3/26/2023",
    "manufacturer": "Durock/JWK",
    "type": "Tactile",
    "reviewUrl": "https://github.com/ThereminGoat/switch-scores/blob/master/Penguins.pdf"
  },
  {
    "name": "Penyu",
    "reviewedAt": "8/15/2021",
    "manufacturer": "Durock/JWK",
    "type": "Linear",
    "reviewUrl": "https://github.com/ThereminGoat/switch-scores/blob/master/Penyu.pdf"
  },
  {
    "name": "Pewters",
    "reviewedAt": "5/22/2022",
    "manufacturer": "Durock/JWK",
    "type": "Tactile",
    "reviewUrl": "https://github.com/ThereminGoat/switch-scores/blob/master/Pewters.pdf"
  },
  {
    "name": "Popu",
    "reviewedAt": "12/5/2021",
    "manufacturer": "Durock/JWK",
    "type": "Linear",
    "reviewUrl": "https://github.com/ThereminGoat/switch-scores/blob/master/Popu.pdf"
  },
  {
    "name": "Qeeke Begonia (Crabapple)",
    "reviewedAt": "10/21/2023",
    "manufacturer": "Jerrzi",
    "type": "Linear",
    "reviewUrl": "https://github.com/ThereminGoat/switch-scores/blob/master/Qeeke%20Begonia%20(Crabapple).pdf"
  },
  {
    "name": "Quartz",
    "reviewedAt": "8/1/2021",
    "manufacturer": "Durock/JWK",
    "type": "Linear",
    "reviewUrl": "https://github.com/ThereminGoat/switch-scores/blob/master/Quartz.pdf"
  },
  {
    "name": "Queen",
    "reviewedAt": "6/6/2021",
    "manufacturer": "Durock/JWK",
    "type": "Linear",
    "reviewUrl": "https://github.com/ThereminGoat/switch-scores/blob/master/Queen.pdf"
  },
  {
    "name": "Raed",
    "reviewedAt": "4/25/2021",
    "manufacturer": "Tecsee",
    "type": "Linear",
    "reviewUrl": "https://github.com/ThereminGoat/switch-scores/blob/master/Raed.pdf"
  },
  {
    "name": "RAMA WORKS Duck",
    "reviewedAt": "7/24/2022",
    "manufacturer": "Gateron",
    "type": "Linear",
    "reviewUrl": "https://github.com/ThereminGoat/switch-scores/blob/master/RAMA%20WORKS%20Duck.pdf"
  },
  {
    "name": "Raptor MX Extreme",
    "reviewedAt": "5/12/2024",
    "manufacturer": "HMX",
    "type": "Linear",
    "reviewUrl": "https://github.com/ThereminGoat/switch-scores/blob/master/Raptor%20MX%20Extreme.pdf"
  },
  {
    "name": "Red Velvet",
    "reviewedAt": "8/4/2024",
    "manufacturer": "KTT",
    "type": "Silent Tactile",
    "reviewUrl": "https://github.com/ThereminGoat/switch-scores/blob/master/Red%20Velvet.pdf"
  },
  {
    "name": "Redragon Sapphire",
    "reviewedAt": "11/6/2022",
    "manufacturer": "Haimu",
    "type": "Tactile",
    "reviewUrl": "https://github.com/ThereminGoat/switch-scores/blob/master/Redragon%20Sapphire.pdf"
  },
  {
    "name": "RRE Blacks",
    "reviewedAt": "10/24/2021",
    "manufacturer": "Unknown",
    "type": "Linear",
    "reviewUrl": "https://github.com/ThereminGoat/switch-scores/blob/master/RRE%20Black.pdf",
    "scorecardName": "RRE Black"
  },
  {
    "name": "Rubrehose Brown",
    "reviewedAt": "1/8/2023",
    "manufacturer": "Tecsee",
    "type": "Linear",
    "reviewUrl": "https://github.com/ThereminGoat/switch-scores/blob/master/Rubrehose%20Brown.pdf"
  },
  {
    "name": "Sarokeys BCP",
    "reviewedAt": "11/12/2023",
    "manufacturer": "BSUN",
    "type": "Linear",
    "reviewUrl": "https://github.com/ThereminGoat/switch-scores/blob/master/Sarokeys%20BCP.pdf"
  },
  {
    "name": "Seriko",
    "reviewedAt": "8/15/2021",
    "manufacturer": "Durock/JWK",
    "type": "Silent Linear",
    "reviewUrl": "https://github.com/ThereminGoat/switch-scores/blob/master/Seriko.pdf"
  },
  {
    "name": "Shortcut Studio SC",
    "reviewedAt": "5/4/2025",
    "manufacturer": "HMX",
    "type": "Linear",
    "reviewUrl": "https://github.com/ThereminGoat/switch-scores/blob/master/Shortcut%20Studio%20SC.pdf"
  },
  {
    "name": "Sillyworks x Gateron Type R",
    "reviewedAt": "1/12/2025",
    "manufacturer": "Gateron",
    "type": "Tactile",
    "reviewUrl": "https://github.com/ThereminGoat/switch-scores/blob/master/Sillyworks%20x%20Gateron%20Type%20R.pdf"
  },
  {
    "name": "Sillyworks x HMX Waverider V2",
    "reviewedAt": "5/3/2026",
    "manufacturer": "HMX",
    "type": "Tactile",
    "reviewUrl": "https://github.com/ThereminGoat/switch-scores/blob/master/Sillyworks%20x%20HMX%20Waverider%20V2.pdf"
  },
  {
    "name": "Snow Whites",
    "reviewedAt": "5/22/2022",
    "manufacturer": "Durock/JWK",
    "type": "Linear",
    "reviewUrl": "https://github.com/ThereminGoat/switch-scores/blob/master/Snow%20Whites.pdf"
  },
  {
    "name": "SP Star Ayara",
    "reviewedAt": "1/30/2022",
    "manufacturer": "SP Star",
    "type": "Linear",
    "reviewUrl": "https://github.com/ThereminGoat/switch-scores/blob/master/SP%20Star%20Ayara.pdf"
  },
  {
    "name": "SP Star Magic Girl (Classic)",
    "reviewedAt": "3/26/2023",
    "manufacturer": "SP Star",
    "type": "Tactile",
    "reviewUrl": "https://github.com/ThereminGoat/switch-scores/blob/master/SP%20Star%20Magic%20Girl.pdf",
    "scorecardName": "SP Star Magic Girl"
  },
  {
    "name": "SP Star Marble Soda Melon",
    "reviewedAt": "1/16/2022",
    "manufacturer": "SP Star",
    "type": "Linear",
    "reviewUrl": "https://github.com/ThereminGoat/switch-scores/blob/master/SP%20Star%20Marble%20Soda%20Melon.pdf"
  },
  {
    "name": "SP Star Sacramento",
    "reviewedAt": "12/26/2021",
    "manufacturer": "SP Star",
    "type": "Linear",
    "reviewUrl": "https://github.com/ThereminGoat/switch-scores/blob/master/SP%20Star%20Sacramento.pdf"
  },
  {
    "name": "Spring Switch",
    "reviewedAt": "12/17/2023",
    "manufacturer": "BSUN",
    "type": "Linear",
    "reviewUrl": "https://github.com/ThereminGoat/switch-scores/blob/master/Spring%20Switch.pdf"
  },
  {
    "name": "Star Grey",
    "reviewedAt": "8/1/2021",
    "manufacturer": "SP Star",
    "type": "Linear",
    "reviewUrl": "https://github.com/ThereminGoat/switch-scores/blob/master/Star%20Grey.pdf"
  },
  {
    "name": "Star Purple",
    "reviewedAt": "8/1/2021",
    "manufacturer": "SP Star",
    "type": "Tactile",
    "reviewUrl": "https://github.com/ThereminGoat/switch-scores/blob/master/Star%20Purple.pdf"
  },
  {
    "name": "Strawberry Jelly V2",
    "reviewedAt": "6/5/2022",
    "manufacturer": "Huano",
    "type": "Linear",
    "reviewUrl": "https://github.com/ThereminGoat/switch-scores/blob/master/Strawberry%20Jelly%20V2.pdf"
  },
  {
    "name": "SW Cocoblack",
    "reviewedAt": "9/21/2025",
    "manufacturer": "Durock/JWK",
    "type": "Linear",
    "reviewUrl": "https://github.com/ThereminGoat/switch-scores/blob/master/SW%20Cocoblack.pdf"
  },
  {
    "name": "SWK Jieum V2",
    "reviewedAt": "12/3/2023",
    "manufacturer": "SWK",
    "type": "Linear",
    "reviewUrl": "https://github.com/ThereminGoat/switch-scores/blob/master/SWK%20Jieum%20V2.pdf"
  },
  {
    "name": "SWK Ripple",
    "reviewedAt": "9/1/2024",
    "manufacturer": "SWK",
    "type": "Linear",
    "reviewUrl": "https://github.com/ThereminGoat/switch-scores/blob/master/SWK%20Ripple.pdf"
  },
  {
    "name": "Taiwan Jet Axis Yellow",
    "reviewedAt": "8/22/2021",
    "manufacturer": "Unknown",
    "type": "Linear",
    "reviewUrl": "https://github.com/ThereminGoat/switch-scores/blob/master/Taiwan%20Jet%20Axis%20Yellow.pdf"
  },
  {
    "name": "Taro Ball",
    "reviewedAt": "4/25/2021",
    "manufacturer": "Durock/JWK",
    "type": "Tactile",
    "reviewUrl": "https://github.com/ThereminGoat/switch-scores/blob/master/Taro%20Ball.pdf"
  },
  {
    "name": "Taro N Sweet Potato V2",
    "reviewedAt": "4/19/2026",
    "manufacturer": "BSUN",
    "type": "Linear",
    "reviewUrl": "https://github.com/ThereminGoat/switch-scores/blob/master/Taro%20N%20Sweet%20Potato%20V2.pdf"
  },
  {
    "name": "Tecsee Christmas Dolphin",
    "reviewedAt": "3/17/2024",
    "manufacturer": "Tecsee",
    "type": "Linear",
    "reviewUrl": "https://github.com/ThereminGoat/switch-scores/blob/master/Tecsee%20Christmas%20Dolphin.pdf"
  },
  {
    "name": "Tecsee Crystal Lemon",
    "reviewedAt": "3/16/2025",
    "manufacturer": "Tecsee",
    "type": "Tactile",
    "reviewUrl": "https://github.com/ThereminGoat/switch-scores/blob/master/Tecsee%20Crystal%20Lemon.pdf"
  },
  {
    "name": "Tecsee Honey Peach",
    "reviewedAt": "2/18/2024",
    "manufacturer": "Tecsee",
    "type": "Linear",
    "reviewUrl": "https://github.com/ThereminGoat/switch-scores/blob/master/Tecsee%20Honey%20Peach.pdf"
  },
  {
    "name": "Tecsee Ice Milk Tactile",
    "reviewedAt": "6/19/2022",
    "manufacturer": "Tecsee",
    "type": "Tactile",
    "reviewUrl": "https://github.com/ThereminGoat/switch-scores/blob/master/Tecsee%20Ice%20Milk%20Tactile.pdf"
  },
  {
    "name": "Tecsee Middle Switch Tactile",
    "reviewedAt": "10/15/2023",
    "manufacturer": "Tecsee",
    "type": "Tactile",
    "reviewUrl": "https://github.com/ThereminGoat/switch-scores/blob/master/Tecsee%20Middle%20Switch%20Tactile.pdf"
  },
  {
    "name": "Tecsee Purple Panda",
    "reviewedAt": "5/9/2021",
    "manufacturer": "Tecsee",
    "type": "Tactile",
    "reviewUrl": "https://github.com/ThereminGoat/switch-scores/blob/master/Tecsee%20Purple%20Panda.pdf"
  },
  {
    "name": "Tecsee Sapphire",
    "reviewedAt": "3/26/2023",
    "manufacturer": "Tecsee",
    "type": "Tactile",
    "reviewUrl": "https://github.com/ThereminGoat/switch-scores/blob/master/Tecsee%20Sapphire.pdf"
  },
  {
    "name": "Tecsee Sapphire V2",
    "reviewedAt": "9/12/2021",
    "manufacturer": "Tecsee",
    "type": "Tactile",
    "reviewUrl": "https://github.com/ThereminGoat/switch-scores/blob/master/Tecsee%20Sapphire%20V2.pdf"
  },
  {
    "name": "Tecsee Volcano Linear",
    "reviewedAt": "4/6/2025",
    "manufacturer": "Tecsee",
    "type": "Linear",
    "reviewUrl": "https://github.com/ThereminGoat/switch-scores/blob/master/Tecsee%20Volcano%20Linear.pdf"
  },
  {
    "name": "Teton Cream",
    "reviewedAt": "10/9/2022",
    "manufacturer": "Unknown",
    "type": "Linear",
    "reviewUrl": "https://github.com/ThereminGoat/switch-scores/blob/master/Teton%20Cream.pdf"
  },
  {
    "name": "TKC Blackberry",
    "reviewedAt": "9/7/2022",
    "manufacturer": "Tecsee",
    "type": "Clicky",
    "reviewUrl": "https://github.com/ThereminGoat/switch-scores/blob/master/TKC%20Blackberry.pdf"
  },
  {
    "name": "Tsavorite",
    "reviewedAt": "1/30/2022",
    "manufacturer": "Durock/JWK",
    "type": "Linear",
    "reviewUrl": "https://github.com/ThereminGoat/switch-scores/blob/master/Tsavorite.pdf"
  },
  {
    "name": "TTC Blueish White",
    "reviewedAt": "3/26/2023",
    "manufacturer": "TTC",
    "type": "Tactile",
    "reviewUrl": "https://github.com/ThereminGoat/switch-scores/blob/master/TTC%20Blueish%20White.pdf"
  },
  {
    "name": "TTC Brother",
    "reviewedAt": "1/16/2022",
    "manufacturer": "TTC",
    "type": "Clicky",
    "reviewUrl": "https://github.com/ThereminGoat/switch-scores/blob/master/TTC%20Brother.pdf"
  },
  {
    "name": "TTC Brother V2",
    "reviewedAt": "8/1/2026",
    "manufacturer": "TTC",
    "type": "Clicky",
    "reviewUrl": "https://github.com/ThereminGoat/switch-scores/blob/master/TTC%20Brother%20V2.pdf"
  },
  {
    "name": "TTC Gold Pink",
    "reviewedAt": "8/1/2021",
    "manufacturer": "TTC",
    "type": "Linear",
    "reviewUrl": "https://github.com/ThereminGoat/switch-scores/blob/master/TTC%20Gold%20Pink.pdf"
  },
  {
    "name": "TTC L Series Blue",
    "reviewedAt": "2/25/2024",
    "manufacturer": "TTC",
    "type": "Clicky",
    "reviewUrl": "https://github.com/ThereminGoat/switch-scores/blob/master/TTC%20L%20Series%20Blue.pdf"
  },
  {
    "name": "TTC Magnetic Snake White CNY",
    "reviewedAt": "8/3/2025",
    "manufacturer": "TTC",
    "type": "Linear",
    "reviewUrl": "https://github.com/ThereminGoat/switch-scores/blob/master/TTC%20Magnetic%20Snake%20White%20CNY.pdf"
  },
  {
    "name": "TTC Magneto, King of Magnets POM",
    "reviewedAt": "3/16/2025",
    "manufacturer": "TTC",
    "type": "Linear",
    "reviewUrl": "https://github.com/ThereminGoat/switch-scores/blob/master/TTC%20Magneto,%20King%20of%20Magnets%20POM.pdf"
  },
  {
    "name": "TTC Neptune",
    "reviewedAt": "4/23/2023",
    "manufacturer": "TTC",
    "type": "Linear",
    "reviewUrl": "https://github.com/ThereminGoat/switch-scores/blob/master/TTC%20Neptune.pdf"
  },
  {
    "name": "TTC OG Rabbit",
    "reviewedAt": "4/23/2023",
    "manufacturer": "TTC",
    "type": "Silent Linear",
    "reviewUrl": "https://github.com/ThereminGoat/switch-scores/blob/master/TTC%20OG%20Rabbit.pdf"
  },
  {
    "name": "TTC Orange Clicky",
    "reviewedAt": "10/8/2023",
    "manufacturer": "TTC",
    "type": "Clicky",
    "reviewUrl": "https://github.com/ThereminGoat/switch-scores/blob/master/TTC%20Orange%20Clicky.pdf"
  },
  {
    "name": "TTC Peanut Latte",
    "reviewedAt": "9/22/2024",
    "manufacturer": "TTC",
    "type": "Silent Tactile",
    "reviewUrl": "https://github.com/ThereminGoat/switch-scores/blob/master/TTC%20Peanut%20Latte.pdf"
  },
  {
    "name": "TTC Razer Dustproof Green",
    "reviewedAt": "10/9/2022",
    "manufacturer": "TTC",
    "type": "Clicky",
    "reviewUrl": "https://github.com/ThereminGoat/switch-scores/blob/master/TTC%20Razer%20Dustproof%20Green.pdf"
  },
  {
    "name": "TTC Razer Dustproof Orange",
    "reviewedAt": "10/9/2022",
    "manufacturer": "TTC",
    "type": "Tactile",
    "reviewUrl": "https://github.com/ThereminGoat/switch-scores/blob/master/TTC%20Razer%20Dustproof%20Orange.pdf"
  },
  {
    "name": "TTC Razer Dustproof Yellow",
    "reviewedAt": "10/9/2022",
    "manufacturer": "TTC",
    "type": "Linear",
    "reviewUrl": "https://github.com/ThereminGoat/switch-scores/blob/master/TTC%20Razer%20Dustproof%20Yellow.pdf"
  },
  {
    "name": "TTC Speed Gold V2",
    "reviewedAt": "4/6/2025",
    "manufacturer": "TTC",
    "type": "Linear",
    "reviewUrl": "https://github.com/ThereminGoat/switch-scores/blob/master/TTC%20Speed%20Gold%20V2.pdf"
  },
  {
    "name": "TTC Tiger",
    "reviewedAt": "5/15/2022",
    "manufacturer": "TTC",
    "type": "Linear",
    "reviewUrl": "https://github.com/ThereminGoat/switch-scores/blob/master/TTC%20Tiger.pdf"
  },
  {
    "name": "TTC Wild (42g.)",
    "reviewedAt": "9/5/2021",
    "manufacturer": "TTC",
    "type": "Linear",
    "reviewUrl": "https://github.com/ThereminGoat/switch-scores/blob/master/TTC%20Wild%2042g.pdf",
    "scorecardName": "TTC Wild 42g"
  },
  {
    "name": "TTC x Helix Lab Skylar",
    "reviewedAt": "3/26/2023",
    "manufacturer": "TTC",
    "type": "Clicky",
    "reviewUrl": "https://github.com/ThereminGoat/switch-scores/blob/master/TTC%20x%20Helix%20Lab%20Skylar.pdf"
  },
  {
    "name": "U4T (62g)",
    "reviewedAt": "3/26/2023",
    "manufacturer": "Outemu",
    "type": "Tactile",
    "reviewUrl": "https://github.com/ThereminGoat/switch-scores/blob/master/U4T%20(62g).pdf"
  },
  {
    "name": "Unionwell Polar Magnetic Pro+",
    "reviewedAt": "12/14/2025",
    "manufacturer": "Greetech",
    "type": "Linear",
    "reviewUrl": "https://github.com/ThereminGoat/switch-scores/blob/master/Unionwell%20Polar%20Magnetic%20Pro%2B.pdf"
  },
  {
    "name": "Unionwell Xueyao",
    "reviewedAt": "7/26/2026",
    "manufacturer": "Greetech",
    "type": "Linear",
    "reviewUrl": "https://github.com/ThereminGoat/switch-scores/blob/master/Unionwell%20Xueyao.pdf"
  },
  {
    "name": "Varmilo EC V2 Daisy",
    "reviewedAt": "10/21/2023",
    "manufacturer": "Unknown",
    "type": "Linear",
    "reviewUrl": "https://github.com/ThereminGoat/switch-scores/blob/master/Varmilo%20EC%20V2%20Daisy.pdf"
  },
  {
    "name": "Varmilo EC V2 Rose",
    "reviewedAt": "10/21/2023",
    "manufacturer": "Unknown",
    "type": "Linear",
    "reviewUrl": "https://github.com/ThereminGoat/switch-scores/blob/master/Varmilo%20EC%20V2%20Rose.pdf"
  },
  {
    "name": "Varmilo EC V2 Sakura",
    "reviewedAt": "10/21/2023",
    "manufacturer": "Unknown",
    "type": "Linear",
    "reviewUrl": "https://github.com/ThereminGoat/switch-scores/blob/master/Varmilo%20EC%20V2%20Sakura.pdf"
  },
  {
    "name": "Varmilo Ivy L",
    "reviewedAt": "12/22/2024",
    "manufacturer": "LICHICX",
    "type": "Clicky",
    "reviewUrl": "https://github.com/ThereminGoat/switch-scores/blob/master/Varmilo%20Ivy%20L.pdf"
  },
  {
    "name": "Vertex V1 (Unlubed)",
    "reviewedAt": "7/23/2023",
    "manufacturer": "Durock/JWK",
    "type": "Linear",
    "reviewUrl": "https://github.com/ThereminGoat/switch-scores/blob/master/Vertex%20V1.pdf",
    "scorecardName": "Vertex V1"
  },
  {
    "name": "WEKT Lucy R5",
    "reviewedAt": "3/15/2026",
    "manufacturer": "WEKT",
    "type": "Silent Linear",
    "reviewUrl": "https://github.com/ThereminGoat/switch-scores/blob/master/WEKT%20Lucy%20R5.pdf"
  },
  {
    "name": "WEKT Nafu",
    "reviewedAt": "6/28/2026",
    "manufacturer": "WEKT",
    "type": "Silent Linear",
    "reviewUrl": "https://github.com/ThereminGoat/switch-scores/blob/master/WEKT%20Nafu.pdf"
  },
  {
    "name": "Wingtree 277",
    "reviewedAt": "1/11/2026",
    "manufacturer": "Wingtree",
    "type": "Linear",
    "reviewUrl": "https://github.com/ThereminGoat/switch-scores/blob/master/Wingtree%20277.pdf"
  },
  {
    "name": "Wingtree BM11",
    "reviewedAt": "4/12/2026",
    "manufacturer": "Wingtree",
    "type": "Tactile",
    "reviewUrl": "https://github.com/ThereminGoat/switch-scores/blob/master/Wingtree%20BM11.pdf"
  },
  {
    "name": "Wingtree Camellia (52g)",
    "reviewedAt": "4/26/2026",
    "manufacturer": "Wingtree",
    "type": "Linear",
    "reviewUrl": "https://github.com/ThereminGoat/switch-scores/blob/master/Wingtree%20Camellia%20(52g).pdf"
  },
  {
    "name": "Wingtree Coral",
    "reviewedAt": "4/26/2026",
    "manufacturer": "Wingtree",
    "type": "Linear",
    "reviewUrl": "https://github.com/ThereminGoat/switch-scores/blob/master/Wingtree%20Coral.pdf"
  },
  {
    "name": "Wingtree Jadeite",
    "reviewedAt": "7/12/2026",
    "manufacturer": "Wingtree",
    "type": "Linear",
    "reviewUrl": "https://github.com/ThereminGoat/switch-scores/blob/master/Wingtree%20Jadeite.pdf"
  },
  {
    "name": "Wingtree Nezuko (Dry, 55g)",
    "reviewedAt": "9/20/2026",
    "manufacturer": "Wingtree",
    "type": "Linear",
    "reviewUrl": "https://github.com/ThereminGoat/switch-scores/blob/master/Wingtree%20Nezuko%20(Dry,%2055g).pdf"
  },
  {
    "name": "Wingtree Pink Pink",
    "reviewedAt": "5/17/2026",
    "manufacturer": "Wingtree",
    "type": "Silent Linear",
    "reviewUrl": "https://github.com/ThereminGoat/switch-scores/blob/master/Wingtree%20Pink%20Pink.pdf"
  },
  {
    "name": "Wingtree Torrero",
    "reviewedAt": "9/6/2026",
    "manufacturer": "Wingtree",
    "type": "Tactile",
    "reviewUrl": "https://github.com/ThereminGoat/switch-scores/blob/master/Wingtree%20Torrero.pdf"
  },
  {
    "name": "Wingtree x LICHICX Orange",
    "reviewedAt": "9/20/2026",
    "manufacturer": "Wingtree",
    "type": "Silent Tactile",
    "reviewUrl": "https://github.com/ThereminGoat/switch-scores/blob/master/Wingtree%20x%20LICHICX%20Orange.pdf"
  },
  {
    "name": "Wingtree x LICHICX Yamatake",
    "reviewedAt": "5/10/2026",
    "manufacturer": "Wingtree",
    "type": "Silent Tactile",
    "reviewUrl": "https://github.com/ThereminGoat/switch-scores/blob/master/Wingtree%20x%20LICHICX%20Yamatake.pdf"
  },
  {
    "name": "Wingtree Yuci HE",
    "reviewedAt": "11/30/2025",
    "manufacturer": "Co-Gain/XUDA",
    "type": "Linear",
    "reviewUrl": "https://github.com/ThereminGoat/switch-scores/blob/master/Wingtree%20Yuci%20HE.pdf"
  },
  {
    "name": "Winkeyless.KR Zeal Clear",
    "reviewedAt": "11/14/2021",
    "manufacturer": "Gateron",
    "type": "Tactile",
    "reviewUrl": "https://github.com/ThereminGoat/switch-scores/blob/master/WinkeylessKR%20Zeal%20Clear.pdf",
    "scorecardName": "WinkeylessKR Zeal Clear"
  },
  {
    "name": "WS Arowana Red",
    "reviewedAt": "6/8/2025",
    "manufacturer": "HMX",
    "type": "Linear",
    "reviewUrl": "https://github.com/ThereminGoat/switch-scores/blob/master/WS%20Arowana%20Red.pdf"
  },
  {
    "name": "WS Flux HE",
    "reviewedAt": "4/27/2025",
    "manufacturer": "K2",
    "type": "Linear",
    "reviewUrl": "https://github.com/ThereminGoat/switch-scores/blob/master/WS%20Flux%20HE.pdf"
  },
  {
    "name": "Wuque Light Tactile",
    "reviewedAt": "6/16/2024",
    "manufacturer": "Haimu",
    "type": "Tactile",
    "reviewUrl": "https://github.com/ThereminGoat/switch-scores/blob/master/Wuque%20Light%20Tactile.pdf"
  },
  {
    "name": "Wuque Studio Morandi",
    "reviewedAt": "3/19/2023",
    "manufacturer": "Haimu",
    "type": "Linear",
    "reviewUrl": "https://github.com/ThereminGoat/switch-scores/blob/master/Wuque%20Studio%20Morandi.pdf"
  },
  {
    "name": "Wuque Studio Onion",
    "reviewedAt": "3/27/2022",
    "manufacturer": "Durock/JWK",
    "type": "Linear",
    "reviewUrl": "https://github.com/ThereminGoat/switch-scores/blob/master/Wuque%20Studio%20Onion.pdf"
  },
  {
    "name": "Wuque WS POM+",
    "reviewedAt": "8/18/2024",
    "manufacturer": "Gateron",
    "type": "Linear",
    "reviewUrl": "https://github.com/ThereminGoat/switch-scores/blob/master/Wuque%20WS%20POM%2B.pdf"
  },
  {
    "name": "XCJZ Green Tea",
    "reviewedAt": "5/25/2025",
    "manufacturer": "LICHICX",
    "type": "Tactile",
    "reviewUrl": "https://github.com/ThereminGoat/switch-scores/blob/master/XCJZ%20Green%20Tea.pdf"
  },
  {
    "name": "XCJZ Jerrzi Lotus Stem",
    "reviewedAt": "10/21/2023",
    "manufacturer": "Jerrzi",
    "type": "Clicky",
    "reviewUrl": "https://github.com/ThereminGoat/switch-scores/blob/master/XCJZ%20Jerrzi%20Lotus%20Stem.pdf"
  },
  {
    "name": "XCJZ x KTT Ice Orange Silent",
    "reviewedAt": "3/22/2026",
    "manufacturer": "KTT",
    "type": "Silent Linear",
    "reviewUrl": "https://github.com/ThereminGoat/switch-scores/blob/master/XCJZ%20x%20KTT%20Ice%20Orange%20Silent.pdf"
  },
  {
    "name": "Zaku II",
    "reviewedAt": "12/10/2023",
    "manufacturer": "Tecsee",
    "type": "Tactile",
    "reviewUrl": "https://github.com/ThereminGoat/switch-scores/blob/master/Zaku%20II.pdf"
  },
  {
    "name": "Zeal Clickiez 75g. (Clicky)",
    "reviewedAt": "7/10/2022",
    "manufacturer": "Gateron",
    "type": "Clicky",
    "reviewUrl": "https://github.com/ThereminGoat/switch-scores/blob/master/Zeal%20Clickiez%2075g.%20(Clicky).pdf"
  },
  {
    "name": "Zeal Clickiez 75g. (Linear)",
    "reviewedAt": "7/10/2022",
    "manufacturer": "Gateron",
    "type": "Linear",
    "reviewUrl": "https://github.com/ThereminGoat/switch-scores/blob/master/Zeal%20Clickiez%2075g.%20(Linear).pdf"
  },
  {
    "name": "Zeal Clickiez 75g. (Tactile)",
    "reviewedAt": "7/10/2022",
    "manufacturer": "Gateron",
    "type": "Tactile",
    "reviewUrl": "https://github.com/ThereminGoat/switch-scores/blob/master/Zeal%20Clickiez%2075g.%20(Tactile).pdf"
  },
  {
    "name": "Zeal Crystal",
    "reviewedAt": "7/3/2022",
    "manufacturer": "Gateron",
    "type": "Tactile",
    "reviewUrl": "https://github.com/ThereminGoat/switch-scores/blob/master/Zeal%20Crystal.pdf"
  },
  {
    "name": "Zeal Pearlio",
    "reviewedAt": "7/3/2022",
    "manufacturer": "Gateron",
    "type": "Linear",
    "reviewUrl": "https://github.com/ThereminGoat/switch-scores/blob/master/Zeal%20Pearlio.pdf"
  },
  {
    "name": "Zealio V1 Redux (62g)",
    "reviewedAt": "11/28/2021",
    "manufacturer": "Gateron",
    "type": "Tactile",
    "reviewUrl": "https://github.com/ThereminGoat/switch-scores/blob/master/Zealio%20V1%20Redux%20(62g).pdf"
  },
  {
    "name": "Zealios V1 Linear",
    "reviewedAt": "11/7/2021",
    "manufacturer": "Gateron",
    "type": "Linear",
    "reviewUrl": "https://github.com/ThereminGoat/switch-scores/blob/master/Zealios%20V1%20Linear.pdf"
  },
  {
    "name": "Zoch Flame Shadow",
    "reviewedAt": "7/6/2025",
    "manufacturer": "KTT",
    "type": "Clicky",
    "reviewUrl": "https://github.com/ThereminGoat/switch-scores/blob/master/Zoch%20Flame%20Shadow.pdf"
  },
  {
    "name": "Zuoce Litchi Milk",
    "reviewedAt": "5/25/2025",
    "manufacturer": "Unknown",
    "type": "Tactile",
    "reviewUrl": "https://github.com/ThereminGoat/switch-scores/blob/master/Zuoce%20Litchi%20Milk.pdf"
  }
];
