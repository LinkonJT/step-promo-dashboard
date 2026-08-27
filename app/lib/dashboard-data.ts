// TEMPORARY DATA — mirrors the "Dashboard" tab of the Balance Sheet.
// When the Google Sheets API is wired up, only this file changes.
// The types below stay identical, so no UI code needs touching.

export type HeadlineNumbers = {
  balanceToShip: number;
  readyStock: number;
  needToMake: number;
  fabricRequired: number;
  shippableNow: number;
  surplusStock: number;
};

export type ArticleRow = {
  article: string;
  balance: number;
  readyStock: number;
  surplus: number;
  needToMake: number;
  fabricRequired: number;
};

export const headline: HeadlineNumbers = {
  balanceToShip: 161530,
  readyStock: 84560,
  needToMake: 77685,
  fabricRequired: 27046,
  shippableNow: 83845,
  surplusStock: 715,
};

export const articles: ArticleRow[] = [
  { article: "TBUSB50",   balance: 83550, readyStock: 29625, surplus: 325, needToMake: 54250, fabricRequired: 17306.3 },
  { article: "TBUSB800",  balance: 10860, readyStock: 1920,  surplus: 60,  needToMake: 9000,  fabricRequired: 2871.1 },
  { article: "TBUSB800G", balance: 7470,  readyStock: 5490,  surplus: 40,  needToMake: 2020,  fabricRequired: 689.0 },
  { article: "TBUSB516G", balance: 4500,  readyStock: 175,   surplus: 150, needToMake: 4475,  fabricRequired: 1526.9 },
  { article: "TBUSB124",  balance: 41280, readyStock: 39100, surplus: 120, needToMake: 2300,  fabricRequired: 910.0 },
  { article: "TBUSB25",   balance: 500,   readyStock: 75,    surplus: 0,   needToMake: 425,   fabricRequired: 126.0 },
  { article: "APRSB17",   balance: 550,   readyStock: 175,   surplus: 0,   needToMake: 375,   fabricRequired: 156.3 },
  { article: "APRK501",   balance: 11460, readyStock: 7840,  surplus: 0,   needToMake: 3620,  fabricRequired: 2596.4 },
  { article: "APR701",    balance: 1360,  readyStock: 160,   surplus: 20,  needToMake: 1220,  fabricRequired: 863.8 },
];

