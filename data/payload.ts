export interface Payload {
  id: number;
  title: string;
  englishTitle: string;
  chorus: string[];
  verses: string[];
}
let placeholder = {
  id: 0,
  title: "",
  englishTitle: "",
  chorus: [],
  verses: [],
};

export const payload: Payload[] = [
  {
    id: 1,
    title: "Kilose Jehovah nguno",
    englishTitle: "Praise god from whom al blessing flow",
    chorus: [],
    verses: [
      `Kilosu Jehovah nguno
Ne konech kaberurennyi.
Kilosu Kwanda ak Jesu,
Ak Tamirmiriet ne Tilil.`,
    ],
  },
  {
    id: 2,
    title: "Kilosu Kwandanyo",
    englishTitle: "",
    chorus: [],
    verses: [
      `Kilosu Kwandanyo,
       Werit ak tamirmiryet ne Tilil
        Kit ne ki u eng' ta-u-net
         Nguno ak eng'che bwanei
          Agoi koigeny! Amen  Amen`,
    ],
  },
  {
    id: 3,
    title: `OTIENJIN KIPTAIYANDENYON`,
    englishTitle: "",
    chorus: [],
    verses: [
      `
Otienji Kiptaiyandennyo,
Okwek tugul che omi ng'ony;
Olosu Ine kotugul;
Obwanji si ogasge kot.`,
      `Kamukta-indet Jehovah,
Kiyaech Ine Inegei.
Mestowondennyo Inendet;
Ba-ech amu ki akwennyi.`,
      `Obwa olosu Jehovah,
Orikyi oboibo-itu;
Olosu Inendet agoi,
Amu kararan Kiturnennyi`,
      `Toror Kiptaiyat Jehovah,
Mabegu chamnyennyi ne o.
Kimen ng'alekyik kotugul,
Ma walaksei; tebyei koigeny.`,
    ],
  },
  {
    id: 4,
    title: "Kilosun Jehovah Mising",
    englishTitle: "All hail the power",
    chorus: [],
    verses: [
      ` Kilosun, Jehovah, mising':
Kilosu Wering'ung',
Kiptaiyandet ne Yetindet
Ne bo ng'oony komugul.
Kiptaiyandet ne Yetindet
Ne bo ng'ony ko-mugul.`,

      `Kongoi mising' kot. Jehovah,
Kilosun, Kwandanyo,
Amu ki yokwech We-ring'ung'
Komechi bik tugul.
Amu ki yokwech We-ring'ung',
Komechi bik tugul.`,
      `Kongoi Jesu Kristo,
Weritab Jehovah;
I Choruennyo ne cha-mech kot;
1 Kosobindennyo.
I Choruennyo ne cha-mech kot;
I Kosobi-ndennyo.`,

      ` Kilosun. Jehovah. mising'.
Kilosu Wering'ung'.
Ak Tamirmiriet ne Tilil.
Kanaiga-indennvo
`,
    ],
  },
  {
    id: 5,
    title: "Kigaktoin kiptaiyandet",
    englishTitle: "",
    chorus: [],
    verses: [
      `Kigakto-in, Kiptaiyandet,
Eng' betusiek tugul; Kimang'un,
Inye, kotugul, Koboch eng' tai, agoi.`,

      ` Ki ribotin, achek, biguk
Eng' eung'ung' ne kim;
Matwa-ech kiy ye inamech,
Kamukta-indennyo.`,

      `Ye kingotom iyai ng'onyut,
Emet ak tulonok,
Ko ki-imite koboch keny,
Ak imite koigeny.`,
      `U betunak eng' Jehovah
Kenyisiekyok tugul.
Chokta betusiekyok
eng ng'ony Isib kogesugei.`,
      `'Netech ki-it betusiekyok
Asi mabetyo buch;
Konech keboisie-un komie
Kota kemite ng'ony.
`,
    ],
  },
  {
    id: 109,
    title: "JESU, I RUANDET NE KIM",
    englishTitle: "Rock of ages",

    chorus: [],
    verses: [
      `Jesu, I Ruandet ne Kim -
        Inye ne amwechini.
        I-ngouna  korotik
        Che kibun karastang'ung
      Amu mami or age -
        Korotiguk ichegei.`,

      ` Mami kiy ne tos ayai
        Si kowong'gei tengekto.
        Ama tilei Kiy rirek
        Agobo chalwoktanyu.
        Mamuchi ayaakta kiy-
        Inyege ne isorua.`,
      ` Mami kiy ne agonin;
        Amang'un Inye kityo.
        Ka-anyo ilaaksewa;
        Tugena imandang'ung'.
        Amwe-u eng' ya-ityo;
        Asomin irirena.`,

      `Ye igesgei bandanyu
        AK aitu oldang'ung',
        Alosun, Yetindennyu,
        Amu Ki-irirena.
        Jesu, I Ruandet ne Kim
        Inye ne amwechini.
Ak Tamirmiriet ne Tilil.`,
    ],
  },
];
